import { getCollection, type CollectionEntry } from "astro:content";
import taxonomy from "../content/taxonomy.json";
import parked from "../content/parked.json";

export type Post = CollectionEntry<"posts">;
export type Page = CollectionEntry<"pages">;

export interface Category {
  legacyId: number;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
  legacyUrl: string;
}

/**
 * Park edilmiş yazılar — siteden çıkarıldı ama silinmedi.
 *
 * Ayrı bir siteye taşınacakları için URL'leri çalışmaya devam eder (noindex).
 * Listelerde, kategorilerde, aramada, sitemap ve RSS'te GÖRÜNMEZLER.
 * Bkz. ADR-018.
 */
const PARKED = new Set(parked.slugs as string[]);

export function isParked(slug: string): boolean {
  return PARKED.has(slug);
}

/** Sitede görünen yazılar — park edilenler hariç, yeniden eskiye. */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return posts
    .filter((post) => !PARKED.has(post.data.slug))
    .sort((a, b) => Date.parse(b.data.publishedAt) - Date.parse(a.data.publishedAt));
}

/** Park edilenler dahil TÜM yazılar — yalnızca rota üretimi için. */
export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection("posts");
  return posts.sort(
    (a, b) => Date.parse(b.data.publishedAt) - Date.parse(a.data.publishedAt),
  );
}

export async function getPages(): Promise<Page[]> {
  return getCollection("pages");
}

/**
 * Yalnızca görünür yazısı olan kategoriler.
 *
 * `postCount` kaynak sistemden gelir ve park edilen/kaldırılan yazıları da
 * sayar. Bu yüzden gerçek görünür sayı yazılardan yeniden hesaplanır —
 * aksi hâlde kategori sayfası "120 yazı" der ama 0 yazı listelerdi.
 */
export async function getVisibleCategories(): Promise<Category[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const category of post.data.categories) {
      counts.set(category.slug, (counts.get(category.slug) ?? 0) + 1);
    }
  }
  return (taxonomy.categories as Category[])
    .map((category) => ({ ...category, postCount: counts.get(category.slug) ?? 0 }))
    .filter((category) => category.postCount > 0)
    .sort((a, b) => b.postCount - a.postCount);
}

/**
 * Rota üretimi için TÜM kategoriler — görünür yazısı kalmayanlar dahil.
 *
 * "Yaşam" gibi tüm yazıları park edilen kategorilerin sayfası üretilmeye
 * devam eder; aksi hâlde indeksli olan `/kategori/yasam` URL'i 404 verirdi.
 * Bu sayfalar `noindex` taşır ve listelerde görünmez (ADR-018).
 */
export async function getRoutableCategories(): Promise<Category[]> {
  const posts = await getPosts();
  const counts = new Map<string, number>();
  for (const post of posts) {
    for (const category of post.data.categories) {
      counts.set(category.slug, (counts.get(category.slug) ?? 0) + 1);
    }
  }
  return (taxonomy.categories as Category[])
    .map((category) => ({ ...category, postCount: counts.get(category.slug) ?? 0 }))
    .filter((category) => category.postCount > 0 || category.legacyUrl)
    .sort((a, b) => b.postCount - a.postCount);
}

/**
 * Kategori yolu.
 *
 * Kaynak sistemde kategoriler hiyerarşik: alt kategoriler
 * `/kategori/{üst}/{alt}` yolunda yayınlanıyor. Bu yüzden yol kurgulanmaz,
 * göç sırasında kaydedilen gerçek `legacyUrl` kullanılır (ADR-004).
 */
export function categoryPath(category: Pick<Category, "slug" | "legacyUrl">): string {
  return category.legacyUrl || categoryPathBySlug(category.slug);
}

const CATEGORY_URL_BY_SLUG = new Map(
  (taxonomy.categories as Category[]).map((category) => [category.slug, category.legacyUrl]),
);

/**
 * Yazı üzerindeki kategori referansları yalnızca slug taşır; gerçek yol
 * taksonomi tablosundan çözülür. Böylece hiyerarşik kategori yolları
 * (`/kategori/üst/alt`) yazı sayfalarında da doğru kalır.
 */
export function categoryPathBySlug(slug: string): string {
  return CATEGORY_URL_BY_SLUG.get(slug) ?? `/kategori/${slug}`;
}

const DATE_FORMAT = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function formatDate(value: string): string {
  return DATE_FORMAT.format(new Date(value));
}

export function isoDate(value: string): string {
  return new Date(value).toISOString();
}

/**
 * Yazı özeti. Kaynak özet boşsa gövdeden türetilir — içerik yeniden
 * yazılmaz, yalnızca kırpılır ve kırpıldığı belli edilir.
 */
export function summarize(post: Post, limit = 180): string {
  const text = post.data.excerpt?.trim();
  if (text) return text.length > limit ? text.slice(0, limit).trimEnd() + "…" : text;
  const plain = post.data.contentHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > limit ? plain.slice(0, limit).trimEnd() + "…" : plain;
}

/** Aynı kategoriden, kendisi hariç en yeni yazılar. */
export function relatedPosts(post: Post, all: Post[], count = 4): Post[] {
  const ids = new Set(post.data.categories.map((category) => category.legacyId));
  return all
    .filter(
      (candidate) =>
        candidate.data.legacyId !== post.data.legacyId &&
        candidate.data.categories.some((category) => ids.has(category.legacyId)),
    )
    .slice(0, count);
}
