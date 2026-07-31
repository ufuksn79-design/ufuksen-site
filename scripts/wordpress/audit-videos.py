#!/usr/bin/env python3
"""Arşivdeki YouTube videolarının hâlâ yayında olup olmadığını denetler.

Neden gerekli: gövdeye gömülü videoların bir kısmı YouTube'da silinmiş veya
gizli. Video vitrininde bunların küçük resmi yüklenmez ve kırık kart görünür.
Ölü videolar galeriden ayıklanır — ama yazının içindeki gömülü oynatıcıya
dokunulmaz, çünkü içerik değiştirilmez (AGENTS.md §5).

Küçük resim uç noktası kimlik doğrulaması istemez ve hız sınırı düşüktür;
video kaldırıldığında 404 döner.

Sonuç `docs/content/video-status.json` içine yazılır ve build bunu okur.
Tekrar çalıştırılabilir: mevcut sonuçlar korunur, yalnızca yeni ID'ler sorulur.

Kullanım:
    python scripts/wordpress/audit-videos.py
    python scripts/wordpress/audit-videos.py --recheck   # tümünü yeniden sor
"""

from __future__ import annotations

import argparse
import concurrent.futures
import glob
import json
import os
import sys
import urllib.error
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
POSTS = os.path.join(ROOT, "src", "content", "posts")
OUT = os.path.join(ROOT, "docs", "content", "video-status.json")
UA = "Mozilla/5.0 (compatible; ufuksen-video-audit)"


def collect_ids() -> dict[str, str]:
    """video kimliği -> onu içeren yazının URL'i"""
    found: dict[str, str] = {}
    for path in glob.glob(os.path.join(POSTS, "*.json")):
        with open(path, encoding="utf-8") as fh:
            record = json.load(fh)
        for embed in record.get("embeds", []):
            if embed.get("provider") == "youtube" and embed.get("externalId"):
                found.setdefault(embed["externalId"], record["url"])
    return found


def alive(video_id: str) -> bool:
    """Küçük resim 200 dönüyorsa video yayında."""
    url = f"https://i.ytimg.com/vi/{video_id}/hqdefault.jpg"
    request = urllib.request.Request(url, headers={"User-Agent": UA}, method="HEAD")
    try:
        with urllib.request.urlopen(request, timeout=25) as response:
            return response.status == 200
    except urllib.error.HTTPError:
        return False
    except Exception:
        # Ağ hatası "ölü" sayılmaz; bir sonraki çalıştırmada tekrar sorulur.
        return True


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--recheck", action="store_true")
    args = parser.parse_args()

    ids = collect_ids()
    previous: dict = {}
    if os.path.exists(OUT) and not args.recheck:
        with open(OUT, encoding="utf-8") as fh:
            previous = json.load(fh).get("durum", {})

    todo = [vid for vid in ids if vid not in previous]
    print(f"toplam video: {len(ids)} | daha önce denetlenen: {len(previous)} | sorulacak: {len(todo)}")

    status = dict(previous)
    if todo:
        with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
            for vid, ok in zip(todo, pool.map(alive, todo)):
                status[vid] = ok

    dead = sorted(vid for vid, ok in status.items() if not ok)
    payload = {
        "aciklama": "YouTube video durumu. false = kaldırılmış/gizli; video galerisinden ayıklanır.",
        "toplam": len(ids),
        "yayinda": len(status) - len(dead),
        "olu": len(dead),
        "durum": status,
        "oluListesi": [{"id": vid, "yazi": ids.get(vid)} for vid in dead],
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, ensure_ascii=False, indent=2)

    print(f"yayında: {payload['yayinda']} | ölü: {payload['olu']}")
    print(f"-> {OUT}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
