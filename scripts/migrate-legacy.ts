/**
 * One-off: legacy ckbdapps JSON -> content/projects/*.md, redirects.json, public/logos/*.webp
 *
 *   pnpm migrate:legacy [--legacy legacy] [--git <clone of CKBFansDAO/ckbdapps-legacy>] [--date YYYY-MM-DD]
 *
 * --legacy  checkout of the old repo (read only)
 * --git     a git clone of the old repo, used only for the last commit date of each config.json
 * --date    migration date, defaults to today (UTC)
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import sharp from "sharp";
import YAML from "yaml";
import { LOGOS_DIR, PROJECTS_DIR } from "@/lib/content/load";
import { CATEGORY_IDS, CONTENT_DIR, taxonomy, type L10n, type ProjectData } from "@/lib/content/schema";

const { values: args } = parseArgs({
  options: {
    legacy: { type: "string", default: "legacy" },
    git: { type: "string" },
    date: { type: "string", default: new Date().toISOString().slice(0, 10) },
  },
});
const PUB = path.resolve(args.legacy!, "public");
const TODAY = args.date!;
// Detail-only project the owner asked to migrate (it is referenced by the Spark grant).
const EXTRA_FROM_DETAILS = ["quantumpurse"];

/* ---------- legacy shapes (only the fields we read) ---------- */
type Lang = { en?: string; ch?: string; en_US?: string; zh_CN?: string };
type ListItem = { project_name: string; path_name: string; categories: string[] };
type Config = {
  project_name: string;
  logo_file?: string;
  links?: Record<string, string | undefined>;
  en_US?: { project_summary?: string };
  zh_CN?: { project_summary?: string };
};
type Detail = {
  name: string;
  description?: Lang;
  logo?: string;
  tags?: { name: string }[];
  socialLinks?: Record<string, string | undefined>;
  websiteUrl?: string;
};
type HomeItem = { name: string; link?: string; dappId?: string; amount?: string; placeholder?: boolean; desc?: Lang | string };
const readJson = <T>(p: string): T | undefined => (existsSync(p) ? (JSON.parse(readFileSync(p, "utf8")) as T) : undefined);
const s = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/* ---------- report ---------- */
const report = {
  written: [] as string[],
  normalised: {} as Record<string, string[]>,
  community: [] as string[],
  slugChanges: {} as Record<string, string>,
  missingUrl: [] as string[],
  missingTagline: [] as string[],
  unknownCategory: [] as string[],
  missingLogo: [] as string[],
  logoErrors: [] as string[],
  githubDropped: [] as string[],
  linkDropped: [] as string[],
  verifiedDetail: [] as string[],
  verifiedGit: [] as string[],
  verifiedFlagged: [] as string[],
  detailsNotInList: [] as string[],
};

/* ---------- helpers ---------- */
const toSlug = (old: string) =>
  old
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function l10n(en: string, zh: string): L10n | undefined {
  if (en && zh && en !== zh) return { en, zh };
  return en || zh || undefined;
}

function parseUrl(raw: string): URL | undefined {
  try {
    const u = new URL(raw);
    return /^https?:$/.test(u.protocol) ? u : undefined;
  } catch {
    return undefined;
  }
}

const pathParts = (u: URL) => u.pathname.split("/").filter(Boolean);

/** https://x.com/foo -> foo */
function xHandle(raw: string): string | undefined {
  const u = parseUrl(raw);
  if (!u || !/^(www\.|mobile\.)?(x|twitter)\.com$/.test(u.hostname)) return undefined;
  const [h, ...rest] = pathParts(u);
  if (!h || rest.length || ["intent", "i", "home", "search"].includes(h)) return undefined;
  return h.replace(/^@/, "");
}

/** https://t.me/foo -> foo, https://t.me/+abc -> +abc */
function telegramPath(raw: string): string | undefined {
  const u = parseUrl(raw);
  if (!u || !/^(www\.)?(t\.me|telegram\.me)$/.test(u.hostname)) return undefined;
  return pathParts(u).join("/") || undefined;
}

/** https://github.com/owner/repo(.git)(/...) -> owner/repo; an org/user URL has no repo and is dropped */
function githubRepo(raw: string): string | undefined {
  const u = parseUrl(raw);
  if (!u || !/^(www\.)?github\.com$/.test(u.hostname)) return undefined;
  const [owner, repo] = pathParts(u);
  return owner && repo ? `${owner}/${repo.replace(/\.git$/, "")}` : undefined;
}

function gitDate(file: string): string | undefined {
  if (!args.git) return undefined;
  try {
    return execFileSync("git", ["-C", args.git, "log", "-1", "--format=%cs", "--", file], { encoding: "utf8" }).trim() || undefined;
  } catch {
    return undefined;
  }
}

