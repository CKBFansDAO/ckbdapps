"use client";

import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { eraOf, SCHEDULE } from "@/lib/halving";
import { fmtDate, fmtNum } from "./format";
import { useHalving } from "./useHalving";

// Phones: event and date on one line, the daily reward and its bar, then three small figures side by side.
// From 861px: one table row with five columns.
const COLS =
  "grid-cols-[4.5rem_5.5rem_minmax(0,1fr)] items-center gap-x-3 gap-y-2.5 min-[861px]:grid-cols-[minmax(0,1.2fr)_84px_minmax(0,2.4fr)_90px_170px] min-[861px]:gap-x-5 min-[861px]:gap-y-2";
// Until the chain answers, "now" is the last event that has a date.
const ERA_FROM_DATES = SCHEDULE.filter((r) => r.date).length - 1;

/** 11 rows; the bar width is the daily base reward, to scale. Past, now and future rows are styled apart. */
export function Schedule() {
  const t = useTranslations();
  const locale = useLocale();
  const { data } = useHalving();
  const era = data ? eraOf(data.tip.number) : ERA_FROM_DATES;
  const labels = t.raw("hv_ev") as string[];
  const n = (v: number) => fmtNum(v, locale);
  const mobileLabel = (l: string) => (
    <span className="mb-0.5 block text-[.74rem] text-mut min-[861px]:hidden">{l}</span>
  );

  return (
    <section className="on-paper py-[clamp(48px,8vw,104px)]">
      <div className="in">
        <div className="mb-[clamp(24px,4vw,44px)] flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
          <h2 className="wide m-0 text-[clamp(2rem,5.2vw,4rem)] leading-none">{t("hv_sched")}</h2>
          <p className="m-0 max-w-[42ch] text-mut">{t("hv_sched_p")}</p>
        </div>
        <ol className="m-0 list-none p-0">
          <li className={`${COLS} hidden border-b-2 border-fg py-2.5 text-[.85rem] font-bold text-mut min-[861px]:grid`} aria-hidden="true">
            <span>{t("hv_c_when")}</span>
            <span>{t("hv_c_epoch")}</span>
            <span>{t("hv_c_daily")}</span>
            <span className="text-right">{t("hv_c_block")}</span>
            <span className="text-right">{t("hv_c_issued")}</span>
          </li>
          {SCHEDULE.map((r, i) => {
            const state = i < era ? "past" : i === era ? "now" : "future";
            const width = Math.max(0.4, (r.dailyReward / SCHEDULE[0].dailyReward) * 100);
            const mono = `font-mono text-[.88rem] font-medium ${state === "now" ? "text-fg" : "text-mut"}`;
            return (
              <li
                key={r.n}
                aria-current={state === "now" ? "step" : undefined}
                className={`${COLS} relative grid border-b border-line py-4 pr-6 min-[861px]:py-5 min-[861px]:pr-[18px] ${state === "past" ? "text-mut" : ""} ${state === "now" ? "bg-surface after:absolute after:inset-y-0 after:right-0 after:w-3 after:bg-purple after:content-['']" : ""}`}
              >
                <div className="col-span-full -order-2 flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-0.5 min-[861px]:order-none min-[861px]:col-auto min-[861px]:flex-col min-[861px]:items-start">
                  <span className="flex items-center gap-2 min-[861px]:flex-col min-[861px]:items-start min-[861px]:gap-0.5">
                    <strong className="semi text-[1.15rem] leading-[1.15]">{labels[i]}</strong>
                    {state === "now" && (
                      <span className="border border-accent px-2 py-px text-[.8rem] font-semibold text-accent">{t("hv_now")}</span>
                    )}
                  </span>
                  <span className={mono}>{r.date ? fmtDate(r.date, locale) : t("hv_est_month", { y: r.year })}</span>
                </div>
                <div className={mono}>
                  {mobileLabel(t("hv_c_epoch"))}
                  {n(r.epoch)}
                </div>
                <div className="col-span-full -order-1 min-[861px]:order-none min-[861px]:col-auto">
                  <div className="mb-2 text-[.95rem]">
                    <b className="text-[1.15rem] font-extrabold">{n(r.dailyReward)}</b> {t("hv_per_day")}
                  </div>
                  <div className="h-[26px]">
                    <i
                      className={`block h-full w-(--w) min-w-1.5 ${state === "now" ? "bg-purple" : state === "past" ? "bg-fg opacity-30" : "bg-purple-deep opacity-55"}`}
                      style={{ "--w": `${width.toFixed(2)}%` } as CSSProperties}
                    />
                  </div>
                  <div className={`mt-1.5 hidden min-[861px]:block ${mono}`}>
                    {n(r.epochReward)} {t("hv_per_epoch")}
                  </div>
                </div>
                <div className={`text-left min-[861px]:text-right ${mono}`}>
                  {mobileLabel(t("hv_c_block"))}
                  {n(r.blockReward)}
                </div>
                <div className={`text-left min-[861px]:text-right ${mono}`}>
                  {mobileLabel(t("hv_c_issued"))}
                  {n(r.eraIssuance)}
                </div>
              </li>
            );
          })}
        </ol>
        <p className="mt-[18px] mb-0 text-[.9rem] text-mut">{t("hv_blk_note")}</p>
      </div>
    </section>
  );
}
