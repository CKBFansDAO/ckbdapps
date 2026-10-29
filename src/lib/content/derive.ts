import { taxonomy, type GroupId, type L10n, type ProjectData } from "./schema";

const catGroup = new Map(taxonomy.categories.map((c) => [c.id, c.group]));
const FALLBACK_GROUP = taxonomy.group_priority[taxonomy.group_priority.length - 1];

/** First group in `group_priority` that one of the categories maps to (wallets > apps > assets > infra > eco). */
export function groupOf(categories: readonly string[]): GroupId {
  const groups = new Set(categories.map((c) => catGroup.get(c)));
  return taxonomy.group_priority.find((g) => groups.has(g)) ?? FALLBACK_GROUP;
}

/** Requested locale -> en -> zh. */
export function pick(value: L10n, locale: string): string {
  if (typeof value === "string") return value;
  return (locale === "zh" ? value.zh : locale === "en" ? value.en : undefined) ?? value.en ?? value.zh ?? "";
}

export function categoryLabel(id: string, locale: string): string {
  const c = taxonomy.categories.find((x) => x.id === id);
  return !c ? id : locale === "zh" ? c.zh : (c.en ?? c.id);
}

export function groupLabel(id: GroupId, locale: string): string {
  const g = taxonomy.groups.find((x) => x.id === id);
  return !g ? id : locale === "zh" ? g.zh : g.en;
}

const DAY = 86_400_000;
export const STALE_AFTER_DAYS = 365;

/** Whole days since the `verified` date (UTC). */
export function daysSince(isoDate: string, now = Date.now()): number {
  return Math.floor((now - Date.parse(`${isoDate}T00:00:00Z`)) / DAY);
}

export const isStale = (verified: string, now = Date.now()) => daysSince(verified, now) > STALE_AFTER_DAYS;

/**
 * Two-letter cell label for the ecosystem map: "JoyID" -> "Jo", "万向区块链" -> "万".
 * A leading "CKB" is skipped when enough is left, or half the map would read "Ck": "CKB Guardian" -> "Gu".
 */
export function sym(name: string): string {
  const all = name.replace(/[^\p{L}\p{N}]/gu, "");
  const rest = all.replace(/^ckb/i, "");
  const n = rest.length >= 2 ? rest : all;
  if (!n) return "?";
  if (/[\u4e00-\u9fff]/.test(n[0])) return n[0];
  return n[0].toUpperCase() + (n[1] ?? "").toLowerCase();
}

type Similarable = { slug: string; name: string; categories: string[]; group: GroupId };

/** Up to `n` projects sharing categories (one point each) or the group (half a point), as in the prototype. */
export function similarProjects<T extends Similarable>(p: Similarable, all: readonly T[], n = 3): T[] {
  return all
    .filter((o) => o.slug !== p.slug)
    .map((o) => ({ o, score: o.categories.filter((c) => p.categories.includes(c)).length + (o.group === p.group ? 0.5 : 0) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.o.name.localeCompare(b.o.name, "en"))
    .slice(0, n)
    .map((x) => x.o);
}

/** Secondary links for the project hero, in display order. */
export function projectLinks(p: Pick<ProjectData, "links" | "github">): { label: string; href: string }[] {
  const l = p.links ?? {};
  const out: { label: string; href: string }[] = [];
  if (l.x) out.push({ label: "X", href: `https://x.com/${l.x}` });
  if (l.telegram) out.push({ label: "Telegram", href: `https://t.me/${l.telegram}` });
  if (l.discord) out.push({ label: "Discord", href: /^https?:\/\//.test(l.discord) ? l.discord : `https://discord.gg/${l.discord}` });
  if (l.docs) out.push({ label: "Docs", href: l.docs });
  if (p.github) out.push({ label: "GitHub", href: `https://github.com/${p.github}` });
  return out;
}
