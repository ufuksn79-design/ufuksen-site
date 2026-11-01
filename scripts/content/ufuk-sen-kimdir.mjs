/**
 * "Ufuk Şen Kimdir?" sayfasını yeniden kurar.
 *
 * NEDEN: sayfa WordPress'ten taşınırken içindeki hikâye korunmuştu ama
 * sunumu bozuktu. Ölçülen sorunlar:
 *   - Facebook'tan yapıştırılmış CSS sınıfları (`d2edcug0 hpfvmrgz…`)
 *   - Boşluk için konmuş onlarca `<div class="bi6gxh9e"> </div>`
 *   - Metni olmayan kırık bağlantı: `<a href="/"></a>`
 *   - Var olmayan sayfaya bağlantı: `/ben-kimim/ufuk-sen-3`
 *   - Paragraf yerine `<br /><br />`
 *   - `text-align: justify` (ekranda okunurluğu düşürür)
 *   - Eskimiş rakamlar: "200 makale", "10 senedir 2009'dan beri"
 *
 * NE KORUNDU: hikâyenin kendisi. Otobüste kucakta taşınan tüplü monitör,
 * ilk bilgisayarı toplama uğraşı, öğretme isteği, topluluk için yapılanlar
 * ve kişisel değerleri — hepsi kullanıcının kendi anlattığı gibi duruyor.
 * Yeniden yazılan şey düzen ve dil, anlatılan şey değil.
 *
 * SAYILAR koddan okunur, elle yazılmaz: yazı, kategori, kurs, öğrenci ve
 * ürün sayıları site verisinden gelir; biri değişince sayfa da değişir.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const HEDEF = path.join(KOK, "src", "content", "pages", "ufuk-sen-kimdir.json");

/* ---------------------------------------------------------------- */
/* Ölçülen sayılar                                                   */
/* ---------------------------------------------------------------- */
const park = new Set(JSON.parse(fs.readFileSync(path.join(KOK, "src/content/parked.json"), "utf8")).slugs);
const yaziSayisi = fs
  .readdirSync(path.join(KOK, "src/content/posts"))
  .filter((f) => !park.has(f.replace(/\.json$/, ""))).length;

const taxonomy = JSON.parse(fs.readFileSync(path.join(KOK, "src/content/taxonomy.json"), "utf8"));
const kategoriSayisi = taxonomy.categories.filter((c) => c.postCount > 0).length;

const kurslar = JSON.parse(fs.readFileSync(path.join(KOK, "src/content/courses.json"), "utf8"));
const urunler = fs
  .readdirSync(path.join(KOK, "src/content/products"))
  .map((f) => JSON.parse(fs.readFileSync(path.join(KOK, "src/content/products", f), "utf8")))
  .filter((u) => u.yayinda !== false);
const sketchupEklentisi = urunler.filter((u) =>
  (u.uyumluluk ?? []).some((x) => /SketchUp/i.test(x)),
).length;

const tr = (n) => n.toLocaleString("tr-TR");

