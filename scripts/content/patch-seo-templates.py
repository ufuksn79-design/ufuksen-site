"""Kalan SEO düzeltmelerini uygular (tek seferlik yardımcı)."""
import io
import re

# 1) Denetim: /admin panel sayfasını kapsam dışı bırak
p = "scripts/build/audit-seo.mjs"
s = io.open(p, encoding="utf-8").read()
if "admin/" not in s.split("const htmlFiles")[1][:200]:
    s = s.replace(
        'const htmlFiles = files.filter((f) => f.endsWith(".html"));',
        "// Yönetim paneli bir içerik sayfası değil; SEO ölçütleri uygulanmaz.\n"
        'const htmlFiles = files\n'
        '  .filter((f) => f.endsWith(".html"))\n'
        '  .filter((f) => !f.replace(/\\\\/g, "/").includes("/admin/"));',
    )
    io.open(p, "w", encoding="utf-8").write(s)
    print("denetim: /admin haric tutuldu")

# 2) Kategori aciklamasi cok uzun olabiliyor (571 karakter olculdu) - kirp
p = "src/pages/[...slug].astro"
s = io.open(p, encoding="utf-8").read()
eski = """      description={
        props.category.description ??
        `${props.category.name} kategorisindeki ${props.category.postCount} yazı.`
      }"""
yeni = """      description={kisaAciklama(
        props.category.description ??
          `${props.category.name} kategorisindeki ${props.category.postCount} yazı. ` +
            `SketchUp, V-Ray, D5 Render ve Twinmotion üzerine rehberler.`,
      )}"""
if eski in s:
    s = s.replace(eski, yeni)
    s = s.replace(
        "const site = Astro.site ?? new URL(\"https://www.ufuksen.com\");",
        "const site = Astro.site ?? new URL(\"https://www.ufuksen.com\");\n\n"
        "/**\n"
        " * Meta aciklama 165 karakteri gecerse Google kesiyor; 70'in altinda\n"
        " * yetersiz gorunuyor. Kategori aciklamalari kaynaktan 571 karaktere\n"
        " * kadar geliyordu - cumle sinirinda kirpiliyor.\n"
        " */\n"
        "function kisaAciklama(metin: string, ust = 158): string {\n"
        "  const duz = metin.replace(/\\s+/g, \" \").trim();\n"
        "  if (duz.length <= ust) return duz;\n"
        "  const pencere = duz.slice(0, ust + 1);\n"
        "  const nokta = Math.max(pencere.lastIndexOf(\". \"), pencere.lastIndexOf(\"! \"), pencere.lastIndexOf(\"? \"));\n"
        "  if (nokta >= 100) return pencere.slice(0, nokta + 1).trim();\n"
        "  const bosluk = pencere.lastIndexOf(\" \");\n"
        "  return (bosluk > 0 ? pencere.slice(0, bosluk) : pencere).replace(/[ ,;:–-]+$/, \"\") + \"…\";\n"
        "}",
        1,
    )
    io.open(p, "w", encoding="utf-8").write(s)
    print("kategori aciklamasi kirpiliyor")

# 3) 404 ve arama sayfalarina daha dolu aciklama
duzelt = {
    "src/pages/404.astro": (
        'description="Aradığınız sayfa bulunamadı."',
        'description="Aradığınız sayfa bulunamadı. 3D görselleştirme, render ve '
        'SketchUp üzerine 430 yazılık arşive blog ve arama sayfalarından ulaşabilirsiniz."',
    ),
    "src/pages/arama.astro": (
        "description={`${posts.length} yazı içinde arama yapın.`}",
        "description={`${posts.length} yazılık arşivde başlık, kategori ve özet üzerinden "
        "arama yapın. SketchUp, V-Ray, D5 Render ve Twinmotion rehberleri.`}",
    ),
}
for p, (eski, yeni) in duzelt.items():
    s = io.open(p, encoding="utf-8").read()
    if eski in s:
        io.open(p, "w", encoding="utf-8").write(s.replace(eski, yeni))
        print(f"aciklama guncellendi: {p}")

# 4) Iletisim e-postasini guncelle
YENI_EPOSTA = "ufuksn79@gmail.com"
for p in ["src/pages/index.astro", "src/content/products.json"]:
    s = io.open(p, encoding="utf-8").read()
    o = s
    s = s.replace("info@ufuksen.com", YENI_EPOSTA)
    s = s.replace("gercekcirender@gmail.com", YENI_EPOSTA)
    if s != o:
        io.open(p, "w", encoding="utf-8").write(s)
        print(f"e-posta guncellendi: {p}")

# 5) Ana sayfadaki "teyit edilmedi" etiketini kaldir - artik dogrulandi
p = "src/pages/index.astro"
s = io.open(p, encoding="utf-8").read()
s = re.sub(
    r'\s*<span class="tag tag--placeholder">E-posta adresi teyit edilmedi</span>', "", s
)
io.open(p, "w", encoding="utf-8").write(s)
print("e-posta yer tutucu etiketi kaldirildi")
