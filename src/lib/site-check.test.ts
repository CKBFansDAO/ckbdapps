import assert from "node:assert/strict";
import test from "node:test";
import { isDown } from "./site-check";

test("isDown: no answer, gone or a server error", () => {
  for (const s of [null, 404, 410, 500, 502, 503]) assert.equal(isDown(s), true, String(s));
});

test("isDown: a site that answers, even if it refuses a script, is up", () => {
  for (const s of [200, 204, 301, 401, 403, 405, 429]) assert.equal(isDown(s), false, String(s));
});
