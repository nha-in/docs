// Selector + deterministic assembler. Reads M1 Catalogue atoms and writes a
// draft SKILL.md per target skill under plugins/abdm/skills/<name>/.
//
// This is stage one of the pipeline in `skill-compiler`: select, assemble.
// The output is deliberately stilted -- a human (or the agent running the
// compile) does the constrained prose pass by hand afterwards, then
// `validate-skills.mjs` checks the result traces back to real atoms.
//
// Usage: node scripts/compile-skills.mjs [hiecm-m1-build|hiecm-m1-debug]
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadAtoms, root, section } from "./lib/atoms.mjs";

const outDir = join(root, "plugins", "abdm", "skills");
const { atoms, problems } = loadAtoms();
if (problems.length) {
  console.warn("Some Catalogue files did not parse as atoms (ignored, not M1's concern):");
  for (const p of problems) console.warn(`  ${p.file}: ${p.msg}`);
}

const all = [...atoms.values()];
const isM1 = (a) => a.fm.gateway === "hiecm" && a.fm.milestone === "M1";
const flows = all.filter((a) => a.fm.type === "flow" && isM1(a) && (a.fm.skills ?? []).includes("hiecm-m1-build"));
const errors = all.filter((a) => a.fm.type === "error" && isM1(a));

function endpointsFor(flow) {
  return (flow.fm.related?.endpoints ?? []).map((id) => atoms.get(id)).filter(Boolean);
}

function curl(endpoint) {
  const m = section(endpoint.body, "What happens").match(/```bash\n([\s\S]*?)```/);
  return m ? m[1].trim() : "(no curl recorded on this endpoint atom)";
}

function frontmatter(name, description) {
  const escaped = description.replace(/"/g, '\\"');
  return `---\nname: ${name}\ndescription: "${escaped}"\n---\n`;
}

function buildSkill() {
  const flowSections = flows.map((flow) => {
    const eps = endpointsFor(flow);
    const epList = eps.map((e) =>
      `#### ${e.fm.title} (\`${e.fm.id}\`)\n\n\`\`\`bash\n${curl(e)}\n\`\`\`\n`
    ).join("\n");
    return [
      `### ${flow.fm.title} (\`${flow.fm.id}\`)`,
      ``,
      `**Before you start**`,
      ``,
      section(flow.body, "Before you start"),
      ``,
      `**Act: the calls in this flow, in order**`,
      ``,
      epList,
      `**Exit condition (Observe until this is true)**`,
      ``,
      section(flow.body, "How you know it worked"),
      ``,
      `**If it goes wrong**`,
      ``,
      section(flow.body, "When it goes wrong"),
    ].join("\n");
  });

  return frontmatter(
    "hiecm-m1-build",
    "Use when scaffolding an integration against ABDM Milestone 1 (ABHA creation, login, profile): builds each M1 flow as an observe-orient-decide-act loop against the sandbox, citing the Catalogue atom behind every call."
  ) + [
    `# HIE-CM M1 build`,
    ``,
    `Scaffolds an ABDM Milestone 1 integration one flow at a time. M1 covers ABHA creation, login and profile management.`,
    ``,
    `## How this skill runs`,
    ``,
    `Every flow below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the flow step matched below, decide the cheapest next action, act, and return to observe. A flow step is done only when its exit condition is observed against the sandbox, never because it "should have worked."`,
    ``,
    `Loop limit: 8 passes per flow step. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.`,
    ``,
    `## Flows`,
    ``,
    flowSections.join("\n\n"),
  ].join("\n") + "\n";
}

function debugSkill() {
  const errorSections = errors.map((err) => [
    `### ${err.fm.title} (\`${err.fm.id}\`)`,
    ``,
    `**Observed as**`,
    ``,
    section(err.body, "In plain words"),
    ``,
    `**Fix**`,
    ``,
    section(err.body, "When it goes wrong"),
    ``,
    `**Exit condition: the original call now succeeds**`,
    ``,
    section(err.body, "How you know it worked"),
  ].join("\n"));

  return frontmatter(
    "hiecm-m1-debug",
    "Use when an ABDM Milestone 1 call fails or a login/enrolment flow is stuck: matches the error against the Catalogue's M1 error atoms and walks to a named fix, verified by the original step succeeding."
  ) + [
    `# HIE-CM M1 debug`,
    ``,
    `Diagnoses a failed M1 call. Every error below is an OODA loop: observe the error code and last request id, orient against the matched error atom below (list a second hypothesis if the match is not exact), decide the fix, act, and observe whether the *original* step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.`,
    ``,
    `Loop limit: 5 passes per error. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.`,
    ``,
    `## Errors`,
    ``,
    errorSections.join("\n\n"),
  ].join("\n") + "\n";
}

const SKILLS = { "hiecm-m1-build": buildSkill, "hiecm-m1-debug": debugSkill };
const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SKILLS);

for (const name of targets) {
  if (!SKILLS[name]) { console.error(`Unknown skill: ${name}`); process.exit(1); }
  const dir = join(outDir, name);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "SKILL.md");
  writeFileSync(file, SKILLS[name]());
  console.log(`wrote ${file.replace(root + "/", "")}`);
}

console.log(`\n${flows.length} M1 flows, ${errors.length} M1 errors fed this compile.`);
console.log(`This is a draft. Run the constrained prose pass, then node scripts/validate-skills.mjs.`);
