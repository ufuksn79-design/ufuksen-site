/**
 * "Best SketchUp Plugins: Sitede Ne Var?" — ayrıntılı tanıtım yazısı.
 *
 * Sayılar `src/content/products/*.json` dosyalarından OKUNUR, elle yazılmaz.
 * Ücretsiz/ücretli ayrımı mağazanın kendi veri dosyasından doğrulandı
 * (`plugin-store/data/plugins.json` → `price.amount`), aşağıda sabit liste
 * olarak duruyor ve kaynağı yazılı.
 *
 * FİYAT YAZILMAZ: fiyatlar kampanyaya ve kura göre değişiyor; sabit yazmak
 * kısa sürede yanlış bilgiye dönüşür. Hangisinin ücretsiz olduğu yazılır,
 * tutar yazılmaz — tutar mağazadaki ürün sayfasında.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const SLUG = "sketchup-eklentileri-best-sketchup-plugins";
const URL_YOL = `/${SLUG}.html`;
const MAGAZA = "https://www.bestsketchupplugins.com/tr/";

const dizin = path.join(KOK, "src", "content", "products");
const urunler = fs
  .readdirSync(dizin)
  .map((f) => JSON.parse(fs.readFileSync(path.join(dizin, f), "utf8")))
  .filter((u) => u.yayinda !== false);

const bul = (slug) => {
  const u = urunler.find((x) => x.slug === slug);
  if (!u) throw new Error(`ürün bulunamadı: ${slug}`);
  return u;
};
const ic = (slug) => `<a href="/eklenti/${slug}.html">${bul(slug).ad}</a>`;
const magaza = (slug) =>
  `<a href="${bul(slug).magazaUrl}" target="_blank" rel="noopener">${bul(slug).ad}</a>`;

/**
 * Ücretsiz araçlar — mağazanın veri dosyasından doğrulandı (2026-10-28):
 * `price.amount === 0`. Render Fun bu listede değil çünkü mağaza
 * kataloğunda değil; kendi sitesinde duruyor ve o da ücretsiz.
 */
const UCRETSIZ = ["cityfill", "soft-edge", "metraj", "panelcut-studio", "presentation-studio"];

const sketchupEklentileri = urunler.filter((u) =>
  (u.uyumluluk ?? []).some((x) => /SketchUp/i.test(x)),
);
const ucretliSayi = urunler.length - UCRETSIZ.length;

/** Ürünün öne çıkan iki rakamı — veriden, elle değil. */
const vurgu = (slug, n = 2) => (bul(slug).vurgular ?? []).slice(0, n).join(", ");

/** Önce/sonra kazancı — kaç kat. */
function kat(slug) {
  const k = bul(slug).kanit;
  if (!k?.oncekiDakika || !k?.sonrakiSaniye) return null;
  return Math.round((k.oncekiDakika * 60) / k.sonrakiSaniye);
}

/** Disipline göre öbekler. Her satırın görev tanımı yazıya özel. */
const GOREV = {
  archiflow: "planda duvarı kaydırdığınızda binayı yeniden kurar",
  roadflow: "güzergâh çizgisinden yolu, şevi ve metrajı üretir",
  cityfill: "vaziyet planındaki boş çevreyi dolgu yapılarıyla doldurur",
  "stairfun-studio": "kat yüksekliğinden merdiveni kurar, kural denetimi yapar",
  "ramp-studio": "güzergâhtan eğimi kontrollü rampayı korkuluğuyla çıkarır",
  floorstudio: "zemin kaplamasını odaya göre keser ve metrajını listeler",
  "wardrobe-studio": "ölçüden dolabı, teklifi ve CNC dosyalarını üretir",
  furnifun: "odayı ölçüsü değiştirilebilir mobilyayla donatır",
  "kitchenfun-studio": "mutfağı modüllerinden kurar, üretim çıktısını verir",
  cuisinefun: "mutfak tasarımını hazır modüllerle hızlandırır",
  "curtain-craft": "perdeyi sistem olarak kurar, kumaş metrajını birlikte verir",
  "dynamic-skirting": "süpürgelik ve kartonpiyeri köşeleriyle yerleştirir",
  "windowfun-studio": "ölçüden pencereyi ve teklif çıktılarını üretir",
  "door-studio": "seçtiğiniz kapıyı duvarı oyarak yerine oturtur",
  "kompozit-studio": "cepheyi panel ızgarasına böler ve metrajını çıkarır",
  "landscape-studio": "araziyi şekillendirir, bitkilendirmeyi alana dağıtır",
  "garden-wall-studio": "eğimi izleyen bahçe duvarını kapısıyla kurar",
  "soft-edge": "kenarları yuvarlar ve pah kırar, sonradan değiştirilebilir",
  "universal-converter": "dış formatları temizlenmiş geometriyle içeri alır",
};

