import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts, summarize } from "../lib/content";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: "Ufuk Şen — 3D Görselleştirme ve Render",
    description: "SketchUp, Twinmotion, D5 Render ve Enscape üzerine yazılar.",
    site: context.site ?? "https://www.ufuksen.com",
    customData: "<language>tr</language>",
    items: posts.slice(0, 50).map((post) => ({
      title: post.data.title,
      link: post.data.url,
      pubDate: new Date(post.data.publishedAt),
      description: summarize(post, 300),
    })),
  });
}
