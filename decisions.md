# Mimari ve Ürün Kararları

## ADR-001 — Ana sayfa tek akış, içerik sistemi çok rotalı olacak

**Durum:** Kabul edildi  
**Tarih:** 2026-07-30

### Karar

Ana sayfa uzun, kesintisiz ve etkileyici bir single-page scroll deneyimi olacaktır. Ancak blog yazıları, kategoriler, projeler ve detay sayfaları ayrı, SEO uyumlu URL'lerde çalışacaktır.

### Neden

Tüm WordPress arşivini tek HTML sayfasına taşımak:

- SEO'yu bozar
- paylaşılabilir URL'leri yok eder
- performansı düşürür
- içerik yönetimini zorlaştırır
- erişilebilirliği ve aramayı zayıflatır

### Sonuç

“Single-page” talebi ana sayfa navigasyon deneyimi olarak yorumlanır; tüm ürün mimarisi olarak değil.

---

## ADR-002 — Üretim sistemi salt HTML dosyasına kilitlenmeyecek

**Durum:** Geçici kabul  
**Tarih:** 2026-07-30

### Karar

İlk tasarım prototipi HTML + Tailwind olabilir. Üretim için Next.js veya Astro; keşif ve proof-of-concept sonuçlarına göre seçilecektir.

### Neden

Dinamik blog, içerik aktarımı, sitemap, structured data, redirectler, arama ve tekrar kullanılabilir bileşenler salt tek HTML yaklaşımından daha güçlü bir yapı gerektirir.

### Seçim ölçütleri

- WordPress/CMS entegrasyonu
- Statik üretim
- incremental build/revalidation ihtiyacı
- hosting
- editör deneyimi
- arama
- migration kolaylığı
- bundle boyutu

---

## ADR-003 — WordPress kaynak sistem, migration tamamlanana kadar salt okunur kabul edilecek

**Durum:** Kabul edildi  
**Tarih:** 2026-07-30

### Karar

Göç sırasında eski WordPress sisteminde otomatik toplu değişiklik yapılmayacak. Export/API snapshot üzerinden çalışılacak.

### Neden

Veri kaybını ve geri dönüşü zor değişiklikleri önlemek.

---

## ADR-004 — URL koruması P0 gereksinimdir

**Durum:** Kabul edildi  
**Tarih:** 2026-07-30

### Karar

Her eski public URL ya aynı slug ile çalışacak ya da birebir 301 yönlendirmesine sahip olacaktır.

### Neden

Organik trafik, dış bağlantılar ve kullanıcı yer imleri korunmalıdır.

---

## ADR-005 — Animasyon progressive enhancement olacak

**Durum:** Kabul edildi  
**Tarih:** 2026-07-30

### Karar

İçerik animasyon olmadan da görünür ve kullanılabilir olacak. `prefers-reduced-motion` desteklenir.

### Neden

Performans, erişilebilirlik ve düşük güçlü cihazlarda güvenilirlik.

---

## ADR-006 — İçerik göçü adet ve checksum ile doğrulanacak

**Durum:** Kabul edildi  
**Tarih:** 2026-07-30

### Karar

Migration tamamlandı kabul edilmeden kaynak/hedef adet karşılaştırması, hata raporu ve içerik checksum kontrolü yapılacak.

### Neden

Görsel olarak birkaç yazıyı kontrol etmek geniş arşivlerde yeterli değildir.

---

## ADR-007 — `.html` permalink şeması korunacak

**Durum:** Kabul edildi
**Tarih:** 2026-07-30

### Karar

Yeni sistemde yazı URL'leri `https://www.ufuksen.com/{slug}.html` biçiminde birebir korunacaktır. Slug'lar değiştirilmeyecektir.

### Neden

T-001 envanteri 457 yazının tamamının `.html` uzantılı düz permalink kullandığını gösterdi. Şema korunursa 457 URL için redirect ihtiyacı ve buna bağlı SEO riski tamamen ortadan kalkar. Alternatif (uzantısız modern şema + 457 satırlık 301 haritası) hiçbir kullanıcı değeri üretmeden risk ekler.

### Sonuç

