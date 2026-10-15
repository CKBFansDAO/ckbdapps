/**
 * GitHub repo signals via ONE batched GraphQL request per 50 repos (not 2 REST calls per repo).
 * Pure fetch + merge — imported by scripts/snapshot-github.ts (tsx). No Next APIs in here.
 */

export type RepoSignals = {
  license?: string;
  /** ISO date of the latest commit on the default branch */
  lastCommit?: string;
  stars: number;
  /** ISO time this entry was last refreshed from GitHub */
  fetchedAt: string;
};

export type Snapshot = { fetchedAt: string; repos: Record<string, RepoSignals> };

const ENDPOINT = "https://api.github.com/graphql";
export const BATCH = 50;

type Node = {
  stargazerCount: number;
  licenseInfo: { spdxId: string | null } | null;
  pushedAt: string | null;
  defaultBranchRef: { target: { committedDate?: string } | null } | null;
} | null;

export function buildQuery(repos: string[]): string {
  const fields = `stargazerCount licenseInfo { spdxId } pushedAt defaultBranchRef { target { ... on Commit { committedDate } } }`;
  const body = repos
    .map((r, i) => {
      const [owner, name] = r.split("/");
      return `r${i}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { ${fields} }`;
    })
    .join("\n");
  return `query {\n${body}\n}`;
}

export function parseNode(n: Node, fetchedAt: string): RepoSignals | null {
  if (!n) return null;
  const spdx = n.licenseInfo?.spdxId;
  return {
    license: spdx && spdx !== "NOASSERTION" ? spdx : undefined,
    lastCommit: n.defaultBranchRef?.target?.committedDate ?? n.pushedAt ?? undefined,
    stars: n.stargazerCount ?? 0,
    fetchedAt,
  };
}

/**
 * Merge fresh results over the previous snapshot. A repo GitHub did not answer for keeps its
 * last good entry (so one outage or a renamed repo never blanks a page); repos no longer in
 * content are dropped.
 */
export function mergeSnapshot(prev: Snapshot | null, fresh: Map<string, RepoSignals | null>, wanted: string[], now: string): Snapshot {
  const repos: Record<string, RepoSignals> = {};
  for (const r of [...wanted].sort()) {
    const next = fresh.get(r) ?? prev?.repos[r];
    if (next) repos[r] = next;
  }
  return { fetchedAt: now, repos };
}

export async function fetchSignals(repos: string[], token: string): Promise<{ fresh: Map<string, RepoSignals | null>; failed: string[] }> {
  const fresh = new Map<string, RepoSignals | null>();
  const failed: string[] = [];
  for (let i = 0; i < repos.length; i += BATCH) {
    const chunk = repos.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: buildQuery(chunk) }),
      signal: AbortSignal.timeout(30_000),
    });
    // Auth / rate-limit / server errors abort the whole run: the committed snapshot stays as it is.
    if (!res.ok) throw new Error(`GitHub GraphQL ${res.status}: ${(await res.text()).slice(0, 200)}`);
    const json = (await res.json()) as { data?: Record<string, Node>; errors?: { message: string; path?: string[] }[] };
    if (!json.data) throw new Error(`GitHub GraphQL returned no data: ${JSON.stringify(json.errors ?? []).slice(0, 200)}`);
    const now = new Date().toISOString();
    chunk.forEach((r, j) => {
      const s = parseNode(json.data![`r${j}`] ?? null, now);
      fresh.set(r, s);
      if (!s) failed.push(r); // not found / renamed / private: keep the last good entry
    });
  }
  return { fresh, failed };
}
