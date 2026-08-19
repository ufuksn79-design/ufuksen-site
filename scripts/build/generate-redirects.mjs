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

/**
 * Yeni sistem içi ad değişiklikleri.
 *
 * Bir ürün yeniden adlandırıldığında eski adres yayına çıkmış olabilir
 * (paylaşılan bağlantı, yer imi). ADR-004'ün mantığı miras URL'lerle sınırlı
 * değil: her eski adres ya çalışır ya 301 alır.
 */
const ICERIDEN = {
  "/urunler/kitchen-studio": "/urunler/kitchenflow",
};

lines.push(
  "",
  "# --- Site içi ad değişiklikleri ------------------------------------------",
  ...Object.entries(ICERIDEN).map(([from, to]) => `${from}  ${to}  301`),
  "",
  "# --- AMP / attachment / eski arama ---------------------------------------",
  "# Bu kalıplar BİLEREK burada değil: Cloudflare _redirects orta-yol splat",
  "# (/*.html/*) ve query eşleşmesini (/?s=) desteklemiyor; query'li satır",
  "# yanlış ayrışıp ANA SAYFAYI yönlendiriyordu (canlıda ölçüldü, 2026-08-12).",
  "# Hepsi worker/index.js içinde ele alınıyor: ?amp=1 -> kanonik,",
  "# /slug.html/ek -> /slug.html, /?s= -> /arama, kaldırılan içerik -> 410.",
  "# Paylaşımlı hosting için eşdeğer kurallar .htaccess'te duruyor.",
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
