// Files problem reports as a GitHub App, on the server only. The App may only touch issues on this repository.
import { createSign } from "node:crypto";
import { TITLE_PREFIX } from "./report";
import { REPO_URL } from "./site";

const API = "https://api.github.com";
const REPO = new URL(REPO_URL).pathname.slice(1);
/** New report issues per day across the site. A flood stops here and the form offers GitHub instead. */
export const DAILY_LIMIT = 20;
/** Further reports of the same problem are added to its open issue, up to this many. */
export const COMMENT_LIMIT = 10;

export type IssueSummary = { number: number; title: string; state: string; comments: number; created_at: string; html_url: string };
export type Decision = { do: "create" } | { do: "limit" } | { do: "comment"; issue: IssueSummary } | { do: "known"; issue: IssueSummary };

/** What to do with a report, given the repository's newest issues. Stateless: GitHub is the only store. */
export function decide(issues: IssueSummary[], title: string, now: number): Decision {
  const reports = issues.filter((i) => i.title.startsWith(TITLE_PREFIX));
  const same = reports.find((i) => i.title === title && i.state === "open");
  if (same) return same.comments < COMMENT_LIMIT ? { do: "comment", issue: same } : { do: "known", issue: same };
  const today = reports.filter((i) => now - Date.parse(i.created_at) < 86_400_000);
  return today.length >= DAILY_LIMIT ? { do: "limit" } : { do: "create" };
}

const b64url = (s: string | Buffer) => Buffer.from(s).toString("base64url");

/** The short-lived token that identifies the App itself (RS256, as GitHub requires). */
export function appJwt(appId: string, privateKey: string, now: number) {
  const iat = Math.floor(now / 1000) - 30; // GitHub rejects a token from the future; allow for clock drift.
  const payload = `${b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }))}.${b64url(JSON.stringify({ iat, exp: iat + 300, iss: appId }))}`;
  return `${payload}.${createSign("RSA-SHA256").update(payload).sign(privateKey, "base64url")}`;
}

async function github<T>(path: string, token: string, body?: object): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token}`,
      "user-agent": "ckbdapps-reports",
      "x-github-api-version": "2022-11-28",
    },
    body: body && JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`GitHub ${body ? "POST" : "GET"} ${path}: HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

async function installationToken(appId: string, privateKey: string) {
  const jwt = appJwt(appId, privateKey, Date.now());
  const { id } = await github<{ id: number }>(`/repos/${REPO}/installation`, jwt);
  const { token } = await github<{ token: string }>(`/app/installations/${id}/access_tokens`, jwt, {});
  return token;
}

export type FileResult = { status: "filed"; url: string } | { status: "limit" };

type Report = { title: string; body: string; comment: string };

export async function fileReport(appId: string, privateKey: string, { title, body, comment }: Report): Promise<FileResult> {
  const token = await installationToken(appId, privateKey);
  const issues = await github<IssueSummary[]>(`/repos/${REPO}/issues?state=all&sort=created&direction=desc&per_page=100`, token);
  const d = decide(issues, title, Date.now());
  if (d.do === "limit") return { status: "limit" };
  if (d.do === "known") return { status: "filed", url: d.issue.html_url };
  if (d.do === "comment") {
    const c = await github<{ html_url: string }>(`/repos/${REPO}/issues/${d.issue.number}/comments`, token, { body: comment });
    return { status: "filed", url: c.html_url };
  }
  const created = await github<{ html_url: string }>(`/repos/${REPO}/issues`, token, { title, body, labels: ["report"] });
  return { status: "filed", url: created.html_url };
}
