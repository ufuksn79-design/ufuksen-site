/**
 * /sketchup-ozel-ders — ana satış sayfasını yeniden kurar (SEO görevi, 18 Kasım 2026).
 *
 * NEDEN: Aynı arama niyeti için 8 sayfa yarışıyordu (kanibalizasyon) ve ana
 * satış sayfası en zayıfıydı: 561 kelime, 3 iç bağlantı, yalnız WebPage şeması.
 *
 * BU BETİK NE YAPAR
 *   1. /sketchup-ders ve /sketchup-kurs sayfalarındaki işe yarar bilgiyi
 *      (12 saatlik temel program, konu başlıkları, online/birebir) bu sayfaya
 *      taşır — içerik silinmiyor, birleşiyor.
 *   2. Sayfayı 1.200+ kelimeye çıkarır; başlık, açıklama, H1 hedefe göre.
 *   3. Service + FAQPage + BreadcrumbList + Person şemasını (tek @graph) yazar.
 *   4. Mevcut SSS korunur, üstüne beş soru eklenir.
 *
 * UYDURULMAYANLAR (AGENTS.md §5, kullanıcı kuralı):
 *   - Fiyat yok: gerçek fiyat listesi elimde yok, WhatsApp'a yönlendiriliyor.
 *   - Öğrenci yorumu / öğrenci sayısı / öğrenci çalışması yok: sitede
 *     doğrulanmış veri yok, bölüm açılmadı. Offer ve AggregateRating şemaya
 *     KONMADI (gerçek veri olmadan rich result istemek yanlış beyan olur).
 *   - Doğrulanmış sayılar: 34 Udemy kursu, 770 ders, 7.273 öğrenci,
 *     900 değerlendirme (src/content/courses.json, Udemy 2026-10-15);
 *     12 saatlik temel program ve 16–30 saatlik toplam süre eski sayfaların
 *     kendi metninden.
 *   - Marka yazımı: "SketchUp" (U büyük). URL değişmedi.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const DOSYA = path.join(KOK, "src", "content", "pages", "sketchup-ozel-ders.json");
const WA = "https://wa.me/905303229301";
const kurslar = JSON.parse(fs.readFileSync(path.join(KOK, "src", "content", "courses.json"), "utf8"));
const KURS = kurslar.kurslar.length;
const DERS = kurslar.kurslar.reduce((t, k) => t + (k.dersSayisi ?? 0), 0);
const OGRENCI = kurslar.toplamOgrenci.toLocaleString("tr-TR");

/** Sayfanın her bölümünün sonunda duran eylem çağrısı. */
const cta = (metin) =>
  `<p class="ozel-ders-cta"><a class="btn btn--primary" href="${WA}" target="_blank" rel="noopener">${metin}</a></p>`;

const SSS = [
  {
    s: "Dersler online mı, yüz yüze mi?",
    c: "İkisi de var. Online dersler ekran paylaşımıyla, karşılıklı konuşarak işleniyor; siz kendi bilgisayarınızda çizerken ben aynı anda görüyorum. Yüz yüze ders de tercihinize göre düzenlenebiliyor.",
  },
  {
    s: "Hiç bilmeyen biri başlayabilir mi?",
    c: "Evet. Program sıfırdan kuruluyor: arayüz, çizim mantığı, temel araçlar. Önceden SketchUp bilmeniz gerekmiyor. Render motoru dersleri içinse temel SketchUp bilgisi gerekiyor.",
  },
  {
    s: "Kaç derste öğrenilir?",
    c: "Temel modelleme için 12 saatlik program çoğu kişiye yetiyor. Render ve sunum da eklenince toplam süre seviyenize ve hedefinize göre 16–30 saat arasında değişiyor.",
  },
  {
    s: "Dersin kaydı veriliyor mu?",
    c: "Online derslerde ders kaydı alınabiliyor; böylece anlatılan bölümü sonradan tekrar izleyebilirsiniz. Kayıt isteğinizi ders başında söylemeniz yeterli.",
  },
  {
    s: "Hangi SketchUp sürümüyle çalışıyoruz?",
    c: "Sizde kurulu olan sürümle. Derslerde güncel sürüm anlatılıyor, ama eski bir sürümle çalışıyorsanız ders ona göre işleniyor — araçların mantığı sürümler arasında değişmiyor.",
  },
  {
    s: "Render motoru derslerine katılmak için SketchUp bilmek zorunlu mu?",
    c: "Evet. Render dersi modelin hazır olduğu yerden başlıyor; temel SketchUp bilginiz yoksa önce modelleme bölümünü işliyoruz.",
  },
  {
    s: "Ders programı sabit mi?",
    c: "Hayır. Önce ne yapmak istediğinizi konuşuyoruz — mimari sunum, iç mekân, mobilya, imalat çizimi — ve program ona göre kuruluyor. Mobilyacıysanız imalat tarafına, mimarsanız sunuma daha çok zaman ayırıyoruz.",
  },
  {
    s: "Eğitim ücreti ne kadar?",
    c: `Ücret seviyeye, ders sayısına ve konuya göre değişiyor. Size uygun programı ve güncel fiyatı konuşmak için <a href="${WA}" target="_blank" rel="noopener">WhatsApp'tan yazmanız</a> yeterli.`,
  },
];

