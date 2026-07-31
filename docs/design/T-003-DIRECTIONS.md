# T-003 — Tasarım Tokenları ve İki Ana Sayfa Yönü

- Tarih: 2026-07-30
- Çıktılar: `src/styles/tokens.css`, `prototypes/direction-a.html`, `prototypes/direction-b.html`, `prototypes/index.html`
- Önizleme: `http://localhost:4321/prototypes/index.html`

## 1. Font Kararı — Kanıta Dayalı

`AGENTS.md` §7, lisans ve Türkçe karakter doğrulaması yapılmadan font eklenmesini yasaklıyor. Doğrulama iki aşamada yapıldı.

### Adım 1 — unicode-range analizi

Google Fonts CSS'i çekilip `unicode-range` bildirimleri kod noktalarıyla karşılaştırıldı:

| Font | latin-ext | Ğ ğ İ ı Ş ş | Ö Ü Ç | Eksik |
|---|---|---|---|---|
| Geist | ✅ | ✅ | ✅ | yok |
| Geist Mono | ✅ | ✅ | ✅ | yok |
| Fraunces | ✅ | ✅ | ✅ | yok |

### Adım 2 — Gerçek glif çizim testi

`unicode-range` yalnızca hangi dosyanın indirileceğini söyler; glifin var olduğunu kanıtlamaz. Bu yüzden tarayıcıda canvas üzerine çizim yapılıp, atanmamış bir kod noktasının (tofu) piksel imzasıyla karşılaştırıldı:

| Karakter | Mürekkep pikseli | Tofu'ya eşit mi? |
|---|---|---|
| Ğ | 418 | hayır |
| ğ | 381 | hayır |
| İ | 165 | hayır |
| ı | 105 | hayır |
| Ş | 386 | hayır |
| ş | 292 | hayır |
| Ö / Ü / Ç | 426 / 352 / 359 | hayır |

Tofu referansı: 63 piksel. Dokuz karakterin tamamı ayrı, gerçek glif olarak çiziliyor. `İ` (165) ile `ı` (105) arasındaki fark noktanın varlığını da doğruluyor.

### Seçim

| Font | Rol | Lisans | Ağırlık |
|---|---|---|---|
| **Geist** | Gövde ve Yön A başlıkları | SIL OFL 1.1 | değişken 400–900 |
| **Geist Mono** | Etiket, sayı, teknik metin | SIL OFL 1.1 | 400–500 |
| **Fraunces** | Yön B başlıkları | SIL OFL 1.1 | değişken opsz+wght |

Inter ve Roboto kullanılmadı (`AGENTS.md` §6). Performans: yalnızca `latin` + `latin-ext` alt kümeleri gerekiyor; Geist için 5 woff2 dosyasının 2'si.

## 2. Tasarım Tokenları

`src/styles/tokens.css` tek kaynaktır. Rastgele renk/spacing değeri dağıtılmadı.

### 60–30–10 renk sistemi

| Pay | Rol | Değer |
|---|---|---|
| %60 | Ana zemin | `#0B0C0E` (`--c-base`), `#060708` (`--c-base-deep`) |
| %30 | İkincil yüzeyler | `#131519`, `#1B1E24`, `#22262D` + çizgiler |
| %10 | Vurgu | `#FFD400` (`--c-accent`) |

### Kritik başlık kuralı

`h1, h2, h3` için `color` **ve** `-webkit-text-fill-color` sarıya, `-webkit-text-stroke` sıfıra sabitlendi. Outline/stroke çözümü yapısal olarak engellendi.

Doğrulama: her iki prototipteki **32 başlığın tamamı** `rgb(255, 212, 0)` dolgu, `0px` stroke.

### Diğer token grupları

Akışkan tipografi ölçeği (`clamp`), 4px tabanlı spacing, bölüm ritmi, yarıçap, hareket (easing + süre), `--tap-min: 44px`, z-index katmanları.

`prefers-reduced-motion: reduce` altında tüm süreler 1ms'e iner ve `scroll-behavior` kapanır (ADR-005).

## 3. İki Yön

### Yön A — "Blueprint"

Mimari çizim mantığı: numaralı bölümler, ince ayırıcı çizgiler, asimetrik ızgara, mono etiketler. Kart yok — ızgara satırları ve bölünmüş paneller. Sarı **işaret** olarak kullanılıyor.

Hero'da parallax mimari ızgara katmanı (yalnızca ≥1024px ve hareket izni varken).

### Yön B — "Atölye"

Sinematik derinlik: katmanlı yüzeyler, radyal ışık kuyuları, editoryal serif başlıklar (Fraunces). Yumuşak kartlar, uzmanlık için sayaç şeritleri. Sarı **ışık kaynağı** olarak kullanılıyor.

Hero'da parallax ışık katmanı.

### Karşılaştırma

| Ölçüt | Yön A | Yön B |
|---|---|---|
| Karakter | Teknik, ölçülü | Editoryal, sıcak |
| Font ailesi sayısı | 2 | 3 |
| Blog yoğunluğuna uyum | Yüksek — 457 yazılık liste doğal durur | Orta — kart tekrarı riski |
| "AI şablonu" riski | Düşük | Orta |
| Yatay taşma (320–430px) | Yok | Yok |
| 44px altı dokunma hedefi | 0 | 0 |

