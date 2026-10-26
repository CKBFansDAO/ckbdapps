import { expect, type Page } from "@playwright/test";

export const noSideScroll = async (page: Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(0);

/** Mock the CKB node: epoch 15000 at index 900/1800, epochs of exactly 4 hours. */
export async function mockRpc(page: Page, fail = false) {
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
