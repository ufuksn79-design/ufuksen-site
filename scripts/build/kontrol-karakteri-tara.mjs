/**
 * Kabuk kaçışı yüzünden koda sızan kontrol karakterlerini temizler (LES-014).
 *
 * `python -c "...\\b..."` zinciri `\b`yi geri silme karakterine (0x08)
 * çeviriyor. Gözle görünmez, grep'te fark edilmez, yalnızca regex sessizce
 * hiçbir şeyle eşleşmez. Burada `\b` yerine kaçış istemeyen bir sınır
 * kullanılıyor: `(?<!\d)` / `(?!\d)`.
 */
import { readFile, writeFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const KOK = process.cwd();
const TARANAN = ["src/components", "src/pages", "src/lib", "src/layouts", "scripts/build", "scripts/content"];

/** Satır sonu ve sekme dışında hiçbir kontrol karakteri kodda olmamalı. */
const KONTROL = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

async function* dosyalar(dizin) {
  for (const g of await readdir(join(KOK, dizin), { withFileTypes: true })) {
    const yol = `${dizin}/${g.name}`;
    if (g.isDirectory()) yield* dosyalar(yol);
    else if (/\.(astro|ts|mjs|js)$/.test(g.name)) yield yol;
  }
}

let temizlenen = 0;
for (const d of TARANAN) {
  for await (const yol of dosyalar(d)) {
    const tam = join(KOK, yol);
    const s = await readFile(tam, "utf8");
    const adet = (s.match(KONTROL) ?? []).length;
    if (!adet) continue;
    // Yıl sınırı için kaçış gerektirmeyen biçim
    const temiz = s
      .replace(/\u0008\(20\\d\{2\}\)\u0008/g, "(?<!\\d)(20\\d{2})(?!\\d)")
      .replace(KONTROL, "");
    await writeFile(tam, temiz, "utf8");
    console.log(`  ${yol}: ${adet} kontrol karakteri temizlendi`);
    temizlenen++;
  }
}

console.log(temizlenen ? `${temizlenen} dosya düzeltildi.` : "Kontrol karakteri bulunmadı.");
