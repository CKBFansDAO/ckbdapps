import assert from "node:assert/strict";
import test from "node:test";
import { sym } from "./derive";

test("sym: two letters, one CJK character, a leading CKB skipped", () => {
  assert.equal(sym("JoyID"), "Jo");
  assert.equal(sym("万向区块链"), "万");
  assert.equal(sym("CKB Guardian"), "Gu");
  assert.equal(sym("CKB AI"), "Ai");
  assert.equal(sym("CKBA"), "Ck");
  assert.equal(sym("OffCKB"), "Of");
  assert.equal(sym("!!"), "?");
});
