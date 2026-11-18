// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwind from "@tailwindcss/vite";
import parked from "./src/content/parked.json" with { type: "json" };
import { readdirSync, readFileSync } from "node:fs";

/**
 * Sitemap `lastmod` değerleri — içerik dosyalarının KENDİ `modifiedAt`
 * alanından okunur, uydurulmaz (SEO görevi 2026-11-18). Tarihi olmayan
 * adres için satır hiç yazılmaz; yanlış tarih bildirmek, hiç bildirmemekten
 * kötüdür.
 */
const SON_DEGISIM = new Map();
for (const klasor of ["posts", "pages"]) {
  const kok = `./src/content/${klasor}`;
  for (const ad of readdirSync(kok)) {
    if (!ad.endsWith(".json")) continue;
    try {
      const k = JSON.parse(readFileSync(`${kok}/${ad}`, "utf8"));
      const tarih = k.modifiedAt || k.publishedAt;
      if (!k.url || !tarih) continue;
      const d = new Date(tarih.replace(" ", "T") + "Z");
      if (!Number.isNaN(d.getTime())) SON_DEGISIM.set(k.url.replace(/\/+$/, ""), d.toISOString());
    } catch {
      /* bozuk dosya sitemap'i durdurmasın; şema denetimi derlemede zaten yapılıyor */
    }
  }
}

const SITE = process.env.SITE_URL ?? "https://www.ufuksen.com";
const PARKED = new Set(parked.slugs);
const PARKED_CATEGORIES = new Set(parked.parkKategorileri ?? []);

export default defineConfig({
  site: SITE,
  // ADR-007: eski yazı URL'leri `/{slug}.html` biçiminde birebir korunur.
  //
  // Dizin formatı kullanılıyor çünkü yazılar (.html uzantılı) ile sayfalar
  // (uzantısız) aynı slug'ı paylaşabiliyor — örn. `3d-gorsellestirme`. Düz dosya
  // formatında ikisi de aynı dosyaya düşüp çakışıyordu.
  //
  // Build sonrası `scripts/build/flatten-html-routes.mjs` yazıların
  // `{slug}.html/index.html` çıktısını `{slug}.html` düz dosyasına indiriyor.
  // Böylece her iki URL de tam dosya eşleşmesiyle çalışır ve hosting'in
  // "clean URL" davranışına bel bağlanmaz.
  build: {
    format: "directory",
  },
  trailingSlash: "ignore",
  integrations: [
    sitemap({
      /**
       * Astro dizin formatında ürettiği için sitemap URL'lerinin sonuna eğik
       * çizgi ekliyordu: `/yazi.html/`. Kanonik etiketlerimiz eğik çizgisiz —
       * yani sitemap Google'a kanonikten FARKLI bir URL bildiriyordu.
       * Burada kanonik biçime normalize ediliyor.
       */
      serialize: (item) => {
        const url = new URL(item.url);
        if (url.pathname !== "/") url.pathname = url.pathname.replace(/\/+$/, "");
        const lastmod = SON_DEGISIM.get(url.pathname);
        return lastmod ? { ...item, url: url.href, lastmod } : { ...item, url: url.href };
      },
      // Park edilen yazılar sitemap'e girmez (ADR-018) ve 404 da çıkmaz.
      filter: (page) => {
        if (page.includes("/404")) return false;
        const path = new URL(page).pathname
          .replace(/^\//, "")
          .replace(/\/+$/, "")
          .replace(/\.html$/, "");
        // Park edilen kategori sayfası da girmez: noindex taşıyor.
        const categorySlug = path.startsWith("kategori/") ? path.split("/").pop() : null;
        if (categorySlug && PARKED_CATEGORIES.has(categorySlug)) return false;
        return !PARKED.has(path);
      },
    }),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
