import { cacheLife } from "next/cache";
import snapshot from "@/data/stats-snapshot.json";
import { fetchStats, type StatsData } from "./stats-source";

export type StatsResult = StatsData & {
  /** true when the live API failed and the committed snapshot is served instead */
  cached: boolean;
};

/** Hourly revalidation; the page says so and falls back to the snapshot when the API is down. */
export async function loadStats(): Promise<StatsResult> {
  "use cache";
  cacheLife("hours");
  try {
    return { ...(await fetchStats()), cached: false };
  } catch {
    return { ...(snapshot as StatsData), cached: true };
  }
}
