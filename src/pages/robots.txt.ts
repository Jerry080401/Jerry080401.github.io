import { withBase } from "../lib/url";

export function GET() {
  const body = [
    "User-agent: *",
    `Allow: ${withBase("/")}`,
    ""
  ].join("\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}