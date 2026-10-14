import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type Props = { categories: { id: string; label: string; count: number }[] };

/** The purple band: the most used categories scroll by; each one opens Explore filtered to it. */
export function CategoryMarquee({ categories }: Props) {
  const t = useTranslations();
  const run = (copy: boolean) => (
    <div className="flex flex-none items-center" aria-hidden={copy || undefined}>
      {categories.map((c) => (
        <span key={c.id} className="flex items-center">
          <Link
            href={{ pathname: "/explore", query: { cat: c.id } }}
            tabIndex={copy ? -1 : undefined}
            className="inline-flex items-baseline gap-2 py-[.28em] text-[clamp(2.1rem,5.4vw,4.4rem)] leading-none text-white uppercase no-underline hover:text-ink"
          >
            {c.label}
            <sup className="font-mono text-[.26em] font-semibold tracking-normal opacity-80">{c.count}</sup>
          </Link>
          <i className="mx-[clamp(18px,3vw,40px)] size-[.5em] flex-none bg-ink text-[clamp(2.1rem,5.4vw,4.4rem)]" />
        </span>
      ))}
    </div>
  );
  return (
    <nav aria-label={t("cats")} className="wide group overflow-hidden bg-purple text-white">
      <div className="marquee flex w-max group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        {run(false)}
        {run(true)}
      </div>
    </nav>
  );
}
