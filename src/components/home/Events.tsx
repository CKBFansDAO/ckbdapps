import { useTranslations } from "next-intl";

type Props = { events: { date: string; type: string; url: string; title: string }[] };

export function Events({ events }: Props) {
  const t = useTranslations();
  return (
    <section id="events" className="on-paper scroll-mt-(--hh) py-[clamp(48px,8vw,104px)]">
      <div className="in">
        <div className="mb-[clamp(24px,4vw,44px)] flex flex-wrap items-end justify-between gap-x-8 gap-y-3.5">
          <h2 className="wide m-0 text-[clamp(2rem,5.2vw,4rem)] leading-none">{t("ev_h")}</h2>
          <p className="m-0 max-w-[42ch] text-mut">{t("ev_p")}</p>
        </div>
        <ul className="m-0 list-none border-t-2 border-fg p-0">
          {events.map((e) => (
            <li key={e.url + e.date}>
              <a
                href={e.url}
                target="_blank"
                rel="noopener"
                className="relative grid grid-cols-[8rem_8rem_minmax(0,1fr)] items-center gap-x-5 gap-y-2 border-b border-line py-[18px] pr-3.5 no-underline after:absolute after:inset-y-0 after:right-0 after:w-0 after:bg-purple after:transition-[width] after:duration-150 hover:after:w-2.5 focus-visible:after:w-2.5 motion-reduce:after:transition-none max-[640px]:grid-cols-1"
              >
                <time dateTime={e.date} className="font-mono text-[.9rem] font-medium text-mut">
                  {e.date}
                </time>
                <span className="font-bold">{e.type}</span>
                <span className="min-w-0 text-[1.1rem] font-semibold">{e.title}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
