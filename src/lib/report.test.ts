import assert from "node:assert/strict";
import test from "node:test";
import { commentBody, issueBody, issueTitle, looksAutomated, newIssueUrl, parseReport, quoteVisitorText, REPORT_MAX } from "./report";

const project = { slug: "joyid", name: "JoyID", url: "https://joy.id/" };
const valid = { slug: "joyid", category: "site-down", description: " gone ", elapsed: 9000, website: "" };

test("a valid report is trimmed; extra fields are dropped", () => {
  assert.deepEqual(parseReport({ ...valid, ip: "1.1.1.1" }), { ...valid, description: "gone" });
});

test("details are optional, except for 'other'", () => {
  const none = { slug: valid.slug, category: valid.category, elapsed: valid.elapsed, website: valid.website };
  assert.equal(parseReport(none)?.description, "");
  assert.equal(parseReport({ ...none, category: "other" }), null);
  assert.equal(parseReport({ ...valid, category: "other", description: "   " }), null);
});

test("anything else is not a report", () => {
  for (const bad of [null, "x", 1, [], { ...valid, category: "spam" }, { ...valid, slug: 1 }, { ...valid, elapsed: "9" }, { ...valid, description: "x".repeat(REPORT_MAX + 1) }]) {
    assert.equal(parseReport(bad), null, JSON.stringify(bad));
  }
});

test("a filled honeypot or an instant submit counts as automated", () => {
  assert.equal(looksAutomated(parseReport(valid)!), false);
  assert.equal(looksAutomated(parseReport({ ...valid, website: "x.com" })!), true);
  assert.equal(looksAutomated(parseReport({ ...valid, elapsed: 500 })!), true);
});

test("visitor text cannot break out of its code fence", () => {
  const quoted = quoteVisitorText("hi @octocat\n```\n# fake\n````");
  assert.equal(quoted.split("\n").filter((l) => /^`{3,}/.test(l)).length, 2);
  assert.match(quoted, /^```text\n/);
  assert.match(quoted, /\n```$/);
});

test("the issue names the project, its file and the problem", () => {
  assert.equal(issueTitle(project, "renamed"), "[report] JoyID: project has a new name");
  const body = issueBody(project, { category: "site-down", description: "@octocat look" });
  assert.match(body, /content\/projects\/joyid\.md/);
  assert.match(body, /https:\/\/joy\.id\//);
  assert.match(body, /```text\n@octocat look\n```/);
  assert.match(issueBody(project, { category: "site-down", description: "" }), /No details given/);
});

test("a repeat report only adds what the visitor wrote", () => {
  assert.equal(commentBody("@octocat gone"), "```text\n@octocat gone\n```");
  assert.equal(commentBody(""), "Reported again, no details given.");
});

test("the fallback link prefills GitHub's new issue page", () => {
  const u = new URL(newIssueUrl(project, { category: "site-down", description: "gone" }));
  assert.match(u.pathname, /\/issues\/new$/);
  assert.equal(u.searchParams.get("title"), "[report] JoyID: website does not open");
  assert.match(u.searchParams.get("body")!, /gone/);
});
