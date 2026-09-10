import { site } from "../config";
import { localePath, messages, type Locale } from "../i18n";
import { getPublishedPosts, postPath } from "./posts";
import { absoluteUrl } from "./url";
import { escapeXml } from "./xml";

export async function createRssResponse(locale: Locale): Promise<Response> {
  const copy = messages[locale];
  const posts = await getPublishedPosts(locale);
  const items = posts.map((post) => {
    const link = absoluteUrl(postPath(post)).href;
    return `<item><title>${escapeXml(post.data.title)}</title><link>${escapeXml(link)}</link><guid>${escapeXml(link)}</guid><pubDate>${post.data.published.toUTCString()}</pubDate><description>${escapeXml(post.data.description)}</description></item>`;
  }).join("");

  const home = absoluteUrl(localePath(locale, "/")).href;
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(site.title)}</title><link>${escapeXml(home)}</link><description>${escapeXml(copy.siteDescription)}</description><language>${escapeXml(locale)}</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