async function writeLogo(slug: string, sources: (string | undefined)[]) {
  const src = sources.find((p): p is string => !!p && existsSync(p));
  if (!src) return report.missingLogo.push(slug);
  try {
    const img = sharp(src, { density: 300 });
    const { width = 256, height = 256 } = await img.metadata();
    const size = /\.svg$/i.test(src) ? 256 : Math.min(256, Math.max(width, height));
    await img
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .webp({ quality: 88 })
      .toFile(path.join(LOGOS_DIR, `${slug}.webp`));
  } catch (e) {
    report.logoErrors.push(`${slug}: ${path.relative(PUB, src)} (${e instanceof Error ? e.message : e})`);
  }
}

/** Front matter in schema order; categories as a flow list. */
function toMarkdown(p: ProjectData, body: string): string {
  const ordered = {
    name: p.name,
    url: p.url,
    tagline: p.tagline,
    categories: p.categories,
    ...(p.community ? { community: true } : {}),
    ...(p.links && Object.keys(p.links).length ? { links: p.links } : {}),
    ...(p.github ? { github: p.github } : {}),
    verified: p.verified,
  };
  const doc = new YAML.Document(ordered);
  (doc.get("categories", true) as YAML.YAMLSeq).flow = true;
  return `---\n${doc.toString({ lineWidth: 0, flowCollectionPadding: false })}---\n${body ? `\n${body}\n` : ""}`;
}

/* ---------- projects ---------- */
type Source = { oldSlug: string; name: string; categories: string[]; config?: Config; detail?: Detail; homeDesc?: Lang };

function sources(): Source[] {
  const list = readJson<{ dappList: ListItem[] }>(path.join(PUB, "dappList/dapps_list.json"))!.dappList;
  const inList = new Set(list.map((p) => p.path_name));
  const detailFor = (slug: string) => readJson<Detail>(path.join(PUB, "dappDetails", `${slug}.json`));
  const home = readJson<Record<string, HomeItem[]>>(path.join(PUB, "homeSections.json"))!;

  const detailsOnly = readdirSync(path.join(PUB, "dappDetails"))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.slice(0, -5))
    .filter((d) => !inList.has(d));
  report.detailsNotInList = detailsOnly.map((d) => (EXTRA_FROM_DETAILS.includes(d) ? `${d} (migrated)` : d));

  const out: Source[] = list.map((p) => ({
    oldSlug: p.path_name,
    name: s(p.project_name),
    categories: p.categories,
    config: readJson<Config>(path.join(PUB, "dappList", p.path_name, "config.json")),
    detail: detailFor(p.path_name),
  }));
  for (const d of EXTRA_FROM_DETAILS.filter((x) => detailsOnly.includes(x))) {
    const detail = detailFor(d)!;
    const homeEntry = Object.values(home)
      .flat()
      .find((h) => h.link === `/${d}` && typeof h.desc === "object");
    out.push({
      oldSlug: d,
      name: s(detail.name),
      categories: (detail.tags ?? []).map((t) => t.name),
      detail,
      homeDesc: homeEntry?.desc as Lang | undefined,
    });
  }
  return out;
}

const aliases = taxonomy.aliases;
const validCats = new Set<string>(CATEGORY_IDS);

