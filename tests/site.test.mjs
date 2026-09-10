import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("site identity and navigation are independent", async () => {
  const config = await source("src/config.ts");
  const i18n = await source("src/i18n.ts");
  assert.match(config, /Jerry's Notes/);
  assert.match(i18n, /學習筆記與文章/);
  assert.match(i18n, /navHome/);
  assert.match(i18n, /navArticles/);
  assert.match(i18n, /navNotes/);
  assert.match(i18n, /navAbout/);
  assert.doesNotMatch(`${config}\n${i18n}`, /archive|歸檔/);
});

test("home omits undecided Japanese and kanji decorations", async () => {
  const home = await source("src/pages/index.astro");
  const postList = await source("src/components/PostList.astro");
  assert.doesNotMatch(home, /hero-mark|decorative-kanji|lang="ja"/);
  assert.match(home, /Jerry's Notes/);
  assert.match(home, /home-intro/);
  assert.doesNotMatch(home, /class="hero"/);
  assert.match(home, /最近更新/);
  assert.match(home, /PostList/);
  assert.match(postList, /homeEmptyTitle/);
});

test("content lanes have headings and empty states", async () => {
  for (const [path, heading, list] of [
    ["src/pages/articles.astro", "文章", "PostList"],
    ["src/pages/notes.astro", "學習筆記", "TopicList"],
  ]) {
    const page = await source(path);
    assert.match(page, new RegExp(`<h1[^>]*>${heading}</h1>`));
    assert.match(page, new RegExp(list));
  }
});

test("archive is removed from the site shell", async () => {
  const layout = await source("src/layouts/BaseLayout.astro");
  await assert.rejects(source("src/pages/archive.astro"), { code: "ENOENT" });
  assert.doesNotMatch(layout, /archive|歸檔/);
});

test("layout is semantic, themeable, and tracking-free", async () => {
  const layout = await source("src/layouts/BaseLayout.astro");
  await source("public/favicon.ico");
  assert.match(layout, /<html lang=\{locale\}>/);
  assert.match(layout, /copy\.mainNavLabel/);
  assert.match(layout, /const isHome/);
  assert.match(layout, /const sectionLabel = isHome \? ""/);
  assert.match(layout, /class="side-rail"/);
  assert.match(layout, /\{!isHome &&/);
  assert.match(layout, /class="utility-bar"/);
  assert.match(layout, /class="mobile-header"/);
  assert.match(layout, /rel="icon"/);
  assert.match(layout, /prefers-color-scheme/);
  assert.doesNotMatch(layout, /googletagmanager|clarity|analytics|<script[^>]+src=/i);
});

test("theme buttons initially describe switching away from resolved dark theme", async () => {
  const layout = await source("src/layouts/BaseLayout.astro");
  const script = layout.match(/<script>\s*([\s\S]*?)<\/script>/)?.[1]
    .replaceAll(/<(?:HTMLButtonElement|HTMLElement)>/g, "");
  assert.ok(script);

  const buttons = Array.from({ length: 2 }, () => ({
    label: "切換深色模式",
    dataset: { darkLabel: "切換深色模式", lightLabel: "切換淺色模式" },
    addEventListener() {},
    setAttribute(name, value) { if (name === "aria-label") this.label = value; },
  }));
  const document = {
    documentElement: { dataset: { theme: "dark" } },
    querySelector() { return null; },
    querySelectorAll(selector) { return selector === ".theme-button" ? buttons : []; },
    addEventListener() {},
  };

  runInNewContext(script, { document, localStorage: { setItem() {} } });
  assert.deepEqual(buttons.map(({ label }) => label), ["切換淺色模式", "切換淺色模式"]);
});

test("404 opts out of canonical indexing metadata", async () => {
  const layout = await source("src/layouts/BaseLayout.astro");
  const notFound = await source("src/pages/404.astro");

  assert.match(layout, /canonical\?: boolean/);
  assert.match(layout, /noindex\?: boolean/);
  assert.match(layout, /\{canonical && <link rel="canonical"/);
  assert.match(layout, /\{noindex && <meta name="robots" content="noindex"/);
  assert.match(notFound, /<BaseLayout title="找不到頁面" canonical=\{false\} noindex>/);
});

test("GitHub Pages build handles user and project sites", async () => {
  const config = await source("astro.config.mjs");
  const workflow = await source(".github/workflows/deploy.yml");
  assert.match(config, /GITHUB_REPOSITORY/);
  assert.match(config, /github\.io/);
  assert.match(workflow, /actions\/deploy-pages@[^\s]+ # v4/);
  assert.match(workflow, /main/);
});

test("deployment workflow scopes permissions to each job", async () => {
  const workflow = await source(".github/workflows/deploy.yml");
  const jobsIndex = workflow.indexOf("jobs:");
  const build = workflow.match(/^  build:\n([\s\S]*?)(?=^  deploy:)/m)?.[1] ?? "";
  const deploy = workflow.match(/^  deploy:\n([\s\S]*)/m)?.[1] ?? "";

  assert.doesNotMatch(workflow.slice(0, jobsIndex), /^permissions:/m);
  assert.match(build, /^    permissions:\n      contents: read$/m);
  assert.doesNotMatch(build, /pages: write|id-token: write/);
  assert.match(deploy, /^    permissions:\n      pages: write\n      id-token: write$/m);
  assert.doesNotMatch(deploy, /contents: read/);
});

test("deployment workflow pins actions to reviewed commits", async () => {
  const workflow = await source(".github/workflows/deploy.yml");
  for (const [action, sha, version] of [
    ["actions/checkout", "d23441a48e516b6c34aea4fa41551a30e30af803", "v6"],
    ["withastro/action", "15aa0a5a1e067940253e3b259413ab2ae882a740", "v5"],
    ["actions/deploy-pages", "d6db90164ac5ed86f2b6aed7e0febac5b3c0c03e", "v4"],
  ]) {
    assert.match(workflow, new RegExp(`uses: ${action.replace("/", "\\/")}@${sha}\\s+# ${version}$`, "m"));
  }
});

test("RSS escapes XML-significant generated post links and guids", async () => {
  const { escapeXml } = await import("../src/lib/xml.ts");
  const rss = await source("src/lib/rss.ts");
  const link = new URL("/posts/amp&ersand/", "https://jerry080401.github.io").href;

  assert.equal(escapeXml(link), "https://jerry080401.github.io/posts/amp&amp;ersand/");
  assert.match(rss, /<link>\$\{escapeXml\(link\)\}<\/link><guid>\$\{escapeXml\(link\)\}<\/guid>/);
});

test("package metadata uses only Astro at runtime", async () => {
  const pkg = JSON.parse(await source("package.json"));
  assert.equal(pkg.name, "jerrys-notes");
  assert.deepEqual(Object.keys(pkg.dependencies), ["astro"]);
});

test("C3 separates the side navigation from page utilities", async () => {
  const css = await source("src/styles/global.css");
  assert.match(css, /--muted:\s*#5e5952/);
  assert.match(css, /\.app-shell\s*\{[\s\S]*grid-template-columns:\s*11\.5rem minmax\(0, 1fr\)/);
  assert.match(css, /\.home-intro\s*\{/);
  assert.match(css, /@media[\s\S]*max-width:\s*760px[\s\S]*\.side-rail,[\s\S]*\.utility-bar\s*\{[\s\S]*display:\s*none/);
});

test("learning notes are grouped into stable topic pages", async () => {
  const { groupNoteTopics, noteTopicPath } = await import("../src/lib/note-topics.ts");
  const makePost = ({ title, published, category = "學習筆記", topic }) => ({
    id: `${title}.md`,
    data: { title, published: new Date(published), category, topic },
  });
  const posts = [
    makePost({ title: "第二篇", published: "2026-03-02", topic: { name: "瀏覽器安全", slug: "browser-security" } }),
    makePost({ title: "唯一一篇", published: "2026-03-01", topic: { name: "Python", slug: "python" } }),
    makePost({ title: "第一篇", published: "2026-02-01", topic: { name: "瀏覽器安全", slug: "browser-security" } }),
    makePost({ title: "一般文章", published: "2026-04-01", category: "文章" }),
  ];

  const topics = groupNoteTopics(posts);
  assert.deepEqual(
    topics.map(({ name, slug, posts }) => ({ name, slug, titles: posts.map(({ data }) => data.title) })),
    [
      { name: "瀏覽器安全", slug: "browser-security", titles: ["第二篇", "第一篇"] },
      { name: "Python", slug: "python", titles: ["唯一一篇"] },
    ],
  );
  assert.equal(noteTopicPath("browser-security"), "/notes/browser-security/");
});

test("learning-note topics are required and cannot disagree on a slug", async () => {
  const { groupNoteTopics } = await import("../src/lib/note-topics.ts");
  const missing = { id: "missing.md", data: { title: "沒有主題", published: new Date(), category: "學習筆記" } };
  assert.throws(() => groupNoteTopics([missing]), /missing a topic/i);

  const conflicting = [
    { id: "one.md", data: { title: "一", published: new Date(), category: "學習筆記", topic: { name: "名稱一", slug: "same" } } },
    { id: "two.md", data: { title: "二", published: new Date(), category: "學習筆記", topic: { name: "名稱二", slug: "same" } } },
  ];
  assert.throws(() => groupNoteTopics(conflicting), /same topic slug/i);

  const config = await source("src/content.config.ts");
  assert.match(config, /topicSchema/);
  assert.match(config, /category === "學習筆記"/);
  assert.match(config, /superRefine/);
});

test("learning notes index lists topics before their posts", async () => {
  const notes = await source("src/pages/notes.astro");
  const topicPage = await source("src/pages/notes/[topic].astro");
  const topicList = await source("src/components/TopicList.astro");

  assert.match(notes, /TopicList/);
  assert.doesNotMatch(notes, /<PostList/);
  assert.match(topicPage, /<PostList/);
  assert.match(topicPage, /所有主題/);
  assert.match(topicList, /topic-list/);
  assert.match(topicList, /copy\.oneNote/);
});

test("post excerpts stay in the title column", async () => {
  const postList = await source("src/components/PostList.astro");
  assert.match(postList, /class="post-copy"[\s\S]*<h2>[\s\S]*post\.data\.description/);
});

test("i18n preserves Chinese URLs and prefixes English, Japanese, and German", async () => {
  const { defaultLocale, localePath, locales, routeLocales } = await import("../src/i18n.ts");
  assert.equal(defaultLocale, "zh-Hant");
  assert.deepEqual(locales, ["zh-Hant", "en", "ja", "de"]);
  assert.deepEqual(routeLocales, ["en", "ja", "de"]);
  assert.equal(localePath("zh-Hant", "/about/"), "/about/");
  assert.equal(localePath("en", "/about/"), "/en/about/");
  assert.equal(localePath("ja", "/"), "/ja/");
  assert.equal(localePath("de", "/notes/browser-security/"), "/de/notes/browser-security/");
});

test("all locales expose the complete interface message catalog", async () => {
  const { locales, messages } = await import("../src/i18n.ts");
  const required = [
    "siteSubtitle", "siteDescription", "navHome", "navArticles", "navNotes", "navAbout",
    "skipToContent", "openMenu", "closeMenu", "switchDark", "switchLight", "languageLabel",
    "recentUpdates", "homeEmptyTitle", "articlesIntro", "notesIntro", "noTopicsTitle",
    "latestUpdate", "oneNote", "manyNotes", "allTopics", "aboutTitle", "notFoundTitle", "returnHome",
  ];
  for (const locale of locales) {
    for (const key of required) assert.equal(typeof messages[locale][key], "string", `${locale}.${key}`);
    assert.match(messages[locale].manyNotes, /\{count\}/);
  }
});

test("localized static, topic, post, and RSS routes exist", async () => {
  for (const path of [
    "src/pages/[lang]/index.astro",
    "src/pages/[lang]/articles.astro",
    "src/pages/[lang]/notes.astro",
    "src/pages/[lang]/about.astro",
    "src/pages/[lang]/404.astro",
    "src/pages/[lang]/notes/[topic].astro",
    "src/pages/[lang]/posts/[...slug].astro",
    "src/pages/[lang]/rss.xml.ts",
  ]) {
    const page = await source(path);
    assert.match(page, /getStaticPaths/);
  }
});

test("layout localizes navigation, controls, feeds, and alternate-language links", async () => {
  const layout = await source("src/layouts/BaseLayout.astro");
  assert.match(layout, /locale\?: Locale/);
  assert.match(layout, /<html lang=\{locale\}/);
  assert.match(layout, /hreflang/);
  assert.match(layout, /LanguagePicker/);
  assert.match(layout, /messages\[locale\]/);
  assert.match(layout, /localePath/);
  assert.doesNotMatch(layout, />跳至主要內容</);
});

test("content entries carry locale and translation identity", async () => {
  const config = await source("src/content.config.ts");
  const posts = await source("src/lib/posts.ts");
  assert.match(config, /locale:\s*z\.enum\(\["zh-Hant", "en", "ja", "de"\]\)/);
  assert.match(config, /translationKey:\s*z\.string\(\)\.optional\(\)/);
  assert.match(config, /locale !== "zh-Hant"[\s\S]*!data\.translationKey/);
  assert.match(posts, /getPublishedPosts\(locale/);
  assert.match(posts, /localePath\(post\.data\.locale/);
});

test("content language links include only translations that exist", async () => {
  const { getPostLanguagePaths, getTopicLanguagePaths } = await import("../src/lib/translations.ts");
  const makePost = (id, locale, translationKey, topic) => ({
    id,
    data: { title: id, locale, translationKey, topic, category: topic ? "學習筆記" : "文章", published: new Date(), tags: [] },
  });
  const zh = makePost("guide-zh", "zh-Hant", "guide", undefined);
  const en = makePost("guide-en", "en", "guide", undefined);
  const unrelated = makePost("other-ja", "ja", "other", undefined);
  assert.deepEqual(getPostLanguagePaths(zh, [zh, en, unrelated]), {
    "zh-Hant": "/posts/guide-zh/",
    en: "/en/posts/guide-en/",
  });
  const duplicateEnglish = makePost("guide-en-duplicate", "en", "guide", undefined);
  assert.throws(() => getPostLanguagePaths(zh, [zh, en, duplicateEnglish]), /same translation key/i);

  const topicPosts = [
    makePost("note-zh", "zh-Hant", "note", { name: "安全", slug: "security" }),
    makePost("note-de", "de", "note", { name: "Sicherheit", slug: "security" }),
  ];
  assert.deepEqual(getTopicLanguagePaths("security", topicPosts), {
    "zh-Hant": "/notes/security/",
    de: "/de/notes/security/",
  });
});

test("language picker uses a desktop popover and mobile inline disclosure", async () => {
  const layout = await source("src/layouts/BaseLayout.astro");
  const picker = await source("src/components/LanguagePicker.astro");
  const css = await source("src/styles/global.css");

  assert.match(layout, /LanguagePicker/);
  assert.match(layout, /mode="desktop"/);
  assert.match(layout, /mode="mobile"/);
  assert.doesNotMatch(layout, /class="language-switcher"/);
  assert.match(picker, /<details/);
  assert.match(picker, /<summary/);
  assert.match(picker, /availableLocales\.length > 1/);
  assert.match(picker, /aria-current="page"/);
  assert.match(picker, /role="group"/);
  assert.match(picker, /aria-label=\{copy\.languageLabel\}/);
  assert.match(picker, /<ul class="language-options">/);
  assert.match(picker, /<li>/);
  assert.doesNotMatch(picker, /role="list"/);
  assert.doesNotMatch(picker, /<svg/);
  assert.match(picker, /class="language-chevron"/);
  assert.match(picker, /language-chevron--closed[^>]*>↓</);
  assert.match(picker, /language-chevron--open[^>]*>↑</);
  assert.doesNotMatch(css, /\.language-picker summary::after/);
  assert.match(css, /\.language-picker--desktop[\s\S]*\.language-options[\s\S]*position:\s*absolute[\s\S]*bottom:/);
  assert.match(css, /\.language-picker--mobile[\s\S]*\.language-options/);
});

test("language picker is frameless and its options rise into view", async () => {
  const css = await source("src/styles/global.css");

  assert.match(css, /\.language-picker summary\s*\{[^}]*border:\s*0;/);
  assert.match(css, /\.language-picker--desktop details\s*\{[^}]*position:\s*static;/);
  assert.match(css, /\.language-options\s*\{[^}]*border:\s*0;[^}]*background:\s*transparent;/);
  assert.match(css, /\.language-picker details\[open\] \.language-options > li\s*\{[^}]*animation:\s*language-option-rise/);
  assert.match(css, /\.language-options > li:nth-child\(2\)\s*\{[^}]*animation-delay:/);
  assert.match(css, /@keyframes language-option-rise[\s\S]*opacity:\s*0;[\s\S]*translateY\(0\.5rem\)[\s\S]*opacity:\s*1;[\s\S]*translateY\(0\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("language options pop out from the trigger before settling", async () => {
  const css = await source("src/styles/global.css");

  assert.match(css, /\.language-picker details\[open\] \.language-options\s*\{[^}]*animation:\s*language-menu-pop\s+320ms/);
  assert.match(css, /@keyframes language-menu-pop[\s\S]*max-height:\s*0;[\s\S]*translateY\(0\.75rem\) scale\(0\.96\)[\s\S]*max-height:\s*12rem;[\s\S]*translateY\(-0\.125rem\) scale\(1\.015\)[\s\S]*translateY\(0\) scale\(1\)/);
  assert.match(css, /transform-origin:\s*bottom left/);
});

test("language options enter one at a time in a visible sequence", async () => {
  const css = await source("src/styles/global.css");

  assert.match(css, /\.language-picker details\[open\] \.language-options > li\s*\{[^}]*animation:\s*language-option-rise 260ms[^}]*both;[^}]*animation-delay:\s*40ms;/);
  assert.match(css, /li:nth-child\(2\)\s*\{[^}]*animation-delay:\s*130ms;/);
  assert.match(css, /li:nth-child\(3\)\s*\{[^}]*animation-delay:\s*220ms;/);
  assert.match(css, /li:nth-child\(4\)\s*\{[^}]*animation-delay:\s*310ms;/);
  const menuAnimation = css.match(/@keyframes language-menu-pop\s*\{([\s\S]*?)\n\}\n\n\.language-options >/);
  assert.ok(menuAnimation);
  assert.doesNotMatch(menuAnimation[1], /opacity:/);
});

test("reduced motion removes the stagger delay", async () => {
  const css = await source("src/styles/global.css");

  assert.match(css, /@media \(prefers-reduced-motion: reduce\)[\s\S]*animation-delay:\s*0ms !important;/);
});

test("mobile navigation keeps language links available without JavaScript", async () => {
  const layout = await source("src/layouts/BaseLayout.astro");
  const css = await source("src/styles/global.css");

  assert.match(layout, /<noscript>[\s\S]*class="mobile-noscript-nav"/);
  assert.match(layout, /mobile-noscript-nav[\s\S]*<LanguagePicker[^>]+mode="mobile"/);
  assert.match(css, /\.mobile-noscript-nav\s*\{[\s\S]*display:\s*none/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*\.mobile-noscript-nav\s*\{[\s\S]*display:\s*grid/);
});