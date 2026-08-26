// Compiles a module's documentation into one agent skill.
//
// One file per module, self contained, generated from the same data the pages
// render. A skill is loaded into an agent's context, so it carries the facts
// that stop an agent guessing and links back for the detail it does not carry.
//
// One skill covers the whole module, not one per task. An agent that is
// integrating hits an error and then wants to test, all inside one session, so
// splitting the module across three files just means it loads all three. The
// three jobs are sections instead:
//
//   Integrate  the endpoints, hosts and headers, from the specifications
//   Debug      every recorded error code, from the specs' x-abdm-errors blocks
//   Test       the test matrix, from site/src/data/test-matrix
//
// Output under site/static/skills is a build output. Edit the specs, the test
// matrix and the pages, not the skill.
import {readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'site', 'src', 'data', 'api');
const testDir = join(root, 'site', 'src', 'data', 'test-matrix');
const specDir = join(root, 'catalogue', 'openapi', 'hiecm', 'v3');
const outDir = join(root, 'site', 'static', 'skills');

// Every rule below is lifted from that module's own pages. A rule that is true
// of M1 and not of M2 belongs to M1 only: an agent told the wrong rule is
// worse off than an agent told nothing.
const UNVERIFIED =
  'Nothing here has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.';

const MODULES = [
  {
    id: 'm1',
    slug: 'abdm-m1',
    title: 'M1, ABHA identity',
    docs: '/docs/hiecm/v3/api/m1',
    spec: 'hiecm-m1.yaml',
    sample: 'm1_enrolment_by_aadhaar',
    example: 'Add ABHA creation by Aadhaar OTP to this codebase',
    description:
      'Use when building, debugging or testing ABDM Milestone 1: creating an ABHA number or address, ABHA login, profile management, or the gateway session token. Carries the endpoints, the required headers, the two token rule, the encryption rule, every recorded error code and the M1 test matrix.',
    rules: [
      UNVERIFIED,
      'Get an access token first, from the gateway session endpoint. Every other call needs it in `Authorization: Bearer <token>`.',
      'Two tokens exist and they are not interchangeable. The gateway access token goes in `Authorization`. The user token from an enrolment or a login goes in `X-token`. Profile endpoints need both.',
      "Sensitive fields travel encrypted. Aadhaar numbers, mobile numbers, email addresses, OTP values and passwords are RSA encrypted with NHA's public certificate before they go in the body.",
      'One path serves several jobs. The `scope` array in the body picks which one, so read it before assuming an endpoint does one thing.',
    ],
  },
  {
    id: 'm2',
    slug: 'abdm-m2',
    title: 'M2, linking and sharing',
    docs: '/docs/hiecm/v3/api/m2',
    spec: 'hiecm-m2.yaml',
    example: 'Link a care context for this patient',
    description:
      'Use when building, debugging or testing ABDM Milestone 2: care contexts, HIP initiated linking, discovery, and pushing encrypted health records to a requester. Carries the endpoints, the prerequisites, every recorded error code and the M2 test matrix.',
    rules: [
      UNVERIFIED,
      'You act as the HIP. NHA requires a valid Facility ID and registration in the HIP role before you can create health records and share them.',
      'M2 is keyed to an ABHA address, so a working M1 integration comes first.',
      'Hold a link token per patient, stored at registration. NHA gives its validity as six months and says to validate it before use. If you hold no valid one, regenerate it using demographic authentication.',
      'Records go out as FHIR R4 conforming to the ABDM profiles at https://nrces.in/ndhm/fhir/r4/index.html.',
      'Four callbacks name a path and carry no payload in either of NHA sources: discovery, link init, link confirm and consent notify. Do not assume a body for those.',
    ],
  },
  {
    id: 'm3',
    slug: 'abdm-m3',
    title: 'M3, consent and fetching',
    docs: '/docs/hiecm/v3/api/m3',
    spec: 'hiecm-m3.yaml',
    example: 'Raise a consent request and fetch the records it covers',
    description:
      'Use when building, debugging or testing ABDM Milestone 3: raising a consent request, tracking its status, reading consent artefacts, and fetching encrypted health records as an HIU. Carries the endpoints, the consent rules, every recorded error code and the M3 test matrix.',
    rules: [
      UNVERIFIED,
      'You act as the HIU. The HIE-CM holds the consent and asks the patient on your behalf. No artefact, no records.',
      'The patient must be known to you by ABHA address before you can raise a request.',
      'One consent request can produce more than one artefact. Store the request id and every artefact id.',
      'Records arrive encrypted on your callback URL. Decrypt them, then acknowledge receipt to the gateway.',
      "NHA's schema declares `consentId` and `consentRequestId` as UUIDs while NHA's own examples give values that are not. Do not validate them as UUIDs. Recorded as correction C3 in catalogue/openapi/corrections.",
    ],
  },
];

