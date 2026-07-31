# Ufuk Şen Kişisel Marka ve İçerik Platformu

## 1. Projenin Tanımı

Bu proje, mevcut `https://www.ufuksen.com/` WordPress sitesini; daha hızlı, daha güçlü, premium görünümlü, mobil odaklı, SEO güvenli ve uzun vadede geliştirilebilir bir kişisel marka platformuna dönüştürür.

Yeni site yalnızca bir portföy sayfası olmayacaktır. Aşağıdaki işlevleri tek bir tutarlı dijital merkezde birleştirecektir:

- Ufuk Şen'in kişisel ve profesyonel kimliği
- 3D tasarım, modelleme ve görselleştirme uzmanlığı
- SketchUp, Twinmotion, D5 Render, Enscape ve ilgili eğitim içerikleri
- Geliştirilen SketchUp eklentileri ve dijital araçlar
- YouTube kanalları ve video projeleri
- Geopolitica Marco ve benzeri medya projeleri
- Geostrategic Map Studio AI ve özel web araçları
- Mevcut WordPress blog yazılarının eksiksiz aktarılması
- Başarılar, sertifikalar, eğitimler ve ürünler
- İletişim ve sosyal medya bağlantıları

## 2. Projenin Sahibi

- Ad: Ufuk Şen
- Rol: 3D Görselleştirme Uzmanı, Eğitmen, Dijital İçerik Üreticisi ve Yazılım/eklenti geliştiricisi
- Ana lokasyon: Ankara, Türkiye
- Hedef kitle:
  - Mimarlar
  - İç mimarlar
  - 3D görselleştirme uzmanları
  - SketchUp kullanıcıları
  - Render ve modelleme öğrencileri
  - Dijital içerik üreticileri
  - Eğitim ve eklenti satın almak isteyen profesyoneller
  - Ufuk Şen'in projelerini ve uzmanlığını inceleyen potansiyel iş ortakları

## 3. Ana Hedef

Ziyaretçinin ilk 5–8 saniyede şu üç şeyi anlaması gerekir:

1. Ufuk Şen kimdir?
2. Hangi profesyonel değeri üretir?
3. Hangi içerik, eğitim, araç veya projeye ulaşabilir?

## 4. Başarı Ölçütleri

- Core Web Vitals değerlerinin “iyi” aralıkta olması
- Lighthouse performans puanı hedefi: mobilde en az 90
- Lighthouse erişilebilirlik hedefi: en az 95
- Eski WordPress URL'lerinin trafik ve SEO kaybetmeden taşınması
- 404 oranının minimumda tutulması
- Mobil menü ve içerik akışının masaüstünden ayrı olarak tasarlanması
- Ana sayfadan blog, projeler, eklentiler ve iletişime net geçiş
- Yönetilebilir ve tekrar kullanılabilir içerik modeli
- Yeni yazı ekleme sürecinin teknik bilgi gerektirmemesi
- Tüm kritik içeriklerin Türkçe karakterlerle doğru çalışması
- Görsellerde responsive boyutlandırma, lazy loading ve modern format kullanımı

## 5. Ürün İlkeleri

- “Gösterişli” değil, “pahalı ve kontrollü” görünüm
- Animasyon, içeriğin önüne geçmemeli
- Site bir şablon gibi görünmemeli
- Her bölümün bir amacı ve ölçülebilir kullanıcı aksiyonu olmalı
- Masaüstü ve mobil aynı tasarımın küçültülmüş hali olmamalı
- Tasarım sistemi baştan kurulmalı; rastgele sınıflar biriktirilmemeli
- İçerik göçü doğrulanmadan eski WordPress sitesi kapatılmamalı
- Geri alınabilir, test edilebilir ve belgelenmiş değişiklikler yapılmalı

## 6. Görsel Kimlik

### 60–30–10 renk düzeni

