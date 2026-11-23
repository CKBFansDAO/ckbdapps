import assert from "node:assert/strict";
import test from "node:test";
import { issueNumbers, padIssue, readingMinutes, storyModified, storyText } from "./story-derive";

test("issueNumbers: oldest is No. 1, same day ordered by slug", () => {
  const no = issueNumbers([
    { slug: "c", published: "2026-11-20" },
    { slug: "b", published: "2026-08-01" },
    { slug: "a", published: "2026-08-01" },
  ]);
  assert.deepEqual([...no], [["a", 1], ["b", 2], ["c", 3]]);
  assert.equal(padIssue(4), "04");
  assert.equal(padIssue(12), "12");
});

test("readingMinutes: 220 English words or 400 Chinese characters a minute, code and image syntax left out", () => {
  assert.equal(readingMinutes("word ".repeat(220), "en"), 1);
  assert.equal(readingMinutes("word ".repeat(221), "en"), 2);
  assert.equal(readingMinutes("字".repeat(800), "zh"), 2);
  assert.equal(readingMinutes("short\n\n```\n" + "code ".repeat(1000) + "\n```\n\n![a long caption](./a.webp)", "en"), 1);
});

test("storyText: Chinese when zh.md exists, otherwise English with the fallback flag on /zh", () => {
  const en = { title: "T", dek: "D", body: "B" };
  const zh = { title: "标题", dek: "副标题", body: "正文" };
  assert.deepEqual(storyText({ en, zh }, "zh"), { ...zh, lang: "zh", fallback: false });
  assert.deepEqual(storyText({ en }, "zh"), { ...en, lang: "en", fallback: true });
  assert.deepEqual(storyText({ en, zh }, "en"), { ...en, lang: "en", fallback: false });
});

test("storyModified: latest correction or the publishing date", () => {
  assert.equal(storyModified({ published: "2026-10-16" }), "2026-10-16");
  assert.equal(
    storyModified({ published: "2026-10-16", corrections: [{ date: "2026-10-21", note: "x" }, { date: "2026-10-18", note: "y" }] }),
    "2026-10-21",
  );
});
