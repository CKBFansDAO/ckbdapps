import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { StatsHero } from "@/components/stats/StatsHero";
import { StatsView } from "@/components/stats/StatsView";
import { loadStats } from "@/lib/stats";
import { alternates } from "@/lib/site";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh" }];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/stats">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return { title: t("st_h1"), description: t("st_desc"), alternates: alternates(locale, "/stats") };
}

// Static shell; the data loader is cached for an hour and falls back to the committed snapshot.
export default async function StatsPage() {
  const data = await loadStats();

  return (
    <main>
      <StatsHero data={data} />
      <StatsView t0={data.t0} price={data.price} hash={data.hash} occ={data.occ} />
    </main>
  );
}
