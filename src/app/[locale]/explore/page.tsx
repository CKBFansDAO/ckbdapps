import type { Metadata } from "next";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { ExploreView } from "@/components/explore/ExploreView";
import { categoryLabel, groupLabel } from "@/lib/content/derive";
import { loadProjects } from "@/lib/content/load";
import { taxonomy } from "@/lib/content/schema";
import { alternates } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[locale]/explore">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return { title: t("ex_h"), description: t("kicker"), alternates: alternates(locale, "/explore") };
}

export default function ExplorePage() {
  const locale = useLocale();
  const projects = loadProjects();
  const items = projects.map((p) => ({
    slug: p.slug,
    name: p.name,
    group: p.group,
    cats: p.categories,
    community: p.community,
    logo: p.logo,
  }));
  const groups = taxonomy.groups.map((g) => ({
    id: g.id,
    label: groupLabel(g.id, locale),
    count: projects.filter((p) => p.group === g.id).length,
  }));
  const catLabels = Object.fromEntries(taxonomy.categories.map((c) => [c.id, categoryLabel(c.id, locale)]));

  return (
    <main className="on-paper">
      <ExploreView items={items} groups={groups} catLabels={catLabels} />
    </main>
  );
}
