/**
 * `dist/` klasörünü FTP ile sunucuya yükler.
 *
 * Güvenlik varsayılanları:
 *   - Varsayılan hedef STAGING alt dizinidir (`FTP_STAGING_DIR`), canlı kök değil.
 *   - Varsayılan mod dry-run: hiçbir şey yüklenmez, yalnızca plan gösterilir.
 *   - Sunucudan hiçbir dosya SİLİNMEZ. Yalnızca ekler/üzerine yazar.
 *   - Canlı köke yükleme, açıkça `--target=live --i-have-a-verified-backup`
 *     verilmeden çalışmaz.
 *
 * Kullanım:
 *   node scripts/deploy/ftp-deploy.mjs                       # plan (staging)
 *   node scripts/deploy/ftp-deploy.mjs --upload              # staging'e yükle
 *   node scripts/deploy/ftp-deploy.mjs --target=live --upload --i-have-a-verified-backup
 */

import { readdir, stat } from "node:fs/promises";
import { join, resolve, relative } from "node:path";
import { loadEnv, requireConfig, connect, human } from "./ftp-lib.mjs";

const ROOT = resolve(".");
const DIST = join(ROOT, "dist");
const args = process.argv.slice(2);
const UPLOAD = args.includes("--upload");
const TARGET = (args.find((a) => a.startsWith("--target="))?.split("=")[1] ?? "staging").toLowerCase();
const BACKUP_CONFIRMED = args.includes("--i-have-a-verified-backup");

const env = await loadEnv(ROOT);
const config = requireConfig(env);

if (TARGET !== "staging" && TARGET !== "live") {
  console.error("--target yalnızca `staging` veya `live` olabilir.");
  process.exit(2);
}

if (TARGET === "live" && !BACKUP_CONFIRMED) {
  console.error(
    "REDDEDİLDİ: canlı köke yükleme, mevcut siteyi geri alınamaz biçimde değiştirir.\n" +
      "Önce doğrulanmış bir yedek alın (dosya + veritabanı), sonra\n" +
      "`--i-have-a-verified-backup` bayrağını ekleyin.\n" +
      "Ayrıntı: docs/deploy/RUNBOOK.md",
  );
  process.exit(3);
}

const remoteRoot = TARGET === "live" ? config.root : config.staging;

// Yüklenecek dosyaları topla
const files = [];
let totalBytes = 0;
async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else {
      const info = await stat(full);
      files.push({ local: full, remote: relative(DIST, full).replace(/\\/g, "/"), size: info.size });
      totalBytes += info.size;
    }
  }
}

try {
  await walk(DIST);
} catch {
  console.error("dist/ bulunamadı. Önce `npm run build` çalıştırın.");
  process.exit(2);
}

console.log(`Sunucu   : ${config.host} (${config.secure ? "FTPS" : "DÜZ FTP"})`);
console.log(`Kullanıcı: ${config.user}`);
console.log(`Hedef    : ${remoteRoot}   [${TARGET.toUpperCase()}]`);
console.log(`Dosya    : ${files.length}  (${human(totalBytes)})`);
console.log(`Mod      : ${UPLOAD ? "YÜKLE" : "plan (dry-run) — hiçbir şey yüklenmiyor"}`);
console.log("");

if (TARGET === "live") {
  console.log("!!! CANLI DİZİNE YÜKLEME — mevcut WordPress dosyalarının üzerine yazılabilir.");
  console.log("");
}

if (!UPLOAD) {
  for (const file of files.slice(0, 15)) {
    console.log(`  ${remoteRoot}/${file.remote}  (${human(file.size)})`);
  }
  if (files.length > 15) console.log(`  … ve ${files.length - 15} dosya daha`);
  console.log("\nGerçekten yüklemek için `--upload` ekleyin.");
  process.exit(0);
}

const client = await connect(config);
let uploaded = 0;
try {
  await client.ensureDir(remoteRoot);
  // ensureDir çalışma dizinini değiştirir; kökten devam edelim.
  await client.cd(remoteRoot);
  console.log("Yükleniyor…");
  await client.uploadFromDir(DIST, remoteRoot);
  uploaded = files.length;
  console.log(`\nTamamlandı: ${uploaded} dosya -> ${remoteRoot}`);
  if (TARGET === "staging") {
    const suffix = config.staging.replace(config.root, "").replace(/^\//, "");
    console.log(`\nÖnizleme: https://www.ufuksen.com/${suffix}/`);
    console.log("Doğrulayın, sonra canlıya geçiş için RUNBOOK'u izleyin.");
  }
} catch (error) {
  // Hata sessizce yutulmaz.
  console.error(`\nYükleme hatası: ${error.message}`);
  console.error(`Yüklenen dosya sayısı belirsiz — tekrar çalıştırmak güvenlidir (üzerine yazar).`);
  process.exitCode = 1;
} finally {
  client.close();
}
