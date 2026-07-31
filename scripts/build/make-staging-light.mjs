/**
 * Tasarım turları için hafif staging paketi.
 *
 * Medya klasörü (1819 dosya, ~99 MB) tasarım değişikliklerinde hiç değişmiyor.
 * Sunucuda zaten yüklü olduğu için her turda yeniden göndermek gereksiz.
 * Bu paket yalnızca HTML, CSS, JS ve küçük dosyaları içerir.
 *
 * ÖNEMLİ: Yalnızca `/yeni` klasörüne daha önce tam paket yüklendiyse çalışır.
 * İlk yüklemede `make-staging.mjs` (tam paket) kullanılmalıdır.
 *
 * Kullanım:
 *   node scripts/build/make-staging.mjs /yeni     # önce yol yeniden yazımı
 *   node scripts/build/make-staging-light.mjs     # sonra hafif paket
 */

import { cp, rm, stat, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";

const ROOT = resolve(".");
const STAGE = join(ROOT, "dist-staging");
const LIGHT = join(ROOT, "dist-staging-light");
const OUT = join(ROOT, "site-yukle-staging-light.zip");

if (!existsSync(STAGE)) {
  console.error("dist-staging/ yok. Önce `node scripts/build/make-staging.mjs /yeni` çalıştırın.");
  process.exit(2);
}

await rm(LIGHT, { recursive: true, force: true });
/**
 * WordPress'ten göç eden medya yıl klasörlerinde durur (`media/2015` …
 * `media/2025`), tasarım turlarında değişmez ve sunucuda zaten yüklüdür —
 * dışarıda bırakılır.
 *
 * `media` altındaki DİĞER klasörler (örn. `media/udemy`) yeni eklenmiş
 * olabilir ve pakete girmelidir. Tüm `media` klasörünü dışlamak, yeni
 * eklenen görselleri staging'de kırık bırakıyordu.
 */
await cp(STAGE, LIGHT, {
  recursive: true,
  filter: (source) => {
    const rel = source.replace(/\\/g, "/").split("/dist-staging/")[1];
    if (!rel) return true;
    return !/^media\/\d{4}(\/|$)/.test(rel);
  },
});

let count = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) await walk(join(dir, entry.name));
    else count += 1;
  }
}
await walk(LIGHT);

if (existsSync(OUT)) await rm(OUT);
const script = [
  "$ErrorActionPreference = 'Stop'",
  "$items = Get-ChildItem -Path $env:ZIP_SOURCE -Force",
  "Compress-Archive -Path $items.FullName -DestinationPath $env:ZIP_TARGET -CompressionLevel Optimal",
].join("; ");
const result = spawnSync("powershell", ["-NoProfile", "-Command", script], {
  stdio: "inherit",
  env: { ...process.env, ZIP_SOURCE: LIGHT, ZIP_TARGET: OUT },
});
if (result.status !== 0) {
  console.error("Arşivleme başarısız.");
  process.exit(1);
}

const size = (await stat(OUT)).size / 1024 / 1024;
console.log(`Hafif paket: ${count} dosya, ${size.toFixed(1)} MB`);
console.log(`-> ${OUT}`);
console.log("Medya klasörü DAHİL DEĞİL — sunucudaki mevcut /yeni/media korunur.");
