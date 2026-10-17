import type { Product, ProductData } from "./products";

/**
 * İki dilli katman (ADR-023).
 *
 * Site Türkçe doğdu; İngilizce, eklentileri yurt dışına satmak için eklendi.
 * Bu yüzden Türkçe **kaynak dil**: bir alanın İngilizcesi yoksa Türkçesine
 * düşülür ve sayfa yine eksiksiz görünür. Yarım çeviri yüzünden boş bölüm
 * çıkmaz.
 *
 * Blog arşivi (430 yazı) çevrilmiyor — çevrilebilir de değil. İngilizce sürüm
 * eklenti bölümünü kapsar; menüdeki Türkçe bölümler olduğu gibi kalır.
 */

export type Dil = "tr" | "en";

/* ------------------------------------------------------------------ */
/* Adresler                                                            */
/* ------------------------------------------------------------------ */

export const LISTE_YOLU: Record<Dil, string> = {
  tr: "/sketchup-en-iyi-pluginleri.html",
  en: "/sketchup-best-plugins.html",
};

/** Ürün sayfası adresi — dile göre farklı klasör. */
export function urunYolu(slug: string, dil: Dil): string {
  return dil === "en" ? `/plugin/${slug}.html` : `/eklenti/${slug}.html`;
}

/** Bir adresin diğer dildeki karşılığı — hreflang ve dil düğmesi için. */
export function digerDil(dil: Dil): Dil {
  return dil === "tr" ? "en" : "tr";
}

/* ------------------------------------------------------------------ */
/* Arayüz metinleri                                                    */
/* ------------------------------------------------------------------ */

interface Metinler {
  htmlLang: string;
  ogLocale: string;
  bolumAdi: string;
  bolumKisa: string;
  digerDilEtiketi: string;
  digerDilBaslik: string;

  heroEyebrow: string;
  heroBaslik: [string, string, string];
  heroLead: string;
  heroCta: string;
  istatistik: { arac: string; yayinda: string; surum: string; ozellik: string };

  faydalar: { baslik: string; not: string }[];

  araclarBaslik: string;
  araclarNot: string;
  filtreTumu: string;
  filtreTur: Record<ProductData["tur"], string>;

  incele: string;
  sor: string;
  waYaz: string;
  waSor: string;
  durumSor: string;
  satinAl: string;
  denemeIndir: string;
  epostaGonder: string;

  neIseYarar: string;
  ozellikler: string;
  ekranGoruntuleri: string;
  uyumluluk: string;
  sikSorulanlar: string;
  tanitimVideosu: string;
  hazirlaniyor: string;
  hazirlaniyorMetin: (ad: string, ilerleme: number | null) => string;
  ilgiliYazilar: (yazilim: string) => string;
  arsivNotu: string;
  tumYazilar: (yazilim: string) => string;
  yaziBaslikNotu: string;

  sorunuzMuVar: string;
  sorunuzMuVarNot: string;
  askBaslik: string;
  askNot: string;

  kanitBaslik: string;
  kanitElle: string;
  kanitEklentiyle: string;
  kanitDakika: string;
  kanitSaniye: string;
  /** Liste sayfasının sonundaki mağaza bölümü. */
  magazaBolumBaslik: string;
  magazaBolumNot: string;
  magazaBolumCta: string;
  magazaCta: (ad: string) => string;
  magazaNot: string;
  magazaRozet: string;

  kunyeDurum: string;
  kunyeFiyat: string;
  kunyeUyumluluk: string;
  kunyePafta: string;

  durumEtiket: Record<ProductData["durum"], string>;
  turTekil: Record<ProductData["tur"], string>;

  metaBaslik: string;
  metaAciklama: (ilkUc: string, kalan: number) => string;
  waMesaj: (konu: string | null) => string;
}

