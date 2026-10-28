// Pure helpers for scripts/discover-projects.ts: turn CKB Pulse repos and biweekly-update links into
// candidate project files. No I/O here, so the rules can be unit tested.
import YAML from "yaml";

export type Candidate = {
  name: string;
  url: string;
  description: string;
  github?: string;
  /** Where it was found, for the review table */
  source: string;
  /** Text the network check reads: the forum post or the homepage */
  context: string;
};

// Sites that host articles, chat or code rather than a product: a link there is never a project's home.
const NOT_A_HOMEPAGE = [
  "talk.nervos.org", "github.com", "gist.github.com", "raw.githubusercontent.com", "x.com", "twitter.com", "t.me",
  "discord.com", "discord.gg", "youtube.com", "youtu.be", "reddit.com", "medium.com", "mirror.xyz", "paragraph.com",
  "substack.com", "metaforo.io", "luma.com", "lu.ma", "npmjs.com", "crates.io", "docs.google.com", "notion.so",
  "linkedin.com", "explorer.nervos.org", "testnet.explorer.nervos.org", "pudge.explorer.nervos.org", "dao.ckb.community",
];

// Hosting domains shared by many apps: the subdomain (and for GitHub Pages the first path segment) is the site.
const PATH_SCOPED = ["github.io"];
const SHARED_HOSTS = ["github.io", "vercel.app", "netlify.app", "pages.dev", "onrender.com", "fly.dev", "web.app", "surge.sh"];

/** "live.ckbccc.com" -> "ckbccc.com"; on shared hosting the app's own subdomain is kept. */
function orgDomain(host: string): string {
  if (SHARED_HOSTS.some((d) => host === d || host.endsWith(`.${d}`))) return host;
  const parts = host.split(".");
  // Two-label public suffixes such as .co.uk or .com.cn keep three labels.
  const keep = parts.length > 2 && /^(co|com|org|net|gov|edu)$/.test(parts[parts.length - 2]) ? 3 : 2;
  return parts.slice(-keep).join(".");
}

const bareHost = (u: URL) => u.hostname.toLowerCase().replace(/^www\./, "");

/** A key that is equal for two URLs of the same site: host, plus the first path segment on GitHub Pages. */
export function siteKey(url: string): string | undefined {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return undefined;
  }
  if (!/^https?:$/.test(u.protocol)) return undefined;
  const host = bareHost(u);
  if (PATH_SCOPED.some((d) => host.endsWith(`.${d}`))) {
    const first = u.pathname.split("/").filter(Boolean)[0];
    return first ? `${host}/${first.toLowerCase()}` : host;
  }
  return host;
}

/**
 * The front page of a site rather than an article, store listing or event page on it: path "/" (or one
 * segment on GitHub Pages, where that segment is the site). Used for links found in posts, where deeper
 * links are almost always about a project rather than the project itself.
 */
export function isSiteRoot(url: string): boolean {
  const key = siteKey(url);
  if (!key) return false;
  const depth = new URL(url).pathname.split("/").filter(Boolean).length;
  return depth === (key.includes("/") ? 1 : 0);
}

/** The page is about CKB at all (a link in a CKB post can still point at a partner or a library). */
export const mentionsCkb = (text: string) => /\b(ckb|nervos|fiber network|rgb\+\+|spore|joyid)\b/i.test(text);

/** "Introducing FiberScope: explorer, route readiness…" -> "FiberScope". */
export function nameFromThreadTitle(title: string): string {
  const t = title.replace(/^\s*(\[[^\]]*\]\s*)+/, "").replace(/^(introducing|announcing|meet|launching|presenting)\s+/i, "");
  return t.split(/\s[|·—–-]\s|:\s|[：，,(（]/)[0].replace(/\s+(is|are)\s+(live|here|out)\b.*$/i, "").trim();
}

export function isHomepageCandidate(url: string): boolean {
  const key = siteKey(url);
  if (!key) return false;
  const host = key.split("/")[0];
  return !NOT_A_HOMEPAGE.some((d) => host === d || host.endsWith(`.${d}`));
}

