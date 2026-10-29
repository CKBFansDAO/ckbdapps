/**
 * Refresh the committed fallback for /builders (used when the CKBuilder tracker cannot be read at request time).
 *   pnpm snapshot:builders
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fetchBuilds } from "@/lib/builders";

const OUT = path.join(process.cwd(), "src/data/builders-snapshot.json");

async function main() {
  const data = await fetchBuilds();
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(data, null, 1) + "\n");
  console.log(`Wrote ${OUT}: ${data.builds.length} projects, fetched ${data.fetchedAt}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
