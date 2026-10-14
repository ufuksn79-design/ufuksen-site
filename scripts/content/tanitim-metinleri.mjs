/**
 * ufuksen.com ürün tanıtım metinleri — mağazadan BAĞIMSIZ yazıldı (ADR-024).
 *
 * Buradaki her sayı gerçektir ve kaynağı bellidir:
 *   - süreler, model/desen/test sayıları, uyumluluk -> plugin-store/data/plugins.json
 *   - 34 Udemy kursu, 7.269 öğrenci, 899 değerlendirme -> plugin-store/data/udemy.json
 * Uydurma müşteri yorumu, sahte sayı ve sahte aciliyet YOKTUR.
 *
 * Yapı: baslik (kimlik/duygu + uzun kuyruk), sunum (vaat + kanıt),
 * hikayeler (üç satış argümanı; ara başlıklar soru ya da iddia biçiminde).
 */

export const METINLER = {
  /* ---------------------------------------------------------------- */
  floorstudio: {
    en: {
      baslik: "Nobody praises a floor. They notice it when it is wrong.",
      sunum:
        "A client will not tell you the parquet looks right. But a herringbone that breaks at the wall, or a joint that drifts two millimetres per row, is the first thing their eye catches — and the thing that quietly makes the whole render feel cheap. This parametric floor pattern plugin for SketchUp lays the floor the way a flooring contractor would: you pick the face, pick the pattern, and the boards fall into place already cut to the room. Drawing, array-copying and trimming that floor by hand takes about 45 minutes. Here it takes 45 seconds.",
      hikayeler: [
        {
          baslik: "Why does hand-laid parquet always break at the edges?",
          metin:
            "Because copy-and-array does not know where the wall is. FloorStudio cuts every board against the real boundary of the face, so no piece hangs over the skirting and no triangle is left half-drawn in a corner. What you see in the viewport is what a fitter could actually lay.",
        },
        {
          baslik: "The joint is exactly the width you typed",
          metin:
            "Gap width is a real dimension here, not a texture trick. Type 3 mm and the gap measures 3 mm at the far end of a twelve-metre corridor too. That matters the moment someone renders the room in V-Ray or Enscape and the grazing light falls across the floor.",
        },
        {
          baslik: "The order list comes out with the floor",
          metin:
            "Every run writes a CSV take-off alongside the geometry — board count and area, straight from the model you just built. You are not counting rows on screen at midnight to price the job.",
        },
      ],
    },
    tr: {
      baslik: "Zemini kimse övmez. Yanlış olduğunda fark ederler.",
      sunum:
        "Müşteri size parkenin güzel olduğunu söylemez. Ama duvarda kırılan bir balıksırtı ya da her sırada iki milimetre kayan bir derz, gözünün ilk takıldığı yerdir — ve bütün görseli sessizce ucuzlatan şeydir. Bu SketchUp zemin kaplama eklentisi, zemini bir parke ustasının döşeyeceği gibi döşer: yüzeyi seçersiniz, deseni seçersiniz, tahtalar odaya göre kesilmiş olarak yerine oturur. Aynı zemini elle çizip çoğaltıp tek tek kesmek yaklaşık 45 dakika sürer. Burada 45 saniye.",
      hikayeler: [
        {
          baslik: "Elle döşenen parke neden hep kenarda bozulur?",
          metin:
            "Çünkü kopyala-çoğalt duvarın nerede olduğunu bilmez. FloorStudio her tahtayı yüzeyin gerçek sınırına göre keser; süpürgeliğin üstüne taşan parça da, köşede yarım kalan üçgen de olmaz. Ekranda gördüğünüz şey, bir ustanın gerçekten döşeyebileceği şeydir.",
        },
        {
          baslik: "Derz, tam yazdığınız ölçüde",
          metin:
            "Burada derz aralığı gerçek bir ölçüdür, doku hilesi değil. 3 mm yazarsınız, on iki metrelik koridorun öbür ucunda da 3 mm ölçer. Oda V-Ray ya da Enscape'te render edilip ışık zemine yalayarak düştüğünde bunun değeri anlaşılır.",
        },
        {
          baslik: "Sipariş listesi zeminle birlikte çıkar",
          metin:
            "Her üretim, geometriyle beraber CSV metraj da yazar: tahta adedi ve alan, az önce kurduğunuz modelden. Gece yarısı ekranda sıra sayıp fiyat çıkarmak zorunda kalmazsınız.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  roadflow: {
    en: {
      baslik: "The road is never the design. It is the thing that eats the week before the design.",
      sunum:
        "You took the job for the buildings. Then the site came with a 400-metre access road, a slope that will not behave, and a client who wants to see it on the terrain by Friday. Modelling one corridor by hand and cutting it into the terrain runs about 240 minutes. With this parametric road plugin for SketchUp you click the route, set the cross-section and press Apply: 90 seconds. Across the test suite it builds 13 to 35 times faster than hand modelling, and 408 automated tests run green on every release.",
      hikayeler: [
        {
          baslik: "One centreline, a whole corridor",
          metin:
            "Draw the alignment and the carriageway, kerbs, shoulders and batters follow it — superelevation, cut and fill included. Seven ready road types cover the usual cases, so you are configuring a road rather than drafting one.",
        },
        {
          baslik: "What happens when the alignment moves?",
          metin:
            "You move it. The corridor rebuilds along the new line instead of being redrawn from scratch. That is the difference between a revision costing you ten minutes and costing you an evening.",
        },
        {
          baslik: "Quantities you did not have to count",
          metin:
            "Asphalt area, kerb length and earthwork volumes come out of the model that is already on screen. Nobody is exporting sections into a spreadsheet to add them up by hand.",
        },
      ],
    },
    tr: {
      baslik: "Yol hiçbir zaman tasarım değildir. Tasarımdan önceki haftayı yiyen şeydir.",
      sunum:
        "İşi binalar için aldınız. Sonra arsa 400 metrelik bir ulaşım yoluyla, uslanmayan bir eğimle ve cumaya kadar bunu arazide görmek isteyen bir müşteriyle geldi. Bir koridoru elle modelleyip araziye oturtmak yaklaşık 240 dakika. Bu SketchUp parametrik yol eklentisiyle güzergâhı tıklar, kesiti girer, Uygula'ya basarsınız: 90 saniye. Test setinde elle modellemeye göre 13-35 kat hızlı üretim ölçüldü ve her sürümde 408 otomatik test yeşil koşuyor.",
      hikayeler: [
        {
          baslik: "Tek eksen, koca bir koridor",
          metin:
            "Güzergâhı çizersiniz; kaplama, bordür, banket ve şevler onu takip eder — dever, yarma ve dolgu dahil. Yedi hazır yol tipi alışılmış durumları karşılar, yani yol çizmek yerine yol ayarlarsınız.",
        },
        {
          baslik: "Güzergâh değişirse ne olur?",
          metin:
            "Değiştirirsiniz. Koridor baştan çizilmek yerine yeni hat boyunca kendini yeniden kurar. Bir revizyonun size on dakikaya mı yoksa bir akşama mı mal olacağı farkı budur.",
        },
        {
          baslik: "Saymak zorunda kalmadığınız metraj",
          metin:
            "Asfalt alanı, bordür uzunluğu ve hafriyat hacimleri zaten ekranda duran modelden çıkar. Kesitleri tabloya aktarıp elle toplayan kimse olmaz.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "windowfun-studio": {
    en: {
      baslik: "A window drawn as a box tells the client you did not look closely.",
      sunum:
        "Facades are judged on windows. A flat rectangle in the opening reads as a placeholder; a window with a real frame, sash, bead and handle reads as a building somebody thought about. Boxing one window by hand and then pricing it takes around 40 minutes. This parametric window plugin for SketchUp turns dimensions into both at once — window and quote — in about 25 seconds, from a catalogue of 51 models across 6 categories, with CSV, DXF and PDF quotes on the way out.",
      hikayeler: [
        {
          baslik: "Type the dimension, let the window build itself",
          metin:
            "Frame, sash, mullion, glazing and hardware are generated from the sizes you enter, at their real profile thickness. A 70 mm profile stays 70 mm whether the window is 400 mm or 4 metres wide — exactly as it would arrive from the joinery.",
        },
        {
          baslik: "The opening changed at 6pm. Does that cost you the evening?",
          metin:
            "No. Change the number and the window rebuilds in place, catalogue choice intact. Revisions stop being a reason to dread the phone ringing late in the day.",
        },
        {
          baslik: "The quote is ready when the model is",
          metin:
            "Profile lengths, glass area and hardware counts come from the same geometry you are looking at, so the price you give is the price the model supports. Works on SketchUp 2024, 2025 and 2026.",
        },
      ],
    },
    tr: {
      baslik: "Kutu olarak çizilmiş bir pencere, müşteriye yakından bakmadığınızı söyler.",
      sunum:
        "Cepheler pencereden yargılanır. Boşluğa konmuş düz bir dikdörtgen yer tutucu gibi durur; gerçek kasası, kanadı, çıtası ve kulpuyla bir pencere ise üzerinde düşünülmüş bir bina gibi. Bir pencereyi elle kutulardan çizip sonra fiyatlamak yaklaşık 40 dakika sürer. Bu SketchUp parametrik pencere eklentisi ölçüyü ikisine birden çevirir — pencere ve teklif — yaklaşık 25 saniyede; 6 kategoride 51 modellik katalogdan, çıkışta CSV, DXF ve PDF teklifle birlikte.",
      hikayeler: [
        {
          baslik: "Ölçüyü yazın, pencere kendini kursun",
          metin:
            "Kasa, kanat, kayıt, cam ve donanım girdiğiniz ölçülerden, gerçek profil kalınlığında üretilir. 70 mm'lik profil, pencere ister 400 mm ister 4 metre olsun 70 mm kalır — doğramadan nasıl gelecekse öyle.",
        },
        {
          baslik: "Boşluk akşam altıda değişti. Akşamınız gitti mi?",
          metin:
            "Hayır. Sayıyı değiştirirsiniz, pencere yerinde yeniden kurulur, katalog seçimi de durur. Revizyon, günün sonunda telefonun çalmasından korkma sebebi olmaktan çıkar.",
        },
        {
          baslik: "Teklif, model bittiğinde hazır",
          metin:
            "Profil boyları, cam alanı ve donanım adetleri baktığınız geometriden gelir; verdiğiniz fiyat modelin desteklediği fiyattır. SketchUp 2024, 2025 ve 2026 ile çalışır.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "door-studio": {
    en: {
      baslik: "The door is where the client walks up and looks closely.",
      sunum:
        "Everything else is seen from across the room. The door is seen from forty centimetres — and that is where a box with a texture on it falls apart. Modelling one panelled door by hand takes about 25 minutes, which is why most models end up with the same flat slab repeated down the corridor. This parametric door plugin for SketchUp places a real door in about 20 seconds: pick from 51 models in 4 categories, click the wall, and the stiles, rails, rebated frame, mitred architrave, raised panel, glazing bead, hinge and lock are there as actual geometry. 572 automated tests run green, on SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "You never line it up by hand",
          metin:
            "It raytests the wall for direction, thickness and floor level, so the door arrives aligned on the first click. Seen from above, two corner clicks give it the same answer.",
        },
        {
          baslik: "Let the client change their mind",
          metin:
            "Click a placed door, the panel loads its settings, change what you want and it rebuilds in place. The whole session undoes with one Ctrl+Z, so trying three options costs you nothing but curiosity.",
        },
        {
          baslik: "What holds up when someone zooms in?",
          metin:
            "Real profiles do. Identical profiles share one component definition, so a hundred doors across a project collapse into a handful of definitions — edit one, they all update, and the file stays light enough to keep working in.",
        },
      ],
    },
    tr: {
      baslik: "Kapı, müşterinin yanına gelip yakından baktığı yerdir.",
      sunum:
        "Geri kalan her şey odanın öbür ucundan görülür. Kapı kırk santimden görülür — ve üzerine doku giydirilmiş bir kutunun dağıldığı yer tam orasıdır. Bir panelli kapıyı elde modellemek yaklaşık 25 dakika sürer; çoğu modelde koridor boyunca aynı düz levhanın tekrarlanmasının sebebi de budur. Bu SketchUp parametrik kapı eklentisi gerçek bir kapıyı yaklaşık 20 saniyede yerleştirir: 4 kategorideki 51 modelden birini seçin, duvara tıklayın; dikme, kayıt, lambalı kasa, gönyeli pervaz, kabartma panel, cam çıtası, menteşe ve kilit gerçek geometri olarak oradadır. 572 otomatik test yeşil; SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "Hizalamakla hiç uğraşmazsınız",
          metin:
            "Duvarın yönünü, kalınlığını ve döşeme kotunu ışın testiyle okur; kapı ilk tıkta hizalanmış gelir. Üstten bakarken iki köşe tıklaması da aynı bilgiyi verir.",
        },
        {
          baslik: "Bırakın müşteri fikir değiştirsin",
          metin:
            "Yerleşmiş bir kapıya tıklarsınız, panel ayarlarını yükler, istediğinizi değiştirirsiniz, kapı yerinde yeniden kurulur. Tüm oturum tek Ctrl+Z ile geri alınır; üç seçeneği denemenin maliyeti meraktan ibarettir.",
        },
        {
          baslik: "Yakınlaşıldığında ne ayakta kalır?",
          metin:
            "Gerçek profiller. Aynı ölçüdeki profiller tek bileşen tanımını paylaşır; projedeki yüz kapı birkaç tanıma iner — birini düzenlersiniz, hepsi güncellenir ve dosya çalışılabilir hafiflikte kalır.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  cityfill: {
    en: {
      baslik: "Your building deserves a street, not an empty plot.",
      sunum:
        "A tower standing alone on grey ground looks like a product shot. The same tower with a living street around it looks like a project that belongs somewhere. The reason most presentations skip the context is cost: hunting down and placing filler buildings one by one runs about 150 minutes. CityFill fills an entire block in roughly 25 seconds, from 154 ready buildings, with three placement modes, on SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "Time on design, not on searching",
          metin:
            "The library is already there, so you are not trawling for a model that is the wrong scale and arrives with 400,000 polygons. You scatter, you look, you adjust.",
        },
        {
          baslik: "What makes a street look alive?",
          metin:
            "Variation. Heights, widths and frontages differ the way a real row does, so the context reads as a neighbourhood rather than a copied block — which is exactly what the eye checks first in a presentation image.",
        },
        {
          baslik: "Change the one you do not like, where it stands",
          metin:
            "Any placed building can be swapped or adjusted in position without rebuilding the row around it. The context stays a background you control, not a decision you are stuck with.",
        },
      ],
    },
    tr: {
      baslik: "Binanız boş bir parseli değil, bir sokağı hak ediyor.",
      sunum:
        "Gri zeminde tek başına duran bir kule ürün fotoğrafı gibi görünür. Etrafında yaşayan bir sokak olan aynı kule, bir yere ait olan bir proje gibi görünür. Çoğu sunumun çevreyi atlamasının sebebi maliyettir: dolgu binalarını tek tek avlayıp yerleştirmek yaklaşık 150 dakika sürer. CityFill bir adanın tamamını yaklaşık 25 saniyede doldurur; 154 hazır bina, üç yerleştirme modu, SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "Zaman aramaya değil tasarıma",
          metin:
            "Kütüphane zaten orada; ölçeği tutmayan ve 400 bin poligonla gelen bir modeli internette aramıyorsunuz. Serpiştirirsiniz, bakarsınız, ayarlarsınız.",
        },
        {
          baslik: "Bir sokağı yaşayan yapan nedir?",
          metin:
            "Çeşitlilik. Yükseklikler, genişlikler ve cepheler gerçek bir sıradaki gibi değişir; böylece çevre kopyalanmış bir blok değil, bir mahalle gibi okunur — sunum görselinde gözün ilk kontrol ettiği şey tam olarak budur.",
        },
        {
          baslik: "Beğenmediğinizi yerinde değiştirin",
          metin:
            "Yerleşmiş herhangi bir bina, çevresindeki sırayı yeniden kurmadan değiştirilebilir ya da kaydırılabilir. Çevre, mahkûm olduğunuz bir karar değil, yönettiğiniz bir fon olarak kalır.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "wardrobe-studio": {
    en: {
      baslik: "The wardrobe is sold in the living room and lost in the workshop.",
      sunum:
        "You win the job by showing the client a wardrobe they can see themselves using. You lose the margin three weeks later, when a panel is cut 18 mm short because the drawing and the cutting list were written by two different hands. Drawing every panel and then typing the cutting list takes about 120 minutes. CabinetWizard goes from dimensions to Add to Model in roughly 90 seconds, turning 20 components into 131 solids, with 12 finishes and 7 door styles — 164 tests green, SketchUp 2017 and newer, Windows and macOS.",
      hikayeler: [
        {
          baslik: "Draw once, and the workshop already has it",
          metin:
            "The model, the quote and the cutting list come out of the same calculation, so the panel on the saw is the panel in the render. Hole positions are computed in one place rather than transcribed.",
        },
        {
          baslik: "The alcove measured 2 cm narrower on site. Now what?",
          metin:
            "You type the new width. Bays, doors, drawers and the cut list adapt together instead of you reworking an evening's drawing. Site reality stops being a punishment.",
        },
        {
          baslik: "Quote on the table, cut list on the machine",
          metin:
            "Board, edge banding, hardware and labour are priced from real quantities, and the cutting data leaves as the format your machine expects. One job, one source of truth.",
        },
      ],
    },
    tr: {
      baslik: "Dolap oturma odasında satılır, atölyede kaybedilir.",
      sunum:
        "İşi, müşteriye kendini kullanırken görebileceği bir dolabı göstererek alırsınız. Kârı üç hafta sonra, çizimle kesim listesini iki ayrı el yazdığı için bir panel 18 mm kısa kesildiğinde kaybedersiniz. Her paneli elle çizip sonra kesim listesini yazmak yaklaşık 120 dakika sürer. Dolap Sihirbazı, ölçüden Modele Ekle'ye yaklaşık 90 saniyede gider; 20 bileşeni 131 katıya çevirir, 12 kaplama ve 7 kapak stiliyle — 164 test yeşil, SketchUp 2017 ve üzeri, Windows ve macOS.",
      hikayeler: [
        {
          baslik: "Bir kez çizin, atölye zaten almış olsun",
          metin:
            "Model, teklif ve kesim listesi aynı hesaptan çıkar; testeredeki panel, görseldeki paneldir. Delik konumları kopyalanmaz, tek yerde hesaplanır.",
        },
        {
          baslik: "Niş yerinde 2 cm dar çıktı. Şimdi ne olacak?",
          metin:
            "Yeni genişliği yazarsınız. Bölmeler, kapaklar, çekmeceler ve kesim listesi birlikte uyarlanır; bir akşamlık çizimi baştan yapmazsınız. Sahadaki gerçeklik bir ceza olmaktan çıkar.",
        },
        {
          baslik: "Teklif masada, kesim listesi makinede",
          metin:
            "Plaka, bant, donanım ve işçilik gerçek miktarlardan fiyatlanır; kesim verisi makinenizin beklediği biçimde çıkar. Tek iş, tek doğruluk kaynağı.",
        },
      ],
    },
  },
};
