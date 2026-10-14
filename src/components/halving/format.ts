const tag = (locale: string) => (locale === "zh" ? "zh-CN" : "en-US");

export const fmtNum = (n: number, locale: string) => new Intl.NumberFormat(tag(locale), { maximumFractionDigits: 6 }).format(n);

/** Chain times are shown as calendar dates in UTC, so every visitor sees the same date. */
export const fmtDate = (t: number | string, locale: string) =>
  new Intl.DateTimeFormat(tag(locale), { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }).format(
    typeof t === "string" ? Date.parse(`${t}T00:00:00Z`) : t,
  );

export const DAY = 86_400_000;
