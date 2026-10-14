/**
 * Live CKB market series for the stats page, from the legacy statistics API.
 * Pure fetch + normalize — imported by scripts/snapshot-stats.ts (tsx) and
 * src/lib/stats.ts (the cached server loader). No Next APIs in here.
 */

const API = "https://api.ckbdapps.com/api/v1/nervos_explorers";

/** The Satoshi gift cell holds this many CKB; it is constant and would flatten the occupancy chart. */
export const GIFT = 5_040_000_000;
export const DAY_S = 86_400;

/** "Miner release" markers on the hash-rate chart (legacy statistics page, eight events). */
export const MINER_RELEASES = [
  "2020-03-06",
  "2020-03-31",
  "2020-10-19",
  "2021-01-08",
  "2021-08-07",
  "2021-12-02",
  "2022-03-02",
  "2023-01-05",
] as const;

export type StatsData = {
  /** unix ms when this payload was fetched from the API */
  fetchedAt: number;
  /** unix seconds of the day the series start (index 0) */
  t0: number;
  market: { total: number; circ: number; dao: number; trade: number };
  /** USD price per day, null-free */
  price: number[];
  /** average hash rate per day, already multiplied by 1000 (legacy behaviour) */
  hash: number[];
  /** occupied CKB per day, minus the Satoshi gift cell */
  occ: number[];
};

type MarketJson = {
  circulating_supply: string;
  total_supply: string;
  nervos_dao: { total_deposit: string };
};
type PriceJson = { created_at_unix: number; price: string | null }[];
type HashJson = { created_at_unix: number; avg_hash_rate: string }[];
type OccJson = { created_at_unix: number; total_occupied: number }[];

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}/${path}`, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

export async function fetchStats(): Promise<StatsData> {
  const [market, price, hash, occ] = await Promise.all([
    get<MarketJson>("market_data"),
    get<PriceJson>("daily_price"),
    get<HashJson>("daily_avg_hash_rate"),
    get<OccJson>("daily_occupied_ckb"),
  ]);

  const dayOf = (u: number) => Math.floor(u / DAY_S);
  const toMap = <R extends { created_at_unix: number }>(rows: R[], v: (r: R) => number | null) => {
    const m = new Map<number, number>();
    for (const r of rows) {
      const x = v(r);
      if (x != null && Number.isFinite(x)) m.set(dayOf(r.created_at_unix), x);
    }
    return m;
  };
  const priceM = toMap(price, (r) => (r.price == null ? null : parseFloat(r.price)));
  const hashM = toMap(hash, (r) => parseFloat(r.avg_hash_rate) * 1000);
  const occM = toMap(occ, (r) => r.total_occupied - GIFT);

  // Align the three daily series on one index: latest common start, earliest common end.
  const first = (m: Map<number, number>) => Math.min(...m.keys());
  const last = (m: Map<number, number>) => Math.max(...m.keys());
  const t0d = Math.max(first(priceM), first(hashM), first(occM));
  const tNd = Math.min(last(priceM), last(hashM), last(occM));
  if (tNd <= t0d) throw new Error("daily series do not overlap");

  // Forward-fill interior gaps; days before a series' first value take that first value.
  const col = (m: Map<number, number>) => {
    const out = new Array<number>(tNd - t0d + 1);
    let carry = m.get(t0d);
    if (carry == null)
      for (let d = t0d; d <= tNd && carry == null; d++) carry = m.get(d);
    for (let d = t0d; d <= tNd; d++) {
      const v = m.get(d);
      if (v != null) carry = v;
      out[d - t0d] = carry ?? 0;
    }
    return out;
  };

  const circ = parseFloat(market.circulating_supply);
  const dao = parseFloat(market.nervos_dao.total_deposit) * 1e-8;
  return {
    fetchedAt: Date.now(),
    t0: t0d * DAY_S,
    market: { total: parseFloat(market.total_supply), circ, dao, trade: circ - dao },
    price: col(priceM),
    hash: col(hashM),
    occ: col(occM),
  };
}