const operations = readdirSync(dataDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join(dataDir, file), 'utf8')));

function truncate(text, limit) {
  const flat = (text ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > limit ? `${flat.slice(0, limit - 1)}…` : flat;
}

const cell = (text) => truncate(text, 110).replace(/\|/g, '\\|');

/** Every x-abdm-errors block the module's specification carries. */
function errorBlocks(module) {
  const path = join(specDir, module.spec);
  if (!existsSync(path)) return [];
  const spec = parse(readFileSync(path, 'utf8'));
  return Object.keys(spec)
    .filter((key) => key.startsWith('x-abdm-errors'))
    .map((key) => ({
      suffix: key.replace('x-abdm-errors', '').replace(/^-/, ''),
      block: spec[key] ?? {},
    }));
}

function testMatrix(module) {
  const path = join(testDir, `${module.id}.json`);
  return existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : null;
}

function build(module) {
  const mine = operations
    .filter((op) => op.moduleId === module.id || op.moduleId === 'gateway')
    .sort((a, b) => a.tag.localeCompare(b.tag) || a.path.localeCompare(b.path));

  const servers = [
    ...new Map(
      mine.flatMap((op) => op.servers.map((s) => [s.url, s.description])),
    ).entries(),
  ];

  const blocks = errorBlocks(module);
  const matrix = testMatrix(module);
  const codeCount = blocks.reduce((total, {block}) => total + (block.codes?.length ?? 0), 0);
  const testCount = matrix?.groups.reduce((total, group) => total + group.rows.length, 0) ?? 0;

  const lines = [];
  lines.push('---');
  lines.push(`name: ${module.slug}`);
  lines.push(`description: ${module.description}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ABDM ${module.title}`);
  lines.push('');
  lines.push(
    'Generated from the ABDM Developer Portal. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.',
  );
  lines.push('');

  lines.push('## What this skill covers');
  lines.push('');
  lines.push(`- **Integrate.** ${mine.length} operations, with their hosts and headers.`);
  lines.push(
    codeCount
      ? `- **Debug.** ${codeCount} recorded error codes, with the message and what to do.`
      : '- **Debug.** No error code is recorded for this module yet.',
  );
  lines.push(
    testCount
      ? `- **Test.** ${testCount} test cases, each with the call it makes and what to see when it passes.`
      : '- **Test.** No test matrix exists for this module yet.',
  );
  lines.push('');

  lines.push('## Before anything else');
  lines.push('');
  for (const rule of module.rules) lines.push(`- ${rule}`);
  lines.push('');

  lines.push('## Hosts');
  lines.push('');
  for (const [url, description] of servers) {
    lines.push(`- \`${url}\`${description ? ` ${truncate(description, 90)}` : ''}`);
  }
  lines.push('');

  const byTag = new Map();
  for (const op of mine) {
    if (!byTag.has(op.tag)) byTag.set(op.tag, []);
    byTag.get(op.tag).push(op);
  }

  lines.push('## Endpoints');
  lines.push('');
  lines.push(`${mine.length} operations, grouped by the journey they belong to.`);
  lines.push('');
  for (const [tag, ops] of byTag) {
    lines.push(`### ${tag}`);
    lines.push('');
    lines.push('| Method | Path | What it does |');
    lines.push('| --- | --- | --- |');
    for (const op of ops) {
      lines.push(`| \`${op.method}\` | \`${op.path}\` | ${truncate(op.summary, 80)} |`);
    }
    lines.push('');
  }

  lines.push('## Headers');
  lines.push('');
  const headers = new Map();
  for (const op of mine) {
    for (const header of op.headers) {
      if (!headers.has(header.name)) headers.set(header.name, header.description);
    }
  }
  lines.push('| Header | What it is |');
  lines.push('| --- | --- |');
  for (const [name, description] of headers) {
    lines.push(`| \`${name}\` | ${truncate(description, 110)} |`);
  }
  lines.push('');

  lines.push('## A request, in full');
  lines.push('');
  const sample = mine.find((op) => op.id === module.sample) ?? mine[0];
  lines.push('```bash');
  lines.push(sample.curl);
  lines.push('```');
  lines.push('');

  lines.push('## Errors');
  lines.push('');
  if (codeCount === 0) {
    lines.push(
      `The ${module.title} specification records no error code yet. That is a gap in the specification, not a promise that this module cannot fail.`,
    );
    lines.push('');
  }
  for (const {suffix, block} of blocks) {
    const codes = block.codes ?? [];
    if (block.notes) {
      lines.push(block.notes.trim().replace(/^#+ /gm, '### '));
      lines.push('');
    }
    if (codes.length === 0) continue;
    lines.push(`### Codes${suffix ? `, ${suffix}` : ''}`);
    lines.push('');
    if (block.source) {
      lines.push(String(block.source).replace(/\s+/g, ' ').trim());
      lines.push('');
    }
    const withHttp = codes.some((entry) => entry.http !== undefined);
    lines.push(withHttp ? '| Code | HTTP | Message | What to do |' : '| Code | Message | What to do |');
    lines.push(withHttp ? '| --- | --- | --- | --- |' : '| --- | --- | --- |');
    for (const entry of codes) {
      const cells = [`\`${entry.code}\``];
      if (withHttp) cells.push(entry.http ?? '');
      cells.push(cell(entry.message));
      cells.push(cell(entry.action));
      lines.push(`| ${cells.join(' | ')} |`);
    }
    lines.push('');
  }
  lines.push(
    'A code you meet that is not above is one the specifications do not carry yet. Read the code together with the message: a code can appear twice with different meanings.',
  );
  lines.push('');

  lines.push('## Test cases');
  lines.push('');
  if (!matrix) {
    lines.push('No test matrix exists for this module yet.');
    lines.push('');
  } else {
    lines.push(
      `${testCount} cases, from NHA's ${matrix.module} matrix for ${matrix.title}. "Mandatory" is NHA's own marking.`,
    );
    lines.push('');
    for (const group of matrix.groups) {
      lines.push(`### ${group.label}`);
      lines.push('');
      lines.push('| Case | Type | What it proves | Call | Passes when |');
      lines.push('| --- | --- | --- | --- | --- |');
      for (const row of group.rows) {
        const call = row.api ? `\`${row.api.method} ${row.api.path}\`` : row.webhook ? `webhook \`${row.webhook.path ?? row.webhook}\`` : '';
        lines.push(
          `| \`${row.id}\` | ${row.type} | ${cell(row.functionality)} | ${call} | ${cell(row.expected)} |`,
        );
      }
      lines.push('');
    }
  }

  lines.push('## Where the detail is');
  lines.push('');
  lines.push(`- Every endpoint, with its body fields and responses: ${module.docs}`);
  lines.push(`- The flows as diagrams: ${module.docs}/user-journey`);
  lines.push(`- Every error code across modules: /docs/hiecm/v3/reference/error-codes`);
  lines.push(`- Sandbox test data: /docs/hiecm/v3/reference/data-dictionary`);
  lines.push(`- Terms: /docs/hiecm/v3/getting-started/glossary`);
  lines.push('');

  return lines.join('\n');
}

rmSync(outDir, {recursive: true, force: true});
mkdirSync(outDir, {recursive: true});

// What each skill actually turned out to carry. The page renders its capability
// list from this, so a page can never claim a skill covers something the
// generator did not put in it.
const manifest = {};

let count = 0;
for (const module of MODULES) {
  const skill = build(module);
  manifest[module.slug] = {
    module: module.title.split(',')[0],
    title: module.title,
    docs: module.docs,
    example: module.example,
    // A real code from this module, so the page's example question is one the
    // skill can actually answer.
    errorExample: errorBlocks(module).flatMap(({block}) => block.codes ?? [])[0]?.code ?? null,
    operations: operations.filter(
      (op) => op.moduleId === module.id || op.moduleId === 'gateway',
    ).length,
    codes: errorBlocks(module).reduce((total, {block}) => total + (block.codes?.length ?? 0), 0),
    tests:
      testMatrix(module)?.groups.reduce((total, group) => total + group.rows.length, 0) ?? 0,
  };
  const folder = join(outDir, module.slug);
  mkdirSync(folder, {recursive: true});
  writeFileSync(join(folder, 'SKILL.md'), skill);

  // No second artifact for Cursor. Agent Skills is an open standard now, and
  // Cursor, Copilot and Claude all read this same SKILL.md: Cursor from
  // .cursor/skills and .claude/skills, Copilot from .github/skills and
  // .claude/skills. The .mdc rule file that used to live here was a conversion
  // of the same content into an older format nothing needs any more.

  count += 1;
  console.log(
    `Built ${module.slug}: ${skill.split('\n').length} lines, ${Math.round(
      skill.length / 1024,
    )}KB.`,
  );
}

writeFileSync(
  join(root, 'site', 'src', 'data', 'skills.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Compiled ${count} skill(s) into site/static/skills.`);
