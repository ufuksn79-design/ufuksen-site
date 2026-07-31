# Öğrenilen Dersler

Bu dosya yalnızca gerçek hata, başarısız deneme veya ölçülebilir öğrenim sonrasında güncellenir. Varsayımsal dersler gerçek olay gibi yazılmaz.

## Kayıt Şablonu

### LES-XXX — Kısa başlık

- Tarih:
- İlgili görev/commit:
- Belirti:
- Kök neden:
- Yanlış yaklaşım:
- Doğru çözüm:
- Eklenen regression testi:
- Gelecekte uygulanacak kural:

---

## LES-001 — Görsel prototip ile üretim mimarisi aynı şey değildir

- Tarih: 2026-07-30
- İlgili görev: Proje planlama
- Belirti: Tek HTML + Tailwind talebi ile geniş WordPress arşivinin dinamik aktarımı aynı kapsamda değerlendirildi.
- Kök neden: Tasarım prototipi gereksinimi ile uzun vadeli içerik platformu gereksiniminin birbirine karışması.
- Yanlış yaklaşım: Tüm sistemi tek sayfaya sıkıştırmak.
- Doğru çözüm: Ana sayfayı single-scroll deneyim yapmak; blog ve içerik detaylarını ayrı SEO URL'lerinde çalıştırmak.
- Regression testi: Mimari inceleme kontrol listesi.
- Gelecekte uygulanacak kural: Brief'teki teknik öneri, veri ve işletim gereksinimleriyle çelişiyorsa karar kaydı oluştur.

## LES-002 — Migration “kopyala-yapıştır” işi değildir

- Tarih: 2026-07-30
- İlgili görev: Proje planlama
- Belirti: Yazılar dışında medya, metadata, shortcode, iç link, slug ve redirect ihtiyaçları ortaya çıkar.
- Kök neden: İçeriğin yalnızca görünen metinden ibaret sanılması.
- Doğru çözüm: Kaynak snapshot, normalize etme, medya eşleme, URL rewrite, doğrulama ve redirect aşamaları.
- Gelecekte uygulanacak kural: Göç tamamlanma kriterine adet, hata raporu ve URL doğrulaması ekle.

## LES-003 — Envanter taramasında kabuk grep'i Türkçe içerikte yanlış "temiz" sonucu verdi

- Tarih: 2026-07-30
- İlgili görev: T-001
- Belirti: Yazı gövdelerinde `grep` ile yapılan shortcode/class taraması hiçbir eşleşme bulmadı; içerik boş sanıldı. Oysa yazı gövdesi 2855 karakterdi.
- Kök neden: Windows kabuğunda JSON'daki UTF-8 Türkçe karakterlerin bozulması ve JSON escape'lerinin (`\"`) regex'i kaydırması. Grep sessizce 0 sonuç döndürdü; hata sinyali üretmedi.
- Yanlış yaklaşım: Kabuk `grep`/`sed` zincirinin 0 sonucunu "shortcode yok" kanıtı saymak.
- Doğru çözüm: Analizi Python'da, JSON'u gerçek parser ile açıp UTF-8 okuyarak yapmak (`scripts/wordpress/inventory.py`). Aynı tarama gerçek embed ve görsel sayılarını ortaya çıkardı.
- Regression testi: Envanter aracı her çalıştığında `incelenen_yazi` sayısını raporluyor; 0 sonuçlar örneklem boyutuyla karşılaştırılabiliyor.
- Gelecekte uygulanacak kural: Türkçe/UTF-8 içerik üzerinde yapısal analiz için kabuk metin araçlarına güvenme; yapılandırılmış veriyi kendi parser'ıyla oku. "Bulunamadı" sonucunu, aracın gerçekten okuduğunu kanıtlamadan kanıt sayma.

## LES-004 — Redirect kalıbı tahmin edildi; gerçek değer okunmadan haritaya yazıldı

- Tarih: 2026-07-30
- İlgili görev: T-002
- Belirti: URL eşleme tablosunun ilk üretiminde AMP varyantları `/{slug}/amp` olarak yazıldı. Doğrulamada bu URL 404 döndürdü; gerçek `rel="amphtml"` değeri `/{slug}.html?amp=1` idi ve ayrıca `/{slug}.html/amp` de 200 dönüyordu.
- Kök neden: WordPress AMP eklentilerinin yaygın kalıbı varsayıldı; kaynak sayfadaki `amphtml` linki okunmadan haritaya yazıldı.
- Yanlış yaklaşım: 457 satırlık redirect kuralını "genelde böyledir" bilgisiyle üretmek. Uygulansaydı 457 gerçek AMP URL'i 404'te kalır, üretilen 457 kural ise hiçbir şeye karşılık gelmezdi.
- Doğru çözüm: Kalıbı kaynaktan okumak (`rel="amphtml"`) ve her aday biçimi HTTP durum koduyla doğrulamak. Doğrulama sonucu iki geçerli biçim ortaya çıkardı; script ikisini de haritalıyor.
- Regression testi: `url-map.py` tekrarlanan legacy URL bulursa exit 1 döndürüyor. AMP biçimleri kod içinde ölçülen davranışla birlikte yorumlandı.
- Gelecekte uygulanacak kural: Redirect haritasına giren her URL kalıbı kaynak sistemde en az bir örnekle HTTP durum kodu düzeyinde doğrulanır. SEO'yu koruma amaçlı bir kural, doğrulanmamışsa koruma değil risktir.

