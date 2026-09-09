import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("posts", ({ data }) => !data.draft);
  return posts.sort(
    (left, right) => right.data.published.getTime() - left.data.published.getTime()
  );
}

export function postPath(post: Post): string {
  return `/posts/${post.id.replace(/\.md$/, "")}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(date);
}