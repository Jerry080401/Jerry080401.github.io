import { getCollection, type CollectionEntry } from "astro:content";
import { defaultLocale, localePath, type Locale } from "../i18n";

export type Post = CollectionEntry<"posts">;

export async function getPublishedPosts(locale: Locale = defaultLocale): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft && data.locale === locale);
  return posts.sort(
    (left, right) => right.data.published.getTime() - left.data.published.getTime()
  );
}

export async function getAllPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort(
    (left, right) => right.data.published.getTime() - left.data.published.getTime()
  );
}

export function postPath(post: Post): string {
  return localePath(post.data.locale, `/posts/${post.id.replace(/\.md$/, "")}/`);
}

export function formatDate(date: Date, locale: Locale = defaultLocale): string {
  const dateLocales: Record<Locale, string> = {
    "zh-Hant": "zh-TW",
    en: "en-US",
    ja: "ja-JP",
    de: "de-DE"
  };
  return new Intl.DateTimeFormat(dateLocales[locale], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}