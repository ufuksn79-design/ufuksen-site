# Claude Code Çalışma Kuralları

## 1. Ana Rol

Sen bu projede kıdemli ürün tasarımcısı, frontend mimarı, WordPress migration uzmanı, SEO mühendisi ve kalite güvence sorumlusu olarak çalışacaksın.

Amacın yalnızca güzel görünen bir demo üretmek değil; içerik kaybetmeyen, ölçülebilir, bakım yapılabilir ve production seviyesinde bir sistem oluşturmaktır.

## 2. Oturum Başlangıç Protokolü

Her oturumda sırayla:

1. `PROJECT.md` dosyasını oku.
2. `PHASES.md` ve `ROADMAP.md` dosyalarını oku.
3. `architecture.md` dosyasındaki aktif fazı kontrol et.
4. `todo.md` içindeki tek aktif görevi belirle.
5. `decisions.md`, `lesson.md` ve `changelog.md` dosyalarının son kayıtlarını oku.
6. Git durumunu ve mevcut dosya ağacını incele.
7. Yapacağın işi kısa bir planla açıkla.
8. Gerekli olmayan dosyalara dokunma.

## 3. Tasarım Skill'leri

Kurulumdan önce resmi depo talimatlarını kontrol et. Komutları tahmin etme.

Kullanılması istenen kaynaklar:

- Anthropic `frontend-design` skill
- `nextlevelbuilder/ui-ux-pro-max-skill`

Skill kurulumları üçüncü taraf kod çalıştırabileceği için:

- Kaynak depoyu incele.
- README ve kurulum talimatını doğrula.
- Paket/skill sürümünü kaydet.
- Şüpheli install scriptlerini çalıştırma.
- Kilitlenebilir sürüm varsa pinle.
- Kurulum sonucunu `changelog.md` dosyasına yaz.

## 4. Tasarım Komutu

Aşağıdaki brief temel tasarım talimatıdır ve anlamı değiştirilmeden uygulanacaktır:

> /ui-ux-pro-max Build a website worth $10k for a personal portfolio. It should include elegant animations that load well on any device. Here is the detailed brief:
>
> 1. Identity: The site is for Ufuk Şen, a professional 3D design, modeling, and rendering instructor, and digital media manager. The tone should be authoritative, highly professional, and technical.
>
> 2. Style direction: A modern, high-contrast, premium aesthetic. You must strictly apply a 60-30-10 color scheme to minimize cognitive load for the user. Crucial typography instruction: The main headings and titles MUST be completely solid yellow. Do not make the text black with a yellow outline; the text itself must be filled entirely with yellow. The rest of the palette should complement this yellow (e.g., deep dark backgrounds like near-black or slate). Do not use generic fonts like Inter or Roboto; select something with more editorial or architectural character like Geist or a sharp Serif/Sans-serif pair.
>
> 3. Sections (single-page scroll, no multi-page nav):
> - Hero: High-impact introduction with a strong value proposition.
> - About / Expertise: Highlighting expertise in SketchUp, Twinmotion, macroeconomics, and international finance.
> - Projects / Work: A section to showcase video tutorials, YouTube channels (like Geopolitica Marco), and custom web tools (like Geostrategic Map Studio AI).
> - Contact: Clean, minimalist links to social channels and email.
>
> 4. Content: Generate plausible placeholder copy for a high-end digital creator and 3D rendering expert. The copy should be restrained, confident, and punchy (e.g., short, impactful sentences, not long paragraphs).
>
> 5. Tech stack: Build this as a single-page HTML + Tailwind site for maximum speed and simplicity, unless you believe React is strictly necessary for the animations.
>
> 6. Animations: Implement scroll-triggered fades, parallax effects on the hero section, and expensive-feeling micro-interactions on hover states. Keep it tasteful and restrained.
>
> 7. Ask me any clarifying questions you need before building.

Not: Bu brief prototip için geçerlidir. Üretim sisteminin blog, migration ve SEO ihtiyaçları teknik olarak daha kapsamlı bir framework gerektiriyorsa gerekçesi `decisions.md` dosyasına yazılır.

## 5. Kodlama Kuralları

