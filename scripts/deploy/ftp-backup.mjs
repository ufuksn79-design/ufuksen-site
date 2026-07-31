/**
 * Sunucudaki mevcut dosyaların FTP üzerinden yerel yedeğini alır.
 *
 * `AGENTS.md` ve ADR-003: yedek alınmadan hiçbir destructive işlem yapılmaz.
 * Bu script SALT OKUNUR — sunucuya hiçbir şey yazmaz, silmez.
 *
 * DİKKAT: FTP yalnızca DOSYA yedeği alır. WordPress'in VERİTABANI buna dahil
 * değildir. Tam yedek için ayrıca phpMyAdmin/cPanel üzerinden SQL dışa aktarımı
 * gerekir — bkz. docs/deploy/RUNBOOK.md.
 *
 * Kullanım:
 *   node scripts/deploy/ftp-backup.mjs            # yalnızca listeler (dry-run)
 *   node scripts/deploy/ftp-backup.mjs --download # gerçekten indirir
 */

import { mkdir, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { loadEnv, requireConfig, connect, human } from "./ftp-lib.mjs";

const ROOT = resolve(process.argv[2]?.startsWith("--") ? "." : process.argv[2] ?? ".");
const DOWNLOAD = process.argv.includes("--download");

const env = await loadEnv(ROOT);
const config = requireConfig(env);

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const target = join(resolve(ROOT, config.backupDir), `ftp-${stamp}`);

console.log(`Sunucu   : ${config.host} (${config.secure ? "FTPS" : "DÜZ FTP"})`);
console.log(`Kullanıcı: ${config.user}`);
console.log(`Kaynak   : ${config.root}`);
console.log(`Mod      : ${DOWNLOAD ? "İNDİR" : "yalnızca listele (dry-run)"}`);
console.log("");

const client = await connect(config);
let fileCount = 0;
let totalBytes = 0;
const manifest = [];

try {
  async function walk(remoteDir, depth = 0) {
    let entries;
    try {
      entries = await client.list(remoteDir);
    } catch (error) {
      console.error(`  LİSTELENEMEDİ ${remoteDir}: ${error.message}`);
      return;
    }
    for (const entry of entries) {
      if (entry.name === "." || entry.name === "..") continue;
      const remotePath = `${remoteDir}/${entry.name}`.replace(/\/+/g, "/");
      if (entry.isDirectory) {
        if (depth === 0) console.log(`  [dizin] ${remotePath}`);
        await walk(remotePath, depth + 1);
      } else {
        fileCount += 1;
        totalBytes += entry.size ?? 0;
        manifest.push({ path: remotePath, size: entry.size, modifiedAt: entry.modifiedAt });
        if (DOWNLOAD) {
          const localPath = join(target, remotePath.replace(/^\//, "").replace(/\//g, "/"));
          await mkdir(join(localPath, ".."), { recursive: true });
          await client.downloadTo(localPath, remotePath);
        }
        if (fileCount % 250 === 0) console.log(`  ...${fileCount} dosya (${human(totalBytes)})`);
      }
    }
  }

  await walk(config.root);

  await mkdir(target, { recursive: true });
  await writeFile(
    join(target, "manifest.json"),
    JSON.stringify(
      { takenAt: new Date().toISOString(), host: config.host, root: config.root, fileCount, totalBytes, files: manifest },
      null,
      2,
    ),
    "utf8",
  );

  console.log("");
  console.log(`Dosya   : ${fileCount}`);
  console.log(`Boyut   : ${human(totalBytes)}`);
  console.log(`Manifest: ${join(target, "manifest.json")}`);
  if (!DOWNLOAD) {
    console.log("\nHiçbir dosya indirilmedi. Gerçek yedek için `--download` ekleyin.");
  } else {
    console.log(`\nYedek indirildi: ${target}`);
  }
  console.log(
    "\nHATIRLATMA: Bu yalnızca DOSYA yedeğidir. Veritabanı yedeği ayrıca alınmalıdır.",
  );
} finally {
  client.close();
}
