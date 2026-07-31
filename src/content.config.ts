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

export const collections = { posts, pages };
