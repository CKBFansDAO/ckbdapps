import assert from "node:assert/strict";
import test from "node:test";
import YAML from "yaml";
import { Project } from "./content/schema";
import {
  firstSentence,
  githubRepo,
  guessCategories,
  isHomepageCandidate,
  isKnown,
  isSiteRoot,
  knownFrom,
  linksIn,
  nameFromThreadTitle,
  networkOf,
  pageMeta,
  projectFile,
  siteKey,
  slugify,
} from "./discovery";

test("siteKey: one key per site, GitHub Pages scoped to the repo", () => {
  assert.equal(siteKey("https://www.Omiga.io/market?x=1"), "omiga.io");
  assert.equal(siteKey("https://gpblockchain.github.io/ckb-contract-flow-html/"), "gpblockchain.github.io/ckb-contract-flow-html");
  assert.equal(siteKey("mailto:a@b.c"), undefined);
});

test("homepages: forums, code hosts and article sites are not a project's home", () => {
  assert.ok(isHomepageCandidate("https://cellula.id/"));
  for (const u of ["https://talk.nervos.org/t/x/1", "https://github.com/a/b", "https://x.com/a", "https://paragraph.com/@a/b"]) {
    assert.ok(!isHomepageCandidate(u), u);
  }
  assert.ok(isSiteRoot("https://cellula.id/"));
  assert.ok(isSiteRoot("https://invisibook-lab.github.io/"));
  assert.ok(isSiteRoot("https://user.github.io/app/"));
  assert.ok(!isSiteRoot("https://scryvehq.com/article/scryve-is-live"));
  assert.ok(!isSiteRoot("https://play.google.com/store/apps/details?id=x"));
});

test("githubRepo reads owner/repo from repository URLs only", () => {
  assert.equal(githubRepo("https://github.com/LusoCryptoLabs/ckb-pulse/tree/main"), "lusocryptolabs/ckb-pulse");
  assert.equal(githubRepo("https://github.com/a/b.git"), "a/b");
  assert.equal(githubRepo("https://gitlab.com/a/b"), undefined);
});

test("known projects match by site, own subdomain, repo, name and the ignore list", () => {
  const known = knownFrom(
    [
      { name: "CCC", url: "https://docs.ckbccc.com/", github: "ckb-devrel/ccc" },
      { name: "Fiber Studio", url: "https://github.com/chukwuma619/fiber-studio", github: "chukwuma619/fiber-studio" },
      { name: "cknerv", url: "https://cknerv.vercel.app/" },
    ],
    ["johirxofficial/fiber-map", "https://world3.ai"],
  );
  const c = (name: string, url: string, github?: string) => isKnown({ name, url, github }, known);
  assert.ok(c("Playground", "https://live.ckbccc.com/"), "subdomain of a listed project's domain");
  assert.ok(c("Something", "https://example.org", "CKB-DevRel/CCC"), "same repo, any case");
  assert.ok(c("fiber studio", "https://fiberstudio.app"), "same name");
  assert.ok(c("Map", "https://map.example", "johirxofficial/fiber-map"), "ignored repo");
  assert.ok(c("World3", "https://www.world3.ai/"), "ignored site");
  assert.ok(!c("Other app", "https://other.vercel.app/"), "shared hosting is not one domain");
  assert.ok(!c("New", "https://github.com/someone/else"), "github.com itself is never a known site");
});

test("networkOf: mainnet only when it says it is live there, or never names testnet", () => {
  assert.equal(networkOf("Live on mainnet since 21 September"), "mainnet");
  assert.equal(networkOf("did:ckb identity | Live on CKB Testnet and Mainnet"), "mainnet");
  assert.equal(networkOf("Browser game store; CKB purchases on mainnet"), "mainnet");
  assert.equal(networkOf("Try it on Pudge testnet"), "testnet");
  assert.equal(networkOf("Runs on testnet; mainnet support is planned"), "testnet");
  assert.equal(networkOf("CKB_NETWORK | `testnet` or `mainnet` | default `testnet`"), "testnet");
  assert.equal(networkOf("Nervos CKB (Aggron4 Testnet)"), "testnet");
  assert.equal(networkOf("目前只在 testnet 可用，主网还没部署"), "testnet");
  assert.equal(networkOf("A publishing platform"), "unknown");
});

test("guessCategories: keyword guesses from the taxonomy, Tools when nothing fits", () => {
  assert.deepEqual(guessCategories("A non-custodial wallet for CKB"), ["Wallet"]);
  assert.deepEqual(guessCategories("Order book DEX on Fiber"), ["DEX", "Fiber"]);
  assert.deepEqual(guessCategories("A developer dashboard"), ["Tools"]);
});

test("names and slugs", () => {
  assert.equal(nameFromThreadTitle("Introducing FiberScope: explorer, route readiness"), "FiberScope");
  assert.equal(nameFromThreadTitle("[DIS] Fiber Desktop - run Fiber on your laptop"), "Fiber Desktop");
  assert.equal(nameFromThreadTitle("Scryve is live - Publish long-form essays"), "Scryve");
  assert.equal(slugify("Cellula.id"), "cellula-id");
  assert.equal(slugify("  CKB Pulse! "), "ckb-pulse");
});

test("firstSentence keeps one sentence and cuts long text at a word", () => {
  assert.equal(firstSentence("Swap CKB for iCKB. It earns compensation."), "Swap CKB for iCKB.");
  assert.equal(firstSentence("Hi Nervos community, I am building FiberOps. More soon."), "I am building FiberOps.");
  const long = firstSentence("word ".repeat(80), 40);
  assert.ok(long.length <= 40 && long.endsWith("…"));
});

test("linksIn and pageMeta read Discourse posts and page heads", () => {
  const links = linksIn('<p><a href="https://a.io/?x=1&amp;y=2">A <b>App</b></a> by <a href="/u/x">@x</a></p>');
  assert.deepEqual(links, [{ text: "A App", href: "https://a.io/?x=1&y=2" }]);
  const meta = pageMeta(
    `<head><title>Scryve | Web3 publishing</title><meta name="description" content="Tips &amp; essays">
     <link rel="icon" href="/favicon.ico"><link rel="icon" type="image/svg+xml" href="/icon.svg">
     <link rel="apple-touch-icon" href="/touch.png"></head>`,
    "https://scryvehq.com/",
  );
  assert.equal(meta.title, "Scryve | Web3 publishing");
  assert.equal(meta.description, "Tips & essays");
  assert.equal(meta.icon, "https://scryvehq.com/touch.png");
});

test("projectFile writes a valid project with a flow list of categories", () => {
  const md = projectFile(
    { name: "Cellula.id", url: "https://cellula.id/", description: ".cell names on CKB: get paid by name. More text.", source: "", context: "", github: "LusoCryptoLabs/cells-contracts" },
    ["DID", "Nervos DAO"],
    "2026-10-28",
  );
  assert.match(md, /^categories: \[DID, Nervos DAO\]$/m);
  const r = Project.safeParse(YAML.parse(md.split("---")[1]));
  assert.ok(r.success, JSON.stringify(r.error?.issues));
  assert.equal(r.data?.tagline, ".cell names on CKB: get paid by name.");
});