Seçilecek framework `.html` uzantılı route üretebilmelidir. Redirect ihtiyacı yalnızca AMP varyantları ve kategori/sayfa konsolidasyonlarıyla sınırlı kalır.

---

## ADR-008 — Framework için Astro ön eğilim; karar T-005'e bağlı

**Durum:** Öneri (kesinleştirilmedi)
**Tarih:** 2026-07-30

### Karar

ADR-002'nin açık bıraktığı Next.js/Astro seçiminde ön eğilim **Astro** yönündedir. Kesin karar T-005 migration proof-of-concept sonucunda verilecektir.

### Neden

T-001'de ölçülen içerik profili:

- 473 sayfa, düşük değişim sıklığı → tam statik üretim yeterli, ISR gerekmiyor
- İçerik gövdesi düz HTML, page builder ve shortcode yok → ağır runtime dönüşümü gerekmiyor
- `architecture.md`: blog JS kapalıyken okunabilir olmalı; animasyon progressive enhancement
- `AGENTS.md`: sadece animasyon için React eklenmeyecek

Astro'nun varsayılan sıfır-JS çıktısı bu gereksinimlerle doğrudan örtüşür.

### Kesinleşmeden önce doğrulanacak

- `.html` uzantılı route üretimi (ADR-007)
- 457 yazı + 795 medya ile build süresi
- Site içi arama yaklaşımı
- İçerik editör deneyimi
- **Query-string redirect desteği** — 457 AMP URL'i `?amp=1` biçiminde; hosting katmanı query'ye göre 301 üretebilmeli (T-002)
- İçerik deposunun tür bazında ayrılması — `3d-gorsellestirme` slug'ı hem yazı hem sayfa olarak var (T-002)

---

## ADR-009 — İçerik modeli framework'ten bağımsız TypeScript tipleri olarak tutulacak

**Durum:** Kabul edildi
**Tarih:** 2026-07-30

### Karar

Hedef içerik şeması `src/types/content.ts` içinde, hiçbir framework'e bağımlılık içermeyen TypeScript tipleri olarak tanımlanır. Doğrulama `tsc --noEmit` ile strict modda yapılır.

### Neden

ADR-008 henüz kesinleşmedi. Migration proof-of-concept (T-005) ve tasarım çalışması framework kararını beklemeden ilerleyebilmelidir. Şema bağımsız tutulursa Astro/Next.js seçimi içerik modelini geçersiz kılmaz.

### Sonuç

TypeScript 5.9.2 pinlendi. `npm run typecheck` her görevin tamamlanma kontrolüne dahildir. Model, `architecture.md` taslağının ölçülen REST verisine göre revize edilmiş halidir.

---

## ADR-010 — Prototipler Tailwind CDN yerine token tabanlı CSS ile yazıldı

**Durum:** Kabul edildi
**Tarih:** 2026-07-30

### Karar

Faz 1 prototipleri (`prototypes/direction-a.html`, `direction-b.html`) el yazımı, `src/styles/tokens.css` üzerine kurulu CSS ile yazıldı. Tailwind prototip aşamasında kullanılmadı.

### Neden

`MASTER_PROMPT.md` prototip için "HTML + Tailwind" öneriyor. Tailwind'i derleme adımı olmadan kullanmanın tek yolu tarayıcı CDN derleyicisidir; ölçüldü: 281 KB. Bu:

- Faz 1'in amacı olan "premium ve hızlı deneyimi doğrulama"yı ölçülemez kılar
- sayfa yüklenirken stilsiz içerik parlaması yaratır
- prototipi ağ bağımlısı yapar

Ayrıca tasarım tokenlarının tek kaynakta toplanması (`AGENTS.md` §5) zaten gerekliydi; tokenlar doğrudan CSS değişkeni olarak yazıldığında Tailwind bir ara katman olmaktan öteye gitmiyordu.

### Sonuç

Üretim sisteminde Tailwind **gerçek bir derleme adımıyla** kullanılacak ve `tokens.css` değerlerini tema olarak alacaktır. Prototipteki CSS üretim koduna doğrudan taşınmayacak; bileşen mimarisi Faz 2'de kurulacak.

