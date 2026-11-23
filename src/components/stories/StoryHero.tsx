import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { htmlLang } from "@/i18n/routing";
import { padIssue } from "@/lib/content/story-derive";
import type { StoryCard } from "@/lib/content/stories";
import { StoryByline } from "./StoryByline";
import { StoryCover } from "./StoryCover";

/** Top of a story: issue number, title, one line, who and what, and the cover. */
export function StoryHero({ s }: { s: StoryCard }) {
  const t = useTranslations();
  return (
    <section className="on-dark pt-[clamp(24px,4vw,40px)] pb-[clamp(44px,7vw,88px)]">
      <div className="in">
        <Link
          href="/stories"
          className="inline-flex items-center gap-2.5 py-1.5 font-semibold text-mut no-underline before:h-[18px] before:w-2.5 before:bg-purple before:content-[''] hover:text-fg"
        >
          {t("sy_back")}
        </Link>
        <div className="mt-[clamp(24px,4vw,48px)] grid grid-cols-1 gap-x-[clamp(40px,6vw,80px)] gap-y-8 min-[821px]:grid-cols-[minmax(0,1fr)_auto] min-[821px]:items-center">
          <StoryCover no={s.no} size="xl" className="min-[821px]:order-2" />
          <div>
            <p className="m-0 font-mono text-[.82rem] font-medium text-mut">{t("sy_kick", { n: padIssue(s.no) })}</p>
            <h1 lang={htmlLang(s.lang)} className="wide mt-4 mb-0 max-w-[14ch] animate-rise text-[clamp(2.4rem,6.2vw,5.2rem)] leading-[.96] [overflow-wrap:anywhere] zh:max-w-[12em] zh:leading-[1.12] motion-reduce:animate-none">
              {s.title}
            </h1>
            <p lang={htmlLang(s.lang)} className="mt-6 mb-0 max-w-[50ch] text-[clamp(1.1rem,1.8vw,1.4rem)] text-fg/90">{s.dek}</p>
            <StoryByline story={s} link className="mt-8" />
            <p className="mt-2 mb-0 font-mono text-[.82rem] font-medium text-mut">
              {s.published} · {t("sy_min", { n: s.minutes })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
