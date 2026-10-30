import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { day, type RepoActivity } from "@/lib/activity-source";
import { categoryLabel, pick } from "@/lib/content/derive";
import type { ProjectEntry } from "@/lib/content/load";
import { StatusMark } from "../project/Activity";
import { FramedAvatar } from "../ui/FramedAvatar";
import { SlotButton } from "../ui/SlotButton";

type Props = { p: ProjectEntry; activity: RepoActivity | null | undefined; demoDown: boolean };

/** One testnet proof: what it is, whether its code still moves, and the way to try it and read it. */
export function ProofCard({ p, activity, demoDown }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  return (
    <article className="grid h-full content-start gap-4 border border-line bg-surface p-5 [--avatar-ic:var(--accent)]">
      <header className="flex items-center gap-4">
        <FramedAvatar slug={p.slug} logo={p.logo} size="sm" />
        <div className="min-w-0">
          <h2 className="semi m-0 text-[1.25rem] leading-[1.15] [overflow-wrap:anywhere]">
            <Link href={`/projects/${p.slug}`} className="no-underline hover:underline hover:decoration-accent hover:decoration-2">
              {p.name}
            </Link>
          </h2>
          <p className="mt-1 mb-0 text-[.82rem] font-semibold text-mut">{p.categories.map((c) => categoryLabel(c, locale)).join(" · ")}</p>
        </div>
      </header>
      <p className="m-0">{pick(p.tagline, locale)}</p>
      {activity && (
        <p className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1 text-[.9rem]">
          <StatusMark status={activity.status} />
          <span className="font-bold">{t(`act_s_${activity.status}`)}</span>
          {activity.lastActivityAt && (
            <span className="font-mono text-[.8rem] text-mut">{t("act_last", { d: day(activity.lastActivityAt) })}</span>
          )}
        </p>
      )}
      <div className="mt-1 flex flex-wrap items-center gap-x-5 gap-y-3">
        {demoDown ? (
          <p className="m-0 border-[1.5px] border-dashed border-accent px-3 py-2 text-[.88rem] font-semibold">{t("pf_offline")}</p>
        ) : (
          <SlotButton href={p.url}>{t("pf_try")}</SlotButton>
        )}
        <a className="linkbtn" href={`https://github.com/${p.github}`} target="_blank" rel="noopener">
          {t("pf_code")}
        </a>
      </div>
    </article>
  );
}