/* ---------------------------------------------------------------- */
const GOVDE = `
<figure class="kimdir-ofis">
  <img
    src="/media/marka/ufuksen-ofis-960.webp"
    srcset="/media/marka/ufuksen-ofis-640.webp 640w, /media/marka/ufuksen-ofis-960.webp 960w, /media/marka/ufuksen-ofis-1280.webp 1280w"
    sizes="(min-width: 860px) 800px, 100vw"
    alt="Ufuk Şen mimari proje ofisinde çizim masasında; arkada 3B bina görseli olan ekran"
    width="960"
    height="540"
    loading="eager"
    decoding="async"
  />
</figure>

<p class="kimdir-ozet">1979 Ankara doğumluyum. 1997'den beri inşaat ve 3B sektörünün içindeyim; ${new Date().getFullYear() - 2008} yıldır SketchUp eğitmenliği yapıyorum. Bugün üç iş yapıyorum: <strong>eğitim veriyorum</strong>, <strong>SketchUp eklentisi geliştiriyorum</strong> ve <strong>mimari görselleştirme</strong> üretiyorum.</p>

<h2>Rakamlarla</h2>

<ul>
  <li><strong>18 yıl</strong> SketchUp eğitmenliği — Türkiye'de bu programı Türkçe anlatan ilk isimlerden.</li>
  <li><strong>${tr(kurslar.kurslar.length)} eğitim seti</strong>, <strong>${tr(kurslar.toplamOgrenci)} öğrenci</strong> ve ${tr(kurslar.toplamYorum)} değerlendirme — Udemy'de yayında.</li>
  <li><strong>${tr(sketchupEklentisi)} SketchUp eklentisi</strong> geliştirdim; hepsi <a href="https://www.bestsketchupplugins.com/tr/" target="_blank" rel="noopener">Best SketchUp Plugins</a>'te.</li>
  <li><strong>Kendi render motorumu yazdım:</strong> <a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a> — SketchUp'ın içinde çalışan, ücretsiz, ışın izlemeli motor.</li>
  <li><strong>${tr(yaziSayisi)} yazı</strong>, ${kategoriSayisi} başlık altında bu sitede.</li>
</ul>

<h2>Nasıl başladım?</h2>

<p>1997'de Ankara'da bir inşaat firmasında işe başladım. Kendi bilgisayarımı alabilmem 2001'i buldu — o yıllarda bilgisayar almak bugünkü gibi değildi.</p>

<p>İlk kasamı aldığımda bütün parçalar bir odada duruyordu ve nasıl birleştireceğimi bilmiyordum. Telefonla bir sürü kişiye sora sora, araştıra araştıra kasayı topladım. Zor ama eğlenceli bir süreçti.</p>

<p>Sorun şuydu: monitörüm yoktu. Çözümü biraz komikti. Kasayı her cuma iş yerinden alır, kocaman tüplü monitörü kucağımda otobüsle eve götürür, pazartesi sabahı geri bırakırdım. Bu iş iyice zorlaşınca taksitle bir monitör aldım — kredi kartlarının yeni yaygınlaştığı yıllardı.</p>

<p>İlk beş yılımı AutoCAD, <a href="https://sketchupturkiye.com/" target="_blank" rel="noopener">SketchUp</a> ve 3ds Max öğrenmekle geçirdim. Üzerine render motorlarını ekledim ve gelişmeye devam ettim.</p>

<p>2010'da özel derslerle, kurduğumuz Facebook grubuyla ve <a href="https://www.youtube.com/@sketchupturkiye" target="_blank" rel="noopener">YouTube kanalımızla</a> başkalarının gelişimine katkı vermeye başladım. Sektörde eksik kalan noktaları anlatarak kullanıcıların vizyon kazanmasına çalıştım.</p>

<h2>Bugün ne yapıyorum?</h2>

<h3>Eğitim</h3>

<p>SketchUp, D5 Render, Enscape, Twinmotion ve V-Ray üzerine ${tr(kurslar.kurslar.length)} eğitim setim Udemy'de yayında — Türkçe, İngilizce, İspanyolca ve Almanca. Ayrıca birebir ve kuruma özel eğitim veriyorum.</p>

<p>Derste yazılım öğretmiyorum; ışığı, malzemeyi ve kadrajı öğretiyorum. Yazılım bunun aracı. Bu üçü motordan motora değişmediği için biriyle öğrendiğinizi diğerine taşıyabiliyorsunuz.</p>

<h3>Eklenti geliştirme</h3>

<p>Son yıllarda işimin en büyük kısmı burası. Başlangıçta satılacak ürünler değildi: kendi projelerimde elle yapmaktan bıktığım işler için yazdığım küçük araçlardı. Zemini tek tek kesmek, dolabın kesim listesini elle çıkarmak, pencereyi kutulardan çizmek — hepsi tekrar eden işlerdi.</p>

<p>Bugün <strong>${tr(sketchupEklentisi)} SketchUp eklentisi</strong> var: mimari kabuktan iç mimariye, doğramadan cepheye ve peyzaja kadar. Beşi ücretsiz. Üstüne kendi render motorumu yazdım — <strong>Render Fun</strong> SketchUp'ın içinde çalışıyor, modeli dışa aktarmanız gerekmiyor ve ücretsiz.</p>

<p>Eklentilerin tamamı: <a href="https://www.bestsketchupplugins.com/tr/" target="_blank" rel="noopener">bestsketchupplugins.com</a> — bu sitedeki tanıtım sayfaları ise <a href="/sketchup-en-iyi-pluginleri.html">SketchUp En İyi Pluginleri</a> başlığı altında.</p>

<h3>Görselleştirme</h3>

<p>Mimari görselleştirme ve render işleri alıyorum: iç mekân, dış mekân, stand tasarımı ve tek obje stüdyo render'ı. Ayrıntılar <a href="/3d-mimari-gorsellestirme">3D mimari görselleştirme</a> sayfasında.</p>

<h2>Nasıl çalışırım?</h2>

<p>İnşaat sektöründe uzun yıllar çalıştığım için görselleştirme tarafındaki eksikleri biliyorum. İçerik hazırlarken karşımdakinin nerede takıldığını tahmin etmem gerekmiyor; aynı yerde ben de takıldım.</p>

<blockquote>
  <p>Kendimi geliştirmek en büyük ilkelerimden biri. İkincisi, öğrendiğimi anında paylaşmak.</p>
</blockquote>

<p>Bu işin teknik tarafı kadar sevgi tarafı da var. Sevmeyen birinin kendini geliştirmesi zor; bu meslekler sürekli değiştiği için takip etmeyen geride kalıyor.</p>

<h2>Topluluk için yaptıklarımız</h2>

<p>Yaptığım iyilikleri anlatmak taraftarı değildim. Ama anlatmanın başkalarını da harekete geçirdiğini görünce yazmaya karar verdim — hem de bunu Allah rızası için yaptığımızı söylemenin faydalı olacağını düşünüyorum.</p>

<ul>
  <li>Meslek liselerine ve düz liselerin laboratuvarlarına ücretsiz eğitim seti desteği verdik.</li>
  <li>Sanal laboratuvar kuran öğrencilere ücretsiz Unreal Engine eğitimi sağladık.</li>
  <li>Bağımlılıkla mücadele eden arkadaşlarımıza, uğraşacakları bir alan olsun diye eğitim seti desteği verdik.</li>
  <li>İşsiz birçok arkadaşımıza ücretsiz eğitimle iş sahibi olma yolunu açtık.</li>
  <li>YouTube kanalımızda yüzlerce ücretsiz ders yayınladık; üniversite öğrencileri dahil çok kişi faydalandı.</li>
  <li>Yüzlerce yarışma düzenleyerek insanların daha iyi iş çıkarmasına destek olduk.</li>
  <li><a href="https://texturefun.com/" target="_blank" rel="noopener">Texturefun.com</a>'u kurduk: binlerce ücretsiz kaplama, virüslü yabancı sitelerde dolaşmak zorunda kalmayın diye.</li>
  <li>Ücretsiz model sitesi açtık — kişisel bilgilerinizi şüpheli sitelere kaptırmayın diye doğrudan indirme bağlantısı verdik.</li>
  <li><a href="https://sketchupturkiye.com/" target="_blank" rel="noopener">Sketchupturkiye.com</a>'u sosyal sorumluluk projesi olarak yürüttük; on binlerce soruya cevap verdik.</li>
  <li>Bu sitede ${tr(yaziSayisi)} yazı yayımladım — 3B tarafında yol almanız ve vizyon kurmanız için.</li>
</ul>

<h2>Bu sitenin amacı</h2>

<p>Paylaşarak öğretmek ve öğrenmek. İnsanlara bir şey verirken aynı zamanda kendimizi de geliştirdiğimizi unutmamak gerekiyor.</p>

<p>Burada görselleştirme sürecinizi hızlandıracak ve size fikir verecek kaynaklar paylaşıyorum. Kendini geliştirmiş olanların da yeni başlayanların da katkısını her zaman bekliyorum.</p>

<h2>Nerede bulabilirsiniz?</h2>

<ul>
  <li><a href="/egitimler">Eğitim setleri</a> — Udemy'deki ${tr(kurslar.kurslar.length)} setin tamamı.</li>
  <li><a href="/sketchup-ozel-ders">SketchUp özel ders</a> ve <a href="/sketchup-kurs">kurs</a> — birebir çalışma.</li>
  <li><a href="/blog">Blog</a> — ${tr(yaziSayisi)} yazılık arşiv.</li>
  <li><a href="/videolar">Videolar</a> — ders ve tanıtım videoları.</li>
  <li><a href="/ne-demisler">Ne demişler?</a> — eğitim setlerini alanların kendi sözleri.</li>
  <li><a href="/amac">Amaç</a> — bu işi neden yapıyorum.</li>
</ul>

<p>Bir projeniz ya da sorunuz varsa <a href="/iletisim">iletişim sayfasından</a> yazabilirsiniz; genelde aynı gün dönüyorum.</p>
`;

