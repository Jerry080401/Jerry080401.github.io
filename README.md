# Jerry's Notes

Jerry 的個人部落格，用來整理學習筆記與文章。

## 開發

```bash
pnpm install
pnpm dev
```

## 驗證

```bash
pnpm test
pnpm check
pnpm build
```

## 新增內容

在 `src/content/posts/` 新增 Markdown 檔案，frontmatter 範例：

```yaml
---
title: 標題
description: 摘要
published: 2026-09-09
locale: zh-Hant # zh-Hant、en、ja 或 de
translationKey: example-post # 翻譯版本共用同一個值
category: 文章 # 或「學習筆記」
tags: [標籤]
draft: false
---
```

英文、日文與德文文章使用相同的 `translationKey`，並分別設定 `locale: en`、`locale: ja` 或 `locale: de`。語言切換只會顯示實際存在的翻譯版本；同一學習主題的翻譯也應共用相同的 `topic.slug`。

學習筆記另需指定主題；同一個 `topic.slug` 可以包含一篇或多篇筆記：

```yaml
category: 學習筆記
topic:
  name: 瀏覽器安全
  slug: browser-security
```