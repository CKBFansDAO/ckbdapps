import assert from "node:assert/strict";
import test from "node:test";
import { big, splitUnit } from "./stats-format";

test("splitUnit separates the number from its unit", () => {
  assert.deepEqual(splitUnit("506.47亿"), ["506.47", "亿"]);
  assert.deepEqual(splitUnit("50.65B"), ["50.65", "B"]);
  assert.deepEqual(splitUnit("1,234"), ["1,234", ""]);
  assert.deepEqual(splitUnit("—"), ["—", ""]);
});

test("splitUnit round-trips the hero's compact numbers", () => {
  for (const [v, l] of [
    [50_647_000_000, "zh"],
    [50_647_000_000, "en"],
    [8_139_000_000, "zh"],
    [12_345, "zh"],
  ] as const) {
    const s = big(v, l);
    assert.equal(splitUnit(s).join(""), s);
  }
});
