import { cacheLife } from "next/cache";
import snapshot from "@/data/builders-snapshot.json";
import { parseTracker, TRACKER_README, type Build } from "./builders-source";

export type Builds = {
  builds: Build[];
  /** When the tracker was read, ISO */
  fetchedAt: string;
  /** true when the tracker could not be read and the committed snapshot is served instead */
  cached: boolean;
};

export async function fetchBuilds(): Promise<Omit<Builds, "cached">> {
  const res = await fetch(TRACKER_README, { signal: AbortSignal.timeout(20_000) });
  if (!res.ok) throw new Error(`tracker: HTTP ${res.status}`);
  return { builds: parseTracker(await res.text()), fetchedAt: new Date().toISOString() };
}

/**
 * The CKBuilder tracker's projects, revalidated hourly. When GitHub cannot be reached the page shows the committed
 * snapshot and says so; that fallback is only cached for minutes.
 */
export async function loadBuilds(): Promise<Builds> {
  "use cache";
  try {
    const live = await fetchBuilds();
    cacheLife("hours");
    return { ...live, cached: false };
  } catch (e) {
    console.warn(`[builders] ${e instanceof Error ? e.message : e}`);
    cacheLife("minutes");
    return { ...(snapshot as Omit<Builds, "cached">), cached: true };
  }
}