**Öneri:** Yön A. Gerekçe: arşiv 457 yazı ve 27 kategori içeriyor; A'nın liste/satır dili bu yoğunlukta kart tekrarına düşmüyor ve `AGENTS.md` §6'nın "bölümler aynı kart şablonunun tekrarından oluşmamalı" kuralına daha güvenli uyuyor. B'nin ışık kuyuları ve serif başlıkları hero ile iletişim bölümüne alınabilir.

Karar kullanıcıya aittir; ikisi birleştirilebilir.

## 4. Tarayıcı Doğrulaması

Chrome, yerel sunucu (`http://localhost:4321`). Konsol hatası: **yok** (her iki sayfa).

| Kontrol | 320px | 375px | 430px | 1280px |
|---|---|---|---|---|
| Yatay taşma | yok | yok | yok | yok |
| 44px altı dokunma hedefi | 0 | 0 | 0 | 0 |
| Hamburger görünür | ✅ | ✅ | ✅ | gizli (masaüstü nav) |

Ek doğrulamalar:

- **Klavye:** Hamburger odaklanabiliyor, `aria-expanded` doğru değişiyor, `aria-label` güncelleniyor, `Escape` menüyü kapatıp odağı düğmeye geri veriyor. Her iki yönde de doğrulandı.
- **Progressive enhancement:** `js` sınıfı kaldırıldığında (JS kapalı senaryosu) 28 reveal öğesinin **0'ı** gizli kalıyor — içerik JS olmadan tamamen okunabilir (`architecture.md` frontend ilkeleri).
- **Font yüklemesi:** `document.fonts.check` ile Geist, Geist Mono ve Fraunces yüklü doğrulandı.
- **Başlık dolgusu:** 32/32 başlık dolu sarı, stroke 0.

## 5. Doğrulamada Yakalanan ve Düzeltilen Üç Hata

Bu bölüm önemlidir: üçü de tarayıcıda ölçüm yapılmasaydı fark edilmeyecekti.

### 5.1 — 44px altı dokunma hedefleri

375px'te 15 etkileşimli öğe 44px altındaydı (panel linkleri 23px, widget linkleri 36px, logo 23px). Bağımsız aksiyon linklerine `min-height: var(--tap-min)`, satır içi başlık linklerine dikey dolgu verildi. Metin akışını bozmamak için prose linkleri hariç tutuldu. Sonuç: 0.

### 5.2 — 320px'te yatay taşma (kök neden: `min-width: auto`)

320px'te `scrollWidth` 369'du. İlk tahminim başlık boyutuydu; ölçüm bunu çürüttü. Gerçek neden: ızgara/esnek kutu öğelerinin varsayılan `min-width: auto` değeri, öğenin min-content genişliğinin altına inmesini engelliyor. `overflow-wrap: break-word` bu katkıyı **değiştirmiyor**.

Çözüm `tokens.css` içinde tek yerde: `:where(body *) { min-width: 0 }`. `:where()` özgüllüğü 0 tuttuğu için bileşenler gerektiğinde ezebilir. Sonuç: 320px'te `scrollWidth` = 320.

### 5.3 — Masaüstünde kelime ortadan bölünüyordu

Ekran görüntüsünde `dönüştürüyorum.` kelimesi `dönüştürüyoru / m.` diye bölünmüş görünüyordu. DOM ölçümleri bunu yakalayamadı çünkü teknik olarak taşma yoktu — yalnızca görsel olarak kabul edilemezdi.

Neden: hero başlığı 1.35fr'lik dar sütundaydı ve 104px punto ile sığmıyordu; §5.2'de eklenen kırılma davranışı devreye giriyordu. Çözüm: başlık masaüstünde tam genişliğe alındı, lead/CTA ve sayısal blok altına iki sütuna dağıtıldı.

## 6. Bilinçli Sapmalar

### Tailwind kullanılmadı

`MASTER_PROMPT.md` prototip için "HTML + Tailwind" öneriyor. Prototipler token tabanlı el yazımı CSS ile yazıldı. Gerekçe ADR-010'da; özetle CDN tarayıcı derleyicisi 281KB'lık bir runtime ekliyor ve Faz 1'in amacı olan "premium ve hızlı deneyimi doğrulama"yı ölçülemez kılıyor. Üretim sisteminde Tailwind gerçek bir derleme adımıyla kullanılacak.

### Placeholder içerik işaretli

Tüm yer tutucu metinler sayfa başındaki uyarı şeridi ve satır içi "yer tutucu" etiketleriyle işaretlendi (`AGENTS.md` §5). Hiçbir yer tutucu gerçek biyografi gibi sunulmadı.

## 7. Açık Kalanlar

- Ana sayfa yönü seçimi kullanıcıya bırakıldı (A önerildi).
- Gerçek görsel, video ve proje içeriği yok — medya ile birlikte yeniden değerlendirilmeli.
- Lighthouse ölçümü yapılmadı; anlamlı olması için üretim derlemesi gerekiyor (Faz 6).
- Mikro etkileşim cilalaması (`MASTER_PROMPT.md` "Animasyon cilalama") ayrı görev olarak T-007'ye alındı.

## 8. Yeniden Üretme

```bash
python -m http.server 4321 --directory ufuksen.com
```

Ardından `http://localhost:4321/prototypes/index.html` adresini açın.
