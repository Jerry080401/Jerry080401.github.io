import { site } from "../config";
import { getPublishedPosts, postPath } from "../lib/posts";
import { absoluteUrl } from "../lib/url";
import { escapeXml } from "../lib/xml";

export async function GET() {
  const posts = await getPublishedPosts();
  const items = posts.map((post) => {
    const link = absoluteUrl(postPath(post)).href;
    return `<item><title>${escapeXml(post.data.title)}</title><link>${escapeXml(link)}</link><guid>${escapeXml(link)}</guid><pubDate>${post.data.published.toUTCString()}</pubDate><description>${escapeXml(post.data.description)}</description></item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(site.title)}</title><link>${escapeXml(absoluteUrl("/").href)}</link><description>${escapeXml(site.description)}</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}