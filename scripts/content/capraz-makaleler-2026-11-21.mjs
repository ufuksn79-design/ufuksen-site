/**
 * Çapraz makale planı (21 Kasım 2026) — ufuksen.com'a düşen 3 yazı.
 *
 * Plan: C:\Users\ufuks\Documents\claudes\capraz-makale-plani-2026-11-21.md
 *   4. Mutfak Çizim Programı                                   -> /mutfak-cizim-programi.html
 *   5. Mobilya Çizim Programı                                  -> /mobilya-cizim-programi.html
 *   6. Dolap Çizim Programında Delikleri Kesimden Önce Görmek  -> /dolap-cizim-programinda-delikleri-kesimden-once-gormek.html
 *
 * DÜZELTME — plandaki bir bilgi yanlış: deneme sürümü **5 gün**, 15 değil.
 * 21 Kasım 2026'da dolapsihirbazi.com/demo/ sayfasından okundu:
 * "5 gün boyunca kendi projenizde deneyin. Tasarım, 3B, render, proje kaydı
 * ve GLB açık". Yazılarda 5 gün yazıyor; diğer sitelere de bildirildi.
 *
 * Kullanılan doğrulanmış ürün bilgileri: 245 hazır modül, 386 kapak modeli,
 * kesim listesi (kenar bandı + damar yönü), plaka yerleşimi, delik tablosu,
 * DXF / parça başına DXF, NC (G-kodu), etiket, montaj sayfası, teklif, render.
 *
 * YAZILMAYAN: fiyat, uydurma rakam, uydurma müşteri yorumu.
 *
 * Görseller: kendi YouTube videolarımızın kapakları, yerelde WebP'ye
 * çevrildi (public/media/dolap-sihirbazi/kapak/<id>.webp, hepsi < 200 KB).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const SITE = "https://www.ufuksen.com";
const DS = "https://dolapsihirbazi.com/";
const TARIH = "2026-11-21";

/* ---------------------------------------------------------------- */
/* Yardımcılar                                                       */
/* ---------------------------------------------------------------- */

const video = (id, baslik, altyazi) => `
<figure class="yazi-video">
  <iframe src="https://www.youtube-nocookie.com/embed/${id}" title="${baslik}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  <figcaption>${altyazi}</figcaption>
</figure>`;

const gorsel = (id, alt, altyazi) => `
<figure>
  <img src="/media/dolap-sihirbazi/kapak/${id}.webp" alt="${alt}" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption>${altyazi}</figcaption>
</figure>`;

/** VideoObject — süre ve izlenme uydurulmaz, yalnız elimizdeki alanlar. */
const videoSema = (v, yaziUrl) => ({
  "@type": "VideoObject",
  name: v.baslik,
  description: v.aciklama,
  thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/maxresdefault.jpg`,
  uploadDate: v.tarih,
  contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
  embedUrl: `https://www.youtube-nocookie.com/embed/${v.id}`,
  publisher: { "@type": "Person", name: "Ufuk Şen" },
  mainEntityOfPage: yaziUrl,
});

/* ---------------------------------------------------------------- */
/* Yazılar                                                           */
/* ---------------------------------------------------------------- */

