import assert from "node:assert/strict";
import test from "node:test";
import {
  clampWindow,
  extent,
  idxAtX,
  markerIndex,
  presetStart,
  sampleIdx,
  seriesPath,
  sparklinePath,
  strideFor,
  ttLeft,
  xLabelIdx,
} from "./stats-chart";

test("clampWindow keeps the range inside and at least `min` wide", () => {
  assert.deepEqual(clampWindow(100, 10, 40), { i0: 10, i1: 40 });
  assert.deepEqual(clampWindow(100, -5, 30), { i0: 0, i1: 30 });
  assert.deepEqual(clampWindow(100, 90, 500), { i0: 90, i1: 99 });
  // a window wider than `min` that overflows on the right clamps to the end
  assert.equal(clampWindow(100, 97, 99).i1, 99);
  // dragging the left edge past the right keeps `min` days of span
  assert.deepEqual(clampWindow(100, 50, 30, 6).i1 - clampWindow(100, 50, 30, 6).i0, 6);
});

test("presetStart pins the end to today; 0 days means ALL", () => {
  assert.equal(presetStart(1000, 7), 993);
  assert.equal(presetStart(1000, 365), 635);
  assert.equal(presetStart(1000, 0), 0);
  assert.equal(presetStart(5, 30), 0); // series shorter than the preset
});

test("extent pads the range, or pins at zero for stacked areas", () => {
  const e = extent([(i) => i], 10, 20, false);
  assert.ok(e.lo < 10 && e.hi > 20);
  const z = extent([(i) => 100 + i], 0, 9, true);
  assert.equal(z.lo, 0);
  assert.ok(z.hi > 109 && z.hi < 120);
  // flat series still produces a finite, ordered range
  const f = extent([() => 5], 0, 3, false);
  assert.ok(f.lo < 5 && f.hi > 5);
});

test("strideFor samples ~1.2px per point", () => {
  assert.equal(strideFor(10, 800), 1);
  assert.equal(strideFor(2500, 800), 2);
  assert.equal(strideFor(2500, 100), 20);
});

test("seriesPath moves to i0, ends at i1, closes areas with the base", () => {
  const X = (i: number) => i * 10;
  const Y = (v: number) => 100 - v;
  const { top, area } = seriesPath((i) => i, () => 0, 0, 4, X, Y, 1);
  assert.ok(top.startsWith("M0.0 100.0"));
  assert.ok(top.endsWith("L40.0 96.0"));
  assert.ok(area!.endsWith("Z"));
  assert.equal(seriesPath((i) => i, null, 0, 4, X, Y, 1).area, null);
  // stride >1 still lands on i1 exactly
  assert.ok(seriesPath((i) => i, null, 0, 5, X, Y, 3).top.endsWith("L50.0 95.0"));
});

test("sampleIdx includes both endpoints and stays in range", () => {
  const s = sampleIdx(10, 50, 8);
  assert.equal(s.length, 8);
  assert.equal(s[0], 10);
  assert.equal(s.at(-1), 50);
  assert.ok(s.every((v) => v >= 10 && v <= 50));
  assert.deepEqual([...new Set(s)].length, 8);
});

test("xLabelIdx gives 3 labels on narrow plots and 5 on wide", () => {
  assert.equal(xLabelIdx(0, 99, false).length, 3);
  assert.equal(xLabelIdx(0, 99, true).length, 5);
  assert.deepEqual(xLabelIdx(0, 100, true), [0, 25, 50, 75, 100]);
});

test("sparklinePath emits 300 moveto/lineto segments inside the viewBox", () => {
  const d = sparklinePath(Array.from({ length: 100 }, (_, i) => i + 1));
  assert.ok(d.startsWith("M0 "));
  assert.equal(d.split("L").length - 1, 299);
  // a constant series must not produce NaN
  const flat = sparklinePath(Array(100).fill(1));
  assert.ok(!flat.includes("NaN"));
});

test("markerIndex converts an ISO date to a day index", () => {
  const t0 = Date.parse("2019-11-18T00:00:00Z") / 1000;
  assert.equal(markerIndex("2019-11-18", t0), 0);
  assert.equal(markerIndex("2019-11-19", t0), 1);
});

test("idxAtX snaps the pointer to a day index", () => {
  // 100px plot over 10 days: mid-cell rounds to the nearest index
  assert.equal(idxAtX(55, 50, 100, 0, 10), 1);
  assert.equal(idxAtX(50, 50, 100, 0, 10), 0);
  assert.equal(idxAtX(150, 50, 100, 0, 10), 10);
});

test("ttLeft flips the tooltip to the left near the right edge", () => {
  assert.equal(ttLeft(100, 1000), 114);
  assert.equal(ttLeft(900, 1000), 646);
});
