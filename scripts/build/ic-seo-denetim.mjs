/**
 * Tam iç SEO denetimi.
 *
 * Mevcut `audit-seo.mjs` yalnızca başlık/açıklama uzunluğu ve görsel ölçüsü
 * bakıyordu. Bu araç sayfa içi SEO'nun tamamını tarıyor: benzersizlik,
 * başlık hiyerarşisi, öksüz sayfa, alt metni, yapısal veri, iç bağlantı
 * dağılımı, ince içerik.
 *
 * Hiçbir şeyi düzeltmez — yalnızca ölçer ve raporlar. Düzeltme ayrı adım.
 *
 * Çalıştırma:  node scripts/build/ic-seo-denetim.mjs [--ayrinti]
 */
import fs from "node:fs";
import path from "node:path";

const DIST = "dist";
const AYRINTI = process.argv.includes("--ayrinti");

/* Google'ın pratik sınırları — piksel değil karakter yaklaşıklığı. */
const BASLIK_EN_AZ = 30;
const BASLIK_EN_COK = 60;
const ACIKLAMA_EN_AZ = 70;
const ACIKLAMA_EN_COK = 158;
const INCE_ICERIK = 300;

function* htmlDosyalari(dizin) {
  for (const ad of fs.readdirSync(dizin)) {
    const tam = path.join(dizin, ad);
    const st = fs.statSync(tam);
    if (st.isDirectory()) yield* htmlDosyalari(tam);
    else if (ad.endsWith(".html")) yield tam;
  }
}

/**
 * Dosya yolunu site yoluna çevirir.
 *
 * Sondaki eğik çizgi ATILIR. Sebebi: sayfalar `/kategori/x/index.html`
 * olarak üretiliyor ama içeriden `/kategori/x` diye bağlanıyor (worker
 * ikisini de aynı sayfaya veriyor). Normalleştirmezsek her kategori
 * sayfası "öksüz" görünüyordu — ölçüm hatası, site hatası değil.
 */
const yol = (dosya) => {
  let y = "/" + path.relative(DIST, dosya).split(path.sep).join("/");
  y = y.replace(/\/index\.html$/, "/");
  return y === "/" ? "/" : y.replace(/\/+$/, "");
};

/** Bağlantı hedefini sayfa yoluyla aynı biçime getirir. */
const hedefNormal = (h) => {
  /**
   * Yüzde kodlaması ÇÖZÜLÜR. Dosyalar diskte çözülmüş adla duruyor
   * (`...görselleştirme.html`) ama bağlantılar kodlu yazılıyor
   * (`...g%c3%b6rselle%c5%9ftirme.html`). Çözmezsek o sayfa "hiç bağlantı
   * almıyor" diye işaretleniyordu — ölçüm hatası.
   */
  let n = h;
  try {
    n = decodeURIComponent(h);
  } catch {
    /* bozuk kodlama: olduğu gibi bırak */
  }
  n = n.replace(/\/index\.html$/, "/");
  return n === "/" ? "/" : n.replace(/\/+$/, "");
};

