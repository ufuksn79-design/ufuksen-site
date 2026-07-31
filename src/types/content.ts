/**
 * Hedef içerik modeli.
 *
 * Framework'ten bağımsızdır (ADR-008 kesinleşmedi). Alanlar T-001/T-002'de
 * kaynak WordPress sisteminden ölçülen gerçek veriye göre tanımlanmıştır;
 * varsayım üzerine alan eklenmemiştir.
 *
 * Kaynak: docs/inventory/REPORT.md, docs/inventory/url-map.csv
 */

/** ISO 8601 tarih-saat, kaynak sistemin yerel saatinde (WordPress `date`). */
export type IsoDateTime = string;

/** Kök göreli yol; her zaman `/` ile başlar. Örn. `/sketchup-kurs.html` */
export type UrlPath = string;

/** Migration doğrulaması için içerik gövdesinin SHA-256 özeti. */
export type Checksum = string;

/**
 * Yayın durumu. Kaynak sistemde public REST yalnızca `publish` döndürür;
 * taslak/özel içerik export aşamasında ortaya çıkabilir.
 */
export type ContentStatus = "publish" | "draft" | "private" | "pending";

/** URL eşleme tablosundaki eylem. `docs/inventory/url-map.csv` ile aynı sözlük. */
export type UrlAction = "keep" | "redirect" | "decide";

/** Eski URL → yeni URL eşlemesi. Kaynak: `scripts/wordpress/url-map.py` */
export interface UrlMapping {
  legacyUrl: UrlPath;
  /** WordPress post/term ID. Taksonomi ve ana sayfa için boş olabilir. */
  legacyId: number | null;
  type: "home" | "post" | "post-amp" | "page" | "category" | "tag";
  /** `decide` eyleminde hedef henüz belirlenmemiştir. */
  targetUrl: UrlPath | null;
  action: UrlAction;
  note: string;
}

/** Medya öğesi. Kaynakta 795 kayıt; tamamı kendi domaininde barındırılıyor. */
export interface MediaAsset {
  legacyId: number;
  /** Kaynak sistemdeki mutlak URL. */
  legacyUrl: string;
  /** Yeni sistemdeki yol. İndirme başarısız olursa `null` bırakılır, sessizce atlanmaz. */
  localPath: string | null;
  alt: string;
  width: number | null;
  height: number | null;
  mimeType: string;
  checksum: Checksum | null;
  /** İndirme başarısızsa nedeni; hata raporuna girer. */
  error: string | null;
}

/**
 * SEO alanları.
 *
 * Ölçülen erişilebilirlik (T-002):
 * - REST `meta`: yalnızca `rank_math_description` ve `rank_math_focus_keyword`
 * - Sayfa `<head>`: title, description, canonical, Open Graph, JSON-LD
 * - WXR export: tam `rank_math_*` postmeta (birincil kaynak)
 */
export interface SeoFields {
  title: string | null;
  description: string | null;
  focusKeyword: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  /** Kaynakta üretilen JSON-LD tipleri; yeni sistemde yeniden üretilir. */
  schemaTypes: string[];
}

export interface Taxonomy {
  legacyId: number;
  name: string;
  slug: string;
  legacyUrl: UrlPath;
  postCount: number;
  description: string | null;
}

export interface Author {
  legacyId: number;
  name: string;
  slug: string;
  /**
   * Co-Authors Plus `guest-author` kaydından mı geliyor?
   * Kaynakta yazılar `coauthors` alanı taşıyor.
   */
  isGuest: boolean;
}

/** Blog yazısı. Kaynakta 457 kayıt. */
export interface Post {
  legacyId: number;
  slug: string;
  /** ADR-007 gereği `/{slug}.html` biçimi korunur. */
  legacyUrl: UrlPath;
  url: UrlPath;
  title: string;
  excerpt: string;
  /** Sanitize edilmiş HTML. İçerik asla özetlenmez veya yeniden yazılmaz. */
  contentHtml: string;
  publishedAt: IsoDateTime;
  modifiedAt: IsoDateTime;
  author: Author;
  categories: Taxonomy[];
  tags: Taxonomy[];
  featuredImage: MediaAsset | null;
  /** Gövdede geçen tüm medya; yeniden barındırma kapsamı. */
  inlineMedia: MediaAsset[];
  /** Gövdedeki iframe gömüleri. Ölçüm: ağırlıklı YouTube, az sayıda Vidyard. */
  embeds: Embed[];
  seo: SeoFields;
  status: ContentStatus;
  /** Dakika cinsinden tahmini okuma süresi; gövdeden hesaplanır. */
  readingMinutes: number;
  /** Kaynak/hedef eşleşmesini doğrulamak için (ADR-006). */
  migrationChecksum: Checksum;
}

export interface Embed {
  provider: "youtube" | "vidyard" | "other";
  /** Sağlayıcıdaki video/kaynak kimliği; çözülemezse `null`. */
  externalId: string | null;
  originalSrc: string;
  title: string | null;
}

/** İçerik sayfası. Kaynakta 16 kayıt (ana sayfa dahil). */
export interface Page {
  legacyId: number;
  slug: string;
  legacyUrl: UrlPath;
  url: UrlPath;
  title: string;
  contentHtml: string;
  publishedAt: IsoDateTime;
  modifiedAt: IsoDateTime;
  inlineMedia: MediaAsset[];
  embeds: Embed[];
  seo: SeoFields;
  status: ContentStatus;
  migrationChecksum: Checksum;
}

/**
 * Aşağıdaki tipler yeni sitede tanıtılacak, WordPress'te karşılığı bulunmayan
 * içerik türleridir. Kaynak sistemde ayrı post type olarak tutulmadıkları için
 * migration kapsamında değil, elle girilecek içerik olarak işaretlenmiştir.
 */

export interface Project {
  slug: string;
  title: string;
  summary: string;
  description: string;
  type: "visualization" | "tool" | "video" | "media";
  technologies: string[];
  coverImage: MediaAsset | null;
  gallery: MediaAsset[];
  externalUrl: string | null;
  videoUrl: string | null;
  featured: boolean;
  order: number;
  /** Gerçek bilgiyle doldurulana kadar `true`; placeholder yayınlanamaz. */
  isPlaceholder: boolean;
}

export interface Plugin {
  slug: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  version: string;
  /** Desteklenen SketchUp sürümleri gibi uyumluluk notları. */
  compatibility: string[];
  features: string[];
  screenshots: MediaAsset[];
  demoVideo: string | null;
  purchaseContact: string | null;
  status: "active" | "beta" | "deprecated";
  featured: boolean;
  isPlaceholder: boolean;
}

export interface Achievement {
  title: string;
  issuer: string;
  date: IsoDateTime;
  description: string;
  proofUrl: string | null;
  image: MediaAsset | null;
  isPlaceholder: boolean;
}

/** Migration çalışmasının doğrulama özeti (ADR-006). */
export interface MigrationReport {
  runAt: IsoDateTime;
  dryRun: boolean;
  source: { posts: number; pages: number; media: number; categories: number; tags: number };
  target: { posts: number; pages: number; media: number; categories: number; tags: number };
  /** Kaynak ve hedef adetleri birebir eşleşmiyorsa migration tamamlanmış sayılmaz. */
  countsMatch: boolean;
  checksumMismatches: Array<{ legacyId: number; expected: Checksum; actual: Checksum }>;
  mediaFailures: Array<{ legacyUrl: string; error: string }>;
  unresolvedLinks: Array<{ postId: number; href: string }>;
  errors: string[];
}
