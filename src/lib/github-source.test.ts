import assert from "node:assert/strict";
import { test } from "node:test";
import { buildQuery, mergeSnapshot, parseNode, type RepoSignals, type Snapshot } from "./github-source";

const S = (stars: number, at = "2026-01-01T00:00:00Z"): RepoSignals => ({ stars, fetchedAt: at });

test("buildQuery aliases one repository() per repo", () => {
  const q = buildQuery(["a/b", "c/d.e"]);
  assert.match(q, /r0: repository\(owner: "a", name: "b"\)/);
  assert.match(q, /r1: repository\(owner: "c", name: "d.e"\)/);
});

test("parseNode: license, commit fallback, NOASSERTION, null", () => {
  const n = { stargazerCount: 7, licenseInfo: { spdxId: "MIT" }, pushedAt: "p", defaultBranchRef: { target: { committedDate: "c" } } };
  assert.deepEqual(parseNode(n, "t"), { license: "MIT", lastCommit: "c", stars: 7, fetchedAt: "t" });
  assert.equal(parseNode({ ...n, licenseInfo: { spdxId: "NOASSERTION" }, defaultBranchRef: null }, "t")!.license, undefined);
  assert.equal(parseNode({ ...n, defaultBranchRef: null }, "t")!.lastCommit, "p");
  assert.equal(parseNode(null, "t"), null);
});

test("mergeSnapshot keeps the last good entry on failure and drops removed repos", () => {
  const prev: Snapshot = { fetchedAt: "x", repos: { "a/a": S(1), "b/b": S(2), "gone/gone": S(3) } };
  const fresh = new Map<string, RepoSignals | null>([["a/a", S(10, "new")], ["b/b", null]]);
  const out = mergeSnapshot(prev, fresh, ["b/b", "a/a", "n/n"], "now");
  assert.deepEqual(Object.keys(out.repos), ["a/a", "b/b"]);
  assert.equal(out.repos["a/a"].stars, 10);
  assert.equal(out.repos["b/b"].stars, 2);
  assert.equal(out.fetchedAt, "now");
});
