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
//   Debug      every error code the specification's examples return
//
// Output under site/static/skills is a build output. Edit the specs and the
// pages, not the skill.
import {readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, existsSync, cpSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {cleanDescription} from './lib/titles.mjs';
import {errorsFromSpec} from './lib/spec-errors.mjs';
import {loadJourneys} from './lib/journeys.mjs';
import {loadAtoms} from './lib/atoms.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'site', 'src', 'data', 'api');
const specDir = join(root, 'catalogue', 'openapi', 'hiecm', 'v3');
const outDir = join(root, 'site', 'static', 'skills');

// Provenance for the snapshot header. A downloaded skill is frozen while the
// catalogue moves, so every file names the version and date it was built
// from, and its own canonical URL, which is what lets an agent notice the
// copy is stale and heal it. The version is the same catalogue/VERSION the
// MCP indexer stamps into its snapshot, so the two surfaces are comparable.
const catalogueVersion = readFileSync(join(root, 'catalogue', 'VERSION'), 'utf8').trim();
// No clock: a date read from the system would make plugins/abdm-integrators-
// assistant/skills/** (committed) change on every build, in every
// environment, forever. catalogue/VERSION ("2026.09.16") is the date the
// catalogue itself was cut, so it is stable input, not a clock, and it
// doubles as the date site/static/skills/** (gitignored) prints too.
const buildDate = catalogueVersion.replace(/\./g, '-');
// The portal's published address, the same default site/docusaurus.config.ts
// uses. A deployment elsewhere sets DOCUSAURUS_URL (and DOCUSAURUS_BASE_URL).
const siteUrl = `${process.env.DOCUSAURUS_URL ?? 'https://docs.abdm.gov.in'}${process.env.DOCUSAURUS_BASE_URL ?? '/'}`.replace(/\/+$/, '');
// A skill is a folder: this router plus the sections under references/ that it
// links to. Naming the router's own URL here invited a reader to re-fetch one
// file and leave every link in it pointing at a file they no longer have, so
// the refresh names the folder and the section list names what is in it.
const skillUrl = (slug, url) =>
  url ? `${url}/skills/${slug}/` : `the portal's /skills/${slug}/ path`;

// Every rule below is lifted from that module's own pages. A rule that is true
// of M1 and not of M2 belongs to M1 only: an agent told the wrong rule is
// worse off than an agent told nothing.
// Said of the calls, and only of the calls. It used to say "nothing here",
// which stopped being true once a skill carried a design section: those rules
// were observed at a working front desk against the sandbox and each names the
// date it was seen. Claiming they were unproven undersold the one part of the
// skill that had been run, and a reader who discounts it loses the rules that
// stop a journey asking twice.
const UNVERIFIED =
  'No call in this skill has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.';

// Added only where a design section exists, immediately after UNVERIFIED, so
// the two claims are read together rather than a page apart.
const DESIGN_OBSERVED =
  'The design section is the exception. Its rules come from building a working front desk against the sandbox, and each atom it cites names what was observed and the date it was seen.';

// Practices, as distinct from rules. A rule is a fact about one module. A
// practice is how to work so a wrong assumption surfaces in a minute rather
// than after a day, and it holds across every module.
//
// They live in the Catalogue like everything else, at
// shared.concept.integration-practices, so they are linted, rendered on the
// site, and citable by id. An earlier version held the text in this file,
// which made the most cross-cutting content in the repository the only content
// no lint could see and no reader of the docs site ever met.
const practicesAtom = join(root, 'catalogue', 'shared', 'concepts', 'integration-practices.md');
const PRACTICES = (() => {
  const body = readFileSync(practicesAtom, 'utf8');
  const what = body.split('\n## What happens\n')[1]?.split('\n## ')[0] ?? '';
  const items = [...what.matchAll(/^- (.+)$/gm)].map((m) => m[1].trim());
  if (!items.length) throw new Error(`No practices found in ${practicesAtom}`);
  return items;
})();

// Design rules, as distinct from both rules and practices. A rule is a fact
// about one module's calls. A practice is how to work. A design rule is what
// the integration has to do to the journey around those calls: how many
// questions a patient is asked, where a failure is shown, and what a screen is
// forbidden to claim. They decide whether an integration that passes every
// call is one a receptionist can actually use.
//
// Like the practices, they live in the Catalogue rather than in this file, as
// hiecm concept atoms carrying the milestone they belong to, so they are
// linted, citable by id, and reach the Docs MCP through the same snapshot as
// everything else.
// Reading order within a design section. An atom's `order` is the position it
// should be read in, because the rules build on each other: M1's journey order
// rule is what every other M1 rule serves, and sorting by id put it second
// behind a slug beginning with "avoiding". An atom with no order sorts after
// the ordered ones, by id, so adding a rule without deciding where it goes
// appends rather than silently reshuffling the rest.
function byReadingOrder(a, b) {
  const ao = Number.isInteger(a.fm?.order) ? a.fm.order : Infinity;
  const bo = Number.isInteger(b.fm?.order) ? b.fm.order : Infinity;
  if (ao !== bo) return ao - bo;
  return a.fm.id.localeCompare(b.fm.id);
}

// The one line per design atom that the router carries, in reading order.
// The full rule is in the design section; this is what a reader meets before
// deciding whether to open it. Only atoms that set `router` appear, so a
// design rule stays out of the always-loaded part unless its atom says
// otherwise. Four of these used to be strings in this file, which made them
// the only design rules no lint could see and no atom could be cited for.
function routerLines(entries) {
  return entries
    .filter((e) => typeof e.fm?.router === 'string' && e.fm.router.trim())
    .map((e) => e.fm.router.trim().replace(/\s+/g, ' '));
}

const DESIGN_ATOMS = (() => {
  const {atoms, problems} = loadAtoms();
  if (problems.length) {
    // An atom that will not parse is a build failure here, not a warning: a
    // design section would otherwise lose it silently.
    throw new Error(`Catalogue atoms did not parse: ${problems.map((x) => `${x.file}: ${x.msg}`).join(', ')}`);
  }
  const byMilestone = new Map();
  for (const entry of atoms.values()) {
    const fm = entry.fm;
    if (fm?.gateway !== 'hiecm' || fm?.type !== 'concept') continue;
    const key = String(fm.milestone ?? '').toLowerCase();
    if (!byMilestone.has(key)) byMilestone.set(key, []);
    byMilestone.get(key).push(entry);
  }
  for (const list of byMilestone.values()) list.sort(byReadingOrder);
  return byMilestone;
})();

/**
 * The design section for one module, or '' when no atom claims its milestone.
 * Each atom becomes one section, its own headings pushed down a level so the
 * atom's title is what a reader scans. "Before you start" is dropped and the
 * relative links are flattened, because both point at catalogue files that are
 * not beside this one inside a skill folder.
 */
function designSection(module) {
  const list = DESIGN_ATOMS.get(module.id) ?? [];
  if (!list.length) return '';
  const bodies = list.map((entry) => {
    const withoutTitle = entry.body.replace(/^#\s+.+$/m, '').trim();
    const dropped = withoutTitle.replace(/^## Before you start\n[\s\S]*?(?=^## )/m, '');
    const flattened = dropped.replace(/\[([^\]]+)\]\([^)]*\.md\)/g, '$1');
    return [`## ${entry.fm.title}`, '', flattened.replace(/^## /gm, '### ').trim(), ''].join('\n');
  });
  return [
    `# Design ${module.title}`,
    '',
    'What the integration has to do to the journey around the calls: how many questions a patient is asked, where a failure is shown, and what a screen is forbidden to claim. Every rule below comes from a Catalogue atom, cited at the end.',
    '',
    ...bodies,
    '## Where these came from',
    '',
    ...list.map((entry) => '- `' + entry.fm.id + '`'),
    '',
  ].join('\n');
}

const MODULES = [
  {
    id: 'gateway',
    slug: 'abdm-gateway',
    title: 'Gateway, sessions and the bridge registry',
    docs: '/docs/hiecm/v3/api/gateway',
    spec: 'hiecm-gateway.yaml',
    journey: null,
    example: 'Get a gateway access token and register this bridge',
    description:
      'Use when building, debugging or testing the ABDM gateway: the gateway session and bridge registry.',
    rules: [UNVERIFIED],
  },
  {
    id: 'm1',
    slug: 'abdm-m1',
    title: 'M1, ABHA creation and verification',
    docs: '/docs/hiecm/v3/api/m1',
    spec: 'hiecm-m1.yaml',
    example: 'Add ABHA creation by Aadhaar OTP to this codebase',
    description:
      'Use when building, debugging or testing ABDM Milestone 1: creating an ABHA number or address, ABHA login, profile management, or the gateway session token. Carries the endpoints, the required headers, the two token rule, the encryption rule and the error codes its specification\'s examples return. Also carries the scaffolding loop that builds it flow by flow and the loop from a failed call to a named fix, in references/.',
    rules: [
      UNVERIFIED,
      'Get an access token first, from the gateway session endpoint. Every other call needs it in `Authorization: Bearer <token>`.',
      'Two tokens exist and they are not interchangeable. The gateway access token goes in `Authorization`. The user token from an enrolment or a login goes in `X-token`. Profile endpoints need both.',
      "Sensitive fields travel encrypted. Aadhaar numbers, mobile numbers, email addresses, OTP values and passwords are encrypted before they go in the body, then base64 encoded.",
'The certificate response tells you the padding. `GET /v3/profile/public/certificate` returns `{"publicKey", "encryptionAlgorithm"}`. Read that field and translate it for your language. Do not hard code a padding: a constant is right until it is not, and the failure then looks like a bad value rather than a stale constant.',
      'One path serves several jobs. The `scope` array in the body picks which one, so read it before assuming an endpoint does one thing.',
      'The accounts array on a login verification already carries ABHANumber, preferredAbhaAddress, name, gender, dob, profilePhoto and kycVerified, so a registration form can fill the moment the OTP verifies and before any profile call.',
    ],
  },
  {
    id: 'm2',
    slug: 'abdm-m2',
    title: 'M2, health information provider services',
    docs: '/docs/hiecm/v3/api/m2',
    spec: 'hiecm-m2.yaml',
    example: 'Link a care context for this patient',
    description:
      'Use when building, debugging or testing ABDM Milestone 2: care contexts, HIP initiated linking, discovery, and pushing encrypted health records to a requester. Carries the endpoints and the encryption parameters. Also carries the scaffolding loop that builds it flow by flow and the loop from a failed call to a named fix, in references/.',
    rules: [
      UNVERIFIED,
      'You act as the HIP.',
      'M2 is keyed to an ABHA address, so a working M1 integration comes first.',
      'You are the side that encrypts, and the parameters arrive from the requester rather than from you. The health information request carries `keyMaterial` with `cryptoAlg`, `curve: Curve25519`, the requester\'s `dhPublicKey` and a `nonce`. Generate your own Curve25519 pair and your own nonce, and send your public key and nonce back with the data so the requester can derive the same secret.',
      'The key derivation and the symmetric cipher applied over that shared secret are not yet published. Confirm both at onboarding before you ship, rather than inferring them from a sample.',
    ],
  },
  {
    id: 'm3',
    slug: 'abdm-m3',
    title: 'M3, health information user services',
    docs: '/docs/hiecm/v3/api/m3',
    spec: 'hiecm-m3.yaml',
    example: 'Raise a consent request and fetch the records it covers',
    description:
      'Use when building, debugging or testing ABDM Milestone 3: raising a consent request, tracking its status, reading consent artefacts, and fetching encrypted health records as an HIU. Carries the endpoints and the consent rules. Also carries the scaffolding loop that builds it flow by flow and the loop from a failed call to a named fix, in references/.',
    rules: [
      UNVERIFIED,
      'You act as the HIU. The HIE-CM holds the consent and asks the patient on your behalf. No artefact, no records.',
      'The patient must be known to you by ABHA address before you can raise a request.',
      'Records arrive encrypted at the `dataPushUrl` the health information request names. Decrypt them with the key material that request carries.',
    ],
  },
  {
    id: 'm4',
    slug: 'abdm-m4',
    title: 'M4, facility and professional registries',
    docs: '/docs/hiecm/v3/api/m4',
    spec: 'hiecm-m4.yaml',
    example: 'Onboard this facility to the HFR and link its HIP bridge',
    description:
      'Use when building, debugging or testing ABDM Milestone 4, the NHPR: creating an HPID, registering a healthcare professional on the HPR, onboarding a facility to the HFR, and linking that facility to a bridge. Carries the operations, their hosts and headers.',
    rules: [
      UNVERIFIED,
      'Neither registry moves a health record. M4 establishes who the professional is and what the facility is, so every record flow has a verified provider behind it.',
      'The register professional call carries an `hprToken` in its payload, beside the practitioner.',
      'The facility calls are keyed to a `trackingId`, and the facility status values in the examples include `Draft` and `Submitted`. Read the status rather than assuming a facility is complete.',
      'Register professional takes codes, not names. Fetch council, course, college, university, state, district and language from the master data APIs first.',
      '`POST /v1/bridges/MutipleHRPAddUpdateServices` links a facility to a bridge. Each entry names a `bridgeId`, a `hipName`, a `type` such as `HIP`, and whether it is `active`.',
    ],
  },
  {
    id: 'p1',
    slug: 'abdm-p1',
    title: 'P1, PHR registration and login',
    docs: '/docs/hiecm/v3/api/p1',
    spec: 'hiecm-p1.yaml',
    journey: null,
    example: 'Register a new user in this PHR app and log them in',
    description:
      'Use when building, debugging or testing ABDM P1 in a PHR app: creating an ABHA address and logging in to it.',
    rules: [UNVERIFIED],
  },
  {
    id: 'p2',
    slug: 'abdm-p2',
    title: 'P2, PHR management',
    docs: '/docs/hiecm/v3/api/p2',
    spec: 'hiecm-p2.yaml',
    journey: null,
    example: 'Link this user\'s records to their ABHA address from the PHR app',
    description:
      'Use when building, debugging or testing ABDM P2 in a PHR app: the PHR profile, linking an ABHA number, switching profiles, and linking, sharing and consent for the patient.',
    rules: [UNVERIFIED],
  },
  {
    id: 'p3',
    slug: 'abdm-p3',
    title: 'P3, PHR subscriptions',
    docs: '/docs/hiecm/v3/api/p3',
    spec: 'hiecm-p3.yaml',
    journey: null,
    example: 'Let this user approve or deny a subscription request',
    description:
      'Use when building, debugging or testing ABDM P3 in a PHR app: reading, approving, denying, enabling, disabling and updating the patient\'s subscriptions and subscription requests.',
    rules: [UNVERIFIED],
  },
  {
    id: 'p4',
    slug: 'abdm-p4',
    title: 'P4, health lockers',
    docs: '/docs/hiecm/v3/api/p4',
    spec: 'hiecm-p4.yaml',
    journey: null,
    example: 'Set up a health locker for this user',
    description:
      'Use when building, debugging or testing ABDM P4, health lockers: setting up a locker and listing the lockers and requests on an ABHA address.',
    rules: [UNVERIFIED],
  },
  {
    id: 'subscription',
    slug: 'abdm-subscription',
    title: 'Subscriptions',
    docs: '/docs/hiecm/v3/api/subscription',
    spec: 'hiecm-subscription.yaml',
    journey: null,
    example: 'Subscribe this HIU to changes on an ABHA address',
    description:
      'Use when building, debugging or testing ABDM subscriptions: subscribing an HIU to changes on an ABHA address.',
    rules: [UNVERIFIED],
  },
  {
    id: 'scan-and-register',
    slug: 'abdm-scan-and-register',
    title: 'Scan and register',
    docs: '/docs/hiecm/v3/use-cases/scan-and-register',
    spec: 'hiecm-scan-and-register.yaml',
    journey: null,
    example: 'Register the patient who just scanned the counter QR code and hand them a token',
    description:
      'Use when building, debugging or testing ABDM scan and register: receiving the profile a patient shares by QR code at a counter and answering with a queue token.',
    rules: [UNVERIFIED],
  },
  {
    id: 'scan-and-pay',
    slug: 'abdm-scan-and-pay',
    title: 'Scan and pay',
    docs: '/docs/hiecm/v3/api/scan-and-pay',
    spec: 'hiecm-scan-and-pay.yaml',
    journey: null,
    example: 'Open an order at this counter and take payment from a PHR app',
    description:
      'Use when building, debugging or testing ABDM scan and pay: open orders, patient selection and payment status between a facility and a PHR app.',
    rules: [UNVERIFIED],
  },
  {
    id: 'record-share',
    slug: 'abdm-record-share',
    title: 'Patient scan and record share',
    docs: '/docs/hiecm/v3/api/record-share',
    spec: 'hiecm-record-share.yaml',
    journey: null,
    example: 'Receive the records a patient shares from a PHR app after scanning our QR code',
    description:
      'Use when building, debugging or testing ABDM patient scan and record share: a PHR app shares chosen records with an HIU after scanning its QR code, on either side.',
    rules: [UNVERIFIED],
  },
];

// build-api-reference.mjs writes one JSON file per operation and then one
// more per journey step that names it (same operationId, a `journey` field
// added). Reading the directory raw counts an operation once per journey
// that walks it, so a gateway call used by four journeys counted four times
// over. Dedupe by operationId first, keeping the base file (no `journey`
// field) when one exists, so every operation appears here exactly once.
const byOperationId = new Map();
for (const file of readdirSync(dataDir)) {
  if (!file.endsWith('.json')) continue;
  const op = JSON.parse(readFileSync(join(dataDir, file), 'utf8'));
  const existing = byOperationId.get(op.id);
  if (!existing || (existing.journey && !op.journey)) byOperationId.set(op.id, op);
}
const operations = [...byOperationId.values()]
  // An operation a journey names carries no tag, because it is read through
  // the journey. The skill still lists every operation, so group those here.
  .map((op) => ({...op, tag: op.tag ?? 'Other operations'}));

function truncate(text, limit) {
  const flat = (text ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > limit ? `${flat.slice(0, limit - 1)}…` : flat;
}

const cell = (text) => truncate(text, 110).replace(/\|/g, '\\|');

/** Every error code the module's specification examples return. */
function moduleCodes(module) {
  const path = join(specDir, module.spec);
  return existsSync(path) ? errorsFromSpec(parse(readFileSync(path, 'utf8'))) : [];
}

function build(module, url) {
  const mine = operations
    .filter((op) => op.moduleId === module.id || op.moduleId === 'gateway')
    .sort((a, b) => a.tag.localeCompare(b.tag) || a.path.localeCompare(b.path));

  const servers = [
    ...new Map(
      mine.flatMap((op) => op.servers.map((s) => [s.url, s.description])),
    ).entries(),
  ];

  const codes = moduleCodes(module);
  const codeCount = codes.length;

  const lines = [];
  lines.push('---');
  lines.push(`name: ${module.slug}`);
  lines.push(`description: ${module.description}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ABDM ${module.title}`);
  lines.push('');
  lines.push(
    `Generated from the ABDM Developer Portal on ${buildDate}, catalogue version ${catalogueVersion}. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.`,
  );
  lines.push('');
  lines.push(
    `This file is a snapshot. Re-download the whole folder from ${skillUrl(module.slug, url)} when it is older than the work you are doing: this router and every file under references/ that it links to. Fetching this file alone leaves those links pointing at files you do not have.`,
  );
  lines.push(
    'If the abdm-docs MCP server is connected, trust its answers over this file: it serves the current catalogue and stamps every response with its catalogue_version, which you can compare against the version above.',
  );
  lines.push('');

  lines.push('## What this skill covers');
  lines.push('');
  lines.push(`- **Integrate.** ${mine.length} operations, with their hosts and headers.`);
  lines.push(
    codeCount
      ? `- **Debug.** ${codeCount} error codes from the specification's examples, with the message and the operation that returns each.`
      : '- **Debug.** The specification\'s examples return no error code for this module.',
  );

  lines.push('## Before anything else');
  lines.push('');
  for (const rule of module.rules) {
    lines.push(`- ${rule}`);
    if (rule === UNVERIFIED && DESIGN_ATOMS.has(module.id)) {
      lines.push(`- ${DESIGN_OBSERVED}`);
      for (const line of routerLines(DESIGN_ATOMS.get(module.id))) lines.push(`- ${line}`);
    }
  }
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
      // NHA's summary opens with "This API is invoked to", which spends 22 of
      // the 80 characters before it says anything and pushes the rest past the
      // cut. The opener is stripped, not the meaning. The summary itself stays
      // in this column rather than the derived title: the title is a short name
      // for a sidebar, is not unique across operations, and for a route-derived
      // one would only repeat the path column beside it.
      lines.push(`| \`${op.method}\` | \`${op.path}\` | ${truncate(cleanDescription(op.summary), 80)} |`);
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
      `The ${module.title} specification's examples return no error code yet. That is a gap in the specification, not a promise that this module cannot fail.`,
    );
    lines.push('');
  }
  if (codeCount) {
    lines.push('### Codes');
    lines.push('');
    lines.push('| Code | HTTP | Message | Returned by |');
    lines.push('| --- | --- | --- | --- |');
    for (const entry of codes) {
      lines.push(
        `| \`${entry.code}\` | ${entry.http || ''} | ${cell(entry.message)} | ${entry.operationId ? `\`${entry.operationId}\`` : "NHA's list for the module"} |`,
      );
    }
    lines.push('');
  }
  lines.push(
    'A code you meet that is not above is one the specifications do not carry yet. Read the code together with the message: a code can appear twice with different meanings.',
  );
  lines.push('');

  lines.push('## Where the detail is');
  lines.push('');
  lines.push(`- Every endpoint, with its body fields and responses: ${module.docs}`);
  if (module.journey !== null) {
    lines.push(
      `- The flows as diagrams: ${module.journey ?? module.docs.replace(/\/api\/([^/]+)$/, '/milestones/$1')}`,
    );
  }
  lines.push(`- Every error code across modules: /docs/hiecm/v3/reference/error-codes`);
  lines.push(`- Terms: /docs/hiecm/v3/getting-started/glossary`);
  lines.push('');

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// One skill per module, and the jobs inside it are files.
//
// This file has said since it was written that one skill covers the whole
// module, not one per task, because an agent that is integrating hits an error
// and then wants to test, all inside one session, and splitting the module
// across three skills only means it loads three. A second generator then
// compiled the guided loops as fourteen more top level skills and did exactly
// that: twenty two skills, three of them about M1, each announcing itself at
// startup and each sending the reader to the other two.
//
// They are sections now. They are separate files rather than one long one
// because the Agent Skills specification reads SKILL.md in full the moment a
// skill activates, recommends keeping that under 500 lines, and has
// references/ for everything else: loaded on demand, named from the router
// above them. A merged M1 is about 1500 lines, so the router is what SKILL.md
// holds and the four jobs sit underneath it.
//
//   references/scaffold.md   build it, flow by flow, against the sandbox
//   references/integrate.md  the endpoints, hosts, headers and a full request
//   references/debug.md      the loop to a named fix, then every error code
//   references/test.md       the test matrix
const guidedDir = join(root, 'skills-src');

/** Which generated sections make up which reference file. */
const INTEGRATE = ['Hosts', 'Endpoints', 'Headers', 'A request, in full'];

/**
 * Splits a generated skill on its own `## ` headings.
 *
 * Reassembling from the finished document rather than building each file
 * separately keeps one code path producing the prose: a section reads the same
 * whether it ends up in the router or in a reference beneath it.
 */
function sections(markdown) {
  const found = new Map();
  for (const part of markdown.split(/\n(?=## )/)) {
    const heading = part.match(/^## (.+)$/m);
    if (heading) found.set(heading[1].trim(), part.trim());
  }
  return found;
}

/** Everything above the first `## `: frontmatter, title, provenance. */
/**
 * What the module actually lets you build, in a reader's terms rather than in
 * operation names. People who download a skill are deciding whether it covers
 * their case, and a list of 55 paths does not answer that.
 */
const CAPABILITIES = {
  m1: [
    'Create an ABHA for somebody who has none: by Aadhaar, by mobile, by an identity document, by face or fingerprint, or under a parent for a child.',
    'Log in somebody who already has one, by Aadhaar, mobile, ABHA number or ABHA address.',
    'Read their profile, which carries the whole registration form: names, date of birth, gender, mobile, address with its codes, and a photograph.',
    'Find an ABHA somebody has forgotten, and pick the right account when one mobile holds several.',
    'Show the ABHA card and QR code, and take a profile a patient shares by QR at your counter.',
    'Update a profile, change a mobile, and upgrade a mobile made address to KYC verified.',
  ],
  m2: [
    'Tell ABDM a patient had a visit with you, so their records can be found later.',
    'Answer a discovery request when somebody looks for that patient.',
    'Send records out encrypted when a consent says you must.',
    'Get the link token the linking calls need.',
  ],
  m3: [
    'Ask a patient, through their consent manager, for records another provider holds.',
    'Track that request through a grant, a denial, a revocation and an expiry.',
    'Receive the encrypted records at your data push URL and decrypt them.',
    'Handle one request that produces several consent artefacts.',
  ],
  m4: [
    'Create an HPID for a professional and register them in the HPR.',
    'Register a facility in the HFR and carry it through to submission.',
    'Link a facility to a bridge and set the type of each link.',
    'Fetch the council, course, college, university and geography codes these calls take instead of names.',
  ],
};

const JOURNEYS = loadJourneys();

function capabilities(module) {
  // A module with no hand-written lines lists its journeys, so the heading is never empty.
  const items = CAPABILITIES[module.id] ?? [...new Set((JOURNEYS.get(module.id) ?? []).map((j) => j.title))];
  if (!items.length) return [];
  return [...items.map((c) => `- ${c}`), '',
    'What it cannot do yet matters as much. Read **Before anything else** below before assuming a capability is one endpoint away.'];
}

function head(markdown) {
  return markdown.split(/\n(?=## )/)[0].trim();
}

/**
 * A guided loop's body, ready to be a reference.
 *
 * The frontmatter goes. A reference is not a skill, and a second `name:` in
 * the same folder is a second skill to any client that goes looking.
 */
function guided(name) {
  const file = join(guidedDir, name, 'SKILL.md');
  if (!existsSync(file)) return '';
  return readFileSync(file, 'utf8').replace(/^---\n[\s\S]*?\n---\n/, '').trim();
}

function guidedTitle(name) {
  const raw = readFileSync(join(guidedDir, name, 'SKILL.md'), 'utf8');
  return parse(raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '')?.description ?? '';
}


// The survey that precedes the first journey when the target is a system that
// already exists. It is the build loop's own first Observe phase, the repo as
// it is, extended to a system with patients, records, an HTTP client and a
// way of keeping secrets already in it, and it exits on a written plan rather
// than on a call succeeding. It lives in the Catalogue as
// shared.concept.survey-an-existing-codebase for the same reason the practices
// and the design rules do, and folds into every scaffold that has journeys.
const SURVEY_ATOM = 'shared.concept.survey-an-existing-codebase';

function surveySection() {
  const {atoms} = loadAtoms();
  const entry = atoms.get(SURVEY_ATOM);
  if (!entry) throw new Error(`${SURVEY_ATOM} is missing, and every scaffold folds it in`);
  const withoutTitle = entry.body.replace(/^#\s+.+$/m, '').trim();
  // Links point at catalogue files that are not beside a skill; the text
  // they carry is still the right pointer.
  const flattened = withoutTitle.replace(/\[([^\]]+)\]\([^)]*\.md\)/g, '$1');
  return [
    '## Before the first journey, when the codebase already exists',
    '',
    'Skip this section only for a system that does not exist yet. Otherwise it runs first, and its exit condition is a written plan, not a call.',
    '',
    flattened.replace(/^## /gm, '### ').trim(),
    '',
    `From \`${SURVEY_ATOM}\`.`,
    '',
  ].join('\n');
}

/** Inserts the survey ahead of the journeys, or at the end when there is no such heading. */
function withSurvey(scaffold) {
  if (!scaffold) return scaffold;
  const marker = '\n## Journeys\n';
  const at = scaffold.indexOf(marker);
  const section = surveySection();
  if (at === -1) return `${scaffold.trimEnd()}\n\n${section}`;
  return `${scaffold.slice(0, at)}\n${section}${scaffold.slice(at)}`;
}

/** Which guided loop is which section of which skill. */
const FOLD = Object.fromEntries(
  MODULES.map((module) => [
    module.slug,
    {scaffold: `hiecm-${module.id}-build`, debug: `hiecm-${module.id}-debug`},
  ]),
);

// Wiping the whole directory before writing only the modules MODULES still
// names is the pruning: a module dropped from the list above leaves no
// abdm-<slug> folder behind in either place that ships skills, because
// nothing gets a chance to survive the rmSync.
rmSync(outDir, {recursive: true, force: true});
mkdirSync(outDir, {recursive: true});

// The plugin ships the same folders the site serves: one per module, plus
// abdm-fhir. It used to ship the guided loops and nothing else, so the plugin
// and the site offered different sets under the same names.
const pluginDir = join(root, 'plugins', 'abdm-integrators-assistant', 'skills');
rmSync(pluginDir, {recursive: true, force: true});
mkdirSync(pluginDir, {recursive: true});

/**
 * Writes one skill folder to both places that ship it. `files` goes to
 * site/static/skills (gitignored, free to carry the environment's
 * DOCUSAURUS_URL); `pluginFiles` goes to the committed plugin copy, which
 * must render the same regardless of who runs the build, so it defaults to
 * `files` but a caller with URL-bearing content passes the frozen version.
 */
function emit(name, files, pluginFiles = files) {
  const write = (base, entries) => {
    const folder = join(base, name);
    mkdirSync(join(folder, 'references'), {recursive: true});
    for (const [path, body] of Object.entries(entries)) {
      writeFileSync(join(folder, path), body.endsWith('\n') ? body : `${body}\n`);
    }
  };
  write(outDir, files);
  write(pluginDir, pluginFiles);
}

// What each skill actually turned out to carry. The page renders its capability
// list from this, so a page can never claim a skill covers something the
// generator did not put in it.
const manifest = {};

for (const module of MODULES) {
  const whole = build(module, siteUrl);
  // Same content, but the one line naming a canonical URL falls back to
  // naming the path instead: this is what the committed plugin copy renders,
  // so it reads the same whether DOCUSAURUS_URL was set at build time or not.
  const wholeFrozen = build(module, null);
  const parts = sections(whole);
  const fold = FOLD[module.slug] ?? {};

  const operationCount = operations.filter(
    (op) => op.moduleId === module.id || op.moduleId === 'gateway',
  ).length;
  const codes = moduleCodes(module);
  const codeCount = codes.length;

  const files = {};
  const covers = [];

  const scaffold = fold.scaffold ? withSurvey(guided(fold.scaffold)) : '';
  if (scaffold) {
    files['references/scaffold.md'] = scaffold;
    covers.push(
      `- **Scaffold.** Survey the codebase first when one exists, then build it flow by flow against the sandbox, as a loop that ends when the step's exit condition holds rather than on a call returning 200. [references/scaffold.md](references/scaffold.md)`,
    );
  }

  // Design before integrate: an integrator who reads the calls first builds
  // the journey the specification implies, which is the one that asks a
  // patient the same question twice.
  const design = designSection(module);
  if (design) {
    files['references/design.md'] = design;
    covers.push(
      `- **Design.** What the journey around the calls has to do, and what a screen is forbidden to claim. [references/design.md](references/design.md)`,
    );
  }

  const integrate = INTEGRATE.map((heading) => parts.get(heading)).filter(Boolean);
  if (integrate.length) {
    files['references/integrate.md'] = [
      `# Integrate ${module.title}`,
      '',
      'The calls themselves: where they live, what they need in their headers, and one request written out in full.',
      '',
      ...integrate,
    ].join('\n');
    covers.push(
      `- **Integrate.** ${operationCount} operations, with their hosts and headers. [references/integrate.md](references/integrate.md)`,
    );
  }

  // The loop first, then the codes. A reader who arrives with a failing call
  // wants the procedure; the table is what the procedure sends them to.
  const debugParts = [];
  const debugLoop = fold.debug ? guided(fold.debug) : '';
  if (debugLoop) debugParts.push(debugLoop);
  const errors = parts.get('Errors');
  if (errors) {
    debugParts.push(debugLoop ? `## Every code in the specification\n\n${errors.replace(/^## Errors\n+/, '')}` : errors);
  }
  if (debugParts.length) {
    files['references/debug.md'] = debugLoop
      ? debugParts.join('\n\n')
      : [
          `# Debug ${module.title}`,
          '',
          'The codes this module can return, with the message and the operation that returns each.',
          '',
          ...debugParts,
        ].join('\n');
    covers.push(
      codeCount
        ? `- **Debug.** ${
            debugLoop ? 'The loop from a failed call to a named fix, and ' : ''
          }${codeCount} error codes from the specification's examples. [references/debug.md](references/debug.md)`
        : `- **Debug.** ${
            debugLoop ? 'The loop from a failed call to a named fix. ' : ''
          }The specification's examples return no error code for this module. [references/debug.md](references/debug.md)`,
    );
  }

  const skillMd = (headText) =>
    [
      headText,
      '',
      ...(capabilities(module).length
        ? [`## What you can do with ${module.title.split(',')[0]}`, '', ...capabilities(module), '']
        : []),
      '## What is in this folder',
      '',
      // Five files and no clue which to open. Say what each one answers.
      ...covers,
      '',
      'This file is the map. Each line above is a file beside it, opened one at a time rather than read through.',
      '',
      parts.get('Before anything else'),
      '',
      '## Practices that hold across every call',
      '',
      ...PRACTICES.map((practice) => `- ${practice}`),
      '',
      parts.get('Where the detail is'),
    ]
      .filter((part) => part !== undefined)
      .join('\n');

  files['SKILL.md'] = skillMd(head(whole));
  const pluginFiles = {...files, 'SKILL.md': skillMd(head(wholeFrozen))};

  emit(module.slug, files, pluginFiles);

  manifest[module.slug] = {
    module: module.title.split(',')[0],
    title: module.title,
    docs: module.docs,
    example: module.example,
    // A real code from this module, so the page's example question is one the
    // skill can actually answer.
    errorExample: codes[0]?.code ?? null,
    operations: operationCount,
    codes: codeCount,
    sections: Object.keys(files)
      .filter((path) => path.startsWith('references/'))
      .map((path) => path.replace(/^references\/|\.md$/g, '')),
  };

  const size = Object.values(files).reduce((total, body) => total + body.length, 0);
  console.log(
    `Built ${module.slug}: ${files['SKILL.md'].split('\n').length} line router, ${
      Object.keys(files).length - 1
    } reference(s), ${Math.round(size / 1024)}KB.`,
  );
}

// FHIR is the one skill with no module behind it: two hand written procedures
// that were two skills for the same reason the loops were, and are one skill
// with two references for the same reason they are not any more.
const FHIR_REFS = [
  ['generate', 'fhir-generate', 'Build NRCES compliant bundle generation into a codebase.'],
  ['audit', 'fhir-audit', "Check an existing FHIR store's output against the same profiles."],
];
const fhirFiles = {};
const fhirCovers = [];
for (const [section, source, what] of FHIR_REFS) {
  fhirFiles[`references/${section}.md`] = guided(source);
  fhirCovers.push(
    `- **${section[0].toUpperCase()}${section.slice(1)}.** ${what} [references/${section}.md](references/${section}.md)`,
  );
}

// The shared fhir atoms that are design rules rather than reference material.
// Named explicitly because the rest of catalogue/shared/fhir is the seven
// record type maps, the envelope and the validator recipe, which the
// generate and audit procedures already send a reader to. These three are
// what a generator gets wrong before it ever reaches a profile table.
// The envelope atom is not a design atom: its body is reference material the
// generate and audit procedures already reach. Its one rule belongs in the
// always-loaded router, so the router reads it by id alongside the design
// atoms rather than pulling its body into the design section.
const FHIR_ROUTER_EXTRA = ['shared.fhir.document-bundles'];

const FHIR_DESIGN_ATOMS = [
  'shared.fhir.profile-and-example-together',
  'shared.fhir.conditional-cardinality',
  'shared.fhir.bundle-weight-and-narrative',
];

/** The design section for abdm-fhir, assembled from the named atoms above. */
function fhirDesignEntries() {
  const {atoms} = loadAtoms();
  return FHIR_DESIGN_ATOMS.map((id) => {
    const atom = atoms.get(id);
    // A renamed or deleted atom must fail the build rather than quietly
    // shrink the section.
    if (!atom) throw new Error(`FHIR_DESIGN_ATOMS names ${id}, which no atom defines`);
    return atom;
  }).sort(byReadingOrder);
}

/** The extra atoms whose router line the FHIR skill carries. */
function fhirRouterExtraEntries() {
  const {atoms} = loadAtoms();
  return FHIR_ROUTER_EXTRA.map((id) => {
    const atom = atoms.get(id);
    if (!atom) throw new Error(`FHIR_ROUTER_EXTRA names ${id}, which no atom defines`);
    return atom;
  });
}

/** The design section for abdm-fhir, assembled from the entries above. */
function fhirDesignSection() {
  const picked = fhirDesignEntries();
  const bodies = picked.map((entry) => {
    const withoutTitle = entry.body.replace(/^#\s+.+$/m, '').trim();
    const dropped = withoutTitle.replace(/^## Before you start\n[\s\S]*?(?=^## )/m, '');
    const flattened = dropped.replace(/\[([^\]]+)\]\([^)]*\.md\)/g, '$1');
    return [`## ${entry.fm.title}`, '', flattened.replace(/^## /gm, '### ').trim(), ''].join('\n');
  });
  return [
    '# Design an ABDM FHIR generator',
    '',
    'What a bundle generator gets wrong before it reaches a profile table: reading one NRCeS source without the other, emitting a required child of an optional parent, and treating a bundle as a small object with a file attached.',
    '',
    ...bodies,
    '## Where these came from',
    '',
    ...picked.map((entry) => '- `' + entry.fm.id + '`'),
    '',
  ].join('\n');
}

const fhirSkillMd = (url) =>
  [
    '---',
    'name: abdm-fhir',
    'description: Use when producing or checking FHIR for ABDM: building NRCES compliant document bundle generation into a codebase, or auditing the bundles an existing FHIR store already emits. Covers the resource profiles ABDM requires, the Composition rules, and the validator to check against.',
    '---',
    '',
    '# ABDM FHIR',
    '',
    `Generated from the ABDM Developer Portal on ${buildDate}, catalogue version ${catalogueVersion}.`,
    '',
    `This file is a snapshot. Re-download the whole folder from ${skillUrl('abdm-fhir', url)} when it is older than the work you are doing: this router and every file under references/ that it links to. Fetching this file alone leaves those links pointing at files you do not have.`,
    '',
    '## What this skill covers',
    '',
    ...fhirCovers,
    '',
    'Open one when the work calls for it. This file is the map, not the material.',
    '',
    '## Before anything else',
    '',
    `- ${UNVERIFIED}`,
    `- ${DESIGN_OBSERVED}`,
    ...routerLines([...fhirDesignEntries(), ...fhirRouterExtraEntries()]).map((line) => `- ${line}`),
    '',
    '## Practices that hold across every call',
    '',
    ...PRACTICES.map((practice) => `- ${practice}`),
  ].join('\n');
fhirFiles['references/design.md'] = fhirDesignSection();
fhirCovers.unshift(
  '- **Design.** What a generator gets wrong before it reaches a profile table. [references/design.md](references/design.md)',
);
fhirFiles['SKILL.md'] = fhirSkillMd(siteUrl);
const fhirPluginFiles = {...fhirFiles, 'SKILL.md': fhirSkillMd(null)};
emit('abdm-fhir', fhirFiles, fhirPluginFiles);
manifest['abdm-fhir'] = {
  module: 'FHIR',
  title: 'FHIR, generating and auditing bundles',
  docs: '/docs/hiecm/v3/concepts/fhir',
  example: 'Add ABDM compliant FHIR bundle generation to this codebase',
  errorExample: null,
  operations: 0,
  codes: 0,
  sections: FHIR_REFS.map(([section]) => section),
};
console.log(`Built abdm-fhir: ${Object.keys(fhirFiles).length - 1} reference(s), including the design rules.`);

console.log(`Compiled ${MODULES.length + 1} skill(s) into site/static/skills and the plugin.`);

// Everything above is ABDM's, and the hosted ABDM prompt and index.json list
// only these. The NHCX skills below are served beside them but set up through
// their own prompt, so an ABDM integrator is never offered claims skills.
const abdmSlugs = Object.keys(manifest);

// The NHCX skills are committed folders under plugins/nhcx/skills, copied from
// github.com/nha-in/nhcx-skills rather than compiled here. They ship at the
// same /skills/<name>/ URLs, and each also ships as /skills/<name>.tar.gz,
// because its SKILL.md points into stages, templates and scripts beside it and
// a SKILL.md served alone would send an agent to files it cannot reach.
const NHCX = {
  'nhcx-full': {
    title: 'NHCX, end to end',
    example: 'Build the whole provider-side NHCX integration into this hospital system',
  },
  'nhcx-coverage': {
    title: 'NHCX coverage',
    example: 'Add NHCX policy search and coverage eligibility to this hospital system',
  },
  'nhcx-preauth': {
    title: 'NHCX pre-authorisation',
    example: "Add NHCX pre-authorisation, with the payer's plan and its authorisation requirements, to this system",
  },
  'nhcx-claim': {
    title: 'NHCX claim',
    example: 'File the NHCX claim at discharge from this system',
  },
  'nhcx-communication': {
    title: 'NHCX communication',
    example: "Handle the payer's NHCX queries and notifications in this system",
  },
  'nhcx-payment': {
    title: 'NHCX payment',
    example: 'Record and acknowledge NHCX payment notices',
  },
  'nhcx-reprocess': {
    title: 'NHCX reprocess',
    example: 'Ask the payer to reprocess a rejected NHCX claim',
  },
};

const countFiles = (dir) =>
  readdirSync(dir, {withFileTypes: true}).reduce(
    (n, entry) => n + (entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1),
    0,
  );

// An NHCX skill is counted from its own files, so its install panel shows what
// it holds the way a module skill's does. A skill holds one spec file per call
// it builds, under apis/, and one per callback it hosts, under callbacks/;
// its end-to-end tests are the rows of the table in steps/L8-e2e-tests.md.
// The skills carry no error table of their own: codes come from the knowledge
// source (the nhcx-docs MCP server's decode_error, or the NHCX package), so
// the panel promises no Debug row for them.
const specFiles = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => /^[A-Z]\d+-.+\.md$/.test(f)).length : 0;
function useCaseCounts(dir) {
  const e2e = join(dir, 'steps', 'L8-e2e-tests.md');
  const tests = existsSync(e2e)
    ? (readFileSync(e2e, 'utf8').match(/^\| X\d+ \|/gm) ?? []).length
    : 0;
  return {
    operations: specFiles(join(dir, 'apis')) + specFiles(join(dir, 'callbacks')),
    codes: 0,
    tests,
  };
}

/** The install panel's rows for an NHCX skill, and the file behind each. */
const NHCX_SECTION_FILES = {
  scaffold: 'references/SCAFFOLDING.md',
  integrate: 'apis/INDEX.md',
  test: 'steps/L8-e2e-tests.md',
};

const nhcxDir = join(root, 'plugins', 'nhcx', 'skills');
const nhcxSlugs = [];
for (const name of Object.keys(NHCX)) {
  const src = join(nhcxDir, name);
  if (!existsSync(join(src, 'SKILL.md'))) {
    throw new Error(`plugins/nhcx/skills/${name}/SKILL.md is missing`);
  }
  cpSync(src, join(outDir, name), {recursive: true});
  // COPYFILE_DISABLE keeps macOS tar from adding its ._ metadata files.
  execFileSync('tar', ['-czf', join(outDir, `${name}.tar.gz`), '-C', nhcxDir, name], {
    env: {...process.env, COPYFILE_DISABLE: '1'},
  });
  manifest[name] = {
    gateway: 'nhcx',
    module: 'NHCX',
    title: NHCX[name].title,
    docs: '/docs/nhcx/v1/getting-started/build-with-ai',
    example: NHCX[name].example,
    errorExample: null,
    ...useCaseCounts(src),
    // A row on the install panel, and the file in the folder that backs it.
    // These used to be bare labels, which read as references/integrate.md and
    // the like: names an ABDM skill has and an NHCX skill never did.
    sections: Object.keys(NHCX_SECTION_FILES).filter((section) =>
      existsSync(join(src, NHCX_SECTION_FILES[section])),
    ),
    sectionFiles: NHCX_SECTION_FILES,
    folder: true,
    files: countFiles(src),
  };
  nhcxSlugs.push(name);
  console.log(`Copied ${name} from plugins/nhcx/skills.`);
}

// The NHCX counterpart of index.json. ABDM's index leaves these out on purpose,
// so an ABDM integrator is never offered claims skills, which left an agent
// setting up NHCX with no list of what a skill is made of. Every file is read
// from the folder rather than derived from section names.
function filesUnder(dir, base = dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) =>
    entry.isDirectory()
      ? filesUnder(join(dir, entry.name), base)
      : [join(dir, entry.name).slice(base.length + 1)],
  ).sort();
}
writeFileSync(
  join(outDir, 'nhcx-index.json'),
  `${JSON.stringify(
    {
      catalogue_version: catalogueVersion,
      built: buildDate,
      skills: nhcxSlugs.map((slug) => ({
        name: slug,
        title: manifest[slug].title,
        archive: `${slug}.tar.gz`,
        files: filesUnder(join(nhcxDir, slug)),
      })),
    },
    null,
    2,
  )}\n`,
);

// Written here rather than after the ABDM skills, because the NHCX entries are
// added above and the page reads one manifest for both gateways. Writing it
// earlier shipped a skills.json with no NHCX slug in it, which made
// SkillInstall render nothing at all on the NHCX page.
writeFileSync(
  join(root, 'site', 'src', 'data', 'skills.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);


// ---------------------------------------------------------------------------
// The hosted setup prompt, the pattern Cloudflare's docs use: what a reader
// copies is one line pointing here, and the instructions themselves live at
// this URL, regenerated every build. The pasted prompt therefore cannot go
// stale, which no inline prompt can promise. AgentSetup.tsx copies the one
// line; this file is what the agent fetches.
const promptSkills = abdmSlugs.map((slug) => [
  slug,
  `${manifest[slug].title}. Sections: ${manifest[slug].sections.join(', ')}.`,
]);
const mcpUrl = process.env.MCP_URL ?? 'https://docs.abdm.gov.in/mcp';
// The Claude Code plugin marketplace: this repository itself, named by the
// environment rather than written down here. Actions sets GITHUB_REPOSITORY on
// whichever fork is building, so a fork's prompt carries its own install
// commands. Keep the same chain in site/docusaurus.config.ts, which is where
// the site's own components read it from.
const pluginRepo =
  process.env.MARKETPLACE_REPO ?? process.env.GITHUB_REPOSITORY ?? 'nha-in/docs';
// What `claude plugin install <plugin>@<marketplace>` has to name, taken from
// the marketplace manifest rather than repeated here, so renaming the shelf
// cannot leave a published command pointing at one that does not exist.
const marketplaceName = JSON.parse(
  readFileSync(join(root, '.claude-plugin', 'marketplace.json'), 'utf8'),
).name;
// Without DOCUSAURUS_URL every reference is origin-relative, and one note
// tells the agent what the origin is: wherever it fetched this file from.
const promptRef = (path) => (siteUrl ? `${siteUrl}${path}` : path);
const promptLines = [
  `These are official instructions from the ABDM Developer Portal (catalogue version ${catalogueVersion}, built ${buildDate}) to set up an AI development environment for integrating with ABDM, India's health data network.`,
  '',
  'Complete the steps yourself by running the commands directly. Ask the user only the questions in step 1.',
  '',
  '## 1. Establish scope',
  '',
  'Ask the user which of these this project needs, and install only what they name:',
  '',
  ...promptSkills.map(([slug, what]) => `- \`${slug}\`: ${what}`),
  '',
  'Most projects need one milestone skill to begin with, and `abdm-fhir` alongside it if they produce or hold FHIR documents.',
  '',
  '## 2. Install the skills',
  '',
  'The plugin carries every skill at once and updates in place, so prefer it wherever it installs. It is packaged both to Claude Code\'s layout and to the Agent Plugins 1.0 standard.',
  '',
  '### Claude Code',
  '',
  '```',
  `claude plugin marketplace add ${pluginRepo}`,
  `claude plugin install abdm-integrators-assistant@${marketplaceName}`,
  '```',
  '',
  '### Codex',
  '',
  'Add the marketplace, then install `abdm-integrators-assistant` from the plugin directory:',
  '',
  '```',
  `codex plugin marketplace add ${pluginRepo}`,
  '```',
  '',
  '### Every other agent',
  '',
  'Cursor, GitHub Copilot, VS Code and Kiro read Agent Plugins 1.0, but they install from their own marketplaces rather than from a repository, and this plugin is not listed in one yet. Install the skills directly instead, which is also the fallback anywhere the marketplace add above fails.',
  '',
  'Each skill is a folder in the cross-agent Agent Skills format: a `SKILL.md` that routes, and the sections it links to under `references/`, which load only when the work needs them. Download the whole folder into the directory your agent reads skills from:',
  '',
  '- Claude Code: `.claude/skills/<name>/`',
  '- Cursor: `.cursor/skills/<name>/` (it also reads `.claude/skills`)',
  '- GitHub Copilot: `.github/skills/<name>/`',
  '- Any other agent: wherever it reads context from',
  '',
  ...(siteUrl
    ? []
    : ['URLs below are relative to the origin you fetched this file from.', '']),
  `\`${promptRef('/skills/index.json')}\` lists every skill and the exact files it is made of, so fetch that first and work from it rather than guessing at reference names. For example:`,
  '',
  '```',
  `mkdir -p .claude/skills/abdm-m1/references`,
  `curl -fsSL ${promptRef('/skills/abdm-m1/SKILL.md')} -o .claude/skills/abdm-m1/SKILL.md`,
  `for f in scaffold integrate debug; do curl -fsSL ${promptRef('/skills/abdm-m1/references')}/$f.md -o .claude/skills/abdm-m1/references/$f.md; done`,
  '```',
  '',
  ...promptSkills.map(([slug]) => `- ${promptRef(`/skills/${slug}/`)}`),
  '',
  '## 3. Connect the Docs MCP server',
  '',
  ...(mcpUrl
    ? [
        'The portal serves its catalogue live over MCP (streamable HTTP). Register it with your agent:',
        '',
        '```',
        `claude mcp add --transport http abdm-docs ${mcpUrl}`,
        '```',
        '',
        `For other agents, add an HTTP MCP server named \`abdm-docs\` at \`${mcpUrl}\` using their config format.`,
      ]
    : [
        `The portal's Docs MCP server is not publicly reachable yet. Skip this step; ${promptRef('/docs/hiecm/v3/getting-started/mcp')} has the current status and the connect instructions for when it opens.`,
      ]),
  '',
  '## 4. Report back',
  '',
  'Tell the user what you installed and where you suggest starting. Two cautions to keep for the whole engagement:',
  '',
  '- Nothing in these skills has been run against the ABDM sandbox. Verify response shapes against real calls before relying on them.',
  `- The skills are snapshots. The current documentation lives at ${promptRef('/')}; prefer it, and the MCP server when connected, over any downloaded copy that has aged.`,
  '',
];
// What a manual download has to fetch. A skill is a folder now, and an agent
// following the prompt below should not have to parse Markdown links to learn
// which files exist.
writeFileSync(
  join(outDir, 'index.json'),
  `${JSON.stringify(
    {
      catalogue_version: catalogueVersion,
      built: buildDate,
      skills: abdmSlugs.map((slug) => ({
        name: slug,
        title: manifest[slug].title,
        files: ['SKILL.md', ...manifest[slug].sections.map((s) => `references/${s}.md`)],
      })),
    },
    null,
    2,
  )}\n`,
);

const promptDir = join(root, 'site', 'static', 'agent-setup');
mkdirSync(promptDir, {recursive: true});
writeFileSync(join(promptDir, 'prompt.md'), `${promptLines.join('\n')}\n`);
console.log('Wrote agent-setup/prompt.md.');

// The NHCX setup prompt, fetched by the NHCX Build with AI page's one line
// setup the same way prompt.md is fetched by HIE-CM's. It ships from the same
// repository and the same marketplace as the ABDM plugin, so it takes both
// from the constants above rather than repeating them.
const nhcxRepo = pluginRepo;
const nhcxMcp = {name: 'nhcx-docs', url: mcpUrl ?? 'https://docs.abdm.gov.in/mcp'};
const nhcxPromptLines = [
  `These are official instructions from the ABDM Developer Portal (catalogue version ${catalogueVersion}) to set up an AI development environment for integrating with NHCX, the National Health Claims Exchange.`,
  '',
  'Complete the steps yourself by running the commands directly. Ask the user only the questions in step 1.',
  '',
  '## 1. Establish scope',
  '',
  'There is one skill for the whole provider-side integration, `nhcx-full`, and one per NHCX use case. Ask the user which this project builds, and install only those:',
  '',
  ...nhcxSlugs.map((slug) => `- \`${slug}\`: ${manifest[slug].title}. ${manifest[slug].example}.`),
  '',
  'Each skill finds what the project already has and builds only what is missing, and each installs and runs alone. `nhcx-full` builds the whole integration; a system that needs one use case at a time usually starts with `nhcx-coverage`.',
  '',
  '## 2. Install the skills',
  '',
  'The plugin carries all seven and updates in place, so prefer it wherever it installs.',
  '',
  '### Claude Code',
  '',
  '```',
  `claude plugin marketplace add ${nhcxRepo} && claude plugin install nhcx@${marketplaceName}`,
  '```',
  '',
  '### Codex',
  '',
  '```',
  `codex plugin marketplace add ${nhcxRepo}`,
  '```',
  '',
  'Then open /plugins in Codex and install `nhcx`.',
  '',
  '### Every other agent',
  '',
  'Cursor, GitHub Copilot and the others install plugins only from their own marketplaces, where NHCX is not listed yet. Install the skills one at a time instead, which is also the fallback anywhere the marketplace add above fails. The skills installer finds every coding agent in the project and sets the skill up for each:',
  '',
  '```',
  `npx skills add ${nhcxRepo}/plugins/nhcx/skills/nhcx-coverage`,
  '```',
  '',
  'With git alone, fetch just the skill\'s folder and copy it to where the agent reads skills from: `.claude/skills` for Claude Code, `.agents/skills` for Codex, `.cursor/skills` for Cursor, `.github/skills` for GitHub Copilot, `.gemini/skills` for Gemini CLI. For example:',
  '',
  '```',
  `git clone --depth 1 --filter=blob:none --sparse https://github.com/${nhcxRepo} .nhcx && git -C .nhcx sparse-checkout set plugins/nhcx/skills/nhcx-coverage && mkdir -p .claude/skills && cp -R .nhcx/plugins/nhcx/skills/nhcx-coverage .claude/skills/ && rm -rf .nhcx`,
  '```',
  '',
  ...nhcxSlugs.map((slug) => `- \`${nhcxRepo}/plugins/nhcx/skills/${slug}\``),
  '',
  `\`${promptRef('/skills/nhcx-index.json')}\` lists every NHCX skill, its archive and the exact files it is made of. A skill is ${Math.min(...nhcxSlugs.map((slug) => manifest[slug].files))} to ${Math.max(...nhcxSlugs.map((slug) => manifest[slug].files))} files across its folders, so take the archive rather than fetching files one at a time.`,
  '',
  '## 3. Connect the Docs MCP server',
  '',
  'A live MCP server over the documentation. Register it with your agent:',
  '',
  '```',
  `claude mcp add --transport http ${nhcxMcp.name} ${nhcxMcp.url} -s user`,
  `codex mcp add ${nhcxMcp.name} --url ${nhcxMcp.url}`,
  `gemini mcp add --transport http ${nhcxMcp.name} ${nhcxMcp.url}`,
  '```',
  '',
  `For Cursor, add \`{ "mcpServers": { "${nhcxMcp.name}": { "url": "${nhcxMcp.url}" } } }\` to \`.cursor/mcp.json\`. For other agents, add an HTTP MCP server named \`${nhcxMcp.name}\` at \`${nhcxMcp.url}\` using their config format.`,
  '',
  '## 4. Report back',
  '',
  'Tell the user what you installed and where you suggest starting. Two cautions to keep for the whole engagement:',
  '',
  '- The skills hold the bundles they send to the pinned samples in the NHCX package. Check response shapes against real sandbox calls before relying on them.',
  `- The skills are snapshots. The current documentation lives at ${promptRef('/docs/nhcx/v1')}; prefer it, and the MCP server when connected, over any downloaded copy that has aged.`,
  '',
];
writeFileSync(join(promptDir, 'nhcx.md'), `${nhcxPromptLines.join('\n')}\n`);
console.log('Wrote agent-setup/nhcx.md.');
