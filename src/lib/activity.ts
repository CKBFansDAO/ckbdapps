import { cacheLife } from "next/cache";
import { type ActivityEntry, parseActivity } from "./activity-source";

// Same backend as the stats page. It collects GitHub on its own schedule and serves every project in one response,
// so the site never talks to GitHub and a build costs one request however many projects there are.
// ACTIVITY_API_URL points previews at a staging backend.
const API = process.env.ACTIVITY_API_URL ?? "https://api.ckbdapps.com/api/v1/nervos_explorers";

/**
 * Activity for every project, keyed by slug, revalidated hourly.
 * null means the backend could not be reached or answered nonsense: pages say so and link to the repo
 * directly instead of showing numbers that may be wrong. A failure is only cached for minutes,
 * so the pages pick the data up again soon after the backend recovers.
 */
export async function loadActivity(): Promise<Record<string, ActivityEntry> | null> {
  "use cache";
  try {
    const res = await fetch(`${API}/project_activity`, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const out = parseActivity(await res.json());
    cacheLife("hours");
    return out;
  } catch (e) {
    console.warn(`[activity] ${e instanceof Error ? e.message : e}`);
    cacheLife("minutes");
    return null;
  }
}
