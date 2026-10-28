import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { barHeights } from "@/lib/activity-source";
import { StatsTable } from "../stats/StatsTable";

/** Commits per week for the last 13 weeks, oldest first, with a table for people who cannot read the bars. */
export function CommitBars({ weekly }: { weekly: number[] }) {
  const t = useTranslations();
  const heights = barHeights(weekly);
  const label = (i: number) => (i === weekly.length - 1 ? t("act_this_week") : t("act_weeks_ago", { n: weekly.length - 1 - i }));
  return (
    <div>
      <h3 className="mt-0 mb-3 text-[.95rem] font-bold">{t("act_weekly_h")}</h3>
      <div role="img" aria-label={`${t("act_weekly_h")}: ${weekly.join(", ")}`} className="flex h-20 items-end gap-1 border-b-2 border-fg">
        {heights.map((h, i) => (
          <span
            key={i}
            className="block flex-1 bg-purple h-[max(3px,calc(var(--h)*1%))] data-[zero]:bg-line"
            data-zero={h ? undefined : ""}
            style={{ "--h": h } as CSSProperties}
          />
        ))}
      </div>
      <StatsTable summary={t("st_table")} head={[t("act_week"), t("act_commits")]} rows={weekly.map((n, i) => [label(i), String(n)])} />
    </div>
  );
}
