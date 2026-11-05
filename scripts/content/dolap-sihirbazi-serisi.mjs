/**
 * Dolap Sihirbazı yazı dizisi — kullanıcının verdiği dört başlık, iki dilde.
 *
 * Başlıklar (5 Kasım 2026, kullanıcının kendi yazdığı sıra):
 *   1. Sürükle Bırak Dolabın Hazır
 *   2. 1 Dk'da Mutfak Tasarla Üretime Geç
 *   3. Kertik Kiriş Sorun Değil!
 *   4. Sadece Ölçüyü Gir Gerisini Mutfak Programı Halletsin
 *
 * Her yazı gün içine yayıldı (09:00 / 12:00 / 15:00 / 18:00) ve İngilizce
 * karşılığı aynı saatte yayımlanıyor (ADR-027).
 *
 * KAYNAK — her teknik cümlenin dayanağı:
 *   bestsketchupplugins.com/tr/dolap-sihirbazi/   (ürün sayfası, kullanıcı
 *     "diğer bilgiler için bu linki kullan" dedi; 5 Kasım'da okundu)
 *   claudes/dolap-sihirbazi/docs/OZELLIKLER.md     (mutfak planı, kiriş kuralı,
 *     modül kütüphanesi, üretim çıktıları)
 *   claudes/dolap-sihirbazi-masaustu/docs/*        (Tauri/Rust, demo, sürüm)
 *   Ders 12 videosunun "Duvarlar ve kirişler" paneli (kiriş davranışı birebir)
 *
 * YAZILMAYANLAR: fiyat (değişiyor, ürün sayfasında), SketchUp'a aktarım
 * (masaüstünde köprü karara bağlanmadı), macOS (kurucu Windows).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const KOK = process.cwd();
const MAGAZA = { tr: "https://www.bestsketchupplugins.com/tr/dolap-sihirbazi/", en: "https://www.bestsketchupplugins.com/en/dolap-sihirbazi/" };
const LISTE = "https://www.youtube.com/playlist?list=PLGMnILfTDnFQ";
/** 3 Kasım'daki ana tanıtım yazısı — dizinin merkezi. */
const ANA_YAZI = "/dolap-sihirbazi-masaustu-dolap-mutfak-tasarim-programi.html";

const video = (kimlik, baslik, altyazi) => `
<figure class="yazi-video">
  <iframe src="https://www.youtube-nocookie.com/embed/${kimlik}" title="${baslik}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  <figcaption>${altyazi}</figcaption>
</figure>`;

const gorsel = (ad, alt, altyazi) => `
<figure>
  <img src="/media/dolap-sihirbazi/${ad}-960.webp" srcset="/media/dolap-sihirbazi/${ad}-960.webp 960w, /media/dolap-sihirbazi/${ad}-1280.webp 1280w" sizes="(min-width: 860px) 800px, 100vw" alt="${alt}" width="960" height="540" loading="lazy" decoding="async" />
  <figcaption>${altyazi}</figcaption>
</figure>`;

/** Satın alma / ürün sayfası yönlendirmesi — her yazının kapanışı. */
const kapanis = (dil) =>
  dil === "tr"
    ? `<p>Dolap Sihirbazı'nın bütün özellikleri, dersleri ve deneme sürümü ürün sayfasında: <a href="${MAGAZA.tr}" target="_blank" rel="noopener"><strong>Dolap Sihirbazı — Best SketchUp Plugins</strong></a>.</p>`
    : `<p>Every feature, the lesson series and the trial version are on the product page: <a href="${MAGAZA.en}" target="_blank" rel="noopener"><strong>Cabinet Wizard — Best SketchUp Plugins</strong></a>.</p>`;

/* ------------------------------------------------------------------ */
/* Yazılar                                                             */
/* ------------------------------------------------------------------ */

