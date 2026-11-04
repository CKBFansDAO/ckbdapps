import assert from "node:assert/strict";
import { createVerify, generateKeyPairSync } from "node:crypto";
import test from "node:test";
import { appJwt, COMMENT_LIMIT, DAILY_LIMIT, decide, fileReport, type IssueSummary } from "./report-github";

const NOW = Date.parse("2026-11-04T12:00:00Z");
const issue = (over: Partial<IssueSummary> = {}): IssueSummary => ({
  number: 1,
  title: "[report] A: website does not open",
  state: "open",
  comments: 0,
  created_at: "2026-11-04T11:00:00Z",
  html_url: "https://github.com/x/y/issues/1",
  ...over,
});
const others = (n: number, created_at = "2026-11-04T11:00:00Z") => Array.from({ length: n }, (_, i) => issue({ number: i + 2, title: `[report] P${i}: other problem`, created_at }));
const TITLE = "[report] A: website does not open";
const REPORT = { title: TITLE, body: "body", comment: "comment" };

test("a new problem creates an issue", () => assert.deepEqual(decide([], TITLE, NOW), { do: "create" }));

test("the same open problem becomes a comment, up to the limit", () => {
  assert.equal(decide([issue()], TITLE, NOW).do, "comment");
  assert.equal(decide([issue({ comments: COMMENT_LIMIT })], TITLE, NOW).do, "known");
});

test("a closed report does not swallow a new one", () => assert.equal(decide([issue({ state: "closed" })], TITLE, NOW).do, "create"));

test("the daily limit counts report issues from the last 24 hours only", () => {
  assert.equal(decide(others(DAILY_LIMIT), TITLE, NOW).do, "limit");
  assert.equal(decide(others(DAILY_LIMIT - 1), TITLE, NOW).do, "create");
  assert.equal(decide(others(DAILY_LIMIT, "2026-11-03T11:00:00Z"), TITLE, NOW).do, "create");
  assert.equal(decide(others(DAILY_LIMIT).map((i) => ({ ...i, title: "Bug" })), TITLE, NOW).do, "create");
});

test("an existing problem can still be added to after the daily limit", () => {
  assert.equal(decide([issue(), ...others(DAILY_LIMIT)], TITLE, NOW).do, "comment");
});

const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
const pem = privateKey.export({ type: "pkcs1", format: "pem" }).toString();

test("the App token is a valid RS256 JWT, valid now, for this App", () => {
  const [head, body, sig] = appJwt("42", pem, NOW).split(".");
  assert.ok(createVerify("RSA-SHA256").update(`${head}.${body}`).verify(publicKey, sig, "base64url"));
  const claims = JSON.parse(Buffer.from(body, "base64url").toString());
  assert.equal(claims.iss, "42");
  assert.ok(claims.iat * 1000 < NOW && claims.exp * 1000 > NOW);
  assert.ok(claims.exp - claims.iat <= 600);
});

test("filing authenticates as the App, then the installation, then creates the issue", async (t) => {
  const calls: { path: string; auth: string; body?: { title: string; labels: string[] } }[] = [];
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    calls.push({ path, auth: new Headers(init.headers).get("authorization")!, body: init.body ? JSON.parse(init.body as string) : undefined });
    if (path.endsWith("/installation")) return Response.json({ id: 7 });
    if (path.endsWith("/access_tokens")) return Response.json({ token: "inst" });
    if (init.method === "GET") return Response.json([]);
    return Response.json({ html_url: "https://github.com/x/y/issues/9" });
  });
  const r = await fileReport("42", pem, REPORT);
  assert.deepEqual(r, { status: "filed", url: "https://github.com/x/y/issues/9" });
  assert.deepEqual(calls.map((c) => c.path), [
    "/repos/CKBFansDAO/ckbdapps/installation",
    "/app/installations/7/access_tokens",
    "/repos/CKBFansDAO/ckbdapps/issues",
    "/repos/CKBFansDAO/ckbdapps/issues",
  ]);
  assert.match(calls[0].auth, /^Bearer ey/);
  assert.equal(calls[3].auth, "Bearer inst");
  assert.deepEqual(calls[3].body?.labels, ["report"]);
});

test("a repeat report posts only the comment text on the open issue", async (t) => {
  const posts: { path: string; body: unknown }[] = [];
  t.mock.method(globalThis, "fetch", async (url: string, init: RequestInit) => {
    const path = new URL(url).pathname;
    if (path.endsWith("/installation")) return Response.json({ id: 7 });
    if (path.endsWith("/access_tokens")) return Response.json({ token: "inst" });
    if (init.method === "GET") return Response.json([issue({ number: 13 })]);
    posts.push({ path, body: JSON.parse(init.body as string) });
    return Response.json({ html_url: "https://github.com/x/y/issues/13#c" });
  });
  assert.deepEqual(await fileReport("42", pem, REPORT), { status: "filed", url: "https://github.com/x/y/issues/13#c" });
  assert.deepEqual(posts, [{ path: "/repos/CKBFansDAO/ckbdapps/issues/13/comments", body: { body: "comment" } }]);
});

test("a GitHub error surfaces, without the token in the message", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("no", { status: 401 }));
  await assert.rejects(fileReport("42", pem, REPORT), (e: Error) => /HTTP 401/.test(e.message) && !e.message.includes("Bearer"));
});
