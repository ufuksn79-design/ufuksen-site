/**
 * "Dolap Sihirbazı" masaüstü uygulaması tanıtım yazısı.
 *
 * KAYNAK — her teknik cümlenin dayanağı (3 Kasım 2026'da okundu):
 *   claudes/dolap-sihirbazi-masaustu/docs/PROJE.md      → sürüm, kimlik, lisans
 *   claudes/dolap-sihirbazi-masaustu/docs/OZELLIKLER.md → Tauri/Rust, demo, çıktılar
 *   claudes/dolap-sihirbazi-masaustu/docs/KAPAK.md      → kapak kataloğu (386 model testi)
 *   claudes/dolap-sihirbazi/docs/OZELLIKLER.md          → modül kütüphanesi, üretim çıktıları,
 *                                                         router yerleşimi ölçümleri, mutfak kuralları
 *   claudes/dolap-sihirbazi/docs/REKLAM-OZELLIKLER.md   → doğrulanmış tanıtım maddeleri
 *
 * YAZILMAYANLAR (bilerek):
 *   - Fiyat. Kampanyaya ve kura göre değişiyor; mağazadaki ürün sayfasında duruyor.
 *   - SketchUp'a aktarım. Masaüstü sürümde SketchUp köprüsü henüz karara bağlanmadı
 *     (OZELLIKLER.md "Kalan"); SketchUp tarafı ayrı ürün olan eklentide.
 *   - macOS. Masaüstü kurucu NSIS + WebView2, yani Windows.
 *
 * Videolar: kullanıcının verdiği sürükle-bırak filmi ve Üretim Ders 14 (kesim listesi +
 * plaka yerleşimi). Görseller gerçek program kayıtlarından alınmış karelerdir.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const SLUG = "dolap-sihirbazi-masaustu-dolap-mutfak-tasarim-programi";
const URL_YOL = `/${SLUG}.html`;
const MAGAZA = "https://www.bestsketchupplugins.com/tr/dolap-sihirbazi/";
const MAGAZA_KOK = "https://www.bestsketchupplugins.com/tr/";
const LISTE = "https://www.youtube.com/playlist?list=PLGMnILfTDnFQ";

/** YouTube gömme — site CSS'i `.prose iframe` ile 16:9 ve tam genişlik veriyor. */
const video = (kimlik, baslik, altyazi) => `
<figure class="yazi-video">
  <iframe src="https://www.youtube-nocookie.com/embed/${kimlik}" title="${baslik}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  <figcaption>${altyazi}</figcaption>
</figure>`;

/** Program kaydından alınmış kare. 960/1280 WebP public/media/dolap-sihirbazi altında. */
const gorsel = (ad, alt, altyazi, yuk) => `
<figure>
  <img src="/media/dolap-sihirbazi/${ad}-960.webp" srcset="/media/dolap-sihirbazi/${ad}-960.webp 960w, /media/dolap-sihirbazi/${ad}-1280.webp 1280w" sizes="(min-width: 860px) 800px, 100vw" alt="${alt}" width="960" height="${yuk}" loading="lazy" decoding="async" />
  <figcaption>${altyazi}</figcaption>
</figure>`;

