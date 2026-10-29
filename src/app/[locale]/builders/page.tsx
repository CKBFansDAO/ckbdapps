import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { BuildList, type BuildItem } from "@/components/builders/BuildList";
import { SlotButton } from "@/components/ui/SlotButton";
import { loadBuilds } from "@/lib/builders";
import { STATUSES, TRACKER_URL } from "@/lib/builders-source";
import { loadProjects } from "@/lib/content/load";
import { alternates } from "@/lib/site";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh" }];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/builders">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return { title: t("bd_h1"), description: t("bd_desc"), alternates: alternates(locale, "/builders") };
}

const host = (u: string) => {
  try {
    return new URL(u).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
};

/** Directory slug per lowercased GitHub repo and per site host, so listed projects link to their page. */
function directoryIndex() {
  const index = new Map<string, string>();
  for (const p of loadProjects()) {
    if (p.github) index.set(p.github.toLowerCase(), p.slug);
    // A GitHub project page as the site would match every tracker link that points at GitHub
    if (host(p.url) !== "github.com") index.set(host(p.url), p.slug);
  }
  return index;
}

const H2 = "semi m-0 text-[1.5rem] leading-[1.15]";

/** Projects from the CKBuilder tracker, grouped by development status; most are on testnet and not in the directory. */
export default async function BuildersPage() {
  const t = await getTranslations();
  const { builds, fetchedAt, cached } = await loadBuilds();
  const index = directoryIndex();
  const items: BuildItem[] = builds.map((b) => {
    const slug = (b.github && index.get(b.github.toLowerCase())) || (b.link && index.get(host(b.link)));
    return slug ? { ...b, slug } : b;
  });
  const d = fetchedAt.slice(0, 10);
  const a = (c: ReactNode) => (
    <a href={TRACKER_URL} target="_blank" rel="noopener" className="text-fg underline decoration-accent decoration-2 underline-offset-4">
      {c}
    </a>
  );

  return (
    <main className="on-paper">
      <div className="in pt-[clamp(40px,7vw,88px)] pb-[clamp(48px,8vw,104px)]">
        <h1 className="wide m-0 text-[clamp(2.6rem,9vw,6rem)] leading-[.92]">{t("bd_h1")}</h1>
        <p className="mt-5 mb-3 max-w-[62ch] text-[1.1rem] text-mut">{t("bd_p")}</p>
        <p className="mt-0 mb-10 text-[.9rem] text-mut">{cached ? t("bd_cached", { d }) : t.rich("bd_src", { a, d })}</p>

        {STATUSES.map((s) => {
          const group = items.filter((b) => b.status === s);
          if (!group.length) return null;
          return (
            <section key={s} aria-labelledby={`bd-${s}`} className="mt-10 first-of-type:mt-0">
              <div className="flex items-baseline justify-between gap-4 border-b-2 border-fg pb-3">
                <h2 id={`bd-${s}`} className={H2}>
                  {t(`bd_s_${s}`)}
                </h2>
                <span className="font-mono text-[.85rem] text-mut">{t("bd_count", { n: group.length })}</span>
              </div>
              <BuildList items={group} />
            </section>
          );
        })}

        <section className="mt-14 max-w-[880px] border-t-2 border-fg pt-8">
          <h2 className={`${H2} mb-3`}>{t("bd_join_h")}</h2>
          <p className="mt-0 mb-6 max-w-[62ch]">{t("bd_join_p")}</p>
          <div className="flex flex-wrap gap-4">
            <SlotButton href={`${TRACKER_URL}#request-project-review`}>{t("bd_join")}</SlotButton>
            <SlotButton href="/submit">{t("add")}</SlotButton>
          </div>
        </section>
      </div>
    </main>
  );
}
