import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { htmlLang } from "@/i18n/routing";
import { padIssue } from "@/lib/content/story-derive";
import { StoryByline } from "./StoryByline";
import { StoryCover } from "./StoryCover";
import type { StoryCard } from "@/lib/content/stories";

/** The newest story, wide, at the top of /stories. The whole block opens it; the title is the link. */
export function LatestStory({ s }: { s: StoryCard }) {
  const t = useTranslations();
  return (
    <article
      className="group relative grid grid-cols-1 gap-7 border-b-2 border-fg pb-12 min-[721px]:grid-cols-[auto_minmax(0,1fr)] min-[721px]:items-center"
    >
      <StoryCover no={s.no} />
      <div>
        <p className="m-0 font-mono text-[.82rem] font-medium text-mut">{t("sy_kick", { n: padIssue(s.no) })}</p>
        <h2 lang={htmlLang(s.lang)} className="wide mt-3 mb-0 text-[clamp(2rem,4.4vw,3.5rem)] leading-[.98] zh:leading-[1.15]">
          <Link
            href={`/stories/${s.slug}`}
            className="no-underline decoration-accent decoration-[3px] underline-offset-[6px] group-hover:underline after:absolute after:inset-0 after:content-[''] focus-visible:underline"
          >
            {s.title}
          </Link>
        </h2>
        <p lang={htmlLang(s.lang)} className="mt-4 mb-0 max-w-[54ch] text-[clamp(1.05rem,1.6vw,1.25rem)]">{s.dek}</p>
        <StoryByline story={s} className="mt-6" />
        <p className="mt-2 mb-0 font-mono text-[.82rem] font-medium text-mut">
          {s.published} · {t("sy_min", { n: s.minutes })}
        </p>
      </div>
    </article>
  );
}
