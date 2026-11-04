// Problem reports from project pages: what a visitor may send, and the GitHub issue it becomes.
// No secrets and no Next APIs here: the form imports it for the fallback link, and it is unit tested.
import { REPO_URL, SITE_URL, projectFilePath } from "./site";

export const REPORT_CATEGORIES = ["site-down", "wrong-site", "renamed", "wrong-info", "discontinued", "other"] as const;
export type ReportCategory = (typeof REPORT_CATEGORIES)[number];

export const REPORT_MAX = 500;
/** Faster than this since the form opened is a script, not a person. */
export const REPORT_MIN_ELAPSED_MS = 2_000;

const TITLE: Record<ReportCategory, string> = {
  "site-down": "website does not open",
  "wrong-site": "website is not this project",
  renamed: "project has a new name",
  "wrong-info": "information is wrong",
  discontinued: "project has shut down",
  other: "other problem",
};

export const TITLE_PREFIX = "[report] ";

export type ReportInput = { slug: string; category: ReportCategory; description: string; elapsed: number; website: string };
type Project = { slug: string; name: string; url: string };

const isCategory = (v: unknown): v is ReportCategory => REPORT_CATEGORIES.includes(v as ReportCategory);

/** The request body as a report, or null when it is not one. `website` is the honeypot field. */
export function parseReport(raw: unknown): ReportInput | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { slug, category, description = "", elapsed, website = "" } = raw as Record<string, unknown>;
  if (typeof slug !== "string" || !isCategory(category) || typeof description !== "string") return null;
  if (typeof elapsed !== "number" || typeof website !== "string") return null;
  const text = description.trim();
  if (text.length > REPORT_MAX || (category === "other" && !text)) return null;
  return { slug, category, description: text, elapsed, website };
}

/** A filled honeypot or an instant submit: answer as if it worked, and file nothing. */
export const looksAutomated = (r: ReportInput) => r.website !== "" || r.elapsed < REPORT_MIN_ELAPSED_MS;

export const issueTitle = (p: Project, category: ReportCategory) => `${TITLE_PREFIX}${p.name}: ${TITLE[category]}`;

/**
 * The visitor's text goes in a code fence, so it cannot mention people (@name), reference issues (#1),
 * load images or fake other parts of the issue.
 */
export const quoteVisitorText = (text: string) => `\`\`\`text\n${text.replace(/`{3,}/g, "'''")}\n\`\`\``;

export function issueBody(p: Project, r: Pick<ReportInput, "category" | "description">) {
  return [
    `A visitor reported a problem from the project page. Anonymous and unverified: check it before changing anything.`,
    ``,
    `- Project: [${p.name}](${SITE_URL}/en/projects/${p.slug})`,
    `- Website: ${p.url}`,
    `- File: [\`${projectFilePath(p.slug)}\`](${REPO_URL}/blob/main/${projectFilePath(p.slug)})`,
    `- Problem: ${TITLE[r.category]}`,
    ``,
    r.description ? quoteVisitorText(r.description) : `No details given.`,
  ].join("\n");
}

/** Another report of a problem that already has an open issue: the issue says the rest. */
export const commentBody = (description: string) => (description ? quoteVisitorText(description) : `Reported again, no details given.`);

/** GitHub's new-issue page, prefilled: the way out when the report cannot be sent. Needs a GitHub account. */
export const newIssueUrl = (p: Project, r: Pick<ReportInput, "category" | "description">) =>
  `${REPO_URL}/issues/new?${new URLSearchParams({ title: issueTitle(p, r.category), body: issueBody(p, r) })}`;
