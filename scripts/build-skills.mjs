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

// Provenance for the snapshot header. A downloaded skill is frozen while the
// catalogue moves, so every file names the version and date it was built
// from, and its own canonical URL, which is what lets an agent notice the
// copy is stale and heal it. The version is the same catalogue/VERSION the
// MCP indexer stamps into its snapshot, so the two surfaces are comparable.
const catalogueVersion = readFileSync(join(root, 'catalogue', 'VERSION'), 'utf8').trim();
const buildDate = new Date().toISOString().slice(0, 10);
// The site build exports DOCUSAURUS_URL; without it (a local dev run) the
// header falls back to naming the path, which is still enough to act on.
const siteUrl = process.env.DOCUSAURUS_URL
  ? `${process.env.DOCUSAURUS_URL}${process.env.DOCUSAURUS_BASE_URL ?? '/'}`.replace(/\/+$/, '')
  : null;
const skillUrl = (slug) =>
  siteUrl ? `${siteUrl}/skills/${slug}/SKILL.md` : `the portal's /skills/${slug}/SKILL.md path`;

// Every rule below is lifted from that module's own pages. A rule that is true
// of M1 and not of M2 belongs to M1 only: an agent told the wrong rule is
// worse off than an agent told nothing.
const UNVERIFIED =
  'Nothing here has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.';

