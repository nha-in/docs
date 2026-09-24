// Compiles the guided loops under skills-src/<name>/ from the journeys and
// the specifications. build-skills.mjs folds each into its module's skill.
//   node scripts/compile-skills.mjs
import {mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, rmSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'yaml';
import {root} from './lib/atoms.mjs';
import {loadJourneys, stepDataName} from './lib/journeys.mjs';
import {errorsFromSpec} from './lib/spec-errors.mjs';

const outDir = join(root, 'skills-src');
const dataDir = join(root, 'site', 'src', 'data', 'api');
const specDir = join(root, 'catalogue', 'openapi', 'hiecm', 'v3');
const journeys = loadJourneys();

const MODULES = {
  gateway: 'the gateway session and bridge registry',
  m1: 'ABHA creation, login and profile management',
  m2: 'care contexts, HIP initiated linking, discovery, and pushing encrypted records to a requester',
  m3: 'raising a consent request, tracking it, and fetching the records it covers as an HIU',
  m4: 'creating an HPID, registering a professional on the HPR, and onboarding a facility to the HFR',
  p1: 'creating an ABHA address in a PHR app and logging in to it',
  p2: 'the PHR profile, linking an ABHA number, switching profiles, and linking, sharing and consent for the patient',
  p3: 'reading, approving, denying, enabling, disabling and updating the patient\'s subscriptions and subscription requests, and the subscription request and notifications on the health locker side',
  p4: 'setting up a health locker and listing the lockers and requests on an ABHA address',
  'scan-and-pay': 'open orders, patient selection and payment status between a facility and a PHR app',
  'record-share': 'a patient sharing chosen records with an HIU from a PHR app after scanning its QR code',
  'scan-and-register': 'receiving the profile a patient shares by QR code at a counter and answering with a queue token',
};

function stepData(step, journeyId, i) {
  const file = join(dataDir, `${stepDataName(step.op, journeyId, i)}.json`);
  if (!existsSync(file)) throw new Error(`run build-api-reference first: ${file} missing`);
  return JSON.parse(readFileSync(file, 'utf8'));
}

const exit = (data) => {
  const ok = data.responses.find((r) => /^2/.test(r.status));
  return ok?.example ? `A ${ok.status} whose body matches:\n\n\`\`\`json\n${JSON.stringify(ok.example, null, 2)}\n\`\`\`` : `A ${ok?.status ?? '2xx'} response. The specification gives no body for it, so read what comes back.`;
};

function buildSkill(module, hasErrorsPage) {
  const list = journeys.get(module) ?? [];
  const sections = list.map((j) => [
    `### ${j.title} (\`${j.id}\`)`, '',
    '**Act: the calls in this journey, in order**', '',
    ...j.steps.map((s, i) => {
      const d = stepData(s, j.id, i);
      // build-api-reference.mjs has already applied a step's `title` and
      // `body`. `say` replaces the inbound line of a callback the step makes
      // rather than receives.
      const act = d.kind === 'callback'
        ? (s.say ?? `Inbound to your bridge at \`${d.path}\`. Acknowledge it and continue.`)
        : `${s.say ? `${s.say}\n\n` : ''}\`\`\`bash\n${d.curl}\n\`\`\``;
      return `#### ${i + 1}. ${d.title ?? d.summary}${s.optional ? ' (optional)' : ''} (\`${s.op}\`)\n\n${act}\n`;
    }),
    '**Exit condition (Observe until this is true)**', '',
    exit(stepData(j.steps[j.steps.length - 1], j.id, j.steps.length - 1)),
  ].join('\n'));
  return `---\nname: hiecm-${module}-build\ndescription: "Use when scaffolding an integration against ABDM ${module.toUpperCase()} (${MODULES[module]}): builds each journey as an observe-orient-decide-act loop against the sandbox."\n---\n` + [
    `# HIE-CM ${module} build`, '',
    `Scaffolds an ABDM ${module} integration one journey at a time. It covers ${MODULES[module]}.`, '',
    '## How this skill runs', '',
    'Every journey below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A step is done only when its exit condition is observed against the sandbox, never because it "should have worked."', '',
    'Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.', '',
    '## Journeys', '', sections.join('\n\n'), '',
    '## Where the detail is', '', `- Every operation, with its body fields and responses: /docs/hiecm/v3/api/${module}`, ...(hasErrorsPage ? [`- Error codes: /docs/hiecm/v3/api/${module}/errors`] : []), '',
  ].join('\n');
}

function debugSkill(module, codes) {
  return `---\nname: hiecm-${module}-debug\ndescription: "Use when an ABDM ${module.toUpperCase()} call fails: matches the error code against the codes the specification's examples return and walks to the operation that returns it, verified by the original step succeeding."\n---\n` + [
    `# HIE-CM ${module} debug`, '',
    'Every error below is an OODA loop: observe the error code and last request id, orient against the matched code, decide the fix, act, and observe whether the original step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.', '',
    'Loop limit: 5 passes per error.', '',
    '## Errors', '',
    ...codes.map((e) => `### ${e.code}\n\n${e.listed ? `**NHA's list for the module:** \`${e.message}\`. NHA names no HTTP status and no call for it.` : `**Specification example:** HTTP ${e.http}, \`${e.message}\`, on \`${e.operationId}\`.`}\n\n**Exit condition: the original call now succeeds.**\n`),
    '## Where the detail is', '', `- The operation that returns each code: /docs/hiecm/v3/api/${module}`, '',
  ].join('\n');
}

// A module retired from MODULES above used to leave its hiecm-<id>-build
// and hiecm-<id>-debug folders sitting here forever, since this script only
// ever wrote, never removed. Prune any such folder for a module that is no
// longer current before writing fresh ones. fhir-audit, fhir-generate and
// README.md are hand-authored, never module-named, and untouched.
for (const entry of readdirSync(outDir)) {
  const match = entry.match(/^hiecm-(.+)-(build|debug)$/);
  if (match && !(match[1] in MODULES) && statSync(join(outDir, entry)).isDirectory()) {
    rmSync(join(outDir, entry), {recursive: true, force: true});
    console.log(`Removed stale skills-src/${entry} (module "${match[1]}" no longer exists).`);
  }
}

for (const module of Object.keys(MODULES)) {
  const spec = parse(readFileSync(join(specDir, `hiecm-${module}.yaml`), 'utf8'));
  const codes = errorsFromSpec(spec);
  const write = (name, body) => { mkdirSync(join(outDir, name), {recursive: true}); writeFileSync(join(outDir, name, 'SKILL.md'), body); console.log(`wrote skills-src/${name}/SKILL.md`); };
  // Same rule build-api-reference.mjs uses to decide whether an errors page exists.
  const hasErrorsPage = codes.length > 0 || Object.keys(spec.webhooks ?? {}).length > 0;
  if ((journeys.get(module) ?? []).length) write(`hiecm-${module}-build`, buildSkill(module, hasErrorsPage));
  if (codes.length) write(`hiecm-${module}-debug`, debugSkill(module, codes));
}
