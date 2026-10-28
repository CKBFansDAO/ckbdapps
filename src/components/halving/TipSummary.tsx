"use client";

import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import { eraProgress, prevHalvingEpoch, SCHEDULE } from "@/lib/halving";
import { fmtDate, fmtDateNum, fmtNum } from "./format";
import { useHalving } from "./useHalving";

const CELL = "flex min-w-0 flex-col border-line px-3 py-6 sm:px-5 sm:py-7";
// Edges per cell index in the 2-col -> 4-col (>=1024px; narrower, four big values do not fit side by side) grid:
// 2-col opens the left column and separates row 2; the 4-col row only keeps internal left borders.
const EDGE = [
  "pl-0",
  "border-l",
  "border-t pl-0 lg:border-t-0 lg:border-l lg:pl-5",
  "border-t border-l lg:border-t-0",
] as const;

/** While loading, `value` is a same-shaped placeholder drawn as a skeleton, so the row keeps its height. */
function Cell({ i, value, sub, label, loading }: { i: number; value: string; sub?: string; label: string; loading?: boolean }) {
  return (
    <div className={`${CELL} ${EDGE[i]}`}>
      <b
        className={`wide block text-[1.2rem] leading-[1.05] whitespace-nowrap sm:text-[clamp(1.4rem,2.6vw,2.3rem)] ${loading ? "w-fit bg-fg/8 text-transparent motion-safe:animate-pulse" : ""}`}
      >
        {value}
        {/* The note gets its own line, so neither it nor the number is cut in the middle. */}
        {sub && (
          <small className="mt-1 block font-mono text-[.8rem] font-medium tracking-normal whitespace-nowrap text-mut">
            {sub}
          </small>
        )}
      </b>
      {/* mt-auto: labels line up along the bottom of the row whether or not a cell has a note. */}
      <span className="mt-auto block pt-2 text-[.92rem] font-semibold text-mut">{label}</span>
    </div>
  );
}

/** One end of the era bar: the date, with the epoch number from 640px (on a phone both ends then fit one line). */
function BarEnd({ epoch, date }: { epoch: string; date: string }) {
  return (
    <span>
      <span className={date ? "hidden sm:inline" : undefined}>
        #{epoch}
        {date && "  ·  "}
      </span>
      {date}
    </span>
  );
}

/** Tip summary and the era progress bar: a bracket filled by the plug, with the open (dashed) slot at the end. */
export function TipSummary() {
  const t = useTranslations();
  const locale = useLocale();
  const { data } = useHalving();
  const n = (v: number) => fmtNum(v, locale);
  const dash = "—";
  // Placeholders shaped like real values, so the skeleton has the same width as the loaded row.
  const ph = { epoch: n(17520), block: n(20_000_000), date: fmtDateNum(Date.UTC(2027, 10, 21), locale) };

  const prev = data ? prevHalvingEpoch(data.tip.number) : undefined;
  const prevRow = SCHEDULE.find((r) => r.epoch === prev);
  const prevDate = prevRow?.date ? fmtDate(prevRow.date, locale) : data?.halved ? fmtDate(data.halved.time, locale) : "";
  const pct = data ? eraProgress(data.tip) * 100 : 0;

  return (
    <section className="on-dark bg-ink" aria-busy={!data}>
      <div className="in">
        <div className="grid grid-cols-2 lg:grid-cols-4">
          <Cell i={0} loading={!data} value={data ? n(data.tip.number) : ph.epoch} sub={data && `${data.tip.index}/${data.tip.length}`} label={t("hv_cur")} />
          <Cell i={1} loading={!data} value={data ? n(data.blockNumber) : ph.block} label={t("hv_block")} />
          <Cell
            i={2}
            loading={!data}
            value={data ? n(data.target) : ph.epoch}
            sub={data && t("hv_togo", { n: n(data.target - data.tip.number) })}
            label={t("hv_next_e")}
          />
          <Cell i={3} loading={!data} value={data ? fmtDateNum(data.estimate, locale) : ph.date} label={t("hv_est")} />
        </div>
        <div className="pt-3 pb-[clamp(40px,6vw,72px)]">
          <div className="mb-[22px] flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
            <h2 className="semi m-0 text-[1.6rem]">{t("hv_prog")}</h2>
            {/* Phones keep the bar and its two dates together; the glossary link is for wider screens. */}
            <span className="hidden sm:inline">
              <a className="linkbtn" href="https://docs.nervos.org/docs/basics/glossary#epoch" target="_blank" rel="noopener">
                {t("hv_epoch_q")}
              </a>
            </span>
          </div>
          <div
            className="relative mr-[30px] h-[84px] border-[12px] border-r-0 border-fg after:absolute after:-inset-y-[12px] after:-right-[30px] after:w-[30px] after:border-2 after:border-dashed after:border-purple-hi after:content-['']"
            role="img"
            aria-label={`${t("hv_prog")} ${Math.round(pct)}%`}
          >
            {data && (
              <div
                className="absolute inset-y-0 left-0 flex w-(--w) animate-fillup items-center justify-end bg-purple pr-4 text-[1.4rem] motion-reduce:animate-none"
                style={{ "--w": `${pct.toFixed(2)}%` } as CSSProperties}
              >
                <span className="wide">{Math.round(pct)}%</span>
              </div>
            )}
          </div>
          <div className="mt-3.5 mr-[30px] flex flex-wrap justify-between gap-x-5 gap-y-1.5 font-mono text-[.85rem] font-medium text-mut">
            {prev !== undefined ? <BarEnd epoch={n(prev)} date={prevDate} /> : <span>{dash}</span>}
            {data ? <BarEnd epoch={n(data.target)} date={fmtDate(data.estimate, locale)} /> : <span>{dash}</span>}
          </div>
          <p className="mt-[18px] mb-0 text-[.9rem] text-mut">{t("hv_note")}</p>
        </div>
      </div>
    </section>
  );
}
