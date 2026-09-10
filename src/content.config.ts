import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { glob } from "astro/loaders";

const topicSchema = z.object({
  name: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
});

const postSchema = z.object({
  title: z.string(),
  description: z.string().default(""),
  published: z.coerce.date(),
  updated: z.coerce.date().optional(),
  locale: z.enum(["zh-Hant", "en", "ja", "de"]).default("zh-Hant"),
  translationKey: z.string().optional(),
  category: z.enum(["文章", "學習筆記"]),
  topic: topicSchema.optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false)
}).superRefine((data, context) => {
  if (data.locale !== "zh-Hant" && !data.translationKey) {
    context.addIssue({
      code: "custom",
      path: ["translationKey"],
      message: "非中文內容必須指定 translationKey"
    });
  }
  if (data.category === "學習筆記" && !data.topic) {
    context.addIssue({
      code: "custom",
      path: ["topic"],
      message: "學習筆記必須指定 topic.name 與 topic.slug"
    });
  }
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/posts" }),
  schema: postSchema
});

export const collections = { posts };