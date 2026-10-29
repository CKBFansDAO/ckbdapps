/**
 * Home page picks, chosen by rule instead of by hand: "You might like" from the projects a visitor
 * opened on this device, community projects at random, and the newest listings.
 * Pure: the random source is passed in, so tests and the static HTML can use a seeded one.
 */

export type PickItem = { slug: string; cats: readonly string[]; group: string; community: boolean };

/** Tiles per block: two rows of three; one row; five plus the "see all / add yours" card. */
export const LIKE_COUNT = 6;
export const COMMUNITY_COUNT = 5;
export const NEWEST_COUNT = 3;
/** Testnet proofs drawn at random for the last block of "Start here". */
export const PROOF_COUNT = 3;

/** Groups a first visit (no history yet) is drawn from: apps, wallets, assets and identity. */
export const START_GROUPS: readonly string[] = ["apps", "wallets", "assets"];

/** Mulberry32: a small seeded generator, so the static HTML gets the same picks on every render. */
export function seeded(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates on a copy. */
export function shuffle<T>(xs: readonly T[], rand: () => number): T[] {
  const out = [...xs];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Up to `n` projects sharing categories with the ones viewed (the most recent view weighs most),
 * never one already viewed or in `exclude` (shown elsewhere on the page), topped up at random from
 * START_GROUPS. `personal` is true when at least one pick came from the history.
 */
export function recommend<T extends PickItem>(
  pool: readonly T[],
  viewed: readonly string[],
  n: number,
  rand: () => number,
  exclude: ReadonlySet<string> = new Set(),
): { items: T[]; personal: boolean } {
  const bySlug = new Map(pool.map((p) => [p.slug, p]));
  const seen = new Set(viewed.filter((s) => bySlug.has(s)));
  const score = new Map<string, number>();
  [...seen].forEach((s, i) => {
    const weight = 1 / (i + 1);
    for (const p of pool) {
      if (seen.has(p.slug) || exclude.has(p.slug)) continue;
      const shared = p.cats.filter((c) => bySlug.get(s)!.cats.includes(c)).length;
      if (shared) score.set(p.slug, (score.get(p.slug) ?? 0) + shared * weight);
    }
  });
  // Shuffle first so the stable sort breaks ties at random.
  const related = shuffle(
    pool.filter((p) => score.has(p.slug)),
    rand,
  )
    .sort((a, b) => score.get(b.slug)! - score.get(a.slug)!)
    .slice(0, n);
  const taken = new Set([...seen, ...exclude, ...related.map((p) => p.slug)]);
  const fill = shuffle(
    pool.filter((p) => START_GROUPS.includes(p.group) && !taken.has(p.slug)),
    rand,
  ).slice(0, n - related.length);
  return { items: [...related, ...fill], personal: related.length > 0 };
}

/** `n` community projects at random. */
export const communityPicks = <T extends PickItem>(pool: readonly T[], n: number, rand: () => number): T[] =>
  shuffle(
    pool.filter((p) => p.community),
    rand,
  ).slice(0, n);

/** The `n` most recently listed projects; projects without a `listed` date never appear. */
export const newestListed = <T extends { listed?: string; name: string }>(pool: readonly T[], n: number): T[] =>
  pool
    .filter((p) => p.listed)
    .sort((a, b) => b.listed!.localeCompare(a.listed!) || a.name.localeCompare(b.name, "en"))
    .slice(0, n);

/** The view history kept in the browser: newest first, no repeats, at most `max` slugs. */
export const pushViewed = (list: readonly string[], slug: string, max = 12): string[] =>
  [slug, ...list.filter((s) => s !== slug)].slice(0, max);
