import assert from "node:assert/strict";
import test from "node:test";
import { webpSize } from "./webp";

const riff = (chunk: string, payload: number[]) => {
  const b = Buffer.alloc(40);
  b.write("RIFF", 0, "ascii");
  b.write("WEBP", 8, "ascii");
  b.write(chunk, 12, "ascii");
  payload.forEach((v, i) => (b[20 + i] = v));
  return b;
};

test("webpSize: lossy, lossless and extended headers", () => {
  // VP8: frame tag (3) + start code (3), then 14-bit width and height at 26 and 28.
  const lossy = riff("VP8 ", [0, 0, 0, 0x9d, 0x01, 0x2a]);
  lossy.writeUInt16LE(1600, 26);
  lossy.writeUInt16LE(900, 28);
  assert.deepEqual(webpSize(lossy), { width: 1600, height: 900 });
  // VP8L: signature 0x2f, then width-1 and height-1 in 14 bits each.
  const w = 799, h = 449, bits = w | (h << 14);
  assert.deepEqual(webpSize(riff("VP8L", [0x2f, bits & 0xff, (bits >> 8) & 0xff, (bits >> 16) & 0xff, (bits >> 24) & 0xff])), { width: 800, height: 450 });
  // VP8X: 24-bit width-1 and height-1 at 24 and 27.
  const ext = riff("VP8X", []);
  ext.writeUIntLE(255, 24, 3);
  ext.writeUIntLE(127, 27, 3);
  assert.deepEqual(webpSize(ext), { width: 256, height: 128 });
});

test("webpSize: anything else is undefined", () => {
  assert.equal(webpSize(Buffer.from("not a picture at all, just some text here")), undefined);
  assert.equal(webpSize(Buffer.alloc(10)), undefined);
});