const GOVDE = `
<p>SketchUp'ı kendi başına öğrenmeye çalışırken en çok kaybedilen şey zaman: video video gezip, hangi aracın ne zaman kullanıldığını deneme yanılmayla bulmak haftalar alıyor. <strong>SketchUp özel ders</strong>, bu yolu kısaltmak için var — karşınızda konuşabileceğiniz, "ben bunu yapamıyorum" diyebileceğiniz biri oluyor ve program sizin işinize göre anlatılıyor.</p>

<p>Yıllardır hem modelleme hem de render motorları üzerine birebir ders veriyorum. Dersler online birebir yapılıyor; isterseniz yüz yüze de düzenlenebiliyor.</p>

${cta("WhatsApp'tan yazın, programı birlikte belirleyelim")}

<h2>Kimler için?</h2>

<ul>
  <li><strong>Mimar ve iç mimarlar</strong> — projeyi hızlı modelleyip müşteriye sunabilmek için. Plandan 3B'ye geçiş, tefriş, sunum paftası ve render.</li>
  <li><strong>Öğrenciler</strong> — jüri ve portfolyo için. Temel araçlardan başlayıp sunum kalitesine kadar.</li>
  <li><strong>Mobilyacı ve dolapçılar</strong> — ölçüsü doğru, üretime giden modeller için. Dolap, mutfak, mağaza ekipmanı.</li>
  <li><strong>Uygulama firmaları ve teknik ressamlar</strong> — AutoCAD çizimini SketchUp'a taşıyıp üç boyuta kaldırmak, metraj ve detay çıkarmak için.</li>
</ul>

<p>Ortak nokta şu: herkesin derdi "programı bilmek" değil, <em>kendi işini</em> bu programla yapabilmek. Ders de buna göre kuruluyor.</p>

<h2>Ders nasıl işliyor?</h2>

<ol>
  <li><strong>Önce konuşuyoruz.</strong> Ne iş yapıyorsunuz, SketchUp'ı nerede kullanacaksınız, elinizde hangi projeler var? Program buna göre kuruluyor.</li>
  <li><strong>Online birebir.</strong> Ekran paylaşımıyla, karşılıklı. Ben anlatırken siz de kendi bilgisayarınızda çiziyorsunuz; takıldığınız yerde ders duruyor.</li>
  <li><strong>Haftalık plan.</strong> Dersler genelde haftada bir ya da iki gün, saatleri birlikte ayarlıyoruz.</li>
  <li><strong>Ders kaydı.</strong> İsterseniz kayıt alınıyor; anlatılan bölümü sonradan tekrar izleyebiliyorsunuz.</li>
  <li><strong>Ödev ve geri bildirim.</strong> Arada kendi projenizi çiziyorsunuz, bir sonraki derste birlikte bakıyoruz. Asıl öğrenme burada oluyor.</li>
</ol>

<p>Birebir SketchUp eğitiminin kurstan farkı da bu: sınıf hızına değil, sizin hızınıza göre ilerliyor.</p>

${cta("Uygun gün ve saat için mesaj gönderin")}

<h2>Ders programı: başlangıç, orta, ileri</h2>

<p>Aşağıdaki başlıklar standart akış. Sizin işinize göre bazı bölümler genişliyor, bazıları kısalıyor.</p>

<h3>Başlangıç — temel modelleme (yaklaşık 12 saat)</h3>

<p>Temel eğitim için 12 saatlik programın çoğu kişiye yettiğini görüyorum. Bu bölümde şunlar var:</p>

<ul>
  <li>SketchUp'a giriş, çizim mantığı, arayüz ve menüler</li>
  <li>Orbit, Pan, Zoom — sahnede hareket</li>
  <li>Line aracı ve üçüncü boyuta geçiş</li>
  <li>Select, Rectangle, Arc, Circle, Polygon, Freehand</li>
  <li>Push/Pull, Offset</li>
  <li>Move, Rotate, Scale</li>
  <li>Follow Me, Intersect ve kesişim mantığı</li>
  <li>Grup ve bileşen (component) farkı — en çok hata buradan çıkıyor</li>
  <li>Katmanlar (tags), sahneler, gölge ve stiller</li>
  <li>Ölçülendirme, metin ve kesit düzlemi</li>
</ul>

<h3>Orta seviye — gerçek proje üzerinde</h3>

<ul>
  <li><strong>İç mekân:</strong> kat planının çizilmesi, duvar ve döşeme, hazır modellerle yerleşim</li>
  <li><strong>Dış mekân:</strong> AutoCAD dosyasının SketchUp'a alınması, yükseltme ve üç boyuta kaldırma</li>
  <li><strong>Mobilya ve stand modelleme:</strong> objelerin ölçüsüyle modellenmesi</li>
  <li>Malzeme ve doku: kaplamanın ölçeği, yönü, kendi dokunuzu eklemek</li>
  <li>Eklentilerle çalışma: hangi iş için hangi eklenti, kurulum ve kullanım</li>
</ul>

<h3>İleri — sunum ve üretim</h3>

<ul>
  <li>Sahne ve animasyon kurgusu, sunum paftası</li>
  <li>Render motoruyla görselleştirme (aşağıdaki bölüm)</li>
  <li>Model temizliği, dosya boyutu, büyük projede çalışma düzeni</li>
  <li>Çıktı: ölçülü çizim, detay, imalat için model hazırlığı</li>
</ul>

<p>Konuların tamamını adım adım anlatan ücretsiz rehbere de bakabilirsiniz: <a href="/sketchup-2026-profesyonel-egitim.html">SketchUp 2026 profesyonel eğitim rehberi</a>.</p>

<h2>Render motorları özel dersi</h2>

<p>Modelleme bittikten sonraki adım görselleştirme. Burada dört motor üzerine ders veriyorum; hangisinin size uyduğunu ilk görüşmede konuşuyoruz.</p>

<ul>
  <li><strong>D5 Render</strong> — gerçek zamanlı çalışması ve kütüphanesiyle hızlı sonuç veriyor. <a href="/d5-render-nedir-nasil-kullanilir.html">D5 Render nedir</a> yazısı giriş için iyi bir başlangıç.</li>
  <li><strong>Enscape</strong> — SketchUp içinden çıkmadan render almak isteyenler için. Ayrıntı: <a href="/enscape-render-ozel-ders.html">Enscape render özel ders</a> ve <a href="/sketchup-enscape-render-egitim-ozel-ders.html">SketchUp + Enscape eğitimi</a>.</li>
  <li><strong>Twinmotion</strong> — çevre, bitkilendirme ve animasyon tarafı güçlü. Ayrıntı: <a href="/twinmotion-render-egitim-ozel-ders.html">Twinmotion render eğitimi</a>.</li>
  <li><strong>V-Ray</strong> — kontrolü en ayrıntılı olan, klasik mimari görselleştirme yolu.</li>
</ul>

<p>Render dersinde sıra hep aynı: önce modelin doğruluğu, sonra malzeme, sonra ışık, en son kamera ve renk düzeltme. Bu sıranın neden böyle olduğunu <a href="/3d-render-nasil-alinir-mimari-gorsellestirme-rehberi.html">3D render rehberinde</a> yazdım.</p>

${cta("Hangi render motoru size uygun, konuşalım")}

<h2>Dersten önce neye ihtiyacınız var?</h2>

<ul>
  <li><strong>Bilgisayar:</strong> SketchUp'ın kurulu olduğu bir Windows ya da Mac bilgisayar. Render de çalışacaksak ekran kartı önem kazanıyor; mevcut bilgisayarınızın yeterli olup olmadığına ilk görüşmede birlikte bakıyoruz.</li>
  <li><strong>Fare:</strong> Tekerlekli fare şart. SketchUp'ta orbit ve pan tekerlekten yürüyor; dizüstü touchpad ile ders verimsiz geçiyor.</li>
  <li><strong>İnternet ve mikrofon:</strong> Ekran paylaşımı için normal bir bağlantı ve kulaklık-mikrofon yeterli. Kamera zorunlu değil.</li>
  <li><strong>Elinizdeki iş:</strong> Varsa kendi projeniz — plan, ölçü, fotoğraf. Dersi boş bir örnek yerine sizin işiniz üzerinde yapmak öğrenmeyi hızlandırıyor.</li>
</ul>

<h2>Derste en çok düzelttiğim beş alışkanlık</h2>

<p>Kendi kendine öğrenenlerde hep aynı şeyler çıkıyor. Bunları erken düzeltmek, sonraki bütün projeleri rahatlatıyor:</p>

<ol>
  <li><strong>Grup ile bileşeni karıştırmak.</strong> Aynı parçadan birden fazla varsa bileşen kullanılır; birini değiştirdiğinizde hepsi değişir. Grupla çalışıldığında aynı pencereyi otuz kez elle düzeltmek gerekiyor.</li>
  <li><strong>Ölçüsüz çizmek.</strong> Fareyle "yaklaşık" çizilen çizgi, sonradan her şeyi bozuyor. Doğru alışkanlık: aracı seç, yönü göster, ölçüyü klavyeden yaz.</li>
  <li><strong>Her şeyi tek katmanda bırakmak.</strong> Etiket (tag) düzeni kurulmamış bir model, sunum ve kesit aşamasında yönetilemez hâle geliyor.</li>
  <li><strong>Ters yüzeyler.</strong> Mavi yüzler dışarı bakarken model render'da yanlış görünüyor; bu ders sırasında bir kere gösterilince bir daha sorun olmuyor.</li>
  <li><strong>Modeli şişirmek.</strong> İnternetten indirilen ağır mobilyalar dosyayı kilitliyor. Neyin indirilip neyin kendi elinizle çizileceğini ayırt etmek ayrı bir beceri.</li>
</ol>

<h2>Paketler ve ücret</h2>

<p>Sabit bir paket listesi vermiyorum, çünkü iki kişinin ihtiyacı aynı olmuyor: biri yalnız modelleme istiyor, bir diğeri modelleme + render + sunum istiyor, bir başkası yalnız imalat çizimi için geliyor.</p>

<ul>
  <li>Ders sayısı ve toplam süre: seviyenize göre, genelde 16–30 saat arası.</li>
  <li>İçerik: yalnız modelleme ya da modelleme + render.</li>
  <li>Biçim: online birebir ya da yüz yüze.</li>
</ul>

<p>Size uygun programı ve güncel ücreti konuşmak için WhatsApp'tan yazmanız yeterli — genelde aynı gün dönüyorum.</p>

${cta("Fiyat ve program için WhatsApp'tan yazın")}

<h2>Ders bitince elinizde ne kalıyor?</h2>

<p>Eğitimin sonunda hedef "programı gördüm" değil, <strong>kendi işinizi baştan sona tek başınıza çıkarabilmek</strong>. Pratikte şu üçü kalıyor:</p>

<ul>
  <li><strong>Bitmiş bir proje.</strong> Ders boyunca kendi işinizi çiziyoruz; sonunda sunulabilir bir model ve görseliniz oluyor.</li>
  <li><strong>Ders kayıtları ve notlar.</strong> Kayıt aldıysak, unuttuğunuz adımı sonradan tekrar izliyorsunuz.</li>
  <li><strong>Çalışma düzeni.</strong> Bileşen mantığı, etiket düzeni, ölçü alışkanlığı — asıl kalıcı olan bunlar. Program sürümü değişse de bu düzen değişmiyor.</li>
</ul>

<p>Ders bittikten sonra takıldığınız bir yer olursa yazabilirsiniz; kısa sorular için kapıyı kapatmıyorum.</p>

<h2>Eğitmen: Ufuk Şen</h2>

<p>1997'den beri inşaat ve 3B sektörünün içindeyim; yıllardır SketchUp eğitmenliği yapıyorum. Udemy'de <strong>${KURS} eğitim setim</strong> var; bu setlerde toplam <strong>${DERS} ders</strong> ve <strong>${OGRENCI} öğrenci</strong> bulunuyor. SketchUp Türkiye YouTube kanalında ücretsiz dersler yayımlıyorum ve mimari görselleştirme projeleri üretmeye devam ediyorum.</p>

<p>Ayrıca SketchUp için eklentiler geliştiriyorum. Dersin bir faydası da bu: programın içinde hangi işin nerede tıkandığını, o tıkanıklığı çözen aracı yazmış biri olarak anlatıyorum.</p>

<p>Hakkımda ayrıntı: <a href="/ufuk-sen-kimdir">Ufuk Şen kimdir</a> · Eğitim setleri: <a href="/egitimler">Udemy eğitim setleri</a></p>

<h2>Sıkça sorulan sorular</h2>

${SSS.map((x) => `<h3>${x.s}</h3>\n<p>${x.c}</p>`).join("\n\n")}

${cta("Sorunuzu WhatsApp'tan sorun")}
`;

