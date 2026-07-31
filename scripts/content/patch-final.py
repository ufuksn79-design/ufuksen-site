"""Son SEO düzeltmesi + migration koruması (tek seferlik yardımcı)."""
import io

# 1) Blog sayfalama aciklamalari cok kisaydi (55 karakter)
p = "src/pages/blog/[...page].astro"
s = io.open(p, encoding="utf-8").read()
eski = "description={`3D görselleştirme, render ve SketchUp üzerine ${page.total} yazı.`}"
yeni = (
    "description={`SketchUp, V-Ray, D5 Render, Twinmotion ve Enscape üzerine "
    "${page.total} yazılık arşiv. Sayfa ${page.currentPage} / ${page.lastPage}. "
    "Rehberler, karşılaştırmalar ve video dersler.`}"
)
if eski in s:
    io.open(p, "w", encoding="utf-8").write(s.replace(eski, yeni))
    print("blog sayfalama aciklamasi genisletildi")

# 2) KRITIK: migration artik icerigin uzerine yazmamali.
#
# Icerik kaynagi WordPress'ten depoya tasindi (ADR-019). Panelden yapilan
# duzenlemeler src/content/*.json icinde yasiyor. migrate.py bunlarin
# uzerine yazarsa kullanicinin tum emegi silinir.
p = "scripts/wordpress/migrate.py"
s = io.open(p, encoding="utf-8").read()

kilit = '''    mode = "DRY-RUN" if dry else "APPLY"
    print(f"[{mode}] Kaynak: {site}")'''

koruma = '''    mode = "DRY-RUN" if dry else "APPLY"
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
            "\\nREDDEDİLDİ: İçerik artık yönetim panelinden yönetiliyor.\\n"
            "Bu script WordPress'ten yeniden içe aktarır ve paneldeki tüm\\n"
            "düzenlemeleri siler.\\n\\n"
            "Gerçekten istiyorsanız: --allow-overwrite\\n"
            f"Kilit dosyası: {kilit_dosya}",
            file=sys.stderr,
        )
        return 3
'''

if "İÇERİK KAYNAĞI KORUMASI" not in s:
    s = s.replace(kilit, koruma, 1)
    s = s.replace(
        '    parser.add_argument("--no-seo", action="store_true", help="SEO head scrape\'ini atla")',
        '    parser.add_argument("--no-seo", action="store_true", help="SEO head scrape\'ini atla")\n'
        '    parser.add_argument(\n'
        '        "--allow-overwrite",\n'
        '        action="store_true",\n'
        '        help="Panelden yönetilen içeriğin üzerine yazmayı bilinçli olarak kabul et",\n'
        '    )',
        1,
    )
    io.open(p, "w", encoding="utf-8").write(s)
    print("migrate.py: icerik kaynagi korumasi eklendi")
