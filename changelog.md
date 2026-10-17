# Değişiklik Günlüğü

Format, Keep a Changelog yaklaşımına yakındır. Tarihler `YYYY-MM-DD` biçiminde tutulur.

## [Unreleased]

### Added

- Proje kapsamı ve hedef kitlesi
- Faz bazlı geliştirme planı
- 10 haftalık başlangıç yol haritası
- Aktif faz mimarisi
- İlk görev listesi
- Claude Code çalışma kuralları
- Mimari karar kayıtları
- Öğrenilen dersler sistemi
- WordPress migration güvenlik kuralları
- Premium tasarım brief'i
- Mobil, performans, SEO ve erişilebilirlik kriterleri

### Changed

- “Tek sayfa” gereksinimi, ana sayfa deneyimi ile sınırlandırıldı.
- Üretim teknik yapısı için HTML-only zorunluluğu kaldırıldı; karar keşif fazına bırakıldı.

### Security

- Kaynak WordPress sistemi migration boyunca salt okunur kabul edildi.
- Dry-run, yedek ve rollback zorunlulukları eklendi.

## [1.6.0] — 2026-10-17

Mağaza odaklı içerik kümesi.

### Added

- **10 ihtiyaç odaklı makale**, her biri bestsketchupplugins.com'a bağlanıyor:

  | Yazı | Eklenti |
  |---|---|
  | SketchUp'ta Zemin Kaplaması Metrajı Nasıl Çıkarılır? | FloorStudio |
  | Ölçüden CNC'ye: SketchUp'ta Gömme Dolap Çizimi | Dolap Sihirbazı |
  | Pencere Teklifini Çizimden Çıkarmak | WindowFun Studio |
  | Müşteri Duvarı Kaydırdı: Modeli Baştan Çizmemek | ArchiFlow Studio |
  | Render'daki Boş Çevre Sorunu Nasıl Çözülür? | CityFill |
  | SketchUp'ta Merdiven Çizimi ve Kural Denetimi | StairFun Studio |
  | Rampa Çizimi: Eğim, Sahanlık ve Korkuluk | Rampa Stüdyosu |
  | Süpürgelik ve Kartonpiyerde Gönye Sorunu | Dynamic Skirting |
  | Perde Modellemek Neden Bu Kadar Uzun Sürüyor? | PerdeNeşe Studio |
  | Kompozit Cephe Metrajı ve Panel Bölümleme | Kompozit Studio |

- Her yazıda **3 soruluk S.S.S.** (uzun kuyruklu aramalar için) ve
  **küme içi çapraz bağlantı** — on yazı birbirine bağlı, arama motoru
  bunları tek konu kümesi olarak görüyor.

### Changed

- Tanıtım yazısındaki ürün tanımları kendi cümleleriyle yeniden yazıldı.
  Önce  alanı birebir kullanılıyordu; aynı cümle ürün kartında,
  detay sayfasında, ana sayfada ve yazıda olmak üzere dört yerdeydi.

### Doğrulama

- 10 yazı, ortalama 379 kelime, **mağaza bağlantısı olmayan yazı: 0**
- Kopya denetimi (8 kelimelik pencere, ürün sayfalarına karşı):
  tanıtım yazısı **45 → 0**; toplam örtüşme 53 → 8. Kalan 8, dört yazıda
  alıntılanan ölçüm etiketleri () — aynı işi
  adlandırdıkları için aynılar.
- Mağazaya bağlanan sayfa sayısı: **44 → 59**
- 589 sayfa;  0 hata; yeni kırık link / eksik medya: 0

## [1.5.3] — 2026-10-15

### Fixed

- **Tanımsız `--s-5` aralık jetonu.** Ölçek `--s-4`ten `--s-6`ya atlıyor;
  `--s-5` diye bir jeton yok. Yazdığım beş yerde kullanılmıştı ve tanımsız
  değişken bildirimi geçersiz kıldığı için **boşluklar hiç uygulanmıyordu**:
  yorum kartlarının dikey aralığı 0, iç boşluğu 0 kalıyordu.
  Gerçek jetonlarla değiştirildi (`/ne-demisler` ve `/egitimler`).

### Changed

- Yorum kartları arasına bir satırlık boşluk kondu (`--s-8`, 32px);
  sütun arası ve iç boşluk `--s-6` (24px).

### Doğrulama

- Ölçüldü: alt boşluk 32px, iki kart arası 52px, sütun arası 24px,
  iç boşluk 24px, 2 sütun, 37 kart
- Kaynakta kalan `var(--s-5)`: **0**

## [1.5.2] — 2026-10-15

### Changed — /ne-demisler

- **İsim kartın üstüne alındı.** Sütun akışında kartlar alt alta diziliyor;
  isim kartın altındayken bir sonraki kartın başlığı gibi okunuyordu.
  Kimin ne yazdığı artık yazıyı okumadan önce belli.
- **Çerçeve sarı oldu** (`rgba(255, 212, 0, .28)`). Koyu gri çerçeve zeminle
  neredeyse aynı tondaydı, kart sınırları seçilmiyordu. Tam doygunlukta 37
  kart gürültü olurdu; %28 saydamlıkta bırakıldı, üzerine gelince %55.
- Ayırıcı çizgi başlığın altına geçti ve o da sarıya çekildi.
- **Alt başlık:** "Ufuk Şen'in eğitim setlerini alanlar ve kendisini yakından
  tanıyanlar — 37 yorum." Meta açıklama da aynı ifadeye çekildi.

### Doğrulama

- Ölçüldü: 37 kart, çerçeve `rgba(255, 212, 0, 0.28)`, isim bloğu alıntının
  üstünde, ayırıcı çizgi başlığın altında

## [1.5.1] — 2026-10-15

### Changed

- **Deneyim yılı tek rakama çekildi: 18.** Ana sayfa tanıtım paragrafında
  "on yılı aşkın üretim birikimi" yazıyordu; uzmanlık listesi ve sayaç ise
  18 diyordu. Kullanıcı 18'i onayladı, iki dilde de düzeltildi.

### Doğrulama

- Derlenen ana sayfada geçen ifadeler: "18 yıl SketchUp eğitmenliği",
  "18 yıldır SketchUp eğitmenliği yapıyorum", sayaç `data-count="18"`
- İngilizce tarafta: "18 years teaching SketchUp", "for 18 years"
- Sitede kalan "on yılı aşkın" / "ten years" ifadesi: **0**

## [1.5.0] — 2026-10-15

Eğitim tarafı baştan kuruldu.

### Added

- **Udemy verisi tazelendi: 9 → 34 kurs.** Eğitmen profilinin dört sayfası
  tarayıcıdan okundu (`scripts/content/udemy-kurslari.mjs`). Puan, yorum,
  süre, ders sayısı ve seviye profilde yazdığı gibi; 25 kapak görseli indirildi.
  Profil toplamları: **7.273 öğrenci, 900 yorum**.