const YAZILAR = [
  /* ============================= 4 ============================== */
  {
    slug: "mutfak-cizim-programi",
    legacyId: 90050,
    saat: "09:00:00",
    title: "Mutfak Çizim Programı: Duvardan Üretime Tek Akış",
    seoTitle: "Mutfak Çizim Programı: Duvardan Üretime Tek Akış",
    seoDesc:
      "Mutfak çizim programı nasıl seçilir? Duvar ölçüsü, kolon ve kiriş, plan ve görünüşler; SketchUp ile çizmekle hazır mutfak programı arasındaki fark.",
    keyword: "mutfak çizim programı",
    excerpt:
      "Duvar ölçüsünden üretim dosyasına: mutfak çiziminde hangi adım nerede tıkanır, SketchUp ile hazır program arasındaki fark nedir, program seçerken neye bakılır?",
    videolar: [
      { id: "O5aHif_8cjo", baslik: "Mutfak Duvarını Saniyeler İçinde Çiz", aciklama: "Mutfak planında duvarın ölçüyle kurulması.", tarih: "2026-11-01" },
      { id: "ljXD9klDDGY", baslik: "Mutfak Planı: Duvarı Çiz, Favorilerden Sürükle Bırak", aciklama: "Duvar çizildikten sonra modüllerin plana dizilmesi.", tarih: "2026-11-01" },
      { id: "k2f6FZZqZkM", baslik: "Mutfak Programı — Kiriş varsa davlumbaz bacası ne olur?", aciklama: "Kirişli mutfakta davlumbaz bacasının çözümü.", tarih: "2026-11-01" },
    ],
    sss: [
      ["Mutfak çizimi için hangi program gerekiyor?", "İki yol var: SketchUp gibi genel bir 3B programıyla her şeyi elle çizmek ya da mutfağa özel bir program kullanmak. Genel programda esneklik sonsuzdur ama kesim listesini ve delikleri siz üretirsiniz; mutfak programında modüller hazır gelir ve üretim dosyaları çizimden otomatik çıkar."],
      ["Mutfak çizim programı SketchUp bilmeyi gerektirir mi?", "Hayır. Dolap Sihirbazı kendi başına çalışan bir Windows masaüstü programıdır; bilgisayarınızda başka bir çizim programı kurulu olmasa da çalışır."],
      ["Duvar düz değilse, kolon veya kiriş varsa ne oluyor?", "Kolon ve kiriş plana ölçüsüyle girilir. Kiriş sarktığında dolaplar kendiliğinden uyar: ince kirişte gövde kertiklenir ve kirişin üstüne biner, kalın kirişte üst dolap kısalır, yer kalmazsa program o dolabı kurmaz ve bunu söyler."],
      ["Çizimden sonra üretim dosyası ayrıca hazırlanıyor mu?", "Hayır, aynı projeden çıkıyor: kesim listesi (kenar bandı ve damar yönü sütunlarıyla), plaka yerleşimi, delik tablosu, DXF, NC programı, etiket, montaj sayfası ve teklif."],
      ["Müşteriye gösterilecek görsel için ayrı render programı gerekir mi?", "Gerekmiyor. Render programın içinde; üstelik üstten plan, kesit ve ön görünüş hazır geliyor, A4 müşteri çıktısı alınabiliyor."],
      ["Denemek için ne yapmalıyım?", "Ücretsiz demo 5 gün çalışıyor: tasarım, 3B, render ve proje kaydı açık, üretim çıktıları tam sürümde."],
    ],
    govde: `
<p>Bir mutfağın hikâyesi çizimle başlamaz; ölçüyle başlar. Müşterinin evinden üç duvar ölçüsü, bir kolon ve tavandaki bir kirişle çıkarsınız. <strong>Mutfak çizim programı</strong> dediğimiz şeyin işi tam burada başlıyor: o ölçüleri, atölyenin kesebileceği bir işe çevirmek.</p>

<p>Bu yazıda mutfağın çizim aşamasını adım adım anlatıyorum: duvarın kurulması, kolon ve kirişin işlenmesi, plan ve görünüşlerin alınması. Sonunda da en çok sorulan şeye geliyorum — SketchUp gibi genel bir programla çizmekle hazır bir mutfak programı kullanmak arasındaki gerçek fark ne?</p>

${video("O5aHif_8cjo", "Mutfak Duvarını Saniyeler İçinde Çiz", "Mutfak planının ilk adımı: duvar, ölçüsüyle kuruluyor.")}

<h2>1. Adım: Duvarı kurmak</h2>

<p>Her şey duvarla başlar. Düz mutfak, L mutfak, U mutfak — üçünde de ilk iş duvar uzunluklarını girmek. "Duvar 1: 3000 mm, Duvar 2: 4200 mm" yazarsınız ve plan kurulur; isterseniz duvarı 3B'de serbest de çizersiniz.</p>

<p>Burada acemi gözünü en çok yanıltan şey şu: duvar yalnız bir çizgi değildir. Duvarın üstüne gelecek dolabın derinliği, süpürgelik payı, köşede iki tezgâhın nasıl buluşacağı — hepsi o ilk ölçüye bağlıdır. Ölçüyü yaklaşık alırsanız hata çizimde değil, montajda ortaya çıkar.</p>

<h3>Ölçü alırken sık yapılan üç hata</h3>

<ul>
  <li><strong>Tek noktadan ölçmek.</strong> Duvarlar nadiren diktir. Alt, orta ve üst hizadan ölçün; en dar ölçüyü esas alın.</li>
  <li><strong>Süpürgeliği unutmak.</strong> Mevcut süpürgelik sökülmeyecekse dolap duvara tam dayanmaz.</li>
  <li><strong>Pencere ve priz yerini not etmemek.</strong> Tezgâh üstü priz ve pencere denizliği, üst dolabın yerini doğrudan belirler.</li>
</ul>

<h2>2. Adım: Kolon, kiriş ve girinti</h2>

<p>Gerçek mutfakların çoğu kutu değildir: bir köşede kolon, tavanda kiriş, bir duvarda girinti vardır. Çizim programının kalitesi tam burada belli olur.</p>

<p>Doğru davranış şu: kolon ve kiriş plana <em>ölçüsüyle</em> girer (en, derinlik, sol uzaklık, alt ve üst kot), sonra dolaplar bunlara göre kendini ayarlar. Kirişte üç ayrı sonuç olabilir — ince kirişte gövde kertiklenip kirişin üstüne biner, kalın kirişte üst dolap kısalır, yer kalmıyorsa o dolap hiç kurulmaz ve program sizi uyarır.</p>

<p>Kolonda ise kural daha net: dolap kolona değdiği yerden kertilir ve <strong>bu kertik CNC ile DXF çıktısına da gider.</strong> Yani panel atölyede kertiğiyle birlikte kesilir; montajda elde testereyle uğraşmak, kenar bandını bozmak diye bir aşama kalmaz.</p>

${video("k2f6FZZqZkM", "Kiriş varsa davlumbaz bacası ne olur?", "Kirişli mutfakta davlumbaz bacası: baca kirişi kesmez, kenarından S yapar.")}

<p>Davlumbaz bacası da bu sınıfa girer. Baca kirişe denk geldiğinde kirişi oymak yerine kenarından S yapması gerekir — gerçekte ustanın yaptığı da budur.</p>

<h2>3. Adım: Modülleri dizmek</h2>

<p>Duvar hazırsa mutfağı dizmek dakikalar sürer. İki yol var:</p>

<ol>
  <li><strong>Otomatik yerleştirme.</strong> Buzdolabı, fırın, evye, bulaşık makinesi ve ocağa göre program mutfağı kendisi dizer; tezgâh yüksekliği (870 mm), üst dolabın yerden yüksekliği (1490 mm) ve tezgâh arası (580 mm) atölyenin bildiği standartlardan gelir.</li>
  <li><strong>Sürükle bırak.</strong> 245 hazır modülden birini tutup duvara bırakırsınız; en ve sol uzaklığı milimetreyle yazarsınız.</li>
</ol>

${video("ljXD9klDDGY", "Mutfak Planı: Duvarı Çiz, Favorilerden Sürükle Bırak", "Duvar kurulduktan sonra modüllerin plana dizilmesi.")}

${gorsel("O5aHif_8cjo", "Mutfak çizim programında duvar ölçüsünün girilmesi", "Mutfak çizim programında ilk ekran: duvar uzunlukları ve kiriş değerleri.")}

<p>Bıraktığınız modülün bir resim olmaması önemli: yan paneli, tablası, rafı, kapağı ayrı ayrı gerçek parçalardır. Yani mutfak dizildiği anda kesilebilir hâle gelir. Kapak tarafında 386 kapak modeli var; model değiştirmek ölçüyü bozmaz, tasarım her kapağın kendi ölçüsüne oturur.</p>

<h2>4. Adım: Plan, kesit ve görünüşler</h2>

<p>Mutfak çiziminin en çok atlanan kısmı budur. 3B görüntü müşteriyi ikna eder ama atölyeye ve tesisatçıya giden şey ölçülü çizimdir:</p>

<ul>
  <li><strong>Üstten plan</strong> — modül sırası, ölçüler, cihaz yerleri.</li>
  <li><strong>Ön görünüş</strong> — kapak bölümleri, tezgâh ve üst dolap hizaları.</li>
  <li><strong>Kesit</strong> — derinlikler, kiriş ve kolon ilişkisi.</li>
  <li><strong>A4 müşteri çıktısı</strong> — yazdırılır ya da PDF olarak gider.</li>
</ul>

<p>Elektrikçiye ve su tesisatçısına ölçülü bir sayfa verebilmek, montaj gününde yaşanan tartışmaların yarısını baştan bitirir.</p>

<h2>Ölçü standartları: neden bu sayılar?</h2>

<p>Mutfakta kullanılan ölçüler keyfî değil; yıllar içinde insanın boyuna, cihaz ölçülerine ve montaj kolaylığına göre oturmuş değerler:</p>

<ul>
  <li><strong>Tezgâh üstü 870 mm</strong> — gövde 770 + ayak 100. Ayağı kısaltıp tezgâhı alçaltmak, bulaşık makinesinin nişe girmesini engeller.</li>
  <li><strong>Tezgâh ile üst dolap arası 580 mm</strong> — altındaki küçük ev aletleri sığsın, üst dolap da uzanılabilir kalsın diye.</li>
  <li><strong>Üst dolap alt kotu 1490 mm</strong> — yukarıdaki iki ölçünün doğal sonucu.</li>
  <li><strong>Alt dolap derinliği 560–580 mm</strong> — tezgâhın 600 mm'lik standardıyla birlikte öne 20–40 mm taşma bırakır.</li>
</ul>

<p>Bu sayıları bilen bir program, siz yazmadan doğru mutfağı kurar; bilmeyen bir programda her projede aynı ayarları elle girersiniz.</p>

<h2>Cihazlar ve tesisat</h2>

<p>Mutfak çiziminde en çok geri dönen iş, cihaz nişlerinin yanlış ölçülmesidir. Ankastre fırın, bulaşık makinesi ve buzdolabı için üreticinin kendi ölçü föyü esastır; "standart 60" varsayımı markadan markaya değişir.</p>

<p>Tesisat tarafı da aynı şekilde çizimin parçasıdır: evyenin altındaki sifon, ocak altındaki gaz hattı, tezgâh üstü prizler ve LED kanalı. Bunların ölçülü bir sayfada tesisatçıya verilmesi, montaj gününde delinmiş yanlış bir panelden çok daha ucuzdur.</p>

${gorsel("gz4iroX1aFY", "Mutfak çizim programında L mutfak, kolon ve pencere çözümü", "L mutfakta kolon ve pencere: ölçü girilince plan kendini kuruyor.")}

<h2>Müşteriyle birlikte değiştirmek</h2>

<p>Mutfak çizimini kıymetli yapan şey, müşterinin karşısında değiştirilebilmesidir. "Buradaki dolabı çekmeceli yapalım", "fırını şu tarafa alalım", "kapak rengini koyu görelim" cümleleri toplantının normal parçasıdır.</p>

<p>Bu cümlelerin her biri elle çizimde yarım saatlik iş, parametrik bir programda birkaç saniyedir. Daha önemlisi: değişiklik yalnız görüntüyü değil, kesim listesini ve teklifi de birlikte günceller. Müşteri masadan kalkarken hem görseli hem rakamı görmüş olur.</p>

<h2>Teklif: çizimin para karşılığı</h2>

<p>Mutfak çiziminin son adımı teklif. Burada kritik olan, teklifin tahminle değil <em>kurulan modelden</em> hesaplanmasıdır: levha, kenar bandı, kapak, menteşe, ray, tezgâh, evye, LED, işçilik ve kâr kalem kalem çıkar. Birim fiyatları atölye kendi girer; hesaplanan tutarın altına kendi rakamınızı yazdığınızda fark indirim satırı olur ve KDV yeniden hesaplanır.</p>

<p>Müşteri karşısında "bir hesaplayıp döneyim" demek zorunda kalmamak, bu işin en somut kazancı.</p>

<h2>SketchUp ile çizmek mi, hazır mutfak programı mı?</h2>

<p>Yıllardır SketchUp eğitimi veriyorum, dolayısıyla bu soruya taraf tutmadan cevap verebilirim: ikisi farklı işler.</p>

<p><strong>SketchUp</strong> genel bir modelleme programıdır. İstediğiniz formu çizersiniz; özel bir mobilya, alışılmadık bir detay, mimari bir sunum — sınır yoktur. Bedeli şudur: kesim listesini, delikleri ve plaka yerleşimini siz üretirsiniz. Bunu eklentilerle kısaltmak mümkün, ama akış hâlâ sizin elinizde. SketchUp tarafında ilerlemek isterseniz <a href="/sketchup-ozel-ders">SketchUp özel ders</a> sayfasına bakabilirsiniz.</p>

<p><strong>Mutfağa özel bir program</strong> ise dar ama derin çalışır: modüller hazır, ustanın kuralları içeride, üretim dosyaları çizimin yan ürünü. Dolap Sihirbazı bu ikinci grupta; üstelik artık bir SketchUp eklentisi değil, kendi başına çalışan bir masaüstü programı. Aynı mantığın dolap tarafındaki anlatımı için <a href="https://dolapsihirbazi.com/blog/mutfak-programi/" target="_blank">mutfak programı</a> yazısına, kabin üretimine odaklı anlatım için <a href="https://sketchupturkiye.com/kabin-uretim-programi/" target="_blank">kabin üretim programı</a> yazısına bakın.</p>

<h3>Program seçerken neye bakmalı?</h3>

<ol>
  <li><strong>Çizim ile üretim aynı dosyadan mı çıkıyor?</strong> Kesim listesini elle yazıyorsanız program yarım demektir.</li>
  <li><strong>Kolon, kiriş ve girinti gerçekten çözülüyor mu?</strong> Katalog görselleri hep düz duvar gösterir; siz eğri duvarla çalışırsınız.</li>
  <li><strong>Kesim listesinde kenar bandı ve damar yönü var mı?</strong> İkisi de yoksa atölyede hata kaçınılmaz.</li>
  <li><strong>Delikler çıktıya giriyor mu?</strong> Menteşe, raf pimi, minifiks ve kavela delikleri delik tablosunda ve CNC programında olmalı.</li>
  <li><strong>CNC dosyası makinenize göre ayarlanabiliyor mu?</strong> Freze çapı, matkap takımları, ilerleme ve Z sıfırı sizin makinenizin değerleri olmalı.</li>
  <li><strong>Teklif aynı modelden mi hesaplanıyor?</strong> Tahminle verilen fiyat, kârı yiyen ilk şeydir.</li>
  <li><strong>Program başka bir yazılıma bağımlı mı?</strong> Bağımlıysa, o yazılımın lisansı ve sürüm uyumu da sizin sorununuz olur.</li>
</ol>

<h2>Mutfak çiziminde en sık görülen hatalar</h2>

<ul>
  <li><strong>Tezgâh yüksekliğini standart dışı bırakmak.</strong> 870 mm'lik tezgâh altı ve 580 mm'lik tezgâh arası, yıllarca denenmiş ölçülerdir; değiştirmek için gerçek bir sebep olmalı.</li>
  <li><strong>Köşeyi sona bırakmak.</strong> Köşe çözümü (kör köşe, dolgu, köşe tezgâhı) baştan kurulmazsa en sonda iki kapak birbirine çarpar.</li>
  <li><strong>Cihaz ölçülerini üreticiden almamak.</strong> Ankastre fırın ve bulaşık makinesi nişleri, markanın kendi ölçü föyüne göre kurulmalı.</li>
  <li><strong>Pencere denizliğini hesaba katmamak.</strong> Üst dolap penceresiz duvara göre çizilince, montajda kapak açılmaz.</li>
  <li><strong>Revizyonu yeniden çizmek.</strong> Müşteri ölçü değiştirdiğinde tüm projeyi baştan çizmek zorunda kalıyorsanız, sorun sizde değil kullandığınız yöntemdedir.</li>
</ul>

${gorsel("KkEEg0U5-GI", "Mutfak çizim programından çıkan kesim listesi ve CNC dosyaları", "Sürükle bırak biten mutfaktan kesim listesi, CNC çıktısı ve render aynı anda çıkıyor.")}

<h2>Çizimden sonra: atölyeye ne gidiyor?</h2>

<p>Çizim bittiğinde iş bitmez; asıl teslim atölyeye yapılır. Tek projeden şunlar çıkar:</p>

<ul>
  <li><strong>Kesim listesi (CSV)</strong> — modül numaralı, kenar bandı ve damar yönü sütunlarıyla.</li>
  <li><strong>Plaka yerleşimi</strong> — hangi parça hangi levhadan çıkıyor, levhanın ne kadarı kullanılıyor.</li>
  <li><strong>Delik tablosu</strong> — parça, yüz, X, Y, çap, derinlik.</li>
  <li><strong>DXF ve parça başına DXF</strong> — konturu, delikleri ve yuvalarıyla.</li>
  <li><strong>NC programı (G-kodu)</strong> — levha başına bir program, atölyenizin makine ayarlarıyla.</li>
  <li><strong>Etiket ve montaj sayfası</strong> — atölyede ve montajda elden düşmeyen kâğıtlar.</li>
</ul>

<p>Bu listenin tamamının aynı modelden çıkması, mutfak çiziminde aranan asıl özelliktir: çizim ile kesim arasında elle taşınan hiçbir bilgi kalmaz.</p>

<h2>Dolap tarafı ve diğer yazılar</h2>

<p>Mutfak, bu işin yalnız bir kolu. Gardırop, TV ünitesi ve banyo dolabı tarafını <a href="/mobilya-cizim-programi.html">mobilya çizim programı</a> yazısında; deliklerin kesimden önce nasıl kontrol edildiğini <a href="/dolap-cizim-programinda-delikleri-kesimden-once-gormek.html">delikleri kesimden önce görmek</a> yazısında anlattım. Köşe dolapların kendine özgü çözümleri için <a href="https://www.mimari3d.com/kose-dolaplar/" target="_blank">köşe dolap çözümleri</a> yazısına bakabilirsiniz.</p>

<p>Programı kendi mutfağınızda denemek isterseniz <a href="${DS}" target="_blank">Dolap Sihirbazı'nın sitesinden</a> 5 günlük ücretsiz demoyu indirebilirsiniz: tasarım, 3B, render ve proje kaydı açık, üretim çıktıları tam sürümde.</p>
`,
  },

  /* ============================= 5 ============================== */
  {
    slug: "mobilya-cizim-programi",
    legacyId: 90051,
    saat: "12:00:00",
    title: "Mobilya Çizim Programı: Kütüphane mi, Program mı?",
    seoTitle: "Mobilya Çizim Programı: Kütüphane mi, Program mı?",
    seoDesc:
      "Mobilya çizim programı seçerken neye bakmalı? Gardırop, TV ünitesi, banyo ve vestiyer çiziminde hazır kütüphane ile parametrik programın gerçek farkı.",
    keyword: "mobilya çizim programı",
    excerpt:
      "Gardırop, TV ünitesi, banyo dolabı ve vestiyer: mobilyacı ve iç mimar gözüyle çizim. Hazır model kütüphanesi ile üretime bağlı program arasındaki fark.",
    videolar: [
      { id: "8QJwZwDUCog", baslik: "Sürükle, Bırak, Dolabın Hazır", aciklama: "Çizim bilmeden gardırop tasarlamak.", tarih: "2026-11-01" },
      { id: "YbQ_0geRGws", baslik: "Dolabı Tutamaçla Uzatmak", aciklama: "Mobilyanın ölçüsünü tutamaçtan çekerek değiştirmek.", tarih: "2026-11-01" },
      { id: "hCp8l-BfkPc", baslik: "Müşteri Seçsin, Tek Tıkla Değişsin: Kapak Tasarımı", aciklama: "Kapak modelinin bütün mobilyaya tek adımda uygulanması.", tarih: "2026-11-01" },
    ],
    sss: [
      ["Mobilya çizim programı ile genel 3B programı arasındaki fark ne?", "Genel 3B programı şekil çizer; mobilya programı parça üretir. İkincisinde çizdiğiniz her panelin kesim ölçüsü, malzemesi, kenar bandı ve delikleri bellidir, dolayısıyla çizim doğrudan üretime gider."],
      ["Hazır model kütüphanesi yeterli olmaz mı?", "Kütüphane başlangıcı hızlandırır ama ölçü değiştiğinde çoğu hazır model bozulur. Parametrik bir programda ölçüyü değiştirirsiniz, parçalar ve delikler yeniden hesaplanır."],
      ["İç mimarım, üretim yapmıyorum. Bu programa ihtiyacım olur mu?", "Sunum için 3B yeter gibi görünür; ama imalatçıya giden ölçülü çizim ve metraj, projenin uygulanabilirliğini belirler. Teklif ve kesim listesinin aynı modelden çıkması, uygulamacıyla aranızdaki yanlış anlaşılmaları bitirir."],
      ["Gardırop dışında neler çiziliyor?", "Gardırop, TV ünitesi, banyo dolabı, vestiyer, kitaplık, çalışma ve yatak odası modülleri; kütüphanede 245 hazır modül var ve hepsi panellerine açılabiliyor."],
      ["Kapak modelini sonradan değiştirebilir miyim?", "Evet. 386 kapak modeli var ve seçim bütün kapaklara tek adımda uygulanabiliyor; ölçü değişmiyor, tasarım her kapağın kendi ölçüsüne oturuyor."],
      ["Program için SketchUp gerekiyor mu?", "Hayır. Kendi başına çalışan bir Windows masaüstü programı; başka bir çizim yazılımı kurulu olmasa da çalışıyor."],
    ],
    govde: `
<p>Mobilya çizmek, dışarıdan bakınca bir şekil çizme işi gibi görünür. İçinden bakınca öyle değildir: çizdiğiniz her kutunun arkasında bir levha, bir kenar bandı, bir menteşe ve bir delik vardır. İyi bir <strong>mobilya çizim programı</strong> da zaten bu ikisini aynı anda tutabilen programdır — görünen yüzü ve üretilen parçayı.</p>

<p>Bu yazı iki okur için: mobilyacı için ve iç mimar için. İkisinin derdi farklı ama kesiştiği bir nokta var — çizimin üretime dönüşmesi gereken yer.</p>

${video("8QJwZwDUCog", "Sürükle, Bırak, Dolabın Hazır", "Çizim bilmeden gardırop kurmak: modül paletten alınıp yerine bırakılıyor.")}

<h2>Mobilyacı gözüyle: çizim, üretimin ilk adımıdır</h2>

<p>Atölyede çizimin tek bir görevi vardır: kesim listesini doğurmak. Bu yüzden mobilyacı için "güzel çizim" diye bir şey yoktur; doğru çizim vardır.</p>

<p>Pratikte şu dört şey karar verir:</p>

<ol>
  <li><strong>Panel gerçekten panel mi?</strong> Çizimdeki yan panelin kalınlığı, kesim ölçüsü ve malzemesi tanımlı olmalı.</li>
  <li><strong>Kenar bandı düşülüyor mu?</strong> Bant payı hesaba katılmayan panel, kapak takılınca birkaç milim fazla gelir.</li>
  <li><strong>Delikler nerede?</strong> Menteşe yuvası, raf pimi, minifiks ve kavela — hepsinin yeri çizimden çıkmalı.</li>
  <li><strong>Damar yönü yazıyor mu?</strong> Yazmıyorsa, yan yana iki kapakta desen tutmaz.</li>
</ol>

<h2>İç mimar gözüyle: sunum ile uygulama arasındaki köprü</h2>

<p>İç mimarın önceliği farklıdır: müşteriye gösterilecek görsel, malzeme uyumu, mekânın bütünü. Ama proje uygulamaya gittiğinde aynı çizimin ölçülü hâli lazım olur. Burada iki ayrı dosya tutmak (biri sunum, biri imalat) en sık yapılan hatadır — çünkü biri güncellenir, diğeri unutulur.</p>

<p>Tek modelden hem render hem ölçülü pafta çıkabiliyorsa bu sorun kendiliğinden biter. Uygulamacıya giden sayfa ile müşteriye gösterilen görsel aynı dosyadan geldiği sürece ikisi birbirini tutar.</p>

${video("hCp8l-BfkPc", "Müşteri Seçsin, Tek Tıkla Değişsin: Kapak Tasarımı", "Kapak modeli bütün mobilyaya tek adımda uygulanıyor.")}

${gorsel("8QJwZwDUCog", "Mobilya çizim programında sürükle bırak ile kurulan gardırop", "Mobilya çizim programında gardırop, hazır modüllerden kuruluyor.")}

<h2>Gardırop, TV ünitesi, banyo, vestiyer: dördü de ayrı dünya</h2>

<h3>Gardırop</h3>
<p>Gardırobun derdi iç düzendir: askı yüksekliği, raf araları, çekmece bloğu, pantolonluk. Burada en sık yapılan hata, iç düzeni kapak bölümlemesine göre kurmaktır. Doğrusu tersidir — önce iç düzen, sonra kapak.</p>

<h3>TV ünitesi</h3>
<p>Kablo geçişi, priz yeri, ekran yüksekliği ve nişin derinliği. Ekranın oturacağı niş ölçüsü televizyonun inç değeriyle, duvara asılacaksa askı aparatının yeriyle birlikte düşünülür.</p>

<h3>Banyo dolabı</h3>
<p>Lavabo tipi her şeyi belirler: seramik lavaboda üst tabla yerine ön ve arka kuşak, çanak lavaboda tezgâhta batarya ve gider deliği. Sifonun geçtiği üst çekmecede U kesim gerekir; bu, çizimde unutulduğunda atölyede fark edilir.</p>

<h3>Vestiyer ve antre</h3>
<p>Dar alanda ayakkabılık kapasitesi, oturma yüksekliği ve askı derinliği. Antrede 35 cm derinlik çoğu zaman yeterlidir; 60 cm'lik gardırop derinliği koridoru yer.</p>

${video("YbQ_0geRGws", "Dolabı Tutamaçla Uzatmak", "Ölçü tutamaçtan çekilerek değişiyor; parçalar ve delikler yeniden hesaplanıyor.")}

<h2>Malzeme, kaplama ve kenar bandı</h2>

<p>Mobilyanın maliyetini ve görünümünü belirleyen şey formdan çok malzemedir. Çizim programının bu tarafı da taşıması gerekir:</p>

<ul>
  <li><strong>Levha türü</strong> — sunta, MDF, kontrplak, masif, kompakt; gövde ile kapak ayrı seçilebilmeli.</li>
  <li><strong>Kaplama</strong> — melamin, papel, akrilik, laminat, membran, lake, vernik. Membran ve lakede kenar bandı düşer; program bunu kendiliğinden hesaplamalı.</li>
  <li><strong>Kenar bandı</strong> — dört kenar tek tek açılıp kapanabilmeli ve metraj anında güncellenmeli.</li>
  <li><strong>Damar yönü</strong> — kesim listesinde sütun olarak bulunmalı; yoksa yan yana iki kapakta desen tutmaz.</li>
</ul>

<p>Parça parça malzeme vermek, "hepsi beyaz melamin" demekten daha fazla iş gibi görünür; ama teklif ve kesim listesi o ayrıntıdan doğar.</p>

<h2>Donanım: metrajı kim sayıyor?</h2>

<p>Menteşe, ray, kalkar mekanizması, fren, kulp, askı borusu, raf pimi, ayak… Bir gardıropta kalem sayısı kolayca otuzu geçer. Bunları elle saymak hem zaman alır hem de en sık eksik sipariş sebebidir.</p>

<p>Program donanımı çizimden sayıyorsa, kesim listesinin yanında bir de donanım metrajı alırsınız — adı, miktarı ve birimiyle. Kesim listesi artı donanım metrajı, o işin tam alışveriş listesidir.</p>

<h2>Atölye standartları: bir kez girin, hep kullanın</h2>

<p>Her atölyenin kendi alışkanlığı vardır: bant kalınlığı, raf ön geri payı, gövde bağlantısı (minifiks mi kavela mı), menteşe kotları, baza yüksekliği. Bunları her projede yeniden girmek hem zaman kaybı hem hata kaynağıdır.</p>

<p>Doğru olan, atölye standartlarının programda bir kez tanımlanması ve bütün projelerde geçerli olmasıdır. Böylece yeni bir eleman da aynı standartla çalışır; "bizim atölyede şöyle yapılır" bilgisi kişiye bağlı kalmaz.</p>

${gorsel("bJpsRpDgyyY", "Mobilya çizim programında yeni kabin ölçüsünün girilmesi", "Yeni kabin: ölçü, isim ve üst tabla seçimi tek karttan yapılıyor.")}

<h2>Rafların ve çekmecelerin iç düzeni</h2>

<p>Mobilyanın kullanılabilirliğini belirleyen şey dış ölçüsü değil iç düzenidir. Raf araları, çekmece yükseklikleri ve askı kotları birkaç basit kurala oturur:</p>

<ul>
  <li><strong>Raf araları eşit dağılsın.</strong> Elle verilen "göz kararı" raf araları, kapak bölümlemesiyle çakışır.</li>
  <li><strong>Çekmece yükseklikleri işlevine göre.</strong> Çatal-kaşık için sığ, tencere için derin; eşit bölmek her zaman doğru değildir.</li>
  <li><strong>Askı kotu giysiye göre.</strong> Kısa askı 100–110 cm, uzun askı 150–170 cm; ikisini aynı bölmede birleştirmek alanı yer.</li>
  <li><strong>Raf derinliği kapağa göre geri çekilsin.</strong> Kapak konduğunda öne dayanan raf, kapağın kapanmasını engeller.</li>
</ul>

<p>İyi bir program bu kuralları kendiliğinden uygular; siz yalnız istisnayı yazarsınız.</p>

<h2>Kütüphane mi, program mı?</h2>

<p>Bu, mobilya tarafının en eski tartışması. İkisini de kullanmış biri olarak farkı şöyle özetleyebilirim:</p>

<p><strong>Hazır model kütüphanesi</strong> hızlı başlatır. İndirirsiniz, sahneye koyarsınız, sunum ilerler. Sorun ölçü değiştiğinde başlar: çoğu hazır model ölçeklenince bozulur — kalınlıklar da büyür, menteşe yuvası yerinden kayar, kesim listesi anlamsızlaşır.</p>

<p><strong>Parametrik bir program</strong> ise modeli değil kuralı tutar. Ölçüyü yazarsınız, mobilya kendini yeniden kurar: panellerin kesim ölçüsü, raf dağılımı, menteşe adedi, bant metrajı. Dolap Sihirbazı'nın yaptığı da budur; dolap tarafındaki ayrıntılı anlatım için <a href="https://dolapsihirbazi.com/blog/dolap-cizim-programi/" target="_blank">dolap çizim programı</a> yazısına, üretim tarafı için <a href="https://sketchupturkiye.com/dolap-uretim-tasarim-programi/" target="_blank">dolap üretim ve tasarım programı</a> yazısına bakabilirsiniz.</p>

<h3>Program seçerken neye bakmalı?</h3>

<ol>
  <li><strong>Ölçü değişince ne oluyor?</strong> Model bozuluyorsa o kütüphanedir, program değil.</li>
  <li><strong>Kesim listesi çizimden mi çıkıyor, elle mi yazılıyor?</strong></li>
  <li><strong>Kenar bandı ve damar yönü listede var mı?</strong></li>
  <li><strong>Donanımı program sayıyor mu?</strong> Menteşe, ray, kalkar mekanizması, raf pimi — metrajı elle saymak hata üretir.</li>
  <li><strong>Kapak ve kulp değişimi modeli bozuyor mu?</strong></li>
  <li><strong>Render ve ölçülü pafta aynı dosyadan mı çıkıyor?</strong></li>
  <li><strong>Atölye standartlarınızı programa bir kez girebiliyor musunuz?</strong> Bant kalınlığı, raf payı, gövde bağlantısı her atölyede farklıdır.</li>
</ol>

${gorsel("AAvK9wtkt-0", "Mobilya çizim programında rafların eşit aralıkla dağıtılması", "Raflar eşit aralıkla kendiliğinden dağılıyor; usta yalnız istisnayı yazıyor.")}

<h2>Sunum: müşteriyi ikna eden kısım</h2>

<p>Mobilya işinde satış çoğu zaman görselle kapanır. Burada üç şey yeter: doğru ışık, doğru malzeme ve mekânın kendisi. Programın içinde render varsa ikinci bir yazılıma geçmeden, modelin güncel hâliyle görsel alırsınız — yani müşteriye gösterilen görsel her zaman son tasarımdır.</p>

<p>Bunun yanında ölçülü pafta ve montaj sayfası da aynı dosyadan çıkar. Müşteriye 3B, uygulamacıya ölçülü çizim, atölyeye kesim listesi: üçü de aynı modelden.</p>

<h2>Ölçü alırken: mobilyacının üç kuralı</h2>

<ul>
  <li><strong>Üç noktadan ölçün.</strong> Duvarlar dik değildir; en dar ölçüyü esas alın ve farkı dolgu paneliyle kapatın.</li>
  <li><strong>Tavanı unutmayın.</strong> Tavana kadar çıkan dolapta taç ve montaj payı gerekir; 2 cm'lik pay montajı kurtarır.</li>
  <li><strong>Taşıma yolunu ölçün.</strong> Asansöre, merdivene ve kapıya sığmayan bir modül, atölyede ne kadar doğru üretilirse üretilsin eve girmez.</li>
</ul>

<h2>Teklif ve dosya düzeni</h2>

<p>Mobilya işinde teklif, çizimin parasal karşılığıdır. Doğru yöntem, tutarı kurulan modelden hesaplamaktır: levha ve kenar bandı metrajı, donanım kalemleri, kapak alanı, işçilik ve kâr. Birim fiyatları atölye kendi girer; böylece iki farklı atölyede aynı dolap farklı rakam verir ve bu normaldir.</p>

<p>Dosya düzeni de aynı mantığın devamıdır. Tek bir proje dosyası tutun: sunum, ölçülü çizim, kesim listesi ve teklif hep o dosyadan çıksın. Müşteri revizyon istediğinde yalnız o dosyayı güncellersiniz; eski bir PDF'in dolaşımda kalma riski kalmaz.</p>

<p>Bir de sürüm meselesi var: revizyonları tarih ya da sürüm numarasıyla saklamak, "hangi fiyatı vermiştik" tartışmasını bitirir.</p>

<h2>Mobilya çiziminde sık yapılan hatalar</h2>

<ul>
  <li><strong>Grup ile bileşeni karıştırmak.</strong> Aynı parçadan birden fazla varsa bileşen kullanılır; aksi hâlde aynı düzeltmeyi otuz kez yaparsınız.</li>
  <li><strong>Ölçüyü fareyle "yaklaşık" vermek.</strong> Milimetre yazılmayan her çizgi, sonraki adımda bir hata üretir.</li>
  <li><strong>Menteşeyi rafa denk getirmek.</strong> Menteşe plakasının vidası raf pimi deliğine binince panel çöp olur.</li>
  <li><strong>Modeli internetten indirilen ağır mobilyalarla şişirmek.</strong> Dosya kilitlenir, render uzar, hiçbir şey kazanılmaz.</li>
  <li><strong>Sunum ve imalat dosyasını ayırmak.</strong> İkisi ayrıldığı anda biri eskir.</li>
</ul>

<h2>Devamı</h2>

<p>Mutfak tarafındaki akış için <a href="/mutfak-cizim-programi.html">mutfak çizim programı</a> yazısına, delik kontrolü için <a href="/dolap-cizim-programinda-delikleri-kesimden-once-gormek.html">delikleri kesimden önce görmek</a> yazısına göz atın. Tasarımdan üretime giden yolun bütününü <a href="https://www.mimari3d.com/dolabini-tasarla-detaylandir-uretime-hazirla/" target="_blank">dolabını tasarla, detaylandır, üretime hazırla</a> yazısında topladık.</p>

<p>SketchUp ile çalışmayı sürdürenler için not: modelleme tarafını birebir ilerletmek isterseniz <a href="/sketchup-ozel-ders">SketchUp özel ders</a> sayfasına bakabilirsiniz. Programı denemek içinse <a href="${DS}" target="_blank">Dolap Sihirbazı'nın sitesindeki</a> 5 günlük ücretsiz demo yeterli.</p>
`,
  },

  /* ============================= 6 ============================== */
  {
    slug: "dolap-cizim-programinda-delikleri-kesimden-once-gormek",
    legacyId: 90052,
    saat: "15:00:00",
    title: "Delikleri Kesimden Önce Görmek: Dolap Çizim Programı",
    seoTitle: "Delikleri Kesimden Önce Görmek | Dolap Çizim Programı",
    seoDesc:
      "Menteşe, raf pimi ve minifiks delikleri kesimden önce nasıl kontrol edilir? Delik tablosu, çakışan delik uyarısı ve CNC öncesi 3B kontrol adım adım.",
    keyword: "delikleri kesimden önce görmek",
    excerpt:
      "Yanlış delik, panelin tamamını çöpe atar. Menteşe, raf pimi ve minifiks deliklerini CNC'ye göndermeden önce 3B'de ve delik tablosunda kontrol etmenin yolu.",
    videolar: [
      { id: "sb-MzPEZfRc", baslik: "Kesim listesi, donanım metrajı ve delik tablosu tek tıkla", aciklama: "Üretim çıktılarının tek projeden alınması.", tarih: "2026-11-01" },
      { id: "FnSr2DvZs8c", baslik: "Menteşe, ray, kalkar, raf pimi: donanımı program sayar", aciklama: "Donanım metrajının çizimden hesaplanması.", tarih: "2026-11-01" },
      { id: "_t9a0GVLtuQ", baslik: "Gövde Bağlantısı ve Atölye Standartları", aciklama: "Minifiks, kavela ve atölye standartlarının ayarlanması.", tarih: "2026-11-01" },
    ],
    sss: [
      ["Delik tablosu nedir, ne işe yarar?", "Her parçadaki her deliğin listesidir: parça adı, grup, delik türü, hangi yüzde olduğu, X ve Y konumu, çap ve derinlik. CNC operatörü ve el işlemi yapan usta aynı tablodan çalışır."],
      ["Çakışan delikleri program kendisi fark eder mi?", "Menteşe, rafın, ara tablanın ve komşu kapağın plakasının bulunmadığı en yakın boş kota kendiliğinden kayar; böylece menteşe plakası vidası raf pimi deliğine binmez. Gövde yüksekse ya da kapak ağırsa program ayrıca uyarır."],
      ["Deliği kesimden önce nerede görebilirim?", "3B sahnede her delik parçanın yüzünde işaretlidir ve kendi etiketindedir; tek tıkla gizlenip gösterilebilir. Ayrıca X-ray görünümüyle gövdenin içine bakılabilir."],
      ["Hangi delikler CNC programına giriyor?", "Menteşe yuvası ve plaka vidası, raf pimi, minifiks ve kavela, kulp vidası; lavabo, batarya, gider ve kablo delikleri de dahil. Takımı olmayan ya da kenar deliği olan işlemler çıktıda 'el işlemi' olarak ayrılır."],
      ["Minifiks mi kavela mı kullanacağımı sonradan değiştirebilir miyim?", "Evet, gövde bağlantısı atölye standardı olarak seçiliyor; seçim değişince delik tablosu, DXF ve CNC programı birlikte güncelleniyor."],
      ["Delik hatası en çok nereden çıkıyor?", "Elle yazılan listelerden ve sonradan yapılan ölçü değişikliklerinden. Ölçü değiştiğinde delikler yeniden hesaplanmıyorsa, doğru panelin üstünde yanlış delik açılır."],
    ],
    govde: `
<p>Atölyede en pahalı hata yanlış kesilen panel değildir — yanlış delinen paneldir. Kesimde birkaç milim şaşan parçayı bazen kurtarırsınız; yanlış yerden delinmiş bir yan panel doğrudan çöptür. Bu yüzden <strong>delikleri kesimden önce görmek</strong>, dolap çizim programından beklenecek en somut faydalardan biri.</p>

<p>Bu yazıda deliklerin nereden çıktığını, hangi hataların nerede doğduğunu ve CNC'ye göndermeden önce neyin kontrol edilmesi gerektiğini anlatıyorum.</p>

${video("sb-MzPEZfRc", "Kesim listesi, donanım metrajı ve delik tablosu tek tıkla", "Delik tablosu, kesim listesi ve donanım metrajı aynı projeden çıkıyor.")}

<h2>Bir dolapta kaç çeşit delik var?</h2>

<p>Sıradan bir gardırop bile birden çok delik ailesi taşır ve her biri farklı bir kurala tabidir:</p>

<ul>
  <li><strong>Menteşe yuvası</strong> — kapağın arkasında, genelde Ø35 mm, kör delik.</li>
  <li><strong>Menteşe plakası vidası</strong> — yan panelde, kapak kenarından belirli bir kotta.</li>
  <li><strong>Raf pimi</strong> — yan panelde dizi hâlinde, Ø5 mm.</li>
  <li><strong>Minifiks / kavela</strong> — gövde bağlantısı; biri eksantrik, diğeri dübel mantığıyla çalışır.</li>
  <li><strong>Kulp vidası</strong> — kapak ve çekmece önünde, kapak detayına hizalı.</li>
  <li><strong>Tesisat delikleri</strong> — kablo (Ø60), batarya, gider; tezgâh ve arkalıkta.</li>
</ul>

<p>Bunların her biri ayrı yüzde, ayrı derinlikte ve ayrı takımla işlenir. Bir tanesinin yüzü yanlış yazılırsa panel ters delinir.</p>

<h2>Hatalar nereden doğuyor?</h2>

<h3>1. Elle yazılan liste</h3>
<p>Delikleri kâğıda ya da tabloya elle yazmak, kaçınılmaz olarak bir gün bir rakamı kaydırır. Üstelik bu hata çizimde görünmez; tezgâhta görünür.</p>

<h3>2. Sonradan yapılan ölçü değişikliği</h3>
<p>Dolap 10 cm kısalır ama delik listesi eski hâliyle kalır. En sinsi hata budur: parça ölçüsü doğrudur, delikler yanlıştır.</p>

<h3>3. Çakışan delikler</h3>
<p>Menteşe plakasının vidası, raf pimi deliğine ya da ara tablanın plakasına denk gelir. İki delik birbirine girer, vida tutmaz.</p>

<h3>4. Yüz karışıklığı</h3>
<p>Aynı ölçüdeki iki yan panelden biri sol, diğeri sağdır. Ayna alınmadan işlenen panel, delikleri ters yüzde taşır.</p>

${video("_t9a0GVLtuQ", "Gövde Bağlantısı ve Atölye Standartları", "Minifiks mi kavela mı: gövde bağlantısı atölye standardı olarak bir kez seçiliyor.")}

<h2>Programın bu hataları kesmesi için ne yapması gerekir?</h2>

<p>Dört şey:</p>

<ol>
  <li><strong>Delikleri kendisi yerleştirmeli.</strong> Panel bırakıldığı anda komşularına göre delikler açılmalı; usta elle kot hesaplamamalı.</li>
  <li><strong>Çakışmayı kendisi çözmeli.</strong> Menteşe, rafın ve komşu kapağın plakasının olmadığı en yakın boş kota kaymalı.</li>
  <li><strong>Ölçü değişince delikleri yeniden hesaplamalı.</strong> Panel yeni ölçüsüyle kuruluyorsa delikler de yeni kotuna gitmeli.</li>
  <li><strong>Göstermeli.</strong> En önemlisi bu: delik, kesimden önce ekranda görülebilmeli.</li>
</ol>

<h2>Kesimden önce üç kontrol</h2>

<h3>Kontrol 1 — 3B'de deliklere bakın</h3>
<p>Her delik parçanın yüzünde işaretli ve kendi etiketinde duruyorsa, tek tıkla gösterip gizleyebilirsiniz. X-ray görünümüyle gövdenin içine bakmak, özellikle kolon kertiği olan dolaplarda hata yakalatır.</p>

<h3>Kontrol 2 — Delik tablosunu okuyun</h3>
<p>Tabloda parça adı, grup, delik türü, <strong>yüz</strong>, X, Y, çap ve derinlik bulunur. Burada bakacağınız şey rakamların doğruluğundan çok tutarlılıktır: aynı tip parçada aynı kotlar tekrarlanıyor mu, sol ve sağ paneller birbirinin aynası mı?</p>

${video("FnSr2DvZs8c", "Menteşe, ray, kalkar, raf pimi: donanımı program sayar", "Donanım metrajı çizimden hesaplanıyor.")}

${gorsel("sb-MzPEZfRc", "Dolap çizim programında delik tablosu ve kesim listesi çıktısı", "Delik tablosu, kesim listesi ve donanım metrajı tek projeden alınıyor.")}

${gorsel("_t9a0GVLtuQ", "Gövde bağlantısı ve atölye standartlarının ayarlandığı ekran", "Gövde bağlantısı ve atölye standartları bir kez tanımlanıyor.")}

<h3>Kontrol 3 — Uyarıları okuyun, geçiştirmeyin</h3>
<p>İyi bir program üretime gitmeden önce konuşur: "ağır kapak, 5 menteşe önerilir", "yüksek gövdede orta kayıt ekleyin ya da arkalığı kalınlaştırın" gibi. Sorun ciddiyse CNC adımında üretim engeli çıkar ve siz görmeden çıktı alınmaz.</p>

${gorsel("mvDG6SuadhE", "Kesim listesi, plaka yerleşimi ve CNC çıktılarının alınması", "Delikler doğrulandıktan sonra kesim listesi, plaka yerleşimi ve CNC çıktıları alınıyor.")}

<h2>Delik derinliği ve takım seçimi</h2>

<p>Deliğin yeri kadar derinliği de önemlidir. Menteşe yuvası tipik olarak 13 mm derinliğinde kör bir cep olarak işlenir; raf pimi Ø5, gövde bağlantısı Ø8 civarındadır. Boydan boya geçmesi gereken delikler (batarya, gider, kablo) ise sarmal frezeyle, tablaya 0,3 mm pay bırakılarak kesilir.</p>

<p>Bu ayarların programda atölyenize göre tanımlanabilmesi gerekir: freze çapı, matkap takımları, ilerleme, devir, paso ve Z sıfırı. Hazır gelen varsayılan değerlerle çalışmak, ilk işte deneme parçası kesmeyi zorunlu kılar.</p>

<h2>Etiket ve montaj: deliğin görünür hâli</h2>

<p>Delik tablosu CNC operatörü içindir; montajcı içinse etiket ve montaj sayfası vardır. Parça etiketinde parçanın adı, ölçüsü ve bant şeması bulunur; montaj sayfasında modül modül kurulum sırası.</p>

<p>Atölyede en çok vakit kaybettiren şey, benzer ölçüdeki iki panelin karıştırılmasıdır. Etiketli parça bu sorunu doğrudan bitirir: panel elinize geldiğinde hangi dolabın neresine gittiğini okursunuz.</p>

<h2>Delik tablosunu kim okuyor?</h2>

<p>Delik tablosu üç ayrı kişiye aynı anda konuşur ve her biri farklı bir sütuna bakar:</p>

<ul>
  <li><strong>CNC operatörü</strong> — yüz, X, Y, çap ve derinlik sütunlarına. Onun için en kritik bilgi deliğin hangi yüzde olduğudur.</li>
  <li><strong>El işlemi yapan usta</strong> — takımı olmayan ya da kenar deliği olarak ayrılmış satırlara.</li>
  <li><strong>Montajcı</strong> — hangi deliğin hangi donanıma ait olduğuna; menteşe plakası mı, raf pimi mi, minifiks mi.</li>
</ul>

<p>Bu yüzden tablonun okunabilir olması, içinde doğru rakam bulunması kadar önemlidir. Parça adının modül numarasıyla birlikte yazılması, karışıklığı en baştan keser.</p>

<h2>Delik hatasının gerçek maliyeti</h2>

<p>Yanlış delik yalnız bir panelin maliyeti değildir. Hesaba katılması gerekenler şunlar: levha, kenar bandı, işçilik, makine zamanı, montajın ertelenmesi ve çoğu zaman müşteriye verilen tarihin kayması. Küçük bir atölyede tek bir yanlış yan panel, o işin kârının görünür bir kısmını götürür.</p>

<p>Bu yüzden kontrol adımı "zaman kaybı" değil, en ucuz sigortadır: üç dakikalık bir ekran kontrolü, yarım günlük bir yeniden üretimi önler.</p>

<h2>Kapak arkası, çekmece ve özel durumlar</h2>

<p>Birkaç durum vardır ki delik düzenini doğrudan etkiler ve çizimde gözden kaçar:</p>

<ul>
  <li><strong>Kapak arkasına gelen çekmece.</strong> Menteşe tarafına dolgu çıtası gerekir; yoksa çekmece açılırken menteşeye çarpar.</li>
  <li><strong>Gömme kapak.</strong> Kapak gövdeyle aynı hizada olduğunda raflar kapağın arkasına çekilir, menteşe kotları değişir.</li>
  <li><strong>Ağır kapak.</strong> Yüksek ve geniş kapaklarda menteşe adedi artırılır; aksi hâlde kapak zamanla sarkar.</li>
  <li><strong>Camlı kapak.</strong> Çıta genişliği ve menteşe tipi farklıdır; delik kotları buna göre kayar.</li>
  <li><strong>Kolon kertiği olan panel.</strong> Kertik, delik dizisiyle çakışabilir; 3B'de X-ray ile bakmak en hızlı kontroldür.</li>
</ul>

<h2>Revizyon: ölçü değişince delikler ne olacak?</h2>

<p>Müşteri ölçü değiştirdiğinde iki kötü seçenek vardır: ya bütün işi yeniden kesersiniz ya da eski listeyle devam edip hata yaparsınız. Doğru olan üçüncü yol: yalnız değişen parçaları yeniden kesmek.</p>

<p>Bunun şartı, programın ölçü değişince parçaları ve delikleri yeniden hesaplaması ve eski hâliyle farkı gösterebilmesidir. Böylece atölye hem levha hem zaman kazanır; yeniden kesilen parça sayısı ikiyi üçü geçmez.</p>

<h2>Kısa kontrol listesi</h2>

<ol>
  <li>3B'de delikleri aç, X-ray ile gövdenin içine bak.</li>
  <li>Delik tablosunda sol ve sağ panellerin aynası doğru mu, kontrol et.</li>
  <li>Program uyarılarını oku; üretim engeli varsa sebebini çöz, geçiştirme.</li>
  <li>El işlemi olarak ayrılan delikleri montajcıya ayrıca bildir.</li>
  <li>Yeni makinede ilk NC programını deneme parçasıyla doğrula.</li>
</ol>

<h2>CNC'ye giderken ne çıkıyor?</h2>

<p>Delik kontrolü bittiğinde aynı projeden üretim dosyalarının tamamı çıkar: kesim listesi (kenar bandı ve damar yönü sütunlarıyla), plaka yerleşimi ve kullanım yüzdesi, delik tablosu, DXF ve parça başına DXF, NC programı (G-kodu), 50 × 30 mm etiketler, donanım metrajı ve montaj sayfaları.</p>

<p>Bu akışın CNC tarafındaki ayrıntısı için <a href="https://dolapsihirbazi.com/blog/cnc-dolap-imalat-programi/" target="_blank">CNC dolap imalat programı</a> yazısına, kabin üretiminin tamamı için <a href="https://sketchupturkiye.com/kabin-uretim-programi/" target="_blank">kabin üretimi</a> yazısına bakabilirsiniz. Tasarımdan üretime giden yolun bütününü <a href="https://www.mimari3d.com/dolabini-tasarla-detaylandir-uretime-hazirla/" target="_blank">tasarla, detaylandır, üretime hazırla</a> yazısında topladık.</p>

<h2>Delik hatasını önlemenin atölye tarafındaki karşılığı</h2>

<ul>
  <li><strong>Atölye standardınızı bir kez girin.</strong> Bant kalınlığı, raf payı, gövde bağlantısı ve delik kotları her atölyede farklıdır; bir kez girilen değer bütün projelerde geçerli olur.</li>
  <li><strong>İlk işi deneme parçasıyla doğrulayın.</strong> NC programı sizin makine ayarlarınızla üretilir; yeni bir makinede ilk çalıştırmayı ucuz bir parçayla deneyin.</li>
  <li><strong>Revizyonda yalnız değişen parçayı kesin.</strong> Müşteri ölçü değiştirdiğinde bütün işi yeniden kesmek yerine farkı almak hem levha hem zaman kazandırır.</li>
  <li><strong>El işlemlerini ayrı okuyun.</strong> Takımı olmayan ya da kenar deliği gerektiren işler çıktıda ayrı belirtilir; bunları montajcıya ayrıca söyleyin.</li>
</ul>

<h2>Devamı</h2>

<p>Mutfak tarafındaki çizim akışı için <a href="/mutfak-cizim-programi.html">mutfak çizim programı</a>, mobilya tarafı için <a href="/mobilya-cizim-programi.html">mobilya çizim programı</a> yazılarına bakabilirsiniz. SketchUp'ta modelleme tarafını ilerletmek isterseniz <a href="/sketchup-ozel-ders">SketchUp özel ders</a> sayfası duruyor.</p>

<p>Delik tablosunu ve CNC çıktısını kendi projenizde görmek isterseniz <a href="${DS}" target="_blank">Dolap Sihirbazı'nın sitesinden</a> 5 günlük ücretsiz demoyu indirebilirsiniz.</p>
`,
  },
];

