import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { htmlLang } from "@/i18n/routing";
import type { StoryCard } from "@/lib/content/stories";
import { PersonAvatar } from "./StoryByline";

/** On a project page: the newest story about it, in a bracket whose plug grows on hover, plus how many more there are. */
export function StoryBadge({ story, more }: { story: StoryCard; more: number }) {
  const t = useTranslations();
  return (
    <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
      <Link
        href={`/stories/${story.slug}`}
        className="relative mr-6 inline-grid max-w-[52ch] grid-cols-[auto_minmax(0,1fr)] items-center gap-3.5 border-2 border-r-0 border-fg py-3 pr-5 pl-3.5 no-underline after:absolute after:-top-0.5 after:-right-3.5 after:-bottom-0.5 after:w-3.5 after:bg-purple after:transition-[width,right] after:duration-200 after:content-[''] hover:after:-right-6 hover:after:w-6 focus-visible:after:-right-6 focus-visible:after:w-6 motion-reduce:after:transition-none"
      >
        <PersonAvatar story={story} />
        <span>
          <span className="block text-[.88rem] font-semibold text-mut">{t("sy_badge", { n: story.person.name })}</span>
          <strong lang={htmlLang(story.lang)} className="semi mt-0.5 block text-[1.1rem] leading-[1.2]">{story.title}</strong>
        </span>
      </Link>
      {more > 0 && (
        <Link href="/stories" className="linkbtn text-[.92rem]">
          {t("sy_badge_more", { n: more })}
        </Link>
      )}
    </div>
  );
}
