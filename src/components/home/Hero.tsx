import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PULSE_URL } from "@/lib/site";
import { Slot } from "../ui/Slot";
import { SlotButton } from "../ui/SlotButton";
import { SlotSearch, type SearchItem } from "../ui/SlotSearch";
import { HeroGrid } from "./HeroGrid";

type Props = {
  items: SearchItem[];
  placeholders: string[];
  quick: { id: string; label: string; wideOnly?: boolean }[];
  stats: { projects: number; groups: number; community: number };
};

export function Hero({ items, placeholders, quick, stats }: Props) {
  const t = useTranslations();
  return (
    <HeroGrid>
      <p className="m-0 text-base font-semibold text-mut">{t("kicker")}</p>
      <h1 className="wide mt-[18px] mb-0 max-w-[13ch] animate-rise text-[clamp(2.6rem,8.4vw,7.2rem)] leading-[.94] text-balance zh:max-w-[12em] zh:leading-[1.08] motion-reduce:animate-none">
        {t.rich("h1", { slot: (chunks) => <Slot>{chunks}</Slot> })}
      </h1>
      <div className="mt-[clamp(28px,5vw,56px)] animate-rise [animation-delay:.12s] motion-reduce:animate-none">
        <SlotSearch items={items} placeholders={placeholders} />
      </div>
      <div className="mt-[18px] flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[.92rem] text-mut">
        <span>{t("try_")}</span>
        {quick.map((c) => (
          <Link
            key={c.id}
            href={{ pathname: "/explore", query: { cat: c.id } }}
            className={`${c.wideOnly ? "hidden sm:inline" : ""} relative border border-line px-3 py-[5px] text-[.88rem] font-semibold text-fg no-underline before:absolute before:inset-x-0 before:-inset-y-1 hover:border-white hover:bg-white hover:text-ink`}
          >
            {c.label}
          </Link>
        ))}
      </div>
      {/* Phones: three equal columns, centred under the full-width search, the Pulse link on its own line below.
          Wider: one left-aligned row, the link last, sitting on the labels' line. */}
      <div className="mt-[clamp(36px,6vw,72px)] flex flex-col items-center gap-y-7 sm:flex-row sm:flex-wrap sm:items-end sm:gap-x-[clamp(28px,6vw,72px)] sm:gap-y-5">
        <dl className="m-0 grid w-full grid-cols-3 gap-x-2 p-0 text-center sm:flex sm:w-auto sm:flex-wrap sm:gap-x-[clamp(28px,6vw,72px)] sm:gap-y-5 sm:text-left">
          {(
            [
              ["st_p", stats.projects],
              ["st_g", stats.groups],
              ["st_c", stats.community],
            ] as const
          ).map(([k, n]) => (
            <div key={k} className="flex flex-col-reverse justify-end">
              <dt className="text-[.85rem] font-semibold text-mut sm:text-[.95rem]">
                {t(k)}
              </dt>
              <dd className="wide m-0 text-[clamp(2.2rem,5vw,3.8rem)] leading-none">{n}</dd>
            </div>
          ))}
        </dl>
        <SlotButton href={PULSE_URL}>{t("pulse")}</SlotButton>
      </div>
    </HeroGrid>
  );
}