/* ---------------------------------------------------------------- */
/* Üretim                                                            */
/* ---------------------------------------------------------------- */

for (const y of YAZILAR) {
  const url = `/${y.slug}.html`;
  const tamUrl = `${SITE}${url}`;
  const sssHtml = y.sss.map(([s, c]) => `<h3>${s}</h3>\n<p>${c}</p>`).join("\n\n");
  const govde = `${y.govde.trim()}\n\n<h2>Sık sorulan sorular</h2>\n\n${sssHtml}\n`;
  const kelime = govde.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${tamUrl}#yazi`,
        headline: y.title,
        description: y.seoDesc,
        datePublished: `${TARIH}T${y.saat}+03:00`,
        dateModified: `${TARIH}T${y.saat}+03:00`,
        author: { "@type": "Person", name: "Ufuk Şen", url: `${SITE}/ufuk-sen-kimdir` },
        publisher: { "@type": "Person", name: "Ufuk Şen" },
        mainEntityOfPage: tamUrl,
        image: `https://i.ytimg.com/vi/${y.videolar[0].id}/maxresdefault.jpg`,
        inLanguage: "tr-TR",
      },
      {
        "@type": "FAQPage",
        "@id": `${tamUrl}#sss`,
        mainEntity: y.sss.map(([s, c]) => ({
          "@type": "Question",
          name: s,
          acceptedAnswer: { "@type": "Answer", text: c.replace(/<[^>]+>/g, "") },
        })),
      },
      ...y.videolar.map((v) => videoSema(v, tamUrl)),
      {
        "@type": "BreadcrumbList",
        "@id": `${tamUrl}#yol`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Ana sayfa", item: `${SITE}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
          { "@type": "ListItem", position: 3, name: y.title, item: tamUrl },
        ],
      },
    ],
  };

  const kayit = {
    legacyId: y.legacyId,
    slug: y.slug,
    legacyUrl: url,
    url,
    dil: "tr",
    alternatif: null,
    title: y.title,
    excerpt: y.excerpt,
    contentHtml: govde,
    publishedAt: `${TARIH} ${y.saat}`,
    modifiedAt: `${TARIH} ${y.saat}`,
    status: "publish",
    featuredImage: {
      legacyUrl: `/media/dolap-sihirbazi/kapak/${y.videolar[0].id}.webp`,
      localPath: `/media/dolap-sihirbazi/kapak/${y.videolar[0].id}.webp`,
      alt: `${y.keyword} — ${y.videolar[0].baslik}`,
      width: 960,
      height: 540,
      mimeType: "image/webp",
    },
    inlineMedia: [],
    embeds: y.videolar.map((v) => ({
      provider: "youtube",
      externalId: v.id,
      originalSrc: `https://www.youtube.com/watch?v=${v.id}`,
      title: v.baslik,
    })),
    seo: {
      title: y.seoTitle,
      description: y.seoDesc,
      focusKeyword: y.keyword,
      canonicalUrl: tamUrl,
      ogImage: `/media/dolap-sihirbazi/kapak/${y.videolar[0].id}.webp`,
      noindex: false,
    },
    jsonLd,
    readingMinutes: Math.max(1, Math.round(kelime / 200)),
    migrationChecksum: crypto.createHash("sha256").update(govde, "utf8").digest("hex"),
    author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
    categories: [{ legacyId: 1169, name: "3D Programlar", slug: "3d-programlar" }],
    tags: [],
  };

  fs.writeFileSync(
    path.join(KOK, "src", "content", "posts", `${y.slug}.json`),
    JSON.stringify(kayit, null, 2) + "\n",
    "utf8",
  );

  const say = (d) => (govde.match(d) ?? []).length;
  const dis = [...govde.matchAll(/href="(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  const anahtarIlk100 = govde.replace(/<[^>]+>/g, " ").split(/\s+/).slice(0, 100).join(" ").toLocaleLowerCase("tr");
  console.log(`\n${url}`);
  console.log(`  kelime      : ${kelime} | okuma ${kayit.readingMinutes} dk`);
  console.log(`  H2/H3       : ${say(/<h2/g)} / ${say(/<h3/g)}`);
  console.log(`  video/görsel: ${say(/<iframe/g)} / ${say(/<img /g)}`);
  console.log(`  SSS         : ${y.sss.length}`);
  console.log(`  title       : ${y.seoTitle.length} krk | açıklama ${y.seoDesc.length} krk`);
  console.log(`  anahtar ilk 100 kelimede: ${anahtarIlk100.includes(y.keyword.toLocaleLowerCase("tr"))}`);
  console.log(`  dış bağlantı: ${dis.length} → ${dis.join(" · ")}`);
}
