/**
 * Project activity as served by the ckbdapps backend (see "Project activity" in CLAUDE.md).
 * Pure parsing and helpers: no Next APIs here, so tsx tests can import it.
 */
import { z } from "zod";

export const STATUSES = ["active", "quiet", "dormant", "archived", "unknown"] as const;
export type Status = (typeof STATUSES)[number];

const Github = z.object({
  fetchedAt: z.string(),
  stars: z.number(),
  license: z.string().optional(),
  lastCommitAt: z.string().optional(),
  commits30d: z.number(),
  commits90d: z.number(),
  weekly: z.array(z.number()).length(13), // oldest first, last entry is the current week
  releases: z.array(z.object({ tag: z.string(), name: z.string().optional(), at: z.string(), url: z.string().url() })),
});

const Entry = z.object({
  status: z.enum(STATUSES),
  lastActivityAt: z.string().nullable(),
  github: Github.optional(),
  // Other sources the backend may add later (x) are ignored until the site learns to show them.
});

export type ActivityEntry = z.infer<typeof Entry>;

/** Slug -> entry. One malformed entry is dropped, not the whole payload. */
export function parseActivity(json: unknown): Record<string, ActivityEntry> {
  const raw = z.object({ projects: z.record(z.string(), z.unknown()) }).parse(json).projects;
  const out: Record<string, ActivityEntry> = {};
  for (const [slug, v] of Object.entries(raw)) {
    const e = Entry.safeParse(v);
    if (e.success) out[slug] = e.data;
  }
  return out;
}

/** Bar heights in percent of the busiest week; a week with no commits stays 0. */
export function barHeights(weekly: readonly number[]): number[] {
  const max = Math.max(...weekly, 0);
  return weekly.map((n) => (max ? Math.round((n / max) * 100) : 0));
}

/** YYYY-MM-DD, like every other date on the site. */
export const day = (iso: string) => iso.slice(0, 10);
