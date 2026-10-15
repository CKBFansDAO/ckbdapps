import snapshot from "@/data/github-signals.json";
import type { RepoSignals, Snapshot } from "./github-source";

export type { RepoSignals };

const repos = (snapshot as Snapshot).repos;

/**
 * Repo signals for a project's `github: owner/repo`, read from the committed snapshot
 * (src/data/github-signals.json, refreshed by .github/workflows/github-signals.yml).
 * No network at build time: a missing entry just hides the Signals panel.
 */
export function getRepoSignals(repo: string): RepoSignals | null {
  return repos[repo] ?? null;
}
