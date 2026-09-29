// The UHI integrators plugin, one skill per service.
//
// Each service names its journeys and the atoms that feed each part of its
// folder; every fact comes from those atoms, the journeys and the
// specifications' step data. compile-skills.mjs writes the two guided loops
// (uhi-<service>-build and -debug) into skills-src/, and build-skills.mjs
// folds them into plugins/uhi-integrators-assistant/skills/uhi-<service>/.
//
// A skill installs and runs alone, so each one repeats what it needs of
// signing, the registry lookup and the context block rather than pointing at
// another skill.
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'yaml';
import {section} from './atoms.mjs';

/** operationId -> x-abdm-hosted-by, across the UHI specifications. */
export function uhiHostedBy(specDir) {
  return new Map(readdirSync(specDir).filter((f) => f.endsWith('.yaml')).flatMap((f) => {
    const spec = parse(readFileSync(join(specDir, f), 'utf8'));
    return Object.values(spec.paths ?? {}).flatMap((item) => Object.values(item)).filter((o) => o?.operationId).map((o) => [o.operationId, o['x-abdm-hosted-by']]);
  }));
}

const flow = (id) => `uhi.flow.${id}`;

export const UHI_SERVICES = [
  {
    id: 'consultation', slug: 'uhi-consultation', title: 'Physical Consultation',
    does: 'finding a doctor near the patient, booking a slot, checking in with the PIN, and cancelling or messaging afterwards',
    example: 'Let patients in our app book a physical consultation',
    page: '/docs/uhi/v1/services/consultation', api: '/docs/uhi/v1/api/consultation', tests: '/docs/uhi/v1/resources/consultation',
    direct: true, audits: true,
    journeys: [
      {module: 'consultation', id: 'uhi-consultation-discovery', flow: flow('consultation-discovery')},
      {module: 'consultation', id: 'uhi-consultation-order', flow: flow('consultation-order')},
      {module: 'consultation', id: 'uhi-consultation-fulfilment', flow: flow('consultation-fulfilment')},
      {module: 'consultation', id: 'uhi-consultation-post-fulfilment', flow: flow('consultation-post-fulfilment')},
    ],
    design: ['uhi.concept.consultation-service-identity', 'uhi.concept.consultation-terms', 'uhi.concept.consultation-reason-codes'],
    test: ['uhi.test.consultation-go-live-checklist'],
  },
  {
    id: 'ambulance', slug: 'uhi-ambulance', title: 'Ambulance Booking',
    does: 'finding an ambulance for a pickup, and getting a quote with its terms',
    example: 'Add ambulance search and a quote to our app',
    page: '/docs/uhi/v1/services/ambulance', api: '/docs/uhi/v1/api/ambulance', tests: '/docs/uhi/v1/resources/ambulance',
    direct: true, audits: false,
    journeys: [
      {module: 'ambulance', id: 'uhi-ambulance-discovery', flow: flow('ambulance-discovery')},
      {module: 'ambulance', id: 'uhi-ambulance-order', flow: flow('ambulance-order')},
    ],
    design: ['uhi.concept.ambulance-service-identity'],
    test: ['context', 'search-filters', 'on-search', 'init', 'eua-screens', 'edge-cases'].map((s) => `uhi.test.ambulance-${s}`),
  },
  {
    id: 'pmjay-hem', slug: 'uhi-pmjay-hem', title: 'PM-JAY HEM hospital discovery',
    does: 'finding PM-JAY empanelled hospitals by speciality, near a location or in a district',
    example: 'Show PM-JAY empanelled hospitals near the patient',
    page: '/docs/uhi/v1/services/pmjay-hem', api: '/docs/uhi/v1/api/network', tests: '/docs/uhi/v1/resources/pmjay-hem',
    direct: false, audits: false,
    journeys: [{module: 'network', id: 'uhi-pmjay-hem', flow: flow('pmjay-hem-discovery')}],
    design: ['uhi.concept.pmjay-hem-service-identity', 'uhi.concept.pmjay-hem-search-variants', 'uhi.concept.pmjay-hem-limits'],
    test: ['context', 'search-filters', 'on-search', 'user-experience', 'edge-cases'].map((s) => `uhi.test.pmjay-hem-${s}`),
  },
  {
    id: 'blood-bank', slug: 'uhi-blood-bank', title: 'Blood Bank discovery',
    does: 'finding blood banks that hold a blood group and component, near a location or in a district',
    example: 'Show blood banks near the patient that hold the group they need',
    page: '/docs/uhi/v1/services/blood-bank', api: '/docs/uhi/v1/api/network', tests: '/docs/uhi/v1/resources/blood-bank',
    direct: false, audits: false,
    journeys: [{module: 'network', id: 'uhi-blood-bank', flow: flow('blood-bank-discovery')}],
    design: ['uhi.concept.blood-bank-service-identity', 'uhi.concept.blood-bank-search-variants', 'uhi.concept.blood-bank-limits'],
    test: [],
  },
  {
    id: 'jan-aushadhi', slug: 'uhi-jan-aushadhi', title: 'Jan Aushadhi',
    does: 'finding Jan Aushadhi Kendras, finding a medicine, and finding the Kendras that stock it',
    example: 'Let patients find a Jan Aushadhi Kendra that stocks their medicine',
    page: '/docs/uhi/v1/services/jan-aushadhi', api: '/docs/uhi/v1/api/network', tests: '/docs/uhi/v1/resources/jan-aushadhi',
    direct: false, audits: false,
    journeys: [
      {module: 'network', id: 'uhi-jan-aushadhi-kendra-search', flow: flow('jan-aushadhi-find-kendra')},
      {module: 'network', id: 'uhi-jan-aushadhi-medicine-search', flow: flow('jan-aushadhi-find-medicine')},
      {module: 'network', id: 'uhi-jan-aushadhi-medicine-stock', flow: flow('jan-aushadhi-find-medicine')},
    ],
    design: ['uhi.concept.jan-aushadhi-service-identity', 'uhi.concept.jan-aushadhi-search-variants'],
    test: [],
  },
  {
    id: 'notto', slug: 'uhi-notto', title: 'NOTTO hospital discovery',
    does: 'finding hospitals authorised for an organ or tissue transplant, by state',
    example: 'Show hospitals authorised for a kidney transplant in a state',
    page: '/docs/uhi/v1/services/notto', api: '/docs/uhi/v1/api/network', tests: '/docs/uhi/v1/resources/notto',
    direct: false, audits: false,
    journeys: [{module: 'network', id: 'uhi-notto', flow: flow('notto-discovery')}],
    design: ['uhi.concept.notto-service-identity', 'uhi.concept.notto-search-variants'],
    test: [],
  },
];

