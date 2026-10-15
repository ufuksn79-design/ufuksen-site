import type { Dil } from "./i18n";

/**
 * Sayfa metinleri — site genelinde iki dillilik (ADR-025).
 *
 * `i18n.ts` eklenti bölümünü taşıyordu; burada sitenin geri kalanı var:
 * ana sayfa, blog, eğitimler, videolar, yazılımlar, arama, 404, menü, footer.
 *
 * **Blog yazıları çevrilmiyor.** 430 Türkçe yazı çeviri değil yeniden yazım
 * işidir. İngilizce tarafta arşiv listelenir ama yazıların Türkçe olduğu
 * açıkça söylenir — okuyucuyu şaşırtmamak için (AGENTS.md §5).
 */

/* ------------------------------------------------------------------ */
/* Adres eşlemesi                                                      */
/* ------------------------------------------------------------------ */

/**
 * Türkçe ve İngilizce sayfaların karşılıkları.
 *
 * Türkçe adresler DEĞİŞMEZ (ADR-004/007): arama motorundaki karşılıkları
 * korunur. İngilizce taraf `/en/` önekiyle yaşar; tek istisna, anahtar
 * kelime taşıdığı için ayrı tutulan eklenti sayfalarıdır (ADR-023).
 */
export const SAYFA_ESLEME: { tr: string; en: string }[] = [
  { tr: "/", en: "/en/" },
  { tr: "/blog", en: "/en/blog" },
  { tr: "/egitimler", en: "/en/courses" },
  { tr: "/videolar", en: "/en/videos" },
  { tr: "/yazilim", en: "/en/software" },
  { tr: "/arama", en: "/en/search" },
  { tr: "/iletisim", en: "/en/contact" },
  { tr: "/sketchup-en-iyi-pluginleri.html", en: "/sketchup-best-plugins.html" },
];

/** Bir adresin diğer dildeki karşılığı; yoksa null (çevirisi yok demektir). */
export function karsiYol(yol: string, hedefDil: Dil): string | null {
  const temiz = yol.replace(/\/+$/, "") || "/";

  for (const e of SAYFA_ESLEME) {
    const trTemiz = e.tr.replace(/\/+$/, "") || "/";
    const enTemiz = e.en.replace(/\/+$/, "") || "/";
    if (temiz === trTemiz) return hedefDil === "en" ? e.en : e.tr;
    if (temiz === enTemiz) return hedefDil === "en" ? e.en : e.tr;
  }

  // Dinamik eşlemeler
  const yazilimTr = temiz.match(/^\/yazilim\/(.+)$/);
  if (yazilimTr) return hedefDil === "en" ? `/en/software/${yazilimTr[1]}` : temiz;
  const yazilimEn = temiz.match(/^\/en\/software\/(.+)$/);
  if (yazilimEn) return hedefDil === "en" ? temiz : `/yazilim/${yazilimEn[1]}`;

  const eklentiTr = temiz.match(/^\/eklenti\/(.+)\.html$/);
  if (eklentiTr) return hedefDil === "en" ? `/plugin/${eklentiTr[1]}.html` : temiz;
  const eklentiEn = temiz.match(/^\/plugin\/(.+)\.html$/);
  if (eklentiEn) return hedefDil === "en" ? temiz : `/eklenti/${eklentiEn[1]}.html`;

  return null;
}

/* ------------------------------------------------------------------ */
/* Metinler                                                            */
/* ------------------------------------------------------------------ */

interface SayfaMetinleri {
  /* --- menü ve footer --- */
  menu: {
    profil: string;
    blog: string;
    pluginler: string;
    egitim: string;
    video: string;
    yazilim: string;
    ara: string;
    iletisim: string;
  };
  footerIletisim: string;
  footerRss: string;
  icerigeAtla: string;
  basaDon: string;
  anaMenu: string;

