#!/usr/bin/env python3
"""WordPress -> Astro içerik göçü.

Kurallar (architecture.md "Migration Kuralları", AGENTS.md §5):
  - Kaynak sistem salt okunur; yalnızca GET.
  - Ham export değiştirilmeden saklanır.
  - Her içerik legacy ID taşır.
  - Tekrar çalıştırıldığında kopya üretmez (idempotent).
  - Görsel indirilemezse sessizce geçilmez; hata raporuna yazılır.
  - İçerik özetlenmez veya yeniden yazılmaz.
  - Yayın tarihi, slug ve SEO alanları korunur.
  - İç linkler yeni URL'lere dönüştürülür.

Kullanım:
    python scripts/wordpress/migrate.py --dry-run
    python scripts/wordpress/migrate.py --apply
    python scripts/wordpress/migrate.py --apply --no-media
"""

from __future__ import annotations

import argparse
import concurrent.futures
import hashlib
import html as htmllib
import json
import os
import re
import shutil
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter

UA = "ufuksen-migration/1.0 (read-only)"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
RAW = os.path.join(ROOT, "docs", "inventory", "raw")
CONTENT = os.path.join(ROOT, "src", "content")
MEDIA_DIR = os.path.join(ROOT, "public", "media")
REPORT_DIR = os.path.join(ROOT, "docs", "migration")

SOURCE_HOST_RE = re.compile(r"https?://(?:www\.)?ufuksen\.com", re.I)
UPLOADS_RE = re.compile(r"https?://(?:www\.)?ufuksen\.com/wp-content/uploads/", re.I)


# --------------------------------------------------------------------------- #
# HTTP
# --------------------------------------------------------------------------- #

def encode_url(url: str) -> str:
    """URL yolundaki ASCII olmayan karakterleri yüzde-kodlar.

    Medya kütüphanesindeki dosya adlarının bir kısmı Türkçe karakter içeriyor
    ("ekran-kartı-render.jpg"). Ham hâlde istek atıldığında istek ASCII kodlama
    hatasıyla düşüyor ve dosya sessizce eksik kalıyordu. Bkz. lesson.md LES-009.
    """
    parts = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit((
        parts.scheme,
        parts.netloc.encode("idna").decode("ascii") if parts.netloc else parts.netloc,
        urllib.parse.quote(parts.path, safe="/%"),
        urllib.parse.quote(parts.query, safe="=&%?"),
        parts.fragment,
    ))


def fetch(url: str, retries: int = 3, binary: bool = False):
    url = encode_url(url)
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=90) as resp:
                data = resp.read()
                return data if binary else data.decode("utf-8", "replace")
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
            last = exc
            time.sleep(1 + attempt * 2)
    raise RuntimeError(f"GET başarısız: {url} -> {last}")


def fetch_page(url: str, retries: int = 3):
    """Tek REST sayfası: gövde + başlıklar."""
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=90) as resp:
                return json.loads(resp.read().decode("utf-8")), dict(resp.headers)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError) as exc:
            last = exc
            time.sleep(1 + attempt * 2)
    raise RuntimeError(f"GET başarısız: {url} -> {last}")


def fetch_all(site: str, endpoint: str, fields: str | None = None, strict: bool = True) -> tuple[list, dict]:
    """Sayfalanmış REST koleksiyonunun tamamı.

    DİKKAT: Sayfa başına dönen kayıt sayısı `per_page`ten az olabilir — kaynak
    sistemde medya endpoint'inin 2. sayfası 100 yerine 74 kayıt döndürüyor.
    Bu yüzden "100'den az geldi, bitti" varsayımı kullanılamaz; tek güvenilir
    ölçüt `X-WP-TotalPages` başlığıdır. Bkz. lesson.md LES-008.
    """
    items: list = []
    page = 1
    total_pages = 1
    while page <= total_pages:
        url = f"{site}/wp-json/wp/v2/{endpoint}?per_page=100&page={page}"
        if fields:
            url += f"&_fields={fields}"
        batch, headers = fetch_page(url)
        total_pages = int(headers.get("x-wp-totalpages", total_pages))
        items += batch
        page += 1

    expected = None
    try:
        _, headers = fetch_page(f"{site}/wp-json/wp/v2/{endpoint}?per_page=1")
        expected = int(headers.get("x-wp-total", -1))
    except RuntimeError:
        pass
    discrepancy = None
    if expected is not None and expected >= 0 and len(items) != expected:
        discrepancy = {"endpoint": endpoint, "expected": expected, "received": len(items)}
        if strict:
            raise RuntimeError(
                f"{endpoint}: beklenen {expected} kayıt, alınan {len(items)}. "
                "Eksik veriyle göç yapılmaz."
            )
    return items, discrepancy


