/**
 * URL davranış katmanı — paylaşımlı hosting'deki `.htaccess`'in Cloudflare
 * karşılığı (ADR-007, ADR-004, ADR-017).
 *
 * Neden var: Workers'ın varsayılan varlık sunumu `/yazi.html` isteklerini
 * 307 ile `/yazi`'ya yönlendiriyordu — 430 yazının kanonik adresi `.html`
 * uzantılı olduğu için bu, sitemap/kanonik tutarlılığını bozuyordu. Ayrıca
 * `_redirects` dosyasındaki query'li satır Cloudflare'de yanlış ayrışıp ana
 * sayfayı bile yönlendiriyordu. Bu katman davranışı belirleyici kılar:
 *
 *   1. `/?s=kelime`            -> 301 `/arama?q=kelime`
 *   2. `...?amp=1`             -> 301 kanonik sayfa
 *   3. kaldırılan 27 yazı      -> 410 Gone (404 sayfası gövdesiyle)
 *   4. `/yazi.html/ek-yol`     -> 301 `/yazi.html` (WP attachment mirası)
 *   5. `/yol/` (sonda çizgi)   -> 301 `/yol` (kanonikler çizgisiz)
 *   6. `.html` ve dosya yolları -> birebir sunulur, YÖNLENDİRME YOK
 *   7. uzantısız yol           -> dizin indeksi içerikle sunulur (307 yok)
 *   8. bulunamadı              -> kendi 404 sayfamız, 404 koduyla
 *
 * `/media/*` ve `/_astro/*` bu koda hiç girmez (wrangler.toml
 * `run_worker_first` istisnaları) — statik kotayı harcamazlar.
 * `_redirects` içindeki 59 miras 301'i varlık katmanı uygulamaya devam eder.
 */

import excluded from "../docs/content/excluded-posts.json";

/** Kalıcı olarak kaldırılan içerik (ADR-017). */
const GONE = new Set(excluded.yazilar.map((item) => item.url));

/** Varlık yanıtını verilen durum koduyla kopyalar. */
function withStatus(assetResponse, status) {
  return new Response(assetResponse.body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    // 1) Eski WordPress site içi araması
    if (pathname === "/" && searchParams.has("s")) {
      const query = searchParams.get("s") ?? "";
      return Response.redirect(`${url.origin}/arama?q=${encodeURIComponent(query)}`, 301);
    }

    // 2) AMP varyantı -> kanonik
    if (searchParams.get("amp") === "1") {
      return Response.redirect(url.origin + pathname, 301);
    }

    // 3) Kaldırılan içerik: 410, arama motoruna "kalıcı yok" sinyali
    if (GONE.has(pathname)) {
      const notFound = await env.ASSETS.fetch(new Request(`${url.origin}/404.html`));
      return withStatus(notFound, 410);
    }

    // 4) WordPress ek-dosya yolları: /slug.html/her-sey -> /slug.html
    const attachment = pathname.match(/^(\/.+\.html)\/.+$/);
    if (attachment) {
      return Response.redirect(url.origin + attachment[1], 301);
    }

    // 5) Sondaki eğik çizgi kanonik değil (kök hariç)
    if (pathname !== "/" && pathname.endsWith("/")) {
      return Response.redirect(url.origin + pathname.replace(/\/+$/, "") + url.search, 301);
    }

    // 6) Birebir varlık: /yazi.html dosyası, _redirects 301'leri dahil
    const exact = await env.ASSETS.fetch(request);
    if (exact.status !== 404) return exact;

    // 7) Uzantısız yol -> dizin indeksi, yönlendirmesiz (kanonik korunur)
    if (!/\.[a-zA-Z0-9]+$/.test(pathname)) {
      const base = pathname === "/" ? "" : pathname;
      const index = await env.ASSETS.fetch(new Request(`${url.origin}${base}/index.html`, request));
      if (index.status !== 404) return index;
    }

    // 8) Kendi 404 sayfamız, doğru durum koduyla
    const notFound = await env.ASSETS.fetch(new Request(`${url.origin}/404.html`));
    return withStatus(notFound, 404);
  },
};