Bu, brief'ten bilinçli bir sapmadır ve `MASTER_PROMPT.md` "Teknik yorum" bölümündeki "kararı gerekçesiyle decisions.md içine yaz" talimatı uyarınca kayda alınmıştır.

---

## ADR-011 — Tipografi: Geist + Geist Mono, Yön B için Fraunces

**Durum:** Kabul edildi (gövde ve mono), Öneri (serif — yön seçimine bağlı)
**Tarih:** 2026-07-30

### Karar

Gövde ve arayüz fontu **Geist**, teknik etiketler **Geist Mono**. Yön B seçilirse başlıklar için **Fraunces** eklenir.

### Neden

Üçü de SIL OFL 1.1 lisanslı ve değişken ağırlıklı. Türkçe desteği iki aşamada kanıtlandı: `unicode-range` analizi ve tarayıcıda gerçek glif çizim testi (tofu karşılaştırması). Dokuz Türkçe karakterin tamamı ayrı glif olarak çiziliyor.

Inter ve Roboto `AGENTS.md` §6 gereği kullanılmadı.

### Performans

Yalnızca `latin` ve `latin-ext` alt kümeleri yükleniyor. Yön A iki aile, Yön B üç aile istiyor — yön seçiminde bu maliyet dikkate alınmalı.

---

## ADR-012 — Üretim framework'ü: Astro (kesinleşti)

**Durum:** Kabul edildi
**Tarih:** 2026-07-30

### Karar

ADR-008'in ön eğilimi kanıtlandı ve kesinleştirildi: üretim sistemi **Astro 7** ile kuruldu. TypeScript strict, Tailwind 4 (gerçek derleme adımıyla), içerik koleksiyonları.

### Doğrulanan maddeler

| Kriter | Sonuç |
|---|---|
| `.html` uzantılı route üretimi | ✅ dizin formatı + build sonrası düzleştirme |
| 457 yazı + 1809 medya ile build süresi | ✅ ~4 sn, 525 sayfa |
| Yazı/sayfa slug çakışması | ✅ ayrı çıktı yolları |
| Site içi arama | ✅ statik indeks + istemci tarafı filtre |
| JS kapalıyken okunabilirlik | ✅ içerik tamamen sunucu tarafında |

### Sonuç

`build.format: "directory"` + `scripts/build/flatten-html-routes.mjs`. Bu kombinasyon her URL'i tam dosya eşleşmesine indirger; hosting'in "clean URL" davranışına bağımlılık kalmaz.

---

## ADR-013 — Kaynaktaki mevcut yönlendirmeler keşfedilip taşınacak

**Durum:** Kabul edildi
**Tarih:** 2026-07-30

### Karar

Kaynak WordPress'te tanımlı (Rank Math Redirections) yönlendirmeler keşfedilip `_redirects` dosyasına taşınır. Keşif `scripts/wordpress/resolve-redirects.py` ile yapılır ve tekrar çalıştırılabilir.

### Neden

Doğrulamada 76 iç link hedefte çözülmedi. "Kırık link" varsayılıp geçilebilirdi; kaynağa sorulduğunda **59'unun 301 ile çalıştığı** görüldü. Taşınmasalardı şu anda çalışan ve SEO değeri taşıyan 59 URL yeni sitede 404 olacaktı.

### Sonuç

İçerikteki 83 iç link nihai hedefe çevrildi (gereksiz yönlendirme adımı kalktı), eski URL'ler `_redirects` ile korundu. 16 URL kaynakta da 404; onlar için 404 doğru davranış.

---

## ADR-014 — Doğrulama "bilinen sorun" ayrımı yapar

**Durum:** Kabul edildi
**Tarih:** 2026-07-30

### Karar

`verify-content.mjs`, kaynak sistemde de mevcut olan sorunları (`docs/migration/known-issues.json`) **bilinen** olarak ayırır ve yalnızca yeni bozulmalarda build'i kırar.

### Neden

Kaynakta zaten 3 boş sayfa, 2 kayıp görsel ve 16 kırık link var. Bunlar hata sayılırsa doğrulama sürekli kırmızı kalır ve gerçek bir gerileme fark edilmez. Her bilinen madde kaynağa karşı HTTP ile doğrulandı; liste varsayımla değil kanıtla dolduruldu.

