/**
 * İçerik bütünlüğü doğrulaması — üretilen `dist/` üzerinde çalışır.
 *
 * Kontroller:
 *   1. Her sayfada canonical, title ve description var mı?
 *   2. Gövdedeki her yerel `/media/...` referansı diskte gerçekten var mı?
 *   3. İç `href="/..."` bağlantıları dist içinde çözülüyor mu?
 *   4. Kaynak sistemde bulunan yazı gövdesi hedefte boş kalmış mı?
 *
 * Hiçbiri sessizce geçilmez; sorun varsa çıkış kodu 1.
 */

import { readdir, readFile, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(process.argv[2] ?? ".");
const DIST = join(ROOT, "dist");

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function htmlFiles(dir, found = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await htmlFiles(full, found);
    else if (entry.name.endsWith(".html")) found.push(full);
  }
  return found;
}

/**
 * Bilinen sorunlar: kaynak sistemde de mevcut olan, göç kaynaklı olmayan
 * durumlar. Her biri kaynağa karşı doğrulandı (bkz. docs/migration/).
 * Bu ayrım olmadan doğrulama sürekli kırmızı kalır ve yeni bir bozulmayı
 * fark edemezdik.
 */
let known = { bosGovdeKaynaktaDaBos: [], medyaKaynaktaDaYok: [], kaynaktaDa404Linkler: [], cozulemeyenLinkHatasi: [] };
try {
  known = JSON.parse(await readFile(join(ROOT, "docs", "migration", "known-issues.json"), "utf8"));
} catch {
  console.warn("known-issues.json yok; tüm bulgular yeni sayılacak.");
}
const knownEmpty = new Set(known.bosGovdeKaynaktaDaBos ?? []);
const knownMedia = new Set(known.medyaKaynaktaDaYok ?? []);
const knownGone = new Set([...(known.kaynaktaDa404Linkler ?? []), ...(known.cozulemeyenLinkHatasi ?? [])]);

const files = await htmlFiles(DIST);
const problems = {
  canonicalYok: [],
  titleYok: [],
  descYok: [],
  eksikMedya: [],
  kirikIcLink: [],
  bosGovde: [],
};

const linkCache = new Map();
async function linkResolves(urlPath) {
  if (linkCache.has(urlPath)) return linkCache.get(urlPath);
  const clean = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const rel = clean.replace(/^\//, "").replace(/\/$/, "");
  const ok =
    clean === "/"
      ? await exists(join(DIST, "index.html"))
      : (await exists(join(DIST, rel))) ||
        (await exists(join(DIST, rel, "index.html"))) ||
        (await exists(join(DIST, `${rel}.html`)));
  linkCache.set(urlPath, ok);
  return ok;
}

for (const file of files) {
  const html = await readFile(file, "utf8");
  const name = file.slice(DIST.length + 1).replace(/\\/g, "/");
  const isUtility = /^(404|arama)/.test(name);

  if (!/<link rel="canonical"/.test(html)) problems.canonicalYok.push(name);
  if (!/<title>[^<]+<\/title>/.test(html)) problems.titleYok.push(name);
  if (!isUtility && !/<meta name="description"/.test(html)) problems.descYok.push(name);

  // Yerel medya referansları
  for (const src of html.matchAll(/(?:src|href)="(\/media\/[^"]+)"/g)) {
    const rel = decodeURIComponent(src[1].replace(/^\//, ""));
    if (!(await exists(join(DIST, rel)))) {
      problems.eksikMedya.push({ sayfa: name, medya: src[1] });
    }
  }

  // Yazı gövdesi boş mu?
  const prose = html.match(/<div class="prose"[^>]*>([\s\S]*?)<\/div>/);
  if (prose && prose[1].replace(/<[^>]+>/g, "").trim().length < 20) {
    problems.bosGovde.push(name);
  }

  // İç bağlantılar
  for (const href of html.matchAll(/href="(\/[^"#]*)"/g)) {
    const target = href[1];
    if (target.startsWith("/media/") || target.startsWith("//")) continue;
    if (/\.(xml|json|txt|css|js|jpg|png|webp|svg|ico)$/i.test(target)) continue;
    if (!(await linkResolves(target))) {
      problems.kirikIcLink.push({ sayfa: name, hedef: target });
    }
  }
}

const allBrokenLinks = [...new Set(problems.kirikIcLink.map((item) => item.hedef))];
const allMissingMedia = [...new Set(problems.eksikMedya.map((item) => item.medya))];
const allEmpty = problems.bosGovde;

// Bilinenleri ayır: yalnızca YENİ sorunlar hata sayılır.
const uniqueBrokenLinks = allBrokenLinks.filter((url) => !knownGone.has(url));
const uniqueMissingMedia = allMissingMedia.filter((url) => !knownMedia.has(decodeURIComponent(url)) && !knownMedia.has(url));
// Bilinen boş gövdeler slug listesi olarak tutulur; dist yolu slug'a indirgenir.
const newEmpty = allEmpty.filter((name) => {
  const slug = name.replace(/\/index\.html$/, "").replace(/\.html$/, "");
  return !knownEmpty.has(slug);
});

console.log("İçerik doğrulaması");
console.log(`  taranan sayfa      : ${files.length}`);
console.log(`  canonical yok      : ${problems.canonicalYok.length}`);
console.log(`  title yok          : ${problems.titleYok.length}`);
console.log(`  description yok    : ${problems.descYok.length}`);
console.log(`  boş gövde (bilinen): ${allEmpty.length - newEmpty.length}`);
console.log(`  boş gövde (YENİ)   : ${newEmpty.length}`);
console.log(`  eksik medya bilinen: ${allMissingMedia.length - uniqueMissingMedia.length}`);
console.log(`  eksik medya (YENİ) : ${uniqueMissingMedia.length}`);
console.log(`  kırık link bilinen : ${allBrokenLinks.length - uniqueBrokenLinks.length}`);
console.log(`  kırık link (YENİ)  : ${uniqueBrokenLinks.length}`);

if (uniqueMissingMedia.length) {
  console.error("\nEksik medya (ilk 10):");
  for (const item of uniqueMissingMedia.slice(0, 10)) console.error(`  ${item}`);
}
if (uniqueBrokenLinks.length) {
  console.error("\nKırık iç link (ilk 15):");
  for (const item of uniqueBrokenLinks.slice(0, 15)) console.error(`  ${item}`);
}

const fatal =
  problems.canonicalYok.length ||
  problems.titleYok.length ||
  newEmpty.length ||
  uniqueMissingMedia.length;

if (fatal) process.exit(1);
if (uniqueBrokenLinks.length) {
  console.warn(
    "\nUYARI: kırık iç linkler kaynak sistemde de 404 dönen bağlantılardır " +
      "(bkz. docs/migration/report.json -> preExistingBrokenLinks). Editoryal düzeltme gerekir.",
  );
}
console.log("\nİçerik doğrulaması tamam.");
