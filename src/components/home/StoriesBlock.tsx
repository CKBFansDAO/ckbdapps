import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { htmlLang } from "@/i18n/routing";
import { padIssue } from "@/lib/content/story-derive";
import type { StoryCard } from "@/lib/content/stories";
import { StoryByline } from "../stories/StoryByline";
import { StoryCover } from "../stories/StoryCover";
import { StorySlot } from "../stories/StorySlot";

/** Builder Stories on Home: the newest story (by date, not picked) next to the open slot. Left out until one exists. */
export function StoriesBlock({ latest }: { latest?: StoryCard }) {
  const t = useTranslations();
  if (!latest) return null;
  return (
    <section aria-labelledby="hb-stories" className="on-paper border-t border-line py-[clamp(48px,8vw,104px)]">
      <div className="in">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div>
            <h2 id="hb-stories" className="wide m-0 text-[clamp(2rem,5.2vw,4rem)] leading-none">
              {t("sy_title")}
            </h2>
            <p className="mt-2.5 mb-0 max-w-[56ch] text-mut">{t("sy_home_p")}</p>
          </div>
          <Link href="/stories" className="linkbtn">
            {t("sy_back")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-[18px] min-[860px]:grid-cols-[2fr_1fr]">
          <Link
            href={`/stories/${latest.slug}`}
            className="group grid min-h-[280px] grid-cols-1 items-center gap-7 bg-ink p-[clamp(20px,3vw,32px)] text-white no-underline [--accent:var(--purple-hi)] [--fg:var(--white)] [--mut:var(--mut-d)] transition-colors duration-150 hover:bg-purple hover:[--avatar-plug:var(--white)] hover:[--mut:color-mix(in_srgb,var(--white)_82%,transparent)] focus-visible:bg-purple sm:grid-cols-[auto_minmax(0,1fr)] motion-reduce:transition-none"
          >
            <StoryCover no={latest.no} size="md" />
            <span>
              <span className="block font-mono text-[.82rem] font-medium text-mut">{t("sy_kick", { n: padIssue(latest.no) })}</span>
              <strong lang={htmlLang(latest.lang)} className="semi mt-2 block max-w-[20ch] text-[clamp(1.5rem,2.8vw,2.3rem)] leading-[1.02] zh:leading-[1.2]">{latest.title}</strong>
              <span lang={htmlLang(latest.lang)} className="mt-3 block max-w-[54ch] text-mut">{latest.dek}</span>
              <StoryByline story={latest} className="mt-5" />
            </span>
          </Link>
          <StorySlot className="min-h-[280px]" />
        </div>
      </div>
    </section>
  );
}
