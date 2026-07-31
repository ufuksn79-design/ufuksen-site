#!/usr/bin/env python3
"""Meta açıklamalarını kabul edilebilir uzunluğa getirir.

Denetim sonucu: 180 yazının açıklaması 70 karakterden kısa, 45'i 165'ten uzun.
Kısa açıklama Google'da yetersiz görünür; uzun olan kesilir.

ÖNEMLİ — bilgi uydurulmuyor:
Açıklama yazının KENDİ metninden türetilir. Önce özet (excerpt), yoksa
gövdenin ilk paragrafı alınır; cümle sınırında kırpılır. Yeni bilgi
eklenmez, yalnızca mevcut metin seçilip kısaltılır.

İyi durumdaki açıklamalara dokunulmaz.

Kullanım:
    python scripts/content/fix-meta-descriptions.py --dry-run
    python scripts/content/fix-meta-descriptions.py --apply
"""

from __future__ import annotations

import argparse
import glob
import html as htmllib
import io
import json
import os
import re
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
HEDEF_ALT = 120
HEDEF_UST = 158
KISA_ESIK = 70
UZUN_ESIK = 165


def duz_metin(parca: str) -> str:
    """HTML'den okunabilir düz metin. İçerik değiştirilmez, yalnızca temizlenir."""
    parca = re.sub(r"<(script|style)[^>]*>.*?</\1>", " ", parca, flags=re.S | re.I)
    parca = re.sub(r"<[^>]+>", " ", parca)
    parca = htmllib.unescape(parca)
    return re.sub(r"\s+", " ", parca).strip()


def cumlede_kirp(metin: str, ust: int = HEDEF_UST) -> str:
    """Cümle sonunda, olmazsa kelime sonunda kırpar."""
    if len(metin) <= ust:
        return metin

    pencere = metin[: ust + 1]
    # Cümle sonu ara (nokta, soru, ünlem + boşluk)
    son = max(pencere.rfind(". "), pencere.rfind("! "), pencere.rfind("? "))
    if son >= HEDEF_ALT:
        return pencere[: son + 1].strip()

    bosluk = pencere.rfind(" ")
    if bosluk <= 0:
        return pencere.strip()
    return pencere[:bosluk].rstrip(" ,;:–-") + "…"


def aday_uret(kayit: dict) -> str | None:
    """Yazının kendi metninden açıklama adayı üretir."""
    parcalar: list[str] = []

    ozet = duz_metin(kayit.get("excerpt", ""))
    if ozet:
        parcalar.append(ozet)

    govde = duz_metin(kayit.get("contentHtml", ""))
    if govde:
        parcalar.append(govde)

    for parca in parcalar:
        if len(parca) >= HEDEF_ALT:
            return cumlede_kirp(parca)

    # Hiçbiri yeterince uzun değilse en uzununu al
    en_uzun = max(parcalar, key=len, default="")
    return cumlede_kirp(en_uzun) if en_uzun else None


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    if args.apply == args.dry_run:
        print("Tam olarak biri gerekli: --dry-run veya --apply", file=sys.stderr)
        return 2

    dosyalar = sorted(
        glob.glob(os.path.join(ROOT, "src", "content", "posts", "*.json"))
        + glob.glob(os.path.join(ROOT, "src", "content", "pages", "*.json"))
    )

    kisa = uzun = duzeltildi = dokunulmadi = uretilemedi = 0

    for yol in dosyalar:
        with io.open(yol, encoding="utf-8") as fh:
            kayit = json.load(fh)

        seo = kayit.setdefault("seo", {})
        mevcut = (seo.get("description") or "").strip()

        if KISA_ESIK <= len(mevcut) <= UZUN_ESIK:
            dokunulmadi += 1
            continue

        if len(mevcut) < KISA_ESIK:
            kisa += 1
        else:
            uzun += 1

        # Uzun olanı önce kendi metnini kırparak düzeltmeyi dene —
        # yazarın yazdığı metin, türetilmiş metinden değerlidir.
        yeni = cumlede_kirp(mevcut) if len(mevcut) > UZUN_ESIK else None
        if not yeni or len(yeni) < KISA_ESIK:
            yeni = aday_uret(kayit)

        if not yeni or len(yeni) < 40:
            uretilemedi += 1
            continue

        if yeni == mevcut:
            dokunulmadi += 1
            continue

        seo["description"] = yeni
        duzeltildi += 1

        if not args.dry_run:
            with io.open(yol, "w", encoding="utf-8") as fh:
                json.dump(kayit, fh, ensure_ascii=False, indent=2)
                fh.write("\n")

    mod = "DRY-RUN" if args.dry_run else "APPLY"
    print(f"[{mod}] incelenen dosya: {len(dosyalar)}")
    print(f"  zaten uygun      : {dokunulmadi}")
    print(f"  kısa bulunan     : {kisa}")
    print(f"  uzun bulunan     : {uzun}")
    print(f"  düzeltilen       : {duzeltildi}")
    print(f"  üretilemeyen     : {uretilemedi}")
    if uretilemedi:
        print("\nÜretilemeyenler: gövdesi çok kısa olan içerikler. Elle yazılmalı.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