const GOVDE = `
<p><strong>Dolap Sihirbazı</strong>, dolabı ve mutfağı ölçüsünden üretim dosyasına kadar tek pencerede götüren bir <strong>masaüstü programı</strong>. Modülü paletten tutup yerine bırakıyorsunuz; kesim listesi, plaka yerleşimi, delik tablosu, CNC programı ve teklif aynı anda hazırlanıyor. Arada "şimdi bunu üretime çevirelim" diye ayrı bir iş yok — <em>tasarım zaten üretim dosyasının kendisi</em>.</p>

<p>Program masa başında değil, sahadan gelen geri bildirimle büyüdü: alanında uzmanlaşmış 20'den fazla üreticiyle sürekli alışveriş içinde geliştirildi. Aşağıda önce en çok işe yarayan iki özelliği videosuyla anlatıyorum, sonra programın geri kalanını başlık başlık yazdım.</p>

<h2>1. Sürükleyip bırakın: üretim için anında hazır</h2>

<p>Çalışma şekli tek cümleyle şu: soldaki paletten modülü tutun, duvara bırakın. Bırakma noktasına göre modül yerine oturur, komşusuna dayanır, mutfak ölçülerine uyar. Sonra ölçüyü milimetresiyle yazarsınız — en, derinlik, sol duvara uzaklık — ya da tutamacından çekersiniz.</p>

${video("HyXdUio3BSY", "Dolap Sihirbazı: sürükle bırak, hemen CNC'ye gönder", "Mutfağın tamamı sürükle-bırak ile kuruluyor; aynı modelden CNC dosyaları çıkıyor.")}

<p>Buradaki asıl mesele hız değil, <strong>bırakma ile üretim arasında adım olmaması</strong>. Modülü bıraktığınız anda parçaları, delikleri, menteşesi, rayı ve bandıyla gerçek bir kabin kurulmuş olur. Kesim listesine baktığınızda çizimdeki ölçülerin aynısını görürsünüz; "çizim bir şey diyor, atölye başka bir şey kesiyor" durumu ortadan kalkar.</p>

<p>Palet boş bir liste değil: <strong>Modül Kütüphanesi'nde 245 hazır modül</strong> var — mutfak alt 49, mutfak üst 48, mutfak boy 28, banyo 59, panel / dolgu 37, gardırop 8, yatak odası 5, salon / TV 5, antre 3, çalışma 3. Arama kutusuna "çekmece", "60" ya da "evye" yazıp bulursunuz; sarı + ekler, pencere açık kaldığı için arka arkaya modül dizersiniz. Eklenen modül bir resim değil, her paneline müdahale edebileceğiniz gerçek bir dolaptır. Mutfak modülleri ustanın kullandığı ölçülere göre gelir: tezgâh altı 870 mm, üst dolap yerden 1490 mm, tezgâh arası 580 mm. Sık kullandığınız modülü yıldızlayıp favorilere alabilirsiniz; favori modül içindeki düzeniyle birlikte gelir.</p>

${gorsel("surukle-birak", "Dolap Sihirbazı'nda sürükle-bırak paleti ve mutfak planı", "Solda modül paleti, ortada plan: modül bırakılan duvara oturuyor.", 540)}

<h2>2. Kesim optimizasyonu: plaka yerleşimi ve kullanım yüzdesi</h2>

<p>İkinci önemli konu fire. Program iki ayrı yerleşim yapar: testere için giyotin düzeninde bir kesim planı, CNC router için ayrı ve çok daha sıkı bir yerleşim.</p>

<p>Router yerleşiminde parçalar arasında yalnız <strong>freze çapı kadar</strong> boşluk bırakılır; komşu takım yolları aynı kanaldan teğet geçer, hiçbir parçaya girmez. Yerleştirici tek bir düzenle yetinmez: 5 ölçüt × 6 sıralama ve 5 genel deneme yapar, testere planı da aday olarak yarışır — yani <strong>sonuç hiçbir zaman testere planından kötü çıkmaz</strong>. Seçim ölçütü önce en az levha, eşitlikte artan malzemenin tek büyük parça olarak kalması.</p>

<p>Bunun ölçülmüş karşılığı şu: 800 ölçü varyasyonunda testere yerleşimi 3.787 levha isterken router yerleşimi 3.562 levhada bitiriyor — <strong>%5,9 daha az levha</strong>. Tek bir örnekte, 3640 × 1760 mm TV duvar ünitesi <strong>9 levha yerine 6 levhadan</strong> çıkıyor. Hesap deterministik ve 10 milisaniyenin altında; ölçüyü değiştirdiğinizde beklemezsiniz.</p>

${gorsel("plaka-yerlesimi", "Dolap Sihirbazı CNC adımında plaka yerleşimi ve levha kullanım yüzdesi", "CNC kartında levha sayısı, kullanım yüzdesi, delik adedi ve parçalar arası boşluk yazıyor.", 540)}

<p>Her levhanın üstünde kullanım yüzdesi yazar, kartta "kaç levha · kullanım % · kaç delik · parçalar arası kaç mm" özeti durur ve açılır önizlemede programların gerçekten kestiği levhaları birebir görürsünüz. 280 cm'lik plakaya sığmayan taç, baza ve dolgu kendiliğinden ekli parçalara bölünür; plakaya dik sığmayan kapak yalnız o durumda yatık yerleşir, desen yönü boşuna bozulmaz.</p>

${video("9Mjf89HfMWQ", "Dolap Sihirbazı: kesim listesi ve plaka yerleşimi modelden hazır çıkar", "Kesim listesi ve plaka yerleşimi, modelin kendisinden üretiliyor — elle liste yazmak yok.")}

<h2>3. Artık hiçbir programa bağlı değil: kendi masaüstü uygulaması</h2>

<p>Dolap Sihirbazı'nın başlangıçta bir SketchUp eklentisi olduğunu bilenler için en büyük haber bu: <strong>program artık kendi başına çalışan bir masaüstü uygulaması</strong>. Bilgisayarınızda başka bir çizim programının kurulu olması gerekmiyor; tarayıcı sekmesi de değil, kendi penceresi olan bir Windows programı.</p>

<ul>
  <li><strong>Kendi çekirdeği var.</strong> Program Tauri 2 kabuğuyla paketlendi; ağır hesap Rust tarafında yapılıyor: CNC programı ve G-kodu, testere ve router levha yerleşimi, teklif, kesim listesi CSV, delik tablosu, DXF ve parça başına DXF.</li>
  <li><strong>İnternet bağımlılığı yok.</strong> Lisans bir kez etkinleştirildikten sonra program internetsiz çalışır. Lisans tek bilgisayara tanımlıdır.</li>
  <li><strong>Projeler sizde durur.</strong> Proje dosyası kendi bilgisayarınıza kaydedilir; kapatırken kaydedilmemiş değişiklik varsa program sorar.</li>
  <li><strong>Türkçe ve İngilizce.</strong> İngilizce sürümün adı Wardrobe Studio; menüler, uyarılar, teklif ve CNC başlıkları dahil her şey çevrilidir.</li>
</ul>

<p>SketchUp tarafında çalışmayı sürdürenler için eklenti sürümü duruyor: <a href="/eklenti/wardrobe-studio.html">Dolap Sihirbazı SketchUp eklentisi</a>. Aynı mantık, SketchUp penceresinin içinde.</p>

<h2>4. Yapboz kadar basit</h2>

<p>Programın tasarım mantığı bilerek yapboz gibi kuruldu: <strong>parçayı al, yerine koy, oturur.</strong> Öğrenilecek bir "komut dili" yok.</p>

<ul>
  <li>Panel paletinden alt tabla, yan, dikme, raf, arkalık, kapak, baza seçip 3B'de tıkladığınız yere koyarsınız; parça komşusuna kendiliğinden dayanır, uca yakın tıklarsanız uca hizalanır.</li>
  <li>Alt tabla yanların altına girer, baza en alt tablanın altına girer, gövde kendiliğinden kalkar — ustanın kafasındaki sıra neyse program da onu yapar.</li>
  <li>Delikler kendiliğinden gelir: minifiks, kavela, raf pimi, menteşe yuvası ve plakası, kulp vidası.</li>
  <li>Her değer açık: ölçü ve konum milimetreyle yazılır, ok tuşlarıyla 1 mm (Shift ile 10 mm) kaydırılır, yanlış olduysa Ctrl+Z ile geri alınır. Hiçbir alan kilitli değildir; usta istediği yere müdahale eder.</li>
</ul>

<p>Yani hazır modülle başlayıp ayrıntıyı elle düzeltebilir, ya da boş alandan panel panel kendi kabininizi kurabilirsiniz. İkisi aynı projede yan yana durabilir.</p>

<h2>5. Programın içindeki diğer işler</h2>

<h3>Hazır modeller ve ürün başlıkları</h3>

<p>Gardırop, banyo dolabı, çamaşır dolabı, TV ünitesi, ayakkabılık ve kitaplık başlıklarının altında <strong>25 hazır model</strong> var: iki kapılı gardıroptan duvar boyu gardıroba, asma lavabo dolabından çift lavabolu banyo dolabına, çamaşır + kurutma kulesinden TV duvar ünitesine. Biri seçilir, saniyesinde kurulur; sonra ölçüsü değiştirilir.</p>

<h3>Ustanın kuralları programın içinde</h3>

<p>Menteşe tipi konuma göre kendiliğinden seçilir (dış yanda düz, ortak dikmede yarım kıvrık, gömme kapakta tam kıvrık). İki kapak aynı dikmeye bağlanınca menteşeler 32 mm kaydırılır, vidalar birbirine girmez. Menteşe rafa ya da ara tablaya denk gelmez, en yakın boş kota kayar. Çekmece rayı sistemine göre kasa ölçüsü daralır ve ray boyu hep piyasada olan ölçülerden seçilir. Taçta kapak boşluğu bırakılır, süpürgelik payı ve duvar dolgusu hesaba katılır.</p>

<h3>Malzeme, kapak ve donanım markaları</h3>

<p>Gövde ve kapak için levha (sunta, MDF, kontrplak, masif, kompakt) ve kaplama (melamin, papel, akrilik, laminat, membran, lake, vernik) ayrı ayrı seçilir; membran ve lakede kenar bandı kendiliğinden düşer. Kapak tarafında ayrı bir bölüm var: <strong>kapak kataloğundaki 386 model</strong>, sekiz ayrı ölçüde otomatik sınanıyor ve seçtiğiniz tasarım kapağın ölçüsüne parametrik oturuyor. Donanımda Blum, Häfele ve Samet gibi markaların kendi serileri seçilebiliyor; teklif satırı marka ve seri adıyla yazılıyor.</p>

<h3>Teklif</h3>

<p>Tek tıkla teklif: plaka, bant, kapak, menteşe, ray, lavabo, LED, işçilik, kâr ve KDV. Birim fiyatları atölye kendi girer, fiyatı girilmemiş malzeme uyarı olarak görünür. Hesaplanan tutarın altına kendi rakamınızı yazabilirsiniz — fark KDV'den önce indirim (ya da ek tutar) satırına yazılır, KDV yeniden hesaplanır, yazdırılan teklifte de görünür.</p>

<h3>Üretim çıktıları</h3>

<ul>
  <li><strong>Kesim listesi (CSV)</strong> — grup adlarıyla, modül numaralı.</li>
  <li><strong>Donanım metrajı (CSV)</strong> — levha olmayan her kalem: menteşe, ray, mekanizma, fren, kulp, aksesuar; adı, miktarı, birimi. Kesim listesi + donanım metrajı = tam alışveriş listesi.</li>
  <li><strong>Delik tablosu (CSV)</strong> — parça, grup, delik türü, hangi yüz, X, Y, çap, derinlik.</li>
  <li><strong>DXF</strong> — delikler yüzüne göre ayrı katmanlarda; ayrıca her parçayı kendi dosyasında veren parça başına DXF zip'i.</li>
  <li><strong>CNC router NC / G-kodu</strong> — levha başına bir program; önce matkap delikleri, sonra frezeyle büyük delikler, sonra konturlar küçükten büyüğe. Ters çevrilmesi gereken parça kendiliğinden aynalanır. Freze, matkap, ilerleme ve Z sıfırı ayarları atölyenize göre.</li>
  <li><strong>Etiket (50 × 30), modül modül montaj sayfaları ve ölçülü pafta</strong> — atölyede ve montajda elden düşmeyen kâğıtlar.</li>
  <li><strong>Artık levha stoğu</strong> — önceki işten kalan levhalar yerleşime katılır.</li>
  <li><strong>GLB</strong> — 3B modeli dışarı vermek için.</li>
</ul>

<h3>Mutfak planı: duvarı çizin, mutfak kendini dizsin</h3>

<p>Müşterinin evinden aldığınız ölçüyle başlarsınız. Düz, L ya da U plan; duvar ölçülerini yazarsınız, <strong>⚡ Otomatik Yerleştir</strong> buzdolabı, fırın, evye, bulaşık makinesi ve ocağa göre mutfağı dizer. Tezgâh yüksekliği, baza ve ara ölçüler standarttan gelir. Üstten plan, kesit ve ön görünüş hazırdır; A4 müşteri çıktısı alınır ya da PDF'e yazdırılır.</p>

<p>Kolon ve kiriş de plana girer: en, derinlik, sol uzaklık, alt ve üst kot. Dolap kolona değdiğinde gövde kendiliğinden kertilir ve <strong>bu kertik CNC ile DXF çıktısına da gider</strong> — atölyede elle düzeltilecek bir şey kalmaz. Kesilmesini istemediğiniz modülde "kolon kesilmesin" dersiniz.</p>

<h3>Yanınızda ikinci bir usta</h3>

<p>Program gözden kaçanı söyler. "Kapak 2147 × 597 mm: ağır kapak, 5 menteşe ya da 22 mm kapak önerilir" ya da "yan 2132 mm, arkalık 8 mm: yüksek gövdede orta kayıt ekleyin" gibi uyarılar tasarım sırasında çıkar. Sorun ciddiyse CNC adımında <strong>üretim engeli</strong> görünür; siz "gördüm" demeden çıktı alınmaz. Kapakları tek düğmeyle açıp iç düzeni, X-ray ile gövdenin içini görürsünüz. Altta canlı sayaç durur: kaç parça, kaç m² levha, kaç metre bant — her değişiklikte kendini günceller.</p>

<h3>Yardım ve dersler programın içinde</h3>

<p>F1'e bastığınızda ya da ❓ Yardım'a tıkladığınızda konu konu anlatım açılır; <strong>Götür</strong> düğmesi sizi anlatılan ekrana kendisi götürür. Arama kutusuna "kolon", "kapak", "CNC" yazarsınız. Buna ek olarak ürün sayfasında <strong>19 kısa ders, toplam 54 dakika</strong> izlenebiliyor: üretim ekranından CNC çıktısına kadar her konu ayrı videoda.</p>

<h3>Görsel sunum</h3>

<p>Müşteriye gösterilecek görseli programın kendisi üretiyor; ikinci bir render programına, dışa aktarmaya gerek yok. Motor <a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a> ve programın içinde çalışıyor: Render düğmesine basarsınız, sahne kendiliğinden hesaplanır, gürültü temizlenir. Stüdyo Render'da hazır stüdyo, ışık, HDRI, açı ve kalite seçenekleri, otomatik gürültü temizleme, oda render'ı, mimari fotoğraftaki gibi dik bakış için shift lens ve güneş ayarı. Tasarım ekranında gerçekçi, karakalem, teknik çizim, tel kafes, X-ray ve kil görünümleri arasında geçiş yapılır; kapaklar açılır, çekmeceler kayar.</p>

<h2>Kimin için?</h2>

<p>Mobilya atölyesi, mutfakçı, CNC kesim yapan imalatçı ve iç mimar için. Özellikle de "müşteriye teklifi aynı gün vermek" ile "atölyeye doğru ölçüyü göndermek" arasında sıkışan herkes için: ikisi de aynı modelden çıkıyor, bu yüzden birbirini tutuyor.</p>

<h2>Denemek ve edinmek</h2>

<p>Program <strong>5 günlük deneme sürümüyle</strong> denenebiliyor. Demoda tasarım, 3B, render, proje kaydı ve GLB açık; üretim çıktıları (CNC, yerleşim, teklif, CSV, DXF, etiket, montaj sayfası) kapalı — yani programı rahatça kurcalar, üretim dosyalarını tam sürümde alırsınız.</p>

<p>Ürün sayfası, sürümler ve satın alma: <a href="${MAGAZA}" target="_blank" rel="noopener"><strong>Dolap Sihirbazı — Best SketchUp Plugins</strong></a>. Diğer araçlar için <a href="${MAGAZA_KOK}" target="_blank" rel="noopener">bestsketchupplugins.com</a> kataloğuna ya da sitedeki <a href="/sketchup-eklentileri-best-sketchup-plugins.html">eklenti kataloğu yazısına</a> bakabilirsiniz.</p>

<p>Kullanmayı öğrenmek için ücretsiz Türkçe ders serisi var: <a href="${LISTE}" target="_blank" rel="noopener">Dolap Sihirbazı oynatma listesi</a> — üretim ekranından CNC çıktısına kadar 15 ders ve yenilik videoları.</p>

<h2>Sık sorulan sorular</h2>

<h3>Dolap Sihirbazı'nı kullanmak için SketchUp gerekiyor mu?</h3>
<p>Hayır. Masaüstü sürüm kendi başına çalışan bir Windows programıdır; başka bir çizim programı kurulu olmasa da çalışır. SketchUp içinde çalışmayı tercih edenler için ayrı bir <a href="/eklenti/wardrobe-studio.html">SketchUp eklentisi</a> sürümü var.</p>

<h3>Kesim planı gerçekten fire düşürüyor mu?</h3>
<p>CNC router yerleşimi testere planına göre ölçülmüş olarak daha az levha kullanıyor: 800 ölçü varyasyonunda 3.787 levha yerine 3.562 levha (%5,9 daha az). Yerleştirici testere planını da aday olarak değerlendirdiği için sonuç ondan kötü çıkmıyor.</p>

<h3>Çıkan dosyaları kendi CNC'mde kullanabilir miyim?</h3>
<p>Evet. DXF, parça başına DXF, delik tablosu, kesim listesi ve ISO G-kodu üretiliyor; freze çapı, matkap takımları, ilerleme, devir, paso ve Z sıfırı atölyenizin makinesine göre ayarlanıp kaydediliyor.</p>

<h3>Mutfak da yapılıyor mu, yoksa yalnız gardırop mu?</h3>
<p>Mutfak yapılıyor: duvar çizilir, mutfak alt / üst / boy modülleri sürüklenip bırakılır; davlumbaz, evye, ankastre fırın ve buzdolabı modülleri, gola profili, iki renkli gövde-kapak, kolon ve kiriş kertmesi programın içinde.</p>

<p>Dolap Sihirbazı hakkında sorunuz varsa <a href="/iletisim/">iletişim sayfasından</a> yazabilirsiniz.</p>
`;

