# Güncel Faz Mimarisi

## Güncel Faz

Faz 6: SEO, Performans ve Erişilebilirlik

Faz 0–5 tamamlandı. Faz 7 (yayına alma) kullanıcı erişimi olmadan başlatılamaz:
WordPress yedeği, DNS ve hosting hesabı gerekiyor.

### Uygulanan mimari

```text
src/
  content/          # migrate.py üretir; elle düzenlenmez
    posts/*.json    # 457
    pages/*.json    # 16
    taxonomy.json
  components/       # Nav, Footer, Sidebar
  layouts/Base.astro
  lib/content.ts    # koleksiyon sorguları
  pages/
    index.astro
    [...slug].astro # yazı + sayfa + kategori
    blog/[...page].astro
    arama.astro
    404.astro
    rss.xml.ts
    search-index.json.ts
  styles/           # tokens.css + global.css
  types/content.ts
public/media/       # 1809 dosya
scripts/
  wordpress/        # inventory, url-map, migrate, resolve-redirects
  build/            # flatten-html-routes, generate-redirects, verify-*
```

### Doğrulama zinciri

```bash
npm run build     # astro build + flatten
npm run verify    # URL koruması + içerik adedi
node scripts/build/verify-content.mjs
npx astro check   # tip kontrolü
```

---

## Arşiv — Faz 0: Keşif, Yedekleme ve Envanter

Bu dosya yalnızca o anda aktif olan fazın uygulanma detaylarını içerir. Faz değiştiğinde eski içerik silinmez; ilgili bölüm `decisions.md`, `changelog.md` ve gerekirse arşiv dosyasına taşınır.

## Faz 0 Teknik Hedefleri

1. Mevcut WordPress kurulumunu değiştirmeden analiz etmek
2. İçerik ve URL envanteri çıkarmak
3. Taşınması gereken özel WordPress yapılarını belirlemek
4. Yeni sistem için veri modeli hazırlamak
5. Göç sürecinin tekrar çalıştırılabilir olmasını sağlamak

## Kaynak Sistem İncelemesi

> Public erişimle toplanabilen bilgiler T-001'de çıkarıldı: `docs/inventory/REPORT.md`.
> Aşağıdaki listede panel/SSH gerektiren maddeler raporun §11 "Bilinmeyenler" bölümünde bloke olarak izleniyor.

Toplanacak bilgiler:

- WordPress sürümü
- PHP sürümü
- Veritabanı sürümü
- Aktif tema ve child theme
- Aktif/pasif eklentiler
- Custom post type'lar
- Custom taxonomy'ler
- ACF veya benzeri özel alanlar
- Shortcode'lar
- Gutenberg/classic editor dağılımı
- Elementor veya page builder kullanımı
- SEO eklentisi ve metadata alanları
- Formlar
- Redirectler
- Medya kütüphanesi
- Harici gömüler
- İndirme dosyaları
- Yorumlar
- Menü ve widget yapıları

## Önerilen Hedef Mimari

```text
src/
  app-or-pages/
  components/
    layout/
    navigation/
    hero/
    portfolio/
    plugins/
    courses/
    blog/
    sidebar/
    contact/
    motion/
  content/
  lib/
    cms/
    migration/
    seo/
    redirects/
    analytics/
    validation/
  styles/
  types/
  tests/
scripts/
  wordpress/
public/
docs/
```

## İçerik Modeli

### Post

- id
- legacyId
- title
- slug
- excerpt
- content
- publishedAt
- modifiedAt
- author
- categories
- tags
- featuredImage
- seoTitle
- seoDescription
- canonicalUrl
- legacyUrl
- status
- migrationChecksum

### Project

- title
- slug
- summary
- description
- type
- technologies
- coverImage
- gallery
- externalUrl
- videoUrl
- featured
- order

### Product / Plugin

- title
- slug
- shortDescription
- longDescription
- version
- compatibility
- features
- screenshots
- demoVideo
- purchaseContact
- status
- featured

### Achievement

- title
- issuer
- date
- description
- proofUrl
- image

## WordPress Göç Akışı

```text
WordPress export/API
    ↓
Raw snapshot
    ↓
Normalization
    ↓
HTML/shortcode transformation
    ↓
Media download and mapping
    ↓
Internal link rewriting
    ↓
Schema validation
    ↓
Target CMS/content repository
    ↓
Count and checksum verification
    ↓
Redirect map
```

## Migration Kuralları

- Kaynak veri salt okunur kabul edilir.
- Ham export değişmeden saklanır.
- Her içerik legacy ID taşır.
- Script tekrar çalıştırıldığında kopya üretmez.
- Slug değişirse redirect zorunludur.
- Görsel indirilemezse işlem sessizce geçilmez; hata raporuna yazılır.
- Shortcode kaldırılmadan önce anlamı belirlenir.
- HTML sanitize edilir; içerik keyfi biçimde özetlenmez.
- Türkçe karakterler ve URL encoding test edilir.
- Yayın tarihi korunur.
- SEO başlığı ve açıklaması varsa taşınır.
- İç linkler yeni URL'lere dönüştürülür.

## Frontend İlkeleri

- Server-rendered veya statically generated içerik tercih edilir.
- Blog JS kapalıyken de okunabilir olmalıdır.
- Animasyonlar progressive enhancement olmalıdır.
- `prefers-reduced-motion` desteklenmelidir.
- Büyük hero medya öğeleri mobilde farklı asset kullanmalıdır.
- LCP görseli lazy-load edilmemelidir.
- Diğer görseller lazy-load edilmelidir.
- Layout shift oluşturacak ölçüsüz medya kullanılmamalıdır.

## Animasyon Mimarisi

Öncelik:

1. CSS transition
2. CSS keyframes
3. IntersectionObserver
4. Gerekirse Motion/GSAP

Kurallar:

- Sadece animasyon için React eklenmez.
- Scroll-jacking yapılmaz.
- Parallax mobilde azaltılır veya kapatılır.
- Hover özelliği olmayan cihazlarda hover davranışına güvenilmez.
- Cursor efektleri erişilebilirlik ve performans kontrolünden sonra eklenir.

## Test Stratejisi

- Unit: veri dönüştürme ve yardımcı fonksiyonlar
- Integration: WordPress içerik eşleme
- E2E: navigasyon, blog, form, redirect
- Visual regression: ana sayfa ve kritik breakpoint'ler
- Content parity: kaynak/hedef adet ve checksum
- SEO: canonical, metadata, sitemap ve schema
- Accessibility: axe ve klavye testi
