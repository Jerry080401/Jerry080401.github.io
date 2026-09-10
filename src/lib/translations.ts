import { localePath, locales, type Locale } from "../i18n.ts";
import { noteTopicPath } from "./note-topics.ts";
import type { Post } from "./posts";

export type LanguagePaths = Partial<Record<Locale, string>>;

const translatedPostPath = (post: Post) =>
  localePath(post.data.locale, `/posts/${post.id.replace(/\.md$/, "")}/`);

export function getPostLanguagePaths(post: Post, posts: Post[]): LanguagePaths {
  if (!post.data.translationKey) return { [post.data.locale]: translatedPostPath(post) };

  const translations = posts.filter((candidate) => candidate.data.translationKey === post.data.translationKey);
  const seenLocales = new Set<Locale>();
  for (const translation of translations) {
    if (seenLocales.has(translation.data.locale)) {
      throw new Error(`Posts using the same translation key "${post.data.translationKey}" must use different locales.`);
    }
    seenLocales.add(translation.data.locale);
  }

  const paths: LanguagePaths = {};
  for (const locale of locales) {
    const translation = translations.find((candidate) => candidate.data.locale === locale);
    if (translation) paths[locale] = translatedPostPath(translation);
  }
  return paths;
}

export function getTopicLanguagePaths(slug: string, posts: Post[]): LanguagePaths {
  const paths: LanguagePaths = {};
  for (const locale of locales) {
    const exists = posts.some((post) =>
      post.data.locale === locale &&
      post.data.category === "學習筆記" &&
      post.data.topic?.slug === slug
    );
    if (exists) paths[locale] = localePath(locale, noteTopicPath(slug));
  }
  return paths;
}
