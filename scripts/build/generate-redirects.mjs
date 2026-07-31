/**
 * `public/_redirects` üretir (Netlify / Cloudflare Pages biçimi).
 *
 * Kaynaklar:
 *   - docs/migration/legacy-redirects.json — kaynak WordPress'te tanımlı olan
 *     ve keşifle bulunan yönlendirmeler (bkz. scripts/wordpress/resolve-redirects.py)
 *   - AMP ve ek-dosya (attachment) joker kuralları
 *
 * ADR-004: her eski URL ya birebir korunur ya da 301 alır.
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(process.argv[2] ?? ".");
const SOURCE = join(ROOT, "docs", "migration", "legacy-redirects.json");
const TARGET = join(ROOT, "public", "_redirects");

let legacy = { redirects: {}, gone: [] };
try {
  legacy = JSON.parse(await readFile(SOURCE, "utf8"));
} catch {
  console.warn("legacy-redirects.json bulunamadı; yalnızca joker kurallar yazılıyor.");
}

const lines = [
  "# ÜRETİLMİŞ DOSYA — elle düzenlemeyin.",
  "# Kaynak: scripts/build/generate-redirects.mjs",
  "#",
  "# ADR-004: her eski URL ya birebir korunur ya da 301 alır.",
  "",
  "# --- Kaynak WordPress'te tanımlı yönlendirmeler --------------------------",
  "# Bunlar kaynak sistemde 301 ile çalışıyordu ve SEO değeri taşıyor.",
  "# Taşınmazlarsa şu anda çalışan URL'ler yeni sitede 404 olurdu.",
];

const entries = Object.entries(legacy.redirects ?? {}).sort(([a], [b]) => a.localeCompare(b));
for (const [from, to] of entries) {
  if (from === to) continue;
  lines.push(`${from}  ${to}  301`);
}

lines.push(
  "",
  "# --- AMP varyantları -----------------------------------------------------",
  "# /{slug}.html?amp=1 : statik hosting query'yi yok sayar, kanonik sayfayı",
  "#                      zaten sunar; kural gerekmez.",
  "# /{slug}.html/amp   : joker kuralla kanonik sayfaya 301.",
  "/*/amp     /:splat  301",
  "/*/amp/    /:splat  301",
  "",
  "# --- WordPress ek-dosya (attachment) sayfaları ---------------------------",
  "# Kaynak sistem de bunları üst içeriğe 301'liyor.",
  "/*.html/*  /:splat.html  301",
  "",
  "# --- Eski site içi arama -------------------------------------------------",
  "/?s=:term  /arama?q=:term  301",
  "",
);

if (legacy.gone?.length) {
  lines.push(
    "# --- Kaynakta da 404 dönen adresler --------------------------------------",
    "# Yönlendirme hedefi yok; 404 sayfası doğru davranıştır. Kayıt amaçlı:",
    ...legacy.gone.map((url) => `#   ${url}`),
    "",
  );
}

await writeFile(TARGET, lines.join("\n"), "utf8");
console.log(
  `generate-redirects: ${entries.length} açık kural + joker kurallar yazıldı -> public/_redirects`,
);
