import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ProofCard } from "@/components/proofs/ProofCard";
import { code } from "@/components/ui/Code";
import { EmptySlot } from "@/components/ui/EmptySlot";
import { Slot } from "@/components/ui/Slot";
import { SlotButton } from "@/components/ui/SlotButton";
import { loadActivity } from "@/lib/activity";
import { loadProofs } from "@/lib/content/load";
import { alternates } from "@/lib/site";
import { loadSiteDown } from "@/lib/site-status";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh" }];
}

export async function generateMetadata({ params }: PageProps<"/[locale]/proofs">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return { title: t("pf_back"), description: t("pf_desc"), alternates: alternates(locale, "/proofs") };
}

/** Open-source projects that work on testnet only, kept apart from the directory and its mainnet bar. */
export default async function ProofsPage() {
  const t = await getTranslations();
  const proofs = await Promise.all(
    loadProofs().map(async (p) => ({
      p,
      activity: await loadActivity(p.github!),
      demoDown: await loadSiteDown(p.url),
    })),
  );

  return (
    <main>
      <section className="on-dark pt-[clamp(40px,7vw,96px)] pb-[clamp(36px,5vw,64px)]">
        <div className="in">
          <h1 className="wide m-0 max-w-[14ch] animate-rise text-[clamp(2.5rem,8vw,6.4rem)] leading-[.94] zh:max-w-[12em] zh:leading-[1.1] motion-reduce:animate-none">
            {t.rich("pf_h1", { slot: (c) => <Slot>{c}</Slot> })}
          </h1>
          <p className="mt-5 mb-0 max-w-[60ch] text-[1.1rem] text-mut">{t("pf_lead")}</p>
          <p
            role="note"
            className="mt-7 mb-0 flex max-w-[62ch] items-start gap-3 border-2 border-accent px-4 py-3 font-semibold before:w-2.5 before:flex-none before:self-stretch before:bg-purple before:content-['']"
          >
            {t("pf_warn")}
          </p>
        </div>
      </section>

      <section className="on-paper py-[clamp(32px,5vw,64px)]">
        <div className="in grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_300px]">
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-3.5 p-0">
            {proofs.map(({ p, activity, demoDown }) => (
              <li key={p.slug}>
                <ProofCard p={p} activity={activity} demoDown={demoDown} />
              </li>
            ))}
            <li>
              <EmptySlot href="/submit" title={t("pf_slot")} cta={t("add")} className="h-full" />
            </li>
          </ul>

          <aside aria-labelledby="pf-how" className="border-t-2 border-fg pt-6">
            <h2 id="pf-how" className="semi mt-0 mb-4 text-[1.2rem]">
              {t("pf_how_h")}
            </h2>
            <ol className="m-0 grid list-none gap-3 p-0">
              {(["pf_how_1", "pf_how_2", "pf_how_3", "pf_how_4"] as const).map((k, i) => (
                <li key={k} className="grid grid-cols-[2rem_minmax(0,1fr)] text-[.95rem]">
                  <span aria-hidden="true" className="pt-0.5 font-mono text-[.85rem] font-semibold text-accent">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {t(k)}
                </li>
              ))}
            </ol>
            <p className="mt-4 mb-0 border-t border-line pt-4 text-[.92rem] text-mut">{t("pf_how_p")}</p>
            <h3 className="semi mt-8 mb-2 text-[1.05rem]">{t("pf_cta_h")}</h3>
            <p className="mt-0 mb-5 text-[.95rem]">{t.rich("pf_cta_p", { code })}</p>
            <SlotButton href="/submit">{t("add")}</SlotButton>
          </aside>
        </div>
      </section>
    </main>
  );
}
