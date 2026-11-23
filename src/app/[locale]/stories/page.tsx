import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { AboutStories } from "@/components/stories/AboutStories";
import { LatestStory } from "@/components/stories/LatestStory";
import { StoryList } from "@/components/stories/StoryList";
import { StorySlot } from "@/components/stories/StorySlot";
import { Slot } from "@/components/ui/Slot";
import { SlotButton } from "@/components/ui/SlotButton";
import { loadStories, storyCard } from "@/lib/content/stories";
import { alternates, SITE_URL, STORY_TALK_URL } from "@/lib/site";

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "zh" }];
}

const feedPath = (locale: string) => `/${locale}/stories/feed.xml`;

export async function generateMetadata({ params }: PageProps<"/[locale]/stories">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations();
  return {
    title: t("sy_title"),
    description: t("sy_desc"),
    alternates: { ...alternates(locale, "/stories"), types: { "application/rss+xml": feedPath(locale) } },
  };
}

/** Builder Stories: the newest story, the earlier ones as a list, the open slot, and how it all works. */
export default async function StoriesPage() {
  const locale = await getLocale();
  const t = await getTranslations();
  const [latest, ...earlier] = loadStories().map((s) => storyCard(s, locale));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: t("sy_title"),
    description: t("sy_desc"),
    url: `${SITE_URL}/${locale}/stories`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [latest, ...earlier].filter(Boolean).map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/${locale}/stories/${s.slug}`,
        name: s.title,
      })),
    },
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <section className="on-dark pt-[clamp(40px,7vw,96px)] pb-[clamp(36px,5vw,64px)]">
        <div className="in">
          <h1 className="wide m-0 max-w-[14ch] animate-rise text-[clamp(2.5rem,7.4vw,6rem)] leading-[.96] zh:max-w-none zh:text-[clamp(2.5rem,6.8vw,5.5rem)] zh:text-balance zh:leading-[1.12] motion-reduce:animate-none">
            {t.rich("sy_h1", { slot: (c) => <Slot>{c}</Slot> })}
          </h1>
          <p className="mt-6 mb-0 max-w-[58ch] text-[1.15rem] text-mut">{t("sy_lead")}</p>
          <div className="mt-8">
            <SlotButton big href={STORY_TALK_URL}>
              {t("sy_talk_dm")}
            </SlotButton>
          </div>
          <p className="mt-4 mb-0 text-[.92rem] text-mut">{t("sy_reply")}</p>
        </div>
      </section>

      <section className="on-paper py-[clamp(32px,5vw,64px)] pb-[clamp(56px,8vw,104px)]">
        <div className="in grid grid-cols-1 items-start gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="min-w-0">
            {latest ? <LatestStory s={latest} /> : <p className="semi m-0 text-[1.4rem]">{t("sy_none")}</p>}
            {earlier.length > 0 && (
              <>
                <h2 className="semi mt-[52px] mb-1 text-[1.4rem]">{t("sy_past")}</h2>
                <StoryList stories={earlier} />
              </>
            )}
            <StorySlot className="mt-12 max-w-[600px]" />
          </div>
          <AboutStories feed={feedPath(locale)} />
        </div>
      </section>
    </main>
  );
}
