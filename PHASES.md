# Proje Fazları

## Faz 0 — Keşif, Yedekleme ve Envanter

Amaç: Mevcut WordPress sitesini eksiksiz anlamak ve güvenli geçiş zemini oluşturmak.

Çıktılar:

- WordPress tam dosya ve veritabanı yedeği
- Yazı, sayfa, kategori, etiket, medya ve kullanıcı envanteri
- URL listesi ve trafik açısından kritik sayfalar
- Aktif tema ve eklenti listesi
- Formlar, kısa kodlar ve gömülü içerik listesi
- Kırık bağlantı ve tekrar eden içerik raporu
- Analytics ve Search Console doğrulaması
- Görsel ve içerik telif/lisans kontrol listesi
- Teknik risk raporu

Tamamlanma kriteri:

- Eski sitedeki içerik sayıları kayıt altına alınmış olmalı.
- Tüm URL'ler dışa aktarılmış olmalı.
- Geri yüklenebilir yedek doğrulanmış olmalı.

## Faz 1 — Tasarım Stratejisi ve Prototip

Amaç: Premium görsel yönü ve ana sayfa deneyimini doğrulamak.

Çıktılar:

- Tasarım tokenları
- 60–30–10 renk sistemi
- Tipografi sistemi
- Masaüstü ana sayfa prototipi
- Özel mobil tasarım
- Hero, proje kartı, blog kartı, CTA ve footer bileşenleri
- Animasyon prensipleri
- Reduced-motion davranışı
- Erişilebilirlik ön kontrolü

Tamamlanma kriteri:

- Başlıkların tamamen dolu sarı olduğu doğrulanmalı.
- Mobil görünüm ayrıca tasarlanmış olmalı.
- Ana navigasyon ve içerik hiyerarşisi onaylanmış olmalı.

## Faz 2 — Uygulama Temeli

Amaç: Üretime uygun teknik temel ve tasarım sistemini kurmak.

Çıktılar:

- Framework kurulumu
- TypeScript ve lint ayarları
- Tailwind ve tasarım tokenları
- Ortam değişkenleri şablonu
- Bileşen mimarisi
- Route yapısı
- SEO altyapısı
- Test altyapısı
- CI kontrolleri
- Hata ve loglama yaklaşımı

Tamamlanma kriteri:

- Build hatasız çalışmalı.
- Lint ve type-check geçmeli.
- Ana bileşenler Storybook veya örnek sayfa üzerinde doğrulanmalı.

## Faz 3 — Ana Sayfa ve Portföy Modülleri

Amaç: Ufuk Şen markasını etkili biçimde anlatan ana deneyimi oluşturmak.

Çıktılar:

- Hero
- Uzmanlık alanları
- Eklentiler
- Eğitimler
- Seçili projeler
- YouTube kanalları
- Başarılar ve sertifikalar
- Blog önizleme ve sağ sütun
- İletişim
- Responsive navigasyon
- Mikro etkileşimler

Tamamlanma kriteri:

- Tüm ana CTA'lar çalışmalı.
- Klavye ile gezinme mümkün olmalı.
- Mobilde yatay taşma olmamalı.

## Faz 4 — WordPress İçerik Göçü

Amaç: Mevcut yazıları ve önemli bilgileri veri kaybı olmadan yeni sisteme taşımak.

Çıktılar:

- İçerik eşleme şeması
- Migration script
- Yazı gövdesi dönüştürme
- Görsel indirme ve yeniden eşleme
- Kategori/etiket aktarımı
- Yazar, tarih, slug ve SEO alanları
- İç link dönüştürme
- Redirect haritası
- İçerik doğrulama raporu
- Tekrar çalıştırılabilir idempotent migration

Tamamlanma kriteri:

- Yazı sayısı kaynakla eşleşmeli.
- Örneklem ve otomatik kontroller başarılı olmalı.
- Kritik URL'ler doğru içeriğe gitmeli.
- Görsellerde kayıp olmamalı.

## Faz 5 — Blog, Arama ve İçerik Yönetimi

Amaç: Yeni sistemde içerik yayınlama ve keşfetme deneyimini tamamlamak.

Çıktılar:

- Blog listeleme
- Yazı detay sayfası
- Kategori ve etiket sayfaları
- Site içi arama
- Sağ sütun bileşenleri
- İlgili yazılar
- Okuma süresi
- RSS
- Sitemap
- Open Graph ve sosyal paylaşım görselleri

## Faz 6 — SEO, Performans ve Erişilebilirlik

Amaç: Siteyi teknik olarak üretim seviyesine getirmek.

Çıktılar:

- Core Web Vitals optimizasyonu
- Görsel optimizasyonu
- Font optimizasyonu
- Structured data
- Canonical URL
- 301 yönlendirmeleri
- 404 ve 500 sayfaları
- WCAG kontrolleri
- Lighthouse raporu
- Güvenlik başlıkları

## Faz 7 — İçerik Kontrolü ve Yayına Alma

Amaç: Kontrollü ve geri alınabilir geçiş yapmak.

Çıktılar:

- Staging kabul testi
- DNS ve hosting planı
- Bakım penceresi
- Son içerik senkronizasyonu
- Redirect uygulaması
- Analytics ve Search Console bağlantıları
- Production smoke test
- Rollback planı

## Faz 8 — Yayın Sonrası İzleme ve Geliştirme

Amaç: Gerçek kullanıcı verileriyle sistemi iyileştirmek.

Çıktılar:

- 404 ve redirect takibi
- Arama sorgusu ve trafik analizi
- Web Vitals takibi
- Dönüşüm ölçümü
- İçerik iyileştirme listesi
- Yeni özellik backlog'u
