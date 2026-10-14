"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChartSection } from "./ChartSection";
import type { Layer } from "./Chart";
import { RangeBar } from "./RangeBar";
import { StatsTable } from "./StatsTable";
import { big, chg, hr, pr, ymd } from "@/lib/stats-format";
import { clampWindow, markerIndex, presetStart, sampleIdx, sparklinePath } from "@/lib/stats-chart";
import { DAY_S, GIFT, MINER_RELEASES } from "@/lib/stats-source";

const PRESETS = [
  { key: "7D", days: 7 },
  { key: "1M", days: 30 },
  { key: "6M", days: 180 },
  { key: "1Y", days: 365 },
  { key: "ALL", days: 0 },
];
const LEGEND_ITEM =
  "inline-flex items-center gap-2 border-[1.5px] border-line-p py-1 pr-2.5 pl-2 text-[.88rem] font-semibold";
const LEGEND_ROW = "mt-3 flex flex-wrap items-center gap-x-[22px] gap-y-2 text-sm text-mut-p";

type Props = { t0: number; price: number[]; hash: number[]; occ: number[] };

/** Paper half of the stats page: shared range control, three charts, data table. */
export function StatsView({ t0, price, hash, occ }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const n = price.length;
  const [{ i0, i1 }, setWin] = useState({ i0: 0, i1: n - 1 });
  const [gift, setGift] = useState(false);
  const setWindow = (a: number, b: number) => setWin(clampWindow(n, a, b));

  const fmtX = (i: number) => ymd(t0 * 1000 + i * DAY_S * 1000);
  const B = (v: number, d?: number) => big(v, locale, d);

  const markers = useMemo(
    () => MINER_RELEASES.map((d) => ({ i: markerIndex(d, t0), label: t("st_mk") })),
    [t0, t],
  );
  const sparkD = useMemo(() => sparklinePath(price), [price]);

  const priceLayers = useMemo<Layer[]>(
    () => [{ name: t("st_price"), cls: "text-purple-deep", kind: "line", top: (i) => price[i], fmt: (i) => pr(price[i]) }],
    [t, price],
  );
  const hashLayers = useMemo<Layer[]>(
    () => [{ name: t("st_hash"), cls: "text-purple-deep", kind: "line", top: (i) => hash[i], fmt: (i) => hr(hash[i]) }],
    [t, hash],
  );
  const occLayers = useMemo<Layer[]>(
    () => [
      { name: t("st_occ_g"), cls: "text-gift", kind: "area", on: gift, top: () => GIFT, base: () => 0, fmt: () => B(GIFT) },
      {
        name: t("st_occ_a"),
        cls: "text-purple-deep",
        kind: "area",
        top: (i) => (gift ? GIFT : 0) + occ[i],
        base: () => (gift ? GIFT : 0),
        fmt: (i) => B(occ[i]),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- B closes over locale
    [t, gift, occ, locale],
  );

  const change = (a: number, b: number) => {
    const c = chg(a, b);
    return c ? `${c} ${t("st_in")}` : undefined;
  };

  const rows = sampleIdx(i0, i1, 8).map((i) => [fmtX(i), pr(price[i]), hr(hash[i]), B(occ[i])]);
  const presets = PRESETS.map((p) => ({ ...p, active: i1 === n - 1 && i0 === presetStart(n, p.days) }));

  return (
    <div className="on-paper">
      <RangeBar
        n={n}
        i0={i0}
        i1={i1}
        sparkD={sparkD}
        presets={presets}
        onPreset={(d) => setWindow(presetStart(n, d), n - 1)}
        onWin={setWindow}
        rangeText={`${fmtX(i0)} – ${fmtX(i1)}`}
        groupLabel={t("st_range")}
      />
      <div className="in pb-[clamp(48px,8vw,104px)]">
        <ChartSection
          title={t("st_c_price")}
          value={pr(price[i1])}
          change={change(price[i0], price[i1])}
          i0={i0}
          i1={i1}
          fmtAxis={(v) => pr(v, true)}
          fmtX={fmtX}
          kbdHint={t("st_kbd")}
          layers={priceLayers}
        />
        <ChartSection
          title={t("st_c_hash")}
          value={hr(hash[i1])}
          change={change(hash[i0], hash[i1])}
          i0={i0}
          i1={i1}
          fmtAxis={(v) => hr(v, v >= 1e16 ? 0 : 1)}
          fmtX={fmtX}
          kbdHint={t("st_kbd")}
          layers={hashLayers}
          markers={markers}
          legend={
            <div className={LEGEND_ROW}>
              <span className="inline-flex items-center gap-2">
                <i className="size-2.5 rounded-full bg-paper-ink" />
                {t("st_mk")}
              </span>
            </div>
          }
        />
        <ChartSection
          title={t("st_c_occ")}
          value={B(occ[i1])}
          change={change(occ[i0], occ[i1])}
          i0={i0}
          i1={i1}
          zero
          fmtAxis={(v) => B(v, 1)}
          fmtX={fmtX}
          kbdHint={t("st_kbd")}
          layers={occLayers}
          legend={
            <div className={LEGEND_ROW}>
              {/* the used-CKB series is the point of the chart and always stays on */}
              <span className={`${LEGEND_ITEM} text-paper-ink`}>
                <i className="size-3.5 shrink-0 bg-current text-purple-deep" />
                {t("st_occ_a")}
              </span>
              <button
                type="button"
                aria-pressed={gift}
                onClick={() => setGift(!gift)}
                className={`${LEGEND_ITEM} ${gift ? "text-paper-ink" : "text-mut-p"}`}
              >
                <i className={`size-3.5 shrink-0 bg-current text-gift ${gift ? "" : "opacity-35"}`} />
                {t("st_occ_g")}
              </button>
              <p className="m-0">{t("st_occ_n")}</p>
            </div>
          }
        />
        <StatsTable
          summary={t("st_table")}
          head={[t("st_date"), t("st_price"), t("st_hash"), t("st_occ_a")]}
          rows={rows}
        />
      </div>
    </div>
  );
}