const OBEKLER = [
  ["Mimari ve yapı kabuğu", ["archiflow", "roadflow", "cityfill", "stairfun-studio", "ramp-studio"]],
  ["İç mimari ve mobilya", ["floorstudio", "wardrobe-studio", "furnifun", "kitchenfun-studio", "cuisinefun", "curtain-craft", "dynamic-skirting"]],
  ["Doğrama", ["windowfun-studio", "door-studio"]],
  ["Cephe, peyzaj ve çevre", ["kompozit-studio", "landscape-studio", "garden-wall-studio"]],
  ["Yardımcı araçlar", ["soft-edge", "universal-converter"]],
];

const obekHtml = OBEKLER.map(([ad, slugs]) => {
  const satir = slugs
    .map((s) => {
      const bedava = UCRETSIZ.includes(s) ? ' <em class="bedava">ücretsiz</em>' : "";
      return `<li><strong>${ic(s)}</strong>${bedava} — ${GOREV[s]}.</li>`;
    })
    .join("\n    ");
  return `<h3>${ad}</h3>\n  <ul>\n    ${satir}\n  </ul>`;
}).join("\n\n  ");

/* ---------------------------------------------------------------- */
const GOVDE = `
<p>Yıllardır SketchUp için eklenti geliştiriyorum. Başlangıçta bunlar satılacak ürünler değildi — kendi projelerimde elle yapmaktan bıktığım işler için yazdığım küçük araçlardı. Zamanla sayıları arttı ve hepsini bir yerde toplamak gerekti. O yer <a href="${MAGAZA}" target="_blank" rel="noopener">Best SketchUp Plugins</a>.</p>

<p>Bu yazı sitede tam olarak ne olduğunu anlatıyor: kaç araç var, hangileri ücretsiz, hangi işi yapan hangisine bakmalı, paketler neye yarıyor ve nereden başlamak mantıklı.</p>

<h2>Neden ufuksen.com'dan ayrı bir site?</h2>

<p>Burası bir eğitim ve yazı arşivi. Eklentiler ise yazılım: sürüm çıkıyor, uyumluluk tablosu değişiyor, lisans ve güncelleme işleri var. Bunları blog arşivinin içine sıkıştırmak ikisine de zarar veriyordu.</p>

<p>Ayrıldıktan sonra pratik faydası şu oldu: bir eklentinin <strong>güncel sürümünü</strong>, <strong>hangi SketchUp sürümleriyle çalıştığını</strong> ve <strong>son değişiklikte neyin değiştiğini</strong> tek yerden görüyorsunuz. Burada ise ne işe yaradığını anlatan tanıtım sayfaları duruyor.</p>

<h2>Sitede ne var? Rakamlarla</h2>

<ul>
  <li><strong>${urunler.length} araç</strong> yayında.</li>
  <li>Bunların <strong>${sketchupEklentileri.length} tanesi SketchUp eklentisi</strong>; kalanı tarayıcıda çalışan web araçları.</li>
  <li><strong>${UCRETSIZ.length} tanesi ücretsiz</strong>, ${ucretliSayi} tanesi ücretli.</li>
  <li>Eklentiler <strong>SketchUp 2017–2026</strong> aralığını kapsıyor; her eklentinin kendi uyumluluk listesi sayfasında yazılı.</li>
  <li>Arayüz dili Türkçe ve İngilizce; ${ic("dynamic-skirting")} ile ${ic("curtain-craft")} ayrıca İspanyolca.</li>
</ul>

<p>Durum etiketleri süs değil: <strong>aktif</strong> kararlı sürüm, <strong>beta</strong> çalışıyor ama hâlâ değişiyor, <strong>alfa</strong> erken aşama. Bir aracın yarı yolda olduğunu söylemek, bitmiş gibi gösterip hayal kırıklığı yaratmaktan iyi.</p>

<h2>Ücretsiz araçlar: önce bunları deneyin</h2>

<p>Para vermeden başlayabileceğiniz ${UCRETSIZ.length} araç var. İkisi tam teşekküllü eklenti, üçü farklı iş görüyor:</p>

<ul>
  <li><strong>${ic("cityfill")}</strong> — ${vurgu("cityfill")}. Render'da binanızın çevresi boş kalmasın diye. Dolgu yapılarını tek tek indirip temizlemek ${bul("cityfill").kanit.oncekiDakika} dakika sürüyordu; burada ${bul("cityfill").kanit.sonrakiSaniye} saniye.</li>
  <li><strong>${ic("soft-edge")}</strong> — kenar yuvarlama ve pah kırma, sonradan değiştirilebilir kalıyor. Küçük ama her projede lazım olan türden.</li>
  <li><strong>${ic("metraj")}</strong> — ${vurgu("metraj")}. Tarayıcıda çalışıyor, kurulum istemiyor.</li>
  <li><strong>${ic("panelcut-studio")}</strong> — ${vurgu("panelcut-studio")}. Panel kesim listesi ve CNC DXF çıktısı. Alfa aşamasında.</li>
  <li><strong>${ic("presentation-studio")}</strong> — ${vurgu("presentation-studio")}. Render ve planlardan pafta seti kuruyor.</li>
</ul>

<p>Bunların dışında iki şey daha ücretsiz:</p>

<ul>
  <li><strong><a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a></strong> — SketchUp'ın içinde çalışan ışın izlemeli render motoru. Hesap ya da lisans anahtarı bile istemiyor. Mağaza kataloğunda değil, kendi sitesinde.</li>
  <li>Mağazadaki küçük <strong>web araçları</strong>: merdiven hesaplayıcı ve RAL/hex renk kodu aracı. Eklenti kurmadan, tarayıcıdan.</li>
</ul>

<h2>Ücretli eklentiler: hangi işi yapan hangisine baksın?</h2>

<p>Aşağıdaki bağlantılar bu sitedeki tanıtım sayfalarına gidiyor; her sayfanın sonunda eklentinin mağazadaki kendi sayfasına giden düğme var.</p>

  ${obekHtml}

<p>Tam liste için <a href="/sketchup-en-iyi-pluginleri.html">SketchUp En İyi Pluginleri</a> sayfasına da bakabilirsiniz.</p>

<h2>Bu araçlar gerçekten ne kazandırıyor?</h2>

<p>Her eklentinin sayfasında "önce/sonra" ölçümü var: aynı işi elle yapmak ne kadar sürüyor, eklentiyle ne kadar. Birkaç örnek:</p>

<table>
  <thead><tr><th>İş</th><th>Elle</th><th>Eklentiyle</th><th>Fark</th></tr></thead>
  <tbody>
    <tr><td>${ic("wardrobe-studio")} — dolap + kesim listesi</td><td>${bul("wardrobe-studio").kanit.oncekiDakika} dk</td><td>${bul("wardrobe-studio").kanit.sonrakiSaniye} sn</td><td>~${kat("wardrobe-studio")}×</td></tr>
    <tr><td>${ic("landscape-studio")} — arazi + bitkilendirme</td><td>${bul("landscape-studio").kanit.oncekiDakika} dk</td><td>${bul("landscape-studio").kanit.sonrakiSaniye} sn</td><td>~${kat("landscape-studio")}×</td></tr>
    <tr><td>${ic("kompozit-studio")} — cephe + metraj</td><td>${bul("kompozit-studio").kanit.oncekiDakika} dk</td><td>${bul("kompozit-studio").kanit.sonrakiSaniye} sn</td><td>~${kat("kompozit-studio")}×</td></tr>
    <tr><td>${ic("archiflow")} — duvarı taşı, model onarılsın</td><td>${bul("archiflow").kanit.oncekiDakika} dk</td><td>${bul("archiflow").kanit.sonrakiSaniye} sn</td><td>~${kat("archiflow")}×</td></tr>
  </tbody>
</table>

<p>Bu rakamlar bizim kendi ölçümlerimiz; bağımsız bir kuruluş doğrulamadı. Ama ölçüm yöntemi her eklentinin sayfasında yazılı — neyin neyle karşılaştırıldığını görebiliyorsunuz.</p>

<p>Asıl kazanç çoğu zaman süre değil: <strong>revizyon</strong>. Elle çizilen bir dolabı müşteri 20 cm genişletmek istediğinde iş baştan başlıyor. Parametrik kurulmuş bir dolapta ölçüyü değiştiriyorsunuz.</p>

<h2>Paketler: aracı değil iş akışını almak</h2>

<p>Eklentileri tek tek almak yerine disipline göre toplanmış üç paket var:</p>

<ul>
  <li><strong>İç Mimar Paketi</strong> — zemin, kapı, pencere, süpürgelik ve perde bir arada.</li>
  <li><strong>Arazi ve Çevre Paketi</strong> — yol, çevre yapıları, peyzaj ve bahçe duvarı.</li>
  <li><strong>Cephe Paketi</strong> — kompozit cephe ve doğrama.</li>
</ul>

<p>Mantığı şu: bir iç mimar zemini, dolabı ve perdeyi ayrı projelerde değil, aynı projede peş peşe çiziyor. Paket o sırayı kapsıyor ve ayrı ayrı almaktan ucuza geliyor. Güncel içerikler ve tutarlar <a href="${MAGAZA}" target="_blank" rel="noopener">mağaza sayfasında</a> — burada yazmıyorum çünkü kampanyaya göre değişiyorlar.</p>

<h2>Eklenti Laboratuvarı</h2>

<p>Henüz bitmemiş ama çalışır durumdaki araçlar için ayrı bir bölüm var. Şu an orada <strong>${ic("prefabrik-studio")}</strong> (${vurgu("prefabrik-studio", 1)}) ve <strong>${ic("panelcut-studio")}</strong> duruyor.</p>

<p>Burayı açmamın sebebi geri bildirim: bir araç en çok bu aşamada yön değiştirebiliyor. Bitmiş ürüne gelen öneri çoğu zaman geç kalmış oluyor.</p>

<h2>Dersler ve blog</h2>

<p>Mağazada her eklenti için kısa video dersler var — ${bul("soft-edge").ad}, ${bul("windowfun-studio").ad} ve ${bul("wardrobe-studio").ad} için 5–7 dakikalık anlatımlar. Ayrıca mimarlar, iç mimarlar, ahşap işçileri ve peyzaj mimarları için ayrı eklenti kılavuzları ve SketchUp iş akışı yazıları yayımlanıyor.</p>

<h2>Eklenti nasıl kurulur?</h2>

<p>Hepsi <code>.rbz</code> dosyası olarak geliyor. SketchUp'ta <em>Uzantılar → Extension Manager → Install Extension</em> deyip dosyayı seçiyor, sonra SketchUp'ı yeniden başlatıyorsunuz. Dosyası büyük olanlarda klasöre elle kopyalamak daha güvenli; üç yolun tamamını <a href="/sketchup-2026-profesyonel-egitim.html">SketchUp 2026 rehberinde</a> anlattım.</p>

<h2>Nereden başlamalı?</h2>

<p>Önerim sırayla şu:</p>

<ol>
  <li><strong>Ücretsiz bir tanesini kurun</strong> ve gerçek bir projede kullanın. ${ic("soft-edge")} ya da ${ic("cityfill")} iyi başlangıç.</li>
  <li><strong>Hangi işinizin tekrar ettiğini fark edin.</strong> Alınacak eklentiyi o fark seçer, liste değil.</li>
  <li><strong>Tek eklenti mi paket mi?</strong> İki ayrı iş kolunda çalışıyorsanız paket, tek bir dertte boğuluyorsanız tek eklenti.</li>
</ol>

<h2>Sık sorulan sorular</h2>

<h3>Eklentiler hangi SketchUp sürümlerinde çalışıyor?</h3>
<p>Çoğu SketchUp 2021–2026 aralığında. ${bul("wardrobe-studio").ad} 2017'ye kadar geriye çalışıyor; ${bul("windowfun-studio").ad} ve ${bul("dynamic-skirting").ad} ise 2024 ve sonrasını istiyor. Her eklentinin sayfasında kendi listesi var.</p>

<h3>Lisans kaç bilgisayarda çalışır?</h3>
<p>Bu eklentiye göre değişiyor ve satın alma sayfasında yazılı. Burada tek bir sayı vermek yanlış olur.</p>

<h3>Ücretsiz eklentiler kısıtlı sürüm mü?</h3>
<p>Hayır. ${bul("cityfill").ad} ve ${bul("soft-edge").ad} tam sürüm, deneme değil. Kullanımda süre ya da proje sınırı yok.</p>

<h3>Mac'te çalışıyor mu?</h3>
<p>Bir kısmı çalışıyor, bir kısmı yalnızca Windows. Eklentinin uyumluluk listesinde yazıyor; satın almadan önce oraya bakmak gerekiyor.</p>

<h3>Güncellemeler ücretli mi?</h3>
<p>Sürüm notları ve güncelleme koşulları mağazadaki ürün sayfasında. Eklentiler sık güncelleniyor — sürüm numaraları ve tarihleri orada görünüyor.</p>

<h2>Bağlantılar</h2>

<ul>
  <li><strong><a href="${MAGAZA}" target="_blank" rel="noopener">bestsketchupplugins.com</a></strong> — tüm araçlar, paketler, dersler ve blog.</li>
  <li><strong><a href="https://renderfun.com/" target="_blank" rel="noopener">renderfun.com</a></strong> — ücretsiz render motoru.</li>
  <li><a href="/sketchup-en-iyi-pluginleri.html">SketchUp En İyi Pluginleri</a> — bu sitedeki tanıtım sayfaları.</li>
  <li><a href="/sketchup-2026-profesyonel-egitim.html">SketchUp 2026 profesyonel eğitim rehberi</a> — kurulumdan sunuma.</li>
  <li><a href="/egitimler">Eğitim setleri</a> — SketchUp ve render motorları üzerine.</li>
</ul>

<p>Takıldığınız bir yer olursa <a href="/iletisim">iletişim sayfasından</a> yazabilirsiniz.</p>
`;

