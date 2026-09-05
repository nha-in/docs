// Selector + deterministic assembler. Reads M1 Catalogue atoms and writes a
// draft SKILL.md per target skill under plugins/abdm-integrators-assistant/skills/<name>/.
//
// This is stage one of the pipeline in `skill-compiler`: select, assemble.
// The output is deliberately stilted -- a human (or the agent running the
// compile) does the constrained prose pass by hand afterwards, then
// `validate-skills.mjs` checks the result traces back to real atoms.
//
// Usage: node scripts/compile-skills.mjs [skill-name ...]
//        node scripts/compile-skills.mjs            compiles every milestone
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { loadAtoms, root, section } from "./lib/atoms.mjs";

const outDir = join(root, "plugins", "abdm-integrators-assistant", "skills");
const { atoms, problems } = loadAtoms();
if (problems.length) {
  console.warn("Some Catalogue files did not parse as atoms (ignored here):");
  for (const p of problems) console.warn(`  ${p.file}: ${p.msg}`);
}

const all = [...atoms.values()];

// One entry per milestone that has atoms to compile from. A milestone with no
// flow atoms gets no build skill and a milestone with no error atoms gets no
// debug skill: an empty OODA loop is worse than none, because an agent reads
// the heading as a promise that the loop is there.
//
// The scope line is what the skill says it covers. It is lifted from that
// milestone's own pages, so a milestone cannot inherit another's claims.
const MILESTONES = [
  {
    id: "M1",
    slug: "m1",
    scope: "ABHA creation, login and profile management",
    buildDescription:
      "Use when scaffolding an integration against ABDM Milestone 1 (ABHA creation, login, profile): builds each M1 flow as an observe-orient-decide-act loop against the sandbox, citing the Catalogue atom behind every call.",
    debugDescription:
      "Use when an ABDM Milestone 1 call fails or a login/enrolment flow is stuck: matches the error against the Catalogue's M1 error atoms and walks to a named fix, verified by the original step succeeding.",
  },
  {
    id: "M2",
    slug: "m2",
    scope: "care contexts, HIP initiated linking, discovery, and pushing encrypted records to a requester",
    buildDescription:
      "Use when scaffolding an integration against ABDM Milestone 2 (care contexts, linking, discovery, sharing records as a HIP): builds each M2 flow as an observe-orient-decide-act loop against the sandbox, citing the Catalogue atom behind every call.",
    debugDescription:
      "Use when an ABDM Milestone 2 call fails or a linking or data transfer flow is stuck: matches the error against the Catalogue's M2 error atoms and walks to a named fix, verified by the original step succeeding.",
  },
  {
    id: "M4",
    slug: "m4",
    scope:
      "creating an HPID, registering a professional on the HPR, onboarding a facility to the HFR, and linking that facility to its bridges",
    buildDescription:
      "Use when scaffolding an integration against ABDM Milestone 4, the NHPR (HPID creation, professional registration, facility onboarding, bridge linkage): builds each M4 journey as an observe-orient-decide-act loop, citing the Catalogue atom behind every step.",
    debugDescription:
      "Use when an ABDM Milestone 4 call fails or an HPR or HFR registration is stuck: matches the HIS error against the Catalogue's M4 error atoms and walks to a named fix, verified by the original step succeeding.",
  },
  {
    id: "P1",
    slug: "p1",
    scope:
      "registration in a PHR application, the four login routes, and the profile the person holds",
    buildDescription:
      "Use when scaffolding the patient side of ABDM Milestone 1 in a PHR application (creating an ABHA address, the four login routes, the profile): builds each P1 flow as an observe-orient-decide-act loop, citing the Catalogue atom behind every step.",
    // NHA records the PHR error codes once against P1 and they apply across
    // P1 to P3, so this is the debug skill for the whole patient side.
    debugDescription:
      "Use when a call from a PHR application fails anywhere in P1, P2 or P3: matches the AS error against the Catalogue's PHR error atoms, which NHA records once for the whole patient side, and walks to a named fix verified by the original step succeeding.",
    // The AS codes are the whole patient side, so this skill says so rather
    // than reading as P1 only and being passed over on a P3 failure.
    debugCovers: "PHR application call, anywhere in P1, P2 or P3",
  },
  {
    id: "P2",
    slug: "p2",
    scope:
      "discovering records held elsewhere, linking care contexts to a health address, and sharing a profile at a facility",
    buildDescription:
      "Use when scaffolding the patient side of ABDM Milestone 2 in a PHR application (discovery, user initiated linking, scan and share at a facility): builds each P2 flow as an observe-orient-decide-act loop, citing the Catalogue atom behind every step.",
    debugDescription: null,
  },
  {
    id: "P3",
    slug: "p3",
    scope:
      "subscriptions, auto approval policies, and fetching the records a granted consent covers",
    buildDescription:
      "Use when scaffolding the patient side of ABDM Milestone 3 in a PHR application (subscriptions, auto approval, granting and revoking consent, fetching records): builds each P3 flow as an observe-orient-decide-act loop, citing the Catalogue atom behind every step.",
    debugDescription: null,
  },
  {
    id: "M3",
    slug: "m3",
    scope: "raising a consent request, tracking it, and fetching the records it covers as an HIU",
    buildDescription:
      "Use when scaffolding an integration against ABDM Milestone 3 (consent requests, artefacts, fetching records as an HIU): builds each M3 flow as an observe-orient-decide-act loop against the sandbox, citing the Catalogue atom behind every call.",
    debugDescription:
      "Use when an ABDM Milestone 3 call fails or a consent or fetch flow is stuck: matches the error against the Catalogue's M3 error atoms and walks to a named fix, verified by the original step succeeding.",
  },
];

