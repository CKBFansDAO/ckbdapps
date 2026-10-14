/**
 * Validates everything in content/ against the zod schemas and the taxonomy. Exits 1 on any error.
 *   pnpm validate:content
 */
import { existsSync, readdirSync } from "node:fs";
import { formatIssues, LOGOS_DIR, readProjectFiles, readYaml } from "@/lib/content/load";
import { Home, Project, SLUG } from "@/lib/content/schema";

// Top-level paths that a project slug must not shadow (next.config.ts redirects /<slug> to the project page).
const RESERVED = new Set(["en", "zh", "explore", "halving", "projects", "ecosystem", "events", "statistics", "api"]);

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
}

if (existsSync(LOGOS_DIR)) {
  for (const f of readdirSync(LOGOS_DIR)) {
    const m = /^(.+)\.webp$/.exec(f);
    if (!m) fail(`public/logos/${f}`, ["logos must be <slug>.webp"]);
    else if (!slugs.has(m[1])) fail(`public/logos/${f}`, ["no project with this slug"]);
  }
}

const home = Home.safeParse(readYaml("home.yaml"));
if (!home.success) fail("content/home.yaml", formatIssues(home.error));
else {
  const { featured, community_picks, grants } = home.data;
  const refs: [string, string][] = [
    ...featured.map((s, i): [string, string] => [`featured.${i}`, s]),
    ...community_picks.map((s, i): [string, string] => [`community_picks.${i}`, s]),
    ...grants.map((g, i): [string, string] => [`grants.${i}.project`, g.project]),
  ];
  for (const [where, slug] of refs) if (!slugs.has(slug)) fail("content/home.yaml", [`${where}: no project "${slug}"`]);
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):\n${errors.map((e) => `  ${e}`).join("\n")}`);
  process.exit(1);
}
console.log(
  `Content OK: ${files.length} projects, ${home.data!.featured.length} featured.`,
);
