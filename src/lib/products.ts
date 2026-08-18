import { getCollection, type CollectionEntry } from "astro:content";

/**
 * Ürün katmanı (ADR-022).
 *
 * Ürünlerle ilgili her ortak karar burada: sıralama, durum/tür etiketleri,
 * ikon kümesi. Sayfalar bunları kendi içinde tanımlamaz — yeni ürün tipi ya da
 * yeni ikon eklendiğinde tek dosya değişir, bileşenler dokunulmadan uyar.
 */

export type Product = CollectionEntry<"products">;
export type ProductData = Product["data"];

/* ------------------------------------------------------------------ */
/* Etiketler                                                           */
/* ------------------------------------------------------------------ */

export const DURUM: Record<ProductData["durum"], { etiket: string; ton: "ok" | "warn" | "muted" }> =
  {
    aktif: { etiket: "Yayında", ton: "ok" },
    beta: { etiket: "Beta", ton: "warn" },
    alfa: { etiket: "Alfa", ton: "warn" },
    gelistiriliyor: { etiket: "Geliştiriliyor", ton: "warn" },
    arsiv: { etiket: "Arşiv", ton: "muted" },
  };

export const TUR: Record<ProductData["tur"], { tekil: string; cogul: string }> = {
  eklenti: { tekil: "SketchUp eklentisi", cogul: "Eklentiler" },
  arac: { tekil: "Web aracı", cogul: "Araçlar" },
  sablon: { tekil: "Şablon", cogul: "Şablonlar" },
};

/* ------------------------------------------------------------------ */
/* İkonlar                                                             */
/* ------------------------------------------------------------------ */

/**
 * Özellik ikonları. Panelde ikon adı serbest metin olarak girilir; burada
 * karşılığı yoksa `grid` kullanılır — bilinmeyen ad sayfayı bozmaz.
 *
 * Yeni ikon eklemek: buraya bir SVG yol ekleyin, panelde adını yazın.
 */
export const IKONLAR: Record<string, string> = {
  grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1"/><rect x="13.5" y="3.5" width="7" height="7" rx="1"/><rect x="3.5" y="13.5" width="7" height="7" rx="1"/><rect x="13.5" y="13.5" width="7" height="7" rx="1"/>',
  bolt: '<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z"/>',
  ruler:
    '<rect x="2.5" y="8" width="19" height="8" rx="1.5"/><path d="M7 8v3M11 8v4M15 8v3M19 8v4"/>',
  sliders:
    '<path d="M4 7h10M18 7h2M4 12h4M12 12h8M4 17h9M17 17h3"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="15" cy="17" r="2"/>',
  layers: '<path d="m12 3 8 4.5-8 4.5-8-4.5z"/><path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5"/>',
  texture:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M3.5 9h17M3.5 15h17M9 3.5v17M15 3.5v17"/>',
  kesim: '<circle cx="6" cy="6" r="2.5"/><circle cx="6" cy="18" r="2.5"/><path d="M8 7.5 20 18M8 16.5 20 6"/>',
  kutu: '<path d="M12 3 4.5 7v10L12 21l7.5-4V7z"/><path d="M4.5 7 12 11l7.5-4M12 11v10"/>',
  indir: '<path d="M12 3v12M7.5 10.5 12 15l4.5-4.5"/><path d="M4 18.5h16"/>',
  bulut: '<path d="M7 18.5a4 4 0 0 1-.4-7.98A5.5 5.5 0 0 1 17.4 10 3.75 3.75 0 0 1 17 18.5z"/>',
  kod: '<path d="m8.5 8.5-4 3.5 4 3.5M15.5 8.5l4 3.5-4 3.5M13.5 5.5l-3 13"/>',
  onay: '<circle cx="12" cy="12" r="8.5"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
  saat: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  goz: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.75"/>',
};

export function ikon(ad: string | undefined): string {
  return IKONLAR[ad ?? ""] ?? IKONLAR.grid;
}

/* ------------------------------------------------------------------ */
/* Sorgular                                                            */
/* ------------------------------------------------------------------ */

function sirala(a: Product, b: Product): number {
  if (a.data.sira !== b.data.sira) return a.data.sira - b.data.sira;
  return a.data.ad.localeCompare(b.data.ad, "tr");
}

/** Sitede görünen ürünler. `yayinda: false` olanlar hiçbir yerde çıkmaz. */
export async function getProducts(): Promise<Product[]> {
  const hepsi = await getCollection("products");
  return hepsi.filter((u) => u.data.yayinda).sort(sirala);
}

/** Yayında olmayanlar dahil — sayfa üretimi ve denetim için. */
export async function getAllProducts(): Promise<Product[]> {
  return (await getCollection("products")).sort(sirala);
}

/** Ürün sayfası adresi. Tek yerde tanımlı — şema değişirse burası değişir. */
export function productPath(slug: string): string {
  return `/urunler/${slug}`;
}

/**
 * Türlere göre gruplama — liste sayfasında süzgeç göstermeye değer mi
 * kararını veri belirler, elle yazılmış bir eşik değil.
 */
export function turDagilimi(urunler: Product[]): { tur: ProductData["tur"]; adet: number }[] {
  const sayac = new Map<ProductData["tur"], number>();
  for (const u of urunler) sayac.set(u.data.tur, (sayac.get(u.data.tur) ?? 0) + 1);
  return [...sayac.entries()]
    .map(([tur, adet]) => ({ tur, adet }))
    .sort((a, b) => b.adet - a.adet);
}
