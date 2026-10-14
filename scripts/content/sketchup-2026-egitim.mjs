/**
 * "SketchUp 2026 Profesyonel Eğitim — En İyi Uzmanından" yazısını üretir.
 *
 * Bu yazı WordPress göçünden gelmiyor; elle yazıldı. Yine de diğer yazılarla
 * aynı şemayı kullanır (src/content.config.ts), çünkü liste, arama, RSS ve
 * benzer-yazı mantığı tek bir şekle bakıyor.
 *
 * KAYNAKLAR (uydurma bilgi yok — AGENTS.md §5):
 *   - SketchUp Desktop 2026.0 sürüm notları (help.sketchup.com, 7 Ekim 2025,
 *     yapı 26.0.429 Windows / 26.0.428 Mac)
 *   - SketchUp sistem gereksinimleri sayfası (help.sketchup.com)
 *   - renderfun.com (Render Fun'ın kendi sayfasında yazan özellikler)
 *   - src/content/products/*.json (kendi eklentilerimizin gerçek verisi)
 *   - src/content/courses.json (Udemy eğitmen profilinden okunan gerçek setler)
 *
 * Grafikler SVG olarak koda gömülüdür: ekran görüntüsü taklidi değil, açıkça
 * "şema" diye etiketlenmiş çizimlerdir. Uydurma arayüz fotoğrafı üretmedik.
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const KOK = process.cwd();
const SLUG = "sketchup-2026-profesyonel-egitim";
const URL_YOL = `/${SLUG}.html`;

import {
  sekilYenilikler,
  sekilGereksinim,
  sekilArayuz,
  sekilEklenti,
  sekilEklentilerimiz,
  sekilRender,
  sekilYolHaritasi,
  kapakSvg,
} from './sketchup-2026-sekiller.mjs';

/* ------------------------------------------------------------------ */
/* Yazı gövdesi                                                        */
/* ------------------------------------------------------------------ */
/**
 * Şekiller ayrı .svg dosyasına yazılır ve <img> ile gömülür.
 *
 * NEDEN <img>: gövdeye gömülü SVG telefonda 301px'e sıkışıp okunmaz hâle
 * geliyordu (ölçüldü: ölçek 0,54 — 12px'lik yazı ekranda 6,5px). <img>
 * olunca Base.astro'daki büyüteç devreye giriyor: dokununca tam ekran
 * açılıyor ve SVG olduğu için her ölçüde keskin kalıyor. Ayrıca yazının
 * HTML'i şişmiyor ve şekiller ayrı ayrı önbelleğe alınıyor.
 */
const sekilDizin = path.join(KOK, "public", "media", "yazi");
fs.mkdirSync(sekilDizin, { recursive: true });

function figur(ad, svgKod, altyazi) {
  const vb = svgKod.match(/viewBox="0 0 (\d+) (\d+)"/);
  if (!vb) throw new Error("viewBox okunamadi: " + ad);
  const dosya = SLUG + "-" + ad + ".svg";
  fs.writeFileSync(path.join(sekilDizin, dosya), svgKod, "utf8");
  return (
    '<figure><img src="/media/yazi/' +
    dosya +
    '" alt="' +
    altyazi +
    '" width="' +
    vb[1] +
    '" height="' +
    vb[2] +
    '" loading="lazy" decoding="async" /><figcaption>' +
    altyazi +
    "</figcaption></figure>"
  );
}