// What an agent sequences on. Every requires is either produced by a service
// or brought from outside the plugin.
export const UHI_EXTERNAL = new Set(['uhi-subscriber-id', 'signing-key-pair', 'callback-url', 'hiecm-m2-complete', 'abdm-docs-mcp']);
const REQUIRES = ['uhi-subscriber-id', 'signing-key-pair', 'callback-url', 'hiecm-m2-complete'];
export const UHI_CONTRACT = {
  consultation: {requires: REQUIRES, produces: ['uhi-appointment']},
  ambulance: {requires: REQUIRES, produces: ['uhi-ambulance-quote']},
  'pmjay-hem': {requires: REQUIRES, produces: ['uhi-pmjay-hospital-list']},
  'blood-bank': {requires: REQUIRES, produces: ['uhi-blood-stock-list']},
  'jan-aushadhi': {requires: REQUIRES, produces: ['uhi-kendra-list', 'uhi-medicine-availability']},
  notto: {requires: REQUIRES, produces: ['uhi-notto-hospital-list']},
};
export const UHI_CONSUMERS = ['uhi-integration-agent', 'uhi-call-debugger'];

// Atoms every service carries, by the part of the folder they feed.
const ROUTER = (s) => [
  'uhi.decision.choose-role', s.design[0], 'uhi.concept.signing-headers', 'uhi.concept.ack-then-answer',
  'uhi.concept.match-transaction-id', ...(s.direct ? ['uhi.concept.direct-calls'] : []), ...(s.audits ? ['uhi.concept.audit-copies'] : []),
];
const DESIGN = ['uhi.concept.aggregate-answers', 'uhi.concept.render-as-results-arrive', 'uhi.concept.paginate-client-side', 'uhi.concept.screen-requirements'];
const INTEGRATE = (s) => [
  'uhi.concept.context-block', 'uhi.concept.signing-headers', 'uhi.concept.signature-construction', 'uhi.concept.key-generation',
  'uhi.concept.verifying-signatures', 'uhi.concept.registry-lookup', 'uhi.concept.gateway-routes',
  ...(s.direct ? ['uhi.concept.direct-calls'] : []), ...(s.audits ? ['uhi.concept.audit-copies'] : []), 'uhi.concept.timeouts',
];
const DEBUG = ['uhi.troubleshooting.first-search', 'uhi.troubleshooting.http-statuses', 'uhi.troubleshooting.registry-lookup'];
const DEBUG_CONCEPTS = ['uhi.concept.error-object', 'uhi.concept.error-send-and-log'];
const BEFORE_FIRST = ['uhi.sandbox.express-intent', 'uhi.sandbox.key-pair', 'uhi.sandbox.registration-form', 'uhi.sandbox.base-urls'];
const TEST = ['uhi.test.every-service-checks', 'uhi.test.run-test-cases', 'uhi.sandbox.demo-sign-off', 'uhi.sandbox.production-switch', 'uhi.troubleshooting.go-live'];

