/** Tanıtım metinleri — bölüm 4. Kurallar için bkz. `tanitim-metinleri.mjs`. */

export const METINLER = {
  /* ---------------------------------------------------------------- */
  "prefabrik-studio": {
    en: {
      baslik: "The client asks for a price before you have a building.",
      sunum:
        "Prefabricated steel work is sold on a number, and the number depends on a frame nobody has drawn yet. Rebuilding the frame and recounting the take-off each time the span changes runs about 90 minutes. Prefab Studio lets you drag the width and watch the quantities follow — roughly 20 seconds. Spans from 3.6 to 15 m by 4.8 to 24 m, 3 truss types chosen automatically, live steel kg and panel m². It runs in a desktop browser, not inside SketchUp, and exports GLB.",
      hikayeler: [
        {
          baslik: "Three sliders, a ready building",
          metin:
            "Width, length and height are the whole interface. The frame that appears is a frame, not a sketch — so what you are pricing is something that could actually be fabricated.",
        },
        {
          baslik: "Which truss should it be?",
          metin:
            "The span decides. The truss type is selected automatically from the geometry rather than from habit, which is what keeps a quick study from quietly becoming an unbuildable one.",
        },
        {
          baslik: "Quantities that are never stale",
          metin:
            "Steel weight and panel area update as you drag, so the figure on screen always belongs to the building on screen — and the quote you send matches what you showed.",
        },
      ],
    },
    tr: {
      baslik: "Müşteri, ortada bina yokken fiyat sorar.",
      sunum:
        "Prefabrik çelik iş bir rakam üzerinden satılır ve o rakam henüz kimsenin çizmediği bir karkasa bağlıdır. Açıklık her değiştiğinde karkası yeniden kurup metrajı baştan saymak yaklaşık 90 dakika sürer. Prefabrik Stüdyo genişliği çekmenize ve metrajın peşinden gelmesine izin verir — yaklaşık 20 saniye. 3,6-15 m x 4,8-24 m açıklıklar, otomatik seçilen 3 makas tipi, canlı çelik kg ve panel m². Masaüstü tarayıcıda çalışır, SketchUp içinde değil; GLB olarak dışa aktarır.",
      hikayeler: [
        {
          baslik: "Üç kaydırıcı, hazır bir bina",
          metin:
            "Genişlik, uzunluk ve yükseklik arayüzün tamamı. Beliren şey bir karkastır, eskiz değil — yani fiyatladığınız şey gerçekten imal edilebilecek bir şeydir.",
        },
        {
          baslik: "Hangi makas olmalı?",
          metin:
            "Açıklık karar verir. Makas tipi alışkanlıktan değil geometriden otomatik seçilir; hızlı bir etüdün sessizce yapılamaz bir şeye dönüşmesini engelleyen de budur.",
        },
        {
          baslik: "Hiç bayatlamayan metraj",
          metin:
            "Çelik ağırlığı ve panel alanı siz çekerken güncellenir; ekrandaki rakam her zaman ekrandaki binaya aittir — gönderdiğiniz teklif gösterdiğiniz şeyle örtüşür.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  metraj: {
    en: {
      baslik: "The tape measure, the notepad, then the spreadsheet that gets it wrong at midnight.",
      sunum:
        "Measuring a room, writing it on paper and then rebuilding it in Excel takes about 35 minutes — and the error that costs you money is always in the transcription, not the measuring. Metraj turns it into roughly 90 seconds: type the room, read the total. 11 material types, 119 automated tests green, with PDF, CSV, JSON and PNG output. It runs in the browser with no installation and no account, and your data stays on your device.",
      hikayeler: [
        {
          baslik: "Type it once, let the rest be measured",
          metin:
            "Room dimensions become floor, ceiling and wall areas automatically, so nothing is multiplied by hand and nothing is mistyped between the notepad and the sheet.",
        },
        {
          baslik: "Is it the gross area or the net you are pricing?",
          metin:
            "The net. Doors and windows are deducted from the wall area as you place them, which is the difference between a quote that holds and one you have to explain later.",
        },
        {
          baslik: "The number changed. So does the total",
          metin:
            "Change a dimension and every dependent figure recalculates. A client asking 'what if the room were 40 cm wider' stops being a reason to start again.",
        },
      ],
    },
    tr: {
      baslik: "Metre, kâğıt, sonra gece yarısı yanlış hesaplayan tablo.",
      sunum:
        "Bir odayı ölçmek, kâğıda yazmak ve sonra Excel'de yeniden kurmak yaklaşık 35 dakika sürer — ve size para kaybettiren hata her zaman ölçmede değil aktarmada olur. Metraj bunu yaklaşık 90 saniyeye indirir: odayı yazın, toplamı okuyun. 11 malzeme türü, 119 otomatik test yeşil; PDF, CSV, JSON ve PNG çıktısı. Tarayıcıda çalışır, kurulum ve hesap istemez, veriler cihazınızda kalır.",
      hikayeler: [
        {
          baslik: "Bir kez yazın, gerisi ölçülü gelsin",
          metin:
            "Oda ölçüleri kendiliğinden zemin, tavan ve duvar alanlarına dönüşür; elle çarpılan bir şey olmaz, kâğıtla tablo arasında yanlış yazılan bir sayı da.",
        },
        {
          baslik: "Fiyatladığınız brüt alan mı, net mi?",
          metin:
            "Net. Kapı ve pencereler yerleştirildikçe duvar alanından düşülür; tutan bir teklifle sonradan açıklamak zorunda kaldığınız teklif arasındaki fark budur.",
        },
        {
          baslik: "Rakam değişti. Toplam da döner",
          metin:
            "Bir ölçüyü değiştirirsiniz, ona bağlı bütün değerler yeniden hesaplanır. Müşterinin 'oda 40 cm geniş olsa ne olurdu' sorusu baştan başlama sebebi olmaktan çıkar.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "panelcut-studio": {
    en: {
      baslik: "The mistake does not happen at the drawing. It happens at the saw.",
      sunum:
        "A cutting list written by hand and a drawing redone in CAD take about 55 minutes between them — and they are two documents that can disagree, which is how a sheet gets cut wrong. PanelCut Studio builds the panel and gives you both DXF files in roughly 30 seconds. 236 automated tests green, 2 nesting engines, 25 validation rules. It is a browser tool: static hosting, no Node.js, PHP or database required.",
      hikayeler: [
        {
          baslik: "One drawing, every workshop document",
          metin:
            "The cutting list, the nesting layout and the DXF come from the same panel definition, so the paper on the wall and the file on the machine cannot drift apart.",
        },
        {
          baslik: "What happens when a dimension changes?",
          metin:
            "The nesting is recalculated rather than patched. A late change does not quietly leave an old offcut plan in circulation.",
        },
        {
          baslik: "A bad sheet never reaches the saw",
          metin:
            "25 validation rules check the panel before anything is exported, so the errors that cost material are caught on screen instead of on the machine.",
        },
      ],
    },
    tr: {
      baslik: "Hata çizimde olmaz. Testerede olur.",
      sunum:
        "Elle yazılan bir kesim listesi ve CAD'de baştan çizilen bir resim arasında yaklaşık 55 dakika vardır — ve bunlar birbiriyle çelişebilecek iki belgedir; bir plakanın yanlış kesilmesi de böyle olur. PanelCut Studio paneli kurar ve iki DXF'i birden yaklaşık 30 saniyede verir. 236 otomatik test yeşil, 2 yerleşim motoru, 25 doğrulama kuralı. Tarayıcı aracıdır: statik barındırma yeter, Node.js, PHP ya da veritabanı gerekmez.",
      hikayeler: [
        {
          baslik: "Tek çizim, bütün atölye belgeleri",
          metin:
            "Kesim listesi, yerleşim planı ve DXF aynı panel tanımından çıkar; duvardaki kâğıtla makinedeki dosya birbirinden ayrışamaz.",
        },
        {
          baslik: "Bir ölçü değişince ne oluyor?",
          metin:
            "Yerleşim yamanmaz, yeniden hesaplanır. Geç gelen bir değişiklik, dolaşımda eski bir fire planı bırakmaz.",
        },
        {
          baslik: "Hatalı plaka testereye hiç ulaşmaz",
          metin:
            "25 doğrulama kuralı, hiçbir şey dışa aktarılmadan paneli denetler; malzemeye mal olan hatalar makinede değil ekranda yakalanır.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "windowfun-web": {
    en: {
      baslik: "The measurement is taken on site. The quote is needed before you get back.",
      sunum:
        "Model it, redraw it, then type it out again: about 35 minutes of doing the same window three times in three places. WindowFun Studio Web takes the parameters once and exports everything in roughly 45 seconds. 55 models across 6 categories, 105 tests passing, an offline PWA in Turkish, English and German — and GLB and DXF export for the round trip back into SketchUp.",
      hikayeler: [
        {
          baslik: "One parameter set, every document",
          metin:
            "The 3D view, the technical drawing, the take-off and the quote all read the same definition, so they cannot describe three slightly different windows.",
        },
        {
          baslik: "Does a change send you back to the spreadsheet?",
          metin:
            "No. Edit the parameter and every output follows. The version you email is the version you drew, which is the only way a quote survives a week of revisions.",
        },
        {
          baslik: "From the site to the quote without a gap",
          metin:
            "It works offline as a PWA, so the measurement taken in an empty flat with no signal is still a quote by the time you are back in the car.",
        },
      ],
    },
    tr: {
      baslik: "Ölçü sahada alınır. Teklif siz dönmeden istenir.",
      sunum:
        "Modelle, yeniden çiz, bir daha yaz: aynı pencereyi üç ayrı yerde üç kez yapmanın yaklaşık 35 dakikası. WindowFun Studio Web parametreleri bir kez alır ve her şeyi yaklaşık 45 saniyede dışa aktarır. 6 kategoride 55 model, 105 test geçiyor, Türkçe, İngilizce ve Almanca çevrimdışı PWA — ve SketchUp'a gidiş-dönüş için GLB ile DXF çıktısı.",
      hikayeler: [
        {
          baslik: "Tek parametre seti, bütün belgeler",
          metin:
            "3B görünüm, teknik çizim, metraj ve teklif aynı tanımı okur; birbirinden azıcık farklı üç pencereyi anlatmaları mümkün değildir.",
        },
        {
          baslik: "Bir değişiklik sizi tabloya geri gönderir mi?",
          metin:
            "Hayır. Parametreyi değiştirirsiniz, bütün çıktılar onu izler. E-postayla gönderdiğiniz sürüm çizdiğiniz sürümdür; bir teklifin bir haftalık revizyondan sağ çıkmasının tek yolu da budur.",
        },
        {
          baslik: "Sahadan teklife kesintisiz",
          metin:
            "Çevrimdışı çalışan bir PWA olduğu için, çekmeyen boş bir dairede alınan ölçü siz arabaya döndüğünüzde teklif olmuş olur.",
        },
      ],
    },
  },

  /* ---------------------------------------------------------------- */
  "presentation-studio": {
    en: {
      baslik: "You spent three weeks on the project and one night on how it looks.",
      sunum:
        "The drawings are finished and the meeting is tomorrow, so the presentation gets assembled slide by slide in whatever program is open — about 180 minutes of dragging images into boxes. Presentation Studio lays the pages out from the content you type, in roughly 15 minutes. 4 architectural sheet templates, built-up area and floor distribution diagrams, PDF output in 16:9, 9:16, A4 and A3. It is not a SketchUp extension: it works with images exported from any program, and it keeps working offline once loaded.",
      hikayeler: [
        {
          baslik: "An architect's sheet, not a slide",
          metin:
            "The templates are laid out the way a project board is laid out, so the result looks like it came from an architecture office rather than from a sales deck.",
        },
        {
          baslik: "Who draws the area diagrams?",
          metin:
            "It does. Built-up area and floor distribution tables become diagrams on their own, which is usually the part that gets dropped at 2am for lack of time.",
        },
        {
          baslik: "Your project stays on your device",
          metin:
            "Nothing is uploaded. The images and numbers for an unbuilt project stay on the machine you are working on — which matters more in this business than people admit.",
        },
      ],
    },
    tr: {
      baslik: "Projeye üç hafta, nasıl göründüğüne bir gece verdiniz.",
      sunum:
        "Çizimler bitmiştir, toplantı yarındır; sunum da açık olan hangi programsa onda slayt slayt dizilir — görselleri kutulara sürüklemenin yaklaşık 180 dakikası. Sunum Stüdyosu sayfaları yazdığınız içerikten dizer, yaklaşık 15 dakikada. 4 pafta tarzı şablon, yapılaşma ve kat paylaşım şemaları, 16:9, 9:16, A4 ve A3 PDF çıktısı. SketchUp eklentisi değildir: her programdan dışa aktarılan görsellerle çalışır ve bir kez yüklendikten sonra çevrimdışı da çalışır.",
      hikayeler: [
        {
          baslik: "Slayt değil, mimar paftası",
          metin:
            "Şablonlar bir proje paftasının dizildiği gibi dizilmiştir; sonuç bir satış sunumundan değil bir mimarlık ofisinden çıkmış gibi görünür.",
        },
        {
          baslik: "Alan şemalarını kim çiziyor?",
          metin:
            "O çiziyor. Yapılaşma ve kat paylaşım tabloları kendiliğinden şemaya dönüşür; gece ikide vakit yetmediği için ilk atlanan kısım da genelde budur.",
        },
        {
          baslik: "Projeniz cihazınızda kalır",
          metin:
            "Hiçbir şey yüklenmez. Henüz yapılmamış bir projenin görselleri ve rakamları çalıştığınız makinede kalır — bu işte bunun değeri, itiraf edildiğinden fazladır.",
        },
      ],
    },
  },
};
