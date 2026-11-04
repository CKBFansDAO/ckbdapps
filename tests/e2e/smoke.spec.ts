import { expect, test, type Page } from "@playwright/test";
import { mockRpc, noSideScroll } from "./helpers";

// Fail any test that logs a console error or throws in the page.
test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  (page as Page & { errors: string[] }).errors = errors;
});
test.afterEach(async ({ page }) => {
  expect((page as Page & { errors: string[] }).errors).toEqual([]);
});


test("home: search suggestions are keyboard operable", async ({ page }) => {
  await mockRpc(page);
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Find what's built on");
  const box = page.getByRole("combobox", { name: "Search projects" });
  await box.fill("joyid");
  await expect(page.getByRole("option").first()).toContainText("JoyID");
  await box.press("ArrowDown");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/en\/projects\/joyid$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("JoyID");
});

test("home: 'You might like' follows the projects viewed in this browser, with no repeats", async ({ page }) => {
  await mockRpc(page);
  await page.goto("/en");
  await expect(page.getByText(/^Picked at random from apps/)).toBeVisible();
  await page.goto("/en/projects/joyid");
  await page.goto("/en");
  await expect(page.getByText(/^Based on the projects you opened/)).toBeVisible();
  const tiles = page.locator("section.on-paper").first().locator('a[href*="/projects/"] h3');
  const names = await tiles.allTextContents();
  expect(names.slice(0, 6)).not.toContain("JoyID");
  expect(new Set(names).size).toBe(names.length);
});

test("home: the search query reaches Explore after a client navigation", async ({ page }) => {
  await mockRpc(page);
  await page.goto("/en");
  const box = page.getByRole("combobox", { name: "Search projects" });
  await box.fill("Wallet");
  await box.press("Escape");
  await box.press("Enter");
  await expect(page).toHaveURL(/\/en\/explore\?q=Wallet$/);
  await expect(page.getByRole("searchbox", { name: "Filter by name or category" })).toHaveValue("Wallet");
  const [shown, total] = (await page.getByText(/^\d+ of \d+ projects$/).textContent())!.match(/\d+/g)!.map(Number);
  expect(shown).toBeLessThan(total);
});