const GOVDE = `
<p><strong>SketchUp 2026 eğitimi</strong> arayan çoğu kişi aslında tek bir şey istiyor: programı kurup açtıktan sonra ne yapacağını bilmek. Menüleri ezberlemek değil, <em>bir projeyi baştan sona götürebilmek</em>. Bu yazı tam olarak o yolu anlatıyor — SketchUp 2026 kurulumundan arayüzün mantığına, eklenti kurmaktan ücretsiz <a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a> ile görselleştirmeye kadar.</p>

<p>Aşağıdaki başlıklar, birebir verdiğimiz profesyonel SketchUp eğitiminin iskeletidir. Mimar, iç mimar, mobilyacı, peyzaj mimarı ya da teknik ressam olun; sıra aynı: önce temel, sonra hız, en sonunda görsel.</p>

<h2>SketchUp 2026 eğitimi kimin için?</h2>

<p>SketchUp'ın en büyük avantajı öğrenme eğrisinin kısa olması. Ama kısa olması, kendi kendine öğrenildiğinde eksiksiz olacağı anlamına gelmiyor. Pratikte en sık gördüğümüz tablo şu:</p>

<ul>
  <li><strong>Sıfırdan başlayan</strong> — çizgi çekiyor, yüzey kapanmıyor; grup ile bileşen arasındaki farkı bilmediği için model şişiyor.</li>
  <li><strong>Kendi kendine öğrenmiş</strong> — modelliyor ama saatlerce sürüyor; aynı dolabı yirmi kez elle çiziyor.</li>
  <li><strong>Hız sorunu olan</strong> — model büyüdükçe program takılıyor, dosya açılmıyor.</li>
  <li><strong>Görsel alamayan</strong> — model bitmiş, ama render'ı ya plastik görünüyor ya da bilgisayarı günlerce meşgul ediyor.</li>
</ul>

<p>Eğitim bu dördünü aynı sırayla çözüyor. <strong>SketchUp 2026 dersleri</strong> boyunca her konu bir önceki konunun üstüne biniyor; atlanan hiçbir adım yok.</p>

${figur("yol-haritasi", sekilYolHaritasi, "Eğitimin altı duraklı yol haritası: temel oturmadan eklenti, eklenti oturmadan render yok.")}

<h2>SketchUp 2026 ile ne değişti?</h2>

<p>SketchUp Desktop 2026.0, <strong>7 Ekim 2025</strong>'te yayımlandı (Windows için 26.0.429, Mac için 26.0.428 yapısıyla). Eğitimde sürüm notlarını satır satır okumuyoruz; günlük işinizi değiştirenleri ayırıyoruz.</p>

${figur("yenilikler", sekilYenilikler, "SketchUp 2026.0'ın resmî sürüm notlarında yer alan başlıklar, konu alanlarına göre.")}

<h3>Ortak çalışma: Collaboration Bar</h3>
<p>2026'nın en görünür yeniliği <strong>Collaboration Bar</strong>. Modeli özel bir davetle ya da genel bir bağlantıyla paylaşıyorsunuz; karşı taraf modeli canlı görüyor, ölçü alabiliyor ve <strong>Comment</strong> aracıyla doğrudan 3B'nin içine yorum bırakabiliyor. Bu yorum işaretçileri sahnelere ve kamera açılarına bağlanabiliyor. Müşteriye "şu duvarı mı diyorsunuz?" diye sormakla geçen yazışmaları kısaltan bir özellik.</p>

<h3>Görselleştirme: Ambient Occlusion ve malzeme kontrolü</h3>
<p>Ambient Occlusion artık <strong>Distance Multiplier</strong> kaydırıcısı ve bir renk seçeneğiyle geliyor; yani köşe gölgelerinin ne kadar yayılacağını ve hangi renge çalacağını siz söylüyorsunuz. Malzeme tarafında <strong>Invert Roughness</strong>, pürüzlülük haritasının siyah-beyaz değerlerini ters çeviriyor — yanlış hazırlanmış bir PBR dokusunu düzeltmenin en kısa yolu. Windows'ta malzeme küçük resimlerini otomatik, küp ya da düz olarak seçebiliyorsunuz.</p>

<h3>Başarım: büyük modelde rahatlama</h3>
<p>Trimble, model yükleme ve bileşen bellek kullanımında iyileştirme yaptığını, <em>Zoom Extents</em>'in yaklaşık %90, sahne geçişlerinin ise yaklaşık %86 daha akıcı olduğunu bildiriyor. Bu rakamlar üreticinin kendi iç ölçümlerinden geliyor; bağımsız olarak doğrulanmış değil. Yine de kullanılmayan etiketleri temizlemenin gözle görülür biçimde hızlandığını söyleyebiliriz.</p>

<h3>LayOut: dört yeni çizim aracı</h3>
<p>Pafta tarafında <strong>Trim, Extend, Fillet ve Chamfer</strong> eklendi. Daha önce SketchUp'ta çizip LayOut'a atmak zorunda kaldığınız birçok 2B düzeltmeyi artık doğrudan paftada yapabiliyorsunuz. Yeni <strong>Architecture Scrapbook</strong> içinde kapı, pencere ve oda tipi öğeler hazır geliyor.</p>

<h3>Veri alışverişi: DWG ve IFC</h3>
<p>DWG içe aktarımı artık taramaları (hatch) tanıyor, 3B DWG dışa aktarımı kesit düzlemlerini koruyor. IFC tarafında 2x3 ve 4 seçenekleri tek bir dosya türünde birleşti. Ofisler arası dosya alışverişi yapıyorsanız bu üç madde, sürüm notlarının geri kalanından daha önemli.</p>

<h2>SketchUp 2026 kurulumu: bilgisayarınız hazır mı?</h2>

<p>Kurulumda yaşanan sorunların çoğu kurulumla değil, donanımla ilgili. SketchUp 2026 artık <strong>yalnızca Windows 11</strong>'i ve macOS tarafında 26, 15 ve 14 sürümlerini listeliyor. Yani Windows 10'da kalmış bir makinede SketchUp 2026 kurulumu resmî olarak desteklenmiyor.</p>

${figur("gereksinimler", sekilGereksinim, "SketchUp 2026'nın resmî sistem gereksinimleri; yeni grafik motoru Windows'ta DirectX 12, Mac'te Metal 2 istiyor.")}

<p>İki ayrıntı özellikle önemli:</p>
<ul>
  <li><strong>İki grafik motoru var.</strong> Klasik motor OpenGL 3.1 ile çalışıyor; yeni motor Windows'ta DirectX 12 (özellik düzeyi 11.0), macOS'ta Metal 2 istiyor. Cihazınız yetmiyorsa SketchUp kendiliğinden klasik motora düşüyor — program açılmıyor sanmayın, sadece yeni motoru kullanamıyorsunuz.</li>
  <li><strong>VRAM, RAM'den önce geliyor.</strong> PBR dokular, Ambient Occlusion ve görüntü tabanlı aydınlatmayla çalışacaksanız Windows tarafında 32 GB VRAM öneriliyor. Render'a girmeyecekseniz 8 GB'lık ayrı bir kart da iş görüyor.</li>
</ul>

<h3>Adım adım SketchUp 2026 kurulumu</h3>
<ol>
  <li>Sistem gereksinimlerini yukarıdaki tabloyla karşılaştırın; özellikle işletim sistemi sürümünü.</li>
  <li>Kurulum dosyasını yalnızca resmî kaynaktan indirin. Windows'ta <strong>.NET Framework 4.5.2</strong> kurulu olmalı.</li>
  <li>Kurulumu ve abonelik yetkilendirmesini internet bağlıyken yapın; ikisi de bağlantı istiyor.</li>
  <li>İlk açılışta şablonu seçin. Türkiye'de çalışıyorsanız <em>milimetre</em> ya da <em>santimetre</em> tabanlı bir mimari şablon seçin; sonradan değiştirmek baş ağrıtıyor.</li>
  <li>Eklentileri <strong>kurulumdan sonra</strong> ekleyin — önce programın temiz açıldığını görün.</li>
</ol>

<p>2026'da gelen küçük ama işe yarar bir yenilik: <strong>Manage Activations</strong> ekranından tüm etkinleştirmeleri sıfırlayıp o anki cihazı yetkilendirebiliyorsunuz. Bilgisayar değiştirenlerin eskiden destek hattına yazmak zorunda kaldığı iş, artık programın içinde.</p>

<h2>SketchUp 2026 arayüzü: hangi panel ne işe yarar?</h2>

<p>SketchUp arayüzü ilk bakışta sade görünür ve bu sadelik yanıltıcıdır: gücün çoğu menülerde değil, <strong>çıkarım (inference) sistemi</strong> ile <strong>ölçü kutusunda</strong> saklıdır. Aşağıdaki şema, eğitimin ilk dersinde çizdiğimiz haritanın aynısı.</p>

${figur("arayuz", sekilArayuz, "SketchUp 2026 arayüzünün şematik yerleşimi. Bu bir ekran görüntüsü değil, panellerin yerini gösteren çizimdir.")}

<h3>Çıkarım sistemi: SketchUp'ın asıl sırrı</h3>
<p>Fareyi gezdirdiğinizde beliren renkli noktalar ve kesikli çizgiler rastgele değil: yeşil nokta uç nokta, mavi nokta orta nokta, kesikli renkli çizgiler eksen paralelliğidir. Eğitimde ilk öğrettiğimiz alışkanlık şu — <em>çizmeden önce bekleyin</em>. SketchUp size hangi noktaya kilitlendiğini söyler; siz de o kilidi <kbd>Shift</kbd> ile sabitlersiniz. Bu tek alışkanlık, modelleme hızını katlıyor.</p>

<h3>Ölçü kutusu: fareyle değil, klavyeyle modelleme</h3>
<p>Sağ alttaki ölçü kutusuna tıklamanıza gerek yok. Aracı seçin, yönü gösterin, sayıyı yazın, <kbd>Enter</kbd>. Dikdörtgen için <code>3000;2500</code>, itme-çekme için <code>280</code>. Profesyonel kullanımla amatör kullanım arasındaki en net fark burada görünür.</p>

<h3>Grup, bileşen ve etiket</h3>
<p>Üçü karıştırıldığında model hem şişer hem yönetilemez hâle gelir. Kuralı basit tutuyoruz: <strong>birebir aynı parça birden çoksa bileşen</strong>, benzersizse grup. Etiket ise görünürlük içindir, parça ayırmak için değil. 2026'da sahne değişikliklerini geri alabiliyor olmanız, bu düzeni kurarken hata yapma korkusunu kaldırıyor.</p>

<h2>SketchUp'a eklenti (plugin) nasıl kurulur?</h2>

<p><strong>SketchUp eklenti kurma</strong> konusu, eğitimde en çok soru alan başlık. Üç yol var ve üçü de aynı yere çıkıyor.</p>

${figur("eklenti-kurma", sekilEklenti, "SketchUp'a eklenti kurmanın üç yolu. Hangisi olursa olsun kurulumdan sonra programı yeniden başlatın.")}

<h3>1. Extension Warehouse ile kurmak</h3>
<p>En kolayı. <em>Uzantılar → Extension Warehouse</em> menüsünden mağazayı açıp eklentiyi aratıyor, <strong>Install</strong> diyorsunuz. Güncellemeler de buradan geliyor. SketchUp hesabınızla oturum açmanız gerekiyor.</p>

<h3>2. .rbz dosyasını Extension Manager ile kurmak</h3>
<p>Satın aldığınız ya da doğrudan geliştiriciden aldığınız eklentiler genelde <code>.rbz</code> uzantılı tek bir dosya hâlinde gelir. <em>Uzantılar → Extension Manager → Install Extension</em> deyip dosyayı seçiyorsunuz. Bu, bizim eklentilerimizin de standart kurulum yolu.</p>

<h3>3. Plugins klasörüne elle kopyalamak</h3>
<p>Dosyası büyük eklentilerde Extension Manager zaman aşımına uğrayabiliyor. O zaman SketchUp kapalıyken <code>.rbz</code> dosyasını bir zip aracıyla açıp içindekileri şu klasöre çıkarıyorsunuz:</p>
<pre><code>%APPDATA%\\SketchUp\\SketchUp 2026\\SketchUp\\Plugins</code></pre>
<p>Sonra SketchUp'ı açıyorsunuz. Render Fun'ın önerdiği kurulum yolu da bu.</p>

<h3>Eklenti kurarken en sık yapılan üç hata</h3>
<ul>
  <li><strong>SketchUp açıkken kurmak.</strong> Klasöre elle kopyalıyorsanız program kapalı olmalı.</li>
  <li><strong>.rbz'yi açıp içindeki .rb'yi tek başına kopyalamak.</strong> Eklentinin yanındaki klasör de gerekir.</li>
  <li><strong>Yanlış sürüm klasörü.</strong> 2025 ve 2026 ayrı klasörler kullanır; birine kurduğunuz eklenti diğerinde görünmez.</li>
</ul>

<h2>Dersi zenginleştiren kendi eklentilerimiz</h2>

<p>Eğitimi diğerlerinden ayıran kısım burası. Yıllardır SketchUp için eklenti geliştiriyoruz ve derste bunları <em>kendi yazdığımız araçlar</em> olarak değil, <strong>iş akışının parçası</strong> olarak kullanıyoruz: önce işin elle nasıl yapıldığını gösteriyoruz, sonra aynı işi eklentiyle yapıyoruz. Aradaki farkı siz görüyorsunuz.</p>

${figur("eklentilerimiz", sekilEklentilerimiz, "Derste kullanılan kendi eklentilerimiz, iş koluna göre. Listedeki tüm eklentiler SketchUp 2026 ile uyumlu.")}

<ul>
  <li><strong>Yapı kabuğu:</strong> <a href="/eklenti/archiflow.html">ArchiFlow Studio</a> ile planı bir kez çizip duvarı kaydırdığınızda binanın kendini yeniden kurmasını; <a href="/eklenti/roadflow.html">RoadFlow</a> ile güzergâhtan yol ve arazi üretmeyi; <a href="/eklenti/cityfill.html">CityFill</a> ile binanın çevresini birkaç tıkta doldurmayı işliyoruz.</li>
  <li><strong>Yapı elemanı:</strong> <a href="/eklenti/door-studio.html">Kapı Stüdyosu</a> duvarı kendi oyuyor, <a href="/eklenti/windowfun-studio.html">WindowFun Studio</a> ölçüden pencereyi ve teklifi birlikte çıkarıyor, <a href="/eklenti/stairfun-studio.html">StairFun Studio</a> yönetmeliğe uygun merdiveni iki tıkla kuruyor, <a href="/eklenti/ramp-studio.html">Rampa Stüdyosu</a> eğimi kontrol altında tutuyor.</li>
  <li><strong>İç mekân:</strong> <a href="/eklenti/floorstudio.html">FloorStudio</a> her parçayı odaya kesip CSV'ye döküyor, <a href="/eklenti/wardrobe-studio.html">Dolap Sihirbazı</a> ölçüden dolabı, teklifi ve CNC dosyalarını üretiyor, <a href="/eklenti/furnifun.html">FurniFun</a> boş odayı gerçek mobilyayla dolduruyor, <a href="/eklenti/curtain-craft.html">PerdeNeşe Studio</a> perde ve kornişi üç tıka indiriyor.</li>
  <li><strong>Cephe ve çevre:</strong> <a href="/eklenti/kompozit-studio.html">Kompozit Studio</a> cepheyi ACM sistemi ve metrajıyla kuruyor, <a href="/eklenti/landscape-studio.html">Peyzaj Stüdyosu</a> alanı bir kez şekillendirdiğinizde geri kalanını uyduruyor, <a href="/eklenti/garden-wall-studio.html">Bahçe Duvarı Stüdyosu</a> eğimi izleyen duvarı kapısıyla getiriyor.</li>
  <li><strong>Yardımcı araçlar:</strong> <a href="/eklenti/soft-edge.html">Yumuşak Kenar</a> ile tek tıkla yuvarlatma ve pah, <a href="/eklenti/dynamic-skirting.html">Dynamic Skirting</a> ile gönye kesmeden süpürgelik ve kartonpiyer, <a href="/eklenti/universal-converter.html">Evrensel Dönüştürücü</a> ile her formatı temiz geometriyle içeri alma.</li>
</ul>

<p>Eklentilerin tamamını <a href="/sketchup-en-iyi-pluginleri.html">SketchUp En İyi Pluginleri</a> sayfasından inceleyebilirsiniz. Derste amaç eklenti satmak değil; <em>bir işi neden elle yapmamanız gerektiğini</em> göstermek. Mantığı anladıktan sonra hangi aracı kullandığınız sizin seçiminiz.</p>

<h2>Render ve görselleştirme: ücretsiz Render Fun ile</h2>

<p>Eğitimin son bölümü <strong>3B görselleştirme</strong>. Burada çoğu kursun yaptığı hatayı yapmıyoruz: pahalı bir render motoruna bağlı kalmıyoruz. Derse, kendi geliştirdiğimiz ücretsiz render motoru <a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a> ile başlıyoruz.</p>

${figur("render-akisi", sekilRender, "Render Fun'ın akışı: model doğrudan okunur, ışın izlenir, gürültü giderilir, sonuç Render Buffer'da saklanır.")}

<p>Render Fun'ı derste tercih etmemizin nedenleri şunlar:</p>
<ul>
  <li><strong>Ücretsiz ve engelsiz.</strong> Hesap açmak, lisans anahtarı girmek ya da deneme süresi beklemek gerekmiyor. Öğrenci, dersin ilk dakikasında render almaya başlayabiliyor.</li>
  <li><strong>SketchUp'ın içinde çalışıyor.</strong> Modeli dışa aktarma, başka programa alma, malzemeleri yeniden atama derdi yok; model doğrudan okunuyor.</li>
  <li><strong>Gerçek ışın izleme.</strong> Işık duvarlardan sekerek ve camdan geçerek hesaplanıyor; ilk görüntü hemen geliyor, örnek sayısı arttıkça netleşiyor. Hızlı bir gürültü giderici önizlemeyi temiz tutuyor.</li>
  <li><strong>Kütüphane içinde geliyor.</strong> 20 kategoride malzeme kütüphanesi, 298 doku seti, 129 türlük bitki paketi ve 10 gömülü HDRI eklentinin içinde; internet bile gerekmiyor.</li>
  <li><strong>Işık eğitimi için uygun.</strong> Nokta, spot ve panel lambalar, IES dağılımı ve render sonrası lamba ışığı ayarı var. Aydınlatma mantığını denemeli öğrenmenin en hızlı yolu.</li>
  <li><strong>Renk yönetimi öğretilebiliyor.</strong> AgX, ACES ve Filmic seçenekleriyle aynı sahnenin nasıl farklı göründüğünü yan yana gösterebiliyoruz.</li>
</ul>

<p>Render Fun SketchUp 2021–2026 ile çalışıyor, ayarlar 2023 ve sonrasında en iyi sonucu veriyor; şu an yalnızca Windows'ta ve WebGL2 destekli bir ekran kartı istiyor. Arayüzü Türkçe ve İngilizce.</p>

<h3>Peki ticari render motorları?</h3>
<p>Render Fun temeli kurduktan sonra, işinize hangisi uyuyorsa ona geçiyoruz. <a href="/yazilim/vray">V-Ray</a>, <a href="/yazilim/d5-render">D5 Render</a>, <a href="/yazilim/enscape">Enscape</a> ve <a href="/yazilim/twinmotion">Twinmotion</a> için ayrı eğitim setlerimiz var; hepsinin ortak mantığı aynı olduğu için biriyle öğrendiğinizi diğerine taşıyabiliyorsunuz. Işık, malzeme ve kamera bilgisi motordan motora değişmiyor — değişen sadece düğmelerin yeri.</p>

<h2>Eğitim nasıl ilerliyor?</h2>

<p>Program birebir ve proje üzerinden ilerliyor. Hazır bir model üzerinde düğme göstermek yerine, sizin işinizden bir projeyi baştan sona götürüyoruz: ölçüden modele, modelden eklentilere, eklentilerden render'a, render'dan paftaya.</p>

<p>Yayımlanmış eğitim setlerimizden bazıları şunlar:</p>
<ul>
  <li><a href="https://www.udemy.com/course/sketchup-icin-en-iyi-pluginler-is-aksn-hzlandr/" target="_blank" rel="noopener">SketchUp için En İyi Pluginler: İş Akışını Hızlandır</a> — 41 ders</li>
  <li><a href="https://www.udemy.com/course/sketchup-2023-en-iyi-temel-egitim-kursu-01/" target="_blank" rel="noopener">SketchUp Temel Eğitim Kursu</a> — sıfırdan temeller</li>
  <li><a href="https://www.udemy.com/course/sketchup-vray-7-hzl-ve-profesyonel-salon-render-egitimi/" target="_blank" rel="noopener">SketchUp V-Ray 7: Hızlı ve Profesyonel Salon Render Eğitimi</a></li>
  <li><a href="https://www.udemy.com/course/fast-realistic-rendering-sketchup-to-d5-render-workflow/" target="_blank" rel="noopener">Fast &amp; Realistic Rendering: SketchUp to D5 Render Workflow</a> — İngilizce</li>
</ul>

<p>Tüm setleri <a href="/egitimler">eğitimler sayfasında</a> görebilirsiniz. SketchUp 2026 sürümüne özel birebir eğitim için <a href="/iletisim">iletişim sayfasından</a> yazmanız yeterli.</p>

<h2>Sıkça sorulan sorular</h2>

<h3>SketchUp 2026 Windows 10'a kurulur mu?</h3>
<p>Resmî sistem gereksinimleri yalnızca Windows 11'i listeliyor. Windows 10'da kalan bir makinede SketchUp 2026 desteklenen bir yapılandırma değil.</p>

<h3>SketchUp öğrenmek ne kadar sürer?</h3>
<p>Temel modellemeyi birkaç günde kavrayabilirsiniz. Asıl fark, grup-bileşen-etiket düzenini kurmayı ve çıkarım sistemini doğru kullanmayı öğrendiğinizde ortaya çıkar; orası alışkanlık işi ve pratik gerektirir.</p>

<h3>SketchUp eklentileri ücretli mi?</h3>
<p>Extension Warehouse'da çok sayıda ücretsiz eklenti var. Bizim geliştirdiğimiz eklentilerin bir kısmı ücretli; render motorumuz <a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a> ise tamamen ücretsiz ve lisans anahtarı istemiyor.</p>

<h3>Render için güçlü bilgisayar şart mı?</h3>
<p>Modelleme için şart değil. Render'a girdiğinizde ekran kartı belirleyici oluyor: PBR doku, Ambient Occlusion ve görüntü tabanlı aydınlatmayla çalışacaksanız SketchUp'ın kendi sayfası Windows tarafında 32 GB VRAM öneriyor. Render Fun ise WebGL2 destekli bir kart istiyor.</p>

<h3>Eklenti kurduktan sonra görünmüyorsa ne yapmalı?</h3>
<p>Önce SketchUp'ı tamamen kapatıp açın. Hâlâ yoksa <em>Uzantılar → Extension Manager</em> listesinde eklentinin görünüp görünmediğine ve devre dışı bırakılmış olup olmadığına bakın. Elle kopyaladıysanız klasör yolunun sürümle eşleştiğinden emin olun: 2026 için <code>SketchUp 2026</code> klasörü.</p>

<h2>Nereden başlamalı?</h2>

<p>Yapılacak sıra net: önce <strong>SketchUp 2026 kurulumunu</strong> ve sistem gereksinimlerini halledin, sonra arayüzü ve çıkarım sistemini oturtun, ardından <strong>eklenti kurmayı</strong> öğrenip iş akışınızı hızlandırın, en sonunda <a href="https://renderfun.com/" target="_blank" rel="noopener">Render Fun</a> ile görselleştirmeye geçin.</p>

<p>Bu yolu tek başınıza da yürüyebilirsiniz; yazıdaki her adım bunun için yazıldı. Hızlandırmak isterseniz <a href="/egitimler">eğitim setlerine</a> göz atın ya da birebir program için <a href="/iletisim">bana yazın</a>.</p>
`;

