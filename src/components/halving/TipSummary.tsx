"use client";

import { useLocale, useTranslations } from "next-intl";
import { eraProgress, prevHalvingEpoch, SCHEDULE } from "@/lib/halving";
import { fmtDate, fmtNum } from "./format";
import { useHalving } from "./useHalving";

const CELL =
  "min-w-0 border-l border-line px-5 py-7 first:border-l-0 first:pl-0 max-[760px]:[&:nth-child(3)]:border-l-0 max-[760px]:[&:nth-child(3)]:pl-0 max-[760px]:[&:nth-child(n+3)]:border-t";

/** While loading, `value` is a same-shaped placeholder drawn as a skeleton, so the row keeps its height. */
function Cell({ value, sub, label, loading }: { value: string; sub?: string; label: string; loading?: boolean }) {
  return (
    <div className={CELL}>
      <b
        className={`wide block text-[clamp(1.4rem,2.8vw,2.3rem)] leading-[1.05] [overflow-wrap:anywhere] ${loading ? "w-fit bg-fg/8 text-transparent motion-safe:animate-pulse" : ""}`}
      >
        {value}
        {sub && <small className="ml-2 font-mono text-[.8rem] font-medium tracking-normal text-mut">{sub}</small>}
      </b>
      <span className="mt-2 block text-[.92rem] font-semibold text-mut">{label}</span>
    </div>
  );
}

/** Tip summary and the era progress bar: a bracket filled by the plug, with the open (dashed) slot at the end. */
export function TipSummary() {
  const t = useTranslations();
  const locale = useLocale();
  const { data } = useHalving();
  const n = (v: number) => fmtNum(v, locale);
  const dash = "—";
  // Placeholders shaped like real values (a halving date wraps like the real estimate does).
  const ph = { epoch: n(17520), block: n(20_000_000), date: fmtDate(Date.UTC(2027, 10, 21), locale) };

  const prev = data ? prevHalvingEpoch(data.tip.number) : undefined;
  const prevRow = SCHEDULE.find((r) => r.epoch === prev);
  const prevDate = prevRow?.date ? fmtDate(prevRow.date, locale) : data?.halved ? fmtDate(data.halved.time, locale) : "";
  const pct = data ? eraProgress(data.tip) * 100 : 0;

  return (
    <section className="on-dark bg-ink" aria-busy={!data}>
      <div className="in">
        <div className="grid grid-cols-4 max-[760px]:grid-cols-2">
          <Cell loading={!data} value={data ? n(data.tip.number) : ph.epoch} sub={data && `${data.tip.index}/${data.tip.length}`} label={t("hv_cur")} />
          <Cell loading={!data} value={data ? n(data.blockNumber) : ph.block} label={t("hv_block")} />
          <Cell
            loading={!data}
            value={data ? n(data.target) : ph.epoch}
            sub={data && t("hv_togo", { n: n(data.target - data.tip.number) })}
            label={t("hv_next_e")}
          />
          <Cell loading={!data} value={data ? fmtDate(data.estimate, locale) : ph.date} label={t("hv_est")} />
        </div>
        <div className="pt-3 pb-[clamp(40px,6vw,72px)]">
          <div className="mb-[22px] flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
            <h2 className="semi m-0 text-[1.6rem]">{t("hv_prog")}</h2>
            <a className="linkbtn" href="https://docs.nervos.org/docs/basics/glossary#epoch" target="_blank" rel="noopener">
              {t("hv_epoch_q")}
            </a>
          </div>
          <div
            className="relative mr-[30px] h-[84px] border-[12px] border-r-0 border-fg after:absolute after:-inset-y-[12px] after:-right-[30px] after:w-[30px] after:border-2 after:border-dashed after:border-purple-hi after:content-['']"
            role="img"
            aria-label={`${t("hv_prog")} ${Math.round(pct)}%`}
          >
            {data && (
              <div
                className="fill-in absolute inset-y-0 left-0 flex items-center justify-end bg-purple pr-4 text-[1.4rem]"
                style={{ width: `${pct.toFixed(2)}%` }}
              >
                <span className="wide">{Math.round(pct)}%</span>
              </div>
            )}
          </div>
          <div className="mt-3.5 mr-[30px] flex flex-wrap justify-between gap-x-5 gap-y-1.5 font-mono text-[.85rem] font-medium text-mut">
            <span>{prev !== undefined ? `#${n(prev)}${prevDate ? `  ·  ${prevDate}` : ""}` : dash}</span>
            <span>{data ? `#${n(data.target)}  ·  ${fmtDate(data.estimate, locale)}` : dash}</span>
          </div>
          <p className="mt-[18px] mb-0 max-w-[70ch] text-[.9rem] text-mut">{t("hv_note")}</p>
        </div>
      </div>
    </section>
  );
}
