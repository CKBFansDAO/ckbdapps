import { cacheLife } from "next/cache";

/** The time of the build. Staleness is judged against this; the scheduled rebuild keeps it current. */
export async function getBuildTime(): Promise<number> {
  "use cache";
  cacheLife("max");
  return Date.now();
}