const mine = (milestone, type) =>
  all.filter((a) => a.fm.type === type && a.fm.gateway === "hiecm" && a.fm.milestone === milestone.id);

/**
 * The flows a build skill carries. A flow opts in by naming the skill in its
 * `skills` list, which is how the Catalogue says which loop a flow belongs in.
 */
const flowsFor = (milestone) =>
  mine(milestone, "flow").filter((a) =>
    (a.fm.skills ?? []).includes(`hiecm-${milestone.slug}-build`),
  );

/**
 * The errors a debug skill carries: every error atom recorded against the
 * milestone, not only those that name the skill. An error an agent can hit is
 * an error the debug skill should recognise.
 */
const errorsFor = (milestone) => mine(milestone, "error");

/**
 * Catalogue prose links to other atoms by atom id.
 *
 * Stripping those to the bare label, which is what this did while the links
 * were relative file paths, produced "See registration and credentials.": a
 * reader told to look at something and given no way to reach it. The id is
 * kept instead, because the agent reading a compiled skill is exactly the
 * reader that can call get_atom with it.
 *
 * A relative path is still reduced to its label, since that is the dead end
 * the id replaced. Ordinary links, to a docs route or an external page, are
 * left as links: those resolve for anybody.
 */
const ATOM_ID = /^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*\.[a-z0-9.-]+$/;
const deref = (text) =>
  text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (whole, label, href) => {
    if (ATOM_ID.test(href)) return `${label} (${href})`;
    if (/\.md(#[^)]*)?$/.test(href)) return label;
    return whole;
  });

/** The one place a compiled skill sends a reader who needs more than it carries. */
const footer = (milestone) => [
  ``,
  `## Where the detail is`,
  ``,
  `- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/${milestone.slug}`,
  `- The flows as diagrams: /docs/hiecm/v3/milestones/${milestone.slug}`,
  `- Every error code across milestones: /docs/hiecm/v3/reference/error-codes`,
  `- Terms: /docs/hiecm/v3/getting-started/glossary`,
  ``,
].join("\n");

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

function buildSkill(milestone) {
  const flows = flowsFor(milestone);
  const flowSections = flows.map((flow) => {
    const eps = endpointsFor(flow);
    // A flow whose calls are not yet recorded as endpoint atoms says so. The
    // alternative is an empty "the calls in this flow" heading, which reads
    // as "this flow makes no calls".
    const epList = eps.length
      ? eps.map((e) =>
          `#### ${e.fm.title} (\`${e.fm.id}\`)\n\n\`\`\`bash\n${curl(e)}\n\`\`\`\n`
        ).join("\n")
      : `The Catalogue does not yet record this flow's calls as endpoint atoms, so this skill cannot give you the exact requests. Read the operations under /docs/hiecm/v3/api/${milestone.slug} before acting, and treat the exit condition below as the thing to observe.\n`;
    return [
      `### ${flow.fm.title} (\`${flow.fm.id}\`)`,
      ``,
      `**Before you start**`,
      ``,
      deref(section(flow.body, "Before you start")),
      ``,
      `**Act: the calls in this flow, in order**`,
      ``,
      epList,
      `**Exit condition (Observe until this is true)**`,
      ``,
      deref(section(flow.body, "How you know it worked")),
      ``,
      `**If it goes wrong**`,
      ``,
      deref(section(flow.body, "When it goes wrong")),
    ].join("\n");
  });

  return frontmatter(`hiecm-${milestone.slug}-build`, milestone.buildDescription) + [
    `# HIE-CM ${milestone.id} build`,
    ``,
    `Scaffolds an ABDM ${milestone.id} integration one flow at a time. ${milestone.id} covers ${milestone.scope}.`,
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
    footer(milestone),
  ].join("\n") + "\n";
}

function debugSkill(milestone) {
  const errors = errorsFor(milestone);
  const errorSections = errors.map((err) => [
    `### ${err.fm.title} (\`${err.fm.id}\`)`,
    ``,
    `**Observed as**`,
    ``,
    deref(section(err.body, "In plain words")),
    ``,
    `**Fix**`,
    ``,
    deref(section(err.body, "When it goes wrong")),
    ``,
    `**Exit condition: the original call now succeeds**`,
    ``,
    deref(section(err.body, "How you know it worked")),
  ].join("\n"));

  return frontmatter(`hiecm-${milestone.slug}-debug`, milestone.debugDescription) + [
    `# HIE-CM ${milestone.id} debug`,
    ``,
    `Diagnoses a failed ${milestone.debugCovers ?? `${milestone.id} call`}. Every error below is an OODA loop: observe the error code and last request id, orient against the matched error atom below (list a second hypothesis if the match is not exact), decide the fix, act, and observe whether the *original* step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.`,
    ``,
    `Loop limit: 5 passes per error. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.`,
    ``,
    `## Errors`,
    ``,
    errorSections.join("\n\n"),
    footer(milestone),
  ].join("\n") + "\n";
}

// A milestone contributes only the skills its atoms can fill.
const SKILLS = {};
for (const milestone of MILESTONES) {
  if (flowsFor(milestone).length) {
    SKILLS[`hiecm-${milestone.slug}-build`] = () => buildSkill(milestone);
  }
  // P2 and P3 get no debug skill of their own: NHA records the PHR error
  // codes once against P1, so a second and third copy of the same errors
  // would be three skills competing to answer one question.
  if (errorsFor(milestone).length && milestone.debugDescription) {
    SKILLS[`hiecm-${milestone.slug}-debug`] = () => debugSkill(milestone);
  }
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SKILLS);

for (const name of targets) {
  if (!SKILLS[name]) { console.error(`Unknown skill: ${name}`); process.exit(1); }
  const dir = join(outDir, name);
  mkdirSync(dir, { recursive: true });
  const file = join(dir, "SKILL.md");
  writeFileSync(file, SKILLS[name]());
  console.log(`wrote ${file.replace(root + "/", "")}`);
}

console.log("");
for (const milestone of MILESTONES) {
  const f = flowsFor(milestone).length;
  const e = errorsFor(milestone).length;
  console.log(`${milestone.id}: ${f} flow(s), ${e} error(s) fed this compile.`);
}
console.log(`This is a draft. Run the constrained prose pass, then node scripts/validate-skills.mjs.`);
