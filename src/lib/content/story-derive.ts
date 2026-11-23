import type { StoryData } from "./schema";

export type StoryText = { title: string; dek: string; body: string };

/** Issue numbers by publishing order, oldest first (No. 1); same-day stories by slug. */
export function issueNumbers(stories: readonly { slug: string; published: string }[]): Map<string, number> {
  const order = [...stories].sort((a, b) => a.published.localeCompare(b.published) || a.slug.localeCompare(b.slug));
  return new Map(order.map((s, i) => [s.slug, i + 1]));
}

export const padIssue = (n: number) => String(n).padStart(2, "0");

/** Markdown down to the words a reader reads: no code, image or link syntax, no markup characters. */
function plain(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`~|-]/g, " ");
}

/** Minutes, rounded up: English at 220 words a minute, Chinese at 400 characters a minute. */
export function readingMinutes(md: string, lang: "en" | "zh"): number {
  const text = plain(md);
  const count = lang === "zh" ? text.replace(/\s/g, "").length / 400 : (text.match(/\S+/g)?.length ?? 0) / 220;
  return Math.max(1, Math.ceil(count));
}

/** The text for a locale: Chinese when zh.md exists, otherwise English (`fallback` is then true on /zh). */
export function storyText(s: { en: StoryText; zh?: StoryText }, locale: string): StoryText & { lang: "en" | "zh"; fallback: boolean } {
  if (locale === "zh" && s.zh) return { ...s.zh, lang: "zh", fallback: false };
  return { ...s.en, lang: "en", fallback: locale === "zh" };
}

/** Date of the latest correction, or the publishing date. */
export const storyModified = (s: Pick<StoryData, "published" | "corrections">) =>
  [s.published, ...(s.corrections ?? []).map((c) => c.date)].sort().at(-1)!;
