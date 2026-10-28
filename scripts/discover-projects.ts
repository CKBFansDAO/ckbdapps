/**
 * Finds CKB projects that are not listed yet, from two public sources:
 *   - CKB Pulse (every CKB repository active on GitHub), via each repo's homepage
 *   - the recent posts of the CKB Ecosystem Biweekly Update thread on Nervos Talk
 * Candidates with a working site, not testnet-only and not a demo become starter files in
 * content/projects/ (with --write) for a maintainer to review in a pull request. Everything else is
 * listed in the report with the reason it was held back.
 *
 *   pnpm discover:projects [--write] [--report <file>]
 * Env: GITHUB_TOKEN (raises the GitHub API limit), PULSE_STATE_URL, BIWEEKLY_TOPIC, DISCOVERY_DAYS.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import YAML from "yaml";
import { CONTENT_DIR } from "@/lib/content/schema";
import { LOGOS_DIR, PROJECTS_DIR, readProjectFiles } from "@/lib/content/load";
import {
  type Candidate,
  githubRepo,
  guessCategories,
  isHomepageCandidate,
  isKnown,
  knownFrom,
  linksIn,
  isSiteRoot,
  mentionsCkb,
  nameFromThreadTitle,
  nameFromTitle,
  networkOf,
  pageMeta,
  projectFile,
  PROTOTYPE,
  siteKey,
  slugify,
} from "@/lib/discovery";

const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const REPORT = args.includes("--report") ? args[args.indexOf("--report") + 1] : undefined;
const PULSE = process.env.PULSE_STATE_URL ?? "https://pulse-lab.lusocryptolabs.com/api/state";
const TALK = "https://talk.nervos.org";
const TOPIC = process.env.BIWEEKLY_TOPIC ?? "9821";
const SINCE = Date.now() - Number(process.env.DISCOVERY_DAYS ?? 42) * 86_400_000;
const TODAY = new Date().toISOString().slice(0, 10);
const UA = { "user-agent": "ckbdapps-discovery (+https://ckbdapps.com)" };
// Anchor texts in the biweekly posts that point at something but do not name it.
const GENERIC = /\b(here|link|learn more|read|more|vote|try it|download|report|recap|answers|docs?|website|repo(sitory)?|demo|update[s]?|post|article|announcement|tutorial|guide|landing page|testnet|mainnet|register|release|devlog|milestone|v\d)\b/i;
/** The anchor text when it reads like a name (short, not "here" or "Milestone 2 report"), else undefined. */
const anchorName = (t: string) => (t.length <= 32 && t.split(/\s+/).length <= 4 && !GENERIC.test(t) ? t : undefined);

type Page = { status: number; ok: boolean; url: string; body: string };

/** GET a page; the timeout covers the body too, and any failure is `undefined`, never a throw. */
async function get(url: string, headers: Record<string, string> = {}, tries = 4): Promise<Page | undefined> {
  try {
    const r = await fetch(url, { headers: { ...UA, ...headers }, redirect: "follow", signal: AbortSignal.timeout(20_000) });
    // Nervos Talk rate-limits anonymous API calls; wait as asked and try again rather than lose the thread.
    if (r.status === 429 && tries > 1) {
      await new Promise((ok) => setTimeout(ok, Math.min(60, Number(r.headers.get("retry-after")) || 10) * 1000));
      return get(url, headers, tries - 1);
    }
    return { status: r.status, ok: r.ok, url: r.url, body: await r.text() };
  } catch {
    return undefined;
  }
}
const json = async <T>(url: string, headers?: Record<string, string>) => {
  const r = await get(url, headers);
  try {
    return r?.ok ? (JSON.parse(r.body) as T) : undefined;
  } catch {
    return undefined;
  }
};

async function inBatches<T, R>(items: T[], size: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += size) out.push(...(await Promise.all(items.slice(i, i + size).map(fn))));
  return out;
}

const text = (html: string) => html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

// ---- sources -------------------------------------------------------------------------------------

type PulseState = { repos: { name: string; desc?: string }[] };
type GhRepo = { full_name: string; homepage?: string | null; description?: string | null; archived: boolean; fork: boolean };

