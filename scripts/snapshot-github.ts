/**
 * Refresh the committed GitHub signals (license, last commit, stars) for every project with a `github:` line.
 * One batched GraphQL request per 50 repos; needs a read-only token in GITHUB_TOKEN.
 *   GITHUB_TOKEN=... pnpm snapshot:github
 * On any API-level failure the script exits 1 and leaves the existing file untouched.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadProjects } from "@/lib/content/load";
import { fetchSignals, mergeSnapshot, type Snapshot } from "@/lib/github-source";

const OUT = path.join(process.cwd(), "src/data/github-signals.json");

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is not set (GraphQL needs a token; a fine-grained read-only one is enough)");
  const wanted = [...new Set(loadProjects().flatMap((p) => (p.github ? [p.github] : [])))];
  const prev: Snapshot | null = existsSync(OUT) ? JSON.parse(readFileSync(OUT, "utf8")) : null;
  const { fresh, failed } = await fetchSignals(wanted, token);
  const next = mergeSnapshot(prev, fresh, wanted, new Date().toISOString());
  mkdirSync(path.dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(next, null, 2) + "\n");
  console.log(`Wrote ${OUT}: ${Object.keys(next.repos).length}/${wanted.length} repos`);
  if (failed.length) console.warn(`No answer for (kept previous entry if any): ${failed.join(", ")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