## LES-005 — Bir endpoint'in 404 olması "veri yok" demek değildir

- Tarih: 2026-07-30
- İlgili görev: T-001 → T-002
- Belirti: T-001'de Rank Math'in `getHead` endpoint'i 404 döndüğü için "SEO alanları REST'te yok, tek yol head scrape veya export" sonucuna varıldı. T-002'de yazı `meta` alanı incelendiğinde `rank_math_description` ve `rank_math_focus_keyword` 40/40 dolu çıktı.
- Kök neden: Eklentinin kendi endpoint'i ile eklentinin çekirdek REST üzerinden açtığı postmeta alanları karıştırıldı. Tek bir endpoint denenip genelleme yapıldı.
- Etkisi: `focus_keyword` yalnızca REST ve WXR export'ta bulunuyor; head scrape'e güvenilen bir migration bu alanı sessizce kaybederdi.
- Doğru çözüm: Zaten elde olan yanıt gövdesindeki tüm alanları taramak. Veri elde varken yeni istek atmadan doğrulanabilirdi.
- Gelecekte uygulanacak kural: Bir veri kaynağı "yok" diye kapatılmadan önce eldeki yanıtın tüm alanları taranır. Yokluk iddiası, varlık iddiası kadar kanıt ister.

## LES-006 — `overflow-wrap` yatay taşmayı çözmez; kök neden `min-width: auto`

- Tarih: 2026-07-30
- İlgili görev: T-003
- Belirti: 320px genişlikte `document.scrollWidth` 369 ölçüldü; sayfa yatay kayıyordu. Taşan öğeler blog listesi ve kenar çubuğu widget'larıydı.
- İlk yanlış teşhis: Uzun Türkçe kelimelerin ("GÖRSELLEŞTİRME", "dönüştürüyorum") font boyutu yüzünden sığmadığı düşünüldü. Başlık `clamp()` alt sınırı düşürüldü ve `overflow-wrap: break-word` eklendi — **taşma sürdü** (369 → 369).
- Kök neden: Izgara ve esnek kutu öğelerinin varsayılan `min-width: auto` değeri, öğenin min-content genişliğinin altına inmesini engelliyor. `overflow-wrap: break-word` yalnızca taşma anında kırılmaya izin verir; öğenin **min-content katkısını değiştirmez**. Dolayısıyla konteyner genişlemeye devam eder.
- Doğru çözüm: `tokens.css` içinde tek satır — `:where(body *) { min-width: 0 }`. `:where()` özgüllüğü 0 tuttuğu için bileşenler gerektiğinde ezebiliyor. Sonuç: 320px'te scrollWidth = 320.
- Yan bulgu: `body { overflow-x: hidden }` taşmayı gizler ama `scrollWidth`'i düzeltmez; semptomu saklayıp kök nedeni bırakır.
- Regression testi: Her prototip için 320/375/430px'te `scrollWidth > clientWidth` kontrolü ve 44px altı dokunma hedefi sayımı.
- Gelecekte uygulanacak kural: Yatay taşmada önce hangi öğenin genişlediği ölçülür, sonra düzeltme yapılır. Tipografi ölçeğini küçültmek çoğu zaman semptomu maskeler.

## LES-007 — DOM ölçümü geçen tasarım, ekran görüntüsünde kabul edilemez olabilir

- Tarih: 2026-07-30
- İlgili görev: T-003
- Belirti: Yön A tüm otomatik kontrolleri geçti (taşma yok, dokunma hedefleri tamam, başlıklar dolu sarı). Ekran görüntüsü alındığında hero başlığındaki `dönüştürüyorum.` kelimesinin `dönüştürüyoru` / `m.` diye ortadan bölündüğü görüldü.
- Kök neden: Başlık 1.35fr'lik dar sütundaydı; 104px punto sütuna sığmayınca LES-006'da eklenen kırılma davranışı devreye girdi. Teknik olarak taşma yoktu, bu yüzden `scrollWidth` kontrolü sessiz kaldı.
- Yanlış yaklaşım: "Ölçümler temiz, bölüm tamam" demek. Sayısal kontroller yalnızca ölçtükleri şeyi kanıtlar.
- Doğru çözüm: Hero başlığı masaüstünde tam genişliğe alındı; lead/CTA ve sayısal blok altına iki sütuna dağıtıldı.
- Regression testi: Tamamlanma kontrolüne kritik breakpoint'lerde ekran görüntüsü incelemesi eklendi.
- Gelecekte uygulanacak kural: Görsel bir işi "tamamlandı" saymadan önce gerçekten bakılır. DOM ölçümü tipografi kalitesini, ritmi ve kelime kırılmasını değerlendiremez.


