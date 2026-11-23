/**
 * Validates everything in content/ against the zod schemas and the taxonomy. Exits 1 on any error.
 *   pnpm validate:content
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { formatIssues, LOGOS_DIR, readProjectFiles } from "@/lib/content/load";
import { Project, SLUG, Story, StoryZh } from "@/lib/content/schema";
import { readStoryFiles, STORIES_DIR, type RawStoryFile } from "@/lib/content/stories";
import { inspectStory, localImage } from "@/lib/story-markdown";
import { webpSize } from "@/lib/webp";

// Top-level paths that a project slug must not shadow (next.config.ts redirects /<slug> to the project page).
const RESERVED = new Set(["en", "zh", "explore", "halving", "stats", "projects", "proofs", "ecosystem", "events", "statistics", "api", "stories", "submit"]);

const TODAY = new Date().toISOString().slice(0, 10);
const errors: string[] = [];
const fail = (where: string, msgs: string[]) => msgs.forEach((m) => errors.push(`${where}: ${m}`));

// schema.ts parses taxonomy.yaml on import, so reaching this line means the taxonomy is valid.
const files = readProjectFiles();
const slugs = new Set<string>();
const names = new Map<string, string>();

for (const { slug, file, data, error } of files) {
  slugs.add(slug);
  if (!SLUG.test(slug)) fail(file, ["filename must be lowercase a-z, 0-9 and single dashes"]);
  if (RESERVED.has(slug)) fail(file, [`"${slug}" is a reserved path`]);
  if (error) {
    fail(file, [`front matter: ${error}`]);
    continue;
  }
  const r = Project.safeParse(data);
  if (!r.success) {
    fail(file, formatIssues(r.error));
    continue;
  }
  const key = r.data.name.toLowerCase();
  if (names.has(key)) fail(file, [`same name as ${names.get(key)}`]);
  names.set(key, file);
  if (new Set(r.data.categories).size !== r.data.categories.length) fail(file, ["categories: duplicate entry"]);
  if (r.data.listed && r.data.listed > TODAY) fail(file, [`listed: ${r.data.listed} is in the future`]);
}

if (existsSync(LOGOS_DIR)) {
  for (const f of readdirSync(LOGOS_DIR)) {
    const m = /^(.+)\.webp$/.exec(f);
    if (!m) fail(`public/logos/${f}`, ["logos must be <slug>.webp"]);
    else if (!slugs.has(m[1])) fail(`public/logos/${f}`, ["no project with this slug"]);
  }
}

// Builder Stories: content/stories/<slug>/en.md (shared fields + English), optional zh.md (title, dek + Chinese)
// and the pictures they use, all in one directory so the Markdown also reads well on GitHub.
const MAX_IMAGE_WIDTH = 1600;
const stories = readStoryFiles();

function checkBody(md: RawStoryFile, files: string[]) {
  const { images, html } = inspectStory(md.body);
  if (html) fail(md.file, ["raw HTML is not allowed; use plain Markdown"]);
  for (const href of images) {
    const file = localImage(href);
    if (!file) fail(md.file, [`image "${href}": use a .webp file next to the Markdown, e.g. ./shot-1.webp`]);
    else if (!files.includes(file)) fail(md.file, [`image "${href}": file not found`]);
  }
}

for (const { slug, dir, files, en, zh } of stories) {
  if (!SLUG.test(slug)) fail(dir, ["directory name must be lowercase a-z, 0-9 and single dashes"]);
  for (const f of files) {
    if (f === "en.md" || f === "zh.md") continue;
    if (!f.endsWith(".webp")) {
      fail(`${dir}/${f}`, ["only en.md, zh.md and .webp pictures belong here"]);
      continue;
    }
    const size = webpSize(readFileSync(path.join(STORIES_DIR, slug, f)));
    if (!size) fail(`${dir}/${f}`, ["not a WebP file"]);
    else if (size.width > MAX_IMAGE_WIDTH) fail(`${dir}/${f}`, [`${size.width}px wide; at most ${MAX_IMAGE_WIDTH}px`]);
  }
  if (!en) {
    fail(dir, ["en.md is missing"]);
    continue;
  }
  if (en.error) {
    fail(en.file, [`front matter: ${en.error}`]);
    continue;
  }
  const r = Story.safeParse(en.data);
  if (!r.success) fail(en.file, formatIssues(r.error));
  else {
    if (!slugs.has(r.data.project)) fail(en.file, [`project: no content/projects/${r.data.project}.md`]);
    if (r.data.published > TODAY) fail(en.file, [`published: ${r.data.published} is in the future`]);
    for (const c of r.data.corrections ?? []) if (c.date < r.data.published) fail(en.file, [`corrections: ${c.date} is before published`]);
    if (r.data.person.avatar && !files.includes(r.data.person.avatar)) fail(en.file, [`person.avatar: ${r.data.person.avatar} not found`]);
  }
  if (!en.body) fail(en.file, ["the story text is empty"]);
  checkBody(en, files);
  if (!zh) continue;
  if (zh.error) {
    fail(zh.file, [`front matter: ${zh.error}`]);
    continue;
  }
  const extra = Object.keys((zh.data ?? {}) as object).filter((k) => k !== "title" && k !== "dek");
  if (extra.length) fail(zh.file, [`only title and dek go here; move ${extra.join(", ")} to en.md`]);
  else {
    const z = StoryZh.safeParse(zh.data);
    if (!z.success) fail(zh.file, formatIssues(z.error));
  }
  if (!zh.body) fail(zh.file, ["the story text is empty"]);
  checkBody(zh, files);
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):\n${errors.map((e) => `  ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(`Content OK: ${files.length} projects, ${stories.length} stories.`);
