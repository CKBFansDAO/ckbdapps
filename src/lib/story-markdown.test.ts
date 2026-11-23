import assert from "node:assert/strict";
import test from "node:test";
import { inspectStory, localImage, renderStory } from "./story-markdown";

test("renderStory: sections, pull quotes signed by the builder, no raw HTML", () => {
  const [block, ...rest] = renderStory("Opening.\n\n## A section\n\n> Said it.\n\n<script>x</script>", { slug: "s", quoteBy: "kiwi" });
  assert.equal(rest.length, 0);
  assert.equal(block.kind, "html");
  const html = block.kind === "html" ? block.html : "";
  assert.match(html, /<h2>A section<\/h2>/);
  assert.match(html, /<blockquote[^>]*>[\s\S]*Said it\.[\s\S]*<footer[^>]*>kiwi<\/footer><\/blockquote>/);
  assert.doesNotMatch(html, /<script>/);
});

test("renderStory: a picture that is missing stays text; # becomes h2", () => {
  const blocks = renderStory("# Top\n\n![caption](./missing.webp)", { slug: "none", quoteBy: "x" });
  assert.equal(blocks.length, 1);
  assert.match(blocks[0].kind === "html" ? blocks[0].html : "", /<h2>Top<\/h2>[\s\S]*caption/);
});

test("localImage and inspectStory", () => {
  assert.equal(localImage("./shot-1.webp"), "shot-1.webp");
  assert.equal(localImage("shot-1.webp"), "shot-1.webp");
  assert.equal(localImage("https://x.test/a.webp"), undefined);
  assert.equal(localImage("../other/a.webp"), undefined);
  assert.equal(localImage("./a.png"), undefined);
  assert.deepEqual(inspectStory("![a](./a.webp) and <b>x</b>"), { images: ["./a.webp"], html: true });
});

test("renderStory: a picture on its own line becomes a sized figure served from /stories/<slug>/", () => {
  const blocks = renderStory("Before.\n\n![A caption](./a.webp)\n\nAfter.", { slug: "s", quoteBy: "x", images: { "a.webp": { width: 800, height: 450 } } });
  assert.equal(blocks.length, 3);
  assert.deepEqual(blocks[1], { kind: "image", src: "/stories/s/a.webp", alt: "A caption", width: 800, height: 450 });
});

test("renderStory: code blocks are escaped and keyboard-scrollable", () => {
  const [b] = renderStory("```ts\nconst a = 1 < 2;\n```", { slug: "s", quoteBy: "x" });
  assert.equal(b.kind === "html" && b.html.trim(), '<pre tabindex="0"><code class="language-ts">const a = 1 &#60; 2;</code></pre>');
});
