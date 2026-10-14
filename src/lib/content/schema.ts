import { readFileSync } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { z } from "zod";

export const CONTENT_DIR = path.join(process.cwd(), "content");

/** Slug = filename: lowercase, [a-z0-9-] only. */
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slug = z.string().regex(SLUG, "must be lowercase a-z, 0-9 and single dashes");
const httpUrl = z.url({ protocol: /^https?$/ });
// Bare handles/paths for links rendered as https://x.com/<x> and https://t.me/<telegram>
const handle = z.string().regex(/^[^\s/:@][^\s:]*$/, "a handle, not a URL");

/** One language is enough. */
export const L10n = z.union([
  z.string().min(1),
  z
    .object({ en: z.string().min(1).optional(), zh: z.string().min(1).optional() })
    .strict()
    .refine((v) => v.en || v.zh, "needs en or zh"),
]);
export type L10n = z.infer<typeof L10n>;

const label = { en: z.string().min(1), zh: z.string().min(1) };

export const Taxonomy = z
  .object({
    groups: z.array(z.object({ id: z.string().min(1), ...label }).strict()).min(1),
    group_priority: z.array(z.string()).min(1),
    categories: z
      .array(z.object({ id: z.string().min(1), en: z.string().min(1).optional(), zh: z.string().min(1), group: z.string() }).strict())
      .min(1),
    aliases: z.record(z.string(), z.string()).default({}),
  })
  .strict()
  .superRefine((t, ctx) => {
    const groups = new Set(t.groups.map((g) => g.id));
    const cats = new Set(t.categories.map((c) => c.id));
    const issue = (message: string) => ctx.addIssue({ code: "custom", message });
    if (groups.size !== t.groups.length) issue("duplicate group id");
    if (cats.size !== t.categories.length) issue("duplicate category id");
    for (const g of t.group_priority) if (!groups.has(g)) issue(`group_priority: unknown group "${g}"`);
    for (const g of groups) if (!t.group_priority.includes(g)) issue(`group_priority: missing group "${g}"`);
    for (const c of t.categories) if (!groups.has(c.group)) issue(`category "${c.id}": unknown group "${c.group}"`);
    for (const [from, to] of Object.entries(t.aliases)) {
      if (!cats.has(to)) issue(`alias "${from}": unknown target "${to}"`);
      if (cats.has(from)) issue(`alias "${from}" is also a category id`);
    }
  });
export type Taxonomy = z.infer<typeof Taxonomy>;

export const taxonomy: Taxonomy = Taxonomy.parse(YAML.parse(readFileSync(path.join(CONTENT_DIR, "taxonomy.yaml"), "utf8")));
export const CATEGORY_IDS = taxonomy.categories.map((c) => c.id) as [string, ...string[]];
export type GroupId = string;

export const Project = z
  .object({
    name: z.string().min(1),
    url: httpUrl,
    tagline: L10n, // one sentence
    categories: z.array(z.enum(CATEGORY_IDS)).min(1), // from taxonomy.yaml only
    community: z.boolean().default(false), // replaces the old "Community-Driven" category
    links: z
      .object({ x: handle, telegram: handle, discord: z.string().min(1), docs: httpUrl })
      .strict()
      .partial()
      .optional(),
    github: z.string().regex(/^[\w.-]+\/[\w.-]+$/, 'must be "owner/repo"').optional(), // enables auto signals
    contracts: z
      .array(
        z
          .object({
            name: z.string().min(1),
            code_hash: z.string().regex(/^0x[0-9a-f]{64}$/),
            hash_type: z.enum(["type", "data", "data1", "data2"]),
          })
          .strict(),
      )
      .optional(),
    audits: z.array(z.object({ label: z.string().min(1), date: z.string().min(1), url: httpUrl }).strict()).optional(),
    verified: z.iso.date(), // bump when the team confirms the page is current
  })
  .strict();
export type ProjectData = z.infer<typeof Project>;

export const Home = z
  .object({
    featured: z.array(slug),
    community_picks: z.array(slug),
    grants: z.array(z.object({ title: z.string().min(1), amount: z.string().min(1), project: slug, status: z.string().min(1) }).strict()),
  })
  .strict();
export type Home = z.infer<typeof Home>;
