/**
 * `public/.htaccess` üretir — Apache / LiteSpeed için.
 *
 * Hosting (GüzelHosting, Pure-FTPd + LiteSpeed) `_redirects` biçimini okumaz;
 * o dosya yalnızca Netlify/Cloudflare Pages içindir. Yönlendirmeler burada
 * Apache kurallarına çevrilir.
 *
 * Kaynak: docs/migration/legacy-redirects.json (59 keşfedilmiş 301)
 *
 * DİKKAT: Bu dosya canlı köke yüklenirse WordPress'in mevcut `.htaccess`
 * dosyasının ÜZERİNE YAZAR. Geçişten önce mutlaka yedekleyin (RUNBOOK §3).
 */

import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";

const ROOT = resolve(process.argv[2] ?? ".");
const SOURCE = join(ROOT, "docs", "migration", "legacy-redirects.json");
const TARGET = join(ROOT, "public", ".htaccess");

let legacy = { redirects: {} };
try {
  legacy = JSON.parse(await readFile(SOURCE, "utf8"));
} catch {
  console.warn("legacy-redirects.json yok; yalnızca genel kurallar yazılıyor.");
}

/**
 * Siteden kaldırılan yazılar -> 410 Gone.
 *
 * 404 yerine 410 kullanılıyor: 404 "şu an bulunamadı", 410 "kalıcı olarak
 * kaldırıldı" demektir. Arama motoru 410'da URL'yi indeksten belirgin biçimde
 * daha hızlı düşürür ve tekrar taramaya çalışmaz. Bkz. ADR-017.
 */
let excluded = { yazilar: [] };
try {
  excluded = JSON.parse(await readFile(join(ROOT, "docs", "content", "excluded-posts.json"), "utf8"));
} catch {
  // Liste yoksa kural üretilmez.
}

/** Apache RewriteRule için özel karakterleri kaçır. */
const escapeRe = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const entries = Object.entries(legacy.redirects ?? {})
  .filter(([from, to]) => from !== to)
  .sort(([a], [b]) => a.localeCompare(b));

const lines = [
  "# ÜRETİLMİŞ DOSYA — elle düzenlemeyin.",
  "# Kaynak: scripts/build/generate-htaccess.mjs",
  "#",
  "# Bu dosya statik Astro çıktısı içindir. Canlı köke yüklenirse WordPress'in",
  "# .htaccess dosyasının üzerine yazar — önce yedekleyin (docs/deploy/RUNBOOK.md).",
  "",
  "Options -Indexes",
  "DirectoryIndex index.html",
  "",
  "# UTF-8: içerik ve dosya adları Türkçe karakter içeriyor",
  "AddDefaultCharset UTF-8",
  "",
  "ErrorDocument 404 /404.html",
  "",
  "# --- Eğik çizgi eklemeyi kapat ------------------------------------------",
  "# Apache varsayılan olarak /iletisim -> /iletisim/ şeklinde 301 atar.",
  "# Eski WordPress URL'leri eğik çizgisizdi ve canonical etiketlerimiz de",
  "# eğik çizgisiz. Yönlendirme bırakılırsa her sayfa/kategori isteği gereksiz",
  "# bir hop alır ve sunulan URL canonical'dan farklı olur (ADR-004).",
  "DirectorySlash Off",
  "",
  "<IfModule mod_rewrite.c>",
  "RewriteEngine On",
  "",
  "  # Uzantısız yolları yönlendirme yapmadan, içeriden index.html'e bağla.",
  "  RewriteCond %{REQUEST_FILENAME} -d",
  "  RewriteCond %{REQUEST_FILENAME}/index.html -f",
  "  RewriteRule ^(.*[^/])$ /$1/index.html [L]",
  "",
  "  # --- WordPress ek-dosya (attachment) sayfaları -----------------------",
  "  # /{slug}.html/{ek} -> /{slug}.html   (kaynak sistem de böyle 301'liyor)",
  "  RewriteRule ^(.+\\.html)/.+$ /$1 [R=301,L]",
  "",
  "  # --- AMP varyantları --------------------------------------------------",
  "  # /{slug}.html/amp -> /{slug}.html (yukarıdaki kural kapsıyor)",
  "  # /{slug}.html?amp=1 -> query yok sayılır, kanonik sayfa zaten sunulur.",
  "  # Yine de kanonik URL'e temizleyelim:",
  "  RewriteCond %{QUERY_STRING} (^|&)amp=1(&|$)",
  "  RewriteRule ^(.*)$ /$1? [R=301,L]",
  "",
  "  # --- Eski site içi arama ---------------------------------------------",
  "  RewriteCond %{QUERY_STRING} (^|&)s=([^&]+)",
  "  RewriteCond %{REQUEST_URI} ^/?$",
  "  RewriteRule ^(.*)$ /arama?q=%2 [R=301,L]",
  "",
  "  # --- Kaynak WordPress'te tanımlı yönlendirmeler -----------------------",
  `  # ${entries.length} kural. Bunlar kaynakta 301 ile çalışıyordu ve SEO değeri taşıyor.`,
];

