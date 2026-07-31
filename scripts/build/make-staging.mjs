/**
 * Alt klasörde (ör. /yeni) çalışacak staging paketi üretir.
 *
 * Sorun: site kök göreli yollar kullanıyor (`/media/...`, `/blog`, `/style.css`).
 * Bir alt klasöre yüklendiğinde bu yollar sunucu kökünü işaret eder ve
 * CSS, görsel ve linkler 404 verir — önizleme kırık görünür.
 *
 * Çözüm: `dist/` bir kopyaya alınır ve tüm kök göreli yollar `/yeni` önekiyle
 * yeniden yazılır. Üretim çıktısına DOKUNULMAZ.
 *
 * Ayrıca staging'de `.htaccess` yönlendirmeleri devre dışı bırakılır: o
 * kurallar sunucu köküne (WordPress'e) işaret ettiği için alt klasörde
 * yanlış çalışır.
 *
 * Kullanım:
 *   node scripts/build/make-staging.mjs /yeni
 */

import { cp, readFile, writeFile, readdir, rm, stat } from "node:fs/promises";
import { join, resolve, extname } from "node:path";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const ROOT = resolve(".");
const DIST = join(ROOT, "dist");
const BASE = (process.argv[2] ?? "/yeni").replace(/\/+$/, "");
const STAGE = join(ROOT, "dist-staging");
const OUT = join(ROOT, "site-yukle-staging.zip");

if (!existsSync(DIST)) {
  console.error("dist/ yok. Önce `npm run build` çalıştırın.");
  process.exit(2);
}
if (!BASE.startsWith("/")) {
  console.error("Önek `/` ile başlamalı. Örn: /yeni");
  process.exit(2);
}

await rm(STAGE, { recursive: true, force: true });
await cp(DIST, STAGE, { recursive: true });

const TEXT = new Set([".html", ".css", ".js", ".xml", ".json", ".txt"]);
let rewritten = 0;
let touched = 0;

/**
 * Kök göreli yolları önekler.
 * `//host` (protokol-göreli) ve zaten öneklenmiş yollar atlanır.
 */
function rebase(text) {
  let count = 0;
  const out = text.replace(
    /(href|src|content|action)="(\/(?!\/)[^"]*)"/g,
    (match, attr, path) => {
      if (path.startsWith(`${BASE}/`) || path === BASE) return match;
      count += 1;
      return `${attr}="${BASE}${path}"`;
    },
  );
  // CSS url(/...) ve srcset içindeki kök göreli yollar
  const out2 = out
    .replace(/url\((\/(?!\/)[^)"']*)\)/g, (match, path) => {
      if (path.startsWith(`${BASE}/`)) return match;
      count += 1;
      return `url(${BASE}${path})`;
    })
    .replace(/srcset="([^"]+)"/g, (match, value) => {
      const next = value
        .split(",")
        .map((part) => {
          const trimmed = part.trim();
          if (!trimmed.startsWith("/") || trimmed.startsWith(BASE + "/")) return part;
          count += 1;
          return " " + BASE + trimmed;
        })
        .join(",");
      return `srcset="${next}"`;
    });
  rewritten += count;
  return out2;
}

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
      continue;
    }
    if (!TEXT.has(extname(entry.name).toLowerCase())) continue;
    const original = await readFile(full, "utf8");
    const next = rebase(original);
    if (next !== original) {
      await writeFile(full, next, "utf8");
      touched += 1;
    }
  }
}

await walk(STAGE);

// Staging'de yönlendirme kuralları devre dışı: kök hedefli oldukları için
// alt klasörde WordPress'e sıçrarlar.
await rm(join(STAGE, ".htaccess"), { force: true });
await rm(join(STAGE, "_redirects"), { force: true });
await writeFile(
  join(STAGE, ".htaccess"),
  [
    "# STAGING — yalnızca önizleme içindir.",
    "# Yönlendirme kuralları bilinçli olarak kaldırıldı: üretim kuralları sunucu",
    "# köküne işaret ettiği için alt klasörde WordPress'e sıçrardı.",
    "Options -Indexes",
    "DirectoryIndex index.html",
    "AddDefaultCharset UTF-8",
    `ErrorDocument 404 ${BASE}/404.html`,
    "",
    "# Eğik çizgi eklemeyi kapat: /iletisim -> /iletisim/ 301'i olmasın.",
    "# Üretimdeki kuralın alt klasöre uyarlanmış hâli; canlıya çıkmadan burada",
    "# doğrulanıyor. Değiştirme yolu göreli olmalı — `/` ile başlarsa sunucu",
    "# kökünü işaret eder ve istek WordPress'e düşer.",
    "DirectorySlash Off",
    "<IfModule mod_rewrite.c>",
    "  RewriteEngine On",
    `  RewriteBase ${BASE}/`,
    "  RewriteCond %{REQUEST_FILENAME} -d",
    "  RewriteCond %{REQUEST_FILENAME}/index.html -f",
    "  RewriteRule ^(.*[^/])$ $1/index.html [L]",
    "</IfModule>",
    "",
  ].join("\n"),
  "utf8",
);

// Arama motorlarına staging'i indekslememesi söylenir.
await writeFile(join(STAGE, "robots.txt"), "User-agent: *\nDisallow: /\n", "utf8");

if (existsSync(OUT)) await rm(OUT);
const script = [
  "$ErrorActionPreference = 'Stop'",
  "$items = Get-ChildItem -Path $env:ZIP_SOURCE -Force",
  "Compress-Archive -Path $items.FullName -DestinationPath $env:ZIP_TARGET -CompressionLevel Optimal",
].join("; ");
const result = spawnSync("powershell", ["-NoProfile", "-Command", script], {
  stdio: "inherit",
  env: { ...process.env, ZIP_SOURCE: STAGE, ZIP_TARGET: OUT },
});
if (result.status !== 0) {
  console.error("Arşivleme başarısız.");
  process.exit(1);
}

const size = (await stat(OUT)).size / 1024 / 1024;
console.log(`Önek        : ${BASE}`);
console.log(`Değişen dosya: ${touched}`);
console.log(`Yeniden yazılan yol: ${rewritten}`);
console.log(`Arşiv       : ${OUT} (${size.toFixed(1)} MB)`);
