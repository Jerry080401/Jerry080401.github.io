import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";

async function source(path) {
  return readFile(new URL(`../${path}`, import.meta.url), "utf8");
}

test("site identity and navigation are independent", async () => {
  const config = await source("src/config.ts");
  assert.match(config, /Jerry's Notes/);
  assert.match(config, /學習筆記與文章/);
  for (const path of ["/", "/articles/", "/notes/", "/about/"]) {
    assert.match(config, new RegExp(path.replaceAll("/", "\\/")));
  }
  assert.doesNotMatch(config, /archive|歸檔/);
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
  assert.match(postList, /還沒有內容/);
});

test("content lanes have headings and empty states", async () => {
  for (const [path, heading] of [
    ["src/pages/articles.astro", "文章"],
    ["src/pages/notes.astro", "學習筆記"],
  ]) {
    const page = await source(path);
    assert.match(page, new RegExp(`<h1[^>]*>${heading}</h1>`));
    assert.match(page, /PostList/);
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
  assert.match(layout, /lang="zh-Hant"/);
  assert.match(layout, /aria-label="主要導覽"/);
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
  const rss = await source("src/pages/rss.xml.ts");
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