const kelime = GOVDE.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const kayit = {
  legacyId: 90014,
  slug: SLUG,
  legacyUrl: URL_YOL,
  url: URL_YOL,
  title: "Dolap Sihirbazı: Sürükle Bırak, Kesim ve CNC Anında Hazır",
  excerpt:
    "Dolap ve mutfak tasarımından CNC dosyasına tek masaüstü programı. Sürükle-bırak kurulum, fire düşüren plaka yerleşimi, kesim listesi, teklif ve G-kodu.",
  contentHtml: GOVDE.trim(),
  publishedAt: "2026-11-03 10:00:00",
  modifiedAt: "2026-11-03 10:00:00",
  status: "publish",
  featuredImage: {
    legacyUrl: "/media/dolap-sihirbazi/mutfak-render-1280.webp",
    localPath: "/media/dolap-sihirbazi/mutfak-render-1280.webp",
    alt: "Dolap Sihirbazı ile kurulmuş mutfağın program içinde alınmış render görüntüsü",
    width: 1280,
    height: 711,
    mimeType: "image/webp",
  },
  inlineMedia: [],
  embeds: [
    {
      provider: "youtube",
      externalId: "HyXdUio3BSY",
      originalSrc: "https://www.youtube.com/watch?v=HyXdUio3BSY",
      title: "SÜRÜKLE BIRAK Hemen CNC'ye gönder — Dolap Sihirbazı",
    },
    {
      provider: "youtube",
      externalId: "9Mjf89HfMWQ",
      originalSrc: "https://youtu.be/9Mjf89HfMWQ",
      title: "Kesim Listesi ve Plaka Yerleşimi Modelden Hazır Çıkar — Ders 14",
    },
  ],
  seo: {
    title: "Dolap Sihirbazı: Dolap ve Mutfak Tasarım Programı",
    description:
      "Sürükle bırak ile dolap ve mutfak kurun; kesim listesi, fire düşüren plaka yerleşimi, delik tablosu, DXF, G-kodu ve teklif aynı modelden çıksın.",
    focusKeyword: "dolap tasarım programı",
    canonicalUrl: `https://www.ufuksen.com${URL_YOL}`,
    ogImage: "/media/dolap-sihirbazi/mutfak-render-1280.webp",
    noindex: false,
  },
  readingMinutes: Math.max(1, Math.round(kelime / 200)),
  migrationChecksum: crypto.createHash("sha256").update(GOVDE.trim(), "utf8").digest("hex"),
  author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
  categories: [
    { legacyId: 1169, name: "3D Programlar", slug: "3d-programlar" },
    { legacyId: 1172, name: "Sketchup", slug: "sketchup" },
  ],
  tags: [],
};

fs.writeFileSync(
  path.join(KOK, "src", "content", "posts", `${SLUG}.json`),
  JSON.stringify(kayit, null, 2) + "\n",
  "utf8",
);

const say = (d) => (GOVDE.match(d) ?? []).length;
console.log(`yazı          : ${URL_YOL}`);
console.log(`kelime        : ${kelime} | okuma: ${kayit.readingMinutes} dk`);
console.log(`H2 / H3       : ${say(/<h2/g)} / ${say(/<h3/g)}`);
console.log(`video         : ${say(/<iframe/g)} | görsel: ${say(/<img /g)}`);
console.log(`mağaza bağ.   : ${say(/bestsketchupplugins\.com/g)}`);
console.log(`iç bağlantı   : ${say(/href="\//g)}`);
console.log(`başlık / açık.: ${kayit.seo.title.length} / ${kayit.seo.description.length} krk`);
