import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Activity } from "@/components/project/Activity";
import { SourceFile } from "@/components/project/Aside";
import { About, Audits, Contracts, Similar } from "@/components/project/Sections";
import { ProjectHero } from "@/components/project/ProjectHero";
import { BuildOnIt, TestnetNote } from "@/components/project/Testnet";
import { TrackView } from "@/components/project/TrackView";
import { loadActivity } from "@/lib/activity";
import { getBuildTime } from "@/lib/build-time";
import { daysSince, isStale, pick, projectLinks, similarProjects } from "@/lib/content/derive";
import { getProject, loadAllProjects, loadProjects, loadProofs } from "@/lib/content/load";
import { alternates } from "@/lib/site";
import { loadSiteDown } from "@/lib/site-status";

export function generateStaticParams() {
  return loadAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: pick(p.tagline, locale),
    alternates: alternates(locale, `/projects/${slug}`),
  };
}

// Every project page is prerendered whole. A Suspense boundary here would put a fallback in the static HTML
// and swap the content in by script (layout shift, late LCP), so navigations are allowed to wait for the
// prerendered payload instead.
export const instant = false;

export default async function ProjectPage({ params }: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const now = await getBuildTime();
  const activity = p.github ? await loadActivity(p.github) : undefined;
  const staleMonths = isStale(p.verified, now) ? Math.round(daysSince(p.verified, now) / 30) : null;
  // Only testnet proofs: their demos come and go, while directory sites are checked weekly by check:links.
  const demoDown = p.testnet ? await loadSiteDown(p.url) : false;
  const t = await getTranslations();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": p.group === "eco" ? "Organization" : "SoftwareApplication",
    name: p.name,
    url: p.url,
    description: pick(p.tagline, locale),
    ...(p.group === "eco" ? {} : { applicationCategory: "WebApplication", operatingSystem: "Web" }),
    sameAs: projectLinks(p).map((l) => l.href),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <TrackView slug={p.slug} />
      <ProjectHero p={p} staleMonths={staleMonths} demoDown={demoDown} />
      {p.testnet && <TestnetNote />}
      <section className="on-paper py-[clamp(48px,8vw,104px)]">
        <div className="in grid grid-cols-1 items-start gap-x-[clamp(28px,5vw,64px)] gap-y-10 min-[961px]:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <About body={p.body} />
            <Activity data={activity} repo={p.github} />
            <Contracts contracts={p.contracts} />
            <Audits audits={p.audits} />
            {p.testnet && p.github && <BuildOnIt repo={p.github} />}
            <Similar projects={similarProjects(p, p.testnet ? loadProofs() : loadProjects())} title={p.testnet ? t("pf_sim") : undefined} />
          </div>
          <aside>
            <SourceFile slug={p.slug} source={p.source} />
          </aside>
        </div>
      </section>
    </main>
  );
}