export const METIN: Record<Dil, Metinler> = {
  tr: {
    htmlLang: "tr",
    ogLocale: "tr_TR",
    bolumAdi: "SketchUp En İyi Pluginleri",
    bolumKisa: "Pluginler",
    digerDilEtiketi: "EN",
    digerDilBaslik: "Switch to English",

    heroEyebrow: "Ufuk Şen · Geliştirdiğim araçlar",
    heroBaslik: ["SketchUp'ta", "çizimi hızlandıran", "pluginler"],
    heroLead:
      "Zemin, pencere, kapı, dolap ve panel işlerini elle çizmek yerine parametreyle üretin. Ölçüler gerçek, sonuç modelin içinde — kopyala-yapıştır değil.",
    heroCta: "Pluginleri gör",
    istatistik: { arac: "araç", yayinda: "yayında", surum: "SketchUp sürümü", ozellik: "özellik" },

    faydalar: [
      {
        baslik: "Saatler yerine saniyeler",
        not: "Elle çizildiğinde uzun süren zemin, kapı, pencere ve dizilim işleri parametreyle tek seferde üretiliyor.",
      },
      {
        baslik: "Ölçü tutar",
        not: "Gerçek profil kesitleri ve milimetre hassasiyeti — göz kararı değil, imalata giden ölçü.",
      },
      {
        baslik: "Geri alması güvenli",
        not: "Üretim tek işlem olarak yapılır; beğenmezseniz bir Ctrl+Z ile modeliniz eski hâline döner.",
      },
    ],

    araclarBaslik: "Pluginler",
    araclarNot: "Her birinin kendi sayfası var — ayrıntılar, uyumluluk ve satın alma orada.",
    filtreTumu: "Tümü",
    filtreTur: { eklenti: "SketchUp eklentileri", arac: "Web araçları", sablon: "Şablonlar" },

    incele: "İncele",
    sor: "Sor",
    waYaz: "WhatsApp'tan yaz",
    waSor: "WhatsApp'tan sor",
    durumSor: "Durumu sor",
    satinAl: "Satın al",
    denemeIndir: "Denemeyi indir",
    epostaGonder: "E-posta gönder",

    neIseYarar: "Ne işe yarar?",
    ozellikler: "Özellikler",
    ekranGoruntuleri: "Ekran görüntüleri",
    uyumluluk: "Uyumluluk",
    sikSorulanlar: "Sık sorulanlar",
    tanitimVideosu: "Tanıtım videosu",
    hazirlaniyor: "Ayrıntılar hazırlanıyor",
    hazirlaniyorMetin: (ad, ilerleme) =>
      `${ad} üzerinde çalışma sürüyor${ilerleme ? ` (yaklaşık %${ilerleme})` : ""}. Özellik listesi ve ekran görüntüleri hazır olduğunda bu sayfaya eklenecek. Merak ettiğiniz bir şey varsa doğrudan yazabilirsiniz.`,
    ilgiliYazilar: (y) => `${y} yazıları`,
    arsivNotu: "Arşivden ilgili içerikler.",
    tumYazilar: (y) => `Tüm ${y} yazıları →`,
    yaziBaslikNotu: "Türkçe arşiv",

    sorunuzMuVar: "Sorunuz mu var?",
    sorunuzMuVarNot: "Kullanımı, uyumluluğu veya fiyatı — doğrudan bana yazın.",
    askBaslik: "Hangisi işinize yarar, birlikte bakalım",
    askNot:
      "Hangi eklentinin işinizi hızlandıracağından emin değilseniz yazın — ne yaptığınızı anlatın, size uygun olanı söyleyeyim.",

    kanitBaslik: "Ne kadar zaman kazandırıyor?",
    kanitElle: "Elle",
    kanitEklentiyle: "Bu araçla",
    kanitDakika: "dakika",
    kanitSaniye: "saniye",
    magazaBolumBaslik: "Hepsi tek adreste",
    magazaBolumNot:
      "Güncel sürümler, uyumluluk tabloları, disipline göre paketler ve ücretsiz araçlar Best SketchUp Plugins'te.",
    magazaBolumCta: "Mağazaya git",
    magazaCta: (ad) => ad + " sayfasına git",
    magazaNot: "Güncel sürüm, fiyat ve satın alma ürünün kendi sayfasında.",
    magazaRozet: "bestsketchupplugins.com",

    kunyeDurum: "Durum",
    kunyeFiyat: "Fiyat",
    kunyeUyumluluk: "Uyumluluk",
    kunyePafta: "Pafta",

    durumEtiket: {
      aktif: "Yayında",
      beta: "Beta",
      alfa: "Alfa",
      gelistiriliyor: "Geliştiriliyor",
      arsiv: "Arşiv",
    },
    turTekil: { eklenti: "SketchUp eklentisi", arac: "Web aracı", sablon: "Şablon" },

    metaBaslik: "SketchUp En İyi Pluginleri | Ufuk Şen",
    metaAciklama: (ilkUc, kalan) =>
      `SketchUp eklentileri ve tarayıcıda çalışan araçlar: ${ilkUc}${kalan ? ` ve ${kalan} araç daha` : ""}. Zemin, pencere, kapı ve dolap işleri.`,
    waMesaj: (konu) =>
      konu ? `Merhaba, ${konu} hakkında bilgi almak istiyorum.` : "Merhaba, bilgi almak istiyorum.",
  },

  en: {
    htmlLang: "en",
    ogLocale: "en_US",
    bolumAdi: "SketchUp Best Plugins",
    bolumKisa: "Plugins",
    digerDilEtiketi: "TR",
    digerDilBaslik: "Türkçe sürüme geç",

    heroEyebrow: "Ufuk Şen · Plugins I build",
    heroBaslik: ["SketchUp plugins", "that speed up", "your drawing"],
    heroLead:
      "Stop drawing floors, windows, doors, wardrobes and panels by hand — generate them from parameters. Real dimensions, real geometry inside your model.",
    heroCta: "See the plugins",
    istatistik: { arac: "tools", yayinda: "live", surum: "SketchUp versions", ozellik: "features" },

    faydalar: [
      {
        baslik: "Seconds instead of hours",
        not: "Floors, doors, windows and repeating layouts that take hours by hand are generated in one pass from parameters.",
      },
      {
        baslik: "Dimensions hold",
        not: "Real profile cross-sections and millimetre precision — not eyeballed, but ready for fabrication.",
      },
      {
        baslik: "Safe to undo",
        not: "Each build is a single operation. Don't like the result? One Ctrl+Z and your model is back as it was.",
      },
    ],

    araclarBaslik: "Plugins",
    araclarNot: "Each one has its own page — details, compatibility and purchase are there.",
    filtreTumu: "All",
    filtreTur: { eklenti: "SketchUp plugins", arac: "Web tools", sablon: "Templates" },

    incele: "View",
    sor: "Ask",
    waYaz: "Message on WhatsApp",
    waSor: "Ask on WhatsApp",
    durumSor: "Ask about status",
    satinAl: "Buy",
    denemeIndir: "Download trial",
    epostaGonder: "Send e-mail",

    neIseYarar: "What it does",
    ozellikler: "Features",
    ekranGoruntuleri: "Screenshots",
    uyumluluk: "Compatibility",
    sikSorulanlar: "FAQ",
    tanitimVideosu: "Product video",
    hazirlaniyor: "Details coming soon",
    hazirlaniyorMetin: (ad, ilerleme) =>
      `${ad} is still in development${ilerleme ? ` (about ${ilerleme}% complete)` : ""}. The feature list and screenshots will be added here once ready. If you have a question, message me directly.`,
    ilgiliYazilar: (y) => `${y} articles`,
    arsivNotu: "Related posts from the archive — written in Turkish.",
    tumYazilar: (y) => `All ${y} articles →`,
    yaziBaslikNotu: "Turkish archive",

    sorunuzMuVar: "Questions?",
    sorunuzMuVarNot: "Usage, compatibility or pricing — message me directly.",
    askBaslik: "Not sure which one fits your work?",
    askNot:
      "Tell me what you build and I'll point you to the plugin that will actually save you time.",

    kanitBaslik: "How much time does it save?",
    kanitElle: "By hand",
    kanitEklentiyle: "With this tool",
    kanitDakika: "minutes",
    kanitSaniye: "seconds",
    magazaBolumBaslik: "All of them in one place",
    magazaBolumNot:
      "Current versions, compatibility tables, discipline bundles and the free tools live on Best SketchUp Plugins.",
    magazaBolumCta: "Visit the store",
    magazaCta: (ad) => "Go to the " + ad + " page",
    magazaNot: "Current version, pricing and purchase live on the product's own page.",
    magazaRozet: "bestsketchupplugins.com",

    kunyeDurum: "Status",
    kunyeFiyat: "Price",
    kunyeUyumluluk: "Compatibility",
    kunyePafta: "Sheet",

    durumEtiket: {
      aktif: "Available",
      beta: "Beta",
      alfa: "Alpha",
      gelistiriliyor: "In development",
      arsiv: "Archived",
    },
    turTekil: { eklenti: "SketchUp plugin", arac: "Web tool", sablon: "Template" },

    metaBaslik: "SketchUp Best Plugins | Ufuk Şen",
    /* 160 karakter sınırı: Google fazlasını keser (TR sürümündeki gibi). */
    metaAciklama: (ilkUc, kalan) =>
      `SketchUp plugins and browser tools: ${ilkUc}${kalan ? ` and ${kalan} more` : ""}. Floors, windows, doors and wardrobes — parametric.`,
    waMesaj: (konu) =>
      konu ? `Hello, I'd like information about ${konu}.` : "Hello, I'd like some information.",
  },
};

