import assert from "node:assert/strict";
import test from "node:test";
import { Project } from "./schema";

const base = { name: "X", url: "https://x.example/", tagline: "One sentence.", categories: ["Tools"], verified: "2026-10-30" };

test("Project: testnet defaults to false and needs nothing extra", () => {
  const r = Project.parse(base);
  assert.equal(r.testnet, false);
});

test("Project: a testnet proof needs github and listed", () => {
  const r = Project.safeParse({ ...base, testnet: true });
  assert.equal(r.success, false);
  assert.deepEqual(r.error!.issues.map((i) => i.path.join(".")).sort(), ["github", "listed"]);
  assert.equal(Project.safeParse({ ...base, testnet: true, github: "a/b", listed: "2026-10-30" }).success, true);
});
