#!/usr/bin/env python3
"""Salt okunur WordPress envanter aracı.

Kaynak sisteme HİÇBİR yazma isteği göndermez; yalnızca public REST API ve
sitemap üzerinden GET yapar. Tekrar çalıştırılabilir (idempotent): her çalışma
docs/inventory/ altındaki çıktıları yeniden üretir.

Kullanım:
    python scripts/wordpress/inventory.py [--site https://www.ufuksen.com] [--sample 40]
"""

from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
from collections import Counter
from xml.etree import ElementTree

UA = "ufuksen-migration-inventory/1.0 (read-only audit)"
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.join(ROOT, "docs", "inventory")
RAW = os.path.join(OUT, "raw")

ENDPOINTS = ["posts", "pages", "categories", "tags", "media", "comments", "users"]


def get(url: str, retries: int = 3):
    """GET isteği; başlıkları ve gövdeyi döndürür. Hata sessizce yutulmaz."""
    last = None
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=60) as resp:
                return dict(resp.headers), resp.read()
        except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError) as exc:
            last = exc
            time.sleep(1 + attempt)
    raise RuntimeError(f"GET başarısız: {url} -> {last}")


def counts(site: str) -> dict:
    """Her içerik türü için X-WP-Total sayısını toplar."""
    result = {}
    for ep in ENDPOINTS:
        try:
            headers, _ = get(f"{site}/wp-json/wp/v2/{ep}?per_page=1")
            result[ep] = int(headers.get("x-wp-total", -1))
        except RuntimeError as exc:
            result[ep] = f"HATA: {exc}"
    return result


def post_types(site: str) -> list:
    _, body = get(f"{site}/wp-json/wp/v2/types")
    return sorted(json.loads(body).keys())


def urls(site: str) -> list:
    """sitemap_index üzerinden tüm public URL'leri toplar."""
    _, body = get(f"{site}/sitemap_index.xml")
    ns = "{http://www.sitemaps.org/schemas/sitemap/0.9}"
    subs = [el.text for el in ElementTree.fromstring(body).iter(f"{ns}loc") if el.text]
    found = []
    for sub in subs:
        _, sub_body = get(sub)
        found += [el.text for el in ElementTree.fromstring(sub_body).iter(f"{ns}loc") if el.text]
    # sub-sitemap loc'ları da listede olabilir; .xml uzantılıları ayıkla
    return sorted({u for u in found if not u.endswith(".xml")})


def analyze(site: str, sample: int) -> dict:
    """Örneklem yazıları migration riski açısından tarar."""
    per_page = min(sample, 100)
    _, body = get(f"{site}/wp-json/wp/v2/posts?per_page={per_page}")
    posts = json.loads(body)
    with open(os.path.join(RAW, "posts-sample.json"), "w", encoding="utf-8") as fh:
        json.dump(posts, fh, ensure_ascii=False, indent=2)

    shortcodes, embeds, blocks, hosts = Counter(), Counter(), Counter(), Counter()
    empty_excerpt = no_featured = 0
    for post in posts:
        html = post["content"]["rendered"]
        for name in re.findall(r"\[([a-zA-Z][a-zA-Z0-9_-]*)[\s\]]", html):
            shortcodes[name] += 1
        for src in re.findall(r"<iframe[^>]+src=[\"']([^\"']+)", html):
            embeds[re.sub(r"^https?://(www\.)?([^/]+).*", r"\2", src)] += 1
        for block in re.findall(r"<!--\s*wp:([a-z0-9/-]+)", html):
            blocks[block] += 1
        for src in re.findall(r"<img[^>]+src=[\"']([^\"']+)", html):
            hosts[re.sub(r"^https?://(www\.)?([^/]+).*", r"\2", src)] += 1
        if not post["excerpt"]["rendered"].strip():
            empty_excerpt += 1
        if not post.get("featured_media"):
            no_featured += 1

    return {
        "incelenen_yazi": len(posts),
        "shortcode": dict(shortcodes),
        "gomulu_iframe_host": dict(embeds),
        "gutenberg_block": dict(blocks),
        "gorsel_host": dict(hosts),
        "ozet_bos": empty_excerpt,
        "one_cikan_gorseli_yok": no_featured,
    }


def fingerprints(site: str) -> dict:
    """Ana sayfa HTML'inden tema/eklenti/SEO/analytics izlerini çıkarır."""
    headers, body = get(site + "/")
    html = body.decode("utf-8", "replace")
    with open(os.path.join(RAW, "homepage.html"), "w", encoding="utf-8") as fh:
        fh.write(html)
    version = re.search(r'content="WordPress ([0-9.]+)"', html)
    return {
        "wordpress_surumu": version.group(1) if version else "bilinmiyor",
        "php_surumu": headers.get("x-powered-by", "bilinmiyor"),
        "sunucu": f"{headers.get('Server', '?')} / {headers.get('x-turbo-charged-by', '?')}",
        "tema": sorted(set(re.findall(r"wp-content/themes/([a-zA-Z0-9_-]+)", html))),
        "eklenti": sorted(set(re.findall(r"wp-content/plugins/([a-zA-Z0-9_-]+)", html))),
        "seo_eklentisi": sorted(set(re.findall(r"(rank-?math|yoast|aioseo)", html, re.I))),
        "analytics": sorted(set(re.findall(r"(G-[A-Z0-9]{6,}|UA-[0-9]+-[0-9]+)", html))),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--site", default="https://www.ufuksen.com")
    parser.add_argument("--sample", type=int, default=40)
    args = parser.parse_args()
    site = args.site.rstrip("/")

    os.makedirs(RAW, exist_ok=True)

    report = {
        "kaynak": site,
        "sistem": fingerprints(site),
        "icerik_adetleri": counts(site),
        "post_type_listesi": post_types(site),
    }
    url_list = urls(site)
    report["public_url_adedi"] = len(url_list)
    report["ornek_analizi"] = analyze(site, args.sample)

    with open(os.path.join(OUT, "url-list.txt"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(url_list) + "\n")
    with open(os.path.join(OUT, "inventory.json"), "w", encoding="utf-8") as fh:
        json.dump(report, fh, ensure_ascii=False, indent=2)

    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
