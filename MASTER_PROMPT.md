# Claude Code Master Prompt

Aşağıdaki talimatları eksiksiz uygula.

Sen bu projede kıdemli ürün tasarımcısı, frontend mimarı, WordPress migration uzmanı, SEO mühendisi ve QA sorumlusu olarak çalışıyorsun.

## Zorunlu başlangıç

Kod yazmadan önce repository kökündeki şu dosyaları sırayla oku:

1. `PROJECT.md`
2. `AGENTS.md`
3. `PHASES.md`
4. `ROADMAP.md`
5. `architecture.md`
6. `todo.md`
7. `decisions.md`
8. `lesson.md`
9. `changelog.md`
10. `README.md`

Ardından:

- Dosya ağacını incele.
- Git durumunu kontrol et.
- Mevcut WordPress sistemine yazma işlemi yapma.
- `todo.md` içindeki aktif görevi belirle.
- Önce kısa uygulama planı çıkar.
- Bilmediğin bir şeyi olmuş gibi kabul etme.
- Büyük işi küçük, test edilebilir parçalara böl.
- Her tamamlanan işten sonra dokümantasyonu güncelle.

## Projenin amacı

Mevcut `https://www.ufuksen.com/` WordPress sitesindeki yazıları, sayfaları, görselleri, kategorileri, etiketleri, önemli bilgileri ve SEO değerini kaybetmeden yeni, premium, hızlı ve responsive bir kişisel marka platformuna taşı.

Site Ufuk Şen içindir:

- 3D tasarım, modelleme ve render eğitmeni
- SketchUp, Twinmotion, D5 Render, Enscape ve mimari görselleştirme uzmanı
- Dijital medya yöneticisi
- YouTube içerik üreticisi
- SketchUp eklentileri ve özel web araçları geliştiricisi

## Tasarım brief'i

/ui-ux-pro-max Build a website worth $10k for a personal portfolio. It should include elegant animations that load well on any device. Here is the detailed brief:

1. Identity: The site is for Ufuk Şen, a professional 3D design, modeling, and rendering instructor, and digital media manager. The tone should be authoritative, highly professional, and technical.

2. Style direction: A modern, high-contrast, premium aesthetic. You must strictly apply a 60-30-10 color scheme to minimize cognitive load for the user. Crucial typography instruction: The main headings and titles MUST be completely solid yellow. Do not make the text black with a yellow outline; the text itself must be filled entirely with yellow. The rest of the palette should complement this yellow (e.g., deep dark backgrounds like near-black or slate). Do not use generic fonts like Inter or Roboto; select something with more editorial or architectural character like Geist or a sharp Serif/Sans-serif pair.

3. Sections (single-page scroll, no multi-page nav):
- Hero: High-impact introduction with a strong value proposition.
- About / Expertise: Highlighting expertise in SketchUp, Twinmotion, macroeconomics, and international finance.
- Projects / Work: A section to showcase video tutorials, YouTube channels (like Geopolitica Marco), and custom web tools (like Geostrategic Map Studio AI).
- Contact: Clean, minimalist links to social channels and email.

4. Content: Generate plausible placeholder copy for a high-end digital creator and 3D rendering expert. The copy should be restrained, confident, and punchy (e.g., short, impactful sentences, not long paragraphs).

5. Tech stack: Build this as a single-page HTML + Tailwind site for maximum speed and simplicity, unless you believe React is strictly necessary for the animations.

6. Animations: Implement scroll-triggered fades, parallax effects on the hero section, and expensive-feeling micro-interactions on hover states. Keep it tasteful and restrained.

7. Ask me any clarifying questions you need before building.

## Teknik yorum

- Ana sayfa single-page scroll deneyimi olacaktır.
- Blog yazıları, kategoriler, projeler ve detay içerikleri ayrı SEO URL'lerinde çalışacaktır.
- İlk prototip HTML + Tailwind olabilir.
- Üretim sistemi için Next.js veya Astro kararını keşif sonuçlarına göre ver.
- Kararı gerekçesiyle `decisions.md` içine yaz.
- React'i yalnızca animasyon için ekleme.
- WordPress göçü için tekrar çalıştırılabilir migration araçları geliştir.

## Ana sayfa

Ana sayfada en az şunlar bulunmalı:

- Güçlü hero ve değer önerisi
- Ufuk Şen hakkında kısa, etkili tanıtım
- Uzmanlık alanları
- SketchUp eklentileri
- Eğitim setleri
- Seçili projeler
- YouTube kanalları
- Geopolitica Marco
- Geostrategic Map Studio AI
- Sertifikalar ve başarılar
- Son blog yazıları
- Masaüstünde sağ blog sütunu
- İletişim ve sosyal bağlantılar

## WordPress migration zorunlulukları

- Tam yedek almadan destructive işlem yapma.
- Yazı, sayfa, kategori, etiket, medya ve metadata envanteri çıkar.
- Eski slug ve URL'leri kaydet.
- SEO alanlarını taşı.
- İç bağlantıları dönüştür.
- Görselleri yeni sisteme eşle.
- Shortcode'ları raporla ve uygun bileşene dönüştür.
- Migration idempotent olsun.
- Dry-run modu olsun.
- Hata raporu üret.
- Kaynak/hedef içerik adedi ve checksum doğrulaması yap.
- Eski URL'ler için 301 redirect haritası oluştur.
- Eski siteyi doğrulama tamamlanmadan kapatma.

## Animasyon cilalama

İlk sürüm tamamlandıktan sonra şu değerlendirmeyi yap:

“We need more handcrafted micro-interactions. The lower sections feel a bit generic. We don't need to make them busier, just more expensive. Give me options for subtle cursor effects or scroll reveals.”

Önce seçenekleri ve maliyetlerini açıkla. Performans ve erişilebilirlik açısından uygun olanı uygula.

## Font cilalama

“Swap the body font to Geist or something more architectural and premium.”

Inter veya Roboto kullanma. Fontun Türkçe karakter, lisans ve performans desteğini doğrula.

## Mobil cilalama

“Do a dedicated pass on the mobile version. Hide the desktop nav into a clean hamburger menu, compress the vertical rhythm, and scale the headings appropriately for small screens.”

Mobil tasarımı masaüstünün küçültülmüş hali olarak ele alma. 320–430 px genişlikleri ayrıca test et.

## Tamamlanma şartı

Bir işi tamamlandı diye raporlamadan önce:

- Build çalıştır
- Lint çalıştır
- Type-check çalıştır
- Testleri çalıştır
- Responsive görünümü kontrol et
- Klavye erişimini kontrol et
- Hata varsa saklama
- Sonucu `changelog.md` dosyasına yaz
- Yeni karar varsa `decisions.md` dosyasına yaz
- Yeni ders varsa `lesson.md` dosyasına yaz
- `todo.md` dosyasını güncelle

Şimdi yalnızca `todo.md` içindeki aktif görevden başla. Başka faza atlama.