for (const [from, to] of entries) {
  const path = from.replace(/^\//, "");
  lines.push(`  RewriteRule ^${escapeRe(path)}$ ${to} [R=301,L]`);
}

// Kaldırılan içerik: RewriteRule'lardan ÖNCE, mod_rewrite bloğunun içinde
// değerlendirilmeli ki yönlendirme kuralları bunları yakalamasın.
if (excluded.yazilar?.length) {
  lines.push(
    "",
    "  # --- Kaldırılan içerik (410 Gone) ------------------------------------",
    `  # ${excluded.yazilar.length} yazı siteden kaldırıldı: konu ilgisi olmayan doldurma içerik.`,
    "  # 410, arama motoruna kalıcı kaldırma sinyalidir; 404'ten daha nettir.",
  );
  for (const item of excluded.yazilar) {
    lines.push(`  RewriteRule ^${escapeRe(item.url.replace(/^\//, ""))}$ - [G,L]`);
  }
}

lines.push(
  "</IfModule>",
  "",
  "# --- Sıkıştırma --------------------------------------------------------",
  "<IfModule mod_deflate.c>",
  "  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml",
  "  AddOutputFilterByType DEFLATE application/javascript application/json",
  "  AddOutputFilterByType DEFLATE application/rss+xml image/svg+xml",
  "</IfModule>",
  "",
  "# --- Önbellek ----------------------------------------------------------",
  "<IfModule mod_expires.c>",
  "  ExpiresActive On",
  "  # Görsel ve fontlar içerik değişince yeni dosya adı almadığı için",
  "  # ölçülü bir süre veriliyor.",
  "  ExpiresByType image/jpeg              \"access plus 30 days\"",
  "  ExpiresByType image/png               \"access plus 30 days\"",
  "  ExpiresByType image/webp              \"access plus 30 days\"",
  "  ExpiresByType image/svg+xml           \"access plus 30 days\"",
  "  # Astro hash'li asset üretir; uzun süre güvenli.",
  "  ExpiresByType text/css                \"access plus 1 year\"",
  "  ExpiresByType application/javascript  \"access plus 1 year\"",
  "  # HTML her zaman taze doğrulansın.",
  "  ExpiresByType text/html               \"access plus 0 seconds\"",
  "</IfModule>",
  "",
  "# --- Güvenlik başlıkları -----------------------------------------------",
  "<IfModule mod_headers.c>",
  "  Header always set X-Content-Type-Options \"nosniff\"",
  "  Header always set X-Frame-Options \"SAMEORIGIN\"",
  "  Header always set Referrer-Policy \"strict-origin-when-cross-origin\"",
  "</IfModule>",
  "",
);

await writeFile(TARGET, lines.join("\n"), "utf8");
console.log(`generate-htaccess: ${entries.length} yönlendirme + genel kurallar -> public/.htaccess`);
