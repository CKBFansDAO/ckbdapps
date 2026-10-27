import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { loadProjects } from "@/lib/content/load";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const entry = (path: string, lastModified?: string): MetadataRoute.Sitemap[number] => ({
    url: `${SITE_URL}/${routing.defaultLocale}${path}`,
    ...(lastModified ? { lastModified } : {}),
    alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
  });
  return [
    entry(""),
    entry("/explore"),
    entry("/halving"),
    entry("/stats"),
    entry("/submit"),
    ...loadProjects().map((p) => entry(`/projects/${p.slug}`, p.verified)),
  ];
}
