/**
 * Ürün tanıtım metinlerini mağazadan senkronlar (ADR-024).
 *
 * Kaynak: `plugin-store/data/plugins.json` — bestsketchupplugins.com'un kendi
 * verisi. İki sitede aynı anlatı dursun diye metin burada yeniden yazılmaz;
 * mağaza tek kaynaktır. Böylece bir ürünün sözü değiştiğinde iki yerde
 * ayrı ayrı güncellemek gerekmez ve siteler birbiriyle çelişmez.
 *
 * ufuksen.com'da **fiyat ve satın alma yok**: ziyaretçi gösterişli butonla
 * mağazadaki ürün sayfasına gider, fiyatı ve satın almayı orada görür
 * (kullanıcı kuralı: fiyat yalnız ürün sayfasında durur).
 *
 * Çalıştırma:  node scripts/content/sync-magaza.mjs
 */

import { readFile, writeFile, readdir, unlink } from "node:fs/promises";
import { join, resolve } from "node:path";

const KOK = resolve(".");
const MAGAZA_VERI = resolve(KOK, "..", "plugin-store", "data", "plugins.json");
const HEDEF = join(KOK, "src", "content", "products");
const MAGAZA = "https://www.bestsketchupplugins.com";

/** Mağaza durumları -> sitenin durum sözlüğü. */
const DURUM = { live: "aktif", beta: "beta", alpha: "alfa" };

/** Mağaza kategorisi -> sitenin tür ayrımı (eklenti / web aracı). */
const WEB_ARACLARI = new Set(["metraj", "panelcut-studio", "windowfun-web"]);

/** Özellik ikonları kategoriye göre; bilinmeyen kategori `grid` alır. */
const KATEGORI_IKON = {
  "windows-doors": "kutu",
  floors: "texture",
  furniture: "layers",
  landscape: "layers",
  facade: "grid",
  infrastructure: "ruler",
  presentation: "goz",
  utilities: "sliders",
};

const ham = JSON.parse(await readFile(MAGAZA_VERI, "utf8"));
const urunler = Array.isArray(ham) ? ham : (ham.plugins ?? Object.values(ham)[0]);

/** İki dilli alandan istenen dili alır; yoksa diğerine düşer. */
const dil = (alan, d) => (alan ? (alan[d] ?? alan.tr ?? alan.en ?? null) : null);

/** Mağazadaki ürün sayfası. Dil segmenti adresin parçası. */
const magazaYolu = (slug, d) => `${MAGAZA}/${d}/plugins/${slug}/`;

function kanit(p, d) {
  if (!p.before || !p.after) return null;
  return {
    oncekiEtiket: dil(p.before.label, d) ?? "",
    oncekiDakika: p.before.minutes ?? 0,
    sonrakiEtiket: dil(p.after.label, d) ?? "",
    sonrakiSaniye: p.after.seconds ?? 0,
  };
}

const hikayeler = (p, d) =>
  (p.stories ?? [])
    .map((h) => ({ baslik: dil(h.title, d) ?? "", metin: dil(h.body, d) ?? "" }))
    .filter((h) => h.baslik && h.metin);

/** Öne çıkanlar aynı zamanda özellik kartlarını besler — tek kaynak. */
const ozellikler = (p, d) =>
  (dil(p.highlights, d) ?? []).map((metin) => ({
    baslik: metin,
    not: "",
    ikon: KATEGORI_IKON[p.category] ?? "grid",
  }));

/** Sıralama: yayındakiler önce, sonra beta, en son alfa; içinde ada göre. */
const DURUM_AGIRLIK = { live: 0, beta: 100, alpha: 200 };

const sirali = [...urunler].sort((a, b) => {
  const fark = (DURUM_AGIRLIK[a.status] ?? 300) - (DURUM_AGIRLIK[b.status] ?? 300);
  if (fark) return fark;
  return (dil(a.name, "tr") ?? "").localeCompare(dil(b.name, "tr") ?? "", "tr");
});

// Eski ürün kayıtlarını temizle — mağazada olmayan ürün sitede de durmasın
for (const dosya of await readdir(HEDEF)) {
  if (dosya.endsWith(".json")) await unlink(join(HEDEF, dosya));
}

let n = 0;
for (const [i, p] of sirali.entries()) {
  const kayit = {
    slug: p.slug,
    ad: dil(p.name, "tr"),
    tur: WEB_ARACLARI.has(p.slug) ? "arac" : "eklenti",
    durum: DURUM[p.status] ?? "beta",
    ilerleme: null,
    surum: p.version ?? null,
    sira: i + 1,
    yayinda: true,

    ozet: dil(p.tagline, "tr"),
    aciklama: null,
    slogan: null,

    baslik: dil(p.problemHeadline, "tr"),
    sunum: dil(p.heroSub, "tr"),
    kanit: kanit(p, "tr"),
    hikayeler: hikayeler(p, "tr"),
    magazaUrl: magazaYolu(p.slug, "tr"),

    kapak: null,
    galeri: [],
    video: null,

    uyumluluk: dil(p.compatibility, "tr") ?? [],
    ozellikler: ozellikler(p, "tr"),
    listeler: [],
    vurgular: dil(p.highlights, "tr") ?? [],
    sss: [],

    // Fiyat ve satın alma mağaza sayfasında; burada bilerek yok.
    fiyat: null,
    satinAlmaUrl: null,
    denemeUrl: null,
    iletisimEposta: "ufuksn79@gmail.com",

    yazilim: WEB_ARACLARI.has(p.slug) ? [] : ["sketchup"],
    icNot: `Mağazadan senkronlandı (plugin-store/data/plugins.json, ${new Date().toISOString().slice(0, 10)}). Metinleri burada elle değiştirmeyin — mağazada değiştirip senkronu tekrar çalıştırın.`,

    en: {
      ad: dil(p.name, "en"),
      ozet: dil(p.tagline, "en"),
      aciklama: null,
      slogan: null,
      fiyatNot: null,
      baslik: dil(p.problemHeadline, "en"),
      sunum: dil(p.heroSub, "en"),
      kanit: kanit(p, "en"),
      hikayeler: hikayeler(p, "en"),
      magazaUrl: magazaYolu(p.slug, "en"),
      uyumluluk: dil(p.compatibility, "en") ?? [],
      ozellikler: ozellikler(p, "en"),
      listeler: [],
      vurgular: dil(p.highlights, "en") ?? [],
      sss: [],
    },
  };

  await writeFile(join(HEDEF, `${p.slug}.json`), JSON.stringify(kayit, null, 2) + "\n", "utf8");
  n++;
}

console.log(`${n} ürün mağazadan senkronlandı.`);
const sayim = sirali.reduce((o, p) => ({ ...o, [p.status]: (o[p.status] ?? 0) + 1 }), {});
console.log("  durum:", JSON.stringify(sayim));
console.log(`  hepsinde buton hedefi: ${MAGAZA}/{tr|en}/plugins/{slug}/`);