/* ------------------------------------------------------------------ */
/* Şema — tek @graph                                                   */
/* ------------------------------------------------------------------ */

const SITE = "https://www.ufuksen.com";
const SAYFA = `${SITE}/sketchup-ozel-ders`;

/**
 * Offer / price ve AggregateRating BİLEREK yok: gerçek fiyat listesi ve
 * doğrulanmış değerlendirme verisi elimizde yok. Uydurma yapılandırılmış veri
 * zengin sonuç ihlalidir.
 */
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": `${SAYFA}#hizmet`,
      name: "SketchUp Özel Ders",
      serviceType: "Online birebir SketchUp eğitimi",
      description:
        "Online birebir SketchUp özel ders: modelleme, eklentiler ve V-Ray, Enscape, D5 Render, Twinmotion ile görselleştirme. Program seviyeye göre kurulur.",
      provider: { "@id": `${SITE}/ufuk-sen-kimdir#kisi` },
      areaServed: { "@type": "Country", name: "TR" },
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: SAYFA,
        availableLanguage: { "@type": "Language", name: "Turkish", alternateName: "tr" },
      },
      audience: {
        "@type": "Audience",
        audienceType: "Mimar, iç mimar, öğrenci, mobilya ve dolap üreticisi",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${SAYFA}#sss`,
      mainEntity: SSS.map((x) => ({
        "@type": "Question",
        name: x.s,
        acceptedAnswer: { "@type": "Answer", text: x.c.replace(/<[^>]+>/g, "") },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SAYFA}#yol`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Ana sayfa", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Eğitimler", item: `${SITE}/egitimler` },
        { "@type": "ListItem", position: 3, name: "SketchUp Özel Ders", item: SAYFA },
      ],
    },
    {
      "@type": "Person",
      "@id": `${SITE}/ufuk-sen-kimdir#kisi`,
      name: "Ufuk Şen",
      url: `${SITE}/ufuk-sen-kimdir`,
      jobTitle: "3B görselleştirme uzmanı ve SketchUp eğitmeni",
      /** Yalnız sitede zaten yayımlanmış, doğrulanmış adresler. */
      sameAs: [
        "https://www.udemy.com/user/ufuksen/",
        "https://www.youtube.com/@sketchupturkiye",
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */

const kayit = JSON.parse(fs.readFileSync(DOSYA, "utf8"));
const oncekiKelime = kayit.contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

kayit.title = "SketchUp Özel Ders (Online & Birebir)";
kayit.excerpt =
  "Online birebir SketchUp özel ders: modelleme, eklentiler ve render motorları. Program seviyenize ve işinize göre kurulur.";
kayit.contentHtml = GOVDE.trim();
kayit.modifiedAt = "2026-11-18 10:00:00";
kayit.seo = {
  ...kayit.seo,
  title: "SketchUp Özel Ders – Online Birebir Eğitim | Ufuk Şen",
  description:
    "Online birebir SketchUp özel ders: modelleme, eklentiler, V-Ray/Enscape/D5 render. Seviyenize göre program, kayıtlı dersler. WhatsApp'tan hemen yazın.",
  focusKeyword: "sketchup özel ders",
  canonicalUrl: SAYFA,
  noindex: false,
};
kayit.jsonLd = jsonLd;
kayit.migrationChecksum = crypto.createHash("sha256").update(kayit.contentHtml, "utf8").digest("hex");

fs.writeFileSync(DOSYA, JSON.stringify(kayit, null, 2) + "\n", "utf8");

const kelime = kayit.contentHtml.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const say = (d) => (kayit.contentHtml.match(d) ?? []).length;
console.log(`kelime       : ${oncekiKelime} → ${kelime}`);
console.log(`H2 / H3      : ${say(/<h2/g)} / ${say(/<h3/g)}`);
console.log(`SSS          : ${SSS.length} soru (şemada da aynısı)`);
console.log(`iç bağlantı  : ${say(/href="\//g)} | WhatsApp CTA: ${say(/ozel-ders-cta/g)}`);
console.log(`seo.title    : ${kayit.seo.title.length} krk`);
console.log(`seo.descr.   : ${kayit.seo.description.length} krk`);
console.log(`"Sketchup" yanlış yazım kaldı mı: ${/Sketchup/.test(kayit.contentHtml)}`);