## LES-008 — Sayfalamada "beklenenden az geldi, bitti" varsayımı veri kaybettirir

- Tarih: 2026-07-30
- İlgili görev: T-005 (migration)
- Belirti: Medya kütüphanesinden 795 yerine 174 kayıt çekildi ve script "başarılı" raporladı.
- Kök neden: `fetch_all` döngüsü "gelen kayıt sayısı `per_page`ten azsa son sayfadayız" varsayıyordu. Kaynak sistemde medya endpoint'inin 2. sayfası 8 sayfanın ortasında olmasına rağmen 74 kayıt döndürüyor.
- Yanlış yaklaşım: Sayfa doluluğunu bitiş sinyali saymak. Sessizce %78 veri kaybı üretti.
- Doğru çözüm: `X-WP-TotalPages` başlığıyla döngü kurmak ve sonda toplam adedi `X-WP-Total` ile karşılaştırıp uyuşmazlıkta hata vermek.
- Regression testi: `fetch_all` artık beklenen/alınan farkını raporluyor; yazı ve sayfada katı, taksonomi/medyada raporlanan uyuşmazlık.
- Gelecekte uygulanacak kural: Sayfalanmış API'de bitiş koşulu sunucunun bildirdiği toplamdan gelir, yanıtın boyutundan değil. Her toplu çekimin sonunda adet doğrulaması yapılır.

## LES-009 — Türkçe dosya adları URL kodlanmadan indirilemiyor

- Tarih: 2026-07-30
- İlgili görev: T-005
- Belirti: 86 görsel `'ascii' codec can't encode character 'ı'` hatasıyla indirilemedi.
- Kök neden: Medya dosya adlarının bir kısmı Türkçe karakter içeriyor (`ekran-kartı-render.jpg`). URL ham hâlde istek katmanına verilince ASCII kodlama hatası oluşuyor.
- Doğru çözüm: İstek öncesi yol bileşenini yüzde-kodlamak (`encode_url`).
- Regression testi: Migration raporunda medya hata sayısı; şu an 0.
- Gelecekte uygulanacak kural: `architecture.md` zaten "Türkçe karakterler ve URL encoding test edilir" diyordu. Kural yazılıydı ama teste dönüştürülmemişti — kuralı koda bağlamayan belge, kuralı korumaz.

## LES-010 — "Kırık link" sonucunu kaynağa sormadan kabul etmek

- Tarih: 2026-07-30
- İlgili görev: T-005
- Belirti: Doğrulama 76 kırık iç link raporladı. İlk yorumum "kaynakta da kırık, editoryal sorun" oldu ve rapora öyle yazdım.
- Kök neden: Örneklem olarak yalnızca kategori linklerini kontrol etmiştim; onlar gerçekten 404'tü. Yazı linklerini kontrol etmeden aynı sonucu tüm gruba genelledim.
- Gerçek: 76 linkin **59'u** kaynakta 301 ile çalışıyordu (Rank Math Redirections). Taşınmasalardı SEO değeri olan 59 URL yeni sitede 404 olacaktı.
- Doğru çözüm: Her aday URL'i kaynağa sormak (`resolve-redirects.py`), yönlendirme hedeflerini kaydetmek, `_redirects` üretmek.
- Regression testi: `legacy-redirects.json` + `_redirects` üretimi; `verify-content.mjs` yeni kırık link çıkarsa kırılıyor.
- Gelecekte uygulanacak kural: Bir alt kümede doğrulanan açıklama tüm kümeye genellenmez. "Zaten bozuktu" demeden önce her sınıf için ayrı kanıt toplanır.

## LES-011 — Kendi hatalı çalışmamın bıraktığı artıklar sonraki çalışmayı bozdu

