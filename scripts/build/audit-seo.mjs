/**
 * Üretilen `dist/` üzerinde SEO ve performans denetimi.
 *
 * Tahminle optimize etmemek için önce ölçer. Her bulgu sayfayla birlikte
 * raporlanır; kritik olanlar çıkış kodunu 1 yapar.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve, extname } from "node:path";

const ROOT = resolve(process.argv[2] ?? ".");
const DIST = join(ROOT, "dist");

async function walk(dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = await walk(DIST);
// Yönetim paneli bir içerik sayfası değil; SEO ölçütleri uygulanmaz.
const htmlFiles = files
  .filter((f) => f.endsWith(".html"))
  .filter((f) => !f.replace(/\\/g, "/").includes("/admin/"));

const bulgular = {
  ogImageYok: [],
  faviconYok: [],
  altsizGorsel: [],
  olcusuzGorsel: [],
  h1Yok: [],
  cokH1: [],
  langYok: [],
  uzunBaslik: [],
  kisaAciklama: [],
  uzunAciklama: [],
};

let toplamHtml = 0;
let enBuyukHtml = { ad: "", boyut: 0 };

for (const file of htmlFiles) {
  const raw = await readFile(file, "utf8");
  // <script> içindeki HTML şablonları gerçek işaretleme değildir; denetim
  // dışı bırakılır (lightbox şablonu yanlış pozitif üretiyordu).
  const html = raw.replace(/<script[\s\S]*?<\/script>/gi, "");
  const ad = file.slice(DIST.length + 1).replace(/\\/g, "/");
  const boyut = Buffer.byteLength(raw);
  toplamHtml += boyut;
  if (boyut > enBuyukHtml.boyut) enBuyukHtml = { ad, boyut };

  if (!/<html[^>]+lang=/.test(html)) bulgular.langYok.push(ad);
  if (!/property="og:image"/.test(html)) bulgular.ogImageYok.push(ad);
  if (!/rel="(icon|shortcut icon|apple-touch-icon)"/.test(html)) bulgular.faviconYok.push(ad);

  const h1 = html.match(/<h1[\s>]/g)?.length ?? 0;
  if (h1 === 0) bulgular.h1Yok.push(ad);
  if (h1 > 1) bulgular.cokH1.push(`${ad} (${h1})`);

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "";
  if (title.length > 65) bulgular.uzunBaslik.push(`${ad} (${title.length})`);

  const desc = html.match(/name="description" content="([^"]*)"/)?.[1] ?? "";
  if (desc && desc.length < 70) bulgular.kisaAciklama.push(`${ad} (${desc.length})`);
  if (desc.length > 165) bulgular.uzunAciklama.push(`${ad} (${desc.length})`);

  for (const img of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = img[0];
    if (!/\salt=/.test(tag)) bulgular.altsizGorsel.push(ad);
    // width/height olmayan görsel layout shift (CLS) üretir
    if (!/\swidth=/.test(tag) || !/\sheight=/.test(tag)) {
      bulgular.olcusuzGorsel.push(ad);
      if (process.env.AUDIT_DEBUG && bulgular.olcusuzGorsel.length < 4) {
        console.log("DEBUG eksik etiket:", JSON.stringify(tag.slice(0, 130)), "->", ad);
      }
    }
  }
}

// Varlık boyutları
const varliklar = { css: 0, js: 0, gorsel: 0, diger: 0 };
for (const file of files) {
  const boyut = (await stat(file)).size;
  const uzanti = extname(file).toLowerCase();
  if (uzanti === ".css") varliklar.css += boyut;
  else if (uzanti === ".js") varliklar.js += boyut;
  else if ([".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg"].includes(uzanti)) varliklar.gorsel += boyut;
  else if (uzanti !== ".html") varliklar.diger += boyut;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1) + " MB";
const kb = (n) => (n / 1024).toFixed(1) + " KB";
const tekil = (list) => [...new Set(list)];

console.log("SEO / performans denetimi");
console.log(`  HTML sayfa        : ${htmlFiles.length}`);
console.log(`  ortalama HTML     : ${kb(toplamHtml / htmlFiles.length)}`);
console.log(`  en büyük HTML     : ${enBuyukHtml.ad} — ${kb(enBuyukHtml.boyut)}`);
console.log(`  toplam CSS        : ${kb(varliklar.css)}`);
console.log(`  toplam JS         : ${kb(varliklar.js)}`);
console.log(`  toplam görsel     : ${mb(varliklar.gorsel)}`);
console.log("");
console.log("Bulgular (etkilenen sayfa sayısı)");
for (const [ad, list] of Object.entries(bulgular)) {
  const u = tekil(list);
  if (u.length === 0) continue;
  console.log(`  ${ad.padEnd(18)}: ${u.length}   örnek: ${u.slice(0, 2).join(", ")}`);
}

const kritik = tekil(bulgular.langYok).length + tekil(bulgular.h1Yok).length + tekil(bulgular.altsizGorsel).length;
if (kritik > 0) {
  console.error(`\nKRİTİK: ${kritik} sayfa lang / h1 / alt eksikliği taşıyor.`);
  process.exit(1);
}
console.log("\nKritik eksik yok.");