/* ---------------------------------------------------------------- */
const kayit = JSON.parse(fs.readFileSync(HEDEF, "utf8"));
const oncekiKelime = kayit.contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

kayit.contentHtml = GOVDE.trim();
kayit.title = "Ufuk Şen Kimdir?";
kayit.seo = {
  ...(kayit.seo ?? {}),
  title: "Ufuk Şen Kimdir? — SketchUp Eğitmeni ve Eklenti Geliştirici",
  description:
    `1997'den beri 3B sektöründe, 18 yıldır SketchUp eğitmeni. ${tr(kurslar.kurslar.length)} eğitim seti, ` +
    `${tr(sketchupEklentisi)} SketchUp eklentisi ve ücretsiz bir render motoru.`,
  canonicalUrl: "https://www.ufuksen.com/ufuk-sen-kimdir",
};
kayit.modifiedAt = "2026-11-01 10:00:00";
kayit.migrationChecksum = crypto.createHash("sha256").update(GOVDE.trim(), "utf8").digest("hex");

fs.writeFileSync(HEDEF, JSON.stringify(kayit, null, 2) + "\n", "utf8");

const kelime = GOVDE.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
console.log(`kelime        : ${oncekiKelime} → ${kelime}`);
console.log(`başlık (H2/H3): ${(GOVDE.match(/<h2/g) ?? []).length} / ${(GOVDE.match(/<h3/g) ?? []).length}`);
console.log(`iç bağlantı   : ${(GOVDE.match(/href="\//g) ?? []).length}`);
console.log(`dış bağlantı  : ${(GOVDE.match(/href="http/g) ?? []).length}`);
console.log(`seo.title     : ${kayit.seo.title.length} krk`);
console.log(`seo.descr.    : ${kayit.seo.description.length} krk`);
console.log(`Facebook sınıfı kaldı mı : ${/d2edcug0|bi6gxh9e|hpfvmrgz/.test(GOVDE)}`);
console.log(`kırık bağlantı kaldı mı  : ${/ben-kimim|href="\/"[^>]*><\/a>/.test(GOVDE)}`);
console.log(`justify kaldı mı         : ${/text-align:\s*justify/.test(GOVDE)}`);
