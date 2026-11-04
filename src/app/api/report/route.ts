import { getProject } from "@/lib/content/load";
import { commentBody, issueBody, issueTitle, looksAutomated, parseReport } from "@/lib/report";
import { fileReport } from "@/lib/report-github";

const MAX_BYTES = 4_096;
const answer = (status: number, body: object = {}) => Response.json(body, { status });

/** A problem report from a project page becomes a GitHub issue, so visitors need no account. See CLAUDE.md. */
export async function POST(req: Request) {
  // Only our own pages: a browser always sends Origin on a POST, and other sites cannot fake it.
  const origin = req.headers.get("origin");
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  if (!origin || new URL(origin).host !== host) return answer(403);

  const text = await req.text();
  if (text.length > MAX_BYTES) return answer(413);
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return answer(400);
  }
  const report = parseReport(raw);
  const project = report && getProject(report.slug);
  if (!report || !project) return answer(400);
  if (looksAutomated(report)) return answer(200, {});

  const appId = process.env.GITHUB_APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!appId || !privateKey) return answer(503);

  try {
    const r = await fileReport(appId, privateKey, {
      title: issueTitle(project, report.category),
      body: issueBody(project, report),
      comment: commentBody(report.description),
    });
    return r.status === "limit" ? answer(429) : answer(200, { url: r.url });
  } catch (e) {
    console.error(`[report] ${e instanceof Error ? e.message : String(e)}`);
    return answer(502);
  }
}
