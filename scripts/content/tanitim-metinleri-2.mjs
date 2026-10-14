/** Tanıtım metinleri — bölüm 2. Kurallar için bkz. `tanitim-metinleri.mjs`. */

export const METINLER = {
  /* ---------------------------------------------------------------- */
  "soft-edge": {
    en: {
      baslik: "Nothing in a real room has a knife-sharp edge. Your model does.",
      sunum:
        "A table top with a perfectly square corner is the giveaway that a render came out of CAD. Real edges catch a thin line of light, and that single highlight is most of what makes a material look touchable. Rounding one table edge by hand takes around 20 minutes, which is why it usually gets skipped. Soft Edge does it in about 10 seconds: select, type the radius, click. Rounds and chamfers, SketchUp 2021 through 2026 — and it is free.",
      hikayeler: [
        {
          baslik: "Every corner gets the same care",
          metin:
            "The radius you type is applied consistently around the selection, so you do not end up with one beautiful corner and three that were left square because the day ran out.",
        },
        {
          baslik: "Does rounding lock you into a decision?",
          metin:
            "No. Work at the radius you want now and change it when the design moves. Edge treatment stops being the irreversible last step you put off until the end.",
        },
        {
          baslik: "The material finally behaves",
          metin:
            "A rounded or chamfered edge gives the renderer something to catch, so wood reads as wood and metal reads as metal in V-Ray or Enscape — without touching a single texture setting.",
        },
      ],
    },
    tr: {
      baslik: "Gerçek bir odada hiçbir şeyin bıçak gibi keskin kenarı yoktur. Modelinizde var.",
      sunum:
        "Köşesi tam dik olan bir tabla, görselin CAD'den çıktığını ele veren şeydir. Gerçek kenarlar ince bir ışık çizgisi yakalar ve bir malzemeyi dokunulabilir gösteren şeyin çoğu o tek parlamadır. Bir tablanın kenarını elle yuvarlamak yaklaşık 20 dakika sürer; bu yüzden genelde atlanır. Yumuşak Kenar bunu yaklaşık 10 saniyede yapar: seçin, yarıçapı yazın, tıklayın. Yuvarlak ve pah, SketchUp 2021-2026 — ve ücretsiz.",
      hikayeler: [
        {
          baslik: "Her köşe aynı özeni görür",
          metin:
            "Yazdığınız yarıçap seçimin tamamına tutarlı uygulanır; bir köşesi güzel, üçü gün bittiği için dik kalmış bir parçayla baş başa kalmazsınız.",
        },
        {
          baslik: "Yuvarlamak kararı kilitler mi?",
          metin:
            "Hayır. Şimdi istediğiniz yarıçapla çalışır, tasarım değişince değiştirirsiniz. Kenar işçiliği, sona sakladığınız geri dönüşsüz adım olmaktan çıkar.",
        },
        {
          baslik: "Malzeme sonunda gerçek gibi davranır",
          metin:
            "Yuvarlatılmış ya da pahlanmış kenar, render motoruna yakalayacak bir şey verir; V-Ray ya da Enscape'te ahşap ahşap, metal metal gibi okunur — tek bir doku ayarına dokunmadan.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  furnifun: {
    en: {
      baslik: "An empty room does not sell. A furnished one does.",
      sunum:
        "The client cannot read a plan, but they can read a living room. The problem is that furnishing one honestly means either modelling a sofa, a TV unit and a bookcase yourself, or downloading models that arrive at the wrong scale and drag half a million polygons behind them — about 60 minutes either way. FurniFun places a piece in two clicks and lets you drag the blue handle to the size you need: around 60 seconds, from 18 furniture types, on SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "Two clicks and it is in place",
          metin:
            "Pick the type, click where it goes. No importing, no exploding a downloaded component to find out it was modelled in inches.",
        },
        {
          baslik: "What happens when the room gets smaller?",
          metin:
            "You pull the blue handle. The piece resizes as furniture, keeping its proportions sensible rather than stretching into a cartoon — which is exactly what scaling a downloaded block does to it.",
        },
        {
          baslik: "Options for the client, no extra work for you",
          metin:
            "Showing three layouts stops being a reason to say no. The cost of a second option drops to a couple of clicks, and the conversation moves from 'can you?' to 'which one?'.",
        },
      ],
    },
    tr: {
      baslik: "Boş oda satmaz. Döşenmiş oda satar.",
      sunum:
        "Müşteri plan okuyamaz ama oturma odası okur. Sorun şu ki odayı dürüstçe döşemek ya kanepeyi, TV ünitesini ve kitaplığı kendiniz modellemek ya da ölçeği tutmayan ve arkasında yarım milyon poligon sürükleyen modelleri indirmek demektir — her iki yol da yaklaşık 60 dakika. FurniFun bir parçayı iki tıkla yerleştirir ve mavi topu çekerek istediğiniz ölçüye getirmenizi sağlar: yaklaşık 60 saniye, 18 mobilya türü, SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "İki tık ve yerinde",
          metin:
            "Türü seçin, nereye gideceğine tıklayın. İçe aktarma yok; indirilen bir bileşeni inç cinsinden modellenmiş olduğunu anlamak için patlatmak da yok.",
        },
        {
          baslik: "Oda küçülünce ne oluyor?",
          metin:
            "Mavi topu çekersiniz. Parça bir mobilya gibi yeniden ölçeklenir; karikatüre dönüşecek şekilde esnemez — ki indirilen bir bloğu ölçeklediğinizde olan tam da budur.",
        },
        {
          baslik: "Müşteriye seçenek, size ek iş yok",
          metin:
            "Üç farklı yerleşim göstermek 'hayır' deme sebebi olmaktan çıkar. İkinci seçeneğin maliyeti birkaç tıka iner ve konuşma 'yapabilir misiniz'den 'hangisi' olsuna kayar.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "kompozit-studio": {
    en: {
      baslik: "The facade is the drawing the client remembers. It is also the one that eats your week.",
      sunum:
        "Composite cladding looks simple until you start laying it: every panel on a 1250×2500 mm grid, every opening cut around, every piece counted for the order. Modelling a facade panel by panel and then counting the take-off in a spreadsheet runs about 150 minutes. Kompozit Studio does it in roughly 45 seconds — select the faces, press build — and writes the m² and piece-count CSV with it. SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "Select once, let the facade land",
          metin:
            "The panel grid is generated across the surfaces you picked, aligned to the sheet size the supplier actually delivers rather than a decorative pattern that cannot be bought.",
        },
        {
          baslik: "Does a revision mean redrawing the elevation?",
          metin:
            "No. Change the surface and the panelisation follows it. The facade stops being the part of the model nobody wants to touch two days before the presentation.",
        },
        {
          baslik: "The order figure comes from the model",
          metin:
            "Square metres and piece counts are exported as CSV straight from the geometry you just generated, so what you order matches what is drawn.",
        },
      ],
    },
    tr: {
      baslik: "Cephe, müşterinin aklında kalan çizimdir. Aynı zamanda haftanızı yiyen çizim.",
      sunum:
        "Kompozit cephe, döşemeye başlayana kadar basit görünür: her panel 1250×2500 mm ızgarada, her boşluk etrafından kesilmiş, her parça sipariş için sayılmış. Cepheyi panel panel modelleyip metrajı tabloda saymak yaklaşık 150 dakika sürer. Kompozit Studio bunu yaklaşık 45 saniyede yapar — yüzeyleri seçin, oluştur'a basın — ve m² ile adet CSV metrajını da birlikte yazar. SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "Bir kez seçin, cephe yerine otursun",
          metin:
            "Panel ızgarası seçtiğiniz yüzeyler boyunca üretilir; tedarikçinin gerçekten teslim ettiği levha ölçüsüne hizalı olarak, satın alınamayacak dekoratif bir desene göre değil.",
        },
        {
          baslik: "Revizyon cepheyi baştan çizdirir mi?",
          metin:
            "Hayır. Yüzeyi değiştirirsiniz, panel bölüntüsü onu takip eder. Cephe, sunuma iki gün kala kimsenin dokunmak istemediği kısım olmaktan çıkar.",
        },
        {
          baslik: "Sipariş rakamı modelden gelir",
          metin:
            "Metrekare ve adetler, az önce ürettiğiniz geometriden doğrudan CSV olarak çıkar; sipariş ettiğiniz şey çizilen şeyle örtüşür.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "ramp-studio": {
    en: {
      baslik: "The ramp is never on the sketch. It is always on the inspection.",
      sunum:
        "Nobody designs a building around its ramp, and nobody signs one off without it. That is why it tends to arrive late, drawn in a hurry, with a handrail that does not quite follow the slope. Modelling one ramp with handrails by hand takes about 45 minutes. Ramp Studio builds it in roughly 40 seconds from 50 presets across 5 categories, with 8 handrail types and 363 automated tests green, on SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "Whatever the curve is",
          metin:
            "Straight runs, switchbacks and helical ramps come out of the same tool, with landings and handrails following the geometry instead of being fitted afterwards by eye.",
        },
        {
          baslik: "Why does nobody want to change a ramp?",
          metin:
            "Because by hand it means redrawing the rail too. Here the slope, width or landing changes and the whole assembly rebuilds, so a late correction costs a minute rather than an afternoon.",
        },
        {
          baslik: "Compliant without doing the arithmetic",
          metin:
            "Presets carry sensible slope and landing relationships, so you are choosing a ramp rather than calculating one — and the result is something you can show without a knot in your stomach.",
        },
      ],
    },
    tr: {
      baslik: "Rampa hiçbir zaman eskizde olmaz. Her zaman denetlemede olur.",
      sunum:
        "Kimse binayı rampasının etrafında tasarlamaz, kimse de rampasız onaylamaz. Bu yüzden rampa genelde geç gelir, aceleyle çizilir ve korkuluğu eğimi tam takip etmez. Korkuluklu bir rampayı elle modellemek yaklaşık 45 dakika sürer. Rampa Stüdyosu bunu yaklaşık 40 saniyede kurar; 5 kategoride 50 hazır ayar, 8 korkuluk tipi ve 363 otomatik test yeşil, SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "Eğri hangisi olursa olsun",
          metin:
            "Düz kollar, dönüşlü rampalar ve helis rampalar aynı araçtan çıkar; sahanlıklar ve korkuluklar geometriyi takip eder, sonradan göz kararı oturtulmaz.",
        },
        {
          baslik: "Rampayı değiştirmeyi kimse neden istemez?",
          metin:
            "Çünkü elle yapınca korkuluğu da yeniden çizmek demektir. Burada eğim, genişlik ya da sahanlık değişir ve bütün takım yeniden kurulur; geç gelen bir düzeltme bir öğleden sonraya değil bir dakikaya mal olur.",
        },
        {
          baslik: "Hesap yapmadan kurala uygun",
          metin:
            "Hazır ayarlar makul eğim ve sahanlık ilişkilerini taşır; rampa hesaplamak yerine rampa seçersiniz — ve ortaya içiniz rahat gösterebileceğiniz bir şey çıkar.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "stairfun-studio": {
    en: {
      baslik: "Every office has one drawer of stairs that were drawn three times.",
      sunum:
        "Stairs are where floor heights, regulations and geometry argue with each other, and the argument is usually settled with a calculator and a long evening. Working out the risers and drawing every tread by hand takes about 75 minutes. StairFun Studio does it in roughly 40 seconds: choose a form, click twice, type the floor height. 8 forms plus a ramp, 44 live regulation checks, and 30 risers generated in under a second — SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "Two clicks, a finished staircase",
          metin:
            "Treads, risers, stringers and landings arrive together as one assembly, not as a pile of pushed-and-pulled boxes you will be cleaning up later.",
        },
        {
          baslik: "Do you need to remember the regulation by heart?",
          metin:
            "No. 44 rules are checked live as you type, so a riser that is too tall or a going that is too short tells you on the spot instead of in the review meeting.",
        },
        {
          baslik: "A change is just one number",
          metin:
            "Floor-to-floor height moved by 12 cm? Type it. The stair redistributes its risers and rebuilds, which is the whole difference between a correction and a redraw.",
        },
      ],
    },
    tr: {
      baslik: "Her ofiste üç kez çizilmiş merdivenlerin durduğu bir çekmece vardır.",
      sunum:
        "Merdiven, kat yüksekliklerinin, yönetmeliğin ve geometrinin birbiriyle tartıştığı yerdir; tartışma da genelde bir hesap makinesi ve uzun bir akşamla biter. Rıhtları hesaplayıp her basamağı elle çizmek yaklaşık 75 dakika sürer. StairFun Studio bunu yaklaşık 40 saniyede yapar: formu seçin, iki kez tıklayın, kat yüksekliğini yazın. 8 form ve rampa, 44 canlı yönetmelik kuralı ve saniyenin altında üretilen 30 rıht — SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "İki tık, bitmiş bir merdiven",
          metin:
            "Basamaklar, rıhtlar, limonluklar ve sahanlıklar tek bir takım olarak birlikte gelir; sonradan temizleyeceğiniz itilip çekilmiş kutular yığını olarak değil.",
        },
        {
          baslik: "Yönetmeliği ezbere bilmek gerekir mi?",
          metin:
            "Hayır. 44 kural siz yazarken canlı denetlenir; fazla yüksek bir rıht ya da kısa bir basamak genişliği size toplantıda değil o anda söylenir.",
        },
        {
          baslik: "Değişiklik tek bir sayıdır",
          metin:
            "Kat yüksekliği 12 cm mi değişti? Yazarsınız. Merdiven rıhtlarını yeniden dağıtır ve kendini kurar; düzeltme ile yeniden çizim arasındaki bütün fark budur.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "landscape-studio": {
    en: {
      baslik: "The landscape is what makes a project look finished — and it is what gets cut first.",
      sunum:
        "Shaping the terrain in Sandbox and then placing 300 plants one by one takes about 210 minutes, so the planting usually ends up as three copied trees and a green surface. Landscape Studio turns that into roughly 45 seconds: shape the grid, paint the zone, scatter the mix. 151 plants native to Türkiye, 12 terrain brushes, 571 automated tests green — SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "One ground, one coherent site",
          metin:
            "Terrain, paths, walls and planting sit on the same surface, so the model reads as a place rather than as objects floating above a plane.",
        },
        {
          baslik: "What if the layout changes the day before?",
          metin:
            "Repaint the zone. The planting redistributes instead of being deleted and placed again, which is the only reason late landscape revisions stop being frightening.",
        },
        {
          baslik: "The schedule is written, not counted",
          metin:
            "Plant counts by species come out of the model as a report, so the quantities you hand over match what is actually on the drawing.",
        },
      ],
    },
    tr: {
      baslik: "Peyzaj, projeyi bitmiş gösteren şeydir — ve ilk kesilen şeydir.",
      sunum:
        "Araziyi Sandbox'la kurup sonra 300 bitkiyi tek tek yerleştirmek yaklaşık 210 dakika sürer; bu yüzden bitkilendirme genelde üç kopya ağaç ve yeşil bir yüzeye dönüşür. Peyzaj Stüdyosu bunu yaklaşık 45 saniyeye indirir: ızgarayı şekillendirin, zonu boyayın, karışımı dağıtın. Türkiye'ye özgü 151 bitki, 12 arazi fırçası, 571 otomatik test yeşil — SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "Tek zemin, bütünlüklü bir alan",
          metin:
            "Arazi, yollar, duvarlar ve bitkilendirme aynı yüzey üzerinde durur; model, bir düzlemin üstünde yüzen nesneler değil bir yer gibi okunur.",
        },
        {
          baslik: "Yerleşim bir gün önce değişirse?",
          metin:
            "Zonu yeniden boyarsınız. Bitkilendirme silinip baştan yerleştirilmek yerine yeniden dağılır; geç gelen peyzaj revizyonlarının korkutucu olmaktan çıkmasının tek sebebi budur.",
        },
        {
          baslik: "Bitki listesi sayılmaz, yazılır",
          metin:
            "Türlere göre bitki adetleri modelden rapor olarak çıkar; teslim ettiğiniz miktarlar çizimde gerçekten duran şeyle örtüşür.",
        },
      ],
    },
  },
};