- **Dil rozeti**: Türkçe olmayan kurslarda kartta görünüyor.
  Dağılım: Türkçe 24, İngilizce 8, İspanyolca 1, Almanca 1.
- **"Eğitim konularımız" bölümü** (`/egitimler`): aktif olarak ders verilen
  başlıklar ve kapsamları — `src/content/egitim-konulari.json`.
  - **Render Fun** — ücretsiz render motoru; dersler YouTube'da ücretsiz
  - **SketchUp 2026** — kurulumdan sunuma
  - **D5 Render** — iç mekân ve iş akışı
  - **V-Ray** — yeni birebir ders yok; dersler SketchUp Türkiye kanalında
- **Render Fun ücretsiz video dersleri** listesi: 8 ders, kanalın RSS
  akışından okundu (başlıklar ve tarihler birebir).
- **Yeni yazı:** [Eğitim Setlerimiz Artık Dört Dilde](/egitim-setleri-dort-dilde.html).
  Sayılar `courses.json`'dan okunuyor, elle yazılmadı.

### Changed

- **Lumion eğitim teklifinden çıkarıldı.** Udemy'de zaten Lumion seti yok;
  uzmanlık listesinde ve eğitim konularında da geçmiyor. Arşivdeki Lumion
  yazıları ve `/yazilim/lumion` **duruyor** — trafik getiriyorlar.
- `Course` arayüzü: `puan` artık `number | null` (yeni kurslarda puan yok),
  `dil` alanı eklendi. Puansız kurslarda kart "Yeni" rozeti gösteriyor.

### Fixed

- **Yapısal veri hatası önlendi:** yorumu olmayan kursa artık
  `aggregateRating` yazılmıyor. `reviewCount: 0` olan puan yapısı
  doğrulamada hata verir ve Search Console'da uyarı olarak döner.
- Ortalama puan hesabı `null` puanda çökecekti; `?? 0` ile korundu.
- JSON-LD'de `inLanguage` artık kursun gerçek dili (hepsine "tr" yazılıyordu).

### Doğrulama

- 594 sayfa; `astro check` **0 hata**; yeni kırık link / eksik medya: 0
- `/egitimler` ölçüldü: 34 kart, 4 konu bloğu, 8 video dersi,
  10 dil rozeti, 3 "Yeni" rozeti, yatay taşma yok
- Sayaçlar: 34 set · 770 ders · 89 saat · 4,3 ortalama puan
- Yeni yazı ölçüldü: 5 ana başlık, 10 satırlık tablo, taşma yok

## [1.4.0] — 2026-10-15

### Added

- **"Ne Demişler?" sayfası geri geldi** (`/ne-demisler`): **37 gerçek
  kullanıcı yorumu**, 2014–2015 arası. Sayfa WordPress'ten **boş** gelmişti
  çünkü yorumlar sayfa gövdesinde değil **WordPress yorumu** olarak
  duruyordu; `migrate.py` yalnızca `contentHtml` alıyordu.
  Yorumlar `web.archive.org`'daki 13 Haziran 2026 anlık görüntüsünden
  kurtarıldı (`src/content/yorumlar.json`).
- Footer'a ve ana sayfadaki Uzmanlık bölümüne yorum sayfası bağlantısı.

### Changed

- **Ana sayfadaki "Uzmanlık" bölümü uydurma olmaktan çıktı.** Eskiden
  "SketchUp %96, Lumion %72" gibi seviye çubukları vardı ve altında
  *"Seviye göstergeleri yer tutucudur; ölçülmüş bir değerlendirmeye
  dayanmaz"* yazıyordu — güven vermesi gereken bölüm tam tersini söylüyordu.
  Yerine doğrulanabilir altı madde kondu:

  | Madde | Kaynağı |
  |---|---|
  | 18 yıl SketchUp eğitmenliği | bestsketchupplugins.com'daki kendi beyanı |
  | 9 yayımlanmış eğitim seti | `courses.json` (Udemy profilinden) |
  | 7.269 Udemy öğrencisi | bestsketchupplugins.com'daki kendi beyanı |
  | 22 SketchUp eklentisi | `src/content/products/*.json` (sayıldı) |
  | Kendi render motoru | renderfun.com'da yayında |
  | 338 yazılık arşiv, 25 kategori | arşivin kendisi |

- Sayaçlardaki "10+ yıllık deneyim" **18** oldu (kendi beyanıyla tutarlı).
- `.skills` / `.skill__bar` stilleri silindi.

### Fixed

- `/ne-demisler` artık boş gövde listesinde değil (3 → 2).

### Doğrulama

- 593 sayfa; `astro check` **0 hata**; yeni kırık link / eksik medya: 0
- Yorum sayfası ölçüldü: 37 kart, masaüstünde 2 sütun, telefonda 1 sütun,
  yatay taşma yok
- Ana sayfada eski yüzde çubuğu kalmadı (ölçüldü: 0 adet)

### Yorumlar hakkında notlar

- Metinler **birebir** duruyor; yazım hataları dahil hiçbir şey düzeltilmedi.
- Her kartta tarih görünür — yorumlar 2014–2015'e ait, güncel gibi sunulmuyor.
- Arşivdeki 51 yorumdan: 37'si SketchUp/eğitim ile ilgili (yayında),
  12'si bisiklet ve kişisel dostluk üzerine (`yorumlar.json` içinde
  `kisisel` altında tutuluyor, sitede yayınlanmıyor), 1 spam
  (`binary options`, 2022) ve 1 tane de 17 karakterlik tek cümle ayıklandı.

## [1.3.2] — 2026-10-14

### Added

- **Google Search Console'da alan adı (Domain) mülkü:** `ufuksen.com`.
  Doğrulama DNS sağlayıcı üzerinden yapıldı (Google, Cloudflare bağlantısıyla
  TXT kaydını kendisi ekledi; yetkiyi kullanıcı verdi).
- Yeni mülke kanonik site haritası gönderildi:
  `https://www.ufuksen.com/sitemap-index.xml`

### Neden alan adı mülkü

Önceki mülk `https://ufuksen.com/` (çıplak) URL öneki mülküydü. Site
haritasındaki 497 adresin hepsi `www`'li olduğu için o mülkün kapsamı
dışında kalıyordu; panel "Başarılı" ama **keşfedilen sayfa 0** gösteriyordu.
Alan adı mülkü `www`, çıplak, http ve https'i tek çatıda topluyor — konak
uyuşmazlığı bir daha sorun olmuyor.

### Ölçüm

Alan adı mülkünde iki site haritası da görünüyor:

| Site haritası | Durum | Keşfedilen sayfa |
|---|---|---|
| `https://ufuksen.com/sitemap-index.xml` | Başarılı | **497** |
| `https://www.ufuksen.com/sitemap-index.xml` | Başarılı | işleniyor |

### Temizlenmeyi bekleyen (kozmetik)