---

## ADR-015 — Başlıklar beyaz; sarı vurgu rolüne çekildi

**Durum:** Kabul edildi
**Tarih:** 2026-07-31

### Karar

`h1`–`h3` başlıkları **beyaz** (%90 opak) olacak. Sarı (`#FFD400`) artık başlık dolgusu değil, **vurgu** rengidir: bölüm başlığı daireleri, ikonlar, sayaçlar, aktif menü, bağlantılar ve düğmeler.

### Bu, önceki kuralın değiştirilmesidir

`MASTER_PROMPT.md`, `AGENTS.md` §6 ve `PROJECT.md` §6 "ana başlıklar ve bölüm başlıkları tamamen dolu sarı olmalıdır" diyordu. T-003'te bu kural uygulanmış ve doğrulanmıştı (32/32 başlık dolu sarı).

Kullanıcı yeni bir görsel referans verdi (RyanCV Classic Dark) ve o referansta başlıklar beyaz. Seçenekler açıkça sunuldu; kullanıcı **referanstaki gibi beyaz** olmasını seçti.

### Neden kayıt altına alınıyor

Kural belgelerde üç ayrı yerde yazılıydı ve T-003 doğrulaması buna dayanıyordu. Kaydedilmezse ileride "başlıklar neden sarı değil?" sorusu kural ihlali gibi görünürdü.

### Sonuç

- `tokens.css` içindeki zorunlu sarı dolgu kuralı kaldırıldı.
- 60–30–10 dengesi korunuyor; sarının payı azalmadı, yeri değişti.
- Kontrast: beyaz %90 opak, koyu zeminde WCAG AA üzerinde kalır.
- Eski hâl `prototypes/direction-a.html` içinde duruyor; geri dönmek istenirse referans oradadır.

---

## ADR-016 — Arayüz "CV uygulaması" kabuğuna geçiyor

**Durum:** Kabul edildi
**Tarih:** 2026-07-31

### Karar

Ana sayfa ve site kabuğu, sol sabit ikon şeridi + yuvarlatılmış içerik kartı düzenine geçiyor (referans: RyanCV Classic Dark).

### Neden

Kullanıcı mevcut "Blueprint" yönünü fazla sade buldu ve somut bir referans verdi.

### Uyarlamalar — referans birebir kopyalanmıyor

Referans tema ~10 portfolyo öğesi ve birkaç blog yazısı için tasarlanmış. Bizde **457 yazı ve 27 kategori** var. Bu yüzden:

- Blog arşivi, kategori ve yazı sayfaları kabuğu paylaşır ama okuma düzenini korur (ölçü genişliği, sağ sütun).
- Referansın kart yoğunluğu blog listelerinde tekrarlanmaz; `AGENTS.md` §6 "bölümler aynı kart şablonunun tekrarından oluşmamalı" kuralı geçerliliğini sürdürür.
- Kod kopyalanmaz; yalnızca düzen deseni uyarlanır.

### Veri olmayan bölümler

Hizmetler, fiyatlandırma, sayaçlar ve referanslar için gerçek veri yok. Kullanıcı kararı: bölümler tasarlanır, içerik açıkça "YER TUTUCU" etiketiyle işaretlenir (`AGENTS.md` §5).

Profil fotoğrafı ve kapak görseli kullanıcıdan gelecek; o ana kadar işaretli yer tutucu kullanılır.

---

## ADR-017 — Konu dışı 27 yazı kaldırıldı; 410 Gone kullanılıyor

**Durum:** Kabul edildi
**Tarih:** 2026-07-31

### Karar

Ocak 2024 civarında toplu üretilmiş, siteyle konu ilgisi olmayan 27 yazı yeni siteden kaldırıldı (perakende kampanyaları, cihaz lansmanları, yemek tarifleri). Liste: `docs/content/excluded-posts.json`.

Kaldırılan URL'ler **410 Gone** döner.

### Neden 410, 404 değil

