/**
 * GÖREV 1b — üç eğitim yazısını alt niyete taşır (18 Kasım 2026 SEO görevi).
 *
 * Yazılar SİLİNMEZ, yönlendirilmez. Yalnız başlık / H1 / açıklama hedef
 * sayfalarla çakışmayacak şekilde değişir, başa iki cümlelik güncel giriş ve
 * "birebir öğrenmek isterseniz" kutusu, sona ana rehber bağlantısı eklenir.
 *
 * Hedef haritası:
 *   "sketchup özel ders / ders / kurs"  -> /sketchup-ozel-ders
 *   "sketchup eğitim / eğitimi / öğren" -> /sketchup-2026-profesyonel-egitim.html
 *   "ücretsiz sketchup eğitimi"         -> /ucretsiz-sketchup-egitimi.html
 *   "sketchup eğitim seti"              -> /egitimler
 *
 * dateModified: içerik gerçekten değiştiği için güncelleniyor (giriş, kutu,
 * kapanış bağlantısı eklendi).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const REHBER = "/sketchup-2026-profesyonel-egitim.html";
const OZEL = "/sketchup-ozel-ders";
const TARIH = "2026-11-18 10:00:00";

/** Her yazının başına giren birebir ders kutusu — anchor metni yazıdan yazıya değişir. */
const kutu = (cipa, cumle) =>
  `<aside class="ders-kutusu"><p><strong>Birebir öğrenmek ister misiniz?</strong> ${cumle} <a href="${OZEL}">${cipa}</a></p></aside>`;

const ISLER = [
  {
    dosya: "sketchup-egitimi.json",
    title: "SketchUp Öğrenmeye Nereden Başlanır? Adım Adım Sıralama",
    seoTitle: "SketchUp Öğrenmeye Nereden Başlanır? Adım Adım",
    seoDesc:
      "SketchUp'a sıfırdan başlayanlar için sıralama: hangi araç önce, hangi konu sonra, nereden pratik yapılır ve ilk projeye ne zaman geçilir.",
    keyword: "sketchup öğrenmeye nereden başlanır",
    giris: `<p>Bu sayfa "SketchUp'a nereden başlamalıyım?" sorusunun cevabı: konuları hangi sırayla öğrenmek gerektiğini ve her adımda nereye bakılacağını anlatıyor.</p>
<p>Ücretsiz kaynaklarla kendi başınıza ilerlemek isterseniz aşağıdaki sıra yeterli; daha hızlı ilerlemek isterseniz birebir ders de bir seçenek.</p>`,
    cipa: "SketchUp özel ders sayfasına bakın",
    cumle: "Sıralamayı kendi işinize göre kurmak ve takıldığınız yerde soru sormak için:",
    kapanis: `<p>Konuların tamamını tek yerde toplayan güncel rehber: <a href="${REHBER}">SketchUp 2026 profesyonel eğitim rehberi</a>. Ücretsiz video derslere <a href="/ucretsiz-sketchup-egitimi.html">ücretsiz SketchUp eğitimi</a> sayfasından ulaşabilirsiniz.</p>`,
  },
  {
    dosya: "sketchup-egitim.json",
    title: "SketchUp Eğitim Listesi: Konulara Göre Dersler",
    seoTitle: "SketchUp Eğitim Listesi: Konulara Göre Dersler",
    seoDesc:
      "SketchUp derslerinin konu konu listesi: modelleme, eklentiler, render ve sunum. Hangi konuda ne var, hangi yazıdan devam edilir?",
    keyword: "sketchup eğitim listesi",
    giris: `<p>Bu sayfa bir liste: SketchUp derslerini konu başlıklarına göre topluyor, her başlıkta nereden devam edileceğini gösteriyor.</p>
<p>Sıfırdan başlıyorsanız önce sıralamaya bakmak daha iyi — hangi konunun hangisinden sonra geldiğini <a href="/sketchup-egitimi.html">SketchUp öğrenmeye nereden başlanır</a> sayfasında yazdım.</p>`,
    cipa: "online SketchUp dersi",
    cumle: "Listeyi tek tek takip etmek yerine doğrudan kendi projenizle ilerlemek isterseniz:",
    kapanis: `<p>Bütün konuları sıralı ve güncel hâliyle anlatan ana rehber: <a href="${REHBER}">SketchUp 2026 profesyonel eğitim</a>. Udemy'deki setler için <a href="/egitimler">eğitim setleri sayfasına</a> bakabilirsiniz.</p>`,
  },
  {
    dosya: "sketchup-egitim-seti.json",
    title: "SketchUp Eğitim Setleri: Udemy ve Ücretsiz Seçenekler",
    seoTitle: "SketchUp Eğitim Setleri: Udemy ve Ücretsiz Seçenekler",
    seoDesc:
      "SketchUp eğitim setleri: Udemy'deki setler, YouTube'daki ücretsiz dersler ve birebir ders. Hangisi kime uygun, nereden başlanır?",
    keyword: "sketchup eğitim seti",
    giris: `<p>Bu sayfa eğitim seti seçenekleri üzerine: Udemy'deki setler, YouTube'daki ücretsiz dersler ve birebir ders arasındaki farkı anlatıyor.</p>
<p>Aşağıdaki metin SketchUp Türkiye'nin ilk yıllarından kalma; seçenekleri bugünkü hâliyle görmek için <a href="/egitimler">eğitim setleri sayfasına</a> bakın.</p>`,
    cipa: "birebir SketchUp eğitimi",
    cumle: "Hazır set yerine kendi hızınızda ve kendi projeniz üzerinde ilerlemek isterseniz:",
    kapanis: `<p>Güncel setlerin tamamı: <a href="/egitimler">Udemy eğitim setleri</a>. Konuları ücretsiz takip etmek için <a href="${REHBER}">SketchUp 2026 profesyonel eğitim rehberi</a> ve <a href="/ucretsiz-sketchup-egitimi.html">ücretsiz SketchUp eğitimi</a>.</p>`,
  },
];

for (const is of ISLER) {
  const yol = path.join(KOK, "src", "content", "posts", is.dosya);
  const k = JSON.parse(fs.readFileSync(yol, "utf8"));
  const oncekiTitle = k.title;

  if (k.contentHtml.includes("ders-kutusu")) {
    console.log(`${is.dosya}: zaten işlenmiş, atlandı`);
    continue;
  }

  k.title = is.title;
  k.seo = {
    ...k.seo,
    title: is.seoTitle,
    description: is.seoDesc,
    focusKeyword: is.keyword,
  };
  k.contentHtml = [
    is.giris,
    kutu(is.cipa, is.cumle),
    k.contentHtml.trim(),
    is.kapanis,
  ].join("\n\n");
  k.modifiedAt = TARIH;
  k.migrationChecksum = crypto.createHash("sha256").update(k.contentHtml, "utf8").digest("hex");

  fs.writeFileSync(yol, JSON.stringify(k, null, 2) + "\n", "utf8");
  const kelime = k.contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  console.log(`${is.dosya}`);
  console.log(`   başlık : ${oncekiTitle}`);
  console.log(`          → ${k.title}`);
  console.log(`   kelime : ${kelime} | seo.title ${k.seo.title.length} krk | açıklama ${k.seo.description.length} krk`);
}
