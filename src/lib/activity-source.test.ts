import assert from "node:assert/strict";
import test from "node:test";
import { barHeights, day, parseActivity } from "./activity-source";

const gh = {
  fetchedAt: "2026-10-16T01:00:00Z",
  stars: 12,
  commits30d: 4,
  commits90d: 9,
  weekly: [0, 1, 0, 0, 2, 0, 0, 4, 1, 0, 0, 0, 3],
  releases: [{ tag: "v1.0.0", at: "2026-09-01T00:00:00Z", url: "https://github.com/a/b/releases/tag/v1.0.0" }],
};

test("parseActivity keeps valid entries, drops malformed ones, ignores unknown sources", () => {
  const out = parseActivity({
    updatedAt: "x",
    projects: {
      good: { status: "active", lastActivityAt: "2026-10-15T00:00:00Z", github: gh, x: { handle: "a", posts: [] } },
      bad: { status: "sparkling", lastActivityAt: null },
      short: { status: "quiet", lastActivityAt: null, github: { ...gh, weekly: [1, 2] } },
      none: { status: "unknown", lastActivityAt: null },
    },
  });
  assert.deepEqual(Object.keys(out).sort(), ["good", "none"]);
  assert.equal(out.good.github?.stars, 12);
  assert.equal("x" in out.good, false);
});

test("parseActivity rejects a payload without projects", () => {
  assert.throws(() => parseActivity({ updatedAt: "x" }));
});

test("barHeights scales to the busiest week and keeps empty weeks at 0", () => {
  assert.deepEqual(barHeights([0, 2, 4, 1]), [0, 50, 100, 25]);
  assert.deepEqual(barHeights([0, 0, 0]), [0, 0, 0]);
  assert.deepEqual(barHeights([]), []);
});

test("day cuts an ISO timestamp to its date", () => {
  assert.equal(day("2026-10-15T08:30:00Z"), "2026-10-15");
});