WordPress'ten kalan 8 site haritası kaydı Search Console'da "Getirilemedi"
olarak duruyor; hepsi artık 404 veriyor (ölçüldü): `sitemap_index.xml`,
`sitemap.xml`, `post-sitemap.xml`, `category-sitemap.xml`,
`attachment-sitemap.xml`, `page-sitemap.xml`, `addl-sitemap.xml`,
`dd-sitemap.xml`. Sıralamaya zararı yok; istenirse panelden tek tek
kaldırılabilir.

## [1.3.1] — 2026-10-14

### Added

- **IndexNow bildirimi.** `public/c49c7d6f….txt` anahtar dosyası sitenin
  kökünde yayında; `scripts/deploy/indexnow.mjs` URL listesini sitemap'ten
  okuyup gönderiyor ve göndermeden önce anahtar dosyasının canlıda olduğunu
  doğruluyor.

### Doğrulama

- Anahtar dosyası canlıda 200, içeriği anahtarla birebir
- İlk gönderim `403 SiteVerificationNotCompleted` döndü (anahtar dosyası yeni
  yayına girmişti); bir dakika sonraki denemede **200 OK**
- **497 URL** bildirildi (sitemap'teki tüm indekslenebilir adresler)

### Kapsam notu

IndexNow'ı **Google kullanmaz** — Bing, Yandex, Seznam ve Naver kullanıyor.
Google için Search Console'a sitemap verilmesi gerekiyor:
`https://www.ufuksen.com/sitemap-index.xml` (kullanıcı tarafından yapılacak).

Yeni yazı yayınlandığında tek tek bildirmek için:
`node scripts/deploy/indexnow.mjs /yeni-yazi.html`

## [1.3.0] — 2026-10-14

**Site canlıya alındı.** `www.ufuksen.com` artık Cloudflare Worker'dan
yayınlanıyor; WordPress devreden çıktı.

### Added

- `www.ufuksen.com` Worker'a **custom domain** olarak bağlandı
  (`wrangler.toml` → `routes`)
- Çıplak `ufuksen.com` için Cloudflare **Redirect Rule**: 301 → www,
  sorgu dizesi korunuyor ("Redirect from root to WWW" şablonu)
- `docs/deploy/dns-kayitlari-2026-10-14.md` — 24 DNS kaydının geçiş
  öncesi hâli, geri dönüş için

### Changed

- Tek DNS değişikliği: `www.ufuksen.com` CNAME silindi, yerine Cloudflare'in
  Worker kaydı geldi. **Başka hiçbir kayda dokunulmadı.**
- `workers_dev = true` kalıcı olarak açık (bkz. LES-016)

### Kasıtlı olarak yapılmayanlar

- **Apex Worker'a bağlanmadı.** Panelde `MX` kaydı `ufuksen.com` konağını
  gösterdiği ve SPF de aynı ada baktığı için apex A kaydının Worker'a
  çevrilmesi e-posta açısından riskliydi. Redirect Rule aynı sonucu DNS'e
  dokunmadan veriyor.
  (Not: dışarıdan sorulduğunda MX aslında `_dc-mx.<hash>.ufuksen.com`
  olarak dönüyor — Cloudflare proxy'li apex için posta hedefini kendisi
  ayırmış. Yine de Redirect Rule yolu tercih edildi: aynı sonucu veriyor ve
  e-posta yoluna hiç dokunmuyor.)
- **Hosting'e hiçbir dosya yüklenmedi.** WordPress `public_html`'de olduğu
  gibi duruyor. Geri dönüş: Worker'dan custom domain'i kaldırıp
  `www` CNAME'ini (`ufuksen.com`, Proxied) yeniden oluşturmak.

### Doğrulama (canlıda ölçüldü)

| Kontrol | Sonuç |
|---|---|
| `www.ufuksen.com/` başlığı | "Ufuk Şen — 3D Görselleştirme, Render ve SketchUp Eğitimleri" |
| `/blog`, `/egitimler`, `/iletisim`, `/sketchup-en-iyi-pluginleri.html` | 200 |
| Yeni yazı `/sketchup-2026-profesyonel-egitim.html` | 200 |
| Miras 301: `/3d-egitim.html` | → `/sketchup-model-3dmax-render-egitimi.html` |
| Eski site içi arama `/?s=render` | → `/arama?q=render` |
| AMP `?amp=1` | → kanonik sayfa |
| Sondaki eğik çizgi `/blog/` | → `/blog` |
| `/sitemap-index.xml`, `/rss.xml`, medya | 200 |
| Olmayan sayfa | 404 |
| `ufuksen.com/*` (çıplak) | 301 → `www`, sorgu korunuyor |

### Geçiş sonrası yapılacaklar

- [ ] Search Console'a sitemap: `https://www.ufuksen.com/sitemap-index.xml`
- [ ] Birkaç gün 404 takibi
- [ ] Hosting bir süre açık kalsın (geri dönüş için)
- [ ] `wp-snapshots/tmp/` içindeki SQL dökümü silinsin, veritabanı parolası
      değiştirilsin — bu geçişten bağımsız, hâlâ açık bir güvenlik sorunu

## [1.2.1] — 2026-10-14

### Removed

- **`/iletisim` sayfasındaki çalışmayan WordPress formu kaldırıldı.** Form
  Contact Form 7'ye bağlıydı; statik sitede hiçbir yere gitmiyordu ve
  "Gönder"e basan kişi sessizce kayboluyordu (AGENTS.md §5). Formla birlikte
  sayfaya gömülü Akismet `<script>` bloğu da gitti.

### Changed

- Yerine gerçekten çalışan kanallar kondu: WhatsApp düğmesi ve e-posta.
  Numara ve adres `src/content/contact.json`'dan okunuyor, elle yazılmadı.
- Forma yönlendiren cümle ("aşağıdaki formu doldurup Gönder Butonuna basınız")
  kanallara yönlendirecek şekilde düzeltildi. Kullanıcının geri kalan metni
  olduğu gibi korundu.

### Fixed

- **Yazı gövdesindeki düğmeler boş görünüyordu.** `.prose a` (0,1,1) renk
  kuralı `.btn--primary` (0,1,0) kuralından daha belirgin olduğu için sarı
  zemine sarı yazı düşüyordu. `.prose a.btn--primary` / `.btn--ghost`
  kuralları eklendi.

### Doğrulama

- Derlenen `/iletisim` sayfasında `wpcf7`, `<form>`, `<input>`,
  `<textarea>` sayısı: **0**
- İki düğme de ölçüldü: 49px yükseklik (dokunma alt sınırı 44px), yazı rengi
  doğru, bağlantılar `wa.me/905303229301` ve `mailto:` olarak çalışıyor
- 593 sayfa; yeni kırık link / eksik medya: 0

### Not

`migrationChecksum` kaynak gövdenin özeti olduğu için değiştirilmedi.
`migrate.py` yeniden çalıştırılırsa bu elle düzenleme üzerine yazılır —
WordPress'ten veri çekme işi bittiği için kabul edildi.

## [1.2.0] — 2026-10-14

İlk elle yazılan yazı ve koddan üretilen şekiller (ADR-026).

### Added

- **"SketchUp 2026 Profesyonel Eğitim — En İyi Uzmanından"** yazısı
  (`/sketchup-2026-profesyonel-egitim.html`): kurulum, sistem gereksinimleri,
  arayüz, eklenti kurma, kendi eklentilerimiz, Render Fun ile görselleştirme,
  eğitim yol haritası ve S.S.S.
- Yazı için **7 renkli SVG şekil** + kapak görseli, koddan üretiliyor
  (`scripts/content/sketchup-2026-sekiller.mjs`)
- `scripts/content/sketchup-2026-egitim.mjs` — yazıyı ve şekilleri üreten betik;
  kullanılan kaynaklar betiğin başında sayılı

### Changed

- Kenar çubuğundaki "Son yazılar" listesi: her yazı kendi soluk çerçevesinde,
  tarih uzun başlıklarda üstte (başlık 4 satırdan 2 satıra indi)

### Doğrulama

- Bilgilerin tamamı kaynaklı: SketchUp 2026.0 resmî sürüm notları (7 Ekim 2025),
  SketchUp sistem gereksinimleri sayfası, renderfun.com, kendi ürün verimiz,
  Udemy eğitmen profilinden okunan eğitim setleri
- 593 sayfa; `astro check` **0 hata**; yeni kırık link / eksik medya: 0
- Yazıdaki 17 eklenti bağlantısı ve 7 sayfa bağlantısının hepsi derlemede var
- Şekiller masaüstünde 0,89 ölçekte okunuyor; telefonda dokununca tam ekran
- Kod dosyalarında kontrol karakteri taraması temiz (LES-015)

## [1.1.0] — 2026-10-14

Site geneli iki dillilik (ADR-025).

### Added

- **İngilizce sürüm sitenin tamamına yayıldı**: `/en/` ana sayfa, `/en/blog`, `/en/courses`, `/en/videos`, `/en/software` (+14 hub), `/en/search`, `/en/contact`, `/en/404`
- Menü, footer, "içeriğe atla" ve "başa dön" dahil **bütün arayüz iki dilli**
- Dil düğmesi artık site genelinde; bulunduğu sayfanın karşılığını kendisi buluyor ve **karşılığı yoksa hiç görünmüyor**
- İngilizce iletişim sayfası: WordPress'ten gelen çalışmayan form taşınmadı, yerine WhatsApp ve e-posta kanalları kondu
- `src/lib/i18n-sayfalar.ts` — sayfa metinleri ve adres eşlemesi tek kaynakta

### Changed

- Her sayfa `dil` propu alan **tek bileşene** dönüştü (`src/components/pages/`); sayfa dosyaları yalnızca o bileşeni çağırıyor — tasarım tek yerde
- Worker'ın konum yönlendirmesi eşlemesi olan tüm sayfaları kapsıyor; `/en/` altındaki 404'ler İngilizce sayfayı görüyor
- Türkçe adresler **değişmedi** — arama motorundaki karşılıkları korundu

### Kapsam dışı (bilerek)

430 blog yazısı ve 16 WordPress sayfası çevrilmedi; bu çeviri değil yeniden yazım işi olurdu. İngilizce tarafta arşiv listeleniyor ama yazıların Türkçe olduğu açıkça söyleniyor (blog listesinde uyarı, video ve eğitim notlarında "written/narrated in Turkish").

### Fixed

- Şeritteki dil düğmesinde metin alt satıra kayıyordu (56px'e sığmıyordu); dar şeritte küre ikonu düşürüldü

### Doğrulama

- 592 sayfa; `astro check` **0 hata**; kırık link / eksik medya / boş gövde: 0
- 8 İngilizce sayfanın hepsinde `lang="en"`, `hreflang` üçlüsü ve İngilizce başlık ölçüldü
- Kalan Türkçe karakterler yalnızca gerçek içerikten: arşiv yazı başlıkları ve Udemy kurs adları
- Kod dosyalarında kontrol karakteri taraması temiz (LES-015)

## [1.0.0] — 2026-10-14

Ürünler tanıtım sayfasına dönüştü; satış mağazaya taşındı (ADR-024).

### Changed

- **Ürün sayfaları artık satış metni**: kancalı başlık → somut kanıt (örn. "25 dakika → 75× → 20 saniye") → üç anlatı bölümü → öne çıkanlar → uyumluluk
- **En altta gösterişli buton** ürünün `bestsketchupplugins.com` sayfasına götürüyor; 44 bağlantının 44'ü doğrulandı
- **Fiyat ve satın alma siteden kaldırıldı** — tek kaynak mağaza; iki yerde fiyat tutmak bayatlamaya yol açıyordu
- **Katalog mağazadan senkronlanıyor**: 14 ürün → **22 ürün** (`scripts/content/sync-magaza.mjs`)
- Metinler mağazadan kopyalanmadı, ufuksen.com için ayrıca yazıldı — 220 metin parçası, mağazayla birebir çakışma **sıfır** (yinelenen içerik cezası yok)
- Ürün sayfası meta açıklaması kanca + tanıtımdan kuruluyor (54 sayfa 70 karakterin altındaydı, şimdi ~150)

### Fixed

- **Paketleme bozuk zip üretiyordu.** `Compress-Archive` ters bölü yazıyor, `bsdtar` 2392 dosyada çöküyor ve sessizce 995 dosya eksik paket üretiyordu. Yerine Node `zlib` ile kendi ZIP yazıcımız (LES-014); paket üretildikten sonra geri okunup doğrulanıyor
- **Hızlı kaydırmada metin görünmez kalıyordu**: görünürlük gözlemcisi ekranın üstünde kalan öğeyi "görünmedi" sayıyordu. Ölçüldü: ürün sayfasında 4 bölüm opaklık 0'da kalıyordu → şimdi 0
- **Giriş sayacında sürüm aralığı "–1190" çıkıyordu**: uyumluluk alanları serbest cümle içeriyor, "v1.9.0" yıl sanılıyordu. Yalnız 20xx yıl belirteçleri toplanıyor → 2017–2027
- Kabuk kaçışından koda sızan 2 kontrol karakteri temizlendi (LES-015)

### Doğrulama

- 555 sayfa; `astro check` **0 hata**; kırık link / eksik medya / boş gövde: 0
- Paket bağımsız araçla (Python `zipfile`) açıldı: CRC sağlam, 2392/2392 dosya, 0 eksik, 0 fazla, içerik MD5 ile birebir, klasörler doğru oluşuyor
- Mağaza bağlantıları: 44/44 HTTP 200

## [0.9.0] — 2026-09-09

Gumroad satışı, bölüm yeniden adlandırma ve İngilizce sürüm (ADR-023).

### Added

- **İngilizce eklenti bölümü**: `/sketchup-best-plugins.html` ve `/plugin/{slug}.html` — 14 ürünün tamamı çevrildi (ad, özet, açıklama, özellikler, listeler, öne çıkanlar, fiyat notu)
- **Konuma göre yönlendirme**: Türkiye dışından gelen ziyaretçi İngilizce sürüme 302 ile gider. Robotlar yönlendirilmez (Türkçe içerik dizine girsin diye), kullanıcı seçimi çerezde saklanır ve konumu ezer
- `hreflang` (tr / en / x-default) — yalnızca çevirisi olan sayfalarda
- Dil düğmesi (TR ⇄ EN), seçimi hatırlıyor
- **İki yeni ürün**: Kapı Stüdyosu v1.6.0 ($30) ve Dolap Sihirbazı v1.19.0 ($35) — Gumroad'da satışta ama sitede yoktu
- Panelde İngilizce metin alanları

### Changed

- **Bölüm adı**: "Ürünler" → **SketchUp En İyi Pluginleri** / **SketchUp Best Plugins**
- **URL şeması**: `/urunler` → `/sketchup-en-iyi-pluginleri.html`, `/urunler/{slug}` → `/eklenti/{slug}.html` (16 adet 301 yönlendirme)
- **Gumroad verisi işlendi**: 5 eklentiye gerçek fiyat ve satın alma bağlantısı; "Satın al" doğrudan o eklentinin Gumroad sayfasına gidiyor
- **Sürümler düzeltildi** (paketlenmiş .rbz dosyalarından doğrulandı): WindowFun 1.1.0 → 2.5.0, PerdeNeşe 1.5.5 → 2.2.1, Dynamic Skirting 1.2.3 → 1.3.2, FloorStudio 3.1.5 → 3.2.1
- "Dolap Sihirbazı" (web) → "Dolap Sihirbazı Web"; SketchUp eklentisi ayrı ürün oldu
- Kartlarda künyenin ilk hücresi satıştaki üründe fiyatı gösteriyor; buton "İncele" yerine "Satın al" oluyor
- Giriş sayacı "yayında" yerine gerçekten satın alınabilenleri sayıyor

### Doğrulama

- 539 sayfa; `astro check` **0 hata**; kırık link / eksik medya / boş gövde: 0
- İngilizce sayfalarda Türkçe kalıntı yok (kalan iki eşleşme: geliştirici yorumu ve dil düğmesinin kendi dilindeki ipucu)
- 5 Gumroad bağlantısı tek tek doğrulandı; fiyatlar $ olarak biçimleniyor
- Meta açıklamaları iki dilde de 160 karakter altında (TR 155, EN 147)

## [0.8.0] — 2026-08-18

Ürün altyapısı: yeni ürün eklemek artık kod işi değil (ADR-022).

### Changed

- **Ürünler tek dosyadan ürün başına dosyaya taşındı** (`src/content/products/{slug}.json`). Panelde "Ürünler" kendi bölümü oldu: ekle / düzenle / sil tek tek yapılıyor
- Ürüne özel `desenler` alanı, adlandırılmış `listeler` yapısına genelleştirildi — her ürün kendi başlığıyla istediği kadar liste tanımlayabiliyor
- Ortak ürün mantığı `src/lib/products.ts` içinde toplandı; ikon kümesi iki dosyada kopyalanmaktan kurtuldu

### Added

- Astro içerik koleksiyonu + zod şeması: panelden hatalı veri gelirse derleme durur
- Yeni isteğe bağlı bölümler: **ekran görüntüleri**, **tanıtım videosu**, **sık sorulanlar**, **fiyat**, **deneme sürümü bağlantısı** — hepsi boşken hiç görünmez
- **"Sitede göster" anahtarı** — hazır olmayan ürün panelde bekler, sitede görünmez
- **Tür süzgeci**: ürün sayısı 5'e ulaşınca kendiliğinden belirir; JavaScript kullanmaz (gizli radyo + `:has()`)
- `.u-visually-hidden` yardımcı sınıfı
- `docs/content/urun-ekleme.md` — ürün ekleme kılavuzu

### Doğrulama

- Göç betikle yapıldı, taşınmayan alan raporlandı: **sıfır veri kaybı**
- Çekirdek, geçici 4. ve 5. ürün eklenerek sınandı: **hiç kod değişikliği olmadan** sayfa üretildi; video, liste, S.S.S., fiyat, satın al bölümleri ve yeni ikon çalıştı
- Süzgeç tarayıcıda ölçüldü: Eklentiler → 2, Araçlar → 2, Tümü → 5; etiketler 44px; yatay taşma yok
- 513 sayfa; `astro check` **0 hata**; yeni kırık link / eksik medya / boş gövde: 0

## [0.7.0] — 2026-08-18

Ürünler bölümü yeniden kuruldu: teknik çizim dili, ürün başına sayfa, WhatsApp (ADR-021).

### Added

- **`/urunler` yeniden tasarlandı** — SketchUp'ın görsel dili: kareli zemin ızgarası, kırmızı/yeşil/mavi eksen işareti, izometrik tel kafes, kotalama çizgisi, künye bloğu
- **Giriş bölümü** sosyal medyadan gelen ziyaretçi için: ne olduğu, ne kazandırdığı ve iletişim ilk ekranda; sayılar veriden hesaplanıyor (elle yazılmıyor)
- **Fayda şeridi** — zaman / ölçü doğruluğu / güvenli geri alma; üçü de ürün verisindeki gerçek ifadelere dayanıyor
- **Girişteki kafes kalemle çizilerek oluşuyor** — kenarlar hafif eğri ve köşelerde taşmalı (elle çizim), üstünden soluk ikinci geçiş yapılıyor, ucunda gerçek bir kalem yol boyunca ilerliyor. Sıra bir eskizdeki gibi: taban → dikmeler → üst yüz (~2,4 sn)
- **Ürün başına sayfa**: `/urunler/floorstudio`, `/urunler/kitchen-studio`, `/urunler/panelcut-studio` — tek ürünün bağlantısı paylaşılabiliyor
- Ürün sayfalarında `SoftwareApplication` yapılandırılmış verisi ve arşivden gerçek ilgili yazılar
- **WhatsApp butonu** (#25D366) — her üründe, mesaj ürün adıyla önceden dolu; numara panelden düzenlenebilir, boşsa buton hiç görünmez
- Panele **İletişim (WhatsApp)** bölümü

### Fixed

- **Sol şeritteki sosyal ikonlar 18px genişlikteydi** (44px kuralının altında). Kök neden `align-items: center`: `<li>` içeriğine daralıyor, içindeki `%100` genişlikteki `<a>` de onunla daralıyordu. `stretch` ile 56px'e çıkarıldı
- Kullanılmayan iki sabit (`icons`, `site`) ve bir tip dönüşümü hatası temizlendi — `astro check` artık **0 hata**

### Ölçülen ve geri alınan

Kalem hareketi önce CSS `offset-path` ile yazıldı; ölçüldü, kalem çizimin 141px üstünde kalıyordu (SVG kullanıcı birimleriyle hizalanmıyor). SVG'nin kendi `animateMotion`'ına geçildi — elemanın (0,0) noktasını yol üzerinde yürüttüğü için kalemin ucu tam çizginin ucunda oluyor.


Şerit ikonlarının yüksekliği de 44px yapılmak istendi; ölçüldü, şerit içeriği 850px alana karşı 874px'e taşıyordu. Geri alındı, gerekçe koda yazıldı: kuralı uygulamak için menüyü taşırmak, kuralın koruduğu kullanılabilirliği bozardı.

### Doğrulama (tarayıcı)

- 320 / 375 / 390 / 1366 / 1440px — hiçbirinde yatay taşma yok
- 5 WhatsApp butonu, hepsi ≥44px, `rel="noopener"` + yeni sekme; bağlantı ürün adıyla dolu
- Kısa laptopta (1366×700) şerit 2×2 sıkışıyor, taşma yok (650 = 650)
- Verisi eksik ürün (Kitchen Studio) uydurma özellik göstermiyor; "Ayrıntılar hazırlanıyor" + iletişim
- 514 sayfa; yeni kırık link / eksik medya / boş gövde: 0; `astro check` 0 hata
- CSS 38,5 → 56,2 KB (yeni sayfa stilleri); JS değişmedi (22,5 KB)

## [0.6.0] — 2026-08-12

Cloudflare yayını: site `ufuksen-site.ufuksn79.workers.dev` adresinde canlı; panel altyapısı tamam.

### Added

- GitHub deposu `ufuksn79-design/ufuksen-site` (eski işaretli hesaptan taşındı)
- Cloudflare Workers Git entegrasyonu: her push otomatik derleme + yayın
- Sveltia giriş köprüsü (`sveltia-cms-auth.ufuksn79.workers.dev`) kuruldu, OAuth anahtarları Cloudflare'de şifreli
- `worker/index.js` — URL davranış katmanı (.htaccess'in Cloudflare karşılığı): .html birebir, dizin indeksleri yönlendirmesiz, 410 Gone, AMP/attachment/eski arama 301'leri, sondaki eğik çizgi kanonikleştirme
- `.assetsignore` — 25 MiB üstü, hiçbir içerikte kullanılmayan video Cloudflare dışında bırakıldı (silinmedi)

### Fixed

- **Cloudflare varsayılanı `/yazi.html`i 307 ile uzantısız yola yönlendiriyordu** (ADR-007 ihlali) — `html_handling: none` + worker ile davranış devralındı
- **`_redirects` içindeki `/?s=` satırı Cloudflare'de yanlış ayrışıp ana sayfayı yönlendiriyordu** — query/orta-splat kuralları dosyadan çıkarıldı, worker'a taşındı
- İlk 3 dağıtım "Asset too large" ile düşüyordu: 34,1 MiB'lik kullanılmayan `enscapeegitim.mp4` (yerelde birebir yeniden üretilip çözüldü)

### Doğrulama (canlı, workers.dev)

- 11 sayfa örneklemi 200, yönlendirmesiz; Türkçe yüzde-kodlu slug dahil
- Miras 301, ?amp=1, /slug.html/amp, /?s=, /blog/ kanonikleştirme — hepsi doğru hedefe
- Kaldırılan içerik 410, bilinmeyen yol 404 (kendi sayfamızla), /admin 200

## [0.5.0] — 2026-08-01

Etkileşim katmanı (ADR-020): "eğlenceli, dinamik, sezgisel" zorunlu kuralı.

### Added

- Sayfa geçişleri (Astro ClientRouter); sol şerit `transition:persist` ile sabit, aktif sekme her geçişte JS ile güncelleniyor
- Komut paleti: `/` veya `Ctrl+K` ile her sayfadan arama; ok tuşları + Enter ile SPA geçişi; indeks bir kez inip bellekte kalıyor
- Kartlarda imleci izleyen sarı ışık lekesi + ≤4° 3B eğim (yalnızca ince işaretçi, reduced-motion kapalıyken)
- "Taslaktan render'a": kapak görselleri soluk başlayıp imleçle renkleniyor — dokunmatikte her zaman tam renkli
- Profil kapağında imleci izleyen ışık
- Mobilde video şeridi parmakla kaydırılan scroll-snap şeridine dönüştü
- Başa dön düğmesi (600px sonrası; mobilde alt çubuğun üstünde; 44px hedef)
- Düğme yaylanması, reveal'e hafif ölçek

### Changed

- Base script'i `astro:page-load` + `AbortController` düzenine taşındı: her geçişte dinleyiciler kurulup sökülüyor, birikme yok; lightbox/palet DOM'u geçişte kopmuşsa yeniden kuruluyor

### Fixed

- Klavye dinleyicisi `event.target` Element olmayınca patlıyordu (`closest` yok); Element kontrolü eklendi
- `transition:persist` bileşen etiketinde etkisizdi; Rail'in kök elemanına taşındı

### Doğrulama (tarayıcı)

- İki SPA geçişi sonrasında palet, ilerleme çubuğu, sayaçlar, şerit senkronu yeniden kuruluyor
- Işık izi `--mx` değeri canlı ölçüldü; mobilde görsel filtresi `none` (dokunmatik istisnası çalışıyor)
- 375px'te yatay taşma yok; video şeridi kendi içinde kaydırılıyor (`scroll-snap: x mandatory`)
- Başa dön düğmesi mobilde alt çubuğu kapatmıyor (724 < 735)
- JS maliyeti: 22,5 KB toplam, ölçüldü (önceden 0); kütüphane yok

## [0.4.0] — 2026-07-31

### Added — Eğitim setleri (gerçek Udemy verisi)

- `/egitimler` — 9 kurs; puan, yorum, süre, ders sayısı ve seviye Udemy eğitmen profilinden okundu
- 9 kapak görseli 750×422 yerele indirildi (dış bağımlılık yok)
- Ana sayfada en yüksek puanlı 3 set; menüye "Eğitim" girişi
- Yazılım hub sayfalarına ilgili kurslar bağlandı (SketchUp 4, D5 3, Twinmotion 2…)
- `Course` schema.org yapılandırılmış verisi
- Fiyat bilinçli olarak gösterilmiyor: Udemy fiyatları kampanyaya göre değişir, sabit yazmak kısa sürede yanlış bilgiye döner

### Changed — Yaşam yazıları park edildi (ADR-018)

- 93 yazı siteden çıkarıldı ama **silinmedi**; ayrı siteye taşınmayı bekliyor
- Listeler, arama, RSS, video vitrini ve sitemap'te görünmüyorlar
- URL'leri çalışmaya devam ediyor, `noindex` ve arşiv notu taşıyor
- Ana sayfadaki yer tutucu "Hizmetler" bölümü kaldırıldı; yerini gerçek eğitim setleri aldı

### Fixed

- **Sitemap tüm yazı URL'lerini sonda eğik çizgiyle bildiriyordu** (`/yazi.html/`), kanonik etiketler ise eğik çizgisiz. Google'a kanonikten farklı URL bildiriliyordu; `serialize` ile normalize edildi.
- Kategori sayıları park edilen yazıları da sayıyordu; görünür yazılardan yeniden hesaplanıyor
- Hafif staging paketi `/media` klasörünü tamamen dışlıyordu ve yeni eklenen Udemy kapakları eksik kalıyordu; yalnızca WordPress yıl klasörleri dışlanıyor

### Doğrulama

- 507 sayfa; sitemap 413 URL (park edilenler ve 404 hariç), 0 sızıntı, 0 eğik çizgi
- `astro check` 0 hata; yeni kırık link / eksik medya / boş gövde: 0

## [0.3.0] — 2026-07-31

Arayüz "CV uygulaması" yönüne geçti; keşif katmanı eklendi; konu dışı içerik temizlendi.

### Tasarım (ADR-015, ADR-016)

- Sol sabit ikon şeridi (masaüstünde dikey, mobilde alt çubuk)
- Yuvarlatılmış içerik kartı; zemin karttan bir ton koyu
- Profil kartı: kapak, dairesel avatar, sosyal ikonlar, ikiye bölünmüş CTA
- Bölüm başlıklarında ilk harf sarı dairenin üzerinde
- Noktalı bilgi listesi, ikonlu hizmet kartları, seviye çubukları, animasyonlu sayaçlar
- **Başlıklar beyaz**, sarı vurgu rolüne geçti — üç belgede yazılı kural değişti (ADR-015)

### Keşif katmanı — hepsi ölçülen veriden

- `/videolar` — 297 yayında video, YouTube küçük resimleriyle
- `/yazilim` + 13 yazılım hub sayfası (SketchUp, V-Ray, D5, Twinmotion…)
- Yazı sayfalarında yazılım etiketleri
- 3+ başlıklı yazılarda içindekiler + okunan bölüm işaretleme
- Okuma ilerlemesi çubuğu
- Görsel büyütme (lightbox), klavye erişimli

### İçerik temizliği (ADR-017)

- Konu dışı 27 yazı kaldırıldı: perakende kampanyaları, cihaz lansmanları, yemek tarifleri
- 410 Gone kuralları üretildi; `migrate.py` dışlama listesini kalıcı olarak uyguluyor
- Kaldırılan yazılara giden 3 iç bağlantı çözüldü (metin korundu)
- `docs/content/yasam-kategorisi.csv` — 120 yazılık "Yaşam" dökümü ve öneri sınıflaması

### Fixed

- Arşivdeki 353 videonun **56'sı YouTube'da kaldırılmış**; galeriden ayıklandı (`audit-videos.py`). Yazı içindeki gömülü oynatıcıya dokunulmadı.
- Kabuk 1440px'te sağa dengesiz kalıyordu
- "457 yazı,26 konu" boşluk kaybı
- İletişim e-postası 33px dokunma hedefiydi
- Heredoc kaçış bozulması nedeniyle bağlantı çözme çalışmıyordu (LES-012)

### Doğrulama

- 512 sayfa, 430 yazı; `astro check` 0 hata
- Yeni kırık link / eksik medya / boş gövde: 0
- 375px ve 1440px'te yatay taşma yok

## [0.2.0] — 2026-07-31

Staging yayında ve sunucuda doğrulandı: `https://www.ufuksen.com/yeni/`

### Added

- `scripts/deploy/ftp-lib.mjs`, `ftp-backup.mjs`, `ftp-deploy.mjs` — kimlik bilgileri yalnızca `.env`'den okunur
- `scripts/build/generate-htaccess.mjs` — 59 yönlendirme + AMP + attachment + gzip + önbellek + güvenlik başlıkları
- `scripts/build/make-zip.mjs`, `make-staging.mjs` — üretim ve alt klasör paketleri
- `docs/deploy/RUNBOOK.md`
- `.env.example`; `.env`, `backups/`, zip'ler `.gitignore` kapsamında

### Sunucu Bulguları

- `ftp.ufuksen.com` Cloudflare'e çözülüyor; FTP geçmez. Gerçek sunucu: `ni-maria.guzelhosting.com` (31.192.212.111)
- FTPS `FEAT` listesinde ilan ediliyor ama `AUTH TLS` 500 dönüyor; implicit FTPS ve SFTP kapalı. Düz FTP'ye sessizce düşülmedi
- Panel cPanel (2083/2086/2087). Pure-FTPd TLS ayarı WHM düzeyinde — kullanıcı erişimiyle düzeltilemez
- Hosting LiteSpeed/Apache: `_redirects` okunmaz, `.htaccess` üretildi

### Fixed

- **Apache uzantısız yolları 301'liyordu** (`/iletisim` → `/iletisim/`), kanonik etiketler ise eğik çizgisiz. Her sayfa/kategori isteği gereksiz hop alıyor ve sunulan URL kanonikten farklı oluyordu. `DirectorySlash Off` + içeriden `index.html` bağlama ile çözüldü; sunucuda doğrulandı
- Alt klasör kuralında değiştirme yolu `/` ile başlıyordu ve isteği WordPress'e düşürüyordu; `RewriteBase` eklendi
- Alt klasörde kök göreli yollar kırılıyordu; staging paketinde 525 dosyada 25.661 yol yeniden yazıldı

### Doğrulama (canlı sunucu)

- 45 rastgele eski URL örneklemi → **45/45 200**
- Yazı görselleri, 457 kayıtlık arama indeksi, CSS, Geist fontu, kanonik etiketler doğrulandı
- 404 sayfası bizim sayfamızı döndürüyor (WordPress'in değil)
- Yatay taşma yok, başlıklar dolu sarı

## [0.1.0] — 2026-07-30

Çalışan üretim sitesi: 457 yazının tamamı, medyası ve SEO verisiyle göç edildi.

### Added

- Astro 7 üretim sistemi (TypeScript strict, Tailwind 4 gerçek derleme adımıyla)
- `scripts/wordpress/migrate.py` — idempotent, dry-run destekli göç aracı
- `scripts/wordpress/resolve-redirects.py` — kaynaktaki mevcut yönlendirmeleri keşfeder
- `scripts/build/flatten-html-routes.mjs` — `.html` URL şemasını tam dosya eşleşmesine indirger
- `scripts/build/generate-redirects.mjs` — `public/_redirects` üretir
- `scripts/build/verify-urls.mjs` — 491 `keep` URL'i ve içerik adetlerini doğrular
- `scripts/build/verify-content.mjs` — 525 sayfada canonical, medya, boş gövde ve iç link taraması
- Ana sayfa (Yön A "Blueprint"), yazı, sayfa, kategori, blog sayfalama, arama, 404
- RSS, sitemap, robots.txt, JSON-LD, Open Graph, canonical
- `docs/migration/REPORT.md` ve `known-issues.json`

### Göç Sonucu

- Yazı 457/457, sayfa 16/16, kategori 27/27, etiket 4/4 — adetler birebir
- Medya: 757 kütüphane + 1052 içerik varyantı indirildi
- 473 sayfanın SEO alanları taşındı (0 hata)
- 525 sayfa üretiliyor, build ~4 sn
- `keep` eylemli 491 URL'in tamamı çözülüyor; yeni kırık link/medya/boş gövde: 0

### Fixed

- REST sayfalamasında "beklenenden az geldi, bitti" varsayımı 795 medyanın 621'ini düşürüyordu; `X-WP-TotalPages` ile düzeltildi
- Türkçe dosya adlı 86 görsel URL kodlaması olmadan indirilemiyordu
- İçerikte referans verilen 1052 boyut varyantı medya kütüphanesinde olmadığı için kırık kalıyordu
- Kaynakta 301 ile çalışan 59 URL "kırık link" sanılmıştı; keşfedilip `_redirects` içine taşındı
- Hiyerarşik kategori yolları (`/kategori/üst/alt`) kurgulanmış yol yerine kaynak verisine bağlandı
- Yüzde-kodlu Türkçe slug'lı yazı build'i kırıyordu
- Kategori etiketi dokunma hedefi 44px altındaydı

### Bilinen ve kaynağa karşı doğrulanmış

- 3 boş sayfa gövdesi, 2 kayıp görsel, 16 kırık iç link — üçü de canlı sitede aynı durumda

## [0.0.4] — 2026-07-30

### Added

- `src/styles/tokens.css` — tasarım tokenları tek kaynağı (60–30–10 renk, tipografi ölçeği, spacing, hareket, 44px dokunma hedefi)
- `prototypes/direction-a.html` — Yön A "Blueprint": mimari ızgara, numaralı bölümler, Geist
- `prototypes/direction-b.html` — Yön B "Atölye": sinematik derinlik, ışık kuyuları, Fraunces serif başlıklar
- `prototypes/index.html` — iki yönün karşılaştırma sayfası
- `docs/design/T-003-DIRECTIONS.md` — T-003 raporu
- `.claude/launch.json` içine `ufuksen-prototypes` önizleme sunucusu (port 4321)

### Tasarım Kararları

- ADR-010: Prototipler Tailwind CDN yerine token tabanlı CSS ile yazıldı (281 KB tarayıcı derleyicisi Faz 1'in performans doğrulamasını ölçülemez kılıyordu)
- ADR-011: Geist + Geist Mono (+ Yön B için Fraunces); üçü de SIL OFL 1.1

### Doğrulama

- Türkçe karakter desteği iki aşamada kanıtlandı: `unicode-range` analizi ve tarayıcıda gerçek glif çizim testi (tofu karşılaştırması). 9/9 karakter ayrı glif.
- 32/32 başlık dolu sarı `rgb(255,212,0)`, stroke 0
- 320 / 375 / 430 / 1280 px: yatay taşma yok, 44px altı dokunma hedefi yok
- Klavye: hamburger odaklanabilir, `aria-expanded` doğru, `Escape` kapatıp odağı geri veriyor
- JS kapalıyken 28 reveal öğesinin 0'ı gizli — progressive enhancement doğrulandı
- Konsol hatası yok

### Fixed

- 44px altı 15 dokunma hedefi büyütüldü (375px ölçümü)
- 320px'te yatay taşma: kök neden ızgara öğelerindeki `min-width: auto`; `tokens.css` içinde tek kuralla çözüldü
- Masaüstünde hero başlığındaki uzun Türkçe kelimenin ortadan bölünmesi; başlık tam genişliğe alındı

## [0.0.3] — 2026-07-30

### Added

- `scripts/wordpress/url-map.py` — salt okunur URL eşleme tablosu üreticisi; redirect çakışmasında exit 1
- `docs/inventory/url-map.csv` — 1418 satırlık eski→yeni URL eşlemesi
- `docs/inventory/url-map-stats.json` — doğrulama istatistikleri
- `docs/inventory/URL-MAP.md` — T-002 raporu
- `src/types/content.ts` — framework'ten bağımsız içerik modeli (strict TypeScript)
- `package.json`, `tsconfig.json`, `.gitignore` — minimal type-check altyapısı (TypeScript 5.9.2 pinlendi)

### Bulgular

- 457 yazının tamamı `keep` — ADR-007 sayesinde yazı tarafında redirect ihtiyacı yok
- AMP iki biçimde yayında: `/{slug}.html?amp=1` (kanonik) ve `/{slug}.html/amp` → 914 redirect satırı
- 13 URL karar bekliyor: 9 örtüşen sayfa, 4 kullanılmayan etiket (+1 boş kategori)
- `3d-gorsellestirme` ve `3d-mimari-gorsellestirme` hem yazı hem sayfa olarak var; URL çakışması yok ama içerik deposu türe göre ayrılmalı
- Örneklemde etiket kullanımı 0/40; sticky ve özel post format kullanımı yok

### Fixed

- T-001'deki "Rank Math SEO alanları REST'te yok" değerlendirmesi düzeltildi: `rank_math_description` ve `rank_math_focus_keyword` REST `meta` alanında mevcut
- İlk AMP URL tahmini (`/{slug}/amp`) yanlıştı; gerçek `rel="amphtml"` değeri okunarak düzeltildi

### Security

- Kaynak sisteme yalnızca GET isteği gönderildi (ADR-003)

## [0.0.2] — 2026-07-30

### Added

- `scripts/wordpress/inventory.py` — salt okunur, tekrar çalıştırılabilir WordPress envanter aracı (yalnızca GET; public REST API + sitemap + HTML head)
- `docs/inventory/REPORT.md` — T-001 envanter raporu
- `docs/inventory/inventory.json` — makine okunur envanter çıktısı
- `docs/inventory/url-list.txt` — 473 public URL
- `docs/inventory/raw/` — ham snapshot (ana sayfa HTML, sitemap'ler, 40 yazılık örneklem JSON)

### Envanter Bulguları

- WordPress 6.8.6, PHP 7.4.33 (EOL), Cloudflare + LiteSpeed, `jannah` teması, Rank Math SEO
- İçerik: 457 yazı, 16 sayfa, 27 kategori, 4 etiket, 795 medya, 1401 yorum, 3 kullanıcı
- Yazı permalink şeması `.html` uzantılı ve düz: `/{slug}.html` → redirect planının merkezinde
- AMP aktif; AMP URL varyantları da redirect kapsamında
- 40 yazılık örneklemde shortcode ve page builder kullanımı yok; içerik klasik editör HTML'i
- Gömüler: YouTube (35) ve Vidyard (3); tüm görseller kendi domaininde barındırılıyor
- Rank Math REST endpoint'i 404; SEO alanları sayfa head'inden ve WXR export'tan alınabilir
- 12 migration riski ve 12 bilinmeyen kayıt altına alındı

### Security

- Kaynak sisteme yalnızca GET isteği gönderildi; hiçbir veri değiştirilmedi (ADR-003)

## [0.0.1] — 2026-07-30

### Added

- İlk proje dokümantasyon paketi oluşturuldu.
