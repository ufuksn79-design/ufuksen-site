import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * İçerik koleksiyonları.
 *
 * Kaynak dosyalar `scripts/wordpress/migrate.py` tarafından üretilir ve elle
 * düzenlenmez. Şema `src/types/content.ts` modelini yansıtır (ADR-009).
 */

const media = z.object({
  legacyId: z.number().optional(),
  legacyUrl: z.string(),
  localPath: z.string().nullable(),
  alt: z.string().optional(),
  width: z.number().nullable().optional(),
  height: z.number().nullable().optional(),
  mimeType: z.string().optional(),
  error: z.string().nullable().optional(),
});

const seo = z.object({
  title: z.string().nullable(),
  description: z.string().nullable(),
  focusKeyword: z.string().nullable().optional(),
  canonicalUrl: z.string().nullable(),
  ogImage: z.string().nullable(),
  /** Panelden açılırsa yazı arama motorlarına kapatılır (noindex). */
  noindex: z.boolean().optional(),
});

const term = z.object({
  legacyId: z.number(),
  name: z.string(),
  slug: z.string(),
});

const base = {
  legacyId: z.number(),
  slug: z.string(),
  legacyUrl: z.string(),
  url: z.string(),
  title: z.string(),
  excerpt: z.string().default(""),
  contentHtml: z.string(),
  publishedAt: z.string(),
  modifiedAt: z.string(),
  status: z.string(),
  featuredImage: media.nullable(),
  inlineMedia: z.array(media).default([]),
  embeds: z
    .array(
      z.object({
        provider: z.string(),
        externalId: z.string().nullable(),
        originalSrc: z.string(),
        title: z.string().nullable(),
      }),
    )
    .default([]),
  seo,
  readingMinutes: z.number(),
  migrationChecksum: z.string(),
};

const posts = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/posts" }),
  schema: z.object({
    ...base,
    author: z.object({
      legacyId: z.number().nullable(),
      name: z.string(),
      slug: z.string(),
      isGuest: z.boolean(),
    }),
    categories: z.array(term).default([]),
    tags: z.array(term).default([]),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/pages" }),
  schema: z.object(base),
});

/* ------------------------------------------------------------------ */
/* Ürünler (ADR-022)                                                   */
/* ------------------------------------------------------------------ */

const urunGorsel = z.object({
  src: z.string(),
  alt: z.string(),
  not: z.string().nullable().optional(),
});

/**
 * Ürünler her biri kendi dosyasında tutulur (`src/content/products/*.json`).
 * Böylece panelde tek tek eklenip silinebilirler ve yeni ürün eklemek kod
 * değişikliği gerektirmez.
 *
 * Şema burada doğrulanır: panelden hatalı veri gelirse derleme **durur**.
 * Sessizce yanlış sayfa üretmektense gürültülü hata vermek yeğdir.
 *
 * İsteğe bağlı bölümler (galeri, video, listeler, S.S.S., fiyat) boş
 * bırakıldığında sayfada hiç görünmez — yer tutucu üretilmez (AGENTS.md §5).
 */
const products = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/content/products" }),
  schema: z.object({
    slug: z.string(),
    ad: z.string(),
    tur: z.enum(["eklenti", "arac", "sablon"]),
    durum: z.enum(["aktif", "beta", "alfa", "gelistiriliyor", "arsiv"]),
    /** Yalnızca `gelistiriliyor` durumunda anlamlı. */
    ilerleme: z.number().min(0).max(100).nullable().default(null),
    surum: z.string().nullable().default(null),
    /** Listede sıralama; küçük olan önce. */
    sira: z.number().default(99),
    /** Kapalıyken ürün sitede hiç görünmez — hazır olmayan kayıt yayına düşmez. */
    yayinda: z.boolean().default(true),

    ozet: z.string(),
    aciklama: z.string().nullable().default(null),
    slogan: z.string().nullable().default(null),

    kapak: urunGorsel.nullable().default(null),
    galeri: z.array(urunGorsel).default([]),
    video: z
      .object({ youtubeId: z.string(), baslik: z.string().nullable().default(null) })
      .nullable()
      .default(null),

    uyumluluk: z.array(z.string()).default([]),
    ozellikler: z
      .array(
        z.object({
          baslik: z.string(),
          not: z.string(),
          ikon: z.string().default("grid"),
        }),
      )
      .default([]),
    /** Adlandırılmış listeler: "Desen kütüphanesi", "Desteklenen formatlar"… */
    listeler: z
      .array(
        z.object({
          baslik: z.string(),
          ogeler: z.array(z.string()),
          not: z.string().nullable().default(null),
        }),
      )
      .default([]),
    vurgular: z.array(z.string()).default([]),
    sss: z.array(z.object({ soru: z.string(), cevap: z.string() })).default([]),

    fiyat: z
      .object({
        tutar: z.number().nullable().default(null),
        paraBirimi: z.string().default("TRY"),
        not: z.string().nullable().default(null),
      })
      .nullable()
      .default(null),
    satinAlmaUrl: z.string().nullable().default(null),
    denemeUrl: z.string().nullable().default(null),
    iletisimEposta: z.string().nullable().default(null),

    /** Arşivdeki ilgili yazıları eşlemek için (bkz. lib/discover.ts SOFTWARE). */
    yazilim: z.array(z.string()).default([]),

    /** Yalnızca panelde görünür, sitede hiçbir yerde basılmaz. */
    icNot: z.string().nullable().default(null),
  }),
});

export const collections = { posts, pages, products };