const kelime = GOVDE.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const kayit = {
  legacyId: 90003,
  slug: SLUG,
  legacyUrl: URL_YOL,
  url: URL_YOL,
  title: "Best SketchUp Plugins: Sitede Ne Var, Hangisi Ücretsiz?",
  excerpt: `${urunler.length} SketchUp aracı, ${UCRETSIZ.length} tanesi ücretsiz. Hangi işi yapan hangisine bakmalı, paketler neye yarıyor, nereden başlamalı?`,
  contentHtml: GOVDE.trim(),
  publishedAt: "2026-10-28 09:00:00",
  modifiedAt: "2026-10-28 09:00:00",
  status: "publish",
  featuredImage: null,
  inlineMedia: [],
  embeds: [],
  seo: {
    title: `Best SketchUp Plugins: ${urunler.length} Araç, ${UCRETSIZ.length}'i Ücretsiz | Ufuk Şen`,
    description: `Mimari, iç mimari, cephe ve peyzaj için ${urunler.length} SketchUp aracı. ${UCRETSIZ.length} tanesi ücretsiz. Hangisi ne yapıyor, paketler neye yarıyor?`,
    focusKeyword: "sketchup eklentileri",
    canonicalUrl: `https://www.ufuksen.com${URL_YOL}`,
    ogImage: null,
    noindex: false,
  },
  readingMinutes: Math.max(1, Math.round(kelime / 200)),
  migrationChecksum: crypto.createHash("sha256").update(GOVDE.trim(), "utf8").digest("hex"),
  author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
  categories: [
    { legacyId: 1172, name: "Sketchup", slug: "sketchup" },
    { legacyId: 1169, name: "3D Programlar", slug: "3d-programlar" },
  ],
  tags: [],
};

fs.writeFileSync(
  path.join(KOK, "src", "content", "posts", `${SLUG}.json`),
  JSON.stringify(kayit, null, 2) + "\n",
  "utf8",
);

console.log(`yazı            : ${URL_YOL}`);
console.log(`kelime          : ${kelime} | okuma: ${kayit.readingMinutes} dk`);
console.log(`araç            : ${urunler.length} (SketchUp eklentisi ${sketchupEklentileri.length})`);
console.log(`ücretsiz        : ${UCRETSIZ.length} | ücretli: ${ucretliSayi}`);
console.log(`iç bağlantı     : ${(GOVDE.match(/href="\/eklenti\//g) ?? []).length}`);
console.log(`mağaza bağlantısı: ${(GOVDE.match(/bestsketchupplugins\.com/g) ?? []).length}`);
console.log(`H2 / H3         : ${(GOVDE.match(/<h2/g) ?? []).length} / ${(GOVDE.match(/<h3/g) ?? []).length}`);
