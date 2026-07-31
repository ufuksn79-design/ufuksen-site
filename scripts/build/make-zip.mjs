/**
 * `dist/` klasörünü tek bir yükleme arşivine paketler.
 *
 * 2337 dosyayı FTP ile tek tek göndermek yavaş ve kopma riski yüksektir.
 * Hosting panelindeki Dosya Yöneticisi ile tek zip yükleyip sunucuda açmak
 * hem çok daha hızlı hem de yarım kalma riski taşımaz.
 *
 * Gizli dosyalar (`.htaccess`) açıkça dahil edilir — `Get-ChildItem -Force`
 * olmadan PowerShell bunları atlar ve yönlendirmeler sessizce eksik kalırdı.
 */

import { spawnSync } from "node:child_process";
import { rmSync, existsSync, statSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(".");
const DIST = resolve(ROOT, "dist");
const OUT = resolve(ROOT, "site-yukle.zip");

if (!existsSync(DIST)) {
  console.error("dist/ yok. Önce `npm run build` çalıştırın.");
  process.exit(2);
}
if (existsSync(OUT)) rmSync(OUT);

// Yollar PowerShell'e ortam değişkeniyle geçiliyor; kaçış sorunu kalmıyor.
const script = [
  "$ErrorActionPreference = 'Stop'",
  "$items = Get-ChildItem -Path $env:ZIP_SOURCE -Force",
  "Compress-Archive -Path $items.FullName -DestinationPath $env:ZIP_TARGET -CompressionLevel Optimal",
].join("; ");

const result = spawnSync("powershell", ["-NoProfile", "-Command", script], {
  stdio: "inherit",
  env: { ...process.env, ZIP_SOURCE: DIST, ZIP_TARGET: OUT },
});

if (result.status !== 0) {
  console.error("Arşivleme başarısız.");
  process.exit(1);
}

const size = statSync(OUT).size / 1024 / 1024;
console.log(`Arşiv hazır: ${OUT} (${size.toFixed(1)} MB)`);
