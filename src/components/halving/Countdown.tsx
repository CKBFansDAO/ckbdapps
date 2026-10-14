"use client";

import { useLocale, useTranslations } from "next-intl";
import { countdown, EPOCHS_PER_HALVING } from "@/lib/halving";
import { SITE_URL } from "@/lib/site";
import { Slot } from "../ui/Slot";
import { SlotButton } from "../ui/SlotButton";
import { DAY, fmtDate, fmtNum } from "./format";
import { useHalving, useNow } from "./useHalving";

const UNIT_RESET = "font-sans text-base font-semibold tracking-normal text-mut [font-stretch:100%] [font-variation-settings:normal]";

/** Halving hero: title, then the live countdown, the "just halved" state, a loading skeleton or an error with retry. */
export function Countdown() {
  const t = useTranslations();
  const locale = useLocale();
  const { data, isError, refetch, isFetching } = useHalving();
  const now = useNow();

  const timer = (parts: { unit: string; value: string }[], skeleton = false) => (
    <div
      className="wide mt-[clamp(28px,5vw,56px)] flex flex-wrap gap-x-[clamp(22px,4.5vw,64px)] gap-y-[18px]"
      role={skeleton ? undefined : "timer"}
      aria-hidden={skeleton || undefined}
    >
      {parts.map((p, i) => (
        <div key={p.unit} className="flex flex-col">
          <b
            className={`text-[clamp(3rem,8.4vw,7rem)] leading-[.95] font-extrabold tabular-nums ${skeleton ? "bg-fg/8 text-transparent motion-safe:animate-pulse" : ""}`}
          >
            {i === 0 && !skeleton ? <Slot>{p.value}</Slot> : p.value}
          </b>
          <small className={`mt-3 ${UNIT_RESET}`}>{t(`u_${p.unit as "d"}`)}</small>
        </div>
      ))}
    </div>
  );

  let body;
  if (data?.halved) {
    body = (
      <>
        <p className="mt-[18px] mb-0 font-semibold text-mut">
          {t("hv_done_k", { e: fmtNum(data.halved.epoch, locale), d: fmtDate(data.halved.time, locale) })}
        </p>
        <p className="wide mt-[clamp(28px,5vw,56px)] mb-0 text-[clamp(2.4rem,7vw,5.6rem)] leading-none">
          {t.rich("hv_done_h", { n: data.halved.epoch / EPOCHS_PER_HALVING, slot: (c) => <Slot>{c}</Slot> })}
        </p>
      </>
    );
  } else if (data && now) {
    const c = countdown(data.estimate - now);
    const date = fmtDate(data.estimate, locale);
    const share = t("hv_share_txt", { date, n: c.days, url: `${SITE_URL}/${locale}/halving` });
    body = (
      <>
        <p className="mt-[18px] mb-0 font-semibold text-mut">{t("hv_k", { e: fmtNum(data.target, locale), d: date })}</p>
        {timer(c.parts.map((p, i) => ({ unit: p.unit, value: i === 0 ? String(p.value) : String(p.value).padStart(2, "0") })))}
        <div className="mt-[clamp(32px,5vw,56px)]">
          <SlotButton big href={`https://x.com/intent/tweet?text=${encodeURIComponent(share)}`}>
            {t("hv_share")}
          </SlotButton>
        </div>
      </>
    );
  } else if (isError) {
    body = (
      <div className="mt-[clamp(28px,5vw,56px)]" role="alert">
        <p className="mt-0 mb-5 text-[1.1rem]">{t("hv_err")}</p>
        <SlotButton onClick={() => refetch()} disabled={isFetching}>
          {t("hv_retry")}
        </SlotButton>
      </div>
    );
  } else {
    body = (
      <div aria-busy="true">
        <p className="mt-[18px] mb-0 font-semibold text-mut">{t("hv_loading")}</p>
        {timer(["d", "h", "m", "s"].map((unit, i) => ({ unit, value: i === 0 ? "000" : "00" })), true)}
        <div className="invisible mt-[clamp(32px,5vw,56px)]" aria-hidden="true">
          <SlotButton big>{t("hv_share")}</SlotButton>
        </div>
      </div>
    );
  }

  return (
    <section className="on-dark bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-size-[64px_64px] bg-position-[-1px_-1px] pt-[clamp(48px,8vw,104px)] pb-[clamp(44px,6vw,80px)]">
      <div className="in">
        <h1 className="wide rise m-0 text-[clamp(2.6rem,8.4vw,7.2rem)] leading-[.94] [&:lang(zh)]:leading-[1.08]">{t("hv_title")}</h1>
        {body}
      </div>
    </section>
  );
}

/** Day count for the home page strip; an ellipsis until the chain answers. */
export function HalvingDays() {
  const { data } = useHalving();
  const now = useNow();
  return data && now ? Math.max(0, Math.ceil((data.estimate - now) / DAY)) : "…";
}
