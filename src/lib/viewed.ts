// Projects this browser has opened, newest first, for "You might like" on Home.
// Only ever stored in localStorage: never sent anywhere. Storage can be blocked (private windows,
// cleared site data), so every access is guarded and the page works without it.
import { pushViewed } from "./picks";

const KEY = "ckbdapps:viewed";

export function readViewed(): string[] {
  try {
    const v: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(v) ? v.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function addViewed(slug: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(pushViewed(readViewed(), slug)));
  } catch {
    // Storage unavailable: recommendations simply stay random.
  }
}