/* ------------------------------------------------------------------ */
/* Ürün alanlarını dile göre çözme                                     */
/* ------------------------------------------------------------------ */

/**
 * Bir ürünün alanlarını istenen dilde döndürür.
 *
 * İngilizce karşılığı olmayan alan Türkçesiyle gelir — böylece çeviri
 * tamamlanmadan da İngilizce sayfa çalışır ve boş bölüm oluşmaz.
 */
export function urunDilde(u: ProductData, dil: Dil) {
  if (dil === "tr" || !u.en) return u;
  const e = u.en;
  return {
    ...u,
    ad: e.ad || u.ad,
    ozet: e.ozet || u.ozet,
    aciklama: e.aciklama ?? u.aciklama,
    slogan: e.slogan ?? u.slogan,
    uyumluluk: e.uyumluluk.length ? e.uyumluluk : u.uyumluluk,
    ozellikler: e.ozellikler.length ? e.ozellikler : u.ozellikler,
    listeler: e.listeler.length ? e.listeler : u.listeler,
    vurgular: e.vurgular.length ? e.vurgular : u.vurgular,
    sss: e.sss.length ? e.sss : u.sss,
    // Tutar ve para birimi ortak; yalnızca açıklama metni dile bağlı.
    fiyat: u.fiyat ? { ...u.fiyat, not: e.fiyatNot ?? u.fiyat.not } : u.fiyat,
    // Satış metni alanları (ADR-024)
    baslik: e.baslik ?? u.baslik,
    sunum: e.sunum ?? u.sunum,
    kanit: e.kanit ?? u.kanit,
    hikayeler: e.hikayeler.length ? e.hikayeler : u.hikayeler,
    // Mağaza bağlantısı dile göre: /tr/ ya da /en/
    magazaUrl: e.magazaUrl ?? u.magazaUrl,
  };
}

/** Kart ve liste bileşenlerinin ihtiyaç duyduğu hazır paket. */
export function urunGorunum(p: Product, dil: Dil) {
  return urunDilde(p.data, dil);
}
