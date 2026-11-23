import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import { formatIssues, getProject } from "./load";
import { CONTENT_DIR, SLUG, Story, StoryZh, type StoryData } from "./schema";
import { issueNumbers, readingMinutes, storyText, type StoryText } from "./story-derive";

export const STORIES_DIR = path.join(CONTENT_DIR, "stories");
/** Story images are copied here by scripts/sync-story-assets.ts, so the Markdown can point next to itself. */
export const storyAssetPath = (slug: string, file: string) => `/stories/${slug}/${file}`;

export type StoryEntry = StoryData & {
  slug: string;
  /** Issue number, by publishing order */
  no: number;
  en: StoryText;
  zh?: StoryText;
  minutes: { en: number; zh?: number };
};

const engines = { yaml: { parse: (s: string) => YAML.parse(s) ?? {}, stringify: (o: object) => YAML.stringify(o) } };

export type RawStoryFile = { file: string; data: unknown; body: string; error?: string };
export type RawStory = { slug: string; dir: string; files: string[]; en?: RawStoryFile; zh?: RawStoryFile };

function readMd(dir: string, name: string): RawStoryFile | undefined {
  const full = path.join(STORIES_DIR, dir, name);
  if (!existsSync(full)) return undefined;
  const file = path.join("content", "stories", dir, name);
  try {
    const { data, content } = matter(readFileSync(full, "utf8"), { engines });
    return { file, data, body: content.trim() };
  } catch (e) {
    return { file, data: undefined, body: "", error: e instanceof Error ? e.message : String(e) };
  }
}

/** Every directory in content/stories, parsed but not validated. */
export function readStoryFiles(): RawStory[] {
  if (!existsSync(STORIES_DIR)) return [];
  return readdirSync(STORIES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
    .map((dir) => ({
      slug: dir,
      dir: path.join("content", "stories", dir),
      files: readdirSync(path.join(STORIES_DIR, dir)).sort(),
      en: readMd(dir, "en.md"),
      zh: readMd(dir, "zh.md"),
    }));
}

let cache: StoryEntry[] | undefined;

/** Every story, validated, newest first. Throws on invalid content (pnpm validate:content says more). */
export function loadStories(): StoryEntry[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const parsed = readStoryFiles().map(({ slug, dir, en, zh }) => {
    if (!SLUG.test(slug)) throw new Error(`${dir}: invalid slug`);
    if (!en) throw new Error(`${dir}: en.md is missing`);
    if (en.error) throw new Error(`${en.file}: ${en.error}`);
    const r = Story.safeParse(en.data);
    if (!r.success) throw new Error(`${en.file}:\n  ${formatIssues(r.error).join("\n  ")}`);
    if (!getProject(r.data.project)) throw new Error(`${en.file}: project "${r.data.project}" does not exist`);
    let zhText: StoryText | undefined;
    if (zh) {
      if (zh.error) throw new Error(`${zh.file}: ${zh.error}`);
      const z = StoryZh.safeParse(zh.data);
      if (!z.success) throw new Error(`${zh.file}:\n  ${formatIssues(z.error).join("\n  ")}`);
      zhText = { ...z.data, body: zh.body };
    }
    return {
      ...r.data,
      slug,
      en: { title: r.data.title, dek: r.data.dek, body: en.body },
      zh: zhText,
      minutes: { en: readingMinutes(en.body, "en"), zh: zhText && readingMinutes(zhText.body, "zh") },
    };
  });
  const no = issueNumbers(parsed);
  const out = parsed.map((s) => ({ ...s, no: no.get(s.slug)! }));
  out.sort((a, b) => b.no - a.no);
  return (cache = out);
}

export const getStory = (slug: string) => loadStories().find((s) => s.slug === slug);

/** Stories about one project, newest first. */
export const storiesOf = (project: string) => loadStories().filter((s) => s.project === project);

export type StoryCard = {
  slug: string;
  no: number;
  title: string;
  dek: string;
  published: string;
  minutes: number;
  lang: "en" | "zh";
  person: { name: string; avatar?: string };
  project: { slug: string; name: string };
};

/** What lists, the Home block and the project badge show of a story, in a locale (English when zh.md is missing). */
export function storyCard(s: StoryEntry, locale: string): StoryCard {
  const text = storyText(s, locale);
  return {
    slug: s.slug,
    no: s.no,
    title: text.title,
    dek: text.dek,
    published: s.published,
    minutes: (text.lang === "zh" ? s.minutes.zh : s.minutes.en) ?? s.minutes.en,
    lang: text.lang,
    person: { name: s.person.name, avatar: s.person.avatar },
    project: { slug: s.project, name: getProject(s.project)!.name },
  };
}
