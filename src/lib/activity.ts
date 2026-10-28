import { cacheLife } from "next/cache";
import { parseRepo, type RepoActivity } from "./activity-source";

// CKB Pulse follows the GitHub activity of the CKB ecosystem and serves it as JSON, so the site never talks to
// GitHub itself. PULSE_URL points previews at another instance (Pulse is MIT and can be self-hosted).
const PULSE = process.env.PULSE_URL ?? "https://pulse-lab.lusocryptolabs.com";

const get = (path: string) => fetch(`${PULSE}${path}`, { signal: AbortSignal.timeout(20_000) });

/** Lowercased owner/repo -> Pulse's spelling. /api/repo matches names exactly, project files may not. */
async function followed(): Promise<Record<string, string>> {
  "use cache";
  cacheLife("hours");
  const res = await get("/api/state");
  if (!res.ok) throw new Error(`state: HTTP ${res.status}`);
  const { repos } = (await res.json()) as { repos: { name: string }[] };
  return Object.fromEntries(repos.map((r) => [r.name.toLowerCase(), r.name]));
}

/**
 * Activity for one repository, revalidated hourly.
 * undefined: Pulse does not follow the repository, so the page shows no Activity section.
 * null: Pulse could not be reached or answered nonsense; the page says so and links the repository instead of
 * showing numbers that may be wrong. A failure is only cached for minutes, so pages recover soon after Pulse does.
 */
export async function loadActivity(github: string): Promise<RepoActivity | null | undefined> {
  "use cache";
  try {
    const name = (await followed())[github.toLowerCase()];
    if (!name) {
      cacheLife("hours");
      return undefined;
    }
    const res = await get(`/api/repo?name=${encodeURIComponent(name)}`);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const out = parseRepo(await res.json(), Date.now());
    cacheLife("hours");
    return out;
  } catch (e) {
    console.warn(`[activity] ${e instanceof Error ? e.message : e}`);
    cacheLife("minutes");
    return null;
  }
}

/** The repository's card on CKB Pulse, linked from the Activity section as the data's source. */
export const pulseRepoUrl = (name: string) => `${PULSE}/?repo=${encodeURIComponent(name)}`;