  /* --- ana sayfa --- */
  ana: {
    metaBaslik: string;
    metaAciklama: string;
    rol: string;
    yazilariOku: string;
    iletisimeGec: string;
    hakkimda: string;
    merhaba: string;
    tanitim: (yaziSayisi: number, konuSayisi: number) => string;
    bilgiKonum: string;
    bilgiKonumDeger: string;
    bilgiUzmanlik: string;
    bilgiUzmanlikDeger: string;
    bilgiEgitim: string;
    bilgiEgitimDeger: string;
    bilgiArsiv: string;
    bilgiArsivDeger: (n: number) => string;
    urunlerBaslik: string;
    urunlerNot: string;
    urunDetay: string;
    egitimBaslik: string;
    egitimNot: (n: number) => string;
    tumEgitimler: (n: number) => string;
    uzmanlikBaslik: string;
    uzmanlikNot: string;
    /**
     * Uzmanlık satırları. Eskiden uydurma yüzde çubuklarıydı ve altında
     * "yer tutucudur" yazıyordu; yerine doğrulanabilir maddeler kondu.
     * Sayılar çağıran taraftan gelir, metne gömülmez.
     */
    uzmanlikListesi: (s: {
      kurs: number;
      urun: number;
      yazi: number;
      kategori: number;
      egitimYolu: string;
      blogYolu: string;
      eklentiYolu: string;
    }) => { baslik: string; not: string; yol?: string; disYol?: string }[];
    rakamlarBaslik: string;
    rakamlarNot: string;
    sayacYazi: string;
    sayacKategori: string;
    sayacGorsel: string;
    sayacDeneyim: string;
    videoBaslik: string;
    videoNot: (n: number) => string;
    tumVideolar: string;
    konularBaslik: string;
    konularNot: (yazi: number, konu: number) => string;
    sonYazilarBaslik: string;
    sonYazilarNot: string;
    tumYazilar: string;
  };

  /* --- blog --- */
  blog: {
    metaBaslik: (sayfa: number) => string;
    metaAciklama: (toplam: number, sayfa: number, son: number) => string;
    baslik: string;
    not: (toplam: number, sayfa: number, son: number) => string;
    onceki: string;
    sonraki: string;
    turkceUyari: string;
  };

  /* --- eğitimler --- */
  egitimler: {
    metaBaslik: (n: number) => string;
    metaAciklama: (n: number, ders: number) => string;
    baslik: string;
    not: string;
    sayacSet: string;
    sayacDers: string;
    sayacSaat: string;
    sayacPuan: string;
    altNot: string;
  };

  /* --- videolar --- */
  videolar: {
    metaBaslik: (n: number) => string;
    metaAciklama: (n: number) => string;
    baslik: string;
    not: (n: number) => string;
    youtube: string;
  };

  /* --- yazılımlar --- */
  yazilimlar: {
    metaBaslik: string;
    metaAciklama: string;
    baslik: string;
    not: string;
    incele: string;
    yaziSayisi: (n: number) => string;
    videoSayisi: (n: number) => string;
    gruplar: { modelleme: string; render: string; gercekZamanli: string; diger: string };
    egitimSetleri: (ad: string) => string;
    yaziVeVideo: (yazi: number, video: number) => string;
    koleksiyonAdi: (ad: string) => string;
    detayBaslik: (ad: string, yazi: number) => string;
    detayAciklama: (ad: string, yazi: number, video: number) => string;
  };

  /** Her yerde kullanılan küçük parçalar. */
  ortak: { dakika: string; devami: string };

  /* --- arama --- */
  arama: {
    metaBaslik: string;
    metaAciklama: (n: number) => string;
    baslik: string;
    not: (n: number) => string;
    etiket: string;
    ipucu: string;
    durumBos: string;
    durumSonuc: (n: number) => string;
    durumYok: string;
    butonAra: string;
    indeksYukleniyor: string;
    sonucYokTerim: (terim: string) => string;
    hata: string;
    jsGerekliOnce: string;
    jsGerekliBaglanti: string;
    jsGerekliSonra: string;
  };

  /* --- 404 --- */
  dortYuzDort: {
    metaBaslik: string;
    metaAciklama: string;
    baslik: string;
    not: string;
    tumYazilar: string;
    aramaYap: string;
  };
}

