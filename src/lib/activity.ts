import { cacheLife } from "next/cache";
import { parseRepo, type RepoActivity } from "./activity-source";

// CKB Pulse follows the GitHub activity of the CKB ecosystem and serves it as JSON, so the site never talks to
// GitHub itself. PULSE_URL points previews at another instance (Pulse is MIT and can be self-hosted).
const PULSE = process.env.PULSE_URL ?? "https://pulse-lab.lusocryptolabs.com";

// "ckbdapps" in the User-Agent lets the Pulse team tell our calls apart in their logs (LusoCryptoLabs/ckb-pulse#1).
const get = (path: string) =>
  fetch(`${PULSE}${path}`, { headers: { "user-agent": "ckbdapps (+https://ckbdapps.com)" }, signal: AbortSignal.timeout(20_000) });

/**
 * Activity for one repository, revalidated hourly. /api/repo matches the name in any case and answers with
 * Pulse's own spelling, which the Pulse card link uses.
 * undefined: Pulse does not follow the repository (HTTP 404), so the page shows no Activity section.
 * null: Pulse could not be reached or answered nonsense; the page says so and links the repository instead of
 * showing numbers that may be wrong. A failure is only cached for minutes, so pages recover soon after Pulse does.
 */
export async function loadActivity(github: string): Promise<RepoActivity | null | undefined> {
  "use cache";
  try {
    const res = await get(`/api/repo?name=${encodeURIComponent(github)}`);
    if (res.status === 404) {
      cacheLife("hours");
      return undefined;
    }
    if (!res.ok) throw new Error(`${github}: HTTP ${res.status}`);
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
