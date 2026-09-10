import { defaultLocale } from "../i18n";
import { createRssResponse } from "../lib/rss";

export async function GET() {
  return createRssResponse(defaultLocale);
}