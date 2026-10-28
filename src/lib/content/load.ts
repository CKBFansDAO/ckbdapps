import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import YAML from "yaml";
import type { z } from "zod";
import { groupOf } from "./derive";
import { CONTENT_DIR, Project, SLUG, TAXONOMY_FILE, TAXONOMY_SOURCE, taxonomy, type GroupId, type ProjectData } from "./schema";

export const PROJECTS_DIR = path.join(CONTENT_DIR, "projects");
export const LOGOS_DIR = path.join(process.cwd(), "public", "logos");

export type ProjectEntry = ProjectData & {
  slug: string;
  /** Markdown About text, may be empty */
  body: string;
  group: GroupId;
  /** Public path of the logo, if one exists */
  logo?: string;
  /** The file as written, for the "source file" panel */
  source: string;
};

// gray-matter's default engine (js-yaml 3) turns `2026-10-11` into a Date; use the yaml package everywhere.
const engines = { yaml: { parse: (s: string) => YAML.parse(s) ?? {}, stringify: (o: object) => YAML.stringify(o) } };

export type RawProject = { slug: string; file: string; source: string; body: string; data: unknown; error?: string };

/** Every file in content/projects, parsed but not validated. */
export function readProjectFiles(): RawProject[] {
  return readdirSync(PROJECTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((f) => {
      const file = path.join("content", "projects", f);
      const slug = f.slice(0, -3);
      const source = readFileSync(path.join(PROJECTS_DIR, f), "utf8");
      try {
        const { data, content } = matter(source, { engines });
        return { slug, file, source, data, body: content.trim() };
      } catch (e) {
        return { slug, file, source, data: undefined, body: "", error: e instanceof Error ? e.message : String(e) };
      }
    });
}

export function formatIssues(error: z.ZodError): string[] {
  return error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`);
}

const groupOrder = new Map(taxonomy.groups.map((g, i) => [g.id, i]));
let cache: ProjectEntry[] | undefined;

/** All projects, validated, sorted by group display order then name. Throws on invalid content. */
export function loadProjects(): ProjectEntry[] {
  // Cache for the build; in dev re-read so content edits show up on reload.
  if (cache && process.env.NODE_ENV === "production") return cache;
  // Project files are re-read in dev, but the taxonomy (category ids, labels) is fixed at module load,
  // so a new category reads as "invalid option" until the dev server restarts. Say that instead.
  if (process.env.NODE_ENV !== "production" && readFileSync(TAXONOMY_FILE, "utf8") !== TAXONOMY_SOURCE) {
    throw new Error("content/taxonomy.yaml changed after `pnpm dev` started: restart the dev server to load it.");
  }
  const out = readProjectFiles().map(({ slug, file, source, data, body, error }) => {
    if (error) throw new Error(`${file}: ${error}`);
    if (!SLUG.test(slug)) throw new Error(`${file}: invalid slug`);
    const r = Project.safeParse(data);
    if (!r.success) throw new Error(`${file}:\n  ${formatIssues(r.error).join("\n  ")}`);
    const logo = existsSync(path.join(LOGOS_DIR, `${slug}.webp`)) ? `/logos/${slug}.webp` : undefined;
    return { ...r.data, slug, body, group: groupOf(r.data.categories), logo, source };
  });
  out.sort((a, b) => groupOrder.get(a.group)! - groupOrder.get(b.group)! || a.name.localeCompare(b.name, "en"));
  return (cache = out);
}

export function getProject(slug: string): ProjectEntry | undefined {
  return loadProjects().find((p) => p.slug === slug);
}