const al = (html, kalip) => (html.match(kalip) ?? [])[1] ?? null;
const metin = (s) =>
  (s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const sayfalar = [];

for (const dosya of htmlDosyalari(DIST)) {
  const html = fs.readFileSync(dosya, "utf8");
  const y = yol(dosya);

  const noindex = /<meta[^>]+name="robots"[^>]*content="[^"]*noindex/i.test(html);

  const baslik = metin(al(html, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const aciklama = al(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
  const canonical = al(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
  const ogBaslik = al(html, /<meta[^>]+property="og:title"[^>]+content="([^"]*)"/i);
  const jsonLd = /<script[^>]+application\/ld\+json/i.test(html);

  const h1ler = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => metin(m[1]));
  const basliklar = [...html.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({
    seviye: Number(m[1]),
    metin: metin(m[2]),
  }));

  /* Ana içerik: <main> varsa onu al, yoksa gövdeyi. */
  const ana = al(html, /<main[^>]*>([\s\S]*?)<\/main>/i) ?? html;
  const kelime = metin(ana).split(" ").filter(Boolean).length;

  /* Görseller — alt metni var mı? */
  const gorseller = [...ana.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const altsiz = gorseller.filter((g) => !/\balt\s*=\s*"[^"]+"/i.test(g)).length;

  /**
   * İki ayrı ölçü:
   * - `icBaglar`: yalnızca içerik gövdesindeki bağlantılar. Arama motoru
   *   için asıl değerli olan bunlar (bağlamlı, metin içi).
   * - `tumBaglar`: menü ve footer dahil her şey. "Bu sayfa hiç bağlantı
   *   almıyor mu" sorusu bununla cevaplanır.
   */
  const icBaglar = [...ana.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"[^>]*>([\s\S]*?)<\/a>/gi)].map(
    (m) => ({ hedef: hedefNormal(m[1]), yazi: metin(m[2]) }),
  );
  const tumBaglar = [...html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)"/gi)].map((m) =>
    hedefNormal(m[1]),
  );

  sayfalar.push({
    yol: y,
    noindex,
    baslik,
    aciklama,
    canonical,
    ogBaslik,
    jsonLd,
    h1Sayisi: h1ler.length,
    h1: h1ler[0] ?? null,
    basliklar,
    kelime,
    gorsel: gorseller.length,
    altsiz,
    icBaglar,
    tumBaglar,
  });
}

const indeksli = sayfalar.filter((s) => !s.noindex);

/* ---------------------------------------------------------------- */
/* Bulgular                                                          */
/* ---------------------------------------------------------------- */
const bulgular = {};
const ekle = (ad, yol, not = "") => {
  (bulgular[ad] ??= []).push(not ? `${yol} — ${not}` : yol);
};

/* 1. Başlık */
for (const s of indeksli) {
  if (!s.baslik) ekle("baslikYok", s.yol);
  else if (s.baslik.length > BASLIK_EN_COK) ekle("baslikUzun", s.yol, `${s.baslik.length} krk`);
  else if (s.baslik.length < BASLIK_EN_AZ) ekle("baslikKisa", s.yol, `${s.baslik.length} krk`);
}

/* 2. Açıklama */
for (const s of indeksli) {
  if (!s.aciklama) ekle("aciklamaYok", s.yol);
  else if (s.aciklama.length > ACIKLAMA_EN_COK) ekle("aciklamaUzun", s.yol, `${s.aciklama.length} krk`);
  else if (s.aciklama.length < ACIKLAMA_EN_AZ) ekle("aciklamaKisa", s.yol, `${s.aciklama.length} krk`);
}

/* 3. Benzersizlik — aynı başlık/açıklama birden çok sayfada */
const grupla = (alan) => {
  const m = new Map();
  for (const s of indeksli) {
    const v = s[alan];
    if (!v) continue;
    (m.get(v) ?? m.set(v, []).get(v)).push(s.yol);
  }
  return [...m.entries()].filter(([, l]) => l.length > 1);
};
for (const [deger, liste] of grupla("baslik")) {
  ekle("baslikTekrar", `${liste.length} sayfa`, `"${deger.slice(0, 60)}"`);
}
for (const [deger, liste] of grupla("aciklama")) {
  ekle("aciklamaTekrar", `${liste.length} sayfa`, `"${deger.slice(0, 60)}"`);
}

/* 4. H1 */
for (const s of indeksli) {
  if (s.h1Sayisi === 0) ekle("h1Yok", s.yol);
  else if (s.h1Sayisi > 1) ekle("h1Fazla", s.yol, `${s.h1Sayisi} adet`);
}

/* 5. Başlık hiyerarşisi — atlanan seviye */
for (const s of indeksli) {
  let onceki = 0;
  for (const b of s.basliklar) {
    if (onceki && b.seviye > onceki + 1) {
      ekle("baslikAtlama", s.yol, `h${onceki} → h${b.seviye}`);
      break;
    }
    onceki = b.seviye;
  }
}

/* 6. Canonical */
for (const s of indeksli) {
  if (!s.canonical) ekle("canonicalYok", s.yol);
}

/* 7. Yapısal veri ve OG */
for (const s of indeksli) {
  if (!s.jsonLd) ekle("jsonLdYok", s.yol);
  if (!s.ogBaslik) ekle("ogYok", s.yol);
}

/* 8. Görsel alt metni */
for (const s of indeksli) {
  if (s.altsiz > 0) ekle("altsizGorsel", s.yol, `${s.altsiz}/${s.gorsel}`);
}

/* 9. İnce içerik */
for (const s of indeksli) {
  if (s.kelime < INCE_ICERIK) ekle("inceIcerik", s.yol, `${s.kelime} kelime`);
}

/* 10. Öksüz sayfa — hiçbir sayfadan iç bağlantı almıyor */
const gelenBag = new Map();
const gelenIcerikBag = new Map();
for (const s of sayfalar) {
  for (const h of s.tumBaglar) gelenBag.set(h, (gelenBag.get(h) ?? 0) + 1);
  for (const b of s.icBaglar) gelenIcerikBag.set(b.hedef, (gelenIcerikBag.get(b.hedef) ?? 0) + 1);
}
for (const s of indeksli) {
  if (s.yol === "/") continue;
  if ((gelenBag.get(s.yol) ?? 0) === 0) ekle("oksuzSayfa", s.yol);
  /* Ana sayfalara dil düğmesinden ve logodan gelinir; metin içi bağlantı aranmaz. */
  else if (s.yol !== "/en" && (gelenIcerikBag.get(s.yol) ?? 0) === 0)
    ekle("icerikBagiYok", s.yol);
}

/* 11. Genel bağlantı metni — "buraya tıklayın" gibi */
const ZAYIF = /^(buraya|tıkla|tıklayın|devamı|daha fazla|link|bağlantı|oku|click here|read more)$/i;
for (const s of indeksli) {
  const zayif = s.icBaglar.filter((b) => ZAYIF.test(b.yazi.trim()));
  if (zayif.length) ekle("zayifBaglantiMetni", s.yol, `${zayif.length} adet`);
}

/* ---------------------------------------------------------------- */
/* Rapor                                                             */
/* ---------------------------------------------------------------- */
const ONEM = {
  baslikYok: "KRİTİK",
  h1Yok: "KRİTİK",
  canonicalYok: "KRİTİK",
  aciklamaYok: "YÜKSEK",
  baslikTekrar: "YÜKSEK",
  aciklamaTekrar: "YÜKSEK",
  h1Fazla: "YÜKSEK",
  oksuzSayfa: "KRİTİK",
  icerikBagiYok: "ORTA",
  baslikUzun: "ORTA",
  aciklamaUzun: "ORTA",
  aciklamaKisa: "ORTA",
  altsizGorsel: "ORTA",
  inceIcerik: "ORTA",
  baslikKisa: "DÜŞÜK",
  baslikAtlama: "DÜŞÜK",
  jsonLdYok: "DÜŞÜK",
  ogYok: "DÜŞÜK",
  zayifBaglantiMetni: "DÜŞÜK",
};

const ACIKLAMA_METNI = {
  baslikTekrar: "aynı başlık birden çok sayfada — hangisinin sıralanacağı belirsizleşir",
  aciklamaTekrar: "aynı açıklama birden çok sayfada",
  oksuzSayfa: "hiçbir yerden bağlantı almıyor (menü/footer dahil)",
  icerikBagiYok: "yalnızca menü/footer'dan bağlantı alıyor, metin içinden hiç",
  h1Fazla: "sayfada birden çok H1",
  baslikAtlama: "başlık seviyesi atlanmış (örn. h2'den h4'e)",
  inceIcerik: `${INCE_ICERIK} kelimenin altında`,
  altsizGorsel: "alt metni olmayan görsel",
  zayifBaglantiMetni: "bağlantı metni anlamsız (bağlam taşımıyor)",
};

console.log("TAM İÇ SEO DENETİMİ");
console.log("===================");
console.log(`taranan HTML     : ${sayfalar.length}`);
console.log(`indekslenebilir  : ${indeksli.length}`);
console.log(`noindex          : ${sayfalar.length - indeksli.length}`);
console.log();

const sirali = Object.entries(bulgular).sort(
  (a, b) =>
    Object.keys(ONEM).indexOf(a[0]) - Object.keys(ONEM).indexOf(b[0]),
);

if (sirali.length === 0) {
  console.log("Bulgu yok.");
} else {
  for (const [ad, liste] of sirali) {
    const onem = ONEM[ad] ?? "?";
    const not = ACIKLAMA_METNI[ad] ? ` — ${ACIKLAMA_METNI[ad]}` : "";
    console.log(`[${onem.padEnd(7)}] ${ad.padEnd(20)} ${String(liste.length).padStart(4)}${not}`);
    const gosterilecek = AYRINTI ? liste : liste.slice(0, 3);
    for (const x of gosterilecek) console.log(`             ${x}`);
    if (!AYRINTI && liste.length > 3) console.log(`             … ve ${liste.length - 3} tane daha`);
  }
}

console.log();
console.log("Özet sayılar");
console.log(`  ortalama kelime (indeksli): ${Math.round(indeksli.reduce((t, s) => t + s.kelime, 0) / indeksli.length)}`);
console.log(`  ortalama iç bağlantı      : ${(indeksli.reduce((t, s) => t + s.icBaglar.length, 0) / indeksli.length).toFixed(1)}`);
console.log(`  JSON-LD olan sayfa        : ${indeksli.filter((s) => s.jsonLd).length}/${indeksli.length}`);
