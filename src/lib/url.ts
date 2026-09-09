export function withBase(path = "/"): string {
  const clean = path.replace(/^\/+/, "");
  return clean ? `${import.meta.env.BASE_URL}${clean}` : import.meta.env.BASE_URL;
}

export function absoluteUrl(path = "/"): URL {
  return new URL(withBase(path), import.meta.env.SITE);
}