/**
 * "Dolap Sihirbazı'nı Neden Yazdım?" — ufuksen.com için birinci ağızdan yazı.
 *
 * Taslak: docs/content/taslak-dolap-sihirbazi-neden-yazdim.md
 * Kullanıcı 16 Kasım 2026'da "boş geç yayınla" dedi: taslaktaki ‹…› anı
 * boşlukları (somut yanlış kesim örneği, eski/yeni süre, kapanış cümlesi)
 * metinden çıkarıldı — uydurma anı yazılmadı.
 *
 * KURALLAR (bellek: dolapsihirbazi-blog-kurallari):
 *   - Açı bu siteye özel: Ufuk Şen'in kendi hikâyesi. mimari3d.com iç mimar,
 *     sketchupturkiye.com 3B modelleyen okur gözüyle yazacak.
 *   - 27 anahtar kelimenin hepsi doğal cümle içinde geçer (altta sayılıyor).
 *   - dolapsihirbazi.com'a 4 bağlantı, dördü FARKLI kelimenin üstünde.
 *   - Fiyat rakamı yazılmaz; "fiyat" geçer, siteye yönlendirilir.
 *   - Rakip program adı yazılmaz.
 *
 * Teknik cümlelerin kaynağı: dolap-sihirbazi-masaustu/docs/* ve
 * dolap-sihirbazi/docs/OZELLIKLER.md (kesim listesinde damar ve bant,
 * 245 modül, 386 kapak, demo 5 gün).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const SLUG = "dolap-sihirbazini-neden-yazdim";
const URL_YOL = `/${SLUG}.html`;
const SITE = "https://dolapsihirbazi.com/";
const DEMO = "https://dolapsihirbazi.com/demo/";

const GOVDE = `
<p>Yıllardır 3B çiziyorum ve anlatıyorum. Mutfak dolabı tasarımı tarafında da epey iş gördüm; ama beni bir program yazmaya iten şey çizim değil, çizimden sonrası oldu.</p>

<p>Çizim biter, model güzeldir, müşteri beğenir. Sonra o güzel model atölyeye bir şekilde "aktarılır": biri oturur, ölçüleri tek tek tabloya yazar. Kayıp tam burada başlar. Ekrandaki dolap ile kesilen dolap artık iki ayrı şeydir ve aralarındaki fark yalnızca kimsenin hata yapmamasına bağlıdır.</p>

<h2>Atölyede hatalar hep aynı üç yerden çıkıyor</h2>

<p>Yıllar içinde şunu gördüm: yanlış kesilen panellerin sebebi neredeyse hiç "ustanın beceriksizliği" değil. Üç yerden çıkıyor.</p>

<ol>
  <li><strong>Listeyi elle yazmak.</strong> Dolap doğrudur, kesim listesi yazılırken bir rakam kayar. 720 yerine 702 yazılır ve kimse fark etmez — ta ki panel tezgâha gelene kadar.</li>
  <li><strong>Kenar bandı payının unutulması.</strong> Bant düşülmemiş bir panel, kapak takılınca birkaç milim fazla gelir. Küçük bir sayı, görünür bir hata.</li>
  <li><strong>Damar yönünün listede olmaması.</strong> Kesimi yapan kişi damar yönünü bilmiyorsa, iki kapak yan yana geldiğinde desen tutmaz. Malzeme sağlamdır, ölçü doğrudur, ama iş göze batar.</li>
</ol>

<p>Üçü de "dikkat" meselesi gibi görünür. Değil. Üçü de <strong>bilgi taşıma</strong> meselesidir: bilgi bir yerden başka yere elle taşınıyorsa, er geç bir tanesi yolda düşer.</p>

<p>Yazmak istediğim şey bu yüzden bir çizim programı değildi. Bilgiyi hiç taşımayan bir program istedim: dolabı kurduğun yerle, kesimin çıktığı yer aynı olsun.</p>

<h2>Parametrik olmasının asıl sebebi: müşteri fikir değiştiriyor</h2>

<p>Programın temeline <a href="${SITE}" target="_blank" rel="noopener">parametrik dolap tasarımı</a> koymamın sebebi teknik bir heves değil, hayatın kendisi: müşteri fikir değiştirir. Dolap 10 cm kısalır, çekmece sayısı ikiden üçe çıkar, kapak modeli değişir.</p>

<p>Elle çalışırken bu cümlelerin her biri ayrı bir iştir. Parametrik ölçüyle çalışırken sadece bir sayıdır: yazarsın, dolap kendini yeniden kurar. Panellerin kesim ölçüsü, delik yerleri, menteşe adedi, bant metrajı — hepsi o sayıdan yeniden hesaplanır.</p>

<p>İşin özeti şu: hızlı dolap tasarımı dediğimiz şey aslında "ikinci kez çizmemek"tir. Zamandan tasarruf ettiren dolap tasarımı da bundan ibarettir — ilk çizimi hızlandırmaktan çok, revizyonu bedava hâle getirmek.</p>

<h2>"Program öğrenmeyelim, sürükleyip bırakalım"</h2>

<p>Geliştirirken öğrendiğim ikinci şey şu oldu: usta, program öğrenmek istemiyor. Haklı da. Onun işi dolap yapmak.</p>

<p>Bu yüzden en çok uğraştığım kısım, boş ekrandan dolaplı bir mutfağa geçişi kısaltmak oldu. Bugün program <a href="${SITE}" target="_blank" rel="noopener">sürükle-bırak modüller</a> ile çalışıyor: 245 hazır modülden birini tutup duvara bırakıyorsun. Bıraktığın şey bir resim değil — yan paneli, tablası, rafı, kapağı ayrı ayrı gerçek parçalar. Yani bıraktığın anda kesilebilir hâle geliyor.</p>

<p>Kapak tarafında 386 kapak modeli var; kapak stilleri arasında gezinirken ölçü değişmiyor, tasarım kapağın kendi ölçüsüne oturuyor. Kulp seçimi, kaplama değişimi, gövde ve kapak rengi — hiçbiri modeli bozmuyor, çünkü hepsi aynı parametrik yapının üstünde duruyor.</p>

<p>Buna dinamik mutfak demek de mümkün, akıllı mutfak demek de. Ben daha çok şöyle düşünüyorum: mutfağın kendisi programın içinde canlı duruyor, dokunduğun her yer kendi sonucunu biliyor.</p>

<h2>Ayarların bir kez girilmesi</h2>

<p>Üçüncü öğrendiğim şey, her atölyenin kendi standardı olduğuydu. Birinin kullandığı bant kalınlığı, diğerinin raf payı, bir başkasının gövde bağlantısı aynı değil.</p>

<p>O yüzden programda atölyenin kendi değerlerini girdiği bir dinamik ayarlar sayfası var: oraya bir kez yazıyorsun, bütün projelerde o değerler geçerli oluyor. Fiyat tarafı da aynı mantıkla çalışıyor — birim fiyatları sen giriyorsun, teklif senin rakamlarınla çıkıyor.</p>

<h2>Esas mesele: CNC'ye nasıl gittiği</h2>

<p>Program bir dolap tasarım stüdyosu olarak kalsaydı yarım iş olurdu. Benim derdim en baştan beri şuydu: ekrandaki dolap, makineden aynı şekilde çıksın. Bugün tek projeden şunlar çıkıyor:</p>

<ul>
  <li><strong>Otomatik kesim listesi</strong> — kenar bandı ve damar yönü sütunlarıyla birlikte. Yukarıda saydığım üç hatadan ikisi, listeyi elle yazmayı bıraktığın anda ortadan kalkıyor.</li>
  <li><strong>Otomatik levha yerleşim şeması</strong> — <a href="${SITE}" target="_blank" rel="noopener">levha nesting</a> işini program yapıyor; hangi parçanın hangi levhadan çıktığını ve levhanın ne kadarının kullanıldığını gösteriyor.</li>
  <li><strong>CNC/DXF ve NC dosyaları</strong> — makineye gidecek hâliyle. "CNC'ye aktar" dediğinde aradaki çeviri adımı yok.</li>
  <li><strong>Etiket ve teklif</strong> — montajcıya ve müşteriye giden kâğıtlar da aynı projeden.</li>
</ul>

<p>CNC ile dolap üretimi yapan bir atölye için kritik olan şey hatasız CNC kesimi, yani listedeki ölçüyle makinedeki ölçünün birbirini tutması. Dolap Sihirbazı'na özel CNC kesim işleme sistemi tam olarak bunun için var: parçayı program kendisi diziyor, delikleri kendisi sıralıyor, ters çevrilmesi gereken parçayı kendisi aynalıyor. Ayrı bir CNC yazılımı (CAM) öğrenip aradaki dosyayı elden geçirmek zorunda değilsin.</p>

<h2>Bir de şunu öğrendim: program başka programa muhtaç olmamalı</h2>

<p>İlk sürümler SketchUp içinde çalışıyordu. Oradan aldığım en net geri bildirim şuydu: "ben SketchUp kullanmıyorum ki."</p>

<p>Bugün Dolap Sihirbazı kendi başına çalışan bir Windows masaüstü programı. Bilgisayarında başka bir çizim programının kurulu olması gerekmiyor. Render de içinde — müşteriye gösterilecek görsel için ikinci bir program açmıyorsun.</p>

<h2>Denemek isteyene</h2>

<p>Programı anlatmanın en kötü yolu anlatmak; en iyisi açıp bir dolap kurmak. Onun için <a href="${DEMO}" target="_blank" rel="noopener">5 günlük ücretsiz demo</a> var: tasarım, 3B ve render tarafı açık, üretim çıktıları tam sürümde. Fiyat bilgisi ve sürümler için de aynı sitedeki ürün sayfasına bakabilirsin.</p>
`;

const kelime = GOVDE.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const kayit = {
  legacyId: 90040,
  slug: SLUG,
  legacyUrl: URL_YOL,
  url: URL_YOL,
  dil: "tr",
  alternatif: null,
  title: "Dolap Sihirbazı'nı Neden Yazdım?",
  excerpt:
    "Atölyede yanlış kesilen paneller hep aynı üç yerden çıkıyordu: elle yazılan liste, unutulan kenar bandı payı, listede olmayan damar yönü. Program bu yüzden var.",
  contentHtml: GOVDE.trim(),
  publishedAt: "2026-11-16 10:00:00",
  modifiedAt: "2026-11-16 10:00:00",
  status: "publish",
  /** Uydurma kapak konmadı; bu yazıya uyan bir görsel arşivde yok. */
  featuredImage: null,
  inlineMedia: [],
  embeds: [],
  seo: {
    title: "Dolap Sihirbazı'nı Neden Yazdım? | Ufuk Şen",
    description:
      "Elle yazılan kesim listesi, unutulan kenar bandı payı, listede olmayan damar yönü: bir dolap tasarım programını yazmaya iten üç hata ve öğrendiklerim.",
    focusKeyword: "parametrik dolap tasarımı",
    canonicalUrl: `https://www.ufuksen.com${URL_YOL}`,
    ogImage: null,
    noindex: false,
  },
  readingMinutes: Math.max(1, Math.round(kelime / 200)),
  migrationChecksum: crypto.createHash("sha256").update(GOVDE.trim(), "utf8").digest("hex"),
  author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
  categories: [{ legacyId: 1169, name: "3D Programlar", slug: "3d-programlar" }],
  tags: [],
};

