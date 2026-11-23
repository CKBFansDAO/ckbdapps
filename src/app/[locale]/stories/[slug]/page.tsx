import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { StoryAside } from "@/components/stories/StoryAside";
import { StoryBody } from "@/components/stories/StoryBody";
import { StoryFoot } from "@/components/stories/StoryFoot";
import { StoryHelp } from "@/components/stories/StoryHelp";
import { StoryHero } from "@/components/stories/StoryHero";
import { StoryList } from "@/components/stories/StoryList";
import { StorySlot } from "@/components/stories/StorySlot";
import { routing } from "@/i18n/routing";
import { getProject } from "@/lib/content/load";
import { storyModified, storyText } from "@/lib/content/story-derive";
import { getStory, loadStories, storyCard } from "@/lib/content/stories";
import { SITE_URL } from "@/lib/site";
import { storyImageSizes } from "@/lib/story-images";
import { renderStory } from "@/lib/story-markdown";

// With Cache Components a dynamic route must prerender at least one path. Until the first story is published
// this placeholder renders the 404 page.
const NO_STORY = "_";

export function generateStaticParams() {
  const slugs = loadStories().map((s) => s.slug);
  return (slugs.length ? slugs : [NO_STORY]).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/stories/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const s = getStory(slug);
  if (!s) return {};
  const text = storyText(s, locale);
  const path = `/stories/${slug}`;
  // hreflang only for languages this story is written in; /zh without zh.md shows the English text.
  const langs = routing.locales.filter((l) => l === "en" || (l === "zh" && s.zh));
  return {
    title: text.title,
    description: text.dek,
    alternates: { canonical: `/${locale}${path}`, languages: Object.fromEntries(langs.map((l) => [l, `/${l}${path}`])) },
    openGraph: { type: "article", publishedTime: s.published, modifiedTime: storyModified(s), authors: [s.author] },
  };
}

// Prerendered whole, as project pages are (see projects/[slug]/page.tsx).
export const instant = false;

export default async function StoryPage({ params }: PageProps<"/[locale]/stories/[slug]">) {
  const { locale, slug } = await params;
  const s = getStory(slug);
  if (!s) notFound();
  const p = getProject(s.project)!;
  const text = storyText(s, locale);
  const card = storyCard(s, locale);
  const blocks = renderStory(text.body, { slug, quoteBy: s.person.name, images: await storyImageSizes(slug) });
  const more = loadStories()
    .filter((x) => x.slug !== s.slug)
    .slice(0, 2)
    .map((x) => storyCard(x, locale));
  const t = await getTranslations();

  const url = `${SITE_URL}/${locale}/stories/${slug}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: text.title,
    description: text.dek,
    inLanguage: text.lang,
    datePublished: s.published,
    dateModified: storyModified(s),
    author: { "@type": "Person", name: s.author },
    about: { "@type": "Thing", name: p.name, url: `${SITE_URL}/${locale}/projects/${p.slug}` },
    image: `${url}/opengraph-image`,
    mainEntityOfPage: url,
  };

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <StoryHero s={card} />
      <div className="on-paper">
        {text.fallback && (
          <div role="note" className="border-b border-line">
            <div className="in flex items-start gap-3.5 py-4 before:h-6 before:w-3.5 before:flex-none before:bg-purple before:content-['']">
              <p className="m-0 max-w-[80ch] font-semibold">{t("sy_fallback")}</p>
            </div>
          </div>
        )}
        <div className="in grid grid-cols-1 items-start gap-14 py-[clamp(36px,5vw,72px)] pb-[clamp(56px,8vw,104px)] lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-[72px]">
          <div className="min-w-0">
            <StoryBody blocks={blocks} lang={text.lang} />
            <StoryHelp s={s} />
            <StoryFoot s={s} />
          </div>
          <div className="min-w-0 lg:sticky lg:top-[calc(var(--hh)+24px)]">
            <StoryAside s={s} p={p} />
          </div>
        </div>
        <section aria-labelledby="sy-more" className="border-t border-line py-[clamp(40px,6vw,72px)]">
          <div className="in grid grid-cols-1 items-start gap-10 min-[900px]:grid-cols-[minmax(0,1fr)_400px]">
            {more.length > 0 ? (
              <div className="min-w-0">
                <h2 id="sy-more" className="semi m-0 text-[1.6rem]">
                  {t("sy_more_h")}
                </h2>
                <StoryList stories={more} />
              </div>
            ) : (
              <h2 id="sy-more" className="sr-only">
                {t("sy_more_h")}
              </h2>
            )}
            <StorySlot />
          </div>
        </section>
      </div>
    </main>
  );
}