async function fromPulse(skipRepos: Set<string>, notes: string[]): Promise<Candidate[]> {
  const state = await json<PulseState>(PULSE);
  if (!state) return notes.push(`CKB Pulse: could not read ${PULSE}`), [];
  const auth: Record<string, string> = process.env.GITHUB_TOKEN ? { authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {};
  const repos = state.repos.filter((r) => !skipRepos.has(r.name.toLowerCase()));
  let limited = false;
  const found = await inBatches(repos, 8, async (r): Promise<Candidate | undefined> => {
    if (limited) return undefined;
    const res = await get(`https://api.github.com/repos/${r.name}`, { ...auth, accept: "application/vnd.github+json" });
    if (res?.status === 403 || res?.status === 429) return void (limited = true);
    const gh = res?.ok ? (JSON.parse(res.body) as GhRepo) : undefined;
    const home = gh?.homepage?.trim();
    if (!gh || gh.archived || gh.fork || !home || !isHomepageCandidate(home)) return undefined;
    const url = /^https?:\/\//.test(home) ? home : `https://${home}`;
    return { name: r.name.split("/")[1], url, description: gh.description ?? r.desc ?? "", github: gh.full_name, source: `CKB Pulse: ${gh.full_name}`, context: gh.description ?? "" };
  });
  if (limited) notes.push("CKB Pulse: GitHub API rate limit reached, some repositories were not checked (set GITHUB_TOKEN)");
  notes.push(`CKB Pulse: ${state.repos.length} repositories, ${repos.length} not listed yet`);
  return found.filter((c): c is Candidate => !!c);
}

type Post = { post_number: number; username: string; created_at: string; cooked: string };
type Topic = { title: string; post_stream: { stream: number[]; posts: Post[] } };

async function fromBiweekly(notes: string[]): Promise<Candidate[]> {
  const topic = await json<Topic>(`${TALK}/t/${TOPIC}.json`);
  if (!topic) return notes.push(`Biweekly: could not read ${TALK}/t/${TOPIC}`), [];
  const author = topic.post_stream.posts[0].username;
  const ids = topic.post_stream.stream;
  const posts: Post[] = [];
  for (let i = 0; i < ids.length; i += 20) {
    const q = ids.slice(i, i + 20).map((id) => `post_ids[]=${id}`).join("&");
    posts.push(...((await json<{ post_stream: { posts: Post[] } }>(`${TALK}/t/${TOPIC}/posts.json?${q}`))?.post_stream.posts ?? []));
  }
  const recent = posts.filter((p) => p.username === author && Date.parse(p.created_at) >= SINCE);
  notes.push(`Biweekly: ${recent.length} update(s) since ${new Date(SINCE).toISOString().slice(0, 10)} in "${topic.title}"`);

  const seen = new Set<string>();
  const links = recent.flatMap((p) => linksIn(p.cooked)).filter((l) => !seen.has(l.href) && seen.add(l.href));
  const found = await inBatches(links, 2, async ({ text: anchor, href }): Promise<Candidate | undefined> => {
    const thread = /^https:\/\/talk\.nervos\.org\/t\/[^/]+\/(\d+)/.exec(href);
    if (!thread) {
      const name = anchorName(anchor);
      // A bare link in the update: only a site's front page counts, and only under a name.
      return name && isHomepageCandidate(href) && isSiteRoot(href) ? { name, url: href, description: "", source: "Biweekly update", context: "" } : undefined;
    }
    // A forum thread about a project: its first post links the product's site (and often the repo).
    const t = await json<Topic>(`${TALK}/t/${thread[1]}.json`);
    const first = t?.post_stream.posts[0];
    if (!t || !first) return undefined;
    const hrefs = linksIn(first.cooked).map((l) => l.href);
    const site = hrefs.find((h) => isHomepageCandidate(h) && isSiteRoot(h));
    if (!site) return undefined;
    const name = anchorName(anchor) ?? nameFromThreadTitle(t.title);
    const key = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    // Posts link libraries and references too: keep a repo only when its name matches the project.
    const github = hrefs.map(githubRepo).find((r) => !!r && key.length > 2 && r.replace(/[^a-z0-9/]/g, "").split("/").some((part) => part.includes(key) || key.includes(part)));
    const body = text(first.cooked);
    return { name, url: site, description: body, github, source: `Biweekly update: ${TALK}/t/${thread[1]}`, context: `${t.title} ${body}` };
  });
  return found.filter((c): c is Candidate => !!c);
}

// ---- checks and output ---------------------------------------------------------------------------

type Checked = Candidate & { ok: boolean; status: string; icon?: string; reason?: string; categories: string[]; slug: string };

async function check(c: Candidate): Promise<Checked> {
  const res = await get(c.url);
  const html = res?.ok ? res.body : "";
  const meta = html ? pageMeta(html, res!.url) : {};
  const name = c.name.length > 2 && !/\//.test(c.name) ? c.name : nameFromTitle(meta.title ?? c.name);
  const description = meta.description && meta.description.length > 30 ? meta.description : c.description || meta.title || "";
  const context = `${c.context} ${text(html).slice(0, 20_000)}`;
  const network = networkOf(c.context || context);
  const reason = !res ? "site did not answer" : res.ok && !mentionsCkb(`${context} ${meta.title ?? ""} ${meta.description ?? ""}`) ? "site does not mention CKB" : !res.ok ? `site returned HTTP ${res.status}` : network === "testnet" ? "testnet only" : PROTOTYPE.test(c.context) ? "described as a demo or prototype" : !description ? "no description found" : undefined;
  return { ...c, name, description, ok: !reason, status: res ? String(res.status) : "no answer", icon: meta.icon, reason, categories: guessCategories(`${name} ${description}`), slug: slugify(name) };
}

async function writeLogo(slug: string, icon: string) {
  try {
    const res = await fetch(icon, { headers: UA, signal: AbortSignal.timeout(20_000) });
    if (!res.ok) return false;
    const img = sharp(Buffer.from(await res.arrayBuffer()), { density: 300 });
    const { width = 0, height = 0, format } = await img.metadata();
    const size = format === "svg" ? 256 : Math.min(256, Math.max(width, height));
    if (size < 64) return false; // too small to look right in the grid; the identicon is better
    await img.resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 88 }).toFile(path.join(LOGOS_DIR, `${slug}.webp`));
    return true;
  } catch {
    return false;
  }
}

