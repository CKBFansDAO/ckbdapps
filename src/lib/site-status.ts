import { cacheLife } from "next/cache";
import { isDown } from "./site-check";

/**
 * Whether a testnet proof's demo answers, checked on the server and revalidated hourly. A site found down is
 * only cached for minutes, so a short outage on either side does not stick to the page.
 */
export async function loadSiteDown(url: string): Promise<boolean> {
  "use cache";
  const init = { redirect: "follow" as const, headers: { "user-agent": "ckbdapps (+https://ckbdapps.com)" } };
  let status: number | null;
  try {
    let res = await fetch(url, { ...init, method: "HEAD", signal: AbortSignal.timeout(15_000) });
    // Some servers reject HEAD; ask again the normal way before calling them down.
    if (res.status === 405 || res.status === 404 || res.status >= 500) {
      res = await fetch(url, { ...init, method: "GET", signal: AbortSignal.timeout(15_000) });
    }
    status = res.status;
  } catch {
    status = null;
  }
  const down = isDown(status);
  if (down) {
    cacheLife("minutes");
    console.warn(`[site] ${url}: ${status ?? "no answer"}`);
  } else cacheLife("hours");
  return down;
}
