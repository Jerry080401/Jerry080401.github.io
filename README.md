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
category: 文章 # 或「學習筆記」
tags: [標籤]
draft: false
---
```