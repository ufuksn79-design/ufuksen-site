/**
 * URL koruma doğrulaması (ADR-004, ADR-007).
 *
 * `docs/inventory/url-map.csv` içindeki her `keep` eylemli eski URL için
 * `dist/` altında karşılık gelen bir dosya olduğunu kanıtlar. Eksik varsa
 * çıkış kodu 1 döner — göç "tamamlandı" sayılamaz.
 *
 * Ayrıca içerik adet doğrulaması yapar (ADR-006).
 */

import { readFile, stat, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(process.argv[2] ?? ".");
const DIST = join(ROOT, "dist");
const MAP = join(ROOT, "docs", "inventory", "url-map.csv");

function parseCsv(text) {
  const [headerLine, ...lines] = text.trim().split(/\r?\n/);
  const headers = headerLine.split(",");
  return lines.map((line) => {
    // Basit CSV: alanlar virgül içermiyor (üretici script kontrol ediyor)
    const cells = line.split(",");
    return Object.fromEntries(headers.map((header, index) => [header, cells[index] ?? ""]));
  });
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/** Bir URL yolunun dist içinde gerçek bir dosyaya çözülüp çözülmediği. */
async function resolves(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  if (clean === "/") return exists(join(DIST, "index.html"));
  const rel = clean.replace(/^\//, "").replace(/\/$/, "");
  // 1) tam dosya eşleşmesi  2) dizin indeksi
  if (await exists(join(DIST, rel))) return true;
  if (await exists(join(DIST, rel, "index.html"))) return true;
  if (await exists(join(DIST, `${rel}.html`))) return true;
  return false;
}

/** Bilinçli olarak kaldırılan yazılar; bunlar 410 döner, eksik sayılmaz. */
let goneUrls = new Set();
try {
  const excluded = JSON.parse(
    await readFile(join(ROOT, "docs", "content", "excluded-posts.json"), "utf8"),
  );
  goneUrls = new Set((excluded.yazilar ?? []).map((item) => item.url));
} catch {
  // liste yoksa hepsi beklenir
}

const rows = parseCsv(await readFile(MAP, "utf8"));
const checked = { keep: 0, redirect: 0, decide: 0 };
const missing = [];

for (const row of rows) {
  checked[row.eylem] = (checked[row.eylem] ?? 0) + 1;
  if (row.eylem !== "keep") continue;
  if (goneUrls.has(row.legacy_url)) continue; // 410 ile kaldırıldı
  if (!(await resolves(row.legacy_url))) {
    missing.push({ url: row.legacy_url, tip: row.tip });
  }
}

// İçerik adedi doğrulaması
const postFiles = (await readdir(join(ROOT, "src", "content", "posts"))).length;
const pageFiles = (await readdir(join(ROOT, "src", "content", "pages"))).length;
const migration = JSON.parse(await readFile(join(ROOT, "docs", "migration", "report.json"), "utf8"));

const expectedPosts = migration.expectedPosts ?? migration.source.posts;
const countsOk = postFiles === expectedPosts && pageFiles === migration.source.pages;

console.log("URL doğrulaması");
console.log(`  eşleme satırı      : ${rows.length}`);
console.log(`  keep (doğrulandı)  : ${checked.keep}`);
console.log(`  redirect (host)    : ${checked.redirect}`);
console.log(`  decide (açık)      : ${checked.decide}`);
console.log(`  çözülemeyen        : ${missing.length}`);
console.log("İçerik adedi");
console.log(`  yazı  kaynak=${migration.source.posts} kaldırılan=${migration.excludedPosts ?? 0} beklenen=${expectedPosts} hedef=${postFiles}`);
console.log(`  sayfa kaynak=${migration.source.pages} hedef=${pageFiles}`);

if (missing.length > 0) {
  console.error("\nÇözülemeyen URL'ler (ilk 20):");
  for (const item of missing.slice(0, 20)) console.error(`  ${item.tip}  ${item.url}`);
  process.exit(1);
}
if (!countsOk) {
  console.error("\nİçerik adedi kaynakla eşleşmiyor.");
  process.exit(1);
}
console.log("\nTüm keep URL'leri çözüldü; adetler eşleşiyor.");