// Practices, as distinct from rules. A rule is a fact about one module. A
// practice is how to work so that a wrong assumption surfaces in a minute
// rather than after a day, and it holds across every module, so it ships in
// every skill.
//
// Each line here was paid for. The padding one cost an integrator a day in
// September 2026: they tested encryption against an endpoint that refuses
// every input identically, read the uniform negative as proof, and eliminated
// the correct answer. That is the second line below.
const PRACTICES = [
  'Read the body, not only the status. A refusal often names the field in its body while the status says nothing useful, and a bad clock can arrive as a 404.',
  'When ABDM publishes a parameter, read it rather than hard coding what it currently says. The certificate endpoints return the encryption algorithm beside the key; code that reads that field survives a rotation and code that assumes a constant fails silently on the day it changes. Refuse to act on a published value you do not recognise rather than falling back to a default.',
  'Read every field in a response, not the one you came for. The M1 certificate call returns the padding next to the key, and a catalogue that recorded only the key cost an integrator a day rediscovering it.',
  'Prove an assumption against a call that is able to disagree with you. An endpoint that refuses every input with one message cannot tell you which input was right, and testing against it turns a correct answer into a ruled out one.',
  'Suspect the transport before the data. When a call refuses a value you believe in, check the encryption, the headers and the clock before you doubt the number. Those failures are reported as if the value were wrong.',
  'Do not carry an encryption path from one module to another. The padding, the certificate and the key size belong to the registry you are calling, and a path that works in one module produces a value another cannot read.',
  'Never log a sensitive value before you encrypt it, and never send one to a remote service to be encrypted. Both move the leak rather than removing it.',
  'Generate a fresh REQUEST-ID for every call and log it before sending. Once a call has failed it is the only handle on it.',
  'Do not match an error code with string equality. ABDM returns codes carrying trailing punctuation and whitespace, observed as `"code": "ABDM-9999: "`. Trim and compare on the prefix, or the branch you wrote for that code never runs.',
  'A failure does not always carry a body. An HTTP 401 with zero bytes was observed on a PHR profile call with no user token. Handle the empty body before you parse, or your client throws on the simplest failure there is.',
  'On a `HIS-` response from the registries, read `details[0].code` before the top level `code`. The outer code and the HTTP status describe the wrong thing: a 422 saying the data was wrong carried `HIS-403`, not permitted, one level down. Acting on the outer code sends you hunting through a payload that is fine.',
  'Repeated bad credentials lock the client. Eight consecutive failed session calls locked a sandbox client for about eight minutes, and every attempt in that window returned `Invalid user credentials`, which reads as a wrong secret rather than a temporary lock. Back off on an auth failure rather than retrying, and never loop a credential check.',
  'Send TIMESTAMP in UTC with milliseconds and a trailing Z. Local time is refused, sometimes as a 404.',
  'Cache a public certificate with a validity window rather than forever. A rotation fails every encrypted call at once, and a cache with no expiry cannot recover on its own.',
];

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
      'Use when building, debugging or testing ABDM Milestone 1: creating an ABHA number or address, ABHA login, profile management, or the gateway session token. Carries the endpoints, the required headers, the two token rule, the encryption rule, every recorded error code and the M1 test matrix. Also carries the scaffolding loop that builds it flow by flow and the loop from a failed call to a named fix, in references/.',
    rules: [
      UNVERIFIED,
      'Get an access token first, from the gateway session endpoint. Every other call needs it in `Authorization: Bearer <token>`.',
      'Two tokens exist and they are not interchangeable. The gateway access token goes in `Authorization`. The user token from an enrolment or a login goes in `X-token`. Profile endpoints need both.',
      "Sensitive fields travel encrypted. Aadhaar numbers, mobile numbers, email addresses, OTP values and passwords are encrypted before they go in the body, then base64 encoded.",
'The certificate response tells you the padding. `GET /v3/profile/public/certificate` returns `{"publicKey", "encryptionAlgorithm"}`, and `encryptionAlgorithm` is currently `RSA/ECB/OAEPWithSHA-1AndMGF1Padding`. Read that field and translate it for your language. Do not hard code a padding: a constant is right until it is not, and the failure then looks like a bad value rather than a stale constant.',
      'PKCS#1 v1.5 is refused, and so is OAEP with SHA-256. Neither refusal names encryption, so a wrong padding reads back as a wrong value.',
      'More than one certificate is published and they are not interchangeable. `/v3/profile/public/certificate` is 4096-bit and `/v3/phr/app/login/public/certificate` is 2048-bit, both naming the same algorithm. Ciphertext length tells them apart: 512 bytes against 256. The helper at `/v3/phr/app/enrollment/encrypt` uses the 2048 bit key.',
      'Every certificate arrives as bare base64 DER with no PEM armour, whatever the field name suggests. Add the armour, wrapping at 64 characters per line, before your library will load it.',
      'Prove the padding before building a flow, with a mobile that is registered against an ABHA account. `POST /v3/profile/login/request/otp` with `loginHint: "mobile"` returns 200 and a `txnId` when the padding is right, and `Invalid Mobile Number` when it is wrong. The number has to be a real one: an unregistered number returns that same refusal whatever the padding, so it proves nothing. `/v3/enrollment/request/otp` refuses every input identically and cannot tell you either way.',
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
      'Use when building, debugging or testing ABDM Milestone 2: care contexts, HIP initiated linking, discovery, and pushing encrypted health records to a requester. Carries the endpoints, the prerequisites, every recorded error code and the M2 test matrix. Also carries the scaffolding loop that builds it flow by flow and the loop from a failed call to a named fix, in references/.',
    rules: [
      UNVERIFIED,
      'You act as the HIP. NHA requires a valid Facility ID and registration in the HIP role before you can create health records and share them.',
      'M2 is keyed to an ABHA address, so a working M1 integration comes first.',
      'Hold a link token per patient, stored at registration. NHA gives its validity as six months and says to validate it before use. If you hold no valid one, regenerate it using demographic authentication.',
      'Records go out as FHIR R4 conforming to the ABDM profiles at https://nrces.in/ndhm/fhir/r4/index.html.',
      'You are the side that encrypts, and the parameters arrive from the requester rather than from you. The health information request carries `keyMaterial` with `cryptoAlg: ECDH`, `curve: Curve25519`, the requester\'s `dhPublicKey` and a 32 byte `nonce`. Generate your own Curve25519 pair and your own 32 byte nonce, and send your public key and nonce back with the data so the requester can derive the same secret.',
      'The key derivation and the symmetric cipher applied over that shared secret are not yet published. Confirm both at onboarding before you ship, rather than inferring them from a sample.',
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
      'Use when building, debugging or testing ABDM Milestone 3: raising a consent request, tracking its status, reading consent artefacts, and fetching encrypted health records as an HIU. Carries the endpoints, the consent rules, every recorded error code and the M3 test matrix. Also carries the scaffolding loop that builds it flow by flow and the loop from a failed call to a named fix, in references/.',
    rules: [
      UNVERIFIED,
      'You act as the HIU. The HIE-CM holds the consent and asks the patient on your behalf. No artefact, no records.',
      'The patient must be known to you by ABHA address before you can raise a request.',
      'One consent request can produce more than one artefact. Store the request id and every artefact id.',
      'Records arrive encrypted on your callback URL. Decrypt them, then acknowledge receipt to the gateway.',
      "NHA's schema declares `consentId` and `consentRequestId` as UUIDs while NHA's own examples give values that are not. Do not validate them as UUIDs. Recorded as correction C3 in catalogue/openapi/corrections.",
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
      'Use when building, debugging or testing ABDM Milestone 4, the NHPR: creating an HPID, registering a healthcare professional on the HPR, onboarding a facility to the HFR, and linking that facility to its HIP or HIU bridges. Carries the operations NHA has published, the registration order, every recorded error code and the identifier formats.',
    rules: [
      UNVERIFIED,
      'Neither registry moves a health record. M4 establishes who the professional is and what the facility is, so every record flow has a verified provider behind it.',
      'M2 and M3 need a facility in the HFR and a bridge linked to it before records flow in production. M4 is the API route to that. Registering the facility by hand on the NHPR portal is the other route, and a product that takes it never builds M4.',
      'The HPR comes first. Onboarding a facility needs an HPR token, which needs a person who already holds an HPID.',
      'Creating an HPID returns an `hprToken`. Keep it: the register professional call carries it in its payload.',
      'A facility ID is `IN` followed by 10 characters. An HPID is 14 digits.',
      'Facility onboarding is one search, three writes and a submit, all keyed to the `trackingId` the first write returns. Stop before submit and the facility stays in draft, invisible to ABDM.',
      'Register professional takes codes, not names. Fetch council, course, college, university, state, district and language from the master data APIs first.',
      'A facility ID alone does not make records flow. Link the facility to a bridge and mark each link HIP or HIU. The HIP name is what a patient sees in their PHR app: 15 characters or fewer, no special characters, and unique for every bridge on that facility.',
      'Send the mobile number encrypted. Fetch the public certificate from `/v4/int/api/v1/auth/cert` and encrypt with `RSA/ECB/PKCS1Padding`. That padding and that certificate belong to the NHPR registry alone. M1 uses RSA-OAEP with SHA-1 under a different certificate, so do not carry either across.',
      'Several published M4 samples show the production host while describing sandbox behaviour. Check the host before you copy a sample.',
    ],
  },
  {
    id: 'p1',
    slug: 'abdm-p1',
    title: 'P1, PHR identity and profile',
    docs: '/docs/hiecm/v3/api/p1',
    example: 'Register a new user in this PHR app and log them in',
    spec: 'hiecm-p1.yaml',
    description:
      "Use when building, debugging or testing ABDM P1, the patient side of Milestone 1: registration in a PHR application, the four login routes, profile management, the ABHA card, and the family members a user manages. Carries the endpoints, the required headers, every recorded error code and the account rules.",
    rules: [
      UNVERIFIED,
      'P1 is the patient side of M1. M1 is how a hospital system creates an ABHA; P1 is how the person\'s own application does it and maintains the account afterwards.',
      'Every user needs an ABHA address, `username@abdm`. Consent, notifications and record sharing all hang off it.',
      'Build both creation paths: by mobile number, and by an existing 14 digit ABHA number.',
      'All four login routes are mandatory.',
      'A user can hold several ABHA addresses but only one ABHA number.',
    ],
  },
  {
    id: 'p2',
    slug: 'abdm-p2',
    title: 'P2, PHR linking and records',
    docs: '/docs/hiecm/v3/api/p2',
    example: 'Discover records held elsewhere and link them to this ABHA address',
    spec: 'hiecm-p2.yaml',
    description:
      'Use when building, debugging or testing ABDM P2, the patient side of Milestone 2: discovering records held elsewhere, linking care contexts to an ABHA address, and pulling those records into a PHR application. Carries the endpoints, the timing rules the network enforces, every recorded error code and the discovery rules.',
    rules: [
      UNVERIFIED,
      'P2 is the mirror of M2. M2 is a provider publishing a record; P2 is the patient discovering it and linking it to their own ABHA address.',
      'Discovery is for facilities the user visited without giving an ABHA address, and for older records.',
      'A HIP is expected to answer a discovery request within 10 seconds.',
      'Never show a care context that is already linked.',
      'Send the data transfer request within 5 minutes of the user asking for their records.',
    ],
  },
  {
    id: 'p3',
    slug: 'abdm-p3',
    title: 'P3, PHR consent and notifications',
    docs: '/docs/hiecm/v3/api/p3',
    example: 'Grant a consent request in this PHR app and fetch what it covers',
    spec: 'hiecm-p3.yaml',
    description:
      "Use when building, debugging or testing ABDM P3, the patient side of Milestone 3: subscriptions, auto approval policies, granting and revoking consent, and fetching the records a grant covers. Carries the endpoints, the notification rules, every recorded error code and the consent rules.",
    rules: [
      UNVERIFIED,
      'P3 is the other side of M3. M3 is a requester asking for records; P3 is the patient deciding, and being told each time.',
      'A PHR application implements the HIU role as well, because fetching a user\'s own records is an HIU flow.',
      'Build for revocation from the start. A consent that worked yesterday can be withdrawn today, and that is the system working correctly.',
      "A subscription is how the application hears about changes to a user's ABHA address. Set one up at address creation and at first login on a new install.",
      'An auto approval policy stops the user approving a request every time a hospital adds a record, and the user must be able to disable a policy at any time.',
    ],
  },
  {
    id: 'phr-services',
    slug: 'abdm-phr-services',
    title: 'PHR application services',
    docs: '/docs/hiecm/v3/api/phr-services',
    journey: null,
    example: 'Add nearby facility search to this PHR app',
    spec: 'hiecm-phr-services.yaml',
    description:
      'Use when building services a PHR application offers on top of ABDM: teleconsultation, nearby facility search, ambulance booking, blood bank search, scan and pay, PMJAY facility discovery and NHCX coverage lookups. None of it is required to certify as a PHR application.',
    rules: [
      UNVERIFIED,
      'None of this is a certification milestone. Nothing here is required to certify as a PHR application, and building none of it is a valid choice.',
      'These operations sit apart from P1 to P3 so that nothing here implies a PHR application must build them.',
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
    `Generated from the ABDM Developer Portal on ${buildDate}, catalogue version ${catalogueVersion}. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.`,
  );
  lines.push('');
  lines.push(
    `This file is a snapshot. Re-download it from ${skillUrl(module.slug)} when it is older than the work you are doing.`,
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
  if (module.journey !== null) {
    lines.push(
      `- The flows as diagrams: ${module.journey ?? module.docs.replace(/\/api\/([^/]+)$/, '/milestones/$1')}`,
    );
  }
  lines.push(`- Every error code across modules: /docs/hiecm/v3/reference/error-codes`);
  lines.push(`- Sandbox test data: /docs/hiecm/v3/reference/data-dictionary`);
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
  const raw = readFileSync(join(guidedDir, name, 'SKILL.md'), 'utf8');
  return raw.replace(/^---\n[\s\S]*?\n---\n/, '').trim();
}

function guidedTitle(name) {
  const raw = readFileSync(join(guidedDir, name, 'SKILL.md'), 'utf8');
  return parse(raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '')?.description ?? '';
}

/**
 * Which guided loop is which section of which skill.
 *
 * P2 and P3 have no debugging loop of their own because NHA records the PHR
 * error codes once. One loop covers P1 to P3 and it sits with P1, which is
 * what the two of them point at rather than repeating it.
 */
const FOLD = {
  'abdm-m1': {scaffold: 'hiecm-m1-build', debug: 'hiecm-m1-debug'},
  'abdm-m2': {scaffold: 'hiecm-m2-build', debug: 'hiecm-m2-debug'},
  'abdm-m3': {scaffold: 'hiecm-m3-build', debug: 'hiecm-m3-debug'},
  'abdm-m4': {scaffold: 'hiecm-m4-build', debug: 'hiecm-m4-debug'},
  'abdm-p1': {scaffold: 'hiecm-p1-build', debug: 'hiecm-p1-debug'},
  'abdm-p2': {scaffold: 'hiecm-p2-build'},
  'abdm-p3': {scaffold: 'hiecm-p3-build'},
};

/** Where a module with no debugging loop of its own sends a reader. */
const DEBUG_ELSEWHERE = {
  'abdm-p2': 'abdm-p1',
  'abdm-p3': 'abdm-p1',
};

rmSync(outDir, {recursive: true, force: true});
mkdirSync(outDir, {recursive: true});

// The plugin ships the same nine folders the site serves. It used to ship the
// fourteen guided loops and nothing else, so the plugin and the site offered
// different sets under the same names.
const pluginDir = join(root, 'plugins', 'abdm-integrators-assistant', 'skills');
rmSync(pluginDir, {recursive: true, force: true});
mkdirSync(pluginDir, {recursive: true});

/** Writes one skill folder to both places that ship it. */
function emit(name, files) {
  for (const base of [outDir, pluginDir]) {
    const folder = join(base, name);
    mkdirSync(join(folder, 'references'), {recursive: true});
    for (const [path, body] of Object.entries(files)) {
      writeFileSync(join(folder, path), body.endsWith('\n') ? body : `${body}\n`);
    }
  }
}

// What each skill actually turned out to carry. The page renders its capability
// list from this, so a page can never claim a skill covers something the
// generator did not put in it.
const manifest = {};

let count = 0;
for (const module of MODULES) {
  const whole = build(module);
  const parts = sections(whole);
  const fold = FOLD[module.slug] ?? {};

  const operationCount = operations.filter(
    (op) => op.moduleId === module.id || op.moduleId === 'gateway',
  ).length;
  const codeCount = errorBlocks(module).reduce(
    (total, {block}) => total + (block.codes?.length ?? 0),
    0,
  );
  const testCount =
    testMatrix(module)?.groups.reduce((total, group) => total + group.rows.length, 0) ?? 0;

  const files = {};
  const covers = [];

  if (fold.scaffold) {
    files['references/scaffold.md'] = guided(fold.scaffold);
    covers.push(
      `- **Scaffold.** Build it flow by flow against the sandbox, as a loop that ends on an observed result rather than on a call returning 200. [references/scaffold.md](references/scaffold.md)`,
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
  if (fold.debug) debugParts.push(guided(fold.debug));
  const errors = parts.get('Errors');
  if (errors) {
    debugParts.push(fold.debug ? `## Every recorded code\n\n${errors.replace(/^## Errors\n+/, '')}` : errors);
  }
  if (debugParts.length) {
    files['references/debug.md'] = fold.debug
      ? debugParts.join('\n\n')
      : [
          `# Debug ${module.title}`,
          '',
          DEBUG_ELSEWHERE[module.slug]
            ? `The loop from a failed call to a named fix is recorded once for the whole patient side, in the ${DEBUG_ELSEWHERE[module.slug]} skill. The codes this module can return are below.`
            : 'The codes this module can return, with the message and what to do about each.',
          '',
          ...debugParts,
        ].join('\n');
    covers.push(
      codeCount
        ? `- **Debug.** ${
            fold.debug ? 'The loop from a failed call to a named fix, and ' : ''
          }${codeCount} recorded error codes. [references/debug.md](references/debug.md)`
        : `- **Debug.** The loop from a failed call to a named fix. No error code is recorded for this module yet. [references/debug.md](references/debug.md)`,
    );
  }

  const tests = parts.get('Test cases');
  if (tests) {
    files['references/test.md'] = [
      `# Test ${module.title}`,
      '',
      'Each case names the call it makes and what to see when it passes.',
      '',
      tests,
    ].join('\n');
    covers.push(
      `- **Test.** ${testCount} test cases, each with the call it makes and what to see when it passes. [references/test.md](references/test.md)`,
    );
  }

  files['SKILL.md'] = [
    head(whole),
    '',
    '## What this skill covers',
    '',
    ...covers,
    '',
    'Open one when the work calls for it. This file is the map, not the material.',
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

  emit(module.slug, files);

  manifest[module.slug] = {
    module: module.title.split(',')[0],
    title: module.title,
    docs: module.docs,
    example: module.example,
    // A real code from this module, so the page's example question is one the
    // skill can actually answer.
    errorExample: errorBlocks(module).flatMap(({block}) => block.codes ?? [])[0]?.code ?? null,
    operations: operationCount,
    codes: codeCount,
    tests: testCount,
    sections: Object.keys(files)
      .filter((path) => path.startsWith('references/'))
      .map((path) => path.replace(/^references\/|\.md$/g, '')),
  };

  count += 1;
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
fhirFiles['SKILL.md'] = [
  '---',
  'name: abdm-fhir',
  'description: Use when producing or checking FHIR for ABDM: building NRCES compliant document bundle generation into a codebase, or auditing the bundles an existing FHIR store already emits. Covers the resource profiles ABDM requires, the Composition rules, and the validator to check against.',
  '---',
  '',
  '# ABDM FHIR',
  '',
  `Generated from the ABDM Developer Portal on ${buildDate}, catalogue version ${catalogueVersion}.`,
  '',
  `This file is a snapshot. Re-download it from ${skillUrl('abdm-fhir')} when it is older than the work you are doing.`,
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
  '- A bundle that validates is not a bundle ABDM accepts. The NRCES profiles are the floor, and the milestone the bundle travels under adds its own rules.',
  '',
  '## Practices that hold across every call',
  '',
  ...PRACTICES.map((practice) => `- ${practice}`),
].join('\n');
emit('abdm-fhir', fhirFiles);
manifest['abdm-fhir'] = {
  module: 'FHIR',
  title: 'FHIR, generating and auditing bundles',
  docs: '/docs/hiecm/v3/concepts/fhir',
  example: 'Add ABDM compliant FHIR bundle generation to this codebase',
  errorExample: null,
  operations: 0,
  codes: 0,
  tests: 0,
  sections: FHIR_REFS.map(([section]) => section),
};
count += 1;
console.log('Built abdm-fhir: 2 reference(s) from the hand written procedures.');

writeFileSync(
  join(root, 'site', 'src', 'data', 'skills.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);

console.log(`Compiled ${count} skill(s) into site/static/skills and the plugin.`);

// ---------------------------------------------------------------------------
// The hosted setup prompt, the pattern Cloudflare's docs use: what a reader
// copies is one line pointing here, and the instructions themselves live at
// this URL, regenerated every build. The pasted prompt therefore cannot go
// stale, which no inline prompt can promise. AgentSetup.tsx copies the one
// line; this file is what the agent fetches.
const promptSkills = Object.entries(manifest).map(([slug, entry]) => [
  slug,
  `${entry.title}. Sections: ${entry.sections.join(', ')}.`,
]);
const mcpUrl = process.env.MCP_URL ?? null;
// The Claude Code plugin marketplace: this repository itself. Update at
// handover, together with PLUGIN_REPO in site/src/components/docs/AgentSetup.tsx.
const pluginRepo = process.env.MARKETPLACE_REPO ?? 'eka-care/abdm-docs';
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
  'claude plugin install abdm-integrators-assistant@abdm-portal',
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
  `for f in scaffold integrate debug test; do curl -fsSL ${promptRef('/skills/abdm-m1/references')}/$f.md -o .claude/skills/abdm-m1/references/$f.md; done`,
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
      skills: Object.entries(manifest).map(([slug, entry]) => ({
        name: slug,
        title: entry.title,
        files: ['SKILL.md', ...entry.sections.map((s) => `references/${s}.md`)],
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
