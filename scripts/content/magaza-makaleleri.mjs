/**
 * bestsketchupplugins.com'a yönlendiren 10 ihtiyaç odaklı makale üretir.
 *
 * KURALLAR
 * - Teknik sayılar ürün JSON'larından OKUNUR, elle yazılmaz. Ürün verisi
 *   değişince yazı da değişir.
 * - Ürün sayfalarındaki tanıtım metni KOPYALANMAZ. Oradaki metin satış
 *   sayfası için yazıldı; buradaki yazılar problemden giriyor. Aynı sitede
 *   iki sayfanın aynı cümleleri taşıması hem okura hem arama motoruna
 *   kötü gelir.
 * - Yönetmelik sayıları yazılmaz. Eklentinin kural denetimi yaptığını
 *   söyleriz; sınır değerleri kaynak göstermeden iddia etmeyiz.
 * - Fiyat yazılmaz; kampanyaya göre değişiyor.
 *
 * Her yazının sonunda mağazaya giden bağlantı var (backlink).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const MAGAZA = "https://www.bestsketchupplugins.com/tr/";
const urunDizin = path.join(KOK, "src", "content", "products");

const URUN = {};
for (const f of fs.readdirSync(urunDizin)) {
  const j = JSON.parse(fs.readFileSync(path.join(urunDizin, f), "utf8"));
  URUN[j.slug] = j;
}

/** Ürünün mağaza sayfası — veriden okunur, elle yazılmaz. */
const magazaYolu = (slug) => URUN[slug].magazaUrl;
/** Ürünün bu sitedeki tanıtım sayfası. */
const icYol = (slug) => `/eklenti/${slug}.html`;
const ad = (slug) => URUN[slug].ad;
const surum = (slug) => URUN[slug].surum;
const vurgu = (slug, i) => (URUN[slug].vurgular ?? [])[i] ?? "";
const kanit = (slug) => URUN[slug].kanit ?? {};
const uyum = (slug) => {
  const u = (URUN[slug].uyumluluk ?? []).filter((x) => /SketchUp \d/.test(x));
  if (u.length === 0) return "SketchUp";
  const ilk = u[0].replace("SketchUp ", "");
  const son = u[u.length - 1].replace("SketchUp ", "");
  return ilk === son ? `SketchUp ${ilk}` : `SketchUp ${ilk}–${son}`;
};

/** Önce/sonra kazancını cümleye çevirir — rakamlar veriden. */
function kazanc(slug) {
  const k = kanit(slug);
  if (!k.oncekiDakika || !k.sonrakiSaniye) return "";
  const kat = Math.round((k.oncekiDakika * 60) / k.sonrakiSaniye);
  return `<p class="kazanc"><strong>Ölçülen fark:</strong> ${k.oncekiEtiket.toLocaleLowerCase("tr-TR")} <strong>${k.oncekiDakika} dakika</strong> sürüyor; ${k.sonrakiEtiket.toLocaleLowerCase("tr-TR")} <strong>${k.sonrakiSaniye} saniye</strong>. Yaklaşık <strong>${kat} kat</strong>.</p>`;
}

/** S.S.S. bloğu — uzun kuyruklu arama cümlelerini karşılar. */
function sss(liste) {
  return (
    "<h2>Sık sorulan sorular</h2>\n" +
    liste.map((x) => `<h3>${x.s}</h3>\n<p>${x.c}</p>`).join("\n")
  );
}

/**
 * Küme içi çapraz bağlantı. On yazı birbirine bağlanınca arama motoru
 * bunları tek konu kümesi olarak görüyor; ayrıca okur bir yazıdan
 * diğerine geçebiliyor.
 */
function ilgili(buSlug) {
  const digerleri = YAZILAR.filter((y) => y.slug !== buSlug).slice(0, 4);
  return (
    "<h2>İlgili yazılar</h2>\n<ul>\n" +
    digerleri.map((y) => `  <li><a href="/${y.slug}.html">${y.baslik}</a></li>`).join("\n") +
    "\n</ul>"
  );
}

/** Her yazının sonundaki mağaza kutusu — backlink burada. */
function kapanis(slug, ek = "") {
  return `<h2>Nereden başlanır?</h2>
<p>${ek}${ad(slug)} şu an <strong>v${surum(slug)}</strong> sürümünde ve ${uyum(slug)} ile çalışıyor. Ne yaptığını ayrıntılı anlattığım sayfa burada: <a href="${icYol(slug)}">${ad(slug)}</a>.</p>
<p>Güncel sürüm, uyumluluk tablosu ve satın alma için eklentinin mağazadaki kendi sayfası: <a href="${magazaYolu(slug)}" target="_blank" rel="noopener">${ad(slug)} — bestsketchupplugins.com</a>.</p>
<p>Diğer eklentiler, disipline göre paketler ve ücretsiz araçlar için <a href="${MAGAZA}" target="_blank" rel="noopener">Best SketchUp Plugins</a> sayfasına bakabilirsiniz. Tanıtım yazısı: <a href="/sketchup-eklentileri-best-sketchup-plugins.html">SketchUp Eklentilerimiz Tek Adreste</a>.</p>
<p>SketchUp'ı baştan öğrenmek isterseniz <a href="/sketchup-2026-profesyonel-egitim.html">SketchUp 2026 profesyonel eğitim rehberi</a>, render tarafı için <a href="/egitimler">eğitim setleri</a> sayfasına bakabilirsiniz.</p>`;
}