export const SAYFA: Record<Dil, SayfaMetinleri> = {
  tr: {
    menu: {
      profil: "Profil",
      blog: "Blog",
      pluginler: "Pluginler",
      egitim: "Eğitim",
      video: "Video",
      yazilim: "Yazılım",
      ara: "Ara",
      iletisim: "İletişim",
    },
    footerIletisim: "İletişim",
    footerRss: "RSS",
    icerigeAtla: "İçeriğe atla",
    basaDon: "Sayfa başına dön",
    anaMenu: "Ana menü",

    ana: {
      metaBaslik: "Ufuk Şen — 3D Görselleştirme, Render ve SketchUp Eğitimleri",
      metaAciklama:
        "SketchUp, Twinmotion, D5 Render ve Enscape üzerine eğitimler, eklentiler ve mimari görselleştirme projeleri.",
      rol: "3D Görselleştirme Uzmanı · Eğitmen · Ankara",
      yazilariOku: "Yazıları oku",
      iletisimeGec: "İletişime geç",
      hakkimda: "Hakkımda",
      merhaba: "Merhaba, ben Ufuk Şen.",
      tanitim: (yazi, konu) =>
        `Mimari görselleştirme üretiyor ve bu işi öğretiyorum. Yazılım öğretmiyorum; ışığı, malzemeyi ve kadrajı öğretiyorum. Yazılım bunun aracı. Arşivde ${yazi} yazı, ${konu} konu başlığı var; 18 yıldır SketchUp eğitmenliği yapıyorum.`,
      bilgiKonum: "Konum",
      bilgiKonumDeger: "Ankara, Türkiye",
      bilgiUzmanlik: "Uzmanlık",
      bilgiUzmanlikDeger: "3D görselleştirme ve render",
      bilgiEgitim: "Eğitim",
      bilgiEgitimDeger: "Birebir ve video",
      bilgiArsiv: "Arşiv",
      bilgiArsivDeger: (n) => `${n} yazı`,
      urunlerBaslik: "SketchUp En İyi Pluginleri",
      urunlerNot: "Geliştirdiğim SketchUp eklentileri ve üretim araçları.",
      urunDetay: "Detay",
      egitimBaslik: "Eğitim Setleri",
      egitimNot: (n) => `Udemy'de yayında olan ${n} eğitim seti. En yüksek puanlı üçü aşağıda.`,
      tumEgitimler: (n) => `Tüm eğitim setleri (${n})`,
      uzmanlikBaslik: "Uzmanlık",
      uzmanlikNot: "Rakamların hepsi doğrulanabilir; hiçbiri tahmin değil.",
      uzmanlikListesi: (s) => [
        {
          baslik: "18 yıl SketchUp eğitmenliği",
          not: "Türkiye'de SketchUp'ı Türkçe anlatan ilk isimlerden; hâlâ ders veriyor.",
        },
        {
          baslik: `${s.kurs} yayımlanmış eğitim seti`,
          not: "SketchUp, D5 Render, Enscape, Twinmotion ve V-Ray üzerine, Udemy'de yayında.",
          yol: s.egitimYolu,
        },
        {
          baslik: "7.269 Udemy öğrencisi",
          not: "Eğitim setlerine kayıtlı öğrenci sayısı.",
        },
        {
          baslik: `${s.urun} SketchUp eklentisi geliştirdi`,
          not: "Önce kendi işinde elle yapmaktan bıktığı işler için yazıldı, sonra paylaşıldı.",
          yol: s.eklentiYolu,
        },
        {
          baslik: "Kendi render motorunu yazdı",
          not: "Render Fun — SketchUp'ın içinde çalışan, ücretsiz, ışın izlemeli render motoru.",
          disYol: "https://renderfun.com/",
        },
        {
          baslik: `${s.yazi} yazılık arşiv`,
          not: `${s.kategori} başlık altında: 3B görselleştirme, render motorları ve modelleme.`,
          yol: s.blogYolu,
        },
      ],
      rakamlarBaslik: "Rakamlar",
      rakamlarNot: "Bu değerler arşivden ölçüldü.",
      sayacYazi: "Yayımlanmış yazı",
      sayacKategori: "Kategori",
      sayacGorsel: "Görsel arşivi",
      sayacDeneyim: "Yıllık deneyim",
      videoBaslik: "Videolar",
      videoNot: (n) => `Arşivde ${n} video var. En yenileri aşağıda.`,
      tumVideolar: "Tüm videolar",
      konularBaslik: "Konular",
      konularNot: (yazi, konu) => `${yazi} yazı, ${konu} başlık altında.`,
      sonYazilarBaslik: "Son Yazılar",
      sonYazilarNot: "Arşivdeki en yeni dört yazı.",
      tumYazilar: "Tüm yazılar",
    },

    blog: {
      metaBaslik: (s) => (s === 1 ? "Blog — Tüm yazılar | Ufuk Şen" : `Blog — Sayfa ${s} | Ufuk Şen`),
      metaAciklama: (t, s, son) =>
        `SketchUp, V-Ray, D5 Render, Twinmotion ve Enscape üzerine ${t} yazılık arşiv. Sayfa ${s} / ${son}. Rehberler, karşılaştırmalar ve video dersler.`,
      baslik: "Blog",
      not: (t, s, son) => `${t} yazı · sayfa ${s} / ${son}`,
      onceki: "← Önceki",
      sonraki: "Sonraki →",
      turkceUyari: "",
    },

    egitimler: {
      metaBaslik: (n) => `Eğitim Setleri — ${n} Udemy kursu | Ufuk Şen`,
      metaAciklama: (n, ders) =>
        `SketchUp, V-Ray, D5 Render, Twinmotion ve Enscape üzerine ${n} eğitim seti. Toplam ${ders} ders.`,
      baslik: "Eğitim Setleri",
      not: "Udemy üzerinde yayında olan eğitim setleri. Veriler eğitmen profilinden okundu.",
      sayacSet: "Eğitim seti",
      sayacDers: "Toplam ders",
      sayacSaat: "Saat içerik",
      sayacPuan: "Ortalama puan",
      altNot: "Fiyatlar kampanyaya göre değiştiği için burada yazılmıyor; güncel fiyat Udemy sayfasında.",
    },

    videolar: {
      metaBaslik: (n) => `Videolar — ${n} eğitim ve anlatı videosu | Ufuk Şen`,
      metaAciklama: (n) => `3D görselleştirme, render ve SketchUp üzerine ${n} video.`,
      baslik: "Videolar",
      not: (n) => `Arşivdeki ${n} video. Her biri ilgili yazıya bağlı.`,
      youtube: "YouTube ↗",
    },

    yazilimlar: {
      metaBaslik: "Yazılımlar — Hangi araçla ne yapılır | Ufuk Şen",
      metaAciklama:
        "SketchUp, V-Ray, D5 Render, Twinmotion, Enscape ve diğer araçlar üzerine yazı ve videolar.",
      baslik: "Yazılımlar",
      not: "Arşiv, kullanılan araca göre gruplandı. Sayılar ölçüldü, tahmin değil.",
      incele: "İncele",
      yaziSayisi: (n) => `${n} yazı`,
      videoSayisi: (n) => `${n} video`,
      gruplar: {
        modelleme: "Modelleme",
        render: "Render motorları",
        gercekZamanli: "Gerçek zamanlı",
        diger: "Diğer araçlar",
      },
      egitimSetleri: (ad) => `${ad} eğitim setleri`,
      yaziVeVideo: (yazi, video) => `${yazi} yazı · ${video} video`,
      koleksiyonAdi: (ad) => `${ad} yazıları`,
      detayBaslik: (ad, yazi) => `${ad} — ${yazi} yazı ve rehber | Ufuk Şen`,
      detayAciklama: (ad, yazi, video) => `${ad} üzerine ${yazi} yazı ve ${video} video.`,
    },

    ortak: { dakika: "dk", devami: "Devamı" },

    arama: {
      metaBaslik: "Arama | Ufuk Şen",
      metaAciklama: (n) =>
        `${n} yazılık arşivde başlık, kategori ve özet üzerinden arama yapın. SketchUp, V-Ray, D5 Render ve Twinmotion rehberleri.`,
      baslik: "Arama",
      not: (n) => `${n} yazı içinde başlık, kategori ve özet üzerinden arama.`,
      etiket: "Arama terimi",
      ipucu: "Örn. render motoru",
      durumBos: "Arama için bir terim yazın.",
      durumSonuc: (n) => `${n} sonuç bulundu.`,
      durumYok: "Sonuç bulunamadı.",
      butonAra: "Ara",
      indeksYukleniyor: "Arama indeksi yükleniyor…",
      sonucYokTerim: (terim) => `"${terim}" için sonuç bulunamadı.`,
      hata: "Arama sırasında bir hata oluştu.",
      jsGerekliOnce: "Arama JavaScript gerektirir. Yazılara ",
      jsGerekliBaglanti: "blog sayfasından",
      jsGerekliSonra: " veya kategori sayfalarından ulaşabilirsiniz.",
    },

    dortYuzDort: {
      metaBaslik: "Sayfa bulunamadı | Ufuk Şen",
      metaAciklama:
        "Aradığınız sayfa bulunamadı. 3D görselleştirme, render ve SketchUp üzerine arşive blog ve arama sayfalarından ulaşabilirsiniz.",
      baslik: "404 — Bu sayfa yok",
      not: "Bağlantı taşınmış veya hiç var olmamış olabilir.",
      tumYazilar: "Tüm yazılar",
      aramaYap: "Arama yap",
    },
  },

  en: {
    menu: {
      profil: "Profile",
      blog: "Blog",
      pluginler: "Plugins",
      egitim: "Courses",
      video: "Video",
      yazilim: "Software",
      ara: "Search",
      iletisim: "Contact",
    },
    footerIletisim: "Contact",
    footerRss: "RSS",
    icerigeAtla: "Skip to content",
    basaDon: "Back to top",
    anaMenu: "Main menu",

    ana: {
      metaBaslik: "Ufuk Şen — SketchUp Plugins, 3D Visualisation and Rendering",
      metaAciklama:
        "SketchUp plugins, production tools and courses on architectural visualisation, rendering, Twinmotion, D5 Render and Enscape.",
      rol: "3D Visualisation Specialist · Instructor · Ankara, Türkiye",
      yazilariOku: "Read the articles",
      iletisimeGec: "Get in touch",
      hakkimda: "About",
      merhaba: "Hello, I'm Ufuk Şen.",
      tanitim: (yazi, konu) =>
        `I produce architectural visualisation and I teach it. I don't teach software; I teach light, material and framing — software is just the tool. The archive holds ${yazi} articles across ${konu} topics, and I have been teaching SketchUp for 18 years.`,
      bilgiKonum: "Location",
      bilgiKonumDeger: "Ankara, Türkiye",
      bilgiUzmanlik: "Focus",
      bilgiUzmanlikDeger: "3D visualisation and rendering",
      bilgiEgitim: "Teaching",
      bilgiEgitimDeger: "One-to-one and video",
      bilgiArsiv: "Archive",
      bilgiArsivDeger: (n) => `${n} articles`,
      urunlerBaslik: "SketchUp Best Plugins",
      urunlerNot: "The SketchUp plugins and production tools I build.",
      urunDetay: "Details",
      egitimBaslik: "Course Sets",
      egitimNot: (n) => `${n} course sets published on Udemy. The three highest rated are below.`,
      tumEgitimler: (n) => `All course sets (${n})`,
      uzmanlikBaslik: "Expertise",
      uzmanlikNot: "Every figure here can be checked; none of them is an estimate.",
      uzmanlikListesi: (s) => [
        {
          baslik: "18 years teaching SketchUp",
          not: "One of the first people to teach SketchUp in Turkish — and still teaching.",
        },
        {
          baslik: `${s.kurs} published course sets`,
          not: "On SketchUp, D5 Render, Enscape, Twinmotion and V-Ray, live on Udemy.",
          yol: s.egitimYolu,
        },
        {
          baslik: "7,269 students on Udemy",
          not: "Enrolled across the published course sets.",
        },
        {
          baslik: `${s.urun} SketchUp plugins built`,
          not: "Written first for his own work — the jobs he was tired of doing by hand.",
          yol: s.eklentiYolu,
        },
        {
          baslik: "Wrote his own render engine",
          not: "Render Fun — a free, path-traced renderer that runs inside SketchUp.",
          disYol: "https://renderfun.com/",
        },
        {
          baslik: `${s.yazi} articles in the archive`,
          not: `Across ${s.kategori} topics: 3D visualisation, render engines and modelling.`,
          yol: s.blogYolu,
        },
      ],
      rakamlarBaslik: "By the numbers",
      rakamlarNot: "These figures were measured from the archive.",
      sayacYazi: "Published articles",
      sayacKategori: "Topics",
      sayacGorsel: "Images archived",
      sayacDeneyim: "Years of experience",
      videoBaslik: "Videos",
      videoNot: (n) => `${n} videos in the archive. The newest are below.`,
      tumVideolar: "All videos",
      konularBaslik: "Topics",
      konularNot: (yazi, konu) => `${yazi} articles across ${konu} topics.`,
      sonYazilarBaslik: "Latest Articles",
      sonYazilarNot: "The four newest pieces in the archive — written in Turkish.",
      tumYazilar: "All articles",
    },

    blog: {
      metaBaslik: (s) =>
        s === 1 ? "Blog — All articles | Ufuk Şen" : `Blog — Page ${s} | Ufuk Şen`,
      metaAciklama: (t, s, son) =>
        `An archive of ${t} articles on SketchUp, V-Ray, D5 Render, Twinmotion and Enscape. Page ${s} of ${son}. Guides, comparisons and video lessons, written in Turkish.`,
      baslik: "Blog",
      not: (t, s, son) => `${t} articles · page ${s} of ${son}`,
      onceki: "← Previous",
      sonraki: "Next →",
      turkceUyari:
        "These articles are written in Turkish. Your browser's translate function handles them well if you'd like to read along.",
    },

    egitimler: {
      metaBaslik: (n) => `Course Sets — ${n} Udemy courses | Ufuk Şen`,
      metaAciklama: (n, ders) =>
        `${n} course sets on SketchUp, V-Ray, D5 Render, Twinmotion and Enscape. ${ders} lectures in total. Taught in Turkish.`,
      baslik: "Course Sets",
      not: "Course sets published on Udemy, taught in Turkish. Figures read from the instructor profile.",
      sayacSet: "Course sets",
      sayacDers: "Lectures",
      sayacSaat: "Hours of content",
      sayacPuan: "Average rating",
      altNot:
        "Prices change with Udemy campaigns, so they are not listed here; the current price is on the Udemy page.",
    },

    videolar: {
      metaBaslik: (n) => `Videos — ${n} tutorial and walkthrough videos | Ufuk Şen`,
      metaAciklama: (n) => `${n} videos on 3D visualisation, rendering and SketchUp.`,
      baslik: "Videos",
      not: (n) => `${n} videos from the archive, each linked to its article. Narrated in Turkish.`,
      youtube: "YouTube ↗",
    },

    yazilimlar: {
      metaBaslik: "Software — What each tool is for | Ufuk Şen",
      metaAciklama:
        "Articles and videos on SketchUp, V-Ray, D5 Render, Twinmotion, Enscape and other tools.",
      baslik: "Software",
      not: "The archive grouped by the tool in use. The counts are measured, not estimated.",
      incele: "Browse",
      yaziSayisi: (n) => `${n} articles`,
      videoSayisi: (n) => `${n} videos`,
      gruplar: {
        modelleme: "Modelling",
        render: "Render engines",
        gercekZamanli: "Real-time",
        diger: "Other tools",
      },
      egitimSetleri: (ad) => `${ad} course sets`,
      yaziVeVideo: (yazi, video) => `${yazi} articles · ${video} videos`,
      koleksiyonAdi: (ad) => `${ad} articles`,
      detayBaslik: (ad, yazi) => `${ad} — ${yazi} articles and guides | Ufuk Şen`,
      detayAciklama: (ad, yazi, video) =>
        `${yazi} articles and ${video} videos on ${ad}, written in Turkish.`,
    },

    ortak: { dakika: "min", devami: "Read on" },

    arama: {
      metaBaslik: "Search | Ufuk Şen",
      metaAciklama: (n) =>
        `Search ${n} archived articles by title, topic and summary. Guides on SketchUp, V-Ray, D5 Render and Twinmotion.`,
      baslik: "Search",
      not: (n) => `Search ${n} articles by title, topic and summary. The articles are in Turkish.`,
      etiket: "Search term",
      ipucu: "e.g. render engine",
      durumBos: "Type a term to search.",
      durumSonuc: (n) => `${n} results found.`,
      durumYok: "No results found.",
      butonAra: "Search",
      indeksYukleniyor: "Loading the search index…",
      sonucYokTerim: (terim) => `No results found for "${terim}".`,
      hata: "Something went wrong while searching.",
      jsGerekliOnce: "Search needs JavaScript. You can still reach the articles from the ",
      jsGerekliBaglanti: "blog page",
      jsGerekliSonra: " or the topic pages.",
    },

    dortYuzDort: {
      metaBaslik: "Page not found | Ufuk Şen",
      metaAciklama:
        "The page you are looking for does not exist. You can reach the archive on 3D visualisation, rendering and SketchUp through the blog and search pages.",
      baslik: "404 — This page does not exist",
      not: "The link may have moved, or it may never have existed.",
      tumYazilar: "All articles",
      aramaYap: "Search",
    },
  },
};
