#!/usr/bin/env python3
"""Kaynak sistemdeki mevcut yönlendirmeleri keşfeder ve kaydeder.

Neden gerekli: kaynak WordPress'te (Rank Math Redirections veya .htaccess)
tanımlı yönlendirmeler var. İçerikteki bazı iç linkler artık var olmayan
slug'lara işaret ediyor ama kaynakta 301 ile çalışan bir hedefe gidiyor:

    /render-hatalari.html            -> /3d-render-hatalari.html
    /sketchup-dosyasinda-...html     -> /sketchup-dosya-verimliligi.html
    /kaplama                         -> /

Bu yönlendirmeler taşınmazsa şu anda çalışan ve SEO değeri taşıyan URL'ler
yeni sitede 404 olur (ADR-004 ihlali).

Salt okunur; yalnızca HEAD/GET. Kaynak sunucuyu yormamak için istekler
aralıklı gönderilir. Tekrar çalıştırılabilir: sonuç dosyası birleştirilir.

Kullanım:
    python scripts/wordpress/resolve-redirects.py [--delay 1.5]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DIST = os.path.join(ROOT, "dist")
OUT = os.path.join(ROOT, "docs", "migration", "legacy-redirects.json")
UA = "ufuksen-migration-redirects/1.0 (read-only)"

SKIP_EXT = re.compile(r"\.(xml|json|txt|css|js|jpg|jpeg|png|webp|svg|ico|gif)$", re.I)


def dist_links() -> set[str]:
    """dist içindeki tüm iç bağlantılar."""
    links: set[str] = set()
    for base, _dirs, files in os.walk(DIST):
        for name in files:
            if not name.endswith(".html"):
                continue
            with open(os.path.join(base, name), encoding="utf-8", errors="replace") as fh:
                html = fh.read()
            links.update(re.findall(r'href="(/[^"#]*)"', html))
    return links


def resolves_locally(url: str) -> bool:
    clean = urllib.parse.unquote(url.split("?")[0]).strip("/")
    if not clean:
        return True
    candidates = [
        os.path.join(DIST, clean.replace("/", os.sep)),
        os.path.join(DIST, clean.replace("/", os.sep), "index.html"),
        os.path.join(DIST, clean.replace("/", os.sep) + ".html"),
    ]
    return any(os.path.exists(path) for path in candidates)


def follow(url: str, timeout: int = 45) -> tuple[int, str | None]:
    """Kaynakta URL'yi izler; (durum, son URL) döndürür."""
    request = urllib.request.Request(
        "https://www.ufuksen.com" + urllib.parse.quote(url, safe="/%?=&"),
        headers={"User-Agent": UA},
        method="HEAD",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.status, response.geturl()
    except urllib.error.HTTPError as exc:
        return exc.code, None
    except Exception as exc:  # ağ hatası sessizce yutulmaz
        return -1, str(exc)[:120]


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--delay", type=float, default=1.5, help="istekler arası bekleme (sn)")
    args = parser.parse_args()

    if not os.path.isdir(DIST):
        print("dist/ yok — önce `npm run build` çalıştırın.", file=sys.stderr)
        return 2

    candidates = sorted(
        url
        for url in dist_links()
        if not url.startswith("/media/") and not SKIP_EXT.search(url) and not resolves_locally(url)
    )
    print(f"Yerelde çözülmeyen {len(candidates)} bağlantı kaynakta sorgulanacak…")

    existing: dict = {}
    if os.path.exists(OUT):
        with open(OUT, encoding="utf-8") as fh:
            existing = json.load(fh)

    redirects: dict = dict(existing.get("redirects", {}))
    gone: list[str] = list(existing.get("gone", []))
    errors: list[dict] = []

    for index, url in enumerate(candidates, 1):
        if url in redirects or url in gone:
            continue  # idempotent: daha önce çözülmüş
        status, final = follow(url)
        if status == 200 and final:
            target = urllib.parse.urlparse(final).path or "/"
            target = urllib.parse.unquote(target)
            if target.rstrip("/") != url.rstrip("/"):
                redirects[url] = target
                print(f"  [{index}/{len(candidates)}] {url}  ->  {target}")
            else:
                # Kaynakta var ama bizde yok: içerik göçünde eksik olabilir.
                errors.append({"url": url, "note": "kaynakta 200, hedefte yok"})
                print(f"  [{index}/{len(candidates)}] {url}  ->  KAYNAKTA VAR, HEDEFTE YOK")
        elif status in (404, 410):
            gone.append(url)
        else:
            errors.append({"url": url, "status": status, "detail": final})
        time.sleep(args.delay)

    payload = {
        "resolvedAt": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "redirects": redirects,
        "gone": sorted(set(gone)),
        "errors": errors,
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)

    print(f"\nYönlendirme: {len(redirects)} | Kaynakta da yok (404): {len(gone)} | Hata: {len(errors)}")
    print(f"-> {OUT}")
    if errors:
        print("\nDikkat: aşağıdakiler incelenmeli", file=sys.stderr)
        for item in errors[:10]:
            print(f"  {item}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