404 "şu an bulunamadı", 410 "kalıcı olarak kaldırıldı" demektir. Arama motoru 410'da URL'yi indeksten daha hızlı düşürür ve yeniden taramaya çalışmaz. Bu içerik geri gelmeyeceği için doğru sinyal 410'dur.

Yönlendirme (301) tercih edilmedi: tarif yazısını render kategorisine yönlendirmek arama motoruna yanlış konu sinyali verir.

### Neden ADR-004'ü ihlal etmiyor

ADR-004 "her eski URL ya korunur ya 301 alır" diyordu. Burada bilinçli bir üçüncü yol seçildi ve kayda alındı: içerik kasıtlı olarak yayından kaldırılıyor. Doğrulama aracı bu URL'leri "eksik" saymaz, `excluded-posts.json` üzerinden bilir.

### Mekanizma

Silme işlemi dosya silmekle yapılmadı — bir sonraki migration kaynaktan geri getirirdi. Bunun yerine:

- `migrate.py` dışlama listesini okur, o yazıları üretmez ve kalıntı dosyayı temizler
- `generate-htaccess.mjs` her biri için `RewriteRule ... [G,L]` üretir
- `verify-urls.mjs` bunları beklenen-yok kabul eder; adet doğrulaması 457 yerine 430 bekler

### Kaynak sistem

Kaynak WordPress'e dokunulmadı (ADR-003). Yazılar orada duruyor; karar geri alınırsa listeden çıkarmak yeterli.

### Açık

Search Console erişimi olmadığı için bu 27 URL'in trafik alıp almadığı doğrulanamadı. Erişim gelirse trafik alan varsa listeden çıkarılmalı.

---

## ADR-018 — "Yaşam" yazıları park edildi; silinmedi

**Durum:** Kabul edildi
**Tarih:** 2026-07-31

### Karar

"Yaşam" kategorisinde kalan **93 yazı** ufuksen.com'dan çıkarıldı ama **silinmedi**. Ayrı bir siteye taşınmayı bekliyorlar.

Davranış:

| Yer | Durum |
|---|---|
| Ana sayfa, blog listesi, kategoriler | görünmez |
| Site içi arama, RSS, video vitrini | görünmez |
| Sitemap | girmez |
| Kendi URL'i | **çalışır**, `noindex` taşır, sayfada arşiv notu var |

### Neden silinmedi (410 verilmedi)

ADR-017'deki 27 yazı kalıcı olarak kaldırıldı, bu yüzden 410 doğruydu. Bu 93 yazı ise **başka bir alan adına taşınacak**. 410 vermek biriken SEO değerini yok eder; taşıma tamamlandığında 301 ile aktarılması gerekir.

Silme, taşıma tamamlanmadan yapılmaz. Yeni site yayına girince bu URL'ler 301 ile oraya yönlendirilecek ve park listesi kaldırılacak.

### Kategori sayıları yeniden hesaplanıyor

`postCount` kaynak sistemden geliyor ve park edilen yazıları da sayıyordu. Kategori sayfası "120 yazı" der ama hiçbirini listelemezdi. Sayılar artık görünür yazılardan hesaplanıyor (`getVisibleCategories`).

### Liste

`docs/content/parked-yasam.json` (tam döküm) ve `src/content/parked.json` (build listesi).

---

## Açık Kararlar

- [x] Next.js mi Astro mu? -> **Astro** (ADR-012)
- [ ] 1401 yorum taşınacak mı?
- [ ] MP Timetable (`mp-event`/`mp-column`) içeriği kapsam içinde mi?
- [ ] Örtüşen kategoriler ve sayfalar konsolide edilecek mi? (edilirse redirect zorunlu)
- [x] Ana sayfa yönü -> **Yön A (Blueprint)** uygulandı (kullanıcı kararı bana bırakıldı)
- [ ] WordPress headless olarak devam edecek mi, yoksa içerik başka CMS'e mi taşınacak?
- [ ] Hosting sağlayıcısı ne olacak? (statik; `_redirects` destekleyen Netlify/Cloudflare Pages varsayıldı)
- [x] Arama -> **yerel statik indeks** (`/search-index.json`), harici servis yok
- [ ] Form sağlayıcısı ne olacak?
- [ ] Yorumlar taşınacak mı?
- [ ] Çoklu dil hangi fazda başlayacak?