/* ================================================================= */
/* Yazılar                                                           */
/* ================================================================= */
const YAZILAR = [
  {
    slug: "sketchup-zemin-kaplama-metraji",
    urun: "floorstudio",
    baslik: "SketchUp'ta Zemin Kaplaması Metrajı Nasıl Çıkarılır?",
    anahtar: "sketchup zemin metrajı",
    aciklama:
      "Parke ve seramik metrajını çizimden çıkarmanın yolu: desen, kesim payı, fire ve CSV listesi. Elle sayım neden tutmuyor?",
    kategoriler: ["sketchup", "3d-programlar"],
    govde: (u) => `
<p>Zemin metrajı, teklif hazırlarken en çok hata yapılan kalemlerden biri. Sebebi hesabın zor olması değil — <strong>çizimle metrajın birbirinden kopuk olması</strong>. Modelde zemin bir yüzey, teklifte ise bir sayı; ikisi arasındaki bağı insan kuruyor ve insan yanılıyor.</p>

<h2>Elle sayarken ne oluyor?</h2>

<p>Alışılmış yöntem şu: alanı ölçersiniz, kutu ölçüsüne bölersiniz, üstüne fire eklersiniz. Üç yerde kayıyor:</p>

<ul>
  <li><strong>Desen hesaba girmiyor.</strong> Balıksırtı ya da şaşırtmalı dizilim, düz dizilimden daha fazla kesim üretir. Alan aynı, fire değil.</li>
  <li><strong>Kesim payı tahmin ediliyor.</strong> "%10 fire" alışkanlıktan söylenen bir sayı; oda geometrisi karmaşıklaştıkça gerçek fire ondan sapıyor.</li>
  <li><strong>Değişiklik metraja yansımıyor.</strong> Oda büyüyor, duvar kayıyor — model güncelleniyor ama tablodaki sayı eski kalıyor.</li>
</ul>

<p>Sonuç tanıdık: ya eksik malzeme çıkıyor ve iş duruyor, ya fazla çıkıyor ve parayı siz ödüyorsunuz.</p>

<h2>Metraj çizimin kendisinden gelirse</h2>

<p>Doğru kurgu, metrajı ayrı bir işlem olmaktan çıkarıp <em>çizimin çıktısı</em> hâline getirmek. Yani tahtalar modelde gerçekten döşensin — odaya göre kesilsin — ve sayım o parçalardan yapılsın.</p>

<p>${ad(u)} bunu yapıyor: yüzeyi seçiyorsunuz, deseni seçiyorsunuz, parçalar odaya kesilmiş olarak yerine oturuyor. Sayım da o parçalardan çıkıyor, tahminden değil. <strong>${vurgu(u, 0)}</strong> arasından seçiyorsunuz ve sonuç <strong>${vurgu(u, 2).toLocaleLowerCase("tr-TR")}</strong> olarak dışa aktarılıyor — teklife doğrudan yapıştırabileceğiniz bir liste.</p>

${kazanc(u)}

<h2>Neden CSV önemli?</h2>

<p>Çünkü teklif Excel'de hazırlanıyor. Modeldeki sayıyı elle Excel'e yazmak, hatanın tekrar girdiği yer. Liste dosya olarak çıkınca o adım ortadan kalkıyor; m² ve adet aynı kaynaktan geliyor.</p>

<h2>Ne zaman işe yaramaz?</h2>

<p>Dürüst olalım: tek bir odanın kabaca alanını öğrenmek istiyorsanız eklentiye gerek yok, ölçüp bölmek yeterli. Fark, <strong>çok odalı projelerde ve desen değiştiğinde</strong> ortaya çıkıyor. Bir de revizyonda: plan değişince metrajı yeniden üretmek bir tık oluyor.</p>

${sss([{ s: "Zemin metrajına ne kadar fire eklemeliyim?", c: "Fire oranı desene ve oda geometrisine göre değişiyor; alışkanlıktan söylenen tek bir yüzde yok. Parçalar modelde gerçekten kesildiğinde fire tahmin edilmek yerine sayılmış oluyor." }, { s: "Parke ve seramik metrajı aynı şekilde mi çıkar?", c: "Mantık aynı: yüzey, desen ve kesim. Fark, parça ölçüsünde ve derz payında. İkisi için de parçadan sayım, alandan bölmeye göre daha doğru sonuç verir." }, { s: "Metrajı Excel'e nasıl aktarırım?", c: "CSV olarak dışa aktarıp Excel'de açıyorsunuz. Arada elle yazım olmadığı için modeldeki sayı ile tekliftekinin farklı olma ihtimali kalkıyor." }])}

${kapanis(u)}

${ilgili("sketchup-zemin-kaplama-metraji")}
`,
  },

  {
    slug: "sketchup-dolap-cizimi-cnc-kesim-listesi",
    urun: "wardrobe-studio",
    baslik: "Ölçüden CNC'ye: SketchUp'ta Gömme Dolap Çizimi",
    anahtar: "sketchup dolap çizimi",
    aciklama:
      "Gömme dolabı panel panel çizmeden modellemek, teklifi ve CNC kesim dosyalarını aynı çizimden almak.",
    kategoriler: ["sketchup", "3d-programlar"],
    govde: (u) => `
<p>Mobilyacının iki ayrı derdi var: müşteriye gösterilecek bir görsel ve atölyeye gidecek bir kesim listesi. Çoğu yerde bu ikisi ayrı ayrı üretiliyor — biri SketchUp'ta, diğeri Excel'de. Arada bir yerde ölçü kayıyor ve panel yanlış kesiliyor.</p>

<h2>Panel panel çizmenin maliyeti</h2>

<p>Bir gömme dolabı elle modellemek, her yan paneli, rafı, kapağı ve sırtı ayrı ayrı çizmek demek. Sonra her birinin ölçüsünü okuyup listeye yazmak gerekiyor. İki sorun:</p>

<ul>
  <li><strong>Süre.</strong> ${kanit(u).oncekiEtiket} yaklaşık <strong>${kanit(u).oncekiDakika} dakika</strong> alıyor.</li>
  <li><strong>Revizyon.</strong> Müşteri "dolap 20 cm daha geniş olsun" dediğinde iş baştan başlıyor; çünkü paneller birbirine bağlı değil, sadece yan yana duran kutular.</li>
</ul>

<h2>Parametrik kurgu ne değiştiriyor?</h2>

<p>Paneller birbirini bilirse, genişliği değiştirdiğinizde raf da kapak da sırt da kendini güncelliyor. ${ad(u)} dolabı <strong>${vurgu(u, 0).toLocaleLowerCase("tr-TR")}</strong> olarak kuruyor; yani ölçüyü yazdığınızda gövde gerçek parçalardan oluşuyor, blok bir kutudan değil.</p>

<p>Kaplama ve kapak tarafında <strong>${vurgu(u, 1).toLocaleLowerCase("tr-TR")}</strong> seçeneği var. Sürüm <strong>${vurgu(u, 2)}</strong> ile çalışıyor — eski SketchUp sürümünde kalmış atölyeler için önemli bir ayrıntı.</p>

${kazanc(u)}

<h2>Kesim listesi ve CNC</h2>

<p>Asıl kazanç çıktıda. Dolap parçalardan kurulduğu için kesim listesi sayımdan değil, parçaların kendisinden çıkıyor. Teklif ve CNC dosyaları aynı modelden üretiliyor; atölyeye giden ölçü ile müşteriye gösterilen görsel aynı kaynaktan besleniyor.</p>

<h2>Gerçekçi beklenti</h2>

<p>Eklenti size tasarım yapmıyor — dolabın nereye konacağına, kaç kapaklı olacağına siz karar veriyorsunuz. Yaptığı şey, o kararı verdikten sonraki mekanik işi üstlenmek. Tasarımın kendisi hâlâ sizin işiniz.</p>

${sss([{ s: "Kesim listesi hangi formatta çıkıyor?", c: "Teklif için tablo, üretim için CNC'ye gidebilen dosya olarak. İkisi de aynı modelden türediği için aralarında ölçü farkı olmuyor." }, { s: "Dolabın ölçüsünü sonradan değiştirebilir miyim?", c: "Evet. Gövde parçalardan kurulduğu ve parçalar birbirini bildiği için genişliği değiştirdiğinizde raf, kapak ve sırt kendini güncelliyor." }, { s: "Eski SketchUp sürümünde çalışır mı?", c: "Dolap Sihirbazı SketchUp 2017 ve sonrasını destekliyor — atölyelerde sık görülen eski sürümler de kapsamda." }])}

${kapanis(u)}

${ilgili("sketchup-dolap-cizimi-cnc-kesim-listesi")}
`,
  },

  {
    slug: "pencere-teklifini-cizimden-cikarmak",
    urun: "windowfun-studio",
    baslik: "Pencere Teklifini Çizimden Çıkarmak",
    anahtar: "sketchup pencere çizimi teklif",
    aciklama:
      "PVC ve alüminyum doğramada teklif hazırlarken ölçü neden kayıyor? Pencereyi modelden teklife bağlamanın yolu.",
    kategoriler: ["sketchup", "3d-programlar"],
    govde: (u) => `
<p>Doğrama işinde teklif hızı iş alıp alamamayı belirliyor. Müşteri üç yerden fiyat istiyor; ilk dönen genelde avantajlı başlıyor. Ama hızlı teklif, yanlış teklif olmamalı.</p>

<h2>Neden bu kadar uzun sürüyor?</h2>

<p>Bir pencereyi SketchUp'ta elle çizmek, kasayı, kanadı, camı ve varsa kayıt profilini ayrı kutulardan kurmak demek. Ardından profil metrajını, cam alanını ve aksesuar adedini okuyup fiyat tablosuna geçirmek gerekiyor. ${kanit(u).oncekiEtiket} yaklaşık <strong>${kanit(u).oncekiDakika} dakika</strong>.</p>

<p>Beş pencerelik bir daire için bu süre kabul edilebilir. Otuz pencerelik bir apartman için değil.</p>

<h2>Modelden teklife tek yol</h2>

<p>${ad(u)} ölçüyü alıp pencereyi kuruyor ve aynı anda teklifi üretiyor. Elinizde <strong>${vurgu(u, 0).toLocaleLowerCase("tr-TR")}</strong> var; tip seçiliyor, ölçü giriliyor, model ve fiyat birlikte çıkıyor.</p>

<p>Çıktı tarafı önemli: <strong>${vurgu(u, 1)}</strong>. CSV teklife, DXF üretime, PDF müşteriye gidiyor. Üçü de aynı modelden türediği için aralarında fark olmuyor.</p>

${kazanc(u)}

<h2>Üretime giden dosya</h2>

<p>DXF çıktısı, teklifin kabul edilmesi durumunda işin devamını da çözüyor. Teklif için çizdiğiniz model, üretim için yeniden çizilmek zorunda kalmıyor. Doğrama sektöründe en sık görülen çifte iş burada ortadan kalkıyor.</p>

<h2>Sınırları</h2>

<p>Sürüm ${surum(u)} şu an <strong>${uyum(u)}</strong> ile çalışıyor; daha eski SketchUp sürümlerinde kurulmuyor. Özel geometrili, kemerli ya da standart dışı doğramalarda hazır modeller yetmeyebilir — orada elle çizim hâlâ gerekli.</p>

${sss([{ s: "PVC ve alüminyum için ayrı ayrı çalışıyor mu?", c: "Model kütüphanesi tip bazlı; kasa ve kanat geometrisi seçilen tipe göre kuruluyor. Profil sistemine özgü ayrıntılarda elle müdahale gerekebiliyor." }, { s: "Teklif fiyatları nereden geliyor?", c: "Birim fiyatları siz tanımlıyorsunuz; eklenti metrajı ve adedi üretiyor, fiyatı sizin verdiğiniz değerlerle çarpıyor." }, { s: "DXF çıktısını doğrudan üretime gönderebilir miyim?", c: "Çıktı üretim için hazırlanıyor, ama her atölyenin kendi şablonu var. İlk işte çıktıyı kendi standardınızla karşılaştırmak doğru olur." }])}

${kapanis(u)}

${ilgili("pencere-teklifini-cizimden-cikarmak")}
`,
  },

  {
    slug: "plan-degisti-modeli-bastan-cizmemek",
    urun: "archiflow",
    baslik: "Müşteri Duvarı Kaydırdı: Modeli Baştan Çizmemek",
    anahtar: "sketchup parametrik mimari model",
    aciklama:
      "Plan revizyonunda modelin bozulmaması için duvar, kapı ve döşemenin birbirini bilmesi gerekiyor. Reaktif model nedir?",
    kategoriler: ["sketchup", "3d-programlar"],
    govde: (u) => `
<p>Mimari projede değişmeyen tek şey, planın değişeceği. Sorun değişikliğin kendisi değil — <strong>değişikliğin maliyeti</strong>. Bir duvarı 40 cm kaydırmak beş saniyelik iş; o duvara bağlı döşemeyi, tavanı, kapı boşluğunu ve süpürgeliği onarmak yarım saat.</p>

<h2>SketchUp neden bu konuda zorlar?</h2>

<p>SketchUp bir yüzey modelleyicisi. Çizdiğiniz duvar "duvar" değil, altı yüzeyden oluşan bir kutu. Kutunun yanındaki döşeme, o kutunun orada olduğunu bilmiyor. Dolayısıyla kutuyu taşıdığınızda döşeme olduğu yerde kalıyor ve siz elle onarıyorsunuz.</p>

<p>Bu, SketchUp'ın kusuru değil; hızlı olmasının sebebi. Ama proje büyüdükçe bedeli büyüyor.</p>

<h2>Reaktif model ne demek?</h2>

<p>Öğeler arasındaki ilişkiyi modelin kendisi tutarsa, duvarı taşıdığınızda ona bağlı olan her şey kendini yeniden kuruyor. ${ad(u)} bunu yapıyor: <strong>${vurgu(u, 1).toLocaleLowerCase("tr-TR")}</strong> — yani değişikliğin ardından bekleme süresi fark edilmiyor.</p>

<p>İçinde <strong>${vurgu(u, 0).toLocaleLowerCase("tr-TR")}</strong> var; duvar, döşeme, çatı gibi başlıklar ayrı ayrı ele alınıyor.</p>

${kazanc(u)}

<h2>Bunun gerçek kazancı nerede?</h2>

<p>Tek bir revizyonda değil, <strong>revizyon korkusunun kalkmasında</strong>. Modeli bozmaktan çekinmediğinizde müşterinin "şöyle de bir deneyelim" isteğine evet diyebiliyorsunuz. Tasarım kararları daha çok denenmiş oluyor.</p>

<h2>Öğrenme eğrisi</h2>

<p>Parametrik çalışmak, serbest çizmekten farklı bir alışkanlık. İlk projede daha yavaş ilerlersiniz; kazanç ikinci projeden itibaren başlıyor. Bunu baştan söylemek daha doğru.</p>

${sss([{ s: "Parametrik çalışmak SketchUp'ı yavaşlatır mı?", c: "Yeniden kurma süresi ölçülmüş: yaklaşık 150 ms. Pratikte duvarı taşıdığınızda bekleme hissetmiyorsunuz." }, { s: "Mevcut modelimi parametrik hâle çevirebilir miyim?", c: "Hayır; mantık, modelin baştan ilişkili kurulmasına dayanıyor. Devam eden bir projeyi dönüştürmek yerine yeni projede başlamak daha verimli." }, { s: "Bu bir BIM yazılımı mı?", c: "Değil. BIM'in veri katmanını hedeflemiyor; amacı SketchUp'ta plan revizyonunun maliyetini düşürmek." }])}

${kapanis(u)}

${ilgili("plan-degisti-modeli-bastan-cizmemek")}
`,
  },

  {
    slug: "render-cevre-binalari-nasil-doldurulur",
    urun: "cityfill",
    baslik: "Render'daki Boş Çevre Sorunu Nasıl Çözülür?",
    anahtar: "render çevre binaları",
    aciklama:
      "Binanız güzel ama çevresi bomboş. Vaziyet planını gerçekçi kılan dolgu yapıları hızlıca nasıl yerleştirilir?",
    kategoriler: ["sketchup", "3d-gorsellestirme"],
    govde: (u) => `
<p>Tasarladığınız bina bitmiş, malzemeleri oturmuş, ışık doğru. Render alıyorsunuz ve bir tuhaflık var: bina <em>boşlukta duruyor</em>. Çevresinde hiçbir şey yok. Göz bunu hemen yakalıyor ve görsel inandırıcılığını kaybediyor.</p>

<h2>Boş çevre neden bu kadar göze batıyor?</h2>

<p>Çünkü gerçek hayatta hiçbir bina tek başına durmuyor. Beyin, binanın ölçeğini çevresindeki yapılarla karşılaştırarak anlıyor. Komşu yapı yoksa ölçek algısı da yok — bina maket gibi görünüyor.</p>

<p>İkinci sebep ışık: komşu binalar gölge düşürür, yansıma verir. Onlar olmayınca aydınlatma fazla temiz, fazla stüdyo kalıyor.</p>

<h2>Tek tek model aramanın bedeli</h2>

<p>Alışılmış çözüm, internetten dolgu binası indirip yerleştirmek. Her biri için arama, indirme, ölçek düzeltme, malzeme temizliği gerekiyor. ${kanit(u).oncekiEtiket} yaklaşık <strong>${kanit(u).oncekiDakika} dakika</strong> — ve indirilen modeller çoğu zaman gereksiz ağır, sahneyi yavaşlatıyor.</p>

<h2>Dağıtıcı mantığı</h2>

<p>${ad(u)} adayı ya da alanı sınırlandırıp içini dolduruyor. <strong>${vurgu(u, 0).toLocaleLowerCase("tr-TR")}</strong> arasından seçim yapıyor, <strong>${vurgu(u, 1).toLocaleLowerCase("tr-TR")}</strong> ile dizilimi belirliyorsunuz.</p>

${kazanc(u)}

<h2>Dolgu yapısı ne kadar detaylı olmalı?</h2>

<p>Olabildiğince az. Çevre binaları arka planda, çoğu zaman gölgede ve bulanık kalıyor. Detay koymak sahneyi ağırlaştırmaktan başka işe yaramıyor. Doğru dolgu, kütleyi ve ölçeği veren, detayı olmayan yapıdır.</p>

<p>Bu eklenti ücretsiz — çevre sorununu çözmek için para harcamanıza gerek yok.</p>

${sss([{ s: "Çevre binaları sahneyi ağırlaştırır mı?", c: "Dolgu yapıları düşük detaylı tutuluyor. İnternetten indirilen ağır modellerle karşılaştırıldığında sahne çok daha hafif kalıyor." }, { s: "Gerçek imar durumuna uygun mu?", c: "Hayır, bunlar görsel dolgu. Vaziyet planı ve imar durumu gerektiren işlerde gerçek veriyle çalışmak gerekiyor." }, { s: "CityFill ücretsiz mi?", c: "Evet, ücretsiz. Çevre sorununu çözmek için ödeme yapmanız gerekmiyor." }])}

${kapanis(u, "")}

${ilgili("render-cevre-binalari-nasil-doldurulur")}
`,
  },

  {
    slug: "sketchup-merdiven-cizimi-ve-kural-denetimi",
    urun: "stairfun-studio",
    baslik: "SketchUp'ta Merdiven Çizimi ve Kural Denetimi",
    anahtar: "sketchup merdiven çizimi",
    aciklama:
      "Rıht ve basamak hesabını elle yapmadan merdiven kurmak; kat yüksekliği değişince merdivenin kendini güncellemesi.",
    kategoriler: ["sketchup", "3d-programlar"],
    govde: (u) => `
<p>Merdiven, mimari projede en çok yeniden çizilen elemanlardan biri. Sebebi basit: kat yüksekliği proje boyunca birkaç kez değişiyor ve her değişiklikte rıht sayısı da, basamak genişliği de değişiyor.</p>

<h2>Elle hesabın sorunu</h2>

<p>Kat yüksekliğini rıht sayısına bölüyorsunuz, çıkan değer uygun aralıkta mı diye bakıyorsunuz, sonra her basamağı çizip çoğaltıyorsunuz. ${kanit(u).oncekiEtiket} yaklaşık <strong>${kanit(u).oncekiDakika} dakika</strong>.</p>

<p>Asıl sıkıntı bu süre değil. Kat yüksekliği 2,90'dan 3,05'e çıktığında işlemin tamamını tekrarlamak — ve çoğu zaman projede eski merdivenin unutulması.</p>

<h2>Kuralı modelin içine koymak</h2>

<p>${ad(u)} merdiveni kurarken <strong>${vurgu(u, 1).toLocaleLowerCase("tr-TR")}</strong> çalıştırıyor. Yani rıht ve basamak ilişkisi, sahanlık gereksinimi gibi konular siz hesaplamadan denetleniyor; bir değer uygun aralığın dışına çıktığında bunu size söylüyor.</p>

<p><strong>Önemli not:</strong> yönetmelik sınırları projeye, yapı sınıfına ve yürürlükteki mevzuata göre değişir. Eklentinin denetimi işinizi kolaylaştırır ama <em>sorumluluğu üstlenmez</em>; nihai kontrol her zaman projeyi imzalayanındır.</p>

<p>Form tarafında <strong>${vurgu(u, 0).toLocaleLowerCase("tr-TR")}</strong> var — düz, L, U ve döner çeşitleriyle birlikte.</p>

${kazanc(u)}

<h2>Değiştirilebilir kalması</h2>

<p>Merdiven kurulduktan sonra kapanıp "kütük" hâline gelmiyor; kat yüksekliğini değiştirdiğinizde kendini yeniden kuruyor. <strong>${vurgu(u, 2).toLocaleLowerCase("tr-TR")}</strong> ölçülmüş bir değer — yani bekleme olmuyor.</p>

<h2>Durumu</h2>

<p>${ad(u)} şu an <strong>beta</strong> olarak işaretli: çalışıyor ama hâlâ gelişiyor. Bunu gizlemiyoruz; kritik bir projede kullanacaksanız çıktıyı kontrol edin.</p>

${sss([{ s: "Eklenti yönetmeliğe uygunluğu garanti eder mi?", c: "Etmez. Kural denetimi işinizi kolaylaştırır ama sorumluluk projeyi imzalayandadır; yürürlükteki mevzuat ve yapı sınıfı belirleyicidir." }, { s: "Kat yüksekliği değişince merdiven güncellenir mi?", c: "Evet, merdiven kapanıp kütük hâline gelmiyor; değeri değiştirdiğinizde kendini yeniden kuruyor." }, { s: "Döner ve U merdiven var mı?", c: "Sekiz form destekleniyor: düz, L, U ve döner çeşitleriyle birlikte, rampa dahil." }])}

${kapanis(u)}

${ilgili("sketchup-merdiven-cizimi-ve-kural-denetimi")}
`,
  },

  {
    slug: "rampa-cizimi-egim-ve-korkuluk",
    urun: "ramp-studio",
    baslik: "Rampa Çizimi: Eğim, Sahanlık ve Korkuluk",
    anahtar: "sketchup rampa çizimi",
    aciklama:
      "Erişilebilirlik rampasını SketchUp'ta modellemek: eğimi kontrol altında tutmak ve korkuluğu otomatik kurmak.",
    kategoriler: ["sketchup", "3d-programlar"],
    govde: (u) => `
<p>Rampa, küçük görünen ama elle modellendiğinde şaşırtıcı derecede uzun süren bir eleman. Çünkü iş yalnızca eğimli bir yüzey çizmekten ibaret değil: sahanlık, korkuluk, küpeşte ve dönüş geometrisi var.</p>

<h2>Neden bu kadar uğraştırıyor?</h2>

<p>Korkuluk, rampanın eğimini takip etmek zorunda. Elle çizdiğinizde her dikme farklı yükseklikte oluyor ve küpeşte eğimle birlikte dönüyor. Bir dikmeyi kaydırdığınızda zincirin tamamı bozuluyor. ${kanit(u).oncekiEtiket} yaklaşık <strong>${kanit(u).oncekiDakika} dakika</strong>.</p>

<h2>Güzergâhtan rampa üretmek</h2>

<p>${ad(u)} rampayı çizgiden kuruyor: güzergâhı çiziyorsunuz, eğim ve genişlik parametrelerini veriyorsunuz, korkuluk kendini yerleştiriyor. <strong>${vurgu(u, 0).toLocaleLowerCase("tr-TR")}</strong> hazır olarak geliyor; sık kullanılan durumlar için baştan ayar yapmanız gerekmiyor.</p>

<p>Korkuluk tarafında <strong>${vurgu(u, 1).toLocaleLowerCase("tr-TR")}</strong> seçeneği var.</p>

${kazanc(u)}

<h2>Eğim konusunda doğru beklenti</h2>

<p>Eklenti seçtiğiniz eğimi uyguluyor ve değeri gözünüzün önünde tutuyor. Ama <strong>hangi eğimin zorunlu olduğu</strong> yapının türüne, kullanıcısına ve yürürlükteki erişilebilirlik mevzuatına bağlı. O sınırı buradan yazmıyorum; projeyi veren kurumun şartnamesine ve güncel yönetmeliğe bakmak gerekiyor. Eklentinin işi, karar verdiğiniz eğimi doğru uygulamak.</p>

<h2>Test durumu</h2>

<p>Sürüm ${surum(u)} için <strong>${vurgu(u, 2).toLocaleLowerCase("tr-TR")}</strong>. ${ad(u)} şu an beta; geometri üretimi çalışıyor, arayüz hâlâ gelişiyor.</p>

${sss([{ s: "Rampa eğimi kaç olmalı?", c: "Bu, yapının türüne ve yürürlükteki erişilebilirlik mevzuatına bağlı; tek bir sayı vermek doğru olmaz. Eklenti sizin belirlediğiniz eğimi uygular ve değeri görünür tutar." }, { s: "Korkuluk rampanın eğimini takip ediyor mu?", c: "Evet, küpeşte ve dikmeler eğime göre kuruluyor; elle çizimde en çok vakit alan kısım bu." }, { s: "Sahanlıklı rampa yapılabiliyor mu?", c: "Güzergâhı sahanlıklı çizdiğinizde rampa ona göre bölünüyor." }])}

${kapanis(u)}

${ilgili("rampa-cizimi-egim-ve-korkuluk")}
`,
  },

  {
    slug: "supurgelik-ve-kartonpiyer-gonye-sorunu",
    urun: "dynamic-skirting",
    baslik: "Süpürgelik ve Kartonpiyerde Gönye Sorunu",
    anahtar: "sketchup süpürgelik çizimi",
    aciklama:
      "İç mekân görselinde süpürgelik neden hep sorun çıkarır? Köşelerde gönye kesmeden profil yerleştirmenin yolu.",
    kategoriler: ["sketchup", "3d-gorsellestirme"],
    govde: (u) => `
<p>İç mekân render'ında süpürgelik, varlığıyla değil <em>yokluğuyla</em> fark edilen bir detay. Olmadığında duvar zemine tuhaf bir şekilde saplanır ve görsel "çizim" gibi durur. Konulduğunda kimse övmez ama sahne oturur.</p>

<h2>Elle çizmenin can sıkıcı kısmı</h2>

<p>Profil çizmek kolay. Zor olan <strong>köşeler</strong>. Her iç köşede ve dış köşede profilin gönye kesilmesi gerekiyor; odanın köşesi dik değilse açı da değişiyor. Bir odanın süpürgeliğini elle yapmak ${kanit(u).oncekiDakika} dakika sürüyor — ve on odalı bir dairede bu, tek başına yarım günü yiyor.</p>

<h2>Döşemeyi tanıyan profil</h2>

<p>${ad(u)} döşemeye tıklamanızı istiyor; çevreyi kendisi okuyup profili köşeleriyle birlikte yerleştiriyor. Gönye hesabı sizin işiniz olmaktan çıkıyor.</p>

<p>Profil seçimi için <strong>${vurgu(u, 0).toLocaleLowerCase("tr-TR")}</strong> var. Aynı araç kartonpiyer için de çalışıyor — tavan tarafında mantık aynı.</p>

${kazanc(u)}

<h2>Arayüz dili</h2>

<p>Eklentinin arayüzü <strong>${vurgu(u, 2)}</strong> olarak hazırlandı; yurt dışında çalışan ya da yabancı ekibi olan ofisler için anlamlı bir ayrıntı.</p>

<h2>Sürüm uyumluluğu</h2>

<p>Bu eklenti ${uyum(u)} ile çalışıyor. Daha eski SketchUp kullanıyorsanız kurulmuyor; bunu satın almadan önce kontrol edin.</p>

${sss([{ s: "Köşeler dik değilse ne oluyor?", c: "Profil çevreyi okuyup açıya göre birleşiyor; gönye hesabını siz yapmıyorsunuz." }, { s: "Aynı eklenti kartonpiyer için de çalışıyor mu?", c: "Evet. Tavan tarafında mantık aynı; profil seçip yüzeyi gösteriyorsunuz." }, { s: "Hangi SketchUp sürümleri destekleniyor?", c: "Dynamic Skirting SketchUp 2024–2026 ile çalışıyor. Daha eski sürümlerde kurulmuyor." }])}

${kapanis(u)}

${ilgili("supurgelik-ve-kartonpiyer-gonye-sorunu")}
`,
  },

  {
    slug: "perde-modelleme-ve-kumas-metraji",
    urun: "curtain-craft",
    baslik: "Perde Modellemek Neden Bu Kadar Uzun Sürüyor?",
    anahtar: "sketchup perde modelleme",
    aciklama:
      "Kıvrımlı perdeyi elle modellemenin maliyeti ve kumaş metrajını çizimden almanın yolu.",
    kategoriler: ["sketchup", "3d-gorsellestirme"],
    govde: (u) => `
<p>Perde, iç mekân görselinde en çok emek yiyen öğelerden biri. Sebebi şu: düz bir yüzey değil. Kıvrımları var, kıvrımlar ışığı farklı tutuyor ve kıvrım sayısı kumaş miktarını belirliyor.</p>

<h2>Elle modellemenin iki ayrı maliyeti</h2>

<p>Birincisi <strong>zaman</strong>: ${kanit(u).oncekiEtiket} yaklaşık <strong>${kanit(u).oncekiDakika} dakika</strong>.</p>

<p>İkincisi <strong>metraj</strong>. Perdeci kumaşı pile payıyla hesaplıyor; modelde gördüğünüz kıvrım sayısıyla sipariş edilecek kumaş arasında doğrudan bir ilişki var. Modeli göz kararı kıvırdığınızda metraj da göz kararı oluyor.</p>

<h2>Sistem seçmek, kıvrım çizmek değil</h2>

<p>${ad(u)} perdeyi sistem olarak ele alıyor: <strong>${vurgu(u, 0).toLocaleLowerCase("tr-TR")}</strong>. Pile tipini ve korniş sistemini seçiyorsunuz, kıvrımlar ona göre kuruluyor — ve kumaş metrajı aynı seçimden hesaplanıyor.</p>

${kazanc(u)}

<h2>Teklif tarafı</h2>

<p>Perde işinde teklif, kumaş metresi üzerinden veriliyor. Metrajın modelden gelmesi, "tahmini" teklif vermeyi bitiriyor. Müşteriye gösterdiğiniz görseldeki perde ile fiyatladığınız perde aynı perde oluyor.</p>

<h2>Olgunluk</h2>

<p>Sürüm ${surum(u)} için <strong>${vurgu(u, 1).toLocaleLowerCase("tr-TR")}</strong>. Arayüz <strong>${vurgu(u, 2)}</strong>.</p>

${sss([{ s: "Kumaş metrajı pile payını içeriyor mu?", c: "Metraj seçtiğiniz pile tipinden hesaplanıyor; kıvrım sayısı ile kumaş miktarı arasındaki ilişki modelin içinde." }, { s: "Korniş ve rayı da çiziyor mu?", c: "Evet, sistem olarak ele alınıyor: perde, korniş ve bağlantıları birlikte kuruluyor." }, { s: "Tül ve fon perde ayrı ayrı yapılabiliyor mu?", c: "On dokuz sistem arasından seçiliyor; tül ve fon ayrı katman olarak kurulabiliyor." }])}

${kapanis(u)}

${ilgili("perde-modelleme-ve-kumas-metraji")}
`,
  },

  {
    slug: "kompozit-cephe-metraji-ve-panel-bolumleme",
    urun: "kompozit-studio",
    baslik: "Kompozit Cephe Metrajı ve Panel Bölümleme",
    anahtar: "acm kompozit cephe metrajı",
    aciklama:
      "ACM cephede panel bölümlemesini ve metrajı elle yapmanın maliyeti; cepheyi yüzeyden panele çevirmenin yolu.",
    kategoriler: ["sketchup", "3d-programlar"],
    govde: (u) => `
<p>Kompozit cephe teklifinde iki sayı belirleyici: kaç m² panel ve kaç adet parça. İkisi aynı şey değil. Alan aynı kalsa bile bölümleme değiştiğinde parça adedi, dolayısıyla işçilik ve fire değişiyor.</p>

<h2>Elle bölümlemenin sorunu</h2>

<p>Cepheyi panel panel modellemek, levha ölçüsünü cephe yüzeyine oturtup kalan parçaları tek tek çizmek demek. ${kanit(u).oncekiEtiket} yaklaşık <strong>${kanit(u).oncekiDakika} dakika</strong>.</p>

<p>Üstelik pencere boşlukları ve köşe dönüşleri bölümlemeyi bozuyor; o bölgelerde parça sayısı elle saymayla tutmuyor.</p>

<h2>Izgarayı yüzeye oturtmak</h2>

<p>${ad(u)} cephe yüzeylerini seçip üzerine panel ızgarasını kuruyor. Izgara <strong>${vurgu(u, 0)}</strong> ölçüsü üzerinden çalışıyor — sektörde standart levha ölçüsü.</p>

<p>Çıktı olarak <strong>${vurgu(u, 1).toLocaleLowerCase("tr-TR")}</strong> veriyor; yani hem alan hem adet aynı modelden geliyor.</p>

${kazanc(u)}

<h2>Neden adet önemli?</h2>

<p>Çünkü maliyetin bir kısmı alanla değil, parça sayısıyla ölçekleniyor: kesim, büküm, montaj ve taşıyıcı profil. Yalnızca m² üzerinden verilen teklif, karmaşık cephelerde eksik kalıyor.</p>

<h2>Durumu</h2>

<p>${ad(u)} <strong>beta</strong>; geometri ve metraj çalışıyor, ayrıntılar gelişmeye devam ediyor. ${uyum(u)} ile uyumlu.</p>

${sss([{ s: "Metraj m² olarak mı adet olarak mı çıkıyor?", c: "İkisi birden. Maliyetin bir kısmı alanla, bir kısmı parça sayısıyla ölçeklendiği için yalnızca m² yeterli olmuyor." }, { s: "Pencere boşlukları bölümlemeye dahil mi?", c: "Izgara yüzeye oturtulurken boşluklar hesaba katılıyor; elle saymada en çok hata yapılan yer burasıydı." }, { s: "Panel ölçüsünü değiştirebilir miyim?", c: "Izgara 1250×2500 mm standart levha üzerinden çalışıyor; farklı levha ölçüleriyle çalışıyorsanız bunu baştan kontrol edin." }])}

${kapanis(u)}

${ilgili("kompozit-cephe-metraji-ve-panel-bolumleme")}
`,
  },
];