- %60: koyu ana zemin — near-black / graphite / deep slate
- %30: ikincil yüzeyler — koyu gri, çelik tonu, kart yüzeyleri
- %10: vurgu — tamamen dolu sarı

### Kritik başlık kuralı

Ana başlıklar ve bölüm başlıkları tamamen dolu sarı olmalıdır.

Yasak:

- Siyah dolgu + sarı kontur
- Sarı yalnızca stroke/outline
- Okunabilirliği bozan neon glow
- Her metni sarı yapmak

### Tipografi

- Inter ve Roboto kullanılmayacak.
- Öncelikli seçenekler:
  - Geist / Geist Mono
  - Space Grotesk
  - Sora
  - Manrope
  - Archivo
  - Editorial karakter için uygun bir serif + keskin sans-serif eşleşmesi
- Font lisansı ve web performansı kontrol edilmeden font eklenmeyecek.

## 7. Ana Sayfa Bilgi Mimarisi

Ana sayfa etkileyici bir uzun kaydırmalı deneyim olacaktır; fakat blog ve detay içerikleri ayrı URL'lerde çalışacaktır. “Single-page scroll” talebi ana sayfanın görsel akışı için geçerlidir, tüm sitenin tek HTML sayfasına sıkıştırılması anlamına gelmez.

Önerilen sıra:

1. Hero
2. Güven / hızlı başarı göstergeleri
3. Hakkımda ve uzmanlık
4. Seçili eklentiler ve dijital ürünler
5. Seçili eğitimler
6. Projeler ve özel araçlar
7. YouTube ve medya kanalları
8. Son blog yazıları
9. Sağ sütunda popüler / güncel blog akışı
10. Sertifikalar ve başarılar
11. Referanslar veya kullanıcı geri bildirimleri
12. İletişim
13. Footer

## 8. Blog Yerleşimi

- Masaüstünde ana içerik + sağ sütun kullanılabilir.
- Sağ sütun sticky olabilir; ancak footer'a çarpmamalıdır.
- Mobilde sağ sütun, ana içeriğin altına mantıklı bir sırayla taşınmalıdır.
- Sağ sütunda:
  - Son yazılar
  - Popüler yazılar
  - Kategoriler
  - Arama
  - Öne çıkan eğitim/eklenti çağrısı
- Blog kartlarında tarih, kategori, okuma süresi ve görsel bulunmalıdır.

## 9. Teknik Yaklaşım

İlk görsel prototip gerekirse HTML + Tailwind ile hazırlanabilir. Üretim sistemi için tercih:

- Next.js veya Astro
- TypeScript
- Tailwind CSS
- Headless CMS veya yeni içerik yönetim katmanı
- WordPress REST API / WPGraphQL / XML export ile içerik aktarımı
- Statik üretim ve gerektiğinde yeniden doğrulama
- SEO metadata, sitemap, RSS, canonical URL ve redirect yönetimi

Kesin framework kararı teknik keşif sonrası `decisions.md` içinde kaydedilecektir.

## 10. Kapsam Dışı

İlk sürümde aşağıdakiler zorunlu değildir:

- Üyelik sistemi
- Karmaşık e-ticaret
- Canlı kurs platformu
- Çoklu dil
- Mobil uygulama
- Kullanıcı forumu

Bunlar daha sonraki fazlara karar kaydı ile eklenebilir.

## 11. Claude Code Başlangıç Talimatı

Projeye başlamadan önce:

1. Bu klasördeki tüm `.md` dosyalarını oku.
2. Özellikle `AGENTS.md`, `todo.md`, `architecture.md`, `decisions.md` ve `lesson.md` dosyalarını incele.
3. Mevcut kodu ve dosya ağacını analiz et.
4. Çalışan sistemi bozmadan önce test ve geri dönüş planı oluştur.
5. Büyük değişiklikleri küçük, doğrulanabilir adımlara böl.
6. Her tamamlanan işten sonra ilgili belgeleri güncelle.
