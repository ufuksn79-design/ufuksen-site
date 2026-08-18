import { getPosts, type Post } from "./content";
import videoStatus from "../../docs/content/video-status.json";
import mediaSizes from "../content/media-dimensions.json";

/**
 * Arşivden türetilen keşif katmanı.
 *
 * Hiçbir veri uydurulmaz — hepsi göç edilmiş içerikten ölçülür:
 *   - videolar  : gövdedeki YouTube gömülülerinden (371 video, 208 yazı)
 *   - yazılımlar: başlık, kategori ve gövdede geçen ürün adlarından
 */

/* ------------------------------------------------------------------ */
/* Videolar                                                            */
/* ------------------------------------------------------------------ */

export interface VideoEntry {
  /** YouTube video kimliği. */
  id: string;
  /** Videoyu içeren yazının başlığı ve URL'i. */
  postTitle: string;
  postUrl: string;
  publishedAt: string;
  categories: string[];
}

/**
 * Yayında olmayan videolar.
 *
 * Arşivdeki 353 videonun 56'sı YouTube'da kaldırılmış veya gizli
 * (`scripts/wordpress/audit-videos.py` ile ölçüldü). Galeride küçük resmi
 * yüklenmeyen kırık kartlar oluşmaması için ayıklanırlar.
 *
 * Yazı gövdesindeki gömülü oynatıcıya DOKUNULMAZ — içerik değiştirilmez
 * (AGENTS.md §5). Yalnızca vitrin filtrelenir.
 */
const DEAD_VIDEOS = new Set(
  Object.entries(videoStatus.durum as Record<string, boolean>)
    .filter(([, alive]) => !alive)
    .map(([id]) => id),
);

/**
 * Arşivdeki yayında olan YouTube videoları, yeniden eskiye.
 * Aynı video birden fazla yazıda geçebilir; ilk (en yeni) kayıt tutulur.
 */
export async function getVideos(): Promise<VideoEntry[]> {
  const posts = await getPosts();
  const seen = new Set<string>();
  const videos: VideoEntry[] = [];

  for (const post of posts) {
    for (const embed of post.data.embeds) {
      if (embed.provider !== "youtube" || !embed.externalId) continue;
      if (DEAD_VIDEOS.has(embed.externalId)) continue;
      if (seen.has(embed.externalId)) continue;
      seen.add(embed.externalId);
      videos.push({
        id: embed.externalId,
        postTitle: post.data.title,
        postUrl: post.data.url,
        publishedAt: post.data.publishedAt,
        categories: post.data.categories.map((category) => category.name),
      });
    }
  }
  return videos;
}

/** YouTube küçük resmi. `hqdefault` her video için garanti mevcuttur. */
export function videoThumb(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function videoWatchUrl(id: string): string {
  return `https://www.youtube.com/watch?v=${id}`;
}

/* ------------------------------------------------------------------ */
/* Yazılım etiketleri                                                  */
/* ------------------------------------------------------------------ */

export interface SoftwareTag {
  slug: string;
  name: string;
  /** Eşleştirme kalıbı — ürün adının yazım varyantları. */
  pattern: RegExp;
  kind: "modelleme" | "render" | "gercek-zamanli" | "diger";
}

/**
 * Ürün listesi elle tanımlandı çünkü ürün adları serbest metinde geçiyor;
 * otomatik çıkarım yanlış pozitif üretirdi ("render" her yerde geçiyor).
 */
export const SOFTWARE: SoftwareTag[] = [
  { slug: "sketchup", name: "SketchUp", pattern: /sketch\s?up/i, kind: "modelleme" },
  { slug: "vray", name: "V-Ray", pattern: /v-?ray/i, kind: "render" },
  { slug: "d5-render", name: "D5 Render", pattern: /\bd5\b/i, kind: "gercek-zamanli" },
  { slug: "twinmotion", name: "Twinmotion", pattern: /twinmotion/i, kind: "gercek-zamanli" },
  { slug: "enscape", name: "Enscape", pattern: /enscape/i, kind: "gercek-zamanli" },
  { slug: "lumion", name: "Lumion", pattern: /lumion/i, kind: "gercek-zamanli" },
  { slug: "3ds-max", name: "3ds Max", pattern: /3ds\s?max/i, kind: "modelleme" },
  { slug: "blender", name: "Blender", pattern: /blender/i, kind: "modelleme" },
  { slug: "unreal-engine", name: "Unreal Engine", pattern: /unreal/i, kind: "gercek-zamanli" },
  { slug: "corona", name: "Corona Render", pattern: /corona/i, kind: "render" },
  { slug: "photoshop", name: "Photoshop", pattern: /photoshop/i, kind: "diger" },
  { slug: "revit", name: "Revit", pattern: /revit/i, kind: "diger" },
  { slug: "autocad", name: "AutoCAD", pattern: /autocad/i, kind: "diger" },
];

const BY_SLUG = new Map(SOFTWARE.map((item) => [item.slug, item]));

export function softwareBySlug(slug: string): SoftwareTag | undefined {
  return BY_SLUG.get(slug);
}

/**
 * Bir yazının hangi yazılımlarla ilgili olduğu.
 *
 * Başlık ve kategori adı güçlü sinyal; gövde yalnızca destekleyici olarak
 * kullanılır (uzun yazılarda yan cümlede geçen ürün adı etiket üretmesin diye
 * gövdede en az iki kez geçmesi aranır).
 */
export function softwareOf(post: Post): SoftwareTag[] {
  const strong = `${post.data.title} ${post.data.categories.map((c) => c.name).join(" ")}`;
  const body = post.data.contentHtml.replace(/<[^>]+>/g, " ");

  return SOFTWARE.filter((item) => {
    if (item.pattern.test(strong)) return true;
    const matches = body.match(new RegExp(item.pattern.source, "gi"));
    return (matches?.length ?? 0) >= 2;
  });
}

export interface SoftwareIndexEntry {
  tag: SoftwareTag;
  posts: Post[];
  videoCount: number;
}

/** Yazı sayısına göre azalan sıralı yazılım dizini. Boş etiketler elenir. */
export async function getSoftwareIndex(): Promise<SoftwareIndexEntry[]> {
  const posts = await getPosts();
  const buckets = new Map<string, Post[]>();

  for (const post of posts) {
    for (const tag of softwareOf(post)) {
      const list = buckets.get(tag.slug) ?? [];
      list.push(post);
      buckets.set(tag.slug, list);
    }
  }

  return SOFTWARE.map((tag) => {
    const list = buckets.get(tag.slug) ?? [];
    return {
      tag,
      posts: list,
      videoCount: list.reduce(
        (total, post) =>
          total + post.data.embeds.filter((embed) => embed.provider === "youtube").length,
        0,
      ),
    };
  })
    .filter((entry) => entry.posts.length > 0)
    .sort((a, b) => b.posts.length - a.posts.length);
}

/* ------------------------------------------------------------------ */
/* İçindekiler                                                         */
/* ------------------------------------------------------------------ */

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

/** Türkçe karakterleri koruyan, URL'de güvenli kimlik üretir. */
function slugifyHeading(text: string, index: number): string {
  const base = text
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ğ/g, "g")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return base ? `${base}-${index}` : `bolum-${index}`;
}

