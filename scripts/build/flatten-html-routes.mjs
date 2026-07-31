/**
 * Build sonrası: `{slug}.html/index.html` -> `{slug}.html` düz dosyası.
 *
 * Neden: yazı URL'leri `/{slug}.html` biçiminde korunuyor (ADR-007), ama
 * yazılarla sayfalar aynı slug'ı paylaşabildiği için Astro dizin formatında
 * derleniyor. Bu adım olmadan `/{slug}.html` isteği hosting'in "dizin indeksi"
 * davranışına bağımlı kalırdı. Düzleştirme sonrası her iki URL de tam dosya
 * eşleşmesiyle çalışır ve hiçbir host varsayımı kalmaz.
 *
 * Idempotent: zaten düzleştirilmiş çıktıda değişiklik yapmaz.
 */

import { readdir, readFile, writeFile, rm, stat } from "node:fs/promises";
import { join, resolve } from "node:path";

const DIST = resolve(process.argv[2] ?? "dist");

let flattened = 0;
const conflicts = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (!entry.isDirectory()) continue;

    if (entry.name.endsWith(".html")) {
      const indexPath = join(full, "index.html");
      let hasIndex = true;
      try {
        await stat(indexPath);
      } catch {
        hasIndex = false;
      }
      if (!hasIndex) {
        conflicts.push({ path: full, reason: "index.html yok" });
        continue;
      }
      const others = (await readdir(full)).filter((name) => name !== "index.html");
      if (others.length > 0) {
        // Sessizce veri kaybetmemek için dokunmuyoruz; rapora yazılıyor.
        conflicts.push({ path: full, reason: `beklenmeyen ek dosyalar: ${others.join(", ")}` });
        continue;
      }
      const html = await readFile(indexPath, "utf8");
      await rm(full, { recursive: true, force: true });
      await writeFile(full, html, "utf8");
      flattened += 1;
      continue;
    }

    await walk(full);
  }
}

await walk(DIST);

if (conflicts.length > 0) {
  console.error("Düzleştirilemeyen yollar:");
  for (const item of conflicts) console.error(`  ${item.path} — ${item.reason}`);
  process.exit(1);
}

console.log(`flatten-html-routes: ${flattened} yol düzleştirildi.`);