function report(proposed: Checked[], held: Checked[], notes: string[], logos: Set<string>): string {
  const row = (c: Checked, extra: string) => `| ${c.name} | ${c.url} | ${c.github ?? ""} | ${extra} | ${c.source.replace(/^.*?: /, "")} |`;
  return [
    "Weekly discovery of CKB projects that are not listed yet, from [CKB Pulse](https://pulse-lab.lusocryptolabs.com/) and the [CKB Ecosystem Biweekly Update](https://talk.nervos.org/t/9821).",
    "",
    ...notes.map((n) => `- ${n}`),
    "",
    `## Proposed (${proposed.length})`,
    "",
    proposed.length ? "| Project | Site | GitHub | Categories (guessed) | Found in |\n|---|---|---|---|---|" : "None this week.",
    ...proposed.map((c) => row(c, `${c.categories.join(", ")}${logos.has(c.slug) ? "" : " · no logo"}`)),
    "",
    "### Before merging, for each file",
    "",
    "- [ ] It is live on CKB or Fiber mainnet and usable today (testnet and demos stay on CKB Pulse).",
    "- [ ] Name, url and tagline are right; the tagline is one plain sentence.",
    "- [ ] Categories fit (the guess is keyword-based); `community: true` only for independent builders.",
    "- [ ] An About text from the project's own site or announcement, facts only.",
    "- [ ] The logo looks right on dark and light, or there is none and the identicon is used.",
    "- [ ] Not a project for the directory? Delete the file and its logo, and add the site or repo to `content/discovery-ignore.yaml` so it is not proposed again.",
    "",
    `## Held back (${held.length})`,
    "",
    held.length ? "| Project | Site | GitHub | Reason | Found in |\n|---|---|---|---|---|" : "None.",
    ...held.map((c) => row(c, c.reason ?? "")),
    "",
  ].join("\n");
}

async function main() {
  const files = readProjectFiles();
  const ignorePath = path.join(CONTENT_DIR, "discovery-ignore.yaml");
  const ignore = existsSync(ignorePath) ? ((YAML.parse(readFileSync(ignorePath, "utf8")) ?? []) as { match: string }[]).map((e) => e.match) : [];
  const projects = files.map((f) => f.data as { name: string; url: string; github?: string });
  const known = knownFrom(projects, ignore);
  const notes: string[] = [];

  const raw = [...(await fromPulse(known.repos, notes)), ...(await fromBiweekly(notes))];
  const seen = new Set<string>();
  const fresh = raw.filter((c) => {
    const k = siteKey(c.url)!;
    if (isKnown(c, known) || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
  const checked = await inBatches(fresh, 6, check);
  const taken = new Set(files.map((f) => f.slug));
  const proposed = checked.filter((c) => c.ok && c.slug && !taken.has(c.slug) && taken.add(c.slug));
  const held = checked.filter((c) => !proposed.includes(c));

  const logos = new Set<string>();
  if (WRITE) {
    for (const c of proposed) {
      writeFileSync(path.join(PROJECTS_DIR, `${c.slug}.md`), projectFile(c, c.categories, TODAY));
      if (c.icon && (await writeLogo(c.slug, c.icon))) logos.add(c.slug);
    }
  }
  const md = report(proposed, held, notes, logos);
  if (REPORT) writeFileSync(REPORT, md);
  else console.log(md);
  console.error(`Discovery: ${proposed.length} proposed, ${held.length} held back${WRITE ? `, ${proposed.length} file(s) written` : ""}.`);
}

main();