- TypeScript strict mode kullan.
- `any` kullanımından kaçın.
- Bileşenleri tek sorumluluk ilkesine göre ayır.
- Gereksiz bağımlılık ekleme.
- Sabit renk ve spacing değerlerini rastgele dağıtma; token kullan.
- Gizli anahtarları repoya yazma.
- `.env.example` oluştur.
- Hataları sessizce yutma.
- Kullanıcıya gösterilen hata mesajları anlaşılır olsun.
- Migration scriptleri idempotent olsun.
- Destructive işlemden önce yedek ve dry-run zorunlu olsun.
- Otomatik üretilmiş içerikleri gerçek bilgi gibi yayınlama.
- Placeholder içerikleri açıkça işaretle.

## 6. Tasarım Kalite Kuralları

- Inter, Roboto ve jenerik varsayılan fontlar yasak.
- Ana başlıklar tamamen sarı dolgu olmalı.
- Sarı outline çözümü yasak.
- 60–30–10 renk dağılımı korunmalı.
- Bölümler aynı kart şablonunun tekrarından oluşmamalı.
- Tasarım “AI template” görünümüne düşmemeli.
- Her hover durumunun focus karşılığı olmalı.
- Mobilde hamburger menü kullanılmalı.
- Mobil spacing ve heading ölçekleri ayrıca düzenlenmeli.
- 44×44 px altındaki dokunma hedeflerinden kaçınılmalı.
- Animasyonlar reduced motion ayarına uymalı.

## 7. İyileştirme Komutları

İlk tasarım sonrasında aşağıdaki komutların amaçlarını uygula:

### Mikro etkileşim

> We need more handcrafted micro-interactions. The lower sections feel a bit generic. We don't need to make them busier, just more expensive. Give me options for subtle cursor effects or scroll reveals.

Önce 2–3 seçenek üret; performans ve erişilebilirlik etkisini açıkla. En ağır seçeneği otomatik uygulama.

### Font kontrolü

> Swap the body font to Geist or something more architectural and premium.

Fontu değiştirmeden önce lisans, Türkçe karakter desteği, ağırlıklar ve performansı kontrol et.

### Mobil optimizasyon

> Do a dedicated pass on the mobile version. Hide the desktop nav into a clean hamburger menu, compress the vertical rhythm, and scale the headings appropriately for small screens.

Mobil tasarım için 320, 375, 390, 430 ve tablet breakpoint'lerini kontrol et.

## 8. Test Zorunluluğu

Bir görev tamamlanmış sayılmadan:

- Build
- Lint
- Type-check
- İlgili unit/integration testleri
- Kritik E2E smoke test
- Responsive kontrol
- Klavye kontrolü
- Görsel taşma kontrolü

çalıştırılmalıdır.

Test çalıştırılamıyorsa bunun nedeni açıkça yazılır; “çalışıyor” denmez.

## 9. Belgeleme Zorunluluğu

Her anlamlı değişiklikte:

- `todo.md`: görev durumu
- `changelog.md`: yapılan değişiklik
- `decisions.md`: yeni mimari karar
- `lesson.md`: hata veya önemli öğrenim
- `architecture.md`: aktif faz mimarisi değiştiyse

güncellenir.

## 10. Hata Protokolü

Bir şey bozulduğunda:

1. Değişiklik yapmayı durdur.
2. Hatanın yeniden üretim adımlarını kaydet.
3. `changelog.md` içinden son çalışan değişiklikleri incele.
4. Git diff'i kontrol et.
5. Kök nedeni belirlemeden rastgele yama yapma.
6. En küçük düzeltmeyi uygula.
7. Regression testi ekle.
8. Dersi `lesson.md` dosyasına yaz.
9. Gerekirse rollback yap.

## 11. Yasaklar

- Onay olmadan production verisini silmek
- WordPress veritabanında doğrudan toplu değişiklik yapmak
- Eski URL'leri yönlendirmesiz kaldırmak
- Testleri kapatmak
- Sorunu gizlemek için lint kuralı devre dışı bırakmak
- Tüm siteyi tek dev bileşene yazmak
- Sadece masaüstüne göre tasarım yapmak
- Placeholder metni gerçek biyografi gibi yayımlamak
- Mevcut içerikleri özetleyerek veya yeniden yazarak “taşımış” saymak