/* ------------------------------------------------------------------ */
/* Yazma                                                               */
/* ------------------------------------------------------------------ */
const kelime = GOVDE.replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
const okuma = Math.max(1, Math.round(kelime / 200));

const kapakDizin = path.join(KOK, "public", "media", "yazi");
fs.mkdirSync(kapakDizin, { recursive: true });
const kapakYol = path.join(kapakDizin, `${SLUG}.webp`);

await sharp(Buffer.from(kapakSvg)).resize(1600, 900).webp({ quality: 88 }).toFile(kapakYol);
const kapakBoyut = fs.statSync(kapakYol).size;

const kayit = {
  legacyId: 90001,
  slug: SLUG,
  legacyUrl: URL_YOL,
  url: URL_YOL,
  title: "SketchUp 2026 Profesyonel Eğitim — En İyi Uzmanından",
  excerpt:
    "SketchUp 2026 kurulumundan arayüze, eklenti kurmaktan ücretsiz Render Fun ile görselleştirmeye kadar profesyonel eğitimin bütün adımları; kendi geliştirdiğimiz eklentilerle zenginleştirilmiş bir yol haritası.",
  contentHtml: GOVDE.trim(),
  publishedAt: "2026-10-14 09:00:00",
  modifiedAt: "2026-10-14 09:00:00",
  status: "publish",
  featuredImage: {
    legacyUrl: `/media/yazi/${SLUG}.webp`,
    localPath: `/media/yazi/${SLUG}.webp`,
    alt: "SketchUp 2026 profesyonel eğitim kapak görseli",
    width: 1600,
    height: 900,
    mimeType: "image/webp",
  },
  inlineMedia: [],
  embeds: [],
  seo: {
    title: "SketchUp 2026 Profesyonel Eğitim: Kurulum, Arayüz, Eklenti ve Render",
    description:
      "SketchUp 2026 kurulumu, arayüzü, eklenti kurma ve ücretsiz Render Fun ile görselleştirme: profesyonel eğitimin bütün adımları tek yazıda.",
    focusKeyword: "sketchup 2026 eğitim",
    canonicalUrl: `https://www.ufuksen.com${URL_YOL}`,
    ogImage: `/media/yazi/${SLUG}.webp`,
  },
  readingMinutes: okuma,
  migrationChecksum: crypto.createHash("sha256").update(GOVDE.trim(), "utf8").digest("hex"),
  author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
  categories: [
    { legacyId: 1172, name: "Sketchup", slug: "sketchup" },
    { legacyId: 518, name: "3D Görselleştirme", slug: "3d-gorsellestirme" },
    { legacyId: 1177, name: "Ücretsiz İçerikler", slug: "ucretsiz-icerikler" },
  ],
  tags: [],
};

const hedef = path.join(KOK, "src", "content", "posts", `${SLUG}.json`);
fs.writeFileSync(hedef, JSON.stringify(kayit, null, 2) + "\n", "utf8");

console.log("yazi yazildi :", path.relative(KOK, hedef));
console.log("kapak        :", path.relative(KOK, kapakYol), `(${(kapakBoyut / 1024).toFixed(0)} KB)`);
console.log("kelime       :", kelime, "| okuma:", okuma, "dk");
console.log("sekil sayisi :", (GOVDE.match(/<figure>/g) || []).length);
