import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { SlotButton } from "@/components/ui/SlotButton";
import { getBuildTime } from "@/lib/build-time";
import { categoryLabel, groupLabel } from "@/lib/content/derive";
import { taxonomy } from "@/lib/content/schema";
import { alternates } from "@/lib/site";
import { newFileUrl, projectTemplate } from "@/lib/submit";

export async function generateMetadata({ params }: PageProps<"/[locale]/submit">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return { title: t("add"), description: t("sb_desc"), alternates: alternates(locale, "/submit") };
}

const code = (c: ReactNode) => <code className="bg-fg/8 px-1 font-mono text-[.88em] font-medium">{c}</code>;
const H2 = "semi mt-0 mb-3 text-[1.5rem] leading-[1.15]";
const LIST = "m-0 grid list-disc gap-2 pl-5 marker:text-accent";

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 border-t-2 border-fg py-8 sm:grid-cols-[4rem_minmax(0,1fr)]">
      <span aria-hidden="true" className="wide text-[1.6rem] leading-none text-accent sm:text-[2.2rem]">
        {String(n).padStart(2, "0")}
      </span>
      <div className="min-w-0">
        <h2 className={H2}>{title}</h2>
        {children}
      </div>
    </li>
  );
}

/** How to add a project: one file, prefilled on GitHub, and a pull request. */
export default async function SubmitPage() {
  const t = await getTranslations();
  const locale = await getLocale();
  const date = new Date(await getBuildTime()).toISOString().slice(0, 10);

  return (
    <main className="on-paper">
      <div className="in pt-[clamp(40px,7vw,88px)] pb-[clamp(48px,8vw,104px)]">
        <div className="max-w-[880px]">
          <h1 className="wide m-0 text-[clamp(2.6rem,9vw,6rem)] leading-[.92]">{t("add")}</h1>
          <p className="mt-5 mb-10 max-w-[62ch] text-[1.1rem] text-mut">{t("sb_p")}</p>

          <ol className="m-0 list-none p-0">
            <Step n={1} title={t("sb_s1_h")}>
              <p className="mt-0 mb-6 max-w-[62ch]">{t("sb_s1_p")}</p>
              <SlotButton big href={newFileUrl(date)}>
                {t("sb_open")}
              </SlotButton>
            </Step>
            <Step n={2} title={t("sb_s2_h")}>
              <p className="mt-0 mb-4 max-w-[62ch]">{t.rich("sb_s2_p", { code })}</p>
              <pre className="on-dark mt-0 mb-5 bg-ink p-4 font-mono text-[.85rem] leading-[1.65] font-medium whitespace-pre-wrap [overflow-wrap:anywhere]">
                {projectTemplate(date)}
              </pre>
              <ul className={LIST}>
                {(["sb_f_name", "sb_f_url", "sb_f_tagline", "sb_f_cats", "sb_f_dates"] as const).map((k) => (
                  <li key={k}>{t.rich(k, { code })}</li>
                ))}
              </ul>
            </Step>
            <Step n={3} title={t("sb_s3_h")}>
              <p className="m-0 max-w-[62ch]">{t("sb_s3_p")}</p>
            </Step>
          </ol>

          <section className="border-t-2 border-fg py-8">
            <h2 className={H2}>{t("sb_opt_h")}</h2>
            <ul className={LIST}>
              {(["sb_o_links", "sb_o_github", "sb_o_community", "sb_o_about", "sb_o_logo"] as const).map((k) => (
                <li key={k}>{t.rich(k, { code })}</li>
              ))}
            </ul>
          </section>

          <section className="border-t-2 border-fg py-8">
            <h2 className={H2}>{t("sb_cats_h")}</h2>
            {taxonomy.groups.map((g) => (
              <div key={g.id} className="mt-5 first-of-type:mt-0">
                <h3 className="mt-0 mb-2 text-[1rem] font-bold">{groupLabel(g.id, locale)}</h3>
                <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                  {taxonomy.categories
                    .filter((c) => c.group === g.id)
                    .map((c) => (
                      <li key={c.id} className="border border-line px-2 py-0.5 text-[.88rem]">
                        <code className="font-mono font-medium">{c.id}</code>
                        {categoryLabel(c.id, locale) !== c.id && <span className="ml-1.5 text-mut">{categoryLabel(c.id, locale)}</span>}
                      </li>
                    ))}
                </ul>
              </div>
            ))}
          </section>

          <p className="mt-0 mb-0 border-t-2 border-fg pt-8 text-mut">{t("sb_update")}</p>
        </div>
      </div>
    </main>
  );
}
