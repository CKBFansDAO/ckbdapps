// CKB halving: pure functions and the schedule. Ported from the legacy site
// (src/hooks/useCKBHalving.jsx, src/utils/helper.js, public/markdown/halving_en_US.md).

/** 4 years x 365 days x 6 epochs a day. The Nth halving happens at epoch 8760 x N. */
export const EPOCHS_PER_HALVING = 8760;
/** Used only to display a per-block reward. Real epochs vary in length. */
export const BLOCKS_PER_EPOCH = 1800;
/** The average epoch time is measured over this many recent epochs. */
export const AVG_WINDOW_EPOCHS = 1000;
/** About 30 days of epochs: after a halving, show it as completed for this long. */
export const JUST_HALVED_EPOCHS = 30 * 6;

export type Epoch = { number: number; index: number; length: number };

/** Packed header epoch: length = bits 40..55, index = bits 24..39, number = bits 0..23. */
export function parseEpoch(packed: string | bigint): Epoch {
  const v = BigInt(packed);
  const field = (shift: number, mask: number) => Number((v >> BigInt(shift)) & BigInt(mask));
  return { length: field(40, 0xffff), index: field(24, 0xffff), number: field(0, 0xffffff) };
}

export const nextHalvingEpoch = (epoch: number) => (Math.floor(epoch / EPOCHS_PER_HALVING) + 1) * EPOCHS_PER_HALVING;
export const prevHalvingEpoch = (epoch: number) => Math.floor(epoch / EPOCHS_PER_HALVING) * EPOCHS_PER_HALVING;
/** 0 before the first halving, 1 after it, ... */
export const eraOf = (epoch: number) => Math.floor(epoch / EPOCHS_PER_HALVING);

/** Fractional epoch position, e.g. epoch 15095 at index 900 of 1800 = 15095.5. */
export const epochPosition = (e: Epoch) => e.number + (e.length ? e.index / e.length : 0);

/** Share of the current era already mined, 0..1. */
export function eraProgress(e: Epoch): number {
  const prev = prevHalvingEpoch(e.number);
  return Math.min(1, Math.max(0, (epochPosition(e) - prev) / EPOCHS_PER_HALVING));
}

/**
 * In the second half of the last epoch before a halving, the estimate switches to the
 * average block time inside the current epoch (the legacy "real time" mode).
 */
export function isFinalStretch(e: Epoch): boolean {
  return nextHalvingEpoch(e.number) - e.number <= 1 && e.length > 0 && e.index / e.length > 0.5;
}

/** Within the last 100 blocks of the final stretch the page refreshes every 10 s instead of every minute. */
export const isNearHalving = (e: Epoch) => isFinalStretch(e) && e.length - e.index < 100;

export type EstimateInput = {
  tip: Epoch;
  /** Tip header timestamp, ms */
  tipTime: number;
  /**
   * Start-block timestamp (ms) of the reference epoch:
   * the current epoch in the final stretch, otherwise epoch (tip - AVG_WINDOW_EPOCHS).
   */
  refStartTime: number;
};

/** Estimated time (ms) of the next halving, as the legacy hook computed it. */
export function estimateHalvingTime({ tip, tipTime, refStartTime }: EstimateInput): number {
  const target = nextHalvingEpoch(tip.number);
  const elapsed = tipTime - refStartTime;
  if (isFinalStretch(tip)) {
    const perBlock = elapsed / tip.index;
    // The halving is confirmed when the next epoch's first block exists, hence + 1.
    return Math.floor(perBlock * (tip.length + 1 - tip.index)) + tipTime;
  }
  const progress = tip.length ? tip.index / tip.length : 0;
  const avgEpoch = elapsed / (AVG_WINDOW_EPOCHS + progress);
  return tipTime + Math.floor((target - (tip.number + progress)) * avgEpoch);
}

/** Which epoch's start block the estimate needs, given the tip. */
export const refEpochFor = (tip: Epoch) => (isFinalStretch(tip) ? tip.number : Math.max(0, tip.number - AVG_WINDOW_EPOCHS));

