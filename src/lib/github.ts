import { cacheLife } from "next/cache";

export type RepoSignals = { license?: string; lastCommit?: string; stars: number };

/**
 * Build-time repo signals for a project's `github: owner/repo`.
 * Cached for the life of the build; the scheduled Netlify rebuild refreshes them.
 * Returns null if GitHub is unreachable or the repo does not exist, so a build never fails on it.
 */
export async function getRepoSignals(repo: string): Promise<RepoSignals | null> {
  "use cache";
  cacheLife("max");
  const headers: HeadersInit = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const get = async (path: string) => {
    const res = await fetch(`https://api.github.com/repos/${repo}${path}`, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) throw new Error(`GitHub ${res.status} for ${repo}${path}`);
    return res.json();
  };
  try {
    const [info, commits] = await Promise.all([get(""), get("/commits?per_page=1")]);
    const spdx: string | undefined = info.license?.spdx_id;
    return {
      license: spdx && spdx !== "NOASSERTION" ? spdx : undefined,
      lastCommit: commits[0]?.commit?.committer?.date ?? info.pushed_at,
      stars: info.stargazers_count ?? 0,
    };
  } catch (e) {
    console.warn(`[github] ${e instanceof Error ? e.message : e}`);
    return null;
  }
}
