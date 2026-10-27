import assert from "node:assert/strict";
import test from "node:test";
import { communityPicks, newestListed, pushViewed, recommend, seeded, shuffle } from "./picks";

const p = (slug: string, group: string, cats: string[], community = false) => ({ slug, group, cats, community });
const pool = [
  p("w1", "wallets", ["Wallet"]),
  p("w2", "wallets", ["Wallet", "Extension"]),
  p("w3", "wallets", ["Hardware Wallet"]),
  p("d1", "apps", ["DEX", "DeFi"], true),
  p("d2", "apps", ["DEX"]),
  p("n1", "assets", ["NFT"], true),
  p("i1", "infra", ["Tools"], true),
  p("e1", "eco", ["Investor"]),
];

test("seeded gives the same sequence for the same seed", () => {
  const a = seeded(42),
    b = seeded(42);
  assert.deepEqual([a(), a(), a()], [b(), b(), b()]);
  assert.ok([...Array(100)].map(seeded(7)).every((x) => x >= 0 && x < 1));
});

test("shuffle keeps every item and leaves the input alone", () => {
  const xs = [1, 2, 3, 4, 5];
  const out = shuffle(xs, seeded(1));
  assert.deepEqual([...out].sort(), xs);
  assert.deepEqual(xs, [1, 2, 3, 4, 5]);
});

test("recommend without history draws from apps, wallets and assets only", () => {
  const r = recommend(pool, [], 4, seeded(3));
  assert.equal(r.personal, false);
  assert.equal(r.items.length, 4);
  assert.ok(r.items.every((x) => ["apps", "wallets", "assets"].includes(x.group)));
});

test("recommend ranks projects sharing categories first and never repeats a viewed one", () => {
  const r = recommend(pool, ["w2"], 3, seeded(5));
  assert.equal(r.personal, true);
  assert.ok(!r.items.some((x) => x.slug === "w2"));
  // w1 shares Wallet with w2: it ranks first; the rest is filled from the start groups.
  assert.equal(r.items[0].slug, "w1");
  assert.equal(new Set(r.items.map((x) => x.slug)).size, 3);
});

test("recommend weighs the most recent view most", () => {
  const r = recommend(pool, ["d1", "w1"], 2, seeded(9));
  assert.deepEqual(
    r.items.map((x) => x.slug),
    ["d2", "w2"],
  );
});

test("recommend keeps a viewed project's history even when it is excluded from the picks", () => {
  const r = recommend(pool, ["w2"], 3, seeded(5), new Set(["w2", "w1"]));
  assert.equal(r.personal, false); // w1 was the only related project, and it is excluded
  assert.ok(!r.items.some((x) => x.slug === "w1" || x.slug === "w2"));
  const r2 = recommend(pool, ["d1"], 2, seeded(5), new Set(["d1"]));
  assert.equal(r2.personal, true);
  assert.equal(r2.items[0].slug, "d2");
});

test("recommend ignores unknown slugs in the history", () => {
  assert.equal(recommend(pool, ["gone"], 3, seeded(2)).personal, false);
});

test("communityPicks only returns community projects", () => {
  const out = communityPicks(pool, 5, seeded(4));
  assert.deepEqual(out.map((x) => x.slug).sort(), ["d1", "i1", "n1"]);
});

test("newestListed sorts by date and skips projects without one", () => {
  const xs = [
    { name: "A", listed: "2026-01-02" },
    { name: "B" },
    { name: "C", listed: "2026-03-01" },
    { name: "D", listed: "2026-01-02" },
  ];
  assert.deepEqual(
    newestListed(xs, 3).map((x) => x.name),
    ["C", "A", "D"],
  );
  assert.deepEqual(newestListed([{ name: "B" }], 3), []);
});

test("pushViewed puts the slug first, removes repeats and caps the length", () => {
  assert.deepEqual(pushViewed(["a", "b", "c"], "b"), ["b", "a", "c"]);
  assert.deepEqual(pushViewed(["a", "b"], "c", 2), ["c", "a"]);
});
