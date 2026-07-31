#!/usr/bin/env python3
"""URL eşleme tablosu üreticisi (salt okunur).

Kaynak WordPress'ten tüm yazı, sayfa ve taksonomi URL'lerini çeker; her eski URL
için hedef URL ve eylem (keep / redirect / decide) belirler.

ADR-007 gereği yazı permalink şeması `/{slug}.html` birebir korunur; bu yüzden
yazıların varsayılan eylemi `keep`tir. Redirect ihtiyacı AMP varyantları,
taksonomi sayfaları ve konsolidasyon kararı bekleyen sayfalarla sınırlıdır.

Kaynak sisteme yalnızca GET isteği gönderilir. Tekrar çalıştırılabilir.

Kullanım:
    python scripts/wordpress/url-map.py [--site https://www.ufuksen.com]
"""

from __future__ import annotations

import argparse
import csv
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from collections import Counter, defaultdict

UA = "ufuksen-migration-urlmap/1.0 (read-only audit)"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "docs", "inventory")
RAW = os.path.join(OUT, "raw")

# Konsolidasyon kararı bekleyen sayfa grupları (decisions.md açık kararlar).
# Bu sayfalar otomatik olarak birleştirilmez; yalnızca işaretlenir.
OVERLAP_GROUPS = {
    "3d-gorsellestirme-ailesi": [
        "3d-gorsellestirme",
        "3d-mimari-gorsellestirme",
        "3d-render-gorsellestirme",
    ],
    "sketchup-egitim-ailesi": [
        "sketchup-kurs",
        "sketchup-ders",
        "sketchup-ozel-ders",
    ],
    "iletisim-ailesi": [
        "iletisim",
        "contact-form",
    ],
}


def get_json(url: str, retries: int = 3):
    """GET isteği; JSON gövdesini ve başlıkları döndürür. Hata sessizce yutulmaz."""
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8")), dict(resp.headers)
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, ValueError) as exc:
            last = exc
            time.sleep(1 + attempt)
    raise RuntimeError(f"GET başarısız: {url} -> {last}")


def fetch_all(site: str, endpoint: str, fields: str) -> list:
    """Sayfalanmış REST koleksiyonunun tamamını çeker."""
    items, page = [], 1
    while True:
        url = f"{site}/wp-json/wp/v2/{endpoint}?per_page=100&page={page}&_fields={fields}"
        batch, headers = get_json(url)
        if not batch:
            break
        items += batch
        total_pages = int(headers.get("x-wp-totalpages", 1))
        if page >= total_pages:
            break
        page += 1
    return items


def path_of(link: str) -> str:
    """Mutlak URL'den yol kısmını çıkarır."""
    return urllib.parse.urlparse(link).path or "/"


