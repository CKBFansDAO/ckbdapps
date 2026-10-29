import assert from "node:assert/strict";
import test from "node:test";
import { githubRepo, parseTracker } from "./builders-source";

const README = `# Welcome

   ## Project list

| Name  | Project | Repository  | Test link | Development status |
| ----- | ----- | ------ | ----- | ----- |
| Methemeticz   | Verdict: prediction market     |  [Link](https://github.com/JouahriAli/ckb-prediction-market)      |  https://verdict-three.vercel.app/       | Paused |
| Wadie      | Eterna Registry: on-chain land registration     |        |  https://ckb-registry.vercel.app/        | Inactive |
| Oluwaseun      | InheritVault: time-locked inheritance     |    [Link](https://inherit-vault.vercel.app/)    |  https://inherit-vault.vercel.app/         | Implementing feedback |
| Amine | CKB Node Manager | [Link](https://github.com/Amine1n1/ckb-node-manager/releases/tag/v1.0.0) | | Ongoing |
| Smilez | Fiber Desktop | [Link](https://github.com/chukwuma619/fiber-desktop.git) | https://fiber-desktop.vercel.app/ | DAO grant  |
| Kaze team | Kaze | [Link] | https://usekaze.app/ | Ongoing |
| Someone | Kaze | | | Something new |
| jedi | CKScope - A CCC native CKB explorer | | | Ongoing |

After the table.
`;

test("parseTracker: name and description, links, statuses", () => {
  const rows = parseTracker(README);
  assert.equal(rows.length, 8);
  assert.deepEqual(rows[0], {
    id: "verdict",
    name: "Verdict",
    about: "prediction market",
    builder: "Methemeticz",
    repo: "https://github.com/JouahriAli/ckb-prediction-market",
    github: "JouahriAli/ckb-prediction-market",
    link: "https://verdict-three.vercel.app/",
    status: "paused",
  });
  assert.equal(rows[1].repo, undefined);
  assert.equal(rows[1].status, "inactive");
  // A repository link that is the hosted site is shown once, as the link
  assert.equal(rows[2].repo, undefined);
  assert.equal(rows[2].status, "feedback");
  assert.equal(rows[3].about, undefined);
  assert.equal(rows[3].github, "Amine1n1/ckb-node-manager");
  assert.equal(rows[4].github, "chukwuma619/fiber-desktop");
  assert.equal(rows[4].status, "grant");
  // "[Link]" without a target is no link
  assert.equal(rows[5].repo, undefined);
  assert.deepEqual([rows[5].id, rows[6].id], ["kaze", "kaze-2"]);
  assert.equal(rows[6].status, "other");
  assert.deepEqual([rows[7].name, rows[7].about], ["CKScope", "A CCC native CKB explorer"]);
});

test("parseTracker: throws when the README has no table or an empty one", () => {
  assert.throws(() => parseTracker("# nothing here"));
  assert.throws(() => parseTracker("| Name | Project |\n| --- | --- |\n"));
});

test("githubRepo: owner/repo from repository, tree and release links only", () => {
  assert.equal(githubRepo("https://github.com/calledAdo/ckb-buillder-track/tree/main/lenderr_project"), "calledAdo/ckb-buillder-track");
  assert.equal(githubRepo("https://crates.io/crates/ckbuilder"), undefined);
  assert.equal(githubRepo(undefined), undefined);
});
