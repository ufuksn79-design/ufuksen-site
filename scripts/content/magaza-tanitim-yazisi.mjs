/**
 * "SketchUp Eklentilerimiz Tek Adreste" — bestsketchupplugins.com tanıtım yazısı.
 *
 * Sayılar `src/content/products/*.json` dosyalarından OKUNUR, elle yazılmaz.
 * Ürün sayısı değişince yazı da değişsin diye.
 *
 * FİYAT YOK: fiyatlar kampanyaya ve kura göre değişiyor; sabit yazmak kısa
 * sürede yanlış bilgi üretir (courses.json'daki aynı karardan devam).
 *
 * Mağaza hakkındaki bilgiler bestsketchupplugins.com/tr/ sayfasından okundu
 * (2026-10-17): 20 araç, SketchUp 2021–2026, TR/EN arayüz, üç paket,
 * Eklenti Laboratuvarı, ücretsiz araçlar.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const SLUG = "sketchup-eklentileri-best-sketchup-plugins";
const URL_YOL = `/${SLUG}.html`;
const MAGAZA = "https://www.bestsketchupplugins.com/tr/";

/* ---------------------------------------------------------------- */
/* Ürün verisi                                                       */
/* ---------------------------------------------------------------- */
const dizin = path.join(KOK, "src", "content", "products");
const urunler = fs
  .readdirSync(dizin)
  .map((f) => JSON.parse(fs.readFileSync(path.join(dizin, f), "utf8")))
  .filter((u) => u.yayinda !== false);

const sketchupEklentileri = urunler.filter((u) =>
  (u.uyumluluk ?? []).some((x) => /SketchUp/i.test(x)),
);
const aktif = sketchupEklentileri.filter((u) => u.durum === "aktif");

/** Eklentiyi kendi sitemizdeki detay sayfasına bağla. */
const ic = (u) => `<a href="/eklenti/${u.slug}.html">${u.ad}</a>`;

function bul(slug) {
  const u = urunler.find((x) => x.slug === slug);
  if (!u) throw new Error(`ürün bulunamadı: ${slug}`);
  return u;
}

/** Yazıya özel kısa görev tanımları — ürün `ozet` alanının tekrarı değil. */
const GOREV = {
  "archiflow": "plan üzerinde duvarı kaydırdığınızda binayı yeniden kurar",
  "roadflow": "güzergâh çizgisinden yolu, şevi ve metrajı üretir",
  "cityfill": "vaziyet planındaki boş alanı dolgu yapılarıyla doldurur",
  "stairfun-studio": "kat yüksekliğinden merdiveni kurar ve kural denetimi yapar",
  "ramp-studio": "güzergâhtan eğimi kontrollü rampayı korkuluğuyla çıkarır",
  "floorstudio": "zemin kaplamasını odaya göre keser ve metrajını listeler",
  "wardrobe-studio": "ölçüden dolabı, teklifi ve CNC dosyalarını üretir",
  "furnifun": "odayı ölçüsü değiştirilebilir mobilyayla donatır",
  "curtain-craft": "perdeyi sistem olarak kurar, kumaş metrajını birlikte verir",
  "dynamic-skirting": "süpürgelik ve kartonpiyeri köşeleriyle birlikte yerleştirir",
  "windowfun-studio": "ölçüden pencereyi ve teklif çıktılarını birlikte üretir",
  "door-studio": "seçtiğiniz kapıyı duvarı oyarak yerine oturtur",
  "kompozit-studio": "cepheyi panel ızgarasına böler ve metrajını çıkarır",
  "landscape-studio": "araziyi şekillendirir, bitkilendirmeyi alana dağıtır",
  "garden-wall-studio": "eğimi izleyen bahçe duvarını kapısıyla birlikte kurar",
  "soft-edge": "kenarları yuvarlar ve pah kırar, sonradan değiştirilebilir",
  "universal-converter": "dış formatları temizlenmiş geometriyle içeri alır"
};

/** Disipline göre öbekler — hangi işi yapan hangi eklentiye baksın. */
const OBEKLER = [
  {
    ad: "Mimari ve yapı kabuğu",
    slugs: ["archiflow", "roadflow", "cityfill", "stairfun-studio", "ramp-studio"],
  },
  {
    ad: "İç mimari",
    slugs: ["floorstudio", "wardrobe-studio", "furnifun", "curtain-craft", "dynamic-skirting"],
  },
  {
    ad: "Doğrama ve yapı elemanı",
    slugs: ["windowfun-studio", "door-studio"],
  },
  {
    ad: "Cephe, peyzaj ve çevre",
    slugs: ["kompozit-studio", "landscape-studio", "garden-wall-studio"],
  },
  {
    ad: "Yardımcı araçlar",
    slugs: ["soft-edge", "universal-converter"],
  },
];