test("header: the phone menu opens, and Escape closes it and returns focus", async ({ page, isMobile }) => {
  test.skip(!isMobile, "the menu button only exists below 761px");
  await page.goto("/en");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.click();
  await expect(page.locator("#mobile-nav").getByRole("link", { name: "Stats" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator("#mobile-nav")).toHaveCount(0);
  await expect(menu).toBeFocused();
});

test("home: halving strip shows the live day count (not on phones)", async ({ page, isMobile }) => {
  await mockRpc(page);
  await page.goto("/en");
  const strip = page.getByText(/CKB halves in/);
  if (isMobile) await expect(strip).toBeHidden();
  else await expect(strip).toContainText(/\d+/);
  await noSideScroll(page);
});

test("explore: filters live in the URL", async ({ page }) => {
  await page.goto("/en/explore?group=wallets");
  const wallets = page.getByRole("button", { name: /^Wallets/ });
  await expect(wallets).toHaveAttribute("aria-pressed", "true");
  // The list shows exactly as many projects as the tab counts.
  const n = (await wallets.textContent())!.match(/\d+/)![0];
  await expect(page.getByText(/^\d+ of \d+ projects$/)).toHaveText(new RegExp(`^${n} of`));
  await page.getByRole("searchbox", { name: "Filter by name or category" }).fill("ledger");
  await expect(page).toHaveURL(/q=ledger/);
  await expect(page.getByRole("link", { name: /Ledger/ })).toBeVisible();
  await page.getByRole("searchbox", { name: "Filter by name or category" }).fill("zzzz");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page).toHaveURL(/\/en\/explore$/);
  await noSideScroll(page);
});

test("project page: static content, JSON-LD and OG image", async ({ page }) => {
  await page.goto("/en/projects/quantumpurse");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Quantum Purse");
  await expect(page.getByRole("heading", { name: "About" })).toBeVisible();
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(1);
  const og = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect(og).toContain("/en/projects/quantumpurse/opengraph-image");
  const img = await page.request.get(new URL(og!).pathname);
  expect(img.headers()["content-type"]).toBe("image/png");
  await noSideScroll(page);
});

test("project page: stale notice when not verified for a year", async ({ page }) => {
  await page.goto("/en/projects/boolleap");
  await expect(page.getByText(/last verified \d+ months ago/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Send an update" })).toHaveAttribute("href", /\/edit\/main\/content\/projects\/boolleap\.md$/);
});

test("halving: live countdown from the chain", async ({ page }) => {
  await mockRpc(page);
  await page.goto("/en/halving");
  await expect(page.getByRole("timer")).toBeVisible();
  await expect(page.getByText(/^Epoch 17,520, estimated /)).toBeVisible();
  await expect(page.getByText("15,000", { exact: false }).first()).toBeVisible();
  await noSideScroll(page);
});

test("halving: RPC failure shows a retry", async ({ page }) => {
  await mockRpc(page, true);
  await page.goto("/en/halving");
  // The browser logs the failed requests; that is the state under test, not a page error.
  (page as Page & { errors: string[] }).errors = [];
  await expect(page.getByText("Could not reach the CKB node.")).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("button", { name: "Try again" })).toBeVisible();
  (page as Page & { errors: string[] }).errors.length = 0;
});

test("language switch keeps the page and sets zh", async ({ page }) => {
  await page.goto("/en/explore");
  await page.getByRole("link", { name: "中文" }).click();
  await expect(page).toHaveURL(/\/zh\/explore$/);
  await expect(page.locator("html")).toHaveAttribute("lang", "zh-CN");
});

test("legacy URLs redirect", async ({ request }) => {
  for (const [from, to] of [
    ["/ecosystem", "/en/explore"],
    ["/halving", "/en/halving"],
    ["/joyid", "/en/projects/joyid"],
    ["/PolychainCapital", "/en/projects/polychaincapital"],
  ]) {
    const res = await request.get(from, { headers: { "accept-language": "en" } });
    expect(new URL(res.url()).pathname, from).toBe(to);
  }
});

test("machine-readable files", async ({ request }) => {
  const llms = await request.get("/llms.txt");
  expect(await llms.text()).toContain("# CKBdapps");
  const json = await (await request.get("/projects.json")).json();
  expect(json.count).toBeGreaterThan(100);
  expect(await (await request.get("/sitemap.xml")).text()).toContain("/en/projects/joyid");
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
});

test("project: a problem can be reported without an account", async ({ page }) => {
  let sent: Record<string, unknown> = {};
  await page.route("**/api/report", async (route) => {
    sent = route.request().postDataJSON();
    await route.fulfill({ json: { url: "https://github.com/CKBFansDAO/ckbdapps/issues/99" } });
  });
  await page.goto("/en/projects/joyid");
  await page.getByRole("button", { name: "Report a problem" }).click();
  const dialog = page.getByRole("dialog", { name: "Report a problem with JoyID" });
  await dialog.getByRole("radio", { name: "The website does not open" }).check();
  await dialog.getByRole("textbox", { name: "Details (optional)" }).fill("It times out");
  await dialog.getByRole("button", { name: "Send report" }).click();
  await expect(dialog.getByRole("status")).toContainText("Your report has been sent");
  await expect(dialog.getByRole("link", { name: "View it on GitHub" })).toHaveAttribute("href", /issues\/99$/);
  expect(sent).toMatchObject({ slug: "joyid", category: "site-down", description: "It times out", website: "" });
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();
});

test("project: when a report cannot be sent, the form offers GitHub and keeps the text", async ({ page }) => {
  await page.route("**/api/report", (route) => route.fulfill({ status: 503, json: {} }));
  const errors = page as Page & { errors: string[] };
  await page.goto("/zh/projects/joyid");
  await page.getByRole("button", { name: "报告问题" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByRole("radio", { name: "其他" }).check();
  await dialog.getByRole("button", { name: "提交报告" }).click();
  await expect(dialog.getByRole("textbox")).toBeFocused(); // "Other" needs details
  await dialog.getByRole("textbox").fill("名称写错了");
  await dialog.getByRole("button", { name: "提交报告" }).click();
  await expect(dialog.getByRole("link", { name: "去 GitHub 提交" })).toHaveAttribute("href", /issues\/new\?title=/);
  await expect(dialog.getByRole("textbox")).toHaveValue("名称写错了");
  errors.errors.length = 0; // the browser logs the mocked 503 as a console error
});

test("api/report: refuses other sites and anything that is not a report", async ({ request, baseURL }) => {
  const report = { slug: "joyid", category: "site-down", description: "", website: "", elapsed: 9000 };
  const headers = { origin: baseURL! };
  expect((await request.post("/api/report", { data: report })).status()).toBe(403);
  expect((await request.post("/api/report", { data: report, headers: { origin: "https://evil.example" } })).status()).toBe(403);
  expect((await request.post("/api/report", { data: { ...report, slug: "no-such-project" }, headers })).status()).toBe(400);
  expect((await request.post("/api/report", { data: { ...report, category: "spam" }, headers })).status()).toBe(400);
  expect((await request.post("/api/report", { data: "x".repeat(5000), headers })).status()).toBe(413);
  // A script is told it worked, and nothing is filed.
  expect((await request.post("/api/report", { data: { ...report, website: "x" }, headers })).status()).toBe(200);
});