/**
 * Gövdedeki h2/h3 başlıklarından içindekiler üretir ve başlıklara `id` ekler.
 *
 * Göç edilen WordPress HTML'inde başlıkların id'si yok; bağlantı verebilmek
 * için burada ekleniyor. İçerik metni değiştirilmiyor, yalnızca öznitelik.
 */
/**
 * JSON'dan gelen diziler `number[]` olarak tiplenir; ölçüm dosyası her zaman
 * iki elemanlı (genişlik, yükseklik) yazar. `unknown` üzerinden dönüştürülür.
 */
const MEDIA_SIZES = mediaSizes as unknown as Record<string, [number, number]>;

/**
 * Gövdedeki görsellere ölçülen `width`/`height` yazar.
 *
 * Göç eden WordPress HTML'inde boyut yok; tarayıcı görsel inene kadar yer
 * ayıramıyor ve sayfa zıplıyor (CLS). Boyutlar `measure-media.mjs` ile
 * dosyalardan ölçüldü — tahmin değil.
 *
 * Zaten boyutu olan etiketlere dokunulmaz.
 */
function addImageDimensions(html: string): string {
  return html.replace(/<img[^>]*>/gi, (tag) => {
    if (/\swidth=/i.test(tag) && /\sheight=/i.test(tag)) return tag;
    const src = tag.match(/\ssrc=["']([^"']+)["']/i)?.[1];
    if (!src) return tag;
    const size = MEDIA_SIZES[decodeURIComponent(src)] ?? MEDIA_SIZES[src];
    if (!size) return tag;
    return tag.replace(/<img/i, `<img width="${size[0]}" height="${size[1]}"`);
  });
}

/**
 * Gövdedeki `<h1>` etiketlerini `<h2>`ye indirir.
 *
 * Sayfa başlığı zaten `<h1>`; gövdede ikinci bir `<h1>` başlık hiyerarşisini
 * bozuyor ve arama motoruna belirsiz sinyal veriyor. 10 yazıda ölçüldü.
 * Metin değişmez, yalnızca etiket seviyesi düşer.
 */
function demoteBodyH1(html: string): string {
  return html.replace(/<h1(\s[^>]*)?>/gi, (_m, attrs) => `<h2${attrs ?? ""}>`).replace(/<\/h1>/gi, "</h2>");
}

/**
 * Sayfa gövdeleri için: içindekiler üretilmez ama görsel boyutu ve başlık
 * hiyerarşisi düzeltmesi yazılarla aynı şekilde uygulanır.
 */
export function prepareBody(html: string): string {
  return addImageDimensions(demoteBodyH1(html));
}

export function buildToc(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  let index = 0;
  html = addImageDimensions(demoteBodyH1(html));

  const out = html.replace(
    /<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi,
    (match, tag: string, attrs: string, inner: string) => {
      const text = inner.replace(/<[^>]+>/g, "").trim();
      if (!text) return match;
      index += 1;
      // Zaten id varsa ona saygı göster
      const existing = attrs.match(/\sid=["']([^"']+)["']/i);
      const id = existing ? existing[1] : slugifyHeading(text, index);
      toc.push({ id, text, level: tag.toLowerCase() === "h2" ? 2 : 3 });
      return existing
        ? match
        : `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
    },
  );

  return { html: out, toc };
}