const YAZILAR = [
  {
    slug: "surukle-birak-dolabin-hazir",
    enSlug: "en/drag-and-drop-your-cabinet-is-ready",
    saat: "09:00:00",
    legacyId: 90020,
    tr: {
      title: "Sürükle Bırak, Dolabın Hazır",
      excerpt:
        "Modülü paletten tutup duvara bırakıyorsun: kabin, kapağı, menteşesi ve delikleriyle gerçek parçalara dönüşüyor. Kesim listesi aynı anda hazır.",
      seoTitle: "Sürükle Bırak Dolap Programı: Bırak, Dolap Hazır",
      seoDesc:
        "Dolap Sihirbazı'nda modülü sürükleyip bırakın: kabin gerçek panellerle kurulur, ölçüsünü milimetreyle yazarsınız, kesim listesi aynı anda çıkar.",
      keyword: "sürükle bırak dolap programı",
      govde: `
<p>Usta için en can sıkıcı iş, kafasında bitmiş olan dolabı programa anlatmaktır. Ölçüyü biliyorsun, nereye ne geleceğini biliyorsun — ama çizim penceresinde panelleri tek tek kurmak yarım saatini alıyor.</p>

<p><strong>Dolap Sihirbazı</strong>'nda o yarım saat yok. Soldaki paletten modülü tutuyorsun, duvara bırakıyorsun. Hepsi bu.</p>

${video("HyXdUio3BSY", "Sürükle bırak, hemen CNC'ye gönder — Dolap Sihirbazı", "Mutfağın tamamı sürükle-bırak ile kuruluyor, sonra aynı modelden CNC dosyaları çıkıyor.")}

<h2>Bıraktığın şey bir resim değil, gerçek bir dolap</h2>

<p>Fark burada. Bırakılan modül bir görsel ya da hazır blok değil: yan paneli, tablası, rafı, arkalığı, kapağı ve bazası ayrı ayrı <strong>gerçek parçalardır</strong>. Menteşe yuvası, raf pimi, minifiks ve kavela delikleri komşu panellere göre kendiliğinden açılır.</p>

<p>Yani bıraktığın anda dolap üretilebilir hâle gelmiş olur. Kesim listesine baktığında ekrandaki ölçülerin aynısını görürsün; "çizim bir şey diyor, atölye başka bir şey kesiyor" durumu ortadan kalkar.</p>

${gorsel("surukle-birak", "Dolap Sihirbazı'nda sürükle-bırak paleti ve mutfak planı", "Solda modül paleti, ortada plan: modül bırakıldığı duvara oturuyor.")}

<h2>245 hazır modül, aradığını yazarak bul</h2>

<p>Palet boş bir liste değil. Modül Kütüphanesi'nde <strong>245 hazır modül</strong> var: mutfak alt 49, mutfak üst 48, mutfak boy 28, banyo 59, panel / dolgu 37, gardırop 8, yatak odası 5, salon / TV 5, antre 3, çalışma 3.</p>

<ul>
  <li>Arama kutusuna "çekmece", "60" ya da "evye" yazarsın; kart listesi daralır.</li>
  <li>Sarı <strong>+</strong> modülü sahneye ekler ve pencere açık kalır — arka arkaya modül dizersin.</li>
  <li>Kalkar kapak, çekmece ve köşe modülleri de kütüphanededir.</li>
  <li>Kendi kurduğun kabini ⭐ ile favorilere alırsın; bir dahaki işte içindeki düzeniyle birlikte gelir.</li>
</ul>

<h2>Bıraktıktan sonra: milimetre senin</h2>

<p>Modül yerine oturduğunda iş bitmiş sayılmaz, ama kalan kısım saniyelerle ölçülür:</p>

<ul>
  <li><strong>En ve sol uzaklık</strong> yazılır; modül bırakıldığı noktadan oraya kayar.</li>
  <li><strong>Menteşe yönü</strong> tek tık uzaklıktadır.</li>
  <li>Modül komşusuna dayanır; aradaki boşluğu program milimetre olarak söyler.</li>
  <li>Tutamacından çekersin, ölçü canlı değişir; yanlış olduysa Ctrl+Z geri alır.</li>
  <li>🔧 <strong>Montajda düzenle</strong> dediğinde Üretim bölümüne geçer, o modülün tek tek panellerine inersin.</li>
</ul>

<p>Dokunmatik ekranda da aynı şekilde çalışır; kartı tutup başka bir duvara bile bırakabilirsin.</p>

<h2>Peki ya üretim?</h2>

<p>Sürükle-bırak yalnızca tasarımı hızlandırsaydı yarım iş olurdu. Asıl kazanç, bıraktığın modülün üretim dosyasının da kendisi olması: kesim listesi, plaka yerleşimi, delik tablosu, etiket, DXF ve CNC programı aynı modelden çıkar. Bunun ayrıntısı ayrı yazıda: <a href="${ANA_YAZI}">Dolap Sihirbazı: sürükle bırak, kesim ve CNC anında hazır</a>.</p>

<h2>Sık sorulanlar</h2>

<h3>Bıraktığım modülü sonradan değiştirebilir miyim?</h3>
<p>Evet, her parçasına kadar. Modül, montajın kendi parçalarıyla kurulur: kabin, raf, bölme, çekmece takımı, kapak, kalkar kapak, askı. Ölçüyü, kapak yönünü, çekmece adedini, ray modelini sonradan değiştirirsin; "Grubu ayır" dediğinde parçalar serbest kalır.</p>

<h3>Hazır modül kullanmak zorunda mıyım?</h3>
<p>Hayır. Panel paletinden alt / üst tabla, yan, dikme, raf, arkalık, kapak, baza ve ayağı tek tek koyarak sıfırdan da kurabilirsin. İki yöntem aynı projede yan yana durur.</p>

<h3>Bu bir SketchUp eklentisi mi?</h3>
<p>Hayır, Dolap Sihirbazı kendi başına çalışan bir Windows masaüstü programıdır; başka bir çizim programı kurulu olmasa da çalışır.</p>
`,
      video: "sürükle bırak",
    },
    en: {
      title: "Drag, Drop — Your Cabinet Is Ready",
      excerpt:
        "Grab a module from the palette and drop it on the wall: it becomes real panels with doors, hinges and holes. The cut list is ready at the same moment.",
      seoTitle: "Drag and Drop Cabinet Software: Drop It, It's Ready",
      seoDesc:
        "Drag a module onto the wall in Cabinet Wizard: the carcass is built from real panels, you type millimetre sizes, and the cut list comes out at once.",
      keyword: "drag and drop cabinet software",
      govde: `
<p>The most tiring part of a joiner's day is explaining to software a cabinet that is already finished in their head. You know the sizes, you know what goes where — and yet building the panels one by one takes half an hour.</p>

<p>In <strong>Cabinet Wizard</strong> (Dolap Sihirbazı) that half hour is gone. You grab a module from the palette on the left and drop it on the wall. That is the whole operation.</p>

${video("HyXdUio3BSY", "Drag and drop, then send to CNC — Cabinet Wizard", "A whole kitchen built by dragging and dropping; the CNC files come from the same model. Narrated in Turkish.")}

<h2>What you drop is not a picture — it is a real cabinet</h2>

<p>This is the difference. The module you drop is not an image or a frozen block: its side panels, tops, shelves, back, door and plinth are separate <strong>real parts</strong>. Hinge cups, shelf pins, cam locks and dowel holes are drilled automatically, positioned against the neighbouring panels.</p>

<p>So the moment you drop it, the cabinet is manufacturable. The cut list shows exactly the sizes on screen — the old gap between "what the drawing says" and "what the workshop cuts" disappears.</p>

${gorsel("surukle-birak", "The drag-and-drop palette and kitchen plan in Cabinet Wizard", "Module palette on the left, plan in the middle: the module seats itself on the wall you drop it on.")}

<h2>245 ready modules, found by typing</h2>

<p>The palette is not a short list. The Module Library holds <strong>245 ready modules</strong>: 49 kitchen base, 48 kitchen wall, 28 kitchen tall, 59 bathroom, 37 panel / filler, 8 wardrobe, 5 bedroom, 5 living / TV, 3 hallway, 3 study.</p>

<ul>
  <li>Type "drawer", "60" or "sink" in the search box and the cards narrow down.</li>
  <li>The yellow <strong>+</strong> adds the module and keeps the window open, so you line modules up one after another.</li>
  <li>Lift-up doors, drawer units and corner modules are in the library too.</li>
  <li>Star a cabinet you built yourself and it waits in your favourites — with its interior layout — for the next job.</li>
</ul>

<h2>After the drop: the millimetres are yours</h2>

<ul>
  <li>Type the <strong>width and the distance from the left wall</strong>; the module slides there from where you dropped it.</li>
  <li>The <strong>hinge side</strong> is one click away.</li>
  <li>Modules butt against their neighbours, and the software reports the leftover gap in millimetres.</li>
  <li>Pull a handle and the size changes live; Ctrl+Z puts it back.</li>
  <li>🔧 <strong>Edit in assembly</strong> takes you into the Production screen, down to that module's individual panels.</li>
</ul>

<p>It works the same way on a touch screen — you can even drag a card onto a different wall.</p>

<h2>And production?</h2>

<p>Drag and drop would be half a tool if it only sped up drawing. The real gain is that the module you dropped <em>is</em> the production file: cut list, sheet nesting, drilling table, labels, DXF and the CNC program all come out of the same model.</p>

<h2>Frequently asked</h2>

<h3>Can I change a module after dropping it?</h3>
<p>Yes, down to every part. A module is built from the same parts you would place yourself: carcass, shelf, divider, drawer set, door, lift-up door, hanging rail. Size, hinge side, drawer count and runner model can all be changed later, and "Ungroup" releases the parts.</p>

<h3>Do I have to use ready modules?</h3>
<p>No. The panel palette lets you place bottom and top panels, sides, dividers, shelves, backs, doors, plinths and feet one by one and build from scratch. Both methods live side by side in one project.</p>

<h3>Is this a SketchUp plugin?</h3>
<p>No. Cabinet Wizard is a standalone Windows desktop application; it runs with no other drawing software installed.</p>
`,
    },
  },

  {
    slug: "1-dakikada-mutfak-tasarla-uretime-gec",
    enSlug: "en/design-a-kitchen-in-one-minute-and-go-to-production",
    saat: "12:00:00",
    legacyId: 90021,
    tr: {
      title: "1 Dakikada Mutfak Tasarla, Üretime Geç",
      excerpt:
        "Duvar ölçülerini yaz, Otomatik Yerleştir'e bas: buzdolabı, fırın, evye, bulaşık makinesi ve ocağa göre mutfak dizilir. Sonrası üretim dosyası.",
      seoTitle: "1 Dakikada Mutfak Tasarım Programı ile Mutfak Çizin",
      seoDesc:
        "Müşterinin evinden aldığınız duvar ölçüsünü yazın; mutfak programı düz, L ya da U planı buzdolabı, fırın, evye ve ocağa göre kendisi dizsin.",
      keyword: "mutfak tasarım programı",
      govde: `
<p>Müşterinin evinden çıktın, elinde üç duvar ölçüsü var. Teklifi ne zaman vereceksin? Eskiden cevabı "akşam oturur çizerim"di. Şimdi cevabı: <strong>arabada, bir dakikada</strong>.</p>

<p>Dolap Sihirbazı'nın Mutfak Planı bölümü tam olarak bunun için var: ölçüyü yaz, mutfağı program dizsin.</p>

${video("O3HWo0a0AQo", "Mutfak planı: duvarı çizin, dolapları sürükleyip bırakın — Dolap Sihirbazı Ders 12", "Duvar ölçüsünden başlayıp mutfağı kuran ders.")}

<h2>Önce duvar: düz, L ya da U</h2>

<p>Duvar uzunluklarını kutulara yazarsın — "Duvar 1: 3000 mm, Duvar 2: 4200 mm" gibi — ve <strong>Bu ölçülerle duvar kur</strong> dersin. İstersen <strong>3B'de duvar çiz</strong> ile serbest de çizebilirsin. Düz mutfak, L mutfak, U mutfak: üçü de aynı yerden.</p>

${gorsel("mutfak-plani", "Dolap Sihirbazı mutfak planında dizilmiş dolaplar", "Mutfak planı: duvarlar girildikten sonra modüller plan üzerinde diziliyor.")}

<h2>Sonra ⚡ Otomatik Yerleştir</h2>

<p>Mutfağı sıfırdan dizmek zorunda değilsin. Otomatik Yerleştir, <strong>buzdolabı, fırın, evye, bulaşık makinesi ve ocağa</strong> göre dolapları kendisi sıralar. Tezgâh yüksekliği, baza ve ara ölçüler ustanın kullandığı standarttan gelir:</p>

<ul>
  <li>Tezgâh altı <strong>870 mm</strong> (gövde 770 + ayak 100)</li>
  <li>Üst dolap yerden <strong>1490 mm</strong></li>
  <li>Tezgâh ile üst dolap arası <strong>580 mm</strong></li>
</ul>

<p>Yani ortaya "programın uydurduğu" değil, atölyenin zaten bildiği bir mutfak çıkar. Beğenmediğin modülü sürükleyip değiştirirsin; <a href="/surukle-birak-dolabin-hazir.html">sürükle-bırak yazısında</a> o kısmı anlattım.</p>

<h2>Müşteriye gösterilecek çıktı da hazır</h2>

<ul>
  <li><strong>Üstten plan, kesit ve ön görünüş</strong> hazır gelir.</li>
  <li>🖨️ ile <strong>A4 müşteri çıktısı</strong> alınır ya da PDF'e yazdırılır.</li>
  <li>Render düğmesine basarsın; ayrı bir render programı açmadan müşteriye gösterilecek görüntü çıkar.</li>
  <li>Teklif tasarımdan hesaplanır: malzeme, donanım, işçilik, kâr, KDV — kalem kalem.</li>
</ul>

<h2>"Üretime geç" ne demek?</h2>

<p>Mutfak planı bittiğinde elinde yalnız bir resim değil, kesilebilir bir iş vardır. Aynı modelden kesim listesi (CSV), plaka yerleşimi ve kullanım yüzdesi, delik tablosu, DXF, parça başına DXF, CNC router programı (NC / G-kodu), 50 × 30 parça etiketi, donanım metrajı ve modül modül montaj sayfaları çıkar.</p>

<p>Bir modülü değiştirdiğinde bunların hepsi yeniden hesaplanır. "Çizimi güncelledim, listeyi de güncellemem lazım" diye bir iş kalmaz.</p>

<h2>Sık sorulanlar</h2>

<h3>Gerçekten bir dakika mı sürüyor?</h3>
<p>Duvar ölçülerini yazıp Otomatik Yerleştir'e basmak saniyeler alır; ortaya ölçüleri doğru, standartlara uyan bir mutfak çıkar. Müşteriye özel düzen, kapak modeli ve malzeme seçimi elbette senin kararın ve onlar zaman alır — ama "boş ekrandan dolaplı mutfağa" geçiş gerçekten bir dakikanın altındadır.</p>

<h3>L ve U mutfakta köşe ne oluyor?</h3>
<p>Köşe modülleri kütüphanede var; kör köşe ve köşe dolgusu kendiliğinden gelir, kapaklar birbirine çarpmaz. L planda köşe tezgâhı da birlikte kurulur.</p>

<h3>Evdeki kolon ve kiriş ne olacak?</h3>
<p>Onlar da plana girer ve dolaplar kendiliğinden uyar — <a href="/kertik-kiris-sorun-degil.html">ayrı yazıda</a> anlattım.</p>
`,
    },
    en: {
      title: "Design a Kitchen in One Minute, Then Go Straight to Production",
      excerpt:
        "Type the wall sizes, press Auto-arrange: the kitchen lays itself out around the fridge, oven, sink, dishwasher and hob. What follows is the production file.",
      seoTitle: "Kitchen Design Software: A Kitchen in One Minute",
      seoDesc:
        "Type the wall dimensions you measured at the client's home and let the kitchen software lay out a straight, L- or U-shaped kitchen around the appliances.",
      keyword: "kitchen design software",
      govde: `
<p>You have just left the client's flat with three wall measurements in your notebook. When will they get the quote? The old answer was "I'll draw it tonight." The new answer is: <strong>in the car, in a minute.</strong></p>

<p>That is what the Kitchen Plan section of Cabinet Wizard is for: type the sizes, let the software lay the kitchen out.</p>

${video("O3HWo0a0AQo", "Kitchen plan: draw the wall, drag the cabinets — Cabinet Wizard Lesson 12", "The lesson that starts from a wall measurement and ends with a kitchen. Narrated in Turkish.")}

<h2>The walls first: straight, L or U</h2>

<p>You type the wall lengths into the boxes — "Wall 1: 3000 mm, Wall 2: 4200 mm" — and press <strong>Build walls with these sizes</strong>. You can also draw them freely in 3D. Straight, L-shaped and U-shaped kitchens all start here.</p>

${gorsel("mutfak-plani", "Cabinets laid out on the kitchen plan in Cabinet Wizard", "The kitchen plan: once the walls are entered, modules line up along them.")}

<h2>Then ⚡ Auto-arrange</h2>

<p>You do not have to place every cabinet. Auto-arrange lines them up around the <strong>fridge, oven, sink, dishwasher and hob</strong>. Worktop height, plinth and clearances come from the standards a workshop already works to:</p>

<ul>
  <li>Worktop at <strong>870 mm</strong> (770 carcass + 100 leg)</li>
  <li>Wall cabinets <strong>1490 mm</strong> from the floor</li>
  <li><strong>580 mm</strong> between worktop and wall cabinet</li>
</ul>

<p>What appears is not a layout the software invented, but the one your workshop builds anyway. Any module you dislike is dragged and swapped.</p>

<h2>The client-facing output is ready too</h2>

<ul>
  <li><strong>Plan, section and elevation</strong> are generated.</li>
  <li>🖨️ prints an <strong>A4 client sheet</strong> or a PDF.</li>
  <li>Press Render and you get an image to show the client without opening a second program.</li>
  <li>The quote is calculated from the design: material, hardware, labour, margin and VAT, line by line.</li>
</ul>

<h2>What "go to production" means</h2>

<p>When the plan is done you are not holding a picture, you are holding a job that can be cut. The same model produces the cut list (CSV), the sheet nesting with its usage percentage, the drilling table, DXF, per-part DXF, the CNC router program (NC / G-code), 50 × 30 mm part labels, the hardware schedule and module-by-module assembly sheets.</p>

<p>Change one module and all of it is recalculated. The chore of "I updated the drawing, now I have to update the list" is gone.</p>

<h2>Frequently asked</h2>

<h3>Is it really one minute?</h3>
<p>Typing the wall sizes and pressing Auto-arrange takes seconds, and what comes out respects real dimensions and standards. The client's own layout, door style and materials are your decisions and they take longer — but going from an empty screen to a kitchen full of cabinets really is under a minute.</p>

<h3>What happens at the corner in an L or U kitchen?</h3>
<p>Corner modules are in the library; the blind panel and corner filler appear automatically and the doors never clash. In an L plan the corner worktop is built with them.</p>

<h3>What about the column and the beam in the room?</h3>
<p>Those go into the plan as well, and the cabinets adapt to them by themselves.</p>
`,
    },
  },

  {
    slug: "kertik-kiris-sorun-degil",
    enSlug: "en/beams-and-notches-are-not-a-problem",
    saat: "15:00:00",
    legacyId: 90022,
    tr: {
      title: "Kertik, Kiriş Sorun Değil!",
      excerpt:
        "Kiriş sarkıyor, kolon dolabın içine giriyor. Program kertiği kendisi hesaplıyor ve o kertik CNC ile DXF çıktısına da gidiyor.",
      seoTitle: "Mutfakta Kiriş ve Kolon Kertiği: Program Halleder",
      seoDesc:
        "Kiriş sarkmasında gövde kertiklenir, kalın kirişte üst dolap kısalır; kolona değen gövde kendiliğinden kertilir ve kertik CNC ile DXF'e gider.",
      keyword: "mutfak dolabı kolon kertiği",
      govde: `
<p>Her ustanın bildiği sahne: mutfak ölçüsü tamam, çizim tamam, dolaplar yapıldı — sonra montajda tavandaki kiriş ya da köşedeki kolon ortaya çıkıyor. Testere montaj yerinde çalışıyor, kertik elde açılıyor, kenar bandı oradan gidiyor.</p>

<p>Dolap Sihirbazı'nda kolon ve kiriş <strong>tasarımın bir parçası</strong>. Ölçülerini yazarsın; dolaplar kendiliğinden uyar ve bu uyum üretim dosyasına da geçer.</p>

${gorsel("duvar-kiris", "Dolap Sihirbazı'nda duvar, kiriş sarkması ve kiriş çıkıntısı alanları", "Duvar başına kiriş sarkması ve çıkıntısı milimetreyle giriliyor; altındaki not programın ne yapacağını söylüyor.")}

<h2>Kiriş: üç ayrı davranış, üçü de otomatik</h2>

<p>Her duvar için <strong>kiriş sarkması</strong> ve <strong>kiriş çıkıntısı</strong> yazılır. Sonrası programın işi:</p>

<ul>
  <li><strong>İnce kirişte</strong> gövde kertiklenir ve dolap kirişin üstüne biner — yani dolabın boyu kısalmaz, yalnız kirişin yeri oyulur.</li>
  <li><strong>Kalın kirişte</strong> kertmek anlamsızdır; üst dolap kısalır.</li>
  <li><strong>Yer kalmıyorsa</strong> program o dolabı kurmaz ve bunu söyler. Montajda öğrenmezsin.</li>
</ul>

<h2>Kolon: değdiği yerden kertilir</h2>

<p>Kolonu da plana yazarsın: <strong>en, derinlik, sol uzaklık, alt kot, üst kot ve pay</strong>. L ve U planda köşe kolonu üstten çekilerek konumlanır. Dolap kolona değdiği anda gövde kertilir.</p>

<p>Program kararı şu kurallarla verir:</p>

<ul>
  <li>Kirişin önünde <strong>150 mm ve üzeri</strong> yer kalıyorsa dolap kirişi sarar (kertik açılır).</li>
  <li>Kalmıyorsa, kirişin altında <strong>250 mm ve üzeri</strong> varsa üst dolap kısalır.</li>
  <li>Kertiğin altında <strong>80 mm'den az</strong> kalıyorsa gövde kirişin önünde durur.</li>
  <li><strong>5 mm'den küçük</strong> çıkıntı etkisiz sayılır — gereksiz kertik açılmaz.</li>
</ul>

<p>İstisna da senin elinde: bir modülde "kolon kesilmesin" dersen o gövdeye dokunulmaz.</p>

<h2>Asıl mesele: kertik CNC'ye de gidiyor</h2>

<p>Ekranda kertik görmek güzeldir ama tek başına işe yaramaz. Önemli olan şu: <strong>bu kesim CNC ve DXF çıktısına da gider.</strong> Yani kertikli yan panel, atölyede makineden kertiğiyle birlikte çıkar; montajda elde testereyle uğraşılmaz, kenar bandı bozulmaz.</p>

<p>X-ray görünümünde kolonu kaydırıp kertiğin nereye geldiğini içeriden de izleyebilirsin.</p>

${video("eQ9hdiFhfIo", "En kolay dolap tasarım ve üretim programı — Dolap Sihirbazı", "Programın genel tanıtımı: tasarımdan CNC'ye tek akış.")}

<h2>Neden önemli?</h2>

<p>Çünkü kertik, bir işte kârı yiyen küçük hatalardan biridir. Yanlış ölçülmüş bir kertik tek panelin yeniden kesilmesi demektir; montajda açılan kertik ise işçilik, toz ve çoğu zaman bozulmuş bir kenar bandı demektir. Tasarımda çözülürse ikisi de olmaz.</p>

<h2>Sık sorulanlar</h2>

<h3>Kirişi ölçerken neyi yazmalıyım?</h3>
<p>İki sayı yeter: kirişin tavandan ne kadar sarktığı ve duvardan ne kadar çıktığı. Program geri kalanını üst dolap yüksekliğiyle birlikte hesaplar.</p>

<h3>Kolon dolabın tam ortasına denk gelirse?</h3>
<p>Gövde değdiği yerden kertilir; kertiğin altında 80 mm'den az yer kalıyorsa gövde kolonun önünde durur. İstersen o modülde kertmeyi kapatıp kolonu dolgu paneliyle de kapatabilirsin.</p>

<h3>Çekmeceli dolapta ne oluyor?</h3>
<p>Çekmeceli bir dolap kolona denk geldiğinde gövde kertilmez; dolap öne çekilerek derinliği uyarlanır. Çekmecenin çalışmasını bozacak bir kertik açılmaz.</p>
`,
    },
    en: {
      title: "Beams and Notches Are Not a Problem",
      excerpt:
        "The beam drops from the ceiling, the column cuts into the cabinet. The software works out the notch itself — and that notch goes into the CNC and DXF output too.",
      seoTitle: "Beams and Columns in a Kitchen: Let the Software Notch",
      seoDesc:
        "A thin beam notches the carcass, a thick one shortens the wall cabinet, and a column notches whatever it touches — with the notch carried into CNC and DXF.",
      keyword: "kitchen cabinet column notch",
      govde: `
<p>Every fitter knows the scene: the kitchen is measured, drawn and built — and then, on site, the ceiling beam or the corner column appears. The saw comes out on the floor, the notch is cut by hand, and the edge banding is ruined.</p>

<p>In Cabinet Wizard, columns and beams are <strong>part of the design</strong>. You type their sizes; the cabinets adapt by themselves, and that adaptation carries through to the production files.</p>

${gorsel("duvar-kiris", "Wall, beam drop and beam projection fields in Cabinet Wizard", "Beam drop and projection are entered per wall in millimetres; the note underneath states exactly what the software will do.")}

<h2>Beams: three behaviours, all automatic</h2>

<ul>
  <li>With a <strong>thin beam</strong> the carcass is notched and the cabinet rides over the beam — full height is kept, only the beam's volume is cut away.</li>
  <li>With a <strong>thick beam</strong> notching makes no sense, so the wall cabinet is shortened instead.</li>
  <li><strong>If there is no room left</strong>, the software does not build that cabinet and tells you so. You do not find out on site.</li>
</ul>

<h2>Columns: notched where they touch</h2>

<p>A column goes into the plan with its <strong>width, depth, distance from the left, bottom level, top level and clearance</strong>. In L and U plans a corner column is dragged into place from the top view. The moment a cabinet touches it, the carcass is notched.</p>

<ul>
  <li><strong>150 mm or more</strong> left in front of the beam: the cabinet wraps it (a notch is cut).</li>
  <li>Otherwise, <strong>250 mm or more</strong> below the beam: the wall cabinet is shortened.</li>
  <li>Less than <strong>80 mm</strong> left under the notch: the carcass stops in front of the beam.</li>
  <li>A projection under <strong>5 mm</strong> is ignored — no pointless notch is cut.</li>
</ul>

<p>The exception stays in your hands: set "do not cut for the column" on a module and its carcass is left alone.</p>

<h2>The real point: the notch reaches the CNC</h2>

<p>Seeing a notch on screen is pleasant but useless on its own. What matters is that <strong>the cut is written into the CNC and DXF output</strong>. The notched side panel leaves the machine already notched; nobody fights it with a hand saw during installation and the edge banding survives.</p>

${video("eQ9hdiFhfIo", "The easiest cabinet design and production software — Cabinet Wizard", "A general tour of the program: one flow from design to CNC. Narrated in Turkish.")}

<h2>Why it matters</h2>

<p>Because a notch is one of those small errors that eat a job's margin. A mismeasured notch means recutting a panel; a notch cut on site means labour, dust and usually a damaged edge. Solved in the design, neither happens.</p>

<h2>Frequently asked</h2>

<h3>What do I measure on a beam?</h3>
<p>Two numbers are enough: how far it drops from the ceiling and how far it projects from the wall. The software works out the rest together with the wall-cabinet height.</p>

<h3>What if the column lands in the middle of a cabinet?</h3>
<p>The carcass is notched where it touches; if less than 80 mm is left under the notch, the carcass stops in front of the column instead. You can also switch notching off for that module and cover the column with a filler panel.</p>

<h3>And a cabinet full of drawers?</h3>
<p>A drawer unit that meets a column is not notched; it is brought forward and its depth adapts, so nothing is cut that would stop a drawer working.</p>
`,
    },
  },

  {
    slug: "olcuyu-gir-gerisini-mutfak-programi-halletsin",
    enSlug: "en/just-enter-the-dimensions-let-the-kitchen-software-do-the-rest",
    saat: "18:00:00",
    legacyId: 90023,
    tr: {
      title: "Sadece Ölçüyü Gir, Gerisini Mutfak Programı Halletsin",
      excerpt:
        "Bir sayıyı değiştir: parçalar, delikler, menteşe adedi, kenar bandı metrajı ve teklif tutarı birlikte yeniden hesaplanır.",
      seoTitle: "Ölçüyü Girin, Dolap Programı Gerisini Hesaplasın",
      seoDesc:
        "Kabin kartına en, boy ve derinliği yazın: paneller, delikler, menteşe adedi, bant metrajı ve teklif tutarı kendiliğinden yeniden hesaplansın.",
      keyword: "dolap hesaplama programı",
      govde: `
<p>Müşteri telefonda: "Dolabı 10 santim kısaltalım." Eskiden bu cümle, çizimin yeniden elden geçmesi, kesim listesinin yeniden yazılması ve teklifin yeniden hesaplanması demekti. En kötüsü de şu: üç listeden biri güncellenmeyi unutuyordu.</p>

<p>Dolap Sihirbazı'nda ölçü tek bir yerde durur. Yazarsın, geri kalanı program yapar.</p>

${gorsel("kabin-olcu", "Dolap Sihirbazı'nda kabin hızlı düzenle kartı ve 3B görünüm", "Kabin kartı: en, gövde boyu, derinlik, yerden yükseklik; 3B'de karşılığı anında.")}

<h2>Kabin kartı: bütün dolap tek karttan</h2>

<p>Dolabı değiştirmek için panelleri tek tek gezmezsin. Kabini seçersin, soldaki karttan yazarsın:</p>

<ul>
  <li><strong>Ölçü:</strong> en, gövde boyu, derinlik, yerden yükseklik.</li>
  <li><strong>Alt:</strong> ayak, baza ya da baza ayağı.</li>
  <li><strong>Üst:</strong> üst tabla bütün mü, yoksa ön + arka kayıt mı.</li>
  <li><strong>Alt arka kayıt:</strong> çift kayıt var ya da yok.</li>
  <li><strong>Gola:</strong> kulpsuz profil — kulplu ya da üstte J profil.</li>
</ul>

${video("0zubGt32Oh0", "Dolap ölçüsünü tek karttan değiştirin: Kabin Hızlı Düzenle — Ders 4", "Tek karttan ölçü değişiminin dersi.")}

<h2>Bir sayı değişince neler yeniden hesaplanır?</h2>

<p>Program ölçüyü bir etiket gibi tutmaz; dolap o sayıdan yeniden kurulur:</p>

<ul>
  <li>Panellerin kesim ölçüleri (net ölçü ve kesim ölçüsü kartta yan yana durur).</li>
  <li>Raf, bölme ve çekmece yerleşimi.</li>
  <li>Delikler: menteşe yuvası ve plakası, raf pimi, minifiks, kavela, kulp vidası.</li>
  <li><strong>Menteşe adedi</strong> — kapak boyuna göre kendiliğinden gelir; istersen sağ tıkla kendin belirlersin.</li>
  <li>Kenar bandı metrajı: dört kenarı tek tek açıp kapattıkça metraj düşer ya da artar.</li>
  <li>Plaka yerleşimi, kullanım yüzdesi ve CNC programı.</li>
  <li>Teklif tutarı — malzeme, donanım, işçilik, kâr ve KDV kalem kalem.</li>
</ul>

<p>Ekranın altındaki canlı sayaç bunu görünür kılar: <strong>parça adedi, m² levha ve metre bant</strong> her değişiklikte güncellenir.</p>

<h2>Program itiraz da eder</h2>

<p>"Ölçüyü gir, gerisini halletsin" demek, her sayıyı sessizce kabul etmek değildir. Üretime gitmeden önce program gözden kaçanı söyler:</p>

<ul>
  <li>"Kapak 2147 × 597 mm: ağır kapak, 5 menteşe ya da 22 mm kapak önerilir."</li>
  <li>"Yan 2132 mm, arkalık 8 mm: yüksek gövdede orta kayıt ekleyin ya da arkalığı kalınlaştırın."</li>
</ul>

<p>Sorun ciddiyse CNC adımında <strong>üretim engeli</strong> çıkar; sen "gördüm" demeden çıktı alınmaz. Yani program ölçünü uygular ama seni uyarmadan hatalı iş kesmene izin vermez.</p>

<h2>Müşteri ölçü değiştirdiğinde</h2>

<p>En güzel tarafı burası: değişiklikten sonra işi baştan kesmek gerekmez. Yalnız değişen parçaları kesersin; teklif de yeni tutarıyla hazırdır. Aynı akışın mutfak tarafı için <a href="/1-dakikada-mutfak-tasarla-uretime-gec.html">1 dakikada mutfak tasarla</a> yazısına, kolon ve kiriş işi için <a href="/kertik-kiris-sorun-degil.html">kertik ve kiriş yazısına</a> bakabilirsin.</p>

<h2>Sık sorulanlar</h2>

<h3>Ölçüyü nereden yazıyorum — panelden mi, kabinden mi?</h3>
<p>İkisinden de. Kabin kartı bütün dolabı değiştirir; bir panele tıklarsan o panelin kendi kartı açılır ve boy, en, kalınlık, konum, kenar payı, kenar bandı, bağlantı yönü, kesim ve cep orada ayarlanır.</p>

<h3>Elle yaptığım düzeltmeler ölçü değişince bozulur mu?</h3>
<p>Elle düzenlenen ve kaldırılan paneller ayrı listelerde tutulur; program neyi senin değiştirdiğini bilir. Yanlış giden bir şey olursa ↶ ve Ctrl+Z tek adımda geri alır.</p>

<h3>Kesim ölçüsü ile net ölçü farkını görebiliyor muyum?</h3>
<p>Evet, kartın başında yan yana durur — örneğin 2147 × 597 kapak, kesim 2143 × 593 mm.</p>
`,
    },
    en: {
      title: "Just Enter the Dimensions — Let the Software Do the Rest",
      excerpt:
        "Change one number: the parts, the holes, the hinge count, the edge-banding metres and the quote are all recalculated together.",
      seoTitle: "Enter the Size, Let the Cabinet Software Calculate",
      seoDesc:
        "Type width, height and depth on the cabinet card: panels, holes, hinge count, banding metres and the quote total are recalculated automatically.",
      keyword: "cabinet calculation software",
      govde: `
<p>The client calls: "Let's take ten centimetres off that cabinet." That sentence used to mean reworking the drawing, rewriting the cut list and recalculating the quote — and worst of all, one of those three usually stayed out of date.</p>

<p>In Cabinet Wizard the size lives in one place. You type it; the software does the rest.</p>

${gorsel("kabin-olcu", "The quick cabinet edit card and 3D view in Cabinet Wizard", "The cabinet card: width, carcass height, depth and height off the floor, with the 3D view answering immediately.")}

<h2>One card for the whole cabinet</h2>

<ul>
  <li><strong>Size:</strong> width, carcass height, depth, height off the floor.</li>
  <li><strong>Bottom:</strong> feet, plinth, or plinth with feet.</li>
  <li><strong>Top:</strong> a full top panel, or front and back rails.</li>
  <li><strong>Lower back rail:</strong> double rail on or off.</li>
  <li><strong>Gola:</strong> the handleless profile — with a handle, or a J profile on top.</li>
</ul>

${video("0zubGt32Oh0", "Change cabinet size from one card: Quick Cabinet Edit — Lesson 4", "The lesson on changing sizes from a single card. Narrated in Turkish.")}

<h2>What is recalculated when one number changes</h2>

<ul>
  <li>Cut sizes of every panel (finished size and cut size sit side by side on the card).</li>
  <li>Shelf, divider and drawer layout.</li>
  <li>Holes: hinge cups and plates, shelf pins, cam locks, dowels, handle screws.</li>
  <li><strong>Hinge count</strong> — derived from the door height, overridable from the right-click menu.</li>
  <li>Edge-banding metres, as you switch each of the four edges on or off.</li>
  <li>Sheet nesting, usage percentage and the CNC program.</li>
  <li>The quote — material, hardware, labour, margin and VAT, line by line.</li>
</ul>

<p>The live counter at the bottom of the screen makes this visible: <strong>part count, square metres of board and metres of banding</strong> update on every change.</p>

<h2>The software also pushes back</h2>

<p>"Enter the size and let it handle the rest" does not mean accepting every number in silence. Before anything reaches production you get warnings such as:</p>

<ul>
  <li>"Door 2147 × 597 mm: heavy door, 5 hinges or a 22 mm door is advised."</li>
  <li>"Side 2132 mm, back 8 mm: add a middle rail or use a thicker back on a tall carcass."</li>
</ul>

<p>If the issue is serious, a <strong>production block</strong> appears at the CNC step and no output is produced until you acknowledge it.</p>

<h2>When the client changes their mind</h2>

<p>This is the best part: after a change you do not recut the job. You cut only the parts that actually changed, and the quote is already waiting with its new total.</p>

<h2>Frequently asked</h2>

<h3>Do I type sizes on the panel or on the cabinet?</h3>
<p>Either. The cabinet card changes the whole unit; click a single panel and its own card opens with height, width, thickness, position, edge allowance, banding, connector direction, cut-outs and pockets.</p>

<h3>Do my manual edits survive a size change?</h3>
<p>Panels you edited or removed by hand are kept in their own lists, so the software knows what you changed. If something goes wrong, ↶ and Ctrl+Z undo it in one step.</p>

<h3>Can I see the difference between finished size and cut size?</h3>
<p>Yes, they sit side by side at the top of the card — for example a 2147 × 597 door with a cut size of 2143 × 593 mm.</p>
`,
    },
  },
];