/** `owner/repo` from a GitHub repository URL, lowercased; undefined for anything else. */
export function githubRepo(url: string): string | undefined {
  const m = /^https?:\/\/(?:www\.)?github\.com\/([\w.-]+)\/([\w.-]+?)(?:\.git)?(?:[/?#]|$)/i.exec(url);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : undefined;
}

export type Known = { sites: Set<string>; domains: Set<string>; repos: Set<string>; names: Set<string> };

const nameKey = (s: string) => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

/** Everything that already identifies a listed project, plus the ignore list. */
export function knownFrom(
  projects: { name: string; url: string; github?: string; links?: { docs?: string } }[],
  ignore: string[],
): Known {
  const known: Known = { sites: new Set(), domains: new Set(), repos: new Set(), names: new Set() };
  for (const p of projects) {
    const k = siteKey(p.url);
    // A project whose url is its GitHub repo is known by the repo, not by github.com.
    if (k && isHomepageCandidate(p.url)) {
      known.sites.add(k);
      known.domains.add(orgDomain(k.split("/")[0]));
    }
    const repo = p.github?.toLowerCase() ?? githubRepo(p.url);
    if (repo) known.repos.add(repo);
    known.names.add(nameKey(p.name));
  }
  for (const entry of ignore) {
    const repo = /^[\w.-]+\/[\w.-]+$/.test(entry) ? entry.toLowerCase() : githubRepo(entry);
    if (repo) known.repos.add(repo);
    else {
      const k = siteKey(entry);
      if (k) {
        known.sites.add(k);
        known.domains.add(orgDomain(k.split("/")[0]));
      }
    }
  }
  return known;
}

export function isKnown(c: Pick<Candidate, "name" | "url" | "github">, known: Known): boolean {
  const k = siteKey(c.url);
  return (
    // Another site of a listed project's own domain (docs.x.com, app.x.com) is that project, not a new one.
    (!!k && (known.sites.has(k) || known.domains.has(orgDomain(k.split("/")[0])))) || (!!c.github && known.repos.has(c.github.toLowerCase())) || known.names.has(nameKey(c.name))
  );
}

export type Network = "mainnet" | "testnet" | "unknown";

/** Testnet when the text says it is testnet-only, or names testnet (or Pudge) and never mainnet. */
export function networkOf(text: string): Network {
  if (/\b(testnet[- ]only|only (on|available on|runs on|works on) (the )?testnet|not (yet )?(on|deployed (on|to)) mainnet)\b|(仅|只)(在|支持|能在)?\s*(testnet|测试网)/i.test(text)) return "testnet";
  const main = /\bmain-?net\b|主网/i.test(text);
  const test = /\btest-?net\b|\bpudge\b|测试网/i.test(text);
  return main ? "mainnet" : test ? "testnet" : "unknown";
}

/** Words that mark a demo, prototype or unfinished product; such candidates are reported, not filed. */
export const PROTOTYPE = /\b(demo|poc|proof[- ]of[- ]concept|prototype|experiment(al)?|hackathon|not maintained|wip|alpha)\b/i;

const CATEGORY_RULES: [RegExp, string][] = [
  [/\bwallet\b/i, "Wallet"],
  [/\b(dex|swap|order ?book)\b/i, "DEX"],
  [/\bmarketplace\b/i, "Marketplace"],
  [/\bstablecoin\b/i, "Stablecoin"],
  [/\b(lending|yield|defi)\b/i, "DeFi"],
  [/\b(pay(ment)?s?|tip(s|ping)?|invoice|checkout)\b/i, "Payment"],
  [/\bbridge\b/i, "Bridges"],
  [/\bnervos ?dao\b/i, "Nervos DAO"],
  [/\b(dobs?|spore)\b/i, "DOBs"],
  [/\bnfts?\b/i, "NFT"],
  [/\b(did|identity|naming|\.cell|\.bit)\b/i, "DID"],
  [/\bexplorer\b/i, "Explorer"],
  [/\bfiber\b/i, "Fiber"],
  [/\brgb\+\+/i, "RGB++"],
];

/** First guess from the description; a reviewer corrects it in the pull request. Falls back to Tools. */
export function guessCategories(text: string): string[] {
  const out = CATEGORY_RULES.filter(([re]) => re.test(text)).map(([, id]) => id);
  return out.length ? [...new Set(out)].slice(0, 3) : ["Tools"];
}

export function slugify(name: string): string {
  return name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The site name from a <title> such as "Scryve | Web3 publishing" or "cellula.id: get paid by name". */
export function nameFromTitle(title: string): string {
  return title.split(/\s[|·—–-]\s|:\s/)[0].trim();
}

/** One sentence, at most `max` characters, for the tagline. Forum greetings ("Hi everyone,") are skipped. */
export function firstSentence(text: string, max = 200): string {
  const t = text
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^((hi|hello|hey|gm)\b[^.!?,]*[,.!]\s*)+/i, "");
  const m = /^(.{12,}?[.!?。！？])(\s|$)/.exec(t);
  const s = m ? m[1] : t;
  return s.length <= max ? s : `${s.slice(0, max - 1).replace(/\s+\S*$/, "")}…`;
}

export type Link = { text: string; href: string };

/** Anchors in Discourse "cooked" HTML, with tags stripped from the anchor text. */
export function linksIn(html: string): Link[] {
  const out: Link[] = [];
  for (const m of html.matchAll(/<a\s[^>]*?href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const text = decode(m[2].replace(/<[^>]+>/g, "")).trim();
    if (text && !text.startsWith("@")) out.push({ text, href: decode(m[1]) });
  }
  return out;
}

export function decode(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/** Title, description and the best square icon declared in a page's <head>. */
export function pageMeta(html: string, base: string): { title?: string; description?: string; icon?: string } {
  const head = html.slice(0, html.search(/<\/head>/i) + 1 || 200_000);
  const attr = (tag: string, name: string) => new RegExp(`\\b${name}=["']([^"']*)["']`, "i").exec(tag)?.[1];
  const metas = [...head.matchAll(/<meta\b[^>]*>/gi)].map((m) => m[0]);
  const meta = (key: string) => {
    const tag = metas.find((t) => (attr(t, "name") ?? attr(t, "property"))?.toLowerCase() === key);
    return tag && decode(attr(tag, "content") ?? "");
  };
  const title = /<title[^>]*>([^<]*)<\/title>/i.exec(head)?.[1];
  // Prefer the large touch icon, then a vector icon, then any PNG icon; .ico files are too small to use.
  const icons = [...head.matchAll(/<link\b[^>]*>/gi)]
    .map((m) => m[0])
    .filter((t) => /\brel=["'][^"']*icon/i.test(t))
    .map((t) => ({ rel: attr(t, "rel")!.toLowerCase(), href: attr(t, "href") ?? "", type: attr(t, "type") ?? "" }))
    .filter((i) => i.href && !i.href.startsWith("data:") && !/\.ico(\?|$)/i.test(i.href));
  const rank = (i: (typeof icons)[number]) =>
    i.rel.includes("apple-touch") ? 0 : /svg/.test(i.type) || /\.svg(\?|$)/i.test(i.href) ? 1 : 2;
  const icon = icons.sort((a, b) => rank(a) - rank(b))[0];
  return {
    title: title && decode(title).trim(),
    description: meta("description") || meta("og:description") || undefined,
    icon: icon && new URL(icon.href, base).href,
  };
}

/** The starter project file for a candidate. No About text: the reviewer writes it from the sources. */
export function projectFile(c: Candidate, categories: string[], date: string): string {
  // Same layout as the hand-written files: scalars quoted only when YAML needs it, categories as a flow list.
  const scalar = (v: string) => YAML.stringify(v, { lineWidth: 0 }).trim();
  const lines = [
    `name: ${scalar(c.name)}`,
    `url: ${scalar(c.url)}`,
    `tagline: ${scalar(firstSentence(c.description))}`,
    `categories: [${categories.join(", ")}]`,
    ...(c.github ? [`github: ${c.github}`] : []),
    `verified: ${date}`,
    `listed: ${date}`,
  ];
  return `---\n${lines.join("\n")}\n---\n`;
}
