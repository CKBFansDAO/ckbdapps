import type { CSSProperties } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import type { StatsResult } from "@/lib/stats";
import { big, splitUnit, ymd } from "@/lib/stats-format";

export async function StatsHero({ data }: { data: StatsResult }) {
  const t = await getTranslations();
  const locale = await getLocale();
  const { market } = data;
  const rest = market.total - market.circ;
  const parts = [
    { v: market.trade, cls: "bg-purple text-white", dot: "bg-purple", label: t("st_trade"), show: true },
    { v: market.dao, cls: "bg-split-dao text-ink", dot: "bg-split-dao", label: t("st_dao"), show: true },
    { v: rest, cls: "bg-split-notc", dot: "bg-split-notc", label: t("st_notc"), show: false },
  ];
  const d = ymd(data.fetchedAt);

  return (
    <section className="on-dark bg-grid-lines bg-size-[64px_64px] bg-position-[-1px_-1px] pt-[clamp(48px,8vw,104px)] pb-[clamp(40px,6vw,72px)]">
      <div className="in">
        <h1 className="wide m-0 animate-rise text-[clamp(2.6rem,8.4vw,7.2rem)] leading-[.94] zh:leading-[1.08] motion-reduce:animate-none">
          {t("st_h1")}
        </h1>
        <dl className="wide mt-[clamp(32px,5vw,64px)] grid grid-cols-2 min-[761px]:grid-cols-4">
          {(
            [
              ["st_total", market.total],
              ["st_circ", market.circ],
              ["st_dao", market.dao],
              ["st_trade", market.trade],
            ] as const
          ).map(([k, v]) => {
            const [num, unit] = splitUnit(big(v, locale));
            return (
              <div key={k} className="flex min-w-0 flex-col-reverse justify-end gap-2.5 border-t border-line-d pt-6 pr-4 pb-6">
                <dt className="font-semibold text-mut-d">{t(k)}</dt>
                {/* One line: the unit (亿, B) is set at half size, and the size is capped so four fit side by side. */}
                <dd className="m-0 text-[clamp(1.75rem,3.6vw,3.2rem)] leading-none whitespace-nowrap">
                  {num}
                  <span className="ml-[.12em] text-[.5em]">{unit}</span>
                </dd>
              </div>
            );
          })}
        </dl>
        <h2 className="semi mt-[clamp(28px,4vw,48px)] mb-3.5 text-[1.3rem]">{t("st_split")}</h2>
        <div
          className="flex h-15 gap-0.5"
          role="img"
          aria-label={parts.map((p) => `${p.label} ${big(p.v, locale)}`).join(", ")}
        >
          {parts.map((p) => (
            <div
              key={p.label}
              className={`flex min-w-1.5 basis-0 items-center overflow-hidden px-3.5 font-mono text-base font-semibold whitespace-nowrap shrink grow-(--g) ${p.cls}`}
              style={{ "--g": p.v } as CSSProperties}
            >
              {/* A thin segment cannot hold its number on a phone; the legend below always lists it. */}
              {p.show && <span className={p.v / market.total < 0.25 ? "hidden sm:inline" : undefined}>{big(p.v, locale)}</span>}
            </div>
          ))}
        </div>
        <ul className="mt-3.5 flex list-none flex-wrap gap-x-7 gap-y-2 p-0 text-mut-d">
          {parts.map((p) => (
            <li key={p.label} className="flex items-center gap-2">
              <i className={`size-3.5 shrink-0 ${p.dot}`} />
              {p.label} <b className="font-semibold text-white">{big(p.v, locale)}</b>{" "}
              {((p.v / market.total) * 100).toFixed(1)}%
            </li>
          ))}
        </ul>
        <p className="mt-7 mb-0 text-[.9rem] text-mut-d">{data.cached ? t("st_cached", { d }) : t("st_asof", { d })}</p>
      </div>
    </section>
  );
}
