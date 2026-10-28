const tag = (locale: string) => (locale === "zh" ? "zh-CN" : "en-US");

export const fmtNum = (n: number, locale: string) => new Intl.NumberFormat(tag(locale), { maximumFractionDigits: 6 }).format(n);

/** Chain times are shown as calendar dates in UTC, so every visitor sees the same date. */
export const fmtDate = (t: number | string, locale: string) =>
  new Intl.DateTimeFormat(tag(locale), { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(
    typeof t === "string" ? Date.parse(`${t}T00:00:00Z`) : t,
  );

/**
 * The same UTC date as digits, for tight spots: 2027/11/21 in Chinese, ISO 2027-11-21 in English
 * (year first, so it never reads as day/month or month/day).
 */
export const fmtDateNum = (t: number, locale: string) => {
  const iso = new Date(t).toISOString().slice(0, 10);
  return locale === "zh" ? iso.replaceAll("-", "/") : iso;
};