def build_rows(site: str) -> tuple[list[dict], dict]:
    posts = fetch_all(site, "posts", "id,slug,link,date,modified,title,categories,featured_media")
    pages = fetch_all(site, "pages", "id,slug,link,date,modified,title,parent")
    cats = fetch_all(site, "categories", "id,slug,link,name,count")
    tags = fetch_all(site, "tags", "id,slug,link,name,count")

    rows: list[dict] = []

    # Ana sayfa
    rows.append({
        "legacy_url": "/",
        "legacy_id": "",
        "tip": "home",
        "yeni_url": "/",
        "eylem": "keep",
        "not": "Ana sayfa single-page scroll deneyimi olarak yeniden tasarlanacak",
    })

    for post in posts:
        path = path_of(post["link"])
        rows.append({
            "legacy_url": path,
            "legacy_id": post["id"],
            "tip": "post",
            "yeni_url": path,
            "eylem": "keep",
            "not": f"kategori={','.join(str(c) for c in post.get('categories', []))}"
                   f"; tarih={post['date'][:10]}"
                   f"{'; one-cikan-gorsel-yok' if not post.get('featured_media') else ''}",
        })
        # AMP varyantları — kaynak sistemde iki biçim de 200 dönüyor:
        #   1) rel="amphtml" ile ilan edilen kanonik biçim: {path}?amp=1
        #   2) {path}/amp -> (1)'e yönlenen eski biçim
        # Yeni sistemde AMP olmayacağı için ikisi de kanonik sayfaya 301'lenir.
        for amp_url, note in (
            (f"{path}?amp=1", "AMP kanonik biçim (rel=amphtml ile ilan ediliyor)"),
            (f"{path}/amp", "AMP yol biçimi; kaynakta ?amp=1'e yönleniyor"),
        ):
            rows.append({
                "legacy_url": amp_url,
                "legacy_id": post["id"],
                "tip": "post-amp",
                "yeni_url": path,
                "eylem": "redirect",
                "not": f"{note}; yeni sistemde AMP yok, kanonik sayfaya 301",
            })

    for page in pages:
        path = path_of(page["link"])
        if path == "/":
            continue  # ana sayfa zaten eklendi
        group = next((g for g, slugs in OVERLAP_GROUPS.items() if page["slug"] in slugs), None)
        rows.append({
            "legacy_url": path,
            "legacy_id": page["id"],
            "tip": "page",
            "yeni_url": path if not group else "",
            "eylem": "keep" if not group else "decide",
            "not": "" if not group else f"örtüşme grubu: {group} — konsolidasyon kararı bekliyor",
        })

    for cat in cats:
        path = path_of(cat["link"])
        rows.append({
            "legacy_url": path,
            "legacy_id": cat["id"],
            "tip": "category",
            "yeni_url": path,
            "eylem": "keep" if cat["count"] > 0 else "decide",
            "not": f"{cat['count']} yazı" + ("; boş kategori — kaldırılırsa 301 gerekir" if not cat["count"] else ""),
        })

    for tag in tags:
        path = path_of(tag["link"])
        rows.append({
            "legacy_url": path,
            "legacy_id": tag["id"],
            "tip": "tag",
            "yeni_url": "",
            "eylem": "decide",
            "not": f"{tag['count']} yazı; etiket sistemi kullanılmamış — kaldırılırsa 301 gerekir",
        })

    # Doğrulama
    dupes = [u for u, n in Counter(r["legacy_url"] for r in rows).items() if n > 1]
    slug_map = defaultdict(list)
    for post in posts:
        slug_map[post["slug"]].append(post["id"])
    for page in pages:
        slug_map[page["slug"]].append(page["id"])

    # Slug çakışması yalnızca aynı URL'e düşerse sorundur. Yazılar `.html` uzantılı,
    # sayfalar uzantısız olduğu için post/page arası slug çakışması URL çakışması
    # yaratmaz; bu yüzden ayrı raporlanır.
    collisions = {s: ids for s, ids in slug_map.items() if len(ids) > 1}

    stats = {
        "yazi": len(posts),
        "sayfa": len(pages),
        "kategori": len(cats),
        "etiket": len(tags),
        "toplam_satir": len(rows),
        "eylem_dagilimi": dict(Counter(r["eylem"] for r in rows)),
        "tip_dagilimi": dict(Counter(r["tip"] for r in rows)),
        "tekrarlanan_legacy_url": dupes,
        "cakisan_slug_url_cakismasi_degil": collisions,
        "hedefi_bos_satir": sum(1 for r in rows if not r["yeni_url"]),
    }
    return rows, stats


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", default="https://www.ufuksen.com")
    args = parser.parse_args()
    site = args.site.rstrip("/")

    os.makedirs(RAW, exist_ok=True)
    rows, stats = build_rows(site)

    csv_path = os.path.join(OUT, "url-map.csv")
    with open(csv_path, "w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(
            fh, fieldnames=["legacy_url", "legacy_id", "tip", "yeni_url", "eylem", "not"]
        )
        writer.writeheader()
        writer.writerows(rows)

    with open(os.path.join(OUT, "url-map-stats.json"), "w", encoding="utf-8") as fh:
        json.dump(stats, fh, ensure_ascii=False, indent=2)

    print(json.dumps(stats, ensure_ascii=False, indent=2))
    print(f"\n-> {csv_path} ({len(rows)} satır)")

    if stats["tekrarlanan_legacy_url"]:
        print("UYARI: tekrarlanan legacy URL var — redirect çakışması riski", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
