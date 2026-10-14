/** Tanıtım metinleri — bölüm 3. Kurallar için bkz. `tanitim-metinleri.mjs`. */

export const METINLER = {
  /* ---------------------------------------------------------------- */
  archiflow: {
    en: {
      baslik: "Move one wall and the model punishes you for the rest of the day.",
      sunum:
        "That is the quiet tax on every architectural model: the wall moves, and then the floor, the ceiling, the skirting, the doors and the quantities all have to be repaired by hand — about 30 minutes for one wall. ArchiFlow Studio makes the model reactive instead. You move the wall and it repairs itself in roughly 2 seconds, rebuilding in about 150 ms, with five studios built in and no dependency on other extensions. SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "From plan to building, in one press",
          metin:
            "Walls, slabs, roofs, stairs and openings are generated as a connected building rather than as separate groups that only look related. What holds them together is the model, not your memory of how you drew it.",
        },
        {
          baslik: "Why do revisions happen at night?",
          metin:
            "Because repairing a model by hand cannot be done while someone is talking to you. When the building reacts to the change itself, the revision happens in the meeting instead of after it.",
        },
        {
          baslik: "Quantities as current as the building",
          metin:
            "Areas and volumes are read from the live model, so the schedule does not quietly describe last week's design while you present this week's.",
        },
      ],
    },
    tr: {
      baslik: "Bir duvarı taşıyın, model günün geri kalanında sizi cezalandırsın.",
      sunum:
        "Her mimari modelin sessiz vergisi budur: duvar taşınır, sonra döşeme, tavan, süpürgelik, kapılar ve metrajlar elle onarılır — tek duvar için yaklaşık 30 dakika. ArchiFlow Studio bunun yerine modeli tepkili yapar. Duvarı taşırsınız, model yaklaşık 2 saniyede kendini onarır; yeniden kurulum yaklaşık 150 ms, beş stüdyo gömülü ve başka eklentiye bağımlılık yok. SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "Plandan binaya, tek tuşla",
          metin:
            "Duvarlar, döşemeler, çatılar, merdivenler ve boşluklar birbirine bağlı bir bina olarak üretilir; yalnızca ilişkili görünen ayrı gruplar olarak değil. Onları bir arada tutan şey modelin kendisidir, nasıl çizdiğinizi hatırlamanız değil.",
        },
        {
          baslik: "Revizyonlar neden gece yapılır?",
          metin:
            "Çünkü modeli elle onarmak, biri sizinle konuşurken yapılabilecek bir iş değildir. Bina değişikliğe kendi tepki verdiğinde revizyon toplantıdan sonra değil toplantının içinde olur.",
        },
        {
          baslik: "Bina kadar güncel metraj",
          metin:
            "Alanlar ve hacimler canlı modelden okunur; siz bu haftanın tasarımını sunarken cetvel sessizce geçen haftanınkini anlatmaz.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "universal-converter": {
    en: {
      baslik: "The model you were sent is not the problem. The hour you spend cleaning it is.",
      sunum:
        "A supplier sends an FBX, a client sends an OBJ, the furniture arrives as GLB — and each one lands in SketchUp as a mesh with flipped faces, lost materials and more triangles than the rest of your building put together. Cleaning one imported model by hand runs about 35 minutes. Universal Converter drops the file into a queue and hands you a report in roughly 45 seconds: a 16-stage pipeline, 7 input formats, around 3x faster on an 819,000-triangle model. SketchUp 2024 through 2027, Windows and Mac.",
      hikayeler: [
        {
          baslik: "Whatever format turns up",
          metin:
            "FBX, OBJ, 3DS, DAE, STL and glTF/GLB all go through the same pipeline, so you stop keeping a mental list of which converter to open for which supplier.",
        },
        {
          baslik: "Who does the cleanup, every time?",
          metin:
            "It does. Optimisation is not optional here — no model is imported as raw geometry — so the file that lands in your model is already something you can work in rather than something you must survive.",
        },
        {
          baslik: "Textures end up where they belong",
          metin:
            "Materials and UVs are carried through instead of being lost in translation, which is the usual reason an imported chair arrives grey and has to be re-textured by hand.",
        },
      ],
    },
    tr: {
      baslik: "Size gönderilen model sorun değil. Onu temizlemeye harcadığınız saat sorun.",
      sunum:
        "Tedarikçi FBX gönderir, müşteri OBJ gönderir, mobilya GLB olarak gelir — ve her biri SketchUp'a ters yüzlü, malzemesi kaybolmuş ve binanızın tamamından fazla üçgen taşıyan bir ağ olarak düşer. İçe aktarılan bir modeli elle temizlemek yaklaşık 35 dakika sürer. Evrensel Dönüştürücü dosyayı kuyruğa bırakır ve yaklaşık 45 saniyede size bir rapor verir: 16 aşamalı hat, 7 giriş biçimi, 819 bin üçgenlik bir modelde yaklaşık 3 kat hız. SketchUp 2024-2027, Windows ve Mac.",
      hikayeler: [
        {
          baslik: "Hangi biçim gelirse gelsin",
          metin:
            "FBX, OBJ, 3DS, DAE, STL ve glTF/GLB aynı hattan geçer; hangi tedarikçi için hangi dönüştürücüyü açacağınızı akılda tutmayı bırakırsınız.",
        },
        {
          baslik: "Temizliği her seferinde kim yapıyor?",
          metin:
            "O yapıyor. Burada optimizasyon isteğe bağlı değildir — hiçbir model ham geometri olarak aktarılmaz — yani modelinize düşen dosya, hayatta kalmanız gereken bir şey değil, içinde çalışabileceğiniz bir şeydir.",
        },
        {
          baslik: "Dokular ait olduğu yere oturur",
          metin:
            "Malzemeler ve UV'ler çeviride kaybolmak yerine taşınır; içe aktarılan bir sandalyenin gri gelip elle yeniden kaplanmasının olağan sebebi de budur.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "dynamic-skirting": {
    en: {
      baslik: "Skirting is the detail nobody draws and everybody sees.",
      sunum:
        "In a close-up interior render, the line where the wall meets the floor is in frame constantly. Leave it out and the room reads as unfinished; draw it by hand and one room costs about 14 minutes, every room, every revision. Dynamic Skirting runs it in roughly 25 seconds: click the floor, pick the profile. 24 profiles, Turkish, English and Spanish, SketchUp 2024 through 2026.",
      hikayeler: [
        {
          baslik: "Clean corners on the first pass",
          metin:
            "Internal and external corners are mitred as it runs, so you are not zooming into a corner afterwards to fix a profile that twisted the wrong way.",
        },
        {
          baslik: "Changed the profile? That is not a redraw",
          metin:
            "Pick a different section and the run updates along the same path. Trying the 80 mm instead of the 60 mm becomes a decision you can actually make, not one you avoid because of the work.",
        },
        {
          baslik: "The order length comes from the model",
          metin:
            "Lengths and part counts export as CSV from the run you just generated, so the metres you order match the metres on the wall.",
        },
      ],
    },
    tr: {
      baslik: "Süpürgelik, kimsenin çizmediği ve herkesin gördüğü detaydır.",
      sunum:
        "Yakın plan bir iç mekân görselinde duvarla döşemenin birleştiği çizgi sürekli kadraj içindedir. Koymazsanız oda bitmemiş okunur; elle çizerseniz tek oda yaklaşık 14 dakikaya mal olur — her oda, her revizyon. Dynamic Skirting bunu yaklaşık 25 saniyede yapar: döşemeye tıklayın, profili seçin. 24 profil, Türkçe, İngilizce ve İspanyolca, SketchUp 2024-2026.",
      hikayeler: [
        {
          baslik: "İlk geçişte temiz köşe",
          metin:
            "İç ve dış köşeler üretim sırasında gönyelenir; sonradan köşeye yakınlaşıp ters dönmüş bir profili düzeltmeye çalışmazsınız.",
        },
        {
          baslik: "Profil mi değişti? Bu yeniden çizim değil",
          metin:
            "Başka bir kesit seçersiniz, aynı yol boyunca üretim güncellenir. 60'lık yerine 80'liği denemek, işten kaçındığınız bir şey değil gerçekten verebileceğiniz bir karar olur.",
        },
        {
          baslik: "Sipariş metrajı modelden gelir",
          metin:
            "Uzunluklar ve parça adetleri az önce ürettiğiniz üretimden CSV olarak çıkar; sipariş ettiğiniz metre duvardaki metreyle örtüşür.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "curtain-craft": {
    en: {
      baslik: "A window without curtains is a hole. With them, it is a room someone lives in.",
      sunum:
        "Soft furnishing is what separates an interior visual from a CAD drawing, and it is almost always the thing left out — because modelling one curtain by hand and then measuring its fabric takes about 35 minutes. PerdeNeşe Studio does both in roughly 40 seconds: three clicks, take-off included. 19 systems, 826 automated tests green, Turkish, English and Spanish, SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "Three clicks, a dressed window",
          metin:
            "Start point, width, height — the curtain builds itself with real folds rather than a flat plane wearing a fabric texture, which is what gives the render its depth.",
        },
        {
          baslik: "Let the client change their mind, again",
          metin:
            "Switch from sheer to roman or vertical and the curtain rebuilds in place. Nineteen systems means the conversation is about which one, not about whether there is time.",
        },
        {
          baslik: "The quote is ready with the model",
          metin:
            "Fabric, hardware, track and joint quantities are calculated as it builds, so the price you quote is grounded in the curtain you just showed them.",
        },
      ],
    },
    tr: {
      baslik: "Perdesiz pencere bir deliktir. Perdeliyse, birinin yaşadığı bir odadır.",
      sunum:
        "Bir iç mekân görselini CAD çiziminden ayıran şey tekstildir ve neredeyse her zaman atlanan şey de odur — çünkü bir perdeyi elle modelleyip kumaşını ölçmek yaklaşık 35 dakika sürer. PerdeNeşe Studio ikisini birden yaklaşık 40 saniyede yapar: üç tık, metraj içinde. 19 sistem, 826 otomatik test yeşil, Türkçe, İngilizce ve İspanyolca, SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "Üç tık, giyinmiş bir pencere",
          metin:
            "Başlangıç, genişlik, yükseklik — perde kendini gerçek kıvrımlarla kurar; kumaş dokusu giydirilmiş düz bir yüzeyle değil. Görsele derinliğini veren şey de budur.",
        },
        {
          baslik: "Bırakın müşteri yine fikir değiştirsin",
          metin:
            "Tülden roman perdeye ya da dikeye geçersiniz, perde yerinde yeniden kurulur. On dokuz sistem, konuşmanın 'hangisi' üzerine olması demektir; 'vakit var mı' üzerine değil.",
        },
        {
          baslik: "Teklif modelle birlikte hazır",
          metin:
            "Kumaş, donanım, kornişi ve birleşim miktarları üretim sırasında hesaplanır; verdiğiniz fiyat az önce gösterdiğiniz perdeye dayanır.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "garden-wall-studio": {
    en: {
      baslik: "The boundary wall is the first thing built and the last thing drawn.",
      sunum:
        "It runs the length of the site, it steps with the slope, and it is usually drawn post by post at the end of the project when there is no time left — about 180 minutes, then counting the take-off by hand. Garden Wall Studio takes roughly 90 seconds: select the edges, choose the character, read the report. 13 wall characters, 6 gate presets, take-off report with CSV, SketchUp 2021 through 2026.",
      hikayeler: [
        {
          baslik: "Draw the boundary once and the wall is done",
          metin:
            "Posts, panels, caps and gates follow the line you selected, so the wall is a property of the site rather than a separate drawing you keep forgetting to update.",
        },
        {
          baslik: "Who works out the stepping on a slope?",
          metin:
            "The terrain does. The wall steps with the ground instead of floating above it at one end and burying itself at the other — the single detail that gives away a wall drawn flat.",
        },
        {
          baslik: "Cost ready with the model",
          metin:
            "Lengths, post counts and areas come out as a report and CSV, so the figure you give the client is the one the drawing supports.",
        },
      ],
    },
    tr: {
      baslik: "Bahçe duvarı ilk inşa edilen, en son çizilen şeydir.",
      sunum:
        "Arsa boyunca uzanır, eğimle kademelenir ve genelde projenin sonunda, vakit kalmamışken direk direk çizilir — yaklaşık 180 dakika, sonra bir de metrajı elle saymak. Bahçe Duvarı Stüdyosu yaklaşık 90 saniye alır: kenarları seçin, karakteri seçin, raporu okuyun. 13 duvar karakteri, 6 kapı hazır ayarı, CSV'li metraj raporu, SketchUp 2021-2026.",
      hikayeler: [
        {
          baslik: "Sınırı bir kez çizin, duvar tamam",
          metin:
            "Direkler, paneller, harpuştalar ve kapılar seçtiğiniz hattı takip eder; duvar, güncellemeyi hep unuttuğunuz ayrı bir çizim değil arsanın bir özelliği olur.",
        },
        {
          baslik: "Eğimdeki kademeyi kim hesaplıyor?",
          metin:
            "Arazi. Duvar zeminle birlikte kademelenir; bir ucunda havada kalıp öbür ucunda toprağa gömülmez — düz çizilmiş bir duvarı ele veren tek detay da budur.",
        },
        {
          baslik: "Maliyet modelle birlikte hazır",
          metin:
            "Uzunluklar, direk adetleri ve alanlar rapor ve CSV olarak çıkar; müşteriye verdiğiniz rakam çizimin desteklediği rakamdır.",
        },
      ],
    },
  },
};
