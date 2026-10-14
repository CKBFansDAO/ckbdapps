/**
 * Formatting helpers for the stats page. Pure; used by the server hero and the client charts.
 * The compact forms match the legacy statistics page: B/M/K in English, 亿/万 in Chinese.
 */

export const trimz = (s: string) => (s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s);

/** Big CKB amounts: 1.23B / 12.3亿 */
export function big(n: number, locale: string, d = 2): string {
  if (locale === "zh") {
    if (n >= 1e8) return trimz((n / 1e8).toFixed(d)) + "亿";
    if (n >= 1e4) return trimz((n / 1e4).toFixed(0)) + "万";
    return String(Math.round(n));
  }
  if (n >= 1e9) return trimz((n / 1e9).toFixed(d)) + "B";
  if (n >= 1e6) return trimz((n / 1e6).toFixed(d)) + "M";
  if (n >= 1e3) return trimz((n / 1e3).toFixed(d)) + "K";
  return String(Math.round(n));
}

/** Hash rate: 465P / 115.4P (the API values are already x1000). */
export function hr(n: number, d = 1): string {
  if (n >= 1e15) return trimz((n / 1e15).toFixed(d)) + "P";
  if (n >= 1e12) return trimz((n / 1e12).toFixed(d)) + "T";
  return trimz((n / 1e9).toFixed(d)) + "G";
}

/** USD price: $0.0091 with full precision on the axis. */
export const pr = (p: number, axis = false) => "$" + (axis ? p.toFixed(4) : p < 0.01 ? p.toPrecision(3) : p.toFixed(4));

/** Change over the window; empty when the base is ~0 and the percentage would be absurd. */
export function chg(a: number, b: number): string {
  const c = (b / a - 1) * 100;
  if (!isFinite(c) || Math.abs(c) >= 1000) return "";
  return (c >= 0 ? "+" : "−") + Math.abs(c).toFixed(1) + "%";
}

/** 4-5 round y-axis ticks inside [lo, hi]. */
export function niceTicks(lo: number, hi: number, n: number): number[] {
  const raw = (hi - lo) / n;
  if (!Number.isFinite(raw) || raw <= 0) return [lo];
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const f = raw / mag;
  const step = (f < 1.5 ? 1 : f < 3.5 ? 2 : f < 7.5 ? 5 : 10) * mag;
  const out: number[] = [];
  for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(v);
  return out;
}

/** Compact Y/M/D used on axes, tooltips and the range readout (locale-neutral, numeric). */
export const ymd = (t: number) => {
  const d = new Date(t);
  return `${d.getUTCFullYear()}/${d.getUTCMonth() + 1}/${d.getUTCDate()}`;
};
