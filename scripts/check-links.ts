/**
 * HEAD every external URL in content (project sites, docs, audits, events). Weekly in CI, not on every PR.
 * Falls back to GET when a server rejects HEAD. Exits 1 if any link is broken.
 *   pnpm check:links
 */
import { loadEvents, loadProjects } from "@/lib/content/load";

const CONCURRENCY = 8;
const TIMEOUT_MS = 15_000;

const targets: { where: string; url: string }[] = [];
for (const p of loadProjects()) {
  const where = `content/projects/${p.slug}.md`;
  targets.push({ where, url: p.url });
  if (p.links?.docs) targets.push({ where, url: p.links.docs });
  for (const a of p.audits ?? []) targets.push({ where, url: a.url });
}
for (const e of loadEvents()) targets.push({ where: `content/events.yaml (${e.date})`, url: e.url });

async function check(url: string): Promise<string | null> {
  const init = { redirect: "follow" as const, headers: { "user-agent": "ckbdapps-link-check" } };
  try {
    let res = await fetch(url, { ...init, method: "HEAD", signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetch(url, { ...init, method: "GET", signal: AbortSignal.timeout(TIMEOUT_MS) });
    }
    return res.ok ? null : `HTTP ${res.status}`;
  } catch (e) {
    return e instanceof Error ? (e.cause instanceof Error ? e.cause.message : e.message) : String(e);
  }
}

async function main() {
  const failures: string[] = [];
  let next = 0;
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < targets.length) {
        const t = targets[next++];
        const err = await check(t.url);
        if (err) failures.push(`${t.where}: ${t.url} (${err})`);
      }
    }),
  );
  console.log(`Checked ${targets.length} links, ${failures.length} broken.`);
  if (failures.length) {
    console.log(failures.sort().map((f) => `  ${f}`).join("\n"));
    process.exit(1);
  }
}

main();
