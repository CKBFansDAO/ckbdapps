import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { loadAllProjects } from "@/lib/content/load";
import { storyModified } from "@/lib/content/story-derive";
import { loadStories } from "@/lib/content/stories";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const stories = loadStories();
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
    entry("/proofs"),
    entry("/stories", stories[0] && storyModified(stories[0])),
    ...stories.map((s) => entry(`/stories/${s.slug}`, storyModified(s))),
    ...loadAllProjects().map((p) => entry(`/projects/${p.slug}`, p.verified)),
  ];
}
