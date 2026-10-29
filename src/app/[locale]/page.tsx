import { getLocale } from "next-intl/server";
import { CategoryMarquee } from "@/components/home/CategoryMarquee";
import { EcoMap } from "@/components/home/EcoMap";
import { HalvingStrip } from "@/components/home/HalvingStrip";
import { Hero } from "@/components/home/Hero";
import { Spotlight } from "@/components/home/Spotlight";
import { categoryLabel, groupLabel, sym } from "@/lib/content/derive";
import { getBuildTime } from "@/lib/build-time";
import { loadProjects, type ProjectEntry } from "@/lib/content/load";
import { taxonomy } from "@/lib/content/schema";
import { COMMUNITY_COUNT, communityPicks, LIKE_COUNT, NEWEST_COUNT, newestListed, recommend, seeded } from "@/lib/picks";

const QUICK = ["Wallet", "DEX", "DOBs", "RGB++", "Fiber"];
// Dropped on phones so the chips stay on one line.
const QUICK_WIDE_ONLY = new Set(["DEX"]);

export default async function HomePage() {
  const locale = await getLocale();
  const projects = loadProjects();
  const labels = (p: ProjectEntry) => p.categories.map((c) => categoryLabel(c, locale));
  const tile = (p: ProjectEntry) => ({ slug: p.slug, name: p.name, logo: p.logo, meta: labels(p).slice(0, 3).join(", ") });
  const pool = projects.map((p) => ({ ...tile(p), cats: p.categories, group: p.group, community: p.community }));
  const newest = newestListed(projects, NEWEST_COUNT);

  // The static HTML gets picks seeded by the build day, with no project in two blocks;
  // each visitor's browser then swaps in its own (components/home/Picks.tsx).
  const day = Math.floor((await getBuildTime()) / 86_400_000);
  const shown = new Set(newest.map((p) => p.slug));
  const likeInitial = recommend(pool, [], LIKE_COUNT, seeded(day), shown).items;
  for (const p of likeInitial) shown.add(p.slug);
  const communityInitial = communityPicks(pool.filter((p) => !shown.has(p.slug)), COMMUNITY_COUNT, seeded(day + 1));

  const counts = new Map<string, number>();
  for (const p of projects) for (const c of p.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
  const topCategories = [...counts]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "en"))
    .slice(0, 16)
    .map(([id, count]) => ({ id, label: categoryLabel(id, locale), count }));

  return (
    <main>
      <Hero
        items={projects.map((p) => ({ slug: p.slug, name: p.name, tags: labels(p) }))}
        placeholders={recommend(pool, [], 8, seeded(day + 2)).items.map((p) => p.name)}
        quick={QUICK.map((id) => ({ id, label: categoryLabel(id, locale), wideOnly: QUICK_WIDE_ONLY.has(id) }))}
        stats={{
          projects: projects.length,
          groups: taxonomy.groups.length,
          community: projects.filter((p) => p.community).length,
        }}
      />
      <CategoryMarquee categories={topCategories} />
      <HalvingStrip />
      <Spotlight
        pool={pool}
        likeInitial={likeInitial.map((p) => p.slug)}
        communityInitial={communityInitial.map((p) => p.slug)}
        newest={newest.map(tile)}
        communityTotal={projects.filter((p) => p.community).length}
      />
      <EcoMap
        groups={taxonomy.groups.map((g) => ({
          id: g.id,
          label: groupLabel(g.id, locale),
          cells: projects
            .filter((p) => p.group === g.id)
            .map((p) => ({
              slug: p.slug,
              name: p.name,
              sym: sym(p.name),
              logo: p.logo,
              community: p.community,
              tags: (labels(p).length ? labels(p) : [groupLabel(p.group, locale)]).join(", "),
            })),
        }))}
      />
    </main>
  );
}
