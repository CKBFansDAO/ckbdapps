import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryLabel, groupLabel, pick, projectLinks } from "@/lib/content/derive";
import type { ProjectEntry } from "@/lib/content/load";
import { editUrl } from "@/lib/site";
import { FramedAvatar } from "../ui/FramedAvatar";
import { SlotButton } from "../ui/SlotButton";

/** Faucet for test CKB, linked from testnet proofs. */
const FAUCET = "https://faucet.nervos.org/";

// demoDown: a testnet proof's site does not answer (lib/site-status); the page then offers the code only.
type Props = { p: ProjectEntry; staleMonths: number | null; demoDown?: boolean };

export function ProjectHero({ p, staleMonths, demoDown }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const host = new URL(p.url).host;
  // A Set: in Chinese the group "钱包" and the category "Wallet" share a label.
  const pills = [...new Set([groupLabel(p.group, locale), ...p.categories.map((c) => categoryLabel(c, locale)), ...(p.community ? [t("community")] : [])])];

  return (
    <section className="on-dark pt-[clamp(24px,4vw,40px)] pb-[clamp(40px,7vw,88px)]">
      <div className="in">
        <Link
          href={p.testnet ? "/proofs" : "/explore"}
          className="inline-flex items-center gap-2.5 py-1.5 font-semibold text-mut no-underline before:h-[18px] before:w-2.5 before:bg-purple before:content-[''] hover:text-fg"
        >
          {t(p.testnet ? "pf_back" : "back")}
        </Link>
        <div className="mt-[clamp(20px,4vw,44px)] grid grid-cols-1 items-start gap-x-[clamp(28px,5vw,64px)] gap-y-7 min-[721px]:grid-cols-[auto_minmax(0,1fr)]">
          <FramedAvatar slug={p.slug} logo={p.logo} />
          <div>
            <h1 className="wide m-0 text-[clamp(2.4rem,7.4vw,6rem)] leading-[.94] [overflow-wrap:anywhere]">{p.name}</h1>
            <ul className="mt-[18px] flex list-none flex-wrap gap-2 p-0">
              {p.testnet && (
                <li className="border-[1.5px] border-accent px-[11px] py-[3px] text-[.88rem] font-semibold text-accent">{t("pf_net")}</li>
              )}
              {pills.map((label) => (
                <li key={label} className="border-[1.5px] border-line px-[11px] py-[3px] text-[.88rem] font-semibold">
                  {label}
                </li>
              ))}
            </ul>
            <p className="mt-[22px] mb-0 max-w-[60ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-normal text-fg/90">
              {pick(p.tagline, locale)}
            </p>
            {demoDown && (
              <p className="mt-7 mb-0 max-w-[60ch] border-[1.5px] border-dashed border-accent px-4 py-2.5 font-semibold">{t("pf_offline")}</p>
            )}
            <div className="mt-7 flex flex-wrap items-center gap-x-[22px] gap-y-3.5">
              {!demoDown && (
                <SlotButton big href={p.url}>
                  {t(p.testnet ? "pf_try" : "visit")}
                </SlotButton>
              )}
              {projectLinks(p).map((l) => (
                <a key={l.label} className="linkbtn" href={l.href} target="_blank" rel="noopener">
                  {l.label}
                </a>
              ))}
              {p.testnet && (
                <a className="linkbtn" href={FAUCET} target="_blank" rel="noopener">
                  {t("pf_faucet")}
                </a>
              )}
            </div>
            {/* Proofs are not re-verified by hand: they show the date they were listed and never the stale notice. */}
            {!p.testnet && staleMonths !== null ? (
              <div className="mt-6 max-w-[62ch] border-2 border-dashed border-purple-hi px-4 py-3.5">
                <p className="mt-0 mb-2.5">{t("stale_n", { m: staleMonths })}</p>
                <a className="linkbtn" href={editUrl(p.slug)} target="_blank" rel="noopener">
                  {t("stale_cta")}
                </a>
              </div>
            ) : (
              <p className="mt-6 mb-0 font-mono text-[.85rem] font-medium text-mut">
                {host} · {p.testnet ? t("pf_listed", { d: p.listed! }) : t("verified", { d: p.verified })}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
