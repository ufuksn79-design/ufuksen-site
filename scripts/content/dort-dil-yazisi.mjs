/**
 * "Eğitim Setlerimiz Artık Dört Dilde" yazısını üretir.
 *
 * Sayılar ve kurs listesi `src/content/courses.json`'dan OKUNUR, elle
 * yazılmaz — veri tazelendiğinde yazı da tazelenebilsin diye.
 *
 * Kaynak: Udemy eğitmen profili (bkz. courses.json içindeki `kaynak`).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const SLUG = "egitim-setleri-dort-dilde";
const URL_YOL = `/${SLUG}.html`;

const veri = JSON.parse(fs.readFileSync(path.join(KOK, "src", "content", "courses.json"), "utf8"));
const kurslar = veri.kurslar;

const DIL_ADI = { tr: "Türkçe", en: "İngilizce", es: "İspanyolca", de: "Almanca" };

const dilSayisi = {};
for (const k of kurslar) dilSayisi[k.dil] = (dilSayisi[k.dil] ?? 0) + 1;

const yabanci = kurslar.filter((k) => k.dil !== "tr");
const toplamDers = kurslar.reduce((t, k) => t + k.dersSayisi, 0);
const toplamSaat = kurslar.reduce((t, k) => t + k.saat, 0);

/** Yazılım etiketinden okunur ad. */
const YAZILIM_ADI = {
  sketchup: "SketchUp",
  "d5-render": "D5 Render",
  enscape: "Enscape",
  twinmotion: "Twinmotion",
  vray: "V-Ray",
  corona: "Corona Render",
  "unreal-engine": "Unreal Engine",
};

function satir(k) {
  const yazilim = k.yazilim.map((y) => YAZILIM_ADI[y] ?? y).join(", ") || "—";
  const puan = k.puan === null ? "yeni" : `${k.puan.toLocaleString("tr-TR")} (${k.yorumSayisi})`;
  return `<tr><td><a href="${k.url}" target="_blank" rel="noopener">${k.baslik}</a></td><td>${DIL_ADI[k.dil]}</td><td>${yazilim}</td><td>${k.dersSayisi} ders · ${k.saat.toLocaleString("tr-TR")} saat</td><td>${puan}</td></tr>`;
}

const dilOzet = Object.entries(dilSayisi)
  .sort((a, b) => b[1] - a[1])
  .map(([d, n]) => `<li><strong>${DIL_ADI[d]}</strong> — ${n} set</li>`)
  .join("\n  ");

