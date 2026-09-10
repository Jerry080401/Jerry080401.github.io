export const locales = ["zh-Hant", "en", "ja", "de"] as const;
export const routeLocales = ["en", "ja", "de"] as const;
export const defaultLocale = "zh-Hant" as const;

export type Locale = (typeof locales)[number];
export type RouteLocale = (typeof routeLocales)[number];

interface MessageCatalog {
  siteSubtitle: string;
  siteDescription: string;
  navHome: string;
  navArticles: string;
  navNotes: string;
  navAbout: string;
  skipToContent: string;
  openMenu: string;
  closeMenu: string;
  switchDark: string;
  switchLight: string;
  mainNavLabel: string;
  mobileNavLabel: string;
  languageLabel: string;
  recentUpdates: string;
  recentKicker: string;
  homeEmptyTitle: string;
  homeEmptyText: string;
  articlesIntro: string;
  articlesEmpty: string;
  notesIntro: string;
  noTopicsTitle: string;
  noTopicsText: string;
  latestUpdate: string;
  oneNote: string;
  manyNotes: string;
  allTopics: string;
  topicCountOne: string;
  topicCountMany: string;
  aboutTitle: string;
  aboutIntro: string;
  aboutBody: string;
  contentTypes: string;
  articleDefinition: string;
  noteDefinition: string;
  aboutPlaceholder: string;
  notFoundTitle: string;
  notFoundText: string;
  returnHome: string;
  pageLabel: string;
}