---

## ADR-019 — Yönetim paneli kuruluyor; içerik kaynağı WordPress'ten depoya taşınıyor

**Durum:** Kabul edildi
**Tarih:** 2026-07-31

### Karar

Site kendi yönetim paneline kavuşuyor. WordPress bağımlılığı sona eriyor.

| Katman | Seçim |
|---|---|
| Panel | Sveltia CMS (Git tabanlı), `/admin` adresinde |
| Kimlik doğrulama | GitHub — Netlify'ın yerleşik OAuth'u |
| Depo | GitHub |
| Hosting | Netlify (push'ta otomatik derleme) |
| DNS | Cloudflare'de kalır |

### Neden Netlify, Cloudflare Pages değil

DNS zaten Cloudflare'de olduğu için Cloudflare Pages doğal görünüyordu. Ancak Sveltia CMS'in GitHub girişi için ya bir OAuth proxy (Cloudflare Worker) kurulmalı ya da erişim jetonu elle yapıştırılmalı. Netlify'da bu köprü yerleşik geliyor — teknik olmayan bir kullanıcı için tek fark bu ve belirleyici.

Cloudflare Pages'e geçmek istenirse tek gereken bir Worker kurup `config.yml` içine `base_url` yazmaktır; mimari değişmez.

### İçerik kaynağı değişti — kritik sonuç

Şimdiye kadar tek doğruluk kaynağı WordPress'ti; `migrate.py` içeriği oradan üretiyordu. Artık **depo** doğruluk kaynağıdır. Panelde yapılan düzenleme doğrudan `src/content/*.json` dosyalarına commit edilir.

Bu yüzden `migrate.py` tehlikeli hâle geldi: çalıştırılırsa paneldeki tüm emeği WordPress'teki eski hâlle ezerdi.

Koruma: `src/content/.cms-managed` dosyası varken `migrate.py --apply` **çıkış kodu 3 ile reddediyor**. Bilinçli yeniden içe aktarım için `--allow-overwrite` gerekiyor. Test edildi.

### Panelde gizli alanlar

Sveltia/Decap kaydederken dosyanın tamamını yeniden yazar. Tanımlanmayan alan silinir. Bu yüzden `legacyId`, `migrationChecksum`, `embeds`, `inlineMedia` gibi teknik alanlar `widget: hidden` olarak tanımlandı — panelde görünmezler ama korunurlar.

### WordPress ne olacak

Geçiş tamamlanana kadar kapatılmaz (ADR-003). Yayın sonrası yalnızca yedek olarak durur; içerik kaynağı olarak kullanılmaz.

---

## ADR-020 — Etkileşim katmanı: "eğlenceli, dinamik, sezgisel" zorunlu kuralı

**Durum:** Kabul edildi
**Tarih:** 2026-08-01

### Karar

Kullanıcı yeni bir zorunlu kural bildirdi: kullanım eğlenceli, dinamik ve sezgisel olacak; kullanıcı sitede keyifle vakit geçirecek. Mevcut "ölçülü ve kontrollü" tasarım korunarak üzerine bir **etkileşim katmanı** eklendi:

| Öğe | Ne yapar |
|---|---|
| Sayfa geçişleri (Astro ClientRouter) | Sekmeler arası yumuşak geçiş; sol şerit `transition:persist` ile sabit kalır — site "uygulama" gibi hissedilir |
| Komut paleti (`/` veya `Ctrl+K`) | Her sayfadan anında arama; ok tuşlarıyla gezinme, Enter ile SPA geçişi |
| Işık izi + 3B eğim | Kartlar imleci izler: sarı ışık lekesi ve ≤4° perspektif eğimi — 3D sitesine tematik |
| "Taslaktan render'a" | Kapak görselleri soluk başlar, imleçle renklenir — sitenin işine gönderme |
| İmleci izleyen kapak ışığı | Profil kapağındaki sarı ışık imleçle hareket eder |
| Video şeridi (mobil) | Parmakla kaydır-bırak, karta yapışan yatay şerit |
| Başa dön düğmesi | 600px sonrası belirir; mobilde alt çubuğun üstünde |
| Mikro dokunuşlar | Düğme yaylanması, reveal'e hafif ölçek |

### Önceki kurallarla uzlaşma — neyin değişmediği

`PROJECT.md` "animasyon içeriğin önüne geçmemeli" ve ADR-005 "progressive enhancement" kuralları **geçerliliğini koruyor**:

- Tüm hareket `prefers-reduced-motion` ile kapanır (sayfa geçişi dahil).
- Hover hileleri yalnızca `(hover:hover) and (pointer:fine)` cihazlarda; dokunmatikte görseller her zaman tam renkli.
- İçerik JS olmadan eksiksiz çalışır; palet kapalıyken `/arama` sayfası aynı işi görür.
- Kütüphane eklenmedi (`architecture.md` önceliği: CSS → IntersectionObserver → ancak gerekirse kütüphane). GSAP/Motion gerekmedi.

### Maliyet

JS 0 KB'den 22,5 KB'ye çıktı (ölçüldü: etkileşim modülü ~4 KB + ClientRouter çalışma zamanı). Sayfa geçişlerinde dinleyiciler `AbortController` ile sökülür — birikme yok. Bu maliyet, zorunlu kuralın karşılığı olarak kabul edildi.

### Doğrulanan hata

İlk sürümde klavye dinleyicisi `event.target.closest` çağrısında patladı (hedef `window` olabiliyor) ve `transition:persist` bileşen etiketinden kök elemana aktarılmadı. İkisi de tarayıcıda yakalanıp düzeltildi; palet, ışık izi, ilerleme ve şerit senkronu iki SPA geçişi sonrasında yeniden doğrulandı.

---

## ADR-021 — Ürünler bölümü: teknik çizim dili, ürün başına sayfa, WhatsApp

**Durum:** Kabul edildi
**Tarih:** 2026-08-18

### Bağlam

Ürünler sayfası Instagram ve diğer sosyal ağlardan **doğrudan** paylaşılıyor.
Oraya düşen kişi siteyi tanımıyor; eski düzen ise site içinden gezinen birine
göre kurulmuştu. Kullanıcının talebi: sayfa daha teknik, daha canlı, "çizim"
havasında olsun; ne olduğu ilk bakışta anlaşılsın; her ürün ayrı sayfada
açılsın ve her ürünün içinde WhatsApp butonu bulunsun.

### Karar

**1. Görsel dil: SketchUp'ın kendi dili.** Kareli zemin ızgarası, kırmızı/yeşil/
mavi eksen işareti, kotalama (ölçü) çizgisi ve teknik paftaların köşesindeki
künye bloğu. Süsleme değil, tanıma işareti: SketchUp kullanan biri sayfayı
açtığında ne olduğunu okumadan anlıyor.

**2. Giriş bölümü üç soruyu cevaplıyor:** Bu ne? (başlık) · Bana ne? (fayda
şeridi) · Nasıl ulaşırım? (WhatsApp). Sayılar veriden hesaplanıyor, elle
yazılmıyor — ürün eklendiğinde kendiliğinden güncelleniyor ve gerçekle asla
çelişmiyor.

**3. Ürün başına sayfa:** `/urunler/{slug}`. Tek ürünün bağlantısı
paylaşılabiliyor; ziyaretçi listeye düşüp aradığını aramıyor. Her sayfada
`SoftwareApplication` yapılandırılmış verisi ve arşivden gerçek ilgili yazılar.

**4. WhatsApp butonu:** WhatsApp'ın kendi marka yeşili (#25D366) — bilerek token
sisteminin dışında, çünkü bu bir tema rengi değil, tanınması gereken servis
işareti. Mesaj ürün adıyla önceden dolu geliyor.

### Numara nereden geldi

Uydurulmadı. Kullanıcının kendi "SketchUp Özel Ders" sayfasında yayınladığı
`wa.me/905303229301` bağlantısından okundu. Panelden düzenlenebilir; **boş
bırakılırsa butonlar sitede hiç görünmez** — çalışmayan buton gösterilmez.

### Eksik veri

Kitchen Studio'nun özellik listesi yok. Uydurulmadı: "Ayrıntılar hazırlanıyor"
notu ve iletişim yolu gösteriliyor (AGENTS.md §5).

### Yol açtığı düzeltme

Sol şeritteki sosyal ikonlar **18px genişlikteydi** (44px kuralının çok
altında). Kök neden `align-items: center` — `<li>` içeriğine daralıyor, içindeki
`%100` genişlikteki `<a>` de onunla daralıyordu. `stretch` ile giderildi (56px).

Yükseklik 44px'e çıkarılmak istendi ama ölçüldü: şerit içeriği 850px alana
karşı 874px'e taşıyordu. Geri alındı ve gerekçesi koda yazıldı — kuralı
uygulamak için menüyü taşırmak, kuralın koruduğu şeyi bozardı.


---

## ADR-022 — Ürünler: çekirdek yapı (ürün başına dosya, doğrulanmış şema)

**Durum:** Kabul edildi
**Tarih:** 2026-08-18

### Bağlam

Kullanıcı 4-5 ürün daha ekleyeceğini bildirdi. Mevcut düzen tek bir
`products.json` dosyasıydı ve sekiz üründe üç yerden kırılırdı:

1. **Panel kullanılamaz hale gelirdi** — sekiz ürün tek bir dev formda; yeni
   ürün eklemek için var olanların içinden geçmek gerekirdi.
2. **Her yeni ürün tipi kod değişikliği isterdi** — `desenler`/`desenNotu`
   FloorStudio'ya özeldi; başka bir ürünün "Desteklenen formatlar" listesi
   için yeni alan ve yeni şablon kodu gerekirdi.
3. **Hatalı veri sessizce geçerdi** — şema doğrulaması yoktu.

### Karar

**1. Ürün başına dosya.** `src/content/products/{slug}.json`. Panelde "Ürünler"
kendi bölümü oldu; ekle/düzenle/sil tek tek yapılıyor.

**2. Astro içerik koleksiyonu + zod şeması.** Panelden hatalı veri gelirse
derleme **durur**. Sessizce yanlış sayfa üretmektense gürültülü hata yeğdir.

**3. Ürüne özel alanlar genelleştirildi.** `desenler`/`desenNotu` yerine
adlandırılmış `listeler`: her ürün kendi başlığıyla istediği kadar liste
tanımlar ("Desen kütüphanesi", "Desteklenen formatlar"…).

**4. Yeni isteğe bağlı bölümler:** galeri, tanıtım videosu, S.S.S., fiyat,
deneme bağlantısı. Hepsi boşken hiç render edilmez.

**5. `yayinda` anahtarı.** Hazır olmayan ürün panelde bekler, sitede görünmez.

**6. Ortak mantık tek dosyada** (`src/lib/products.ts`): sıralama, durum/tür
etiketleri, ikon kümesi. İkon listesi daha önce iki dosyada kopyalanmıştı.

**7. Süzgeç eşiği veriye bağlı.** Ürün sayısı 5'e ulaşıp birden fazla tür
olduğunda tür süzgeci kendiliğinden belirir; JavaScript kullanmaz (gizli radyo
düğmeleri + `:has()`). `:has()` desteklenmezse tüm ürünler görünür kalır —
hiçbir ürün erişilemez hale gelmez (ADR-005).

### Doğrulama

Göç elle değil betikle yapıldı ve taşınmayan alan raporlandı: sıfır kayıp.

Çekirdeğin işe yaradığı, geçici bir dördüncü ve beşinci ürün eklenerek
kanıtlandı: **hiçbir kod değişikliği olmadan** sayfa üretildi, video/liste/
S.S.S./fiyat/satın al bölümleri çıktı, yeni ikon çalıştı ve beşinci üründe
süzgeç kendiliğinden belirip doğru süzdü. Sınama kayıtları sonra silindi.

### Bilinçli olarak yapılmayanlar

Ürün karşılaştırma tablosu, ürün içi arama, etiket sistemi. Üç üründe hiçbiri
değer üretmez; ihtiyaç doğduğunda eklenir. Şema bunları engellemiyor.