- Tarih: 2026-07-30
- İlgili görev: T-005
- Belirti: Medya varyantı indirme adımı 440 hata verdi; çoğu `[WinError 5] Erişim engellendi`.
- Kök neden: Daha önceki bir çalışmada JSON'u ham metin üzerinde regex'le taramıştım; yakalanan yollara JSON kaçış karakteri (`\`) takılmıştı. Windows'ta ters bölü dizin ayırıcısı olduğu için `os.makedirs` **dosya adında dizinler** oluşturdu (`sketchup-türkiye-300x300.jpg/`). Kod düzeltildikten sonra bile bu dizinler dosya yazımını engelledi.
- Yanlış yaklaşım: Yapılandırılmış veriyi (JSON) ham metin olarak regex'lemek — LES-003'ün tekrarı.
- Doğru çözüm: JSON'u ayrıştırıp `contentHtml` alanı üzerinde çalışmak; ardından artık dizinleri ve `.part` dosyalarını temizlemek.
- Gelecekte uygulanacak kural: Bir script hata verdiğinde yalnızca kodu düzeltmek yetmez; hatalı çalışmanın diske bıraktığı durum da temizlenir. Aksi hâlde düzeltilmiş kod eski artığın üzerine düşer ve kök neden yanlış yerde aranır.


## LES-012 — Kabuk heredoc'u regex kaçışlarını sessizce bozuyor

- Tarih: 2026-07-31
- İlgili görev: Tasarım turu / içerik temizliği
- Belirti: `migrate.py` içine heredoc ile yazılan bağlantı çözme kodu hiç eşleşme bulmadı. Aynı regex tek başına çalıştırıldığında 3 eşleşme buluyordu.
- Kök neden: Bash heredoc'u Python kaynağına yazarken kaçış dizilerini yorumladı. `` literal backspace karakterine (``), `` ise `` kontrol karakterine dönüştü. Dosyada `<a[^>]*` yazıyordu; bu kalıp hiçbir zaman eşleşmez.
- Neden fark edilmedi: Kod gözle bakınca doğru görünüyor — kontrol karakterleri terminalde görünmez. `sed` çıktısı da normal gösterdi. Ancak `repr()` ile bakıldığında ortaya çıktı.
- Yanlış yaklaşım: Hatayı üç kez farklı yerde aradım (değişken kapsamı, çalışma sırası, URL biçimi) çünkü kodun kendisinin bozulmuş olabileceğini düşünmedim.
- Doğru çözüm: Kaçış içeren kodu heredoc ile değil `Write`/`Edit` aracıyla yazmak. Zorunlu hâlde `chr(92)` gibi açık kaçış üretimi kullanmak.
- Regression testi: `verify-content.mjs` yeni kırık iç link sayısını raporluyor; düzeltme sonrası 3 → 0.
- Gelecekte uygulanacak kural: Kod dosyalarını kabuk heredoc'u ile yazma. Bir kod parçası "doğru görünüyor ama çalışmıyor" olduğunda ilk iş, dosyanın diskteki gerçek içeriğini `repr()` ile doğrulamaktır — LES-003 ve LES-011 de aynı kök nedene dayanıyordu.

## LES-013 — Aynı heredoc tuzağına üçüncü kez düşüldü; bu sefer denetim aracını bozdu

- Tarih: 2026-07-31
- İlgili görev: SEO/performans denetimi
- Belirti: Denetim aracı "510 sayfada görsel ölçüsü eksik" diyordu. Bağımsız yazılan aynı mantık 11 sayfa buluyordu. Sayfaların HTML'i tek tek incelendiğinde eksik yoktu.
- Kök neden: Denetim aracına kabuk heredoc'u ile yazılan `<script[\s\S]*?<\/script>` kalıbında `\b` yine literal backspace karakterine (`\x08`) dönüşmüştü. Regex `<script⌫` arıyordu, hiçbir zaman eşleşmedi ve `<script>` içindeki lightbox şablonu her sayfada sayıldı.
- Neden geç fark edildi: `grep`, `sed` ve dosya görüntüleme kontrol karakterini göstermiyor. Kod gözle tamamen doğru görünüyor. Yalnızca `repr()` ile bakıldığında ortaya çıktı.
- Daha kötüsü: aynı tarama `src/lib/discover.ts` içinde de 2 kontrol karakteri buldu — yani görsel boyutu ekleme ve `h1` indirme dönüşümleri de sessizce çalışmıyordu.
- Doğru çözüm: Tüm script dosyalarını kontrol karakterlerine karşı tarayıp temizlemek; kaçış içeren kodu yalnızca `Write`/`Edit` aracıyla yazmak.
- Regression testi: `audit-seo.mjs` artık gerçek sayıyı veriyor (11 → düzeltmeler sonrası 9, hepsi harici YouTube görseli).
- Gelecekte uygulanacak kural: **Kod dosyalarını kabuk heredoc'u ile yazma.** LES-003, LES-011 ve LES-012 aynı kök nedene dayanıyordu; kural üç kez yazıldı ama uygulanmadı. Bir aracın çıktısı bağımsız bir ölçümle çelişiyorsa, önce aracın kendi dosyasını `repr()` ile doğrula.