async function migrateProject(src: Source, slugMap: Map<string, string>) {
  const slug = toSlug(src.oldSlug);
  slugMap.set(src.oldSlug, slug);
  if (slug !== src.oldSlug) report.slugChanges[src.oldSlug] = slug;
  const { config, detail } = src;
  const cl = config?.links ?? {};
  const dl = detail?.socialLinks ?? {};

  // categories
  let community = false;
  const categories: string[] = [];
  for (const raw of src.categories.map(s)) {
    if (raw === "Community-Driven") {
      community = true;
      continue;
    }
    const id = aliases[raw] ?? raw;
    if (id !== raw) (report.normalised[`${raw} -> ${id}`] ??= []).push(slug);
    if (!validCats.has(id)) report.unknownCategory.push(`${slug}: ${raw}`);
    else if (!categories.includes(id)) categories.push(id);
  }
  if (community) report.community.push(slug);

  // url: never invented
  const url = [s(detail?.websiteUrl), s(cl.official)].find((u) => parseUrl(u));
  if (!url) return report.missingUrl.push(`${src.oldSlug} (${src.name})`);

  // tagline: the short description
  const tagline = l10n(
    s(config?.en_US?.project_summary) || s(src.homeDesc?.en),
    s(config?.zh_CN?.project_summary) || s(src.homeDesc?.ch),
  );
  if (!tagline) return report.missingTagline.push(slug);
  if (!categories.length) return report.unknownCategory.push(`${slug}: no valid category left`);

  // links: detail file first (newer), then config
  const links: NonNullable<ProjectData["links"]> = {};
  const pickLink = (key: "twitter" | "telegram" | "discord" | "docs") => s(dl[key]) || s(cl[key]);
  const tw = pickLink("twitter");
  if (tw) {
    const h = xHandle(tw);
    if (h) links.x = h;
    else report.linkDropped.push(`${slug}: x ${tw}`);
  }
  const tg = pickLink("telegram");
  if (tg) {
    const h = telegramPath(tg);
    if (h) links.telegram = h;
    else report.linkDropped.push(`${slug}: telegram ${tg}`);
  }
  const dc = pickLink("discord");
  if (dc) links.discord = dc;
  const docs = pickLink("docs");
  if (docs && parseUrl(docs)) links.docs = docs;

  const gh = s(dl.github) || s(cl.github);
  const github = gh ? githubRepo(gh) : undefined;
  if (gh && !github) report.githubDropped.push(`${slug}: ${gh}`);

  // verified
  let verified = TODAY;
  if (detail) report.verifiedDetail.push(slug);
  else {
    const d = gitDate(`public/dappList/${src.oldSlug}/config.json`);
    if (d) {
      verified = d;
      report.verifiedGit.push(`${slug} ${d}`);
    } else report.verifiedFlagged.push(slug);
  }

  const body = s(detail?.description?.en) || s(detail?.description?.ch);
  const project: ProjectData = {
    name: src.name,
    url,
    tagline,
    categories,
    community,
    links: Object.keys(links).length ? links : undefined,
    github,
    verified,
    testnet: false, // the legacy site listed mainnet projects only; toMarkdown leaves the default out
  };
  writeFileSync(path.join(PROJECTS_DIR, `${slug}.md`), toMarkdown(project, body));
  report.written.push(slug);

  const logoFromDetail = detail?.logo ? path.join(PUB, detail.logo) : undefined;
  const logoFromConfig = config?.logo_file ? path.join(PUB, "dappList", src.oldSlug, config.logo_file) : undefined;
  await writeLogo(slug, [logoFromConfig, logoFromDetail]);
}

/* ---------- run ---------- */
async function main() {
  if (!existsSync(PUB)) throw new Error(`legacy public/ not found at ${PUB}`);
  mkdirSync(PROJECTS_DIR, { recursive: true });
  mkdirSync(LOGOS_DIR, { recursive: true });

  const slugMap = new Map<string, string>();
  const all = sources();
  const seen = new Map<string, string>();
  for (const src of all) {
    const slug = toSlug(src.oldSlug);
    if (seen.has(slug)) throw new Error(`slug collision: ${src.oldSlug} and ${seen.get(slug)} -> ${slug}`);
    seen.set(slug, src.oldSlug);
  }
  for (const src of all) await migrateProject(src, slugMap);
  writeFileSync(path.join(CONTENT_DIR, "redirects.json"), JSON.stringify(report.slugChanges, null, 2) + "\n");

  const r = report;
  const sec = (title: string, items: string[]) =>
    console.log(`\n## ${title} (${items.length})\n${items.length ? items.map((i) => `- ${i}`).join("\n") : "- none"}`);
  const secInline = (title: string, items: string[]) => console.log(`\n## ${title} (${items.length})\n- ${items.join(", ") || "none"}`);
  console.log(`# Legacy migration report (${TODAY})`);
  console.log(`\nSource: ${PUB}${args.git ? `\nCommit dates from: ${args.git}` : ""}`);
  console.log(`Projects in list: ${all.length - EXTRA_FROM_DETAILS.length}, extra from detail files: ${EXTRA_FROM_DETAILS.length}, written: ${r.written.length} (${r.written.length - EXTRA_FROM_DETAILS.length} from the list), logos missing: ${r.missingLogo.length}`);
  sec("Normalised categories", Object.entries(r.normalised).map(([k, v]) => `${k}: ${v.join(", ")}`));
  secInline("Community-Driven -> community: true", r.community);
  sec("Slug changes (also in content/redirects.json)", Object.entries(r.slugChanges).map(([a, b]) => `${a} -> ${b}`));
  sec("NOT WRITTEN: missing website URL", r.missingUrl);
  sec("NOT WRITTEN: missing tagline", r.missingTagline);
  sec("Unknown categories", r.unknownCategory);
  sec("Detail files not in the list", r.detailsNotInList);
  sec("Missing logos (identicon fallback)", r.missingLogo);
  sec("Logo conversion errors (identicon fallback)", r.logoErrors);
  sec("GitHub links dropped (not owner/repo)", r.githubDropped);
  sec("Social links dropped (unrecognised)", r.linkDropped);
  secInline("verified = migration date (legacy detail file existed)", r.verifiedDetail);
  sec("verified = last commit of legacy config.json", r.verifiedGit);
  sec("FLAGGED: verified = migration date, no commit date found", r.verifiedFlagged);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
