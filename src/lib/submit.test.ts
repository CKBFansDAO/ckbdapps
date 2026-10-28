import assert from "node:assert/strict";
import test from "node:test";
import YAML from "yaml";
import { Project } from "./content/schema";
import { NEW_FILE_NAME, newFileUrl, projectTemplate } from "./submit";

test("the starter file is a valid project", () => {
  const front = projectTemplate("2026-10-28").split("---")[1];
  const r = Project.safeParse(YAML.parse(front));
  assert.ok(r.success, JSON.stringify(r.error?.issues));
  assert.equal(r.data?.listed, "2026-10-28");
});

test("the GitHub link prefills the file name and the template", () => {
  const u = new URL(newFileUrl("2026-10-28"));
  assert.match(u.pathname, /\/new\/main\/content\/projects$/);
  assert.equal(u.searchParams.get("filename"), NEW_FILE_NAME);
  assert.equal(u.searchParams.get("value"), projectTemplate("2026-10-28"));
});