/** A halving happened less than ~30 days ago: show it as completed instead of counting down. */
export function justHalved(tip: Epoch): boolean {
  const prev = prevHalvingEpoch(tip.number);
  return prev > 0 && tip.number - prev < JUST_HALVED_EPOCHS;
}

export type CountdownUnit = "d" | "h" | "m" | "s";
export type Countdown = { parts: { unit: CountdownUnit; value: number }[]; days: number };

/**
 * >= 1 day: days, hours, minutes, seconds (the page drops seconds on phones so the row fits).
 * < 1 day: hours, minutes, seconds.
 */
export function countdown(msLeft: number): Countdown {
  const s = Math.max(0, Math.floor(msLeft / 1000));
  const days = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const parts: Countdown["parts"] =
    days >= 1
      ? [
          { unit: "d", value: days },
          { unit: "h", value: h },
          { unit: "m", value: m },
          { unit: "s", value: sec },
        ]
      : [
          { unit: "h", value: h },
          { unit: "m", value: m },
          { unit: "s", value: sec },
        ];
  return { parts, days };
}

export type ScheduleRow = {
  /** 0 = mainnet launch, N = Nth halving */
  n: number;
  epoch: number;
  /** ISO date when it happened; undefined for future halvings */
  date?: string;
  /** Expected year for future halvings */
  year: number;
  epochReward: number;
  /** Calculated at BLOCKS_PER_EPOCH blocks per epoch */
  blockReward: number;
  dailyReward: number;
  /** New CKB from base issuance between this event and the next */
  eraIssuance: number;
};

// Numbers exactly as in the legacy halving table (CKB, base issuance only).
export const SCHEDULE: readonly ScheduleRow[] = [
  { n: 0, epoch: 0, date: "2019-11-16", year: 2019, epochReward: 1_917_808, blockReward: 1065, dailyReward: 11_506_849, eraIssuance: 16_800_000_000 },
  { n: 1, epoch: 8760, date: "2023-11-19", year: 2023, epochReward: 958_904, blockReward: 533, dailyReward: 5_753_424, eraIssuance: 8_400_000_000 },
  { n: 2, epoch: 17520, year: 2027, epochReward: 479_452, blockReward: 266, dailyReward: 2_876_712, eraIssuance: 4_200_000_000 },
  { n: 3, epoch: 26280, year: 2031, epochReward: 239_726, blockReward: 133, dailyReward: 1_438_356, eraIssuance: 2_100_000_000 },
  { n: 4, epoch: 35040, year: 2035, epochReward: 119_863, blockReward: 67, dailyReward: 719_178, eraIssuance: 1_050_000_000 },
  { n: 5, epoch: 43800, year: 2039, epochReward: 59_932, blockReward: 33.5, dailyReward: 359_589, eraIssuance: 525_000_000 },
  { n: 6, epoch: 52560, year: 2043, epochReward: 29_966, blockReward: 16.75, dailyReward: 179_794.5, eraIssuance: 262_500_000 },
  { n: 7, epoch: 61320, year: 2047, epochReward: 14_983, blockReward: 8.375, dailyReward: 89_897.25, eraIssuance: 131_250_000 },
  { n: 8, epoch: 70080, year: 2051, epochReward: 7_491, blockReward: 4.1875, dailyReward: 44_948.625, eraIssuance: 65_625_000 },
  { n: 9, epoch: 78840, year: 2055, epochReward: 3_746, blockReward: 2.09375, dailyReward: 22_474.3125, eraIssuance: 32_812_500 },
  { n: 10, epoch: 87600, year: 2059, epochReward: 1_873, blockReward: 1.046875, dailyReward: 11_237.15625, eraIssuance: 16_406_250 },
];

/** From the legacy explainer: inflation before and after the first halving, in percent. */
export const INFLATION = { beforeFirst: 7.92, afterFirst: 3.77 } as const;