/* ================================================================= */
/* Yazma                                                             */
/* ================================================================= */
const KATEGORI = {
  sketchup: { legacyId: 1172, name: "Sketchup", slug: "sketchup" },
  "3d-programlar": { legacyId: 1169, name: "3D Programlar", slug: "3d-programlar" },
  "3d-gorsellestirme": { legacyId: 518, name: "3D Görselleştirme", slug: "3d-gorsellestirme" },
};

let id = 90010;
const ozet = [];

for (const y of YAZILAR) {
  const govde = y.govde(y.urun).trim();
  const kelime = govde.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  const yol = `/${y.slug}.html`;

  const kayit = {
    legacyId: id++,
    slug: y.slug,
    legacyUrl: yol,
    url: yol,
    title: y.baslik,
    excerpt: y.aciklama,
    contentHtml: govde,
    publishedAt: "2026-10-17 11:00:00",
    modifiedAt: "2026-10-17 11:00:00",
    status: "publish",
    featuredImage: null,
    inlineMedia: [],
    embeds: [],
    seo: {
      title: `${y.baslik} | Ufuk Şen`,
      description: y.aciklama.slice(0, 158),
      focusKeyword: y.anahtar,
      canonicalUrl: `https://www.ufuksen.com${yol}`,
      ogImage: null,
      noindex: false,
    },
    readingMinutes: Math.max(1, Math.round(kelime / 200)),
    migrationChecksum: crypto.createHash("sha256").update(govde, "utf8").digest("hex"),
    author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
    categories: y.kategoriler.map((k) => KATEGORI[k]),
    tags: [],
  };

  fs.writeFileSync(
    path.join(KOK, "src", "content", "posts", `${y.slug}.json`),
    JSON.stringify(kayit, null, 2) + "\n",
    "utf8",
  );

  ozet.push({
    yol,
    kelime,
    magaza: (govde.match(/bestsketchupplugins\.com/g) ?? []).length,
    ic: (govde.match(/href="\/eklenti\//g) ?? []).length,
  });
}

console.log(`üretilen yazı : ${ozet.length}`);
console.log(`toplam kelime : ${ozet.reduce((t, o) => t + o.kelime, 0)}`);
console.log(`ortalama      : ${Math.round(ozet.reduce((t, o) => t + o.kelime, 0) / ozet.length)} kelime`);
console.log(`mağaza bağlantısı olmayan yazı: ${ozet.filter((o) => o.magaza === 0).length}`);
console.log();
for (const o of ozet) {
  console.log(`  ${o.yol.padEnd(46)} ${String(o.kelime).padStart(4)} kelime · mağaza ${o.magaza} · iç ${o.ic}`);
}