const obekHtml = OBEKLER.map((o) => {
  const satir = o.slugs
    .map((s) => {
      const u = bul(s);
      /**
       * Ürünün kendi `ozet` cümlesi KULLANILMIYOR: o cümle ürün kartında,
       * detay sayfasında ve ana sayfada zaten geçiyor. Burada aynı işi
       * anlatan ayrı bir cümle var — aynı sitede dört yerde aynı metin
       * hem okura hem arama motoruna kötü geliyor.
       */
      return `<li><strong>${ic(u)}</strong> — ${GOREV[s]}.</li>`;
    })
    .join("\n    ");
  return `<h3>${o.ad}</h3>\n  <ul>\n    ${satir}\n  </ul>`;
}).join("\n\n  ");

/* ---------------------------------------------------------------- */
/* Gövde                                                             */
/* ---------------------------------------------------------------- */
const GOVDE = `
<p>Yıllardır SketchUp için eklenti geliştiriyorum. Başlangıçta bunlar satılacak ürünler değildi: kendi projelerimde elle yapmaktan bıktığım işler için yazdığım küçük araçlardı. Zamanla sayıları arttı ve bir noktada "bunları bir yerde toplamak lazım" oldu. O yer <a href="${MAGAZA}" target="_blank" rel="noopener">Best SketchUp Plugins</a>.</p>

<p>Bu yazı, orada ne olduğunu ve hangi işi yapanın hangi eklentiye bakması gerektiğini anlatıyor.</p>

<h2>Neden ayrı bir site?</h2>

<p>ufuksen.com bir eğitim ve yazı arşivi. Eklentiler ise yazılım: sürüm çıkıyor, uyumluluk tablosu değişiyor, lisans ve güncelleme işleri var. Bunları blog arşivinin içine sıkıştırmak ikisine de zarar veriyordu. Eklentiler kendi sitesine taşındı; burada tanıtım ve kullanım yazıları kaldı.</p>

<p>Pratikte şu işinize yarıyor: bir eklentinin güncel sürümünü, hangi SketchUp sürümleriyle çalıştığını ve neyi değiştirdiğini tek yerden görüyorsunuz.</p>

<h2>Sitede ne var?</h2>

<p>Şu an <strong>${sketchupEklentileri.length} SketchUp eklentisi</strong> yayında; bunların ${aktif.length} tanesi kararlı sürümde, geri kalanı beta ya da alfa olarak işaretli. Beta ve alfa etiketleri süs değil: o eklentiler hâlâ değişiyor, bunu baştan söylüyoruz.</p>

<p>Eklentilerin tamamı <strong>SketchUp 2021–2026</strong> aralığını hedefliyor. Bazıları daha dar bir aralıkta (örneğin 2024 ve sonrası), ${ic(bul("wardrobe-studio"))} ise 2017'ye kadar geriye çalışıyor. Her eklentinin kendi sayfasında uyumluluk listesi yazılı — tahmin etmenize gerek yok.</p>

<p>Arayüz dili Türkçe ve İngilizce. ${ic(bul("dynamic-skirting"))} ve ${ic(bul("curtain-craft"))} ayrıca İspanyolca arayüz sunuyor.</p>

<h2>Hangi işi yapan hangisine baksın?</h2>

  ${obekHtml}

<p>Bağlantılar bu sitedeki tanıtım sayfalarına gidiyor; her sayfanın sonunda eklentinin mağazadaki kendi sayfasına giden düğme var. Tam liste için <a href="/sketchup-en-iyi-pluginleri.html">SketchUp En İyi Pluginleri</a> sayfasına da bakabilirsiniz.</p>

<h2>Önce ücretsiz denemek isterseniz</h2>

<p>Para vermeden başlayabileceğiniz birkaç şey var:</p>

<ul>
  <li><strong>${ic(bul("cityfill"))}</strong> — binanızın çevresini hazır yapı stoğuyla dolduruyor; ücretsiz.</li>
  <li><strong>${ic(bul("soft-edge"))}</strong> — köşe yuvarlama ve pah kırma; ücretsiz.</li>
  <li><strong>${ic(bul("metraj"))}</strong> — tarayıcıda çalışan metraj ve maliyet aracı; kurulum istemiyor.</li>
  <li><strong><a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a></strong> — SketchUp'ın içinde çalışan ücretsiz render motoru. Lisans anahtarı bile istemiyor.</li>
</ul>

<p>Sitede ayrıca küçük hesap araçları var: merdiven hesaplayıcı ve RAL/hex renk kodu aracı. Eklenti kurmadan, tarayıcıdan kullanılıyorlar.</p>

<h2>Paketler: aracı değil, iş akışını almak</h2>

<p>Eklentileri tek tek almak yerine disipline göre toplanmış paketler de var: <strong>İç Mimar Paketi</strong>, <strong>Arazi ve Çevre Paketi</strong> ve <strong>Cephe Paketi</strong>. Mantığı şu — bir iç mimar zemini, dolabı ve mobilyayı ayrı ayrı değil, aynı projede peş peşe çiziyor. Paket o sırayı kapsıyor ve ayrı ayrı almaktan ucuza geliyor.</p>

<p>Güncel paket içerikleri ve fiyatlar <a href="${MAGAZA}" target="_blank" rel="noopener">mağaza sayfasında</a>; burada yazmıyorum çünkü kampanyaya göre değişiyorlar.</p>

<h2>Eklenti Laboratuvarı</h2>

<p>Henüz bitmemiş ama çalışır durumdaki araçlar için ayrı bir bölüm var. Şu an orada <strong>${ic(bul("prefabrik-studio"))}</strong> (çelik yapı ve metraj) ve <strong>${ic(bul("panelcut-studio"))}</strong> (panel kesim listesi ve CNC DXF çıktısı) duruyor.</p>

<p>Burayı açmamın sebebi basit: bir aracın yarı yolda olduğunu söylemek, bitmiş gibi gösterip hayal kırıklığı yaratmaktan iyidir. Geri bildirim de en çok bu aşamada işe yarıyor.</p>

<h2>Eklenti nasıl kurulur?</h2>

<p>Hepsi <code>.rbz</code> dosyası olarak geliyor. SketchUp'ta <em>Uzantılar → Extension Manager → Install Extension</em> deyip dosyayı seçiyorsunuz, sonra SketchUp'ı yeniden başlatıyorsunuz. Dosyası büyük olanlarda klasöre elle kopyalamak daha güvenli; adımları <a href="/sketchup-2026-profesyonel-egitim.html">SketchUp 2026 rehberinde</a> anlattım.</p>

<h2>Nereden başlamalı?</h2>

<p>Önerim: önce ücretsiz olanlardan birini kurun ve bir projede gerçekten kullanın. Eklenti mantığı oturduktan sonra hangi işinizin tekrar ettiğini fark edersiniz — alınacak eklentiyi de o fark seçer, liste değil.</p>

<p>Tüm eklentiler, güncel sürümler ve paketler için: <a href="${MAGAZA}" target="_blank" rel="noopener">bestsketchupplugins.com</a></p>
`;

