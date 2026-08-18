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

## [0.7.0] — 2026-08-18

Ürünler bölümü yeniden kuruldu: teknik çizim dili, ürün başına sayfa, WhatsApp (ADR-021).

### Added

- **`/urunler` yeniden tasarlandı** — SketchUp'ın görsel dili: kareli zemin ızgarası, kırmızı/yeşil/mavi eksen işareti, izometrik tel kafes, kotalama çizgisi, künye bloğu
- **Giriş bölümü** sosyal medyadan gelen ziyaretçi için: ne olduğu, ne kazandırdığı ve iletişim ilk ekranda; sayılar veriden hesaplanıyor (elle yazılmıyor)
- **Fayda şeridi** — zaman / ölçü doğruluğu / güvenli geri alma; üçü de ürün verisindeki gerçek ifadelere dayanıyor
- **Ürün başına sayfa**: `/urunler/floorstudio`, `/urunler/kitchen-studio`, `/urunler/panelcut-studio` — tek ürünün bağlantısı paylaşılabiliyor
- Ürün sayfalarında `SoftwareApplication` yapılandırılmış verisi ve arşivden gerçek ilgili yazılar
- **WhatsApp butonu** (#25D366) — her üründe, mesaj ürün adıyla önceden dolu; numara panelden düzenlenebilir, boşsa buton hiç görünmez
- Panele **İletişim (WhatsApp)** bölümü

### Fixed

- **Sol şeritteki sosyal ikonlar 18px genişlikteydi** (44px kuralının altında). Kök neden `align-items: center`: `<li>` içeriğine daralıyor, içindeki `%100` genişlikteki `<a>` de onunla daralıyordu. `stretch` ile 56px'e çıkarıldı
- Kullanılmayan iki sabit (`icons`, `site`) ve bir tip dönüşümü hatası temizlendi — `astro check` artık **0 hata**

### Ölçülen ve geri alınan

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
