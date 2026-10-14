/**
 * Refresh the committed stats fallback data (used when the API is down at request time).
 *   pnpm snapshot:stats
 */
import { mkdirSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchStats } from "@/lib/stats-source";

const OUT = path.join(process.cwd(), "src/data/stats-snapshot.json");

async function main() {
  const data = await fetchStats();
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data) + "\n");
  const kb = Math.round(statSync(OUT).size / 1024);
  const from = new Date(data.t0 * 1000).toISOString().slice(0, 10);
  console.log(`Wrote ${OUT} (${kb} KB): ${data.price.length} days from ${from}, fetched ${new Date(data.fetchedAt).toISOString()}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