/** Every atom id a service's folder reads, so a missing one fails the build. */
export function atomIdsNamed(s) {
  return [...new Set([...ROUTER(s), ...s.design, ...DESIGN, ...INTEGRATE(s), ...DEBUG, ...DEBUG_CONCEPTS, ...s.test, ...TEST, ...BEFORE_FIRST, ...s.journeys.map((j) => j.flow)])];
}

function need(atoms, id) {
  const a = atoms.get(id);
  if (!a) throw new Error(`the UHI skills name ${id}, which no atom defines`);
  return a;
}

const plain = (a) => section(a.body, 'In plain words');
const demote = (text) => text.replace(/^(#{2,5}) /gm, '#$1 ');

// Who receives each call, from x-abdm-hosted-by. The step's curl is what the
// sender sends; the line says where it lands, which is the side an HSPA or an
// EUA has to build.
const LANDS = {
  gateway: 'This call is sent to the UHI Gateway.',
  eua: "This call arrives at the EUA's `consumer_uri`. If you build the EUA, answer it with `ACK` and match it on `transaction_id`.",
  hspa: "This call arrives at the HSPA's `provider_uri`. If you build the HSPA, answer it with `ACK`, then send the answer the journey names next.",
};

function journeyOf(ctx, j) {
  const found = (ctx.journeys.get(j.module) ?? []).find((x) => x.id === j.id);
  if (!found) throw new Error(`journey ${j.module}/${j.id} is not in catalogue/uhi/openapi/v1/journeys/`);
  return found;
}

/** skills-src/uhi-<service>-build: every journey as an OODA loop. */
export function buildLoop(s, ctx) {
  const blocks = s.journeys.map((j) => {
    const journey = journeyOf(ctx, j);
    const fa = need(ctx.atoms, j.flow);
    const before = section(fa.body, 'Before you start');
    const worked = section(fa.body, 'How you know it worked');
    if (!worked) throw new Error(`${j.flow} has no "How you know it worked", so ${j.id} would ship without an exit condition`);
    const steps = journey.steps.map((step, i) => {
      const d = ctx.stepData(step.op, journey.id, i);
      const lands = LANDS[ctx.hostedBy.get(step.op)] ?? '';
      return `#### ${i + 1}. ${d.title ?? d.summary}${step.optional ? ' (optional)' : ''} (\`${step.op}\`)\n\n${lands ? `${lands}\n\n` : ''}\`\`\`bash\n${d.curl}\n\`\`\`\n`;
    });
    return [
      `### ${journey.title} (\`${journey.id}\`)`, '',
      ...(before ? ['**Before you start**', '', before, ''] : []),
      '**Act: the calls in this journey, in order**', '',
      ...steps,
      '**Exit condition (Observe until this is true)**', '',
      worked, '',
      `From \`${j.flow}\`.`,
    ].join('\n');
  });
  return `---\nname: ${s.slug}-build\ndescription: "Use when scaffolding UHI ${s.title}: builds each journey as an observe-orient-decide-act loop against the sandbox."\n---\n` + [
    `# UHI ${s.title} build`, '',
    `Scaffolds UHI ${s.title} one journey at a time: ${s.does}.`, '',
    '## How this skill runs', '',
    'Every journey below is an OODA loop, not a recipe: observe the actual state (the last `ACK`, the last callback, the last error), orient against the step matched below, decide the cheapest next action, act, and return to observe. A journey is done only when its exit condition is observed, never because a call returned 200.', '',
    'Loop limit: 8 passes per step. Hitting the limit is an escalation: state what was observed, what was tried, and which operation page to read, then ask one question.', '',
    '## Journeys', '', blocks.join('\n\n'), '',
    '## Where the detail is', '', `- The service: ${s.page}`, `- Every operation, with its body fields and responses: ${s.api}`, '',
  ].join('\n');
}

/** skills-src/uhi-<service>-debug: one loop per symptom. UHI publishes no codes. */
export function debugLoop(s, ctx) {
  const symptom = (id) => {
    const a = need(ctx.atoms, id);
    const parts = [plain(a), section(a.body, 'What happens'), section(a.body, 'When it goes wrong')].filter(Boolean);
    return [`### ${a.fm.title}`, '', ...parts.flatMap((p) => [demote(p), '']), `From \`${id}\`.`, '', '**Exit condition: the original step now succeeds.**', ''].join('\n');
  };
  const flowBlock = (id) => {
    const a = need(ctx.atoms, id);
    const wrong = section(a.body, 'When it goes wrong');
    return wrong ? [`### ${a.fm.title}`, '', demote(wrong), '', `From \`${id}\`.`, '', '**Exit condition: the original step now succeeds.**', ''].join('\n') : '';
  };
  const concepts = DEBUG_CONCEPTS.map((id) => {
    const a = need(ctx.atoms, id);
    return [`**${a.fm.title}**`, '', demote(plain(a)), '', `From \`${id}\`.`, ''].join('\n');
  });
  return `---\nname: ${s.slug}-debug\ndescription: "Use when a UHI ${s.title} call fails, a callback never arrives, or a callback never matches: walks the symptom to a fix, verified by the original step succeeding."\n---\n` + [
    `# UHI ${s.title} debug`, '',
    'UHI publishes no error code list. A failure shows as an HTTP status before any body, an error object beside the `ACK`, or a silence after it. Read those, never a code value.', '',
    ...concepts,
    'Every symptom below is an OODA loop: observe the status, the error object and the `transaction_id`, orient against the matched symptom, decide the fix, act, and observe whether the original step now succeeds. Applying a fix is not the exit condition; the original step succeeding is.', '',
    'Loop limit: 5 passes per symptom.', '',
    '## Symptoms', '',
    ...DEBUG.map(symptom),
    ...[...new Set(s.journeys.map((j) => j.flow))].map(flowBlock).filter(Boolean),
    '## Where the detail is', '', '- Errors on UHI: /docs/uhi/v1/concepts/errors', '- Signing: /docs/uhi/v1/concepts/signing', '',
  ].join('\n');
}

const atomSection = (atoms, id, level = 2) => {
  const a = need(atoms, id);
  const hashes = '#'.repeat(level);
  const body = a.body.replace(/^#\s+.+$/m, '').trim().replace(/^## In plain words\n+/m, '');
  return [`${hashes} ${a.fm.title}`, '', body.replace(/^## /gm, `${hashes}# `), '', `From \`${id}\`.`, ''].join('\n');
};

const truncate = (text, n) => {
  const flat = (text ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > n ? `${flat.slice(0, n - 1)}…` : flat;
};

/** The six files of one service's folder, and its row in the skills manifest. */
export function skillFolder(s, ctx) {
  const {atoms} = ctx;
  for (const id of atomIdsNamed(s)) need(atoms, id);
  const {requires, produces} = UHI_CONTRACT[s.id];
  const list = (key, items) => [`${key}:`, ...items.map((i) => `  - ${i}`)];

  // Every operation the service's journeys call, once, in journey order, and
  // the registry lookup, which every service needs to check a signature.
  const steps = s.journeys.flatMap((j) => journeyOf(ctx, j).steps.map((step, i) => ({op: step.op, data: ctx.stepData(step.op, j.id, i)})));
  const ops = [...new Map(steps.map((x) => [x.op, x.data])).entries()];
  const lookup = ctx.stepData('uhi_network_registry_lookup');
  if (lookup && !ops.some(([op]) => op === 'uhi_network_registry_lookup')) ops.push(['uhi_network_registry_lookup', lookup]);
  const opAtoms = new Map([...atoms.values()].filter((a) => a.fm.operation).map((a) => [a.fm.operation, a]));

  const hosts = [...new Map(ops.flatMap(([, d]) => (d.servers ?? []).map((x) => [x.url, x.description]))).entries()];
  const headers = [...new Map(ops.flatMap(([, d]) => (d.headers ?? []).map((h) => [h.name, h.description]))).entries()];

  const integrate = [
    `# Integrate UHI ${s.title}`, '',
    'The calls themselves: where they live, what they need in their headers, one request written out in full, and how every call is signed and matched.', '',
    '## Hosts', '', ...hosts.map(([url, d]) => `- \`${url}\`${d ? ` ${truncate(d, 90)}` : ''}`), '',
    '## Endpoints', '', '| Method | Path | What it does | Direction |', '| --- | --- | --- | --- |',
    ...ops.map(([, d]) => `| \`${d.method}\` | \`${d.path}\` | ${truncate(d.title, 60)} | ${truncate((d.summary.match(/\(([^)]+)\)\s*$/) ?? [])[1] ?? '', 40)} |`), '',
    '## Headers', '', '| Header | What it is |', '| --- | --- |', ...headers.map(([n, d]) => `| \`${n}\` | ${truncate(d, 110).replace(/\|/g, '\\|')} |`), '',
    '## A request, in full', '', '```bash', steps[0].data.curl, '```', '',
    '## What each call is for', '',
    ...ops.flatMap(([op]) => {
      const a = opAtoms.get(op);
      return a ? [`### ${a.fm.title} (\`${op}\`)`, '', plain(a), '', `From \`${a.fm.id}\`.`, ''] : [];
    }),
    '## Signing, the context block and the registry lookup', '',
    ...INTEGRATE(s).map((id) => atomSection(atoms, id, 3)),
  ].join('\n');

  const design = [
    `# Design UHI ${s.title}`, '',
    'What the service is on the network, what a search may carry, what the service will not do, and what the screens around the calls have to do.', '',
    ...s.design.map((id) => atomSection(atoms, id)),
    ...DESIGN.map((id) => atomSection(atoms, id)),
  ].join('\n');

  const testFile = [
    `# Test UHI ${s.title}`, '',
    `The checks this service is held to before go-live, then the steps to production. The full test case list is at ${s.tests}.`, '',
    ...s.test.map((id) => atomSection(atoms, id)),
    ...TEST.map((id) => atomSection(atoms, id)),
  ].join('\n');

  // What has to exist before the first journey is the network registration,
  // not a codebase survey: the shared survey is written for HIE-CM.
  const beforeFirst = [
    '## Before the first journey', '',
    'Register on the network before the first call. Each step below comes from the sandbox page; the first journey cannot pass until all four hold.', '',
    ...BEFORE_FIRST.map((id) => atomSection(atoms, id, 3)),
  ].join('\n');
  const scaffold = [beforeFirst, ctx.scaffold].filter(Boolean).join('\n\n');
  const covers = [
    '- **Scaffold.** Register on the network first, then build each journey as a loop that ends when its exit condition holds. [references/scaffold.md](references/scaffold.md)',
    '- **Design.** What the service is on the network, what a search carries, and what the screens have to do. [references/design.md](references/design.md)',
    `- **Integrate.** ${ops.length} operations, with their hosts, headers and signing. [references/integrate.md](references/integrate.md)`,
    '- **Debug.** The loop from a status, an error object or a missing callback to a named fix. [references/debug.md](references/debug.md)',
    '- **Test.** The checks this service is held to, and the steps to production. [references/test.md](references/test.md)',
  ];
  const router = [
    '---', `name: ${s.slug}`,
    `description: "Use when building, debugging or testing UHI ${s.title}: ${s.does}. Carries the journeys as loops, the calls with their signing, the screen rules, the symptoms of a failed call, and the go-live checks, in references/."`,
    'type: skill', `domain: ${s.id}`, ...list('agent_consumers', UHI_CONSUMERS), ...list('requires', requires), ...list('produces', produces),
    'can_execute: true', 'can_orchestrate: false', '---', '',
    `# UHI ${s.title}`, '',
    `Generated from the ABDM Developer Portal on ${ctx.buildDate}, catalogue version ${ctx.catalogueVersion}. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.`, '',
    `This file is a snapshot. Re-download the whole folder from ${ctx.skillUrl} when it is older than the work you are doing: this router and every file under references/ that it links to.`,
    'If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version.', '',
    `## What you can do with ${s.title}`, '',
    ...[...new Set(s.journeys.map((j) => j.flow))].map((id) => `- ${need(atoms, id).fm.summary}`), '',
    '## What is in this folder', '', ...covers, '',
    'This file is the map. Each line above is a file beside it, opened one at a time rather than read through.', '',
    '## Before anything else', '',
    ...ROUTER(s).map((id) => `- ${need(atoms, id).fm.summary} (\`${id}\`)`), '',
    '## Where the detail is', '',
    `- The service: ${s.page}`, `- Every operation: ${s.api}`, '- Messages, signing, routes and errors: /docs/uhi/v1/concepts/messages', '- Terms: /docs/uhi/v1/getting-started/glossary', '',
  ].join('\n');

  const files = {
    'SKILL.md': router,
    'references/scaffold.md': scaffold,
    'references/design.md': design,
    'references/integrate.md': integrate,
    'references/debug.md': ctx.debug,
    'references/test.md': testFile,
  };
  const manifest = {
    gateway: 'uhi', module: 'UHI', title: s.title, docs: s.page, example: s.example, errorExample: null,
    operations: ops.length, codes: 0, sections: ['scaffold', 'design', 'integrate', 'debug', 'test'],
  };
  return {files, manifest};
}
