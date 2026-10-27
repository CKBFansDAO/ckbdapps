import { useLocale } from "next-intl";
import { CategoryMarquee } from "@/components/home/CategoryMarquee";
import { EcoMap } from "@/components/home/EcoMap";
import { HalvingStrip } from "@/components/home/HalvingStrip";
import { Hero } from "@/components/home/Hero";
import { Spotlight } from "@/components/home/Spotlight";
import { categoryLabel, groupLabel, sym } from "@/lib/content/derive";
import { getProject, loadHome, loadProjects, type ProjectEntry } from "@/lib/content/load";
import { taxonomy } from "@/lib/content/schema";

const QUICK = ["Wallet", "DEX", "DOBs", "RGB++", "Fiber"];
// Dropped on phones so the chips stay on one line.
const QUICK_WIDE_ONLY = new Set(["DEX"]);

export default function HomePage() {
  const locale = useLocale();
  const projects = loadProjects();
  const home = loadHome();
  const labels = (p: ProjectEntry) => p.categories.map((c) => categoryLabel(c, locale));
  const tile = (slug: string) => {
    const p = getProject(slug)!;
    return { slug, name: p.name, logo: p.logo, meta: labels(p).slice(0, 3).join(", ") };
  };

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
        placeholders={[...home.featured, ...home.community_picks].map((s) => getProject(s)!.name)}
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
        featured={home.featured.map(tile)}
        community={home.community_picks.map(tile)}
        grants={home.grants.map((g) => ({ slug: g.project, name: getProject(g.project)!.name, amount: g.amount }))}
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
              community: p.community,
              tags: (labels(p).length ? labels(p) : [groupLabel(p.group, locale)]).join(", "),
            })),
        }))}
      />
    </main>
  );
}
