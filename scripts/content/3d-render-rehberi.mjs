/**
 * "3D Render Nasıl Alınır?" — uzun kuyruklu anahtar kelimelerle kurulmuş
 * mimari görselleştirme rehberi.
 *
 * Kullanıcı isteği (13 Kasım 2026): "3d render konusunda blog yazısı yazalım,
 * uzun kuyruklu kelimelerden oluşsun, iç kısımda 3d render kelimesine
 * https://www.mimari3d.com/ link çıkışı verelim."
 *
 * UZUN KUYRUKLU İFADELER — başlıklara ve ilk paragrafa doğal yerleştirildi:
 *   3d render nasıl alınır · mimari 3d render nedir · iç mekân renderda ışık
 *   ayarı · dış mekân mimari görselleştirme · sketchup ile gerçekçi render
 *   almak · gece renderi nasıl alınır · render süresi neden uzun ·
 *   ücretsiz render motoru · render kalitesini artırma yolları ·
 *   3d render fiyatı neye göre belirlenir · kamera yüksekliği ve lens
 *   seçimi · render sonrası renk düzeltme · müşteriye 3b sunum
 *
 * BAĞLANTI ÇIKIŞI: gövdedeki "3d render" ifadesi mimari3d.com'a bağlanır
 * (istenen çıkış), kapanışta ikinci bir bağlantı daha var.
 *
 * YAZILMAYANLAR: fiyat rakamı (değişiyor; yalnız fiyatı belirleyen
 * etkenler yazıldı), ölçülmemiş hız / süre iddiası, marka karşılaştırmasında
 * doğrulanmamış teknik sınır.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const SLUG = "3d-render-nasil-alinir-mimari-gorsellestirme-rehberi";
const URL_YOL = `/${SLUG}.html`;
const MIMARI3D = "https://www.mimari3d.com/";
const RENDERFUN = "https://renderfun.com/";

const GOVDE = `
<p>"Model bitti, şimdi <strong>3D render</strong> alacağız" cümlesi kulağa tek bir düğmeye basmak gibi gelir. Oysa ekrandaki görüntüyü müşterinin "aynen böyle olsun" dediği bir görsele çeviren şey düğme değil, arkasındaki sıradır: modelin hazırlanması, malzeme, ışık, kamera ve en sonda renk düzeltme.</p>

<p>Bu yazıda <em>3d render nasıl alınır</em> sorusunu baştan sona, çalışma sırasına göre anlatıyorum: mimari 3d render nedir, iç mekân renderında ışık nasıl ayarlanır, dış mekân görselleştirmede neye dikkat edilir, render süresi neden uzar ve müşteriye sunarken hangi görseller işe yarar. Yıllardır hem proje üretiyorum hem de bu işi anlatıyorum; aşağıdakiler kitaptan değil, iş teslim ederken öğrenilenlerden.</p>
<h2>Mimari 3D render nedir, ne işe yarar?</h2>

<p>Mimari 3D render, üç boyutlu bir modelden ışık hesabı yapılarak üretilen durağan görüntüdür. Amacı güzel bir resim yapmak değil, <strong>henüz yapılmamış bir mekânı karar verilebilecek kadar gerçekçi göstermektir.</strong> İşveren planı okuyamayabilir; ama ışığın sabah hangi duvara düştüğünü, mutfak tezgâhının rengini, cephedeki malzeme ayrımını görselden anında anlar.</p>

<p>Pratikte üç yerde işe yarar:</p>

<ul>
  <li><strong>Karar aldırmak için:</strong> iki malzeme alternatifi yan yana konur, müşteri seçer.</li>
  <li><strong>Satış için:</strong> proje tanıtımında, ihale dosyasında, emlak sunumunda.</li>
  <li><strong>Hata yakalamak için:</strong> modelde gözden kaçan oran bozukluğu, render'da hemen görünür.</li>
</ul>

<p>Mimari görselleştirme ve <a href="${MIMARI3D}" target="_blank" rel="noopener">3d render</a> hizmetine dair örnek işlere bakmak isteyenler için ayrı bir arşiv var; bu yazı ise işin nasıl yapıldığı üzerine.</p>

<h2>1. Adım: Render'a hazır model nasıl olur?</h2>

<p>Kötü render'ların çoğu render motorundan değil modelden gelir. Render'a başlamadan önce şunlara bakın:</p>

<ul>
  <li><strong>Ölçü doğru mu?</strong> Kapı 2,00 m, tezgâh 0,87 m, kat yüksekliği gerçek. Gözle "yaklaşık" yapılan ölçüler render'da hemen sırıtır.</li>
  <li><strong>Yüzeyler kapalı mı?</strong> Açık kalan çatı alınlığı ya da duvar birleşimi, ışık sızması olarak geri döner.</li>
  <li><strong>Yüzey normalleri doğru yönde mi?</strong> Ters yüzey, malzemeyi yanlış gösterir.</li>
  <li><strong>Mobilya duvarın içine girmiş mi?</strong> Girmişse gölge yanlış düşer.</li>
  <li><strong>Model ağır mı?</strong> Gereksiz detay (görünmeyen vidalar, aşırı poligonlu bitki) render süresini uzatır, görüntüye hiçbir şey katmaz.</li>
</ul>

<p>Bu listeyi geçmeden ışıkla uğraşmak zaman kaybıdır: <a href="/3d-render-hatalari.html">render hatalarının</a> büyük kısmı burada doğar.</p>

<h2>2. Adım: Malzeme — gerçekçiliğin yüzde yetmişi burada</h2>

<p>Bir malzemeyi inandırıcı yapan rengi değil, <strong>yüzeyinin ışığa verdiği tepkidir.</strong> Üç ayarı doğru kurmak çoğu zaman yeter:</p>

<ul>
  <li><strong>Pürüzlülük:</strong> Hiçbir gerçek yüzey ayna gibi değildir. Cilalı parke bile dağınık yansıtır.</li>
  <li><strong>Doku ölçeği:</strong> 60 × 60 fayans görselde 60 × 60 görünmeli. Ölçeği kaçmış doku, modeli oyuncak gibi gösterir.</li>
  <li><strong>Kabartma:</strong> Sıva, beton ve ahşapta çok hafif bir yüzey kabartması, düz görüntüyü fotoğrafa yaklaştırır.</li>
</ul>

<p>İç mekânda bir ipucu: kumaş, halı ve perde gibi mat yüzeyler sahneyi yumuşatır; her şeyin parlak olduğu bir oda, gerçek bir odaya benzemez.</p>

<h2>3. Adım: İç mekân renderında ışık ayarı</h2>

<p>En çok sorulan konu bu: <em>iç mekânda gerçekçi ışık nasıl ayarlanır?</em> Sıra şöyle işler:</p>

<ol>
  <li><strong>Önce tek bir ana ışık.</strong> Gündüz sahnesinde bu güneştir. Açısını, odaya girmesini istediğiniz yöne göre seçin — pencereden içeri uzanan ışık bandı, iç mekân görselini taşıyan şeydir.</li>
  <li><strong>Sonra gökyüzü.</strong> Ortam ışığı gölgelerin içini doldurur. Tamamen karanlık gölge, bakanın gözünü rahatsız eder.</li>
  <li><strong>En son yapay ışık.</strong> Avize, spot ve bant aydınlatma dekoratif katmandır; sahneyi onlarla aydınlatmaya çalışmak yanlış sıradır.</li>
</ol>

<p>Kapalı havada çalışmak, acemi gözünü en çok kurtaran seçimdir: bulutlu gökyüzü sert gölge üretmez, malzeme hatalarını affeder ve iç mekânı dengeli aydınlatır.</p>

<h3>Gece renderi nasıl alınır?</h3>

<p>Gece sahnesi, gündüz sahnesinin karartılmışı değildir. Üç şey değişir: dışarıda gökyüzü hâlâ tamamen siyah olmamalıdır (alacakaranlık mavisi derinlik verir), iç aydınlatma sıcak renkte olmalıdır ve kontrast artar — bu yüzden camın arkasındaki detay kolayca kaybolur. Gece görselinde "ışıklı pencere" kompozisyonun ana öğesidir.</p>

<h2>4. Adım: Kamera — görselin yüzde ellisi çerçevede</h2>

<p>İyi ışıklandırılmış kötü bir kadraj, kötü ışıklandırılmış iyi kadrajdan daha çok batar. Pratik kurallar:</p>

<ul>
  <li><strong>Kamera yüksekliği:</strong> insan göz hizası, yani 1,50–1,60 m. Yerden 30 cm'de duran bir kamera, mekânı bir filmden sahne gibi gösterir ama ölçü algısını bozar.</li>
  <li><strong>Lens:</strong> iç mekânda geniş açı gerekir, ama aşırısı duvarları esnetir. Mimari fotoğrafın alışıldık aralığı 24–35 mm karşılığıdır.</li>
  <li><strong>Dikey çizgiler dik dursun.</strong> Mimari görselde duvarların yanlara doğru yatması amatörlüğün en belirgin işaretidir; bunu düzelten ayar, kaydırmalı (shift) bakış açısıdır.</li>
  <li><strong>Bir görselde bir fikir.</strong> Tüm daireyi tek kareye sığdırmaya çalışmak yerine, üç iyi kadraj alın.</li>
</ul>

<h2>5. Adım: Render süresi neden uzar, nasıl kısalır?</h2>

<p>"Render süresi neden bu kadar uzun?" sorusunun cevabı neredeyse her zaman aynı birkaç başlıkta toplanır:</p>

<ul>
  <li><strong>Çözünürlük:</strong> İki katına çıkan genişlik, dört katı piksel demektir.</li>
  <li><strong>Cam ve su:</strong> Saydam ve yansıtıcı yüzeyler ışığın defalarca sekmesini gerektirir.</li>
  <li><strong>Çok sayıda küçük ışık:</strong> Yirmi spot, bir güneşten pahalıdır.</li>
  <li><strong>Gereksiz geometri:</strong> Görünmeyen yerlerdeki detay hesaba katılmaya devam eder.</li>
  <li><strong>Donanım:</strong> Günümüz motorlarının çoğu ekran kartıyla çalışır; süreyi en çok belirleyen tek parça odur.</li>
</ul>

<p>Pratik yöntem şudur: çalışırken küçük çözünürlükte ve düşük kalitede deneme alın, yalnız <strong>son</strong> görseli yüksek ayarda bırakın. Beş saatlik bir render'ı iptal ettiren hata, çoğu zaman üç dakikalık bir denemede görülebilecek bir hatadır.</p>

<h2>6. Adım: Render sonrası — renk düzeltme küçük ama belirleyici</h2>

<p>Motordan çıkan görsel çoğu zaman biraz sönüktür. Son dokunuşlar sahneyi değiştirmez, okunurluğunu artırır: kontrastı hafifçe açmak, beyaz dengesini sahnenin saatine uydurmak, köşelere çok hafif karartma vermek ve gerekiyorsa gökyüzünü değiştirmek. Ölçü şudur: düzeltmeden sonra görsel hâlâ aynı mekân gibi görünüyorsa doğru yapılmıştır.</p>

<h2>SketchUp ile gerçekçi render almak</h2>

<p>SketchUp tarafında çalışanlar için iki yol var. Birincisi klasik yol: modeli hazırlayıp bir render motoruyla görsel almak. <a href="/d5-render-nedir-nasil-kullanilir.html">D5 Render</a>, Enscape ve V-Ray bu alanda en çok kullanılanlar; her birinin kendi alışkanlığı var ama yukarıdaki sıra üçünde de aynıdır.</p>

<p>İkincisi, ayrı bir program açmadan çalışmak isteyenler için: <a href="${RENDERFUN}" target="_blank" rel="noopener">Render Fun</a>, SketchUp'ın içinde çalışan <strong>ücretsiz</strong> render motorumuz. Model hazırsa görsel almak için sahneyi dışarı aktarmanız gerekmiyor.</p>

<p>Hızlı ve toparlayıcı bir örnek için <a href="/10-dakikada-hayran-birakan-gercekci-render.html">10 dakikada gerçekçi render</a> yazısına, dış mekân özelinde <a href="/dis-mekanda-gercekci-render-alin.html">dış mekânda gerçekçi render</a> yazısına bakabilirsiniz.</p>

<h2>3D render fiyatı neye göre belirlenir?</h2>

<p>Rakam yazmıyorum — kur, kapsam ve teslim süresi değiştikçe yazı yanlış bilgiye döner. Ama fiyatı belirleyen etkenler sabittir:</p>

<ul>
  <li><strong>Görsel adedi ve çözünürlük.</strong></li>
  <li><strong>Modelin size hazır gelip gelmediği</strong> — elinizde yalnızca plan varsa modelleme ayrı iştir.</li>
  <li><strong>İç mekân mı, dış mekân mı:</strong> iç mekânda tefriş, dış mekânda çevre düzeni ek emektir.</li>
  <li><strong>Revizyon sayısı:</strong> teklifte kaç revizyon olduğunun yazılması iki tarafı da rahatlatır.</li>
  <li><strong>Teslim süresi:</strong> acil iş her meslekte pahalıdır.</li>
</ul>

<h2>Sık sorulan sorular</h2>

<h3>3D render almak için güçlü bilgisayar şart mı?</h3>
<p>İyi bir ekran kartı işi ciddi şekilde hızlandırır, ama başlamak için şart değildir. Düşük çözünürlükte çalışıp son görseli yüksek ayarda almak, mütevazı donanımla da iş çıkarmanın bilinen yoludur.</p>

<h3>Ücretsiz bir render motoruyla iş kalitesinde görsel alınır mı?</h3>
<p>Evet. Görselin kalitesini belirleyen şey motorun fiyatı değil, modelin doğruluğu, malzeme ayarı, ışık kurgusu ve kadrajdır. Aynı sahne, aynı özenle, ücretsiz bir motorda da inandırıcı çıkar.</p>

<h3>Kaç görsel yeterli?</h3>
<p>İç mekânda oda başına bir ana kadraj ve bir detay; dış mekânda biri göz hizasından, biri yüksekten olmak üzere iki görsel çoğu sunum için yeterlidir. Kalabalık bir görsel seti, iyi seçilmiş üç görselden daha az iş görür.</p>

<h3>Render'ı müşteriye nasıl sunmalı?</h3>
<p>Görselleri tek tek atmak yerine sırayla sunun: önce genel kadraj, sonra detay, en sonda alternatifler. Alternatifi "A mı B mi" diye sormak, "nasıl olmuş?" diye sormaktan çok daha hızlı karar getirir.</p>

<p>Mimari görselleştirme ve proje işleri için <a href="${MIMARI3D}" target="_blank" rel="noopener">mimari3d.com</a> üzerinden, eğitim tarafı için <a href="/egitimler">eğitim setleri sayfasından</a> ya da <a href="/iletisim/">iletişim sayfasından</a> ulaşabilirsiniz.</p>
`;

const kelime = GOVDE.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

const kayit = {
  legacyId: 90030,
  slug: SLUG,
  legacyUrl: URL_YOL,
  url: URL_YOL,
  dil: "tr",
  alternatif: null,
  title: "3D Render Nasıl Alınır? Mimari Görselleştirme Rehberi",
  excerpt:
    "Modelden teslime: malzeme, ışık, kamera, render süresi ve renk düzeltme. İç mekân ve dış mekân 3D render almanın sırası, pratik kurallarla.",
  contentHtml: GOVDE.trim(),
  publishedAt: "2026-11-13 10:00:00",
  modifiedAt: "2026-11-13 10:00:00",
  status: "publish",
  /** Arşivdeki render görselleri yazı yazılı video kapakları; bu yazıya
   *  uyan bir görsel yok, uydurma kapak konmadı. */
  featuredImage: null,
  inlineMedia: [],
  embeds: [],
  seo: {
    title: "3D Render Nasıl Alınır? Mimari Görselleştirme Rehberi",
    description:
      "3D render nasıl alınır: model hazırlığı, malzeme, iç mekân ışık ayarı, kamera yüksekliği, render süresi ve renk düzeltme adım adım anlatıldı.",
    focusKeyword: "3d render nasıl alınır",
    canonicalUrl: `https://www.ufuksen.com${URL_YOL}`,
    ogImage: null,
    noindex: false,
  },
  readingMinutes: Math.max(1, Math.round(kelime / 200)),
  migrationChecksum: crypto.createHash("sha256").update(GOVDE.trim(), "utf8").digest("hex"),
  author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
  categories: [
    { legacyId: 518, name: "3D Görselleştirme", slug: "3d-gorsellestirme" },
    { legacyId: 1169, name: "3D Programlar", slug: "3d-programlar" },
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
console.log(`mimari3d bağ. : ${say(/mimari3d\.com/g)}`);
console.log(`iç bağlantı   : ${say(/href="\//g)}`);
console.log(`başlık / açık.: ${kayit.seo.title.length} / ${kayit.seo.description.length} krk`);
