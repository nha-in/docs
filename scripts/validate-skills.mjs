// Validates compiled skills against the Catalogue they were built from.
// Failures here are build blockers: see `skill-compiler`.
//
// Checks: frontmatter parses and matches the directory name, every atom id
// cited resolves, every endpoint path cited exists in an atom, required
// sections are present, no em dash, and every OODA loop states an exit
// condition and a loop limit.
//
// Usage: node scripts/validate-skills.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parse } from "yaml";
import { loadAtoms, root } from "./lib/atoms.mjs";

const skillsDir = join(root, "plugins", "abdm", "skills");
const { atoms } = loadAtoms();

const KNOWN_PATHS = new Set();
for (const a of atoms.values()) {
  for (const m of a.raw.matchAll(/'(https?:\/\/[^']+)'/g)) KNOWN_PATHS.add(m[1]);
}

const REQUIRED_SECTIONS = {
  "hiecm-m1-build": ["## Flows"],
  "hiecm-m1-debug": ["## Errors"],
};

let failures = [];
function fail(skill, msg) { failures.push(`${skill}: ${msg}`); }

for (const name of readdirSync(skillsDir)) {
  const file = join(skillsDir, name, "SKILL.md");
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { fail(name, "no frontmatter block"); continue; }

  let fm;
  try { fm = parse(m[1]); } catch (e) { fail(name, `frontmatter is not valid YAML: ${e.message}`); continue; }
  if (fm.name !== name) fail(name, `frontmatter name "${fm.name}" does not match directory`);
  if (!fm.description) fail(name, "missing description");

  const body = m[2];
  if (raw.includes("—")) fail(name, "em dash found");

  for (const heading of REQUIRED_SECTIONS[name] ?? []) {
    if (!body.includes(heading)) fail(name, `missing required section: ${heading}`);
  }

  // Every atom id the skill cites must exist in the Catalogue.
  for (const m2 of body.matchAll(/`(hiecm\.[a-z]+\.[a-z0-9-]+)`/g)) {
    if (!atoms.has(m2[1])) fail(name, `cites atom "${m2[1]}", which the Catalogue does not define`);
  }

  // Every curl URL the skill prints must be one an atom actually recorded.
  for (const m3 of body.matchAll(/'(https?:\/\/[^']+)'/g)) {
    if (!KNOWN_PATHS.has(m3[1])) fail(name, `curl target "${m3[1]}" is not recorded on any atom`);
  }

  // Every loop needs a stated limit and every flow/error block needs an
  // exit condition, or an agent following it cannot terminate correctly.
  if (!/Loop limit: \d+ passes? per/.test(body)) fail(name, "no loop limit stated");
  const blocks = body.split(/\n### /).length - 1;
  const exitMentions = (body.match(/Exit condition/g) ?? []).length;
  if (blocks > 0 && exitMentions < blocks) {
    fail(name, `${blocks} loop(s) but only ${exitMentions} exit condition(s)`);
  }
}

if (failures.length) {
  console.error(`${failures.length} problem(s):`);
  for (const f of failures) console.error(`  ${f}`);
  process.exit(1);
}
console.log("All compiled skills trace back to the Catalogue.");
