import assert from "node:assert/strict";
import { test } from "node:test";
import {
  AVG_WINDOW_EPOCHS,
  countdown,
  EPOCHS_PER_HALVING,
  eraOf,
  eraProgress,
  estimateHalvingTime,
  isFinalStretch,
  justHalved,
  nextHalvingEpoch,
  parseEpoch,
  prevHalvingEpoch,
  refEpochFor,
  SCHEDULE,
} from "./halving";

const close = (a: number, b: number, tol: number, msg: string) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

test("halving epochs are 8760 x N", () => {
  SCHEDULE.forEach((r) => assert.equal(r.epoch, EPOCHS_PER_HALVING * r.n));
  assert.equal(nextHalvingEpoch(15095), 17520);
  assert.equal(prevHalvingEpoch(15095), 8760);
  assert.equal(nextHalvingEpoch(8760), 17520);
  assert.equal(prevHalvingEpoch(8759), 0);
  assert.equal(eraOf(17519), 1);
  assert.equal(eraOf(17520), 2);
});

test("era issuance halves exactly each era", () => {
  for (let i = 1; i < SCHEDULE.length; i++) assert.equal(SCHEDULE[i].eraIssuance * 2, SCHEDULE[i - 1].eraIssuance);
  const total = SCHEDULE.reduce((s, r) => s + r.eraIssuance, 0);
  assert.ok(total < 33_600_000_000 && total > 33_580_000_000, `total base issuance ${total}`);
});

test("rewards halve each era and follow from era issuance", () => {
  for (const [i, r] of SCHEDULE.entries()) {
    const perEpoch = r.eraIssuance / EPOCHS_PER_HALVING;
    close(r.epochReward, perEpoch, 1, `epoch reward row ${i}`);
    close(r.dailyReward, perEpoch * 6, 1, `daily reward row ${i}`);
    if (i > 0) {
      close(r.epochReward * 2, SCHEDULE[i - 1].epochReward, 1, `epoch reward halves row ${i}`);
      close(r.dailyReward * 2, SCHEDULE[i - 1].dailyReward, 1, `daily reward halves row ${i}`);
      close(r.blockReward * 2, SCHEDULE[i - 1].blockReward, 1, `block reward halves row ${i}`);
    }
  }
});

test("parseEpoch reads number, index and length from the packed field", () => {
  // A real mainnet tip header: number 0x3af7 = 15095, index 0x3b7 = 951, length 0x6b7 = 1719
  assert.deepEqual(parseEpoch("0x6b703b7003af7"), { number: 15095, index: 951, length: 1719 });
  assert.deepEqual(parseEpoch(BigInt(0)), { number: 0, index: 0, length: 0 });
});

test("era progress", () => {
  assert.equal(eraProgress({ number: 8760, index: 0, length: 1800 }), 0);
  close(eraProgress({ number: 13140, index: 0, length: 1800 }), 0.5, 1e-9, "half way");
});

test("estimate uses the average epoch time over the last 1000 epochs", () => {
  const H = 3_600_000;
  const tip = { number: 15000, index: 900, length: 1800 };
  // 1000.5 epochs took exactly 4h each
  const tipTime = 1_000_000_000_000;
  const refStartTime = tipTime - 1000.5 * 4 * H;
  assert.equal(refEpochFor(tip), 15000 - AVG_WINDOW_EPOCHS);
  const t = estimateHalvingTime({ tip, tipTime, refStartTime });
  close(t - tipTime, (17520 - 15000.5) * 4 * H, 1, "ms until halving");
});

test("final stretch switches to block time inside the current epoch", () => {
  const tip = { number: 17519, index: 1500, length: 1800 };
  assert.ok(isFinalStretch(tip));
  assert.equal(refEpochFor(tip), 17519);
  const tipTime = 2_000_000_000_000;
  const t = estimateHalvingTime({ tip, tipTime, refStartTime: tipTime - 1500 * 8000 });
  assert.equal(t - tipTime, 8000 * 301);
  assert.ok(!isFinalStretch({ number: 17519, index: 800, length: 1800 }));
  assert.ok(!isFinalStretch({ number: 17518, index: 1700, length: 1800 }));
});

test("just halved for about 30 days after a halving", () => {
  assert.ok(justHalved({ number: 17520, index: 0, length: 1800 }));
  assert.ok(justHalved({ number: 17699, index: 0, length: 1800 }));
  assert.ok(!justHalved({ number: 17700, index: 0, length: 1800 }));
  assert.ok(!justHalved({ number: 100, index: 0, length: 1800 }));
});

test("countdown units: days above 30 days, hours below", () => {
  const D = 86_400_000;
  assert.deepEqual(
    countdown(40 * D + 3_723_000).parts.map((p) => p.unit),
    ["d", "h", "m", "s"],
  );
  const c = countdown(29 * D + 3_723_000);
  assert.deepEqual(c.parts, [
    { unit: "h", value: 29 * 24 + 1 },
    { unit: "m", value: 2 },
    { unit: "s", value: 3 },
  ]);
  assert.deepEqual(countdown(-5).parts.map((p) => p.value), [0, 0, 0]);
});
