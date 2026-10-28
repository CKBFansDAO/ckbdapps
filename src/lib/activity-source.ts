/**
 * Project activity from CKB Pulse (https://pulse-lab.lusocryptolabs.com, see "Project activity" in CLAUDE.md).
 * Pure parsing and helpers: no Next APIs here, so tsx tests can import it.
 */
import { z } from "zod";

export const STATUSES = ["active", "quiet", "dormant"] as const;
export type Status = (typeof STATUSES)[number];

// The kinds a visitor reads as the team's own work. Stars, forks and new branches say little about it.
export const KINDS = ["push", "pr_open", "pr_merged", "pr_closed", "issue_open", "issue_closed", "comment", "review", "release", "tag"] as const;
export type Kind = (typeof KINDS)[number];

const Event = z.object({
  at: z.string(),
  kind: z.string(),
  actor: z.string(),
  title: z.string(),
  url: z.string().url(),
});

// GET /api/repo?name=owner/repo: one repository, the last 30 days.
const Repo = z.object({
  name: z.string(),
  url: z.string().url(),
  stars: z.number(),
  pushedAt: z.string().nullish(),
  daily: z.object({ people: z.array(z.number()) }), // events per day by people (not bots), oldest first, last = today
  contributors: z.array(z.object({ login: z.string() })),
  events: z.array(Event), // newest first
});

export type ActivityEvent = { at: string; kind: Kind; actor: string; title: string; url: string; times: number };

export type RepoActivity = {
  /** owner/repo as Pulse spells it */
  name: string;
  status: Status;
  lastActivityAt: string | null;
  stars: number;
  contributors: number;
  /** Events per day by people over the last 30 days, oldest first */
  daily: number[];
  /** The latest few, repeats folded (see foldEvents) */
  events: ActivityEvent[];
  fetchedAt: string;
};

const DAY = 86_400_000;

/** active <= 30 days, quiet 31-90, dormant beyond that or never seen. */
export function statusOf(lastActivityAt: string | null, now: number): Status {
  if (!lastActivityAt) return "dormant";
  const days = (now - Date.parse(lastActivityAt)) / DAY;
  return days <= 30 ? "active" : days <= 90 ? "quiet" : "dormant";
}

const isBot = (actor: string) => /\[bot\]$/i.test(actor);

/**
 * The newest `max` events worth showing. Bots and uninteresting kinds are dropped, and the same person doing the
 * same thing to the same item (five review comments on one pull request) becomes one line with a count.
 */
export function foldEvents(events: z.infer<typeof Event>[], max = 5): ActivityEvent[] {
  const out: ActivityEvent[] = [];
  const byKey = new Map<string, ActivityEvent>();
  for (const e of events) {
    if (isBot(e.actor) || !(KINDS as readonly string[]).includes(e.kind)) continue;
    const key = `${e.kind}|${e.actor}|${e.title}`;
    const seen = byKey.get(key);
    if (seen) {
      seen.times++;
      continue;
    }
    if (out.length === max) continue; // keep counting repeats of the ones already shown
    const item: ActivityEvent = { at: e.at, kind: e.kind as Kind, actor: e.actor, title: e.title, url: e.url, times: 1 };
    byKey.set(key, item);
    out.push(item);
  }
  return out;
}

/** One /api/repo response -> what the project page shows. Throws on a malformed payload. */
export function parseRepo(json: unknown, now: number): RepoActivity {
  const r = Repo.parse(json);
  const human = r.events.find((e) => !isBot(e.actor));
  const lastActivityAt = human?.at ?? r.pushedAt ?? null;
  return {
    name: r.name,
    status: statusOf(lastActivityAt, now),
    lastActivityAt,
    stars: r.stars,
    contributors: r.contributors.filter((c) => !isBot(c.login)).length,
    daily: r.daily.people,
    events: foldEvents(r.events),
    fetchedAt: new Date(now).toISOString(),
  };
}

/** Bar heights in percent of the busiest day; a day with nothing stays 0. */
export function barHeights(values: readonly number[]): number[] {
  const max = Math.max(...values, 0);
  return values.map((n) => (max ? Math.round((n / max) * 100) : 0));
}

/** YYYY-MM-DD, like every other date on the site. */
export const day = (iso: string) => iso.slice(0, 10);