const kelime = GOVDE.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const kayit = {
  legacyId: 90003,
  slug: SLUG,
  legacyUrl: URL_YOL,
  url: URL_YOL,
  title: "SketchUp Eklentilerimiz Tek Adreste: Best SketchUp Plugins",
  excerpt: `${sketchupEklentileri.length} SketchUp eklentisi, üç paket ve ücretsiz araçlar artık kendi sitesinde. Hangi işi yapan hangi eklentiye bakmalı?`,
  contentHtml: GOVDE.trim(),
  publishedAt: "2026-10-17 09:00:00",
  modifiedAt: "2026-10-17 09:00:00",
  status: "publish",
  featuredImage: null,
  inlineMedia: [],
  embeds: [],
  seo: {
    title: `SketchUp Eklentileri: ${sketchupEklentileri.length} Araç Tek Adreste | Best SketchUp Plugins`,
    description: `Mimari, iç mimari, cephe ve peyzaj için ${sketchupEklentileri.length} SketchUp eklentisi, üç paket ve ücretsiz araçlar. Hangi işi yapan hangisine bakmalı?`,
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

const icBaglanti = (GOVDE.match(/href="\/eklenti\//g) ?? []).length;
const disBaglanti = (GOVDE.match(/bestsketchupplugins\.com/g) ?? []).length;

console.log(`yazi            : ${URL_YOL}`);
console.log(`kelime          : ${kelime} | okuma: ${kayit.readingMinutes} dk`);
console.log(`SketchUp eklentisi: ${sketchupEklentileri.length} (aktif ${aktif.length})`);
console.log(`iç bağlantı     : ${icBaglanti} eklenti sayfası`);
console.log(`mağaza bağlantısı: ${disBaglanti}`);
