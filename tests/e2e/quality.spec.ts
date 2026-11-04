import AxeBuilder from "@axe-core/playwright";
import { chromium, expect, test } from "@playwright/test";
import { mockRpc, noSideScroll } from "./helpers";

// The UI quality gate from CLAUDE.md, for every route in both locales at 1280 and 390 px:
// no console errors, no horizontal scroll, no serious or critical axe violations,
// a visible focus ring on each of the first 40 focus stops, and exactly one h1.

const ROUTES = [
  "",
  "/explore",
  "/halving",
  "/stats",
  "/submit",
  "/proofs",
  "/projects/quantumpurse", // full file: About, contracts, audits
  "/projects/boolleap", // stale notice
];
const WIDTHS = [1280, 390];
const FOCUS_STOPS = 40;

// The viewport is set per describe block, so the mobile device project would only repeat these runs.
test.skip(({ isMobile }) => isMobile, "widths are set explicitly; runs in the desktop project only");

for (const width of WIDTHS) {
  test.describe(`${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    for (const locale of ["en", "zh"]) {
      for (const route of ROUTES) {
        const path = `/${locale}${route}`;

        test(path, async ({ page }) => {
          const errors: string[] = [];
          page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
          page.on("pageerror", (e) => errors.push(e.message));
          await mockRpc(page);
          await page.goto(path, { waitUntil: "networkidle" });

          await expect(page.locator("h1:visible")).toHaveCount(1);
          await noSideScroll(page);

          const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
          const severe = axe.violations
            .filter((v) => v.impact === "serious" || v.impact === "critical")
            .map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`);
          expect(severe, "axe serious/critical violations").toEqual([]);

          const unfocused: string[] = [];
          for (let i = 0; i < FOCUS_STOPS; i++) {
            await page.keyboard.press("Tab");
            const stop = await page.evaluate(() => {
              const el = document.activeElement as HTMLElement | null;
              if (!el || el === document.body) return null;
              const s = getComputedStyle(el);
              const r = el.getBoundingClientRect();
              const ring = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none";
              const name = `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40)}"`;
              return { name, ok: ring && r.width > 0 && r.height > 0 };
            });
            if (!stop) break; // focus left the page: fewer than 40 stops
            if (!stop.ok) unfocused.push(stop.name);
          }
          expect(unfocused, "focus stops without a visible focus ring").toEqual([]);

          expect(errors, "console errors").toEqual([]);
        });
      }
    }
  });
}

test("the report dialog passes axe and traps focus", async ({ page }) => {
  await mockRpc(page);
  for (const locale of ["en", "zh"]) {
    await page.goto(`/${locale}/projects/joyid`);
    await page.getByRole("button", { name: locale === "en" ? "Report a problem" : "报告问题" }).click();
    const axe = await new AxeBuilder({ page }).include("dialog").withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    expect(axe.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id)).toEqual([]);
    await expect(page.locator("dialog :focus")).toHaveCount(1);
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toBeHidden();
  }
});

// A larger default font is a browser setting, not CSS: it moves rem media queries too, so it has to be set at launch.
for (const [width, fontSize] of [[768, 24], [360, 20], [1280, 16]]) {
  test(`stats: the supply numbers fit at ${width}px with a ${fontSize}px default font`, async ({ baseURL }) => {
    const browser = await chromium.launch({ channel: process.env.CI ? undefined : "chrome", args: [`--blink-settings=defaultFontSize=${fontSize}`] });
    try {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      for (const locale of ["zh", "en"]) {
        await page.goto(`${baseURL}/${locale}/stats`);
        expect(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).fontSize))).toBe(fontSize);
        const overflow = await page.locator("main dl dd").evaluateAll((els) => els.map((d) => d.scrollWidth - d.clientWidth));
        expect(overflow).toHaveLength(4);
        expect(Math.max(...overflow), locale).toBeLessThanOrEqual(0);
      }
    } finally {
      await browser.close();
    }
  });
}