export const messages: Record<Locale, MessageCatalog> = {
  "zh-Hant": {
    siteSubtitle: "學習筆記與文章",
    siteDescription: "把學習過程整理成筆記，把值得留下的觀察寫成文章。",
    navHome: "首頁",
    navArticles: "文章",
    navNotes: "學習筆記",
    navAbout: "關於",
    skipToContent: "跳至主要內容",
    openMenu: "開啟選單",
    closeMenu: "關閉選單",
    switchDark: "切換深色模式",
    switchLight: "切換淺色模式",
    mainNavLabel: "主要導覽",
    mobileNavLabel: "行動版導覽",
    languageLabel: "語言",
    recentUpdates: "最近更新",
    recentKicker: "文章與筆記",
    homeEmptyTitle: "還沒有內容",
    homeEmptyText: "文章整理完成後，會從這裡開始出現。",
    articlesIntro: "經過整理，適合完整閱讀的主題內容。",
    articlesEmpty: "整理完成的文章會出現在這裡。",
    notesIntro: "依主題整理學習過程中的重點、線索，以及可以重複使用的方法。",
    noTopicsTitle: "還沒有主題",
    noTopicsText: "第一個學習主題整理完成後，會從這裡開始出現。",
    latestUpdate: "最近更新",
    oneNote: "1 篇筆記",
    manyNotes: "{count} 篇筆記",
    allTopics: "所有主題",
    topicCountOne: "這個主題目前整理了 1 篇筆記。",
    topicCountMany: "這個主題目前整理了 {count} 篇筆記。",
    aboutTitle: "關於",
    aboutIntro: "關於 Jerry 與這個網站。",
    aboutBody: "這裡是 Jerry's Notes，用來整理學習筆記，以及值得完整寫下來的文章。",
    contentTypes: "內容分類",
    articleDefinition: "經過整理、適合完整閱讀的主題內容。",
    noteDefinition: "學習過程中的重點、線索與方法。",
    aboutPlaceholder: "個人介紹與相關連結會在後續調整時補上。",
    notFoundTitle: "找不到頁面",
    notFoundText: "這個頁面不存在或已經移動。",
    returnHome: "返回首頁",
    pageLabel: "頁面"
  },
  en: {
    siteSubtitle: "Learning notes and articles",
    siteDescription: "I organize the learning process into notes and write observations worth keeping as articles.",
    navHome: "Home",
    navArticles: "Articles",
    navNotes: "Learning Notes",
    navAbout: "About",
    skipToContent: "Skip to main content",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchDark: "Switch to dark mode",
    switchLight: "Switch to light mode",
    mainNavLabel: "Primary navigation",
    mobileNavLabel: "Mobile navigation",
    languageLabel: "Language",
    recentUpdates: "Recent Updates",
    recentKicker: "Articles & Notes",
    homeEmptyTitle: "No content yet",
    homeEmptyText: "Finished articles and notes will appear here.",
    articlesIntro: "Polished pieces on topics suited to a full read.",
    articlesEmpty: "Finished articles will appear here.",
    notesIntro: "Key points, leads, and reusable methods from the learning process, organized by topic.",
    noTopicsTitle: "No topics yet",
    noTopicsText: "The first learning topic will appear here once it is ready.",
    latestUpdate: "Last updated",
    oneNote: "1 note",
    manyNotes: "{count} notes",
    allTopics: "All topics",
    topicCountOne: "This topic currently contains 1 note.",
    topicCountMany: "This topic currently contains {count} notes.",
    aboutTitle: "About",
    aboutIntro: "About Jerry and this site.",
    aboutBody: "Jerry's Notes is where I organize learning notes and publish ideas worth developing into full articles.",
    contentTypes: "Content types",
    articleDefinition: "Polished pieces on topics suited to a full read.",
    noteDefinition: "Key points, leads, and methods from the learning process.",
    aboutPlaceholder: "A personal introduction and related links will be added later.",
    notFoundTitle: "Page not found",
    notFoundText: "This page does not exist or has moved.",
    returnHome: "Return home",
    pageLabel: "Page"
  },
  ja: {
    siteSubtitle: "学習ノートと記事",
    siteDescription: "学びの過程をノートにまとめ、残しておきたい気づきを記事にします。",
    navHome: "ホーム",
    navArticles: "記事",
    navNotes: "学習ノート",
    navAbout: "このサイトについて",
    skipToContent: "メインコンテンツへ移動",
    openMenu: "メニューを開く",
    closeMenu: "メニューを閉じる",
    switchDark: "ダークモードに切り替える",
    switchLight: "ライトモードに切り替える",
    mainNavLabel: "メインナビゲーション",
    mobileNavLabel: "モバイルナビゲーション",
    languageLabel: "言語",
    recentUpdates: "最近の更新",
    recentKicker: "記事とノート",
    homeEmptyTitle: "まだコンテンツはありません",
    homeEmptyText: "整理できた記事やノートがここに表示されます。",
    articlesIntro: "整理を重ね、まとまった形で読める記事です。",
    articlesEmpty: "整理できた記事がここに表示されます。",
    notesIntro: "学びの過程で得た要点や手がかり、再利用できる方法をテーマごとにまとめます。",
    noTopicsTitle: "まだテーマはありません",
    noTopicsText: "最初の学習テーマがまとまり次第、ここに表示されます。",
    latestUpdate: "最終更新",
    oneNote: "ノート 1 件",
    manyNotes: "ノート {count} 件",
    allTopics: "すべてのテーマ",
    topicCountOne: "このテーマには現在ノートが 1 件あります。",
    topicCountMany: "このテーマには現在ノートが {count} 件あります。",
    aboutTitle: "このサイトについて",
    aboutIntro: "Jerry とこのサイトについて。",
    aboutBody: "Jerry's Notes は、学習ノートを整理し、残しておきたい考えを記事としてまとめる場所です。",
    contentTypes: "コンテンツの種類",
    articleDefinition: "整理を重ね、まとまった形で読める内容です。",
    noteDefinition: "学びの過程で得た要点、手がかり、方法です。",
    aboutPlaceholder: "自己紹介と関連リンクは今後追加します。",
    notFoundTitle: "ページが見つかりません",
    notFoundText: "このページは存在しないか、移動しました。",
    returnHome: "ホームへ戻る",
    pageLabel: "ページ"
  },
  de: {
    siteSubtitle: "Lernnotizen und Artikel",
    siteDescription: "Ich fasse den Lernprozess in Notizen zusammen und schreibe Beobachtungen, die es festzuhalten lohnt, als Artikel aus.",
    navHome: "Startseite",
    navArticles: "Artikel",
    navNotes: "Lernnotizen",
    navAbout: "Über",
    skipToContent: "Zum Hauptinhalt springen",
    openMenu: "Menü öffnen",
    closeMenu: "Menü schließen",
    switchDark: "Zum dunklen Design wechseln",
    switchLight: "Zum hellen Design wechseln",
    mainNavLabel: "Hauptnavigation",
    mobileNavLabel: "Mobile Navigation",
    languageLabel: "Sprache",
    recentUpdates: "Neueste Aktualisierungen",
    recentKicker: "Artikel & Notizen",
    homeEmptyTitle: "Noch keine Inhalte",
    homeEmptyText: "Fertige Artikel und Notizen erscheinen hier.",
    articlesIntro: "Ausgearbeitete Themen für eine zusammenhängende Lektüre.",
    articlesEmpty: "Fertige Artikel erscheinen hier.",
    notesIntro: "Wichtige Erkenntnisse, Hinweise und wiederverwendbare Methoden – nach Themen geordnet.",
    noTopicsTitle: "Noch keine Themen",
    noTopicsText: "Das erste Lernthema erscheint hier, sobald es fertig ist.",
    latestUpdate: "Zuletzt aktualisiert",
    oneNote: "1 Notiz",
    manyNotes: "{count} Notizen",
    allTopics: "Alle Themen",
    topicCountOne: "Dieses Thema enthält derzeit 1 Notiz.",
    topicCountMany: "Dieses Thema enthält derzeit {count} Notizen.",
    aboutTitle: "Über",
    aboutIntro: "Über Jerry und diese Website.",
    aboutBody: "Jerry's Notes ist der Ort, an dem ich Lernnotizen ordne und Gedanken zu vollständigen Artikeln ausarbeite.",
    contentTypes: "Inhaltsarten",
    articleDefinition: "Ausgearbeitete Themen für eine zusammenhängende Lektüre.",
    noteDefinition: "Wichtige Erkenntnisse, Hinweise und Methoden aus dem Lernprozess.",
    aboutPlaceholder: "Eine persönliche Vorstellung und weiterführende Links folgen später.",
    notFoundTitle: "Seite nicht gefunden",
    notFoundText: "Diese Seite existiert nicht oder wurde verschoben.",
    returnHome: "Zur Startseite",
    pageLabel: "Seite"
  }
};

export const languageNames: Record<Locale, string> = {
  "zh-Hant": "中文",
  en: "English",
  ja: "日本語",
  de: "Deutsch"
};

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localePath(locale: Locale, path = "/"): string {
  const normalized = `/${path.replace(/^\/+/, "")}`;
  return locale === defaultLocale ? normalized : `/${locale}${normalized}`;
}

export function stripLocalePath(locale: Locale, path: string): string {
  const normalized = `/${path.replace(/^\/+/, "")}`;
  if (locale === defaultLocale) return normalized;
  const prefix = `/${locale}`;
  const stripped = normalized.startsWith(`${prefix}/`) ? normalized.slice(prefix.length) : normalized;
  return stripped || "/";
}

export function interpolate(message: string, values: Record<string, string | number>): string {
  return message.replace(/\{(\w+)\}/g, (match, key) => key in values ? String(values[key]) : match);
}

export function navigation(locale: Locale) {
  const copy = messages[locale];
  return [
    { label: copy.navHome, href: localePath(locale, "/") },
    { label: copy.navArticles, href: localePath(locale, "/articles/") },
    { label: copy.navNotes, href: localePath(locale, "/notes/") },
    { label: copy.navAbout, href: localePath(locale, "/about/") }
  ];
}
