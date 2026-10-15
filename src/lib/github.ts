import { cacheLife } from "next/cache";

export type RepoSignals = { license?: string; lastCommit?: string; stars: number };

// Same backend as the stats page. The backend refreshes GitHub on its own schedule and serves every repo in one response,
// so the site never talks to api.github.com and a build costs one request however many projects there are.
const API = "https://api.ckbdapps.com/api/v1/nervos_explorers";

/**
 * Signals for all projects: `{ "owner/repo": { license?, lastCommit?, stars } }`.
 * Refreshed hourly. If the backend is down this is empty, so the Signals panel hides instead of showing wrong numbers.
 */
export async function loadRepoSignals(): Promise<Record<string, RepoSignals>> {
  "use cache";
  cacheLife("hours");
  try {
    const res = await fetch(`${API}/github_signals`, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return ((await res.json()) as { repos: Record<string, RepoSignals> }).repos ?? {};
  } catch (e) {
    console.warn(`[github-signals] ${e instanceof Error ? e.message : e}`);
    return {};
  }
}
