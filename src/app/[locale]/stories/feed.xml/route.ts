import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { storyText } from "@/lib/content/story-derive";
import { loadStories } from "@/lib/content/stories";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const xml = (s: string) => s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

/** RSS 2.0 feed of Builder Stories in one language (stories without zh.md appear in English). Prerendered. */
export async function GET(_req: Request, { params }: RouteContext<"/[locale]/stories/feed.xml">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return new Response("Not found", { status: 404 });
  const t = await getTranslations({ locale });
  const base = `${SITE_URL}/${locale}/stories`;
  const stories = loadStories();
  const items = stories.map((s) => {
    const text = storyText(s, locale);
    const link = `${base}/${s.slug}`;
    return `    <item>
      <title>${xml(text.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rfc822(s.published)}</pubDate>
      <description>${xml(text.dek)}</description>
    </item>`;
  });
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(t("sy_feed"))}</title>
    <link>${base}</link>
    <description>${xml(t("sy_desc"))}</description>
    <language>${locale === "zh" ? "zh-CN" : "en"}</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml"/>
${stories.length ? `    <lastBuildDate>${rfc822(stories[0].published)}</lastBuildDate>\n` : ""}${items.join("\n")}
  </channel>
</rss>
`;
  return new Response(body, { headers: { "content-type": "application/rss+xml; charset=utf-8" } });
}