fs.writeFileSync(
  path.join(KOK, "src", "content", "posts", `${SLUG}.json`),
  JSON.stringify(kayit, null, 2) + "\n",
  "utf8",
);

/** Kelime denetimi — biri eksikse betik durur, sessizce eksik yayımlanmaz. */
const KELIMELER = [
  "parametrik dolap tasarımı", "hızlı dolap tasarımı", "zamandan tasarruf ettiren dolap tasarımı",
  "hatasız CNC kesimi", "Dolap Sihirbazı'na özel CNC kesim işleme sistemi", "dinamik mutfak",
  "akıllı mutfak", "dinamik ayarlar sayfası", "mutfak dolabı tasarımı", "CNC'ye aktar",
  "CNC ile dolap üretimi", "dolap tasarım stüdyosu", "otomatik kesim listesi",
  "otomatik levha yerleşim şeması", "dolap", "kesim listesi", "levha nesting", "kapak stilleri",
  "kulp", "kaplama değişimi", "sürükle-bırak modüller", "parametrik ölçü", "fiyat", "CNC/DXF",
  "CNC yazılımı (CAM)", "kenar bandı", "damar yönü",
];
const duz = GOVDE.toLocaleLowerCase("tr");
const eksik = KELIMELER.filter((k) => !duz.includes(k.toLocaleLowerCase("tr")));
if (eksik.length) throw new Error(`eksik anahtar kelime: ${eksik.join(" · ")}`);

const baglar = [...GOVDE.matchAll(/<a href="(https:\/\/dolapsihirbazi[^"]+)"[^>]*>([^<]+)<\/a>/g)];
const cipalar = baglar.map((m) => m[2]);
if (new Set(cipalar).size !== cipalar.length) throw new Error("aynı kelime iki kez bağlandı");

const say = (d) => (GOVDE.match(d) ?? []).length;
console.log(`yazı          : ${URL_YOL}`);
console.log(`kelime        : ${kelime} | okuma: ${kayit.readingMinutes} dk`);
console.log(`H2            : ${say(/<h2/g)}`);
console.log(`anahtar kelime: ${KELIMELER.length}/${KELIMELER.length} ✓`);
console.log(`bağlantı      : ${cipalar.length} — ${cipalar.join(" · ")}`);
console.log(`fiyat rakamı  : ${/\d[\d.]*\s*(TL|₺|\$)/.test(GOVDE) ? "VAR (HATA)" : "yok ✓"}`);
