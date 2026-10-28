import { cacheLife } from "next/cache";
import snapshot from "@/data/stats-snapshot.json";
import { fetchStats, type StatsData } from "./stats-source";

export type StatsResult = StatsData & {
  /** true when the live API failed and the committed snapshot is served instead */
  cached: boolean;
};

/**
 * Hourly revalidation; the page says so and falls back to the snapshot when the API is down.
 * The fallback is only cached for minutes, so live data returns soon after the API recovers.
 */
export async function loadStats(): Promise<StatsResult> {
  "use cache";
  try {
    const live = await fetchStats();
    cacheLife("hours");
    return { ...live, cached: false };
  } catch {
    cacheLife("minutes");
    return { ...(snapshot as StatsData), cached: true };
  }
}
