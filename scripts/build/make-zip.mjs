/**
 * `dist/` klasörünü tek bir yükleme arşivine paketler.
 *
 * 2376 dosyayı FTP ile tek tek göndermek yavaş ve kopma riski yüksektir.
 * Hosting panelindeki Dosya Yöneticisi ile tek zip yükleyip sunucuda açmak
 * hem çok daha hızlı hem de yarım kalma riski taşımaz.
 *
 * Arşivleme `zip-lib.mjs` içinde: gizli dosyalar (`.htaccess`) dahil edilir ve
 * üretilen pakette ters bölü kalmadığı doğrulanır (LES-014).
 */

import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { zipKlasor, mbYaz } from "./zip-lib.mjs";

const ROOT = resolve(".");
const DIST = resolve(ROOT, "dist");
const OUT = resolve(ROOT, "site-yukle.zip");

if (!existsSync(DIST)) {
  console.error("dist/ yok. Önce `npm run build` çalıştırın.");
  process.exit(2);
}

try {
  const { boyut, adet } = await zipKlasor(DIST, OUT);
  mbYaz(`Arşiv hazır: ${OUT} — ${adet} dosya`, boyut);
} catch (hata) {
  console.error(hata.message);
  process.exit(1);
}
