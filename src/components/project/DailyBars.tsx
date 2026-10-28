import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { barHeights } from "@/lib/activity-source";
import { StatsTable } from "../stats/StatsTable";

/** Events per day by people over the last 30 days, oldest first, with a table for people who cannot read the bars. */
export function DailyBars({ daily }: { daily: number[] }) {
  const t = useTranslations();
  const heights = barHeights(daily);
  const label = (i: number) => (i === daily.length - 1 ? t("act_today") : t("act_days_ago", { n: daily.length - 1 - i }));
  return (
    <div>
      <h3 className="mt-0 mb-3 text-[.95rem] font-bold">{t("act_daily_h")}</h3>
      <div role="img" aria-label={`${t("act_daily_h")}: ${daily.join(", ")}`} className="flex h-20 items-end gap-0.5 border-b-2 border-fg">
        {heights.map((h, i) => (
          <span
            key={i}
            className="block flex-1 bg-purple h-[max(3px,calc(var(--h)*1%))] data-[zero]:bg-line"
            data-zero={h ? undefined : ""}
            style={{ "--h": h } as CSSProperties}
          />
        ))}
      </div>
      <StatsTable summary={t("st_table")} head={[t("act_day"), t("act_events")]} rows={daily.map((n, i) => [label(i), String(n)])} />
    </div>
  );
}
