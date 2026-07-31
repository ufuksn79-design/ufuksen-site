/**
 * `public/media` altındaki görsellerin gerçek boyutlarını ölçer.
 *
 * Neden gerekli: göç eden WordPress gövdesindeki `<img>` etiketlerinde
 * `width`/`height` yok. Tarayıcı görseli indirene kadar yer ayıramıyor ve
 * sayfa yüklenirken içerik zıplıyor (CLS — Core Web Vitals'ın üç ana
 * ölçütünden biri). Ölçülen boyutlar derleme sırasında etiketlere yazılıyor.
 *
 * Bağımlılık kullanılmadı: JPEG/PNG/WebP/GIF başlıkları doğrudan okunuyor.
 * Sonuç `src/content/media-dimensions.json` içine yazılır.
 */

import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import { join, resolve, extname } from "node:path";

const ROOT = resolve(process.argv[2] ?? ".");
const MEDIA = join(ROOT, "public", "media");
const OUT = join(ROOT, "src", "content", "media-dimensions.json");

/** PNG: IHDR chunk'ı sabit konumda. */
function pngSize(buf) {
  if (buf.length < 24) return null;
  if (buf.readUInt32BE(0) !== 0x89504e47) return null;
  return [buf.readUInt32BE(16), buf.readUInt32BE(20)];
}

/** GIF: logical screen descriptor, little-endian. */
function gifSize(buf) {
  if (buf.length < 10 || buf.toString("ascii", 0, 3) !== "GIF") return null;
  return [buf.readUInt16LE(6), buf.readUInt16LE(8)];
}

/** JPEG: SOF0..SOF15 segmentini tarayarak bul. */
function jpegSize(buf) {
  if (buf.length < 4 || buf.readUInt16BE(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1];
    // SOF0-3, SOF5-7, SOF9-11, SOF13-15 (DHT/DAC/RST hariç)
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return [buf.readUInt16BE(offset + 7), buf.readUInt16BE(offset + 5)];
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    offset += 2 + buf.readUInt16BE(offset + 2);
  }
  return null;
}

/** WebP: VP8 / VP8L / VP8X biçimlerinin üçü de desteklenir. */
function webpSize(buf) {
  if (buf.length < 30) return null;
  if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WEBP") return null;
  const format = buf.toString("ascii", 12, 16);
  if (format === "VP8 ") {
    return [buf.readUInt16LE(26) & 0x3fff, buf.readUInt16LE(28) & 0x3fff];
  }
  if (format === "VP8L") {
    const bits = buf.readUInt32LE(21);
    return [(bits & 0x3fff) + 1, ((bits >> 14) & 0x3fff) + 1];
  }
  if (format === "VP8X") {
    const w = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const h = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    return [w, h];
  }
  return null;
}

const READERS = { ".png": pngSize, ".gif": gifSize, ".jpg": jpegSize, ".jpeg": jpegSize, ".webp": webpSize };

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full, out);
    else out.push(full);
  }
  return out;
}

const files = await walk(MEDIA);
const sizes = {};
let okunan = 0;
let okunamayan = 0;

for (const file of files) {
  const reader = READERS[extname(file).toLowerCase()];
  if (!reader) continue;
  try {
    // Başlık için ilk 64 KB yeterli; tüm dosyayı okumak 115 MB'lık arşivde israf olur.
    const handle = await readFile(file);
    const head = handle.length > 65536 ? handle.subarray(0, 65536) : handle;
    const size = reader(head) ?? reader(handle);
    if (!size || !size[0] || !size[1]) {
      okunamayan += 1;
      continue;
    }
    const key = "/media/" + file.slice(MEDIA.length + 1).replace(/\\/g, "/");
    sizes[key] = size;
    okunan += 1;
  } catch {
    okunamayan += 1;
  }
}

await writeFile(OUT, JSON.stringify(sizes), "utf8");
const boyut = (await stat(OUT)).size;
console.log(`measure-media: ${okunan} görsel ölçüldü, ${okunamayan} okunamadı`);
console.log(`-> ${OUT} (${(boyut / 1024).toFixed(0)} KB)`);
