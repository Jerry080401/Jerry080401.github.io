import type { Post } from "./posts";

export interface NoteTopic {
  name: string;
  slug: string;
  posts: Post[];
}

export function noteTopicPath(slug: string): string {
  return `/notes/${slug}/`;
}

export function groupNoteTopics(posts: Post[]): NoteTopic[] {
  const grouped = new Map<string, NoteTopic>();

  for (const post of posts) {
    if (post.data.category !== "學習筆記") continue;

    const topic = post.data.topic;
    if (!topic) throw new Error(`Learning note "${post.data.title}" is missing a topic.`);

    const current = grouped.get(topic.slug);
    if (current && current.name !== topic.name) {
      throw new Error(`Posts using the same topic slug "${topic.slug}" must use the same topic name.`);
    }

    if (current) current.posts.push(post);
    else grouped.set(topic.slug, { ...topic, posts: [post] });
  }

  for (const topic of grouped.values()) {
    topic.posts.sort((left, right) => right.data.published.getTime() - left.data.published.getTime());
  }

  return [...grouped.values()].sort((left, right) => {
    const dateDifference = right.posts[0].data.published.getTime() - left.posts[0].data.published.getTime();
    return dateDifference || left.name.localeCompare(right.name, "zh-Hant");
  });
}