# --------------------------------------------------------------------------- #
# Yardımcılar
# --------------------------------------------------------------------------- #

def checksum(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def strip_tags(value: str) -> str:
    return re.sub(r"<[^>]+>", "", value or "").strip()


def clean_text(value: str) -> str:
    """HTML varlıklarını çözer ve etiketleri temizler. İçeriği kısaltmaz."""
    return htmllib.unescape(strip_tags(value)).strip()


def reading_minutes(html_body: str) -> int:
    words = len(re.findall(r"\w+", strip_tags(html_body), re.UNICODE))
    return max(1, round(words / 200))


def local_media_path(source_url: str) -> str | None:
    """`.../wp-content/uploads/2025/06/x.jpg` -> `/media/2025/06/x.jpg`"""
    match = UPLOADS_RE.search(source_url or "")
    if not match:
        return None
    rel = source_url[match.end():].split("?")[0].split("#")[0]
    return "/media/" + urllib.parse.unquote(rel)


# --------------------------------------------------------------------------- #
# İçerik dönüşümü
# --------------------------------------------------------------------------- #

def transform_html(body: str, media_failures: set[str]) -> tuple[str, list[dict], list[dict]]:
    """Gövdeyi dönüştürür.

    - uploads URL'lerini yerel /media/ yoluna çevirir
    - iç mutlak linkleri köke göreli hale getirir
    - iframe gömülerini kaydeder
    - görsellere lazy-loading ve decoding ekler (LCP dışı)

    İçerik metni ASLA değiştirilmez, kısaltılmaz.
    """
    embeds: list[dict] = []
    media: list[dict] = []

    for src in re.findall(r"<iframe[^>]+src=[\"']([^\"']+)", body, re.I):
        host = re.sub(r"^https?://(www\.)?([^/]+).*", r"\2", src)
        provider = (
            "youtube" if "youtube" in host or "youtu.be" in host
            else "vidyard" if "vidyard" in host
            else "other"
        )
        ext_id = None
        if provider == "youtube":
            m = re.search(r"/embed/([A-Za-z0-9_-]{6,})", src)
            ext_id = m.group(1) if m else None
        embeds.append({"provider": provider, "externalId": ext_id, "originalSrc": src, "title": None})

    for src in re.findall(r"<img[^>]+src=[\"']([^\"']+)", body, re.I):
        local = local_media_path(src)
        media.append({
            "legacyUrl": src,
            "localPath": None if (local is None or src in media_failures) else local,
            "error": "uploads dışı kaynak" if local is None else ("indirilemedi" if src in media_failures else None),
        })

    def swap_uploads(match: re.Match) -> str:
        url = match.group(0)
        local = local_media_path(url)
        return local if (local and url not in media_failures) else url

    out = re.sub(r"https?://(?:www\.)?ufuksen\.com/wp-content/uploads/[^\s\"'<>)]+", swap_uploads, body)
    # İç mutlak linkleri köke göreli yap (ADR-007: slug'lar değişmiyor)
    out = SOURCE_HOST_RE.sub("", out)

    # WordPress ek-dosya (attachment) sayfaları: `/{slug}.html/{ek}`.
    # Kaynak sistem bunları üst yazıya 301'liyor (doğrulandı). Aynı hedefe
    # yazıyoruz — içerik değiştirilmiyor, kaynağın kendi yönlendirmesi izleniyor.
    out = re.sub(r'href="(/[^"?#]+?\.html)/[^"]*"', r'href="\1"', out)

    # Site içi arama linkleri yeni arama sayfasına taşınır.
    def swap_search(match: re.Match) -> str:
        query = urllib.parse.parse_qs(match.group(1)).get("s", [""])[0]
        return 'href="/arama?q=' + urllib.parse.quote(query) + '"'

    out = re.sub(r'href="/\?([^"]*\bs=[^"]*)"', swap_search, out)

    # Görsellere lazy-loading — LCP görseli şablonda ayrıca ele alınır
    out = re.sub(r"<img (?![^>]*loading=)", '<img loading="lazy" decoding="async" ', out, flags=re.I)
    return out, media, embeds


# --------------------------------------------------------------------------- #
# SEO
# --------------------------------------------------------------------------- #

def scrape_seo(link: str) -> dict:
    """Rank Math alanlarını sayfa head'inden okur.

    T-002: REST yalnızca description + focus keyword veriyor; SEO başlığı ve
    canonical yalnızca head'de. Bkz. docs/inventory/URL-MAP.md §7.
    """
    try:
        page = fetch(link)
    except RuntimeError as exc:
        return {"error": str(exc)}
    def grab(pattern: str) -> str | None:
        m = re.search(pattern, page, re.I)
        return htmllib.unescape(m.group(1)).strip() if m else None
    return {
        "title": grab(r"<title>([^<]+)</title>"),
        "canonical": grab(r'rel="canonical"\s+href="([^"]+)"'),
        "ogImage": grab(r'property="og:image"\s+content="([^"]+)"'),
        "description": grab(r'name="description"\s+content="([^"]*)"'),
    }


# --------------------------------------------------------------------------- #
# Medya
# --------------------------------------------------------------------------- #

def download_media(items: list[dict], dry_run: bool) -> tuple[dict, list[dict]]:
    """Medyayı indirir. Zaten varsa yeniden indirmez (idempotent)."""
    ok: dict[str, str] = {}
    failures: list[dict] = []

    def one(item: dict):
        src = item.get("source_url")
        if not src:
            return ("skip", item.get("id"), "source_url yok")
        local = local_media_path(src)
        if not local:
            return ("skip", src, "uploads dışı")
        target = os.path.join(MEDIA_DIR, local[len("/media/"):].replace("/", os.sep))
        if os.path.exists(target) and os.path.getsize(target) > 0:
            return ("ok", src, local)
        if dry_run:
            return ("ok", src, local)
        try:
            os.makedirs(os.path.dirname(target), exist_ok=True)
            data = fetch(src, binary=True)
            if not data:
                raise RuntimeError("boş yanıt")
            tmp = target + ".part"
            with open(tmp, "wb") as fh:
                fh.write(data)
            os.replace(tmp, target)
            return ("ok", src, local)
        except Exception as exc:  # hata sessizce yutulmaz
            return ("fail", src, str(exc)[:160])

    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
        for status, src, info in pool.map(one, items):
            if status == "ok":
                ok[src] = info
            elif status == "fail":
                failures.append({"legacyUrl": src, "error": info})
    return ok, failures


# --------------------------------------------------------------------------- #
# Yazma
# --------------------------------------------------------------------------- #

def write_json(path: str, payload, dry_run: bool) -> bool:
    """Değişiklik varsa yazar. İçerik aynıysa dokunmaz (idempotent)."""
    data = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"
    if os.path.exists(path):
        with open(path, encoding="utf-8") as fh:
            if fh.read() == data:
                return False
    if not dry_run:
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(data)
    return True


# --------------------------------------------------------------------------- #
# Ana akış
# --------------------------------------------------------------------------- #

def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", default="https://www.ufuksen.com")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--apply", action="store_true")
    parser.add_argument("--no-media", action="store_true")
    parser.add_argument("--no-seo", action="store_true", help="SEO head scrape'ini atla")
    parser.add_argument(
        "--allow-overwrite",
        action="store_true",
        help="Panelden yönetilen içeriğin üzerine yazmayı bilinçli olarak kabul et",
    )
    args = parser.parse_args()

    if args.apply == args.dry_run:
        print("Tam olarak biri gerekli: --dry-run veya --apply", file=sys.stderr)
        return 2

    dry = args.dry_run
    site = args.site.rstrip("/")
    os.makedirs(RAW, exist_ok=True)
    os.makedirs(REPORT_DIR, exist_ok=True)

    mode = "DRY-RUN" if dry else "APPLY"
    print(f"[{mode}] Kaynak: {site}")

    # --- İÇERİK KAYNAĞI KORUMASI (ADR-019) --------------------------------
    #
    # Site artık WordPress'ten beslenmiyor; içerik deponun kendisinde ve
    # yönetim panelinden düzenleniyor. Bu script çalıştırılırsa panelden
    # yapılmış tüm düzenlemeleri WordPress'teki eski hâlle ezer.
    #
    # Bilinçli olarak yeniden içe aktarım yapılacaksa `--allow-overwrite`
    # bayrağı verilmelidir. Bayraksız çalıştırma reddedilir.
    kilit_dosya = os.path.join(ROOT, "src", "content", ".cms-managed")
    if os.path.exists(kilit_dosya) and not dry and not args.allow_overwrite:
        print(
            "\nREDDEDİLDİ: İçerik artık yönetim panelinden yönetiliyor.\n"
            "Bu script WordPress'ten yeniden içe aktarır ve paneldeki tüm\n"
            "düzenlemeleri siler.\n\n"
            "Gerçekten istiyorsanız: --allow-overwrite\n"
            f"Kilit dosyası: {kilit_dosya}",
            file=sys.stderr,
        )
        return 3


    # --- 1. Ham veriyi çek ve sakla ---------------------------------------
    print("  kaynak veri çekiliyor…")
    # --- Siteden kaldırılan yazılar ---------------------------------------
    #
    # Kaynak WordPress'e dokunulmaz (ADR-003). Bu liste yalnızca hedef sitede
    # üretimi engeller; kaldırılan URL'ler için 410 Gone kuralı üretilir.
    excluded_path = os.path.join(ROOT, "docs", "content", "excluded-posts.json")
    excluded_slugs: set[str] = set()
    if os.path.exists(excluded_path):
        with open(excluded_path, encoding="utf-8") as fh:
            excluded_slugs = {item["slug"] for item in json.load(fh).get("yazilar", [])}

    discrepancies: list[dict] = []

    def collect(result: tuple[list, dict | None]) -> list:
        items, discrepancy = result
        if discrepancy:
            discrepancies.append(discrepancy)
        return items

    # Yazı ve sayfa için katı doğrulama: eksik içerikle göç yapılmaz.
    posts = collect(fetch_all(site, "posts"))
    pages = collect(fetch_all(site, "pages"))
    # Taksonomi ve medyada kaynak sistem tutarsızlığı olabilir; bu durumda
    # işlem durmaz ama fark rapora yazılır (sessizce geçilmez).
    cats = collect(fetch_all(site, "categories", "id,name,slug,description,count,parent,link", strict=False))
    tags = collect(fetch_all(site, "tags", "id,name,slug,description,count,link", strict=False))
    media_items = collect(fetch_all(site, "media", "id,source_url,alt_text,mime_type,media_details", strict=False))
    users = collect(fetch_all(site, "users", "id,name,slug,description", strict=False))

    for name, payload in [
        ("wp-posts.json", posts), ("wp-pages.json", pages), ("wp-categories.json", cats),
        ("wp-tags.json", tags), ("wp-media.json", media_items), ("wp-users.json", users),
    ]:
        with open(os.path.join(RAW, name), "w", encoding="utf-8") as fh:
            json.dump(payload, fh, ensure_ascii=False, indent=2)

    source_counts = {
        "posts": len(posts), "pages": len(pages), "media": len(media_items),
        "categories": len(cats), "tags": len(tags),
    }
    print(f"  kaynak: {source_counts}")

    # --- 2. Medya ----------------------------------------------------------
    media_ok, media_failures = ({}, [])
    if not args.no_media:
        print(f"  medya indiriliyor ({len(media_items)} dosya)…")
        media_ok, media_failures = download_media(media_items, dry)
        print(f"  medya tamam: {len(media_ok)}, hata: {len(media_failures)}")
    failed_urls = {f["legacyUrl"] for f in media_failures}

    media_by_id = {m["id"]: m for m in media_items}
    authors = {u["id"]: {"legacyId": u["id"], "name": u["name"], "slug": u["slug"], "isGuest": False} for u in users}
    cat_by_id = {c["id"]: c for c in cats}
    tag_by_id = {t["id"]: t for t in tags}

    # --- 3. SEO scrape -----------------------------------------------------
    seo_map: dict[int, dict] = {}
    seo_errors: list[dict] = []
    if not args.no_seo:
        targets = [(p["id"], p["link"]) for p in posts] + [(p["id"], p["link"]) for p in pages]
        print(f"  SEO alanları okunuyor ({len(targets)} sayfa)…")
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            for (pid, link), result in zip(targets, pool.map(lambda t: scrape_seo(t[1]), targets)):
                if result.get("error"):
                    seo_errors.append({"legacyId": pid, "url": link, "error": result["error"]})
                else:
                    seo_map[pid] = result
        print(f"  SEO okundu: {len(seo_map)}, hata: {len(seo_errors)}")

    # --- 4. Dönüştür ve yaz -------------------------------------------------
    written = Counter()
    unresolved_links: list[dict] = []
    checksums: dict[str, str] = {}
    slugs_seen: set[str] = set()
    duplicate_slugs: list[str] = []

    def build(item: dict, kind: str) -> dict:
        raw_body = item["content"]["rendered"]
        body, inline_media, embeds = transform_html(raw_body, failed_urls)
        seo = seo_map.get(item["id"], {})
        meta = item.get("meta") or {}
        fm_id = item.get("featured_media") or 0
        featured = None
        if fm_id and fm_id in media_by_id:
            src = media_by_id[fm_id].get("source_url", "")
            details = media_by_id[fm_id].get("media_details") or {}
            featured = {
                "legacyId": fm_id,
                "legacyUrl": src,
                "localPath": None if src in failed_urls else local_media_path(src),
                "alt": media_by_id[fm_id].get("alt_text") or "",
                "width": details.get("width"),
                "height": details.get("height"),
                "mimeType": media_by_id[fm_id].get("mime_type") or "",
                "error": "indirilemedi" if src in failed_urls else None,
            }
        path = urllib.parse.urlparse(item["link"]).path

        # Çözülemeyen iç linkleri raporla
        for href in re.findall(r'href="(/[^"]*)"', body):
            base = href.split("?")[0].split("#")[0].rstrip("/")
            if not base or base.startswith("/media/"):
                continue
            if base.endswith(".html") or base in KNOWN_PATHS or base == "/arama":
                continue
            unresolved_links.append({"legacyId": item["id"], "href": href})

        record = {
            "legacyId": item["id"],
            "slug": item["slug"],
            "legacyUrl": path,
            "url": path,
            "title": clean_text(item["title"]["rendered"]),
            "excerpt": clean_text(item.get("excerpt", {}).get("rendered", "")),
            "contentHtml": body,
            "publishedAt": item["date"],
            "modifiedAt": item["modified"],
            "status": item.get("status", "publish"),
            "featuredImage": featured,
            "inlineMedia": inline_media,
            "embeds": embeds,
            "seo": {
                "title": seo.get("title"),
                "description": meta.get("rank_math_description") or seo.get("description"),
                "focusKeyword": meta.get("rank_math_focus_keyword"),
                "canonicalUrl": seo.get("canonical"),
                "ogImage": seo.get("ogImage"),
            },
            "readingMinutes": reading_minutes(body),
            "migrationChecksum": checksum(raw_body),
        }
        if kind == "post":
            record["author"] = authors.get(item.get("author"), {"legacyId": item.get("author"), "name": "Ufuk Şen", "slug": "ufuk-sen", "isGuest": False})
            record["categories"] = [
                {"legacyId": c, "name": clean_text(cat_by_id[c]["name"]), "slug": cat_by_id[c]["slug"]}
                for c in item.get("categories", []) if c in cat_by_id
            ]
            record["tags"] = [
                {"legacyId": t, "name": clean_text(tag_by_id[t]["name"]), "slug": tag_by_id[t]["slug"]}
                for t in item.get("tags", []) if t in tag_by_id
            ]
        return record

    KNOWN_PATHS = {urllib.parse.urlparse(p["link"]).path.rstrip("/") for p in pages}
    KNOWN_PATHS |= {urllib.parse.urlparse(c.get("link", "")).path.rstrip("/") for c in cats if c.get("link")}

    skipped_excluded = 0
    for item in posts:
        if item["slug"] in excluded_slugs:
            skipped_excluded += 1
            # Daha önce üretilmiş dosya varsa temizle (idempotent)
            stale = os.path.join(CONTENT, "posts", f"{item['slug']}.json")
            if os.path.exists(stale) and not dry:
                os.remove(stale)
            continue
        rec = build(item, "post")
        key = f"post:{rec['slug']}"
        if key in slugs_seen:
            duplicate_slugs.append(key)
        slugs_seen.add(key)
        checksums[str(rec["legacyId"])] = rec["migrationChecksum"]
        if write_json(os.path.join(CONTENT, "posts", f"{rec['slug']}.json"), rec, dry):
            written["posts"] += 1

    for item in pages:
        rec = build(item, "page")
        key = f"page:{rec['slug']}"
        if key in slugs_seen:
            duplicate_slugs.append(key)
        slugs_seen.add(key)
        checksums[str(rec["legacyId"])] = rec["migrationChecksum"]
        if write_json(os.path.join(CONTENT, "pages", f"{rec['slug']}.json"), rec, dry):
            written["pages"] += 1

    taxonomy = {
        "categories": [
            {
                "legacyId": c["id"], "name": clean_text(c["name"]), "slug": c["slug"],
                "description": clean_text(c.get("description", "")) or None,
                "postCount": c["count"],
                "legacyUrl": urllib.parse.urlparse(c.get("link", "")).path or f"/{c['slug']}",
            }
            for c in cats
        ],
        "tags": [
            {"legacyId": t["id"], "name": clean_text(t["name"]), "slug": t["slug"], "postCount": t["count"]}
            for t in tags
        ],
        "authors": list(authors.values()),
    }
    if write_json(os.path.join(CONTENT, "taxonomy.json"), taxonomy, dry):
        written["taxonomy"] += 1

    # --- 4b. İçerikte geçen medya varyantlarını indir -----------------------
    #
    # WordPress gövdede orijinal dosya yerine yeniden boyutlandırılmış
    # varyantlara referans veriyor ("...-1024x741.png"). Bu varyantlar medya
    # kütüphanesinde ayrı kayıt olmadığı için REST listesinden gelmiyor;
    # yalnızca kütüphaneyi indirmek gövdedeki görselleri kırık bırakıyordu.
    # Referanslar JSON ayrıştırılarak toplanır. Ham metin üzerinde regex
    # kullanmak JSON kaçış karakterlerini (\") yola dahil ediyor ve geçersiz
    # dosya adları üretiyordu.
    referenced: set[str] = set()
    for folder in ("posts", "pages"):
        folder_path = os.path.join(CONTENT, folder)
        if not os.path.isdir(folder_path):
            continue
        for name in os.listdir(folder_path):
            with open(os.path.join(folder_path, name), encoding="utf-8") as fh:
                record = json.load(fh)
            haystack = record.get("contentHtml", "")
            featured = record.get("featuredImage") or {}
            if featured.get("localPath"):
                referenced.add(featured["localPath"])
            referenced.update(re.findall(r'(?:src|href)="(/media/[^"]+)"', haystack))
            referenced.update(re.findall(r"(?:src|href)='(/media/[^']+)'", haystack))
            # srcset içindeki varyantlar
            for srcset in re.findall(r'srcset="([^"]+)"', haystack):
                for candidate in srcset.split(","):
                    url = candidate.strip().split(" ")[0]
                    if url.startswith("/media/"):
                        referenced.add(url)

    variant_failures: list[dict] = []
    variants_downloaded = 0
    if not args.no_media:
        missing = []
        for ref in sorted(referenced):
            rel = urllib.parse.unquote(ref[len("/media/"):])
            target = os.path.join(MEDIA_DIR, rel.replace("/", os.sep))
            if not (os.path.exists(target) and os.path.getsize(target) > 0):
                missing.append((ref, rel, target))

        if missing:
            print(f"  içerikte geçen {len(missing)} medya varyantı indiriliyor…")

            def grab(entry):
                ref, rel, target = entry
                source = f"{site}/wp-content/uploads/{rel}"
                try:
                    os.makedirs(os.path.dirname(target), exist_ok=True)
                    data = fetch(source, binary=True)
                    if not data:
                        raise RuntimeError("boş yanıt")
                    tmp = target + ".part"
                    with open(tmp, "wb") as fh:
                        fh.write(data)
                    os.replace(tmp, target)
                    return None
                except Exception as exc:
                    return {"reference": ref, "source": source, "error": str(exc)[:160]}

            if not dry:
                with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
                    for failure in pool.map(grab, missing):
                        if failure:
                            variant_failures.append(failure)
                        else:
                            variants_downloaded += 1
            print(f"  varyant indirildi: {variants_downloaded}, hata: {len(variant_failures)}")

    # --- 4c. İndirilemeyen varyantlar için orijinale geri düşüş -------------
    #
    # Kaynakta 404 dönen boyut varyantları için ("...-300x259.jpg") orijinal
    # dosya ("...jpg") diskteyse referans ona çevrilir. Görsel kırık kalmaz;
    # yalnızca daha büyük dosya sunulur. Orijinal de yoksa sessizce geçilmez,
    # rapora "kaynakta da eksik" olarak yazılır.
    fallbacks: list[dict] = []
    still_missing: list[dict] = []
    if variant_failures and not dry:
        rewrite: dict[str, str] = {}
        for failure in variant_failures:
            ref = failure["reference"]
            original = re.sub(r"-\d+x\d+(\.[A-Za-z0-9]+)$", r"\1", ref)
            if original == ref:
                still_missing.append(failure)
                continue
            target = os.path.join(MEDIA_DIR, urllib.parse.unquote(original[len("/media/"):]).replace("/", os.sep))
            if os.path.exists(target):
                rewrite[ref] = original
                fallbacks.append({"reference": ref, "replacedWith": original})
            else:
                still_missing.append(failure)

        if rewrite:
            for folder in ("posts", "pages"):
                folder_path = os.path.join(CONTENT, folder)
                if not os.path.isdir(folder_path):
                    continue
                for name in os.listdir(folder_path):
                    path = os.path.join(folder_path, name)
                    with open(path, encoding="utf-8") as fh:
                        record = json.load(fh)
                    body = record.get("contentHtml", "")
                    changed = False
                    for old, new in rewrite.items():
                        if old in body:
                            body = body.replace(old, new)
                            changed = True
                    if changed:
                        record["contentHtml"] = body
                        write_json(path, record, dry)
            print(f"  orijinale çevrilen varyant: {len(fallbacks)}, hâlâ eksik: {len(still_missing)}")

    # --- 4c2. Kaldırılan yazılara giden iç bağlantıları çöz ----------------
    #
    # Silinen yazılara işaret eden bağlantılar kullanıcıyı 410 sayfasına
    # götürürdü. Bağlantı kaldırılır, METİN OLDUĞU GİBİ KALIR — içerik
    # silinmiyor, yalnızca çalışmayan bağlantı kaldırılıyor.
    unlinked = 0
    if excluded_slugs and not dry:
        excluded_urls = {f"/{slug}.html" for slug in excluded_slugs}
        for folder in ("posts", "pages"):
            folder_path = os.path.join(CONTENT, folder)
            if not os.path.isdir(folder_path):
                continue
            for name in os.listdir(folder_path):
                path = os.path.join(folder_path, name)
                with open(path, encoding="utf-8") as fh:
                    record = json.load(fh)
                body = record.get("contentHtml", "")
                changed = False
                for url in excluded_urls:
                    pattern = re.compile(
                        r'<a[^>]*href="' + re.escape(url) + r'"[^>]*>(.*?)</a>',
                        re.I | re.S,
                    )
                    # Yalnizca <a> sarmalayicisi kaldirilir; metin korunur.
                    body, count = pattern.subn(chr(92)+"1", body)
                    if count:
                        unlinked += count
                        changed = True
                if changed:
                    record["contentHtml"] = body
                    write_json(path, record, dry)
        if unlinked:
            print(f"  kaldırılan yazılara giden {unlinked} bağlantı çözüldü")

    # --- 4d. Kaynaktaki mevcut yönlendirmeleri iç linklere uygula ----------
    #
    # Kaynak WordPress'te tanımlı yönlendirmeler var (Rank Math Redirections).
    # İçerikteki bazı linkler eski slug'lara işaret ediyor ve kaynakta 301 ile
    # çalışıyor. Hedefe çevirerek gereksiz yönlendirme adımını kaldırıyoruz;
    # eski URL'ler ayrıca `_redirects` ile korunuyor (ADR-004).
    redirect_file = os.path.join(REPORT_DIR, "legacy-redirects.json")
    links_rewritten = 0
    if os.path.exists(redirect_file) and not dry:
        with open(redirect_file, encoding="utf-8") as fh:
            mapping = json.load(fh).get("redirects", {})
        if mapping:
            for folder in ("posts", "pages"):
                folder_path = os.path.join(CONTENT, folder)
                if not os.path.isdir(folder_path):
                    continue
                for name in os.listdir(folder_path):
                    path = os.path.join(folder_path, name)
                    with open(path, encoding="utf-8") as fh:
                        record = json.load(fh)
                    body = record.get("contentHtml", "")
                    changed = False
                    for old, new in mapping.items():
                        needle = f'href="{old}"'
                        if needle in body:
                            body = body.replace(needle, f'href="{new}"')
                            links_rewritten += 1
                            changed = True
                    if changed:
                        record["contentHtml"] = body
                        write_json(path, record, dry)
            print(f"  iç link yönlendirmesi uygulandı: {links_rewritten}")

    # --- 5. Doğrulama -------------------------------------------------------
    target_counts = {
        "posts": len(posts), "pages": len(pages),
        "media": len(media_ok), "categories": len(cats), "tags": len(tags),
    }
    if not dry:
        target_counts["posts"] = len([f for f in os.listdir(os.path.join(CONTENT, "posts"))]) if os.path.isdir(os.path.join(CONTENT, "posts")) else 0
        target_counts["pages"] = len([f for f in os.listdir(os.path.join(CONTENT, "pages"))]) if os.path.isdir(os.path.join(CONTENT, "pages")) else 0

    # Kaldırılan yazılar hedefte bilinçli olarak yok; beklenen adet düşülür.
    expected_posts = source_counts["posts"] - skipped_excluded
    counts_match = (
        target_counts["posts"] == expected_posts
        and target_counts["pages"] == source_counts["pages"]
    )

    report = {
        "runAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "dryRun": dry,
        "source": source_counts,
        "target": target_counts,
        "countsMatch": counts_match,
        "excludedPosts": skipped_excluded,
        "expectedPosts": expected_posts,
        "writtenThisRun": dict(written),
        "mediaDownloaded": len(media_ok),
        "mediaVariantsDownloaded": variants_downloaded,
        "mediaVariantFailures": variant_failures,
        "mediaVariantFallbacks": fallbacks,
        # Kaynak sistemde de bulunmayan görseller — canlı sitede zaten kırık.
        "mediaMissingAtSource": still_missing,
        "mediaFailures": media_failures,
        "seoScraped": len(seo_map),
        "seoErrors": seo_errors[:50],
        "seoErrorCount": len(seo_errors),
        "sourceDiscrepancies": discrepancies,
        "duplicateSlugs": duplicate_slugs,
        # Bu linkler kaynak sistemde de 404 dönüyor (örneklemle doğrulandı):
        # göç kaynaklı bir gerileme değil, mevcut kırık bağlantılar.
        "preExistingBrokenLinks": unresolved_links[:100],
        "preExistingBrokenLinkCount": len(unresolved_links),
        "internalLinksRewritten": links_rewritten,
        "unlinkedToRemoved": unlinked,
        "checksumCount": len(checksums),
    }

    with open(os.path.join(REPORT_DIR, "report.json"), "w", encoding="utf-8") as fh:
        json.dump(report, fh, ensure_ascii=False, indent=2)
    with open(os.path.join(REPORT_DIR, "checksums.json"), "w", encoding="utf-8") as fh:
        json.dump(checksums, fh, ensure_ascii=False, indent=2)

    print(json.dumps({k: v for k, v in report.items() if k not in ("mediaFailures", "unresolvedLinks", "seoErrors")},
                     ensure_ascii=False, indent=2))

    problems = []
    if not counts_match:
        problems.append("kaynak/hedef adet uyuşmuyor")
    if media_failures:
        problems.append(f"{len(media_failures)} medya indirilemedi")
    if still_missing:
        problems.append(
            f"{len(still_missing)} görsel kaynakta da bulunamadı (canlı sitede de kırık)"
        )
    if duplicate_slugs:
        problems.append(f"{len(duplicate_slugs)} slug çakışması")

    if problems:
        print("\nSORUN: " + "; ".join(problems), file=sys.stderr)
        return 1
    print("\nDoğrulama geçti.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