/* ------------------------------------------------------------------ */
/* Üretim                                                              */
/* ------------------------------------------------------------------ */

const TARIH = "2026-11-05";
const yaz = (kayit) => {
  const dosya = kayit.slug.replace(/\//g, "__") + ".json";
  fs.writeFileSync(
    path.join(KOK, "src", "content", "posts", dosya),
    JSON.stringify(kayit, null, 2) + "\n",
    "utf8",
  );
  return dosya;
};

const kelimeSay = (html) => html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

let toplam = 0;
for (const y of YAZILAR) {
  const trUrl = `/${y.slug}.html`;
  const enUrl = `/${y.enSlug}.html`;

  for (const dil of ["tr", "en"]) {
    const m = y[dil];
    const govde = (m.govde + "\n" + kapanis(dil)).trim();
    const kelime = kelimeSay(govde);
    const kayit = {
      legacyId: y.legacyId + (dil === "en" ? 100 : 0),
      slug: dil === "tr" ? y.slug : y.enSlug,
      legacyUrl: dil === "tr" ? trUrl : enUrl,
      url: dil === "tr" ? trUrl : enUrl,
      dil,
      alternatif: dil === "tr" ? enUrl : trUrl,
      title: m.title,
      excerpt: m.excerpt,
      contentHtml: govde,
      publishedAt: `${TARIH} ${y.saat}`,
      modifiedAt: `${TARIH} ${y.saat}`,
      status: "publish",
      featuredImage: null,
      inlineMedia: [],
      embeds: [],
      seo: {
        title: m.seoTitle,
        description: m.seoDesc,
        focusKeyword: m.keyword,
        canonicalUrl: `https://www.ufuksen.com${dil === "tr" ? trUrl : enUrl}`,
        ogImage: null,
        noindex: false,
      },
      readingMinutes: Math.max(1, Math.round(kelime / 200)),
      migrationChecksum: crypto.createHash("sha256").update(govde, "utf8").digest("hex"),
      author: { legacyId: 1, name: "UFUK ŞEN", slug: "ufuk", isGuest: false },
      /** İngilizce yazıya Türkçe kategori verilmez: kategori sayfaları Türkçe. */
      categories:
        dil === "tr"
          ? [
              { legacyId: 1169, name: "3D Programlar", slug: "3d-programlar" },
              { legacyId: 1172, name: "Sketchup", slug: "sketchup" },
            ]
          : [],
      tags: [],
    };
    const dosya = yaz(kayit);
    toplam += 1;
    const say = (d) => (govde.match(d) ?? []).length;
    console.log(
      `${dil}  ${String(kelime).padStart(4)} kelime  h2:${say(/<h2/g)} h3:${say(/<h3/g)} ` +
        `video:${say(/<iframe/g)} görsel:${say(/<img /g)} mağaza:${say(/bestsketchupplugins\.com/g)}  ${dosya}`,
    );
  }
}
console.log(`\ntoplam ${toplam} yazı yazıldı (${YAZILAR.length} başlık × 2 dil).`);
console.log(`yayın saatleri: ${YAZILAR.map((y) => y.saat.slice(0, 5)).join(", ")} — ${TARIH}`);
