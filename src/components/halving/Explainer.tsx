import type { CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { INFLATION } from "@/lib/halving";

/** What / why / how, inflation, and the four parts of a block reward. Text follows the legacy explainer. */
export function Explainer() {
  const t = useTranslations();
  const cards = [
    ["hv_what_h", "hv_what_p"],
    ["hv_why_h", "hv_why_p"],
    ["hv_how2_h", "hv_how2_p"],
  ] as const;
  const bars = [
    ["hv_infl_a", INFLATION.beforeFirst],
    ["hv_infl_b", INFLATION.afterFirst],
  ] as const;

  return (
    <section className="on-dark py-[clamp(48px,8vw,104px)]">
      <div className="in">
        <h2 className="wide mt-0 mb-[clamp(24px,4vw,44px)] text-[clamp(2rem,5.2vw,4rem)] leading-none">{t("hv_how_h")}</h2>
        <div className="grid grid-cols-1 gap-3.5 min-[861px]:grid-cols-3">
          {cards.map(([h, p], i) => (
            <div key={h} className="bg-ink p-6">
              <h3 className="semi mt-0 mb-3 text-[1.3rem] leading-[1.1]">{t(h)}</h3>
              <p className="m-0 text-mut">{t(p)}</p>
              {i === 2 && (
                <div className="mt-[18px] border-t border-line pt-4 font-mono text-[.95rem] font-medium">{t("hv_formula")}</div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-3.5 grid gap-3.5 bg-ink p-6">
          <h3 className="semi m-0 text-[1.3rem]">{t("hv_infl_h")}</h3>
          {bars.map(([label, v]) => (
            <div key={label} className="grid grid-cols-[1fr_5rem] items-center gap-4 text-mut min-[641px]:grid-cols-[minmax(0,12rem)_minmax(0,1fr)_5.5rem]">
              <span>{t(label)}</span>
              <i
                className="col-span-full row-start-2 block h-[22px] w-(--w) bg-purple min-[641px]:col-span-auto min-[641px]:row-start-auto"
                style={{ "--w": `${((v / INFLATION.beforeFirst) * 100).toFixed(1)}%` } as CSSProperties}
              />
              <b className="wide text-right text-2xl text-fg">{v}%</b>
            </div>
          ))}
          <p className="m-0 text-mut">{t("hv_infl_n")}</p>
        </div>
        <h3 className="semi mt-[clamp(32px,5vw,56px)] mb-0 text-[1.15rem]">{t("hv_rew_h")}</h3>
        <ul className="mt-3.5 mb-3 flex list-none flex-wrap gap-2 p-0">
          {(t.raw("hv_rew") as string[]).map((x) => (
            <li key={x} className="border border-line px-3 py-[5px] font-semibold">
              {x}
            </li>
          ))}
        </ul>
        <p className="m-0 text-mut">{t("hv_rew_p")}</p>
      </div>
    </section>
  );
}
