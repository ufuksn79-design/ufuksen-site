import type { APIContext } from "astro";
import { getPosts, summarize } from "../lib/content";

/** İstemci tarafı arama için hafif indeks. Gövde metni dahil edilmez. */
export async function GET(_context: APIContext) {
  const posts = await getPosts();
  const index = posts.map((post) => ({
    t: post.data.title,
    u: post.data.url,
    d: post.data.publishedAt.slice(0, 10),
    c: post.data.categories.map((category) => category.name).join(", "),
    s: summarize(post, 140),
  }));
  return new Response(JSON.stringify(index), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
