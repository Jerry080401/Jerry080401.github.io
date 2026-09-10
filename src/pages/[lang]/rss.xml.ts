import { routeLocales, type RouteLocale } from "../../i18n";
import { createRssResponse } from "../../lib/rss";

export function getStaticPaths() {
  return routeLocales.map((locale) => ({ params: { lang: locale }, props: { locale } }));
}

export async function GET({ props }: { props: { locale: RouteLocale } }) {
  return createRssResponse(props.locale);
}
