import assert from "node:assert/strict";
import test from "node:test";
import { barHeights, day, foldEvents, parseRepo, statusOf } from "./activity-source";

const NOW = Date.parse("2026-10-28T12:00:00Z");
const ev = (at: string, kind: string, actor: string, title: string, n = 0) => ({ at, kind, actor, title, url: `https://github.com/a/b/pull/1#${n}` });

const repo = {
  name: "ckb-devrel/ccc",
  url: "https://github.com/ckb-devrel/ccc",
  stars: 43,
  pushedAt: "2026-10-22T14:07:38Z",
  daily: { days: 30, people: [1, 0, 2], bots: [0, 0, 5] },
  contributors: [{ login: "Hanssen0" }, { login: "dependabot[bot]" }],
  events: [
    ev("2026-10-28T09:09:00Z", "review", "Alter", "fix(spore): dedupe", 1),
    ev("2026-10-28T09:08:00Z", "review", "Alter", "fix(spore): dedupe", 2),
    ev("2026-10-28T09:00:00Z", "push", "renovate[bot]", "chore: deps"),
    ev("2026-10-27T09:00:00Z", "star", "someone", ""),
    ev("2026-10-26T09:00:00Z", "pr_open", "ashuralyk", "fix(spore): dedupe"),
  ],
};

test("parseRepo: status from the newest human event, bots left out", () => {
  const r = parseRepo(repo, NOW);
  assert.equal(r.status, "active");
  assert.equal(r.lastActivityAt, "2026-10-28T09:09:00Z");
  assert.equal(r.contributors, 1);
  assert.deepEqual(r.daily, [1, 0, 2]);
  assert.deepEqual(
    r.events.map((e) => [e.kind, e.actor, e.times]),
    [
      ["review", "Alter", 2],
      ["pr_open", "ashuralyk", 1],
    ],
  );
});

test("parseRepo: no events falls back to the last push, and rejects a payload that is not a repo", () => {
  const r = parseRepo({ ...repo, events: [], pushedAt: "2026-06-01T00:00:00Z" }, NOW);
  assert.equal(r.lastActivityAt, "2026-06-01T00:00:00Z");
  assert.equal(r.status, "dormant");
  assert.throws(() => parseRepo({ error: "not followed" }, NOW));
});

test("foldEvents keeps the newest five distinct items and still counts their later repeats", () => {
  const many = [1, 2, 3, 4, 5, 6].map((i) => ev(`2026-10-2${i}T00:00:00Z`, "comment", "x", `t${i}`));
  const out = foldEvents([...many, ev("2026-10-01T00:00:00Z", "comment", "x", "t1")]);
  assert.deepEqual(
    out.map((e) => e.title),
    ["t1", "t2", "t3", "t4", "t5"],
  );
  assert.equal(out[0].times, 2);
});

test("statusOf: 30 and 90 day bounds", () => {
  assert.equal(statusOf("2026-09-28T12:00:00Z", NOW), "active");
  assert.equal(statusOf("2026-09-27T12:00:00Z", NOW), "quiet");
  assert.equal(statusOf("2026-07-30T12:00:00Z", NOW), "quiet");
  assert.equal(statusOf("2026-07-29T00:00:00Z", NOW), "dormant");
  assert.equal(statusOf(null, NOW), "dormant");
});

test("barHeights scales to the busiest day and keeps empty days at 0", () => {
  assert.deepEqual(barHeights([0, 2, 4, 1]), [0, 50, 100, 25]);
  assert.deepEqual(barHeights([0, 0, 0]), [0, 0, 0]);
  assert.deepEqual(barHeights([]), []);
});

test("day cuts an ISO timestamp to its date", () => {
  assert.equal(day("2026-10-15T08:30:00Z"), "2026-10-15");
});