const GOVDE = `
<p>Eğitim setlerimiz bir süredir yalnızca Türkçe değil. Udemy'deki <strong>${kurslar.length} eğitim setinin</strong> ${yabanci.length} tanesi Türkçe dışında bir dilde anlatılıyor: İngilizce, İspanyolca ve Almanca. Bu yazıda hangi setin hangi dilde olduğunu ve neden bu yola girdiğimizi anlatıyorum.</p>

<h2>Neden başka dillerde de anlatıyoruz?</h2>

<p>SketchUp ve render motorları dünyanın her yerinde aynı. Işığın duvardan sekmesi Ankara'da da Barselona'da da aynı fizik. Ama Türkçe anlatan bir eğitmenin ulaşabileceği kitle, dünyadaki mimarlık ve iç mimarlık öğrencilerinin çok küçük bir kısmı.</p>

<p>İlk İngilizce seti bir deneme olarak çektik. Gelen sorular Türkiye'den gelenlerle neredeyse aynıydı — "malzeme neden plastik görünüyor", "render neden bu kadar uzun sürüyor", "ışığı nereye koyayım". Sorun aynıysa anlatım da aynı olabilirdi; yalnızca dili değişiyordu. Sonrasında İspanyolca ve Almanca birer set daha ekledik.</p>

<h2>Hangi set hangi dilde?</h2>

<ul>
  ${dilOzet}
</ul>

<p>Türkçe dışındaki setlerin tamamı aşağıda. Puan sütununda parantez içindeki sayı yorum adedi; "yeni" yazanlar henüz yorum almamış, yeni yayımlanan setler.</p>

<table>
  <thead><tr><th>Eğitim seti</th><th>Dil</th><th>Yazılım</th><th>Kapsam</th><th>Puan</th></tr></thead>
  <tbody>
    ${yabanci.map(satir).join("\n    ")}
  </tbody>
</table>

<h2>Diller arasında ne değişiyor, ne değişmiyor?</h2>

<p><strong>Değişmeyen:</strong> ışık, malzeme ve kamera mantığı. Bir sahnede güneşin açısını neye göre seçtiğiniz, cam malzemenin kırılma değerini neden düşürdüğünüz, kamerayı göz hizasına neden indirdiğiniz — bunlar dile göre değişmiyor. Bu yüzden Türkçe bir setle başlayıp İngilizce bir setle devam edebilirsiniz; tekrar değil, derinleşme olur.</p>

<p><strong>Değişen:</strong> arayüz dili ve örnek sahne. İngilizce setlerde programın İngilizce arayüzü üzerinden gidiyoruz — çünkü o setleri izleyenlerin çoğu İngilizce arayüz kullanıyor. Türkçe setlerde Türkçe karşılıkları da söylüyoruz, çünkü Türkiye'de iki arayüz de yaygın.</p>

<h2>Hangi yazılımlar var?</h2>

<p>${kurslar.length} setin tamamında toplam <strong>${toplamDers} ders</strong> ve <strong>${toplamSaat.toLocaleString("tr-TR")} saat</strong> içerik var. Yazılım dağılımı şöyle:</p>

<ul>
  ${Object.entries(
    kurslar.reduce((acc, k) => {
      for (const y of k.yazilim) acc[y] = (acc[y] ?? 0) + 1;
      return acc;
    }, {}),
  )
    .sort((a, b) => b[1] - a[1])
    .map(([y, n]) => `<li><strong>${YAZILIM_ADI[y] ?? y}</strong> — ${n} set</li>`)
    .join("\n  ")}
</ul>

<p>Bir sette birden fazla yazılım geçebiliyor: örneğin SketchUp'tan D5 Render'a iş akışını anlatan set her ikisinde de sayılıyor.</p>

<h2>Nereden başlamalı?</h2>

<p>Hiç render almadıysanız Türkçe bir temel setle başlayın; arayüzle boğuşurken bir de yabancı dille uğraşmayın. Temeliniz varsa ve belirli bir motoru öğrenmek istiyorsanız, o motorun hangi dilde anlatıldığına bakmadan en kapsamlı seti seçin — ders sayısı ve süre sütunları bunun için var.</p>

<p>Ücretsiz başlamak isterseniz: kendi geliştirdiğimiz <a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a> render motorunun derslerini <a href="https://www.youtube.com/@sketchupturkiye" target="_blank" rel="noopener">SketchUp Türkiye</a> kanalında ücretsiz yayınlıyoruz. Motor da ücretsiz, dersler de.</p>

<p>Tüm setlerin listesi <a href="/egitimler">eğitimler sayfasında</a>; birebir ders için <a href="/iletisim">iletişim sayfasından</a> yazabilirsiniz.</p>
`;

const kelime = GOVDE.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const kayit = {
  legacyId: 90002,
  slug: SLUG,
  legacyUrl: URL_YOL,
  url: URL_YOL,
  title: "Eğitim Setlerimiz Artık Dört Dilde",
  excerpt: `Udemy'deki ${kurslar.length} eğitim setinin ${yabanci.length} tanesi İngilizce, İspanyolca ya da Almanca. Hangi set hangi dilde, diller arasında ne değişiyor?`,
  contentHtml: GOVDE.trim(),
  publishedAt: "2026-10-15 10:00:00",
  modifiedAt: "2026-10-15 10:00:00",
  status: "publish",
  featuredImage: null,
  inlineMedia: [],
  embeds: [],
  seo: {
    title: `Eğitim Setlerimiz Dört Dilde: ${kurslar.length} Set, ${toplamDers} Ders`,
    description: `SketchUp, D5 Render, Enscape, Twinmotion ve V-Ray eğitim setleri Türkçe, İngilizce, İspanyolca ve Almanca. Hangi set hangi dilde, tam liste.`,
    focusKeyword: "ingilizce sketchup render eğitimi",
    canonicalUrl: `https://www.ufuksen.com${URL_YOL}`,
    ogImage: null,
    noindex: false,
  },
  readingMinutes: Math.max(1, Math.round(kelime / 200)),
  migrationChecksum: crypto.createHash("sha256").update(GOVDE.trim(), "utf8").digest("hex"),
  author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
  categories: [
    { legacyId: 1172, name: "Sketchup", slug: "sketchup" },
    { legacyId: 538, name: "Render Motorları", slug: "render-motorlari" },
  ],
  tags: [],
};

fs.writeFileSync(
  path.join(KOK, "src", "content", "posts", `${SLUG}.json`),
  JSON.stringify(kayit, null, 2) + "\n",
  "utf8",
);

console.log(`yazi      : ${URL_YOL}`);
console.log(`kelime    : ${kelime} | okuma: ${kayit.readingMinutes} dk`);
console.log(`dil       : ${Object.entries(dilSayisi).map(([d, n]) => `${DIL_ADI[d]}:${n}`).join(", ")}`);
console.log(`tabloda   : ${yabanci.length} set`);
