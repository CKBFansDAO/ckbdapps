import { expect, test, type Page } from "@playwright/test";

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

const noSideScroll = async (page: Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

/** Mock the CKB node: epoch 15000 at index 900/1800, epochs of exactly 4 hours. */
async function mockRpc(page: Page, fail = false) {
  const H = 3_600_000;
  await page.route("https://mainnet.ckb.dev/**", async (route) => {
    if (fail) return route.fulfill({ status: 500, body: "down" });
    const { id, method } = route.request().postDataJSON();
    const now = Date.now();
    const result =
      method === "get_tip_header"
        ? { epoch: `0x${((BigInt(1800) << BigInt(40)) | (BigInt(900) << BigInt(24)) | BigInt(15000)).toString(16)}`, timestamp: `0x${now.toString(16)}`, number: "0x13c07d3" }
        : method === "get_epoch_by_number"
          ? { start_number: "0x1" }
          : { epoch: "0x0", timestamp: `0x${Math.round(now - 1000.5 * 4 * H).toString(16)}`, number: "0x1" };
    await route.fulfill({ contentType: "application/json", body: JSON.stringify({ jsonrpc: "2.0", id, result }) });
  });
}

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

test("home: halving strip shows the live day count", async ({ page }) => {
  await mockRpc(page);
  await page.goto("/en");
  await expect(page.getByText(/CKB halves in/)).toContainText(/\d+/);
  await noSideScroll(page);
});

test("explore: filters live in the URL", async ({ page }) => {
  await page.goto("/en/explore?group=wallets");
  await expect(page.getByRole("button", { name: /^Wallets/ })).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText(/^\d+ of \d+ projects$/)).toHaveText(/^17 of/);
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
  await page.goto("/en/projects/reiwallet");
  await expect(page.getByText(/last verified \d+ months ago/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Send an update" })).toHaveAttribute("href", /\/edit\/main\/content\/projects\/reiwallet\.md$/);
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
