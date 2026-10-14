/**
 * Pure chart math for the stats page: window clamping, axis extents, path building,
 * the brush sparkline and table sampling. No DOM, no React — unit tested in
 * stats-chart.test.ts. Formatting (big/hr/pr/chg/ymd/niceTicks) lives in stats-format.ts.
 */

import { DAY_S } from "./stats-source";

export type Range = { i0: number; i1: number };

/** Keep [a, b] inside [0, n-1] and at least `min` wide. */
export function clampWindow(n: number, a: number, b: number, min = 6): Range {
  const lo = Math.max(0, Math.min(a, n - 1 - min));
  return { i0: lo, i1: Math.min(n - 1, Math.max(b, lo + min)) };
}

/** Preset button -> start index. `days` 0 means ALL. Keeps the end pinned to the last day. */
export const presetStart = (n: number, days: number) => (days > 0 ? Math.max(0, n - days) : 0);

/** Value range of the visible window. `zero` pins the axis at 0 (stacked areas); otherwise pad 8%. */
export function extent(tops: ((i: number) => number)[], i0: number, i1: number, zero: boolean): { lo: number; hi: number } {
  let lo = Infinity,
    hi = -Infinity;
  for (let i = i0; i <= i1; i++)
    for (const t of tops) {
      const v = t(i);
      if (v > hi) hi = v;
      if (v < lo) lo = v;
    }
  if (zero) return { lo: 0, hi: hi * 1.06 };
  const pad = (hi - lo) * 0.08 || hi * 0.05 || 1;
  return { lo: lo - pad, hi: hi + pad };
}

/** One point per ~1.2px of plot width — denser than that is invisible and slower to render. */
export const strideFor = (span: number, plotW: number) => Math.max(1, Math.floor(span / (plotW * 1.2)));

/** SVG path for a layer: `top` polyline, closed with `base` for areas. */
export function seriesPath(
  top: (i: number) => number,
  base: ((i: number) => number) | null,
  i0: number,
  i1: number,
  X: (i: number) => number,
  Y: (v: number) => number,
  stride: number,
): { top: string; area: string | null } {
  let t = "",
    b = "";
  for (let i = i0; ; i += stride) {
    if (i > i1) i = i1;
    t += (t ? "L" : "M") + X(i).toFixed(1) + " " + Y(top(i)).toFixed(1);
    if (base) b = "L" + X(i).toFixed(1) + " " + Y(base(i)).toFixed(1) + b;
    if (i === i1) break;
  }
  return { top: t, area: base ? t + b + "Z" : null };
}

/** `count` evenly spaced indexes across [i0, i1], endpoints included. */
export const sampleIdx = (i0: number, i1: number, count: number): number[] =>
  Array.from({ length: count }, (_, k) => i0 + Math.round(((i1 - i0) * k) / (count - 1)));

/** 300-point log-scaled sparkline path for the brush (matches the prototype's overview). */
export function sparklinePath(series: number[], w = 300, h = 40, pad = 4): string {
  const n = series.length,
    pts = 300;
  let lo = Infinity,
    hi = -Infinity;
  const vs = Array.from({ length: pts }, (_, q) => {
    const v = Math.log(Math.max(series[Math.round((q / (pts - 1)) * (n - 1))], 1e-12));
    if (v < lo) lo = v;
    if (v > hi) hi = v;
    return v;
  });
  const span = hi - lo || 1;
  return vs
    .map((v, q) => (q ? "L" : "M") + ((q / (pts - 1)) * w).toFixed(0) + " " + (h - pad - ((v - lo) / span) * (h - 2 * pad)).toFixed(1))
    .join("");
}

/** X axis labels: 3 below ~560px plot width, 5 above. */
export const xLabelIdx = (i0: number, i1: number, wide: boolean) => sampleIdx(i0, i1, wide ? 5 : 3);

/** Day index of an ISO date inside a series that starts at unix-second t0. */
export const markerIndex = (isoDate: string, t0: number) =>
  Math.round((Date.parse(`${isoDate}T00:00:00Z`) - t0 * 1000) / (DAY_S * 1000));

/** Pointer x (client px) -> day index; the svg maps 1:1 onto CSS pixels. */
export const idxAtX = (px: number, mLeft: number, plotW: number, i0: number, i1: number) =>
  i0 + Math.round(((px - mLeft) / plotW) * (i1 - i0));

/** Tooltip x: flip to the left of the crosshair near the right edge (240px tooltip). */
export const ttLeft = (x: number, w: number) => (x + 14 + 240 > w ? x - 14 - 240 : x + 14);
