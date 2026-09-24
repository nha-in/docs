// scripts/ingest-nha.mjs
// NHA's final set (catalogue/openapi/.raw/nha-2026-09-16) to the eleven module
// specs. Deterministic. Only the edits listed in the design spec, each one
// appended to the correction log this script writes.
//   node scripts/ingest-nha.mjs          write the specs and the log
//   node scripts/ingest-nha.mjs --check  fail if the committed specs differ
import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parse, stringify, Document, visit} from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(root, 'catalogue', 'openapi', '.raw', 'nha-2026-09-16');
const OUT = join(root, 'catalogue', 'openapi', 'hiecm', 'v3');
const LOG = join(root, 'catalogue', 'openapi', 'corrections', '2026-09-16-final-set.md');
const check = process.argv.includes('--check');
const journeysMode = process.argv.includes('--journeys');
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

const MODULES = {
  gateway: {label: 'Gateway session', position: 1, icon: 'key-round', roles: ['his', 'phr'], title: 'ABDM gateway, sessions and bridges', summary: 'The access token every call carries, and the bridge registry.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 4},
  m1: {label: 'M1 Identity', position: 2, icon: 'id-card', roles: ['his'], title: 'ABDM M1, ABHA creation and verification', summary: 'Create, find, log into and manage an ABHA.', servers: [{url: 'https://abhasbx.abdm.gov.in', description: 'ABHA service, sandbox'}], expected: 121},
  m2: {label: 'M2 Health Information Provider', position: 3, icon: 'link', roles: ['his'], title: 'ABDM M2, health information provider services as a HIP', summary: 'Link care contexts to an ABHA address and share records when consent arrives.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 20},
  m3: {label: 'M3 Health Information User', position: 4, icon: 'file-check', roles: ['his'], title: 'ABDM M3, health information user services as an HIU', summary: 'Raise a consent request, fetch its artefacts, and receive records.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 12},
  m4: {label: 'M4 Registry Integration', position: 5, icon: 'building-2', roles: ['his'], title: 'ABDM M4, professional and facility registries', summary: 'Register healthcare professionals and facilities on the NHPR.', servers: [{url: 'https://apihspsbx.abdm.gov.in/v4/int', description: 'NHPR, sandbox'}], expected: 100},
  p1: {label: 'P1 Registration and login', position: 6, icon: 'user-round', roles: ['phr'], title: 'ABDM P1, PHR registration and login', summary: 'Create an ABHA address in a PHR app and log in to it.', servers: [{url: 'https://abhasbx.abdm.gov.in', description: 'ABHA service, sandbox'}], expected: 11},
  p2: {label: 'P2 Consents Management', position: 7, icon: 'files', roles: ['phr'], title: 'ABDM P2, Consents Management', summary: 'Manage the PHR profile, link an ABHA number, switch profiles, and handle linking, sharing and consent for the patient.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://abhasbx.abdm.gov.in', description: 'PHR application service, sandbox'}], expected: 35},
  p3: {label: 'P3 Subscription', position: 8, icon: 'bell', roles: ['phr'], title: 'ABDM P3, PHR subscriptions', summary: 'Read, approve, deny, enable, disable and update the patient\'s subscriptions and subscription requests, and the subscription request and notifications they answer.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}], expected: 14},
  p4: {label: 'P4 Locker', position: 9, icon: 'lock', roles: ['phr'], title: 'ABDM P4, health lockers', summary: 'Set up a health locker and list the lockers and requests on an ABHA address.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}], expected: 5},
  'scan-and-register': {label: 'Scan and Register', position: 11, icon: 'contact-round', section: 'use-cases', roles: ['his'], title: 'ABDM Scan and Register', summary: 'Receive the profile a patient shares by scanning the counter QR code, and hand back a queue token.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 2},
  'scan-and-pay': {label: 'Scan and Pay', position: 13, icon: 'qr-code', section: 'use-cases', roles: ['his'], title: 'ABDM Scan and Pay', summary: 'Open orders, patient selection and payment status between a facility and a PHR app.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 18},
};

// The patient side follows NHA's PHR collection folders, P1 to P4, by tag.
// The locker calls carry subscription tags, so they are placed by path.
const PHR_TAGS = {
  'ABHA enrolment via Aadhaar': 'p1', 'P1 - Create ABHA Address Flow': 'p1', 'P1 - Login via ABHA Address - Password': 'p1', 'P1 - PHR Login': 'p1', 'P1-Registration-login': 'p1',
  'P2 - Link ABHA Number': 'p2', 'P2 - Switch Profile': 'p2', 'P2 -PHR Profile': 'p2', 'abdm-hiecm-patient-share-phr': 'p2', 'abdm-hip-initiated-linking-phr': 'p2', 'abdm-user-initiated-linking-phr': 'p2', 'consent-management-data-flow-phr': 'p2',
  'subscription-phr': 'p3', 'abdm-hiecm-scan-pay-phr': 'scan-and-pay',
};
const LOCKER = /\/subscription-requests\/v3\/(patients\/lockers(\/\{[^}]+\})?|patients\/requests|setup-locker)$/;
// undefined: no mapping; only allowed for a call an earlier file already declared.
// NHA's sandbox observations of 23 September 2026: the gateway lists the
// bridge calls and the session call only. Providers and government
// programmes are what a PHR app searches before discovery, so they sit in P2
// beside it, and the health locker list in P4. Updating a bridge service, the
// OpenID configuration and the key set are left out (null).
const gatewayPlace = (path) => (/\/(providers|govt-programs)/.test(path) ? 'p2' : /\/health-lockers$/.test(path) ? 'p4' : /\/(bridge-service|\.well-known\/openid-configuration|certs)$/.test(path) ? null : 'gateway');
const phrPlace = (tag, path) => (tag === 'Gateway' ? gatewayPlace(path) : LOCKER.test(path) ? 'p4' : PHR_TAGS[tag]);

// Which module an operation lands in. Returns null to drop it.
const FILES = [
  {file: 'hiecm/gateway.yaml', place: (tag, path) => gatewayPlace(path)},
  // NHA reissued the M1 swagger on 22 September 2026 with one operation per
  // use case: the path key carries a #use-case suffix, the real URL sits in
  // x-actual-path, and the tags follow the M1 Postman collection.
  {file: 'abha/ABHA Swagger split.yaml', set: 'nha-2026-09-22', fetched: '2026-09-22', titlesFromSummary: true, place: (tag, path) => (path.includes('/gateway/') ? null : 'm1')},
  {file: 'hiecm/hip-initiated-linking.yaml', place: byRole('m2')},
  {file: 'hiecm/user-initiated-linking.yaml', place: byRole('m2')},
  {file: 'hiecm/link-token.yaml', place: byRole('m2')},
  {file: 'hiecm/patient-share.yaml', place: byRole('scan-and-register')},
  {file: 'hiecm/consent-management-data-flow.yaml', place: (tag, path) => (tag.endsWith('-phr') ? phrPlace(tag, path) : tag.endsWith('-hiu') ? 'm3' : 'm2')},
  // The subscription request and its notifications are the other half of
  // P3's approve and deny, so they sit in P3 rather than a module of their own.
  {file: 'hiecm/subscription.yaml', place: (tag, path) => (tag === 'subscription-phr' || LOCKER.test(path) ? phrPlace(tag, path) : 'p3')},
  {file: 'hiecm/scan-and-pay.yaml', place: (tag, path) => (tag.endsWith('-phr') ? phrPlace(tag, path) : 'scan-and-pay')},
  {file: 'M4/M4-HFR.json', place: () => 'm4'},
  {file: 'M4/M4-HPID.json', place: () => 'm4'},
  {file: 'M4/M4-HPR.json', place: () => 'm4'},
  {file: 'phr/PHR and Locker Swagger.yaml', place: phrPlace},
];
function byRole(hipModule) { return (tag, path) => (tag.endsWith('-phr') ? phrPlace(tag, path) : hipModule); }

const CALLBACK = /^\/api\/v3\/(hip|hiu|link|links|patients)\/|^\/v3\/patient\/|^\/health-information\/transfer$/;
const M1_HEADERS = {'x-token': 'X-token', 'benefit-name': 'BENEFIT_NAME', 'benefit_name': 'BENEFIT_NAME', 'benefit name': 'BENEFIT_NAME', 'transaction_id': 'TRANSACTION_ID'};

// M4's three files declare some schemas under the same name with different
// shapes. Suffix the later file's definition with its stem and rewrite that
// file's own $refs to it, before anything is cloned into a module spec.
function renameRefs(obj, oldRef, newRef) {
  if (Array.isArray(obj)) { for (const v of obj) renameRefs(v, oldRef, newRef); return; }
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj)) {
      if (k === '$ref' && v === oldRef) obj[k] = newRef;
      else renameRefs(v, oldRef, newRef);
    }
  }
}
function dedupeM4Components(doc, file) {
  const stem = file.split('/').pop().replace(/\.(json|ya?ml)$/i, '').replace(/^M4-/, '');
  for (const [kind, defs] of Object.entries(doc.components ?? {})) {
    if (kind === 'securitySchemes') continue;
    for (const name of Object.keys(defs)) {
      const have = specs.m4.components[kind]?.[name];
      if (have && JSON.stringify(have) !== JSON.stringify(defs[name])) {
        const newName = `${name}_${stem}`;
        renameRefs(doc, `#/components/${kind}/${name}`, `#/components/${kind}/${newName}`);
        defs[newName] = defs[name];
        delete defs[name];
        note('m4', name, `components.${kind}.${name} conflicted with an earlier M4 file; renamed to ${newName} and its refs in ${file} rewritten`);
      }
    }
  }
}

// Where the bearer token comes from, only where a raw file says so. The PHR
// swagger names the gateway session for its operations (gateway, p1, p2), and
// the M4 files carry their own token call. The other raw files name no source,
// so their modules get no description rather than a guessed one.
const GATEWAY_TOKEN = 'The access token from POST /api/hiecm/gateway/v3/sessions, sent with a `Bearer ` prefix.';
const TOKEN_SOURCE = {
  m4: 'M4 declares bearer authentication. The HPID calls publish POST /getManagementToken.',
};
// 10. Header descriptions NHA's files leave blank. One meaning per header,
// applied only where the file gave none, so NHA's own wording always wins.
const HEADER_DESC = {
  'REQUEST-ID': 'A fresh UUID v4 for this request. Callbacks echo it as `response.requestId`, which is how a reply is matched to the request it answers.',
  'TIMESTAMP': 'When the request was sent, in ISO 8601 UTC, for example `2026-09-22T10:15:00.000Z`.',
  'X-CM-ID': 'The consent manager suffix: `sbx` in sandbox, `abdm` in production.',
  'X-token': 'The user token from a login or enrolment response, sent with a `Bearer ` prefix. It acts for that ABHA holder.',
  'T-token': 'The transaction token from the preceding login step, sent with a `Bearer ` prefix. It is valid only for that login.',
  'R-token': 'The refresh token from a login response, sent with a `Bearer ` prefix, exchanged for a new user token.',
  'BENEFIT_NAME': 'The benefit programme the call is made under.',
  'TRANSACTION_ID': 'The `txnId` from the preceding enrolment step.',
  'Content-Type': '`application/json`.',
  'X-HIP-ID': 'Identifier of the health information provider to which the request was intended.',
  'X-HIU-ID': 'Identifier of the health information user to which the request was intended.',
  'x-hprid-auth': 'The HPR token of the signed-in professional, from the HPR login.',
  'x-hprid-auth-verifier': 'The HPR token of the professional verifying the facility submission.',
  'X-Token': 'The HPR token of the signed-in professional, from the HPR login.',
};
const sha = (p) => 'sha256:' + createHash('sha256').update(readFileSync(p)).digest('hex');
const slug = (s) => s.toLowerCase().replace(/\{([^}]+)\}/g, '$1').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const log = [];
const note = (module, op, what) => log.push(`| ${module} | \`${op}\` | ${what} |`);

const specs = Object.fromEntries(Object.entries(MODULES).map(([id, m]) => [id, {
  openapi: '3.1.1',
  info: {
    'x-portal': {module: id, label: m.label, position: m.position, icon: m.icon, ...(m.section ? {section: m.section} : {})},
    title: m.title, summary: m.summary, version: 'abdm-v3',
    license: {name: 'MIT', identifier: 'MIT'},
    contact: {name: 'ABDM sandbox support', url: 'https://sandboxsupport.abdm.gov.in/'},
    'x-abdm-gateway': 'hiecm', 'x-abdm-module': id === 'gateway' ? 'gateway' : id.toUpperCase(), 'x-abdm-phase': 1, 'x-abdm-roles': m.roles,
  },
  'x-abdm-sources': [],
  servers: m.servers,
  security: id === 'gateway' ? [] : [{bearerAuth: []}],
  tags: [], paths: {}, webhooks: {},
  components: {securitySchemes: {bearerAuth: {type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: TOKEN_SOURCE[id] ?? GATEWAY_TOKEN}}},
}]));

const seenPath = new Map();   // "METHOD path" -> module that first declared it
const ids = new Set();
// module -> [{tag, op}] in the exact order operations were encountered in NHA's
// files, paths and webhooks interleaved. --journeys scaffolding reads this.
const order = Object.fromEntries(Object.keys(MODULES).map((id) => [id, []]));
const normHeader = (name) => M1_HEADERS[name.toLowerCase()] ?? name;

for (const {file, place, set = 'nha-2026-09-16', fetched = '2026-09-16', titlesFromSummary = false} of FILES) {
  const full = join(RAW, '..', set, file);
  const doc = file.endsWith('.json') ? JSON.parse(readFileSync(full, 'utf8')) : parse(readFileSync(full, 'utf8'));
  if (file.startsWith('M4/')) dedupeM4Components(doc, file);
  const touched = new Set();
  for (const [path, item] of Object.entries(doc.paths ?? {})) {
    for (const method of METHODS) {
      const op = item?.[method];
      if (!op) continue;
      const tag = (op.tags ?? ['untagged'])[0];
      const module = place(tag, path);
      // The key ignores a #use-case suffix, so a later file's plain path is
      // still dropped against the M1 swagger's split of the same path, while
      // one file may declare several use cases of one path.
      const key = `${method.toUpperCase()} ${path.replace(/#.*$/, '').replace(/^\/(abha\/api|api\/hiecm)/, '').replace(/\{[^}]+\}/g, '{}')}`;
      if (seenPath.has(key) && seenPath.get(key).file !== file) { const first = seenPath.get(key); note(first.module, key, `dropped from ${file}: already declared by ${first.file} in the ${first.module} module`); continue; }
      if (module === null) {
        seenPath.set(key, {file, module: 'gateway'});
        note('gateway', key, 'left out of the reference, as NHA\'s sandbox observations of 23 September 2026 ask');
        continue;
      }
      if (!module || !MODULES[module]) throw new Error(`${file}: ${method.toUpperCase()} ${path} has tag "${tag}", which no module takes`);
      if (!seenPath.has(key)) seenPath.set(key, {file, module});
      touched.add(module);
      const spec = specs[module];
      const copy = structuredClone(op);
      if (item.parameters) copy.parameters = [...structuredClone(item.parameters), ...(copy.parameters ?? [])];
      // 1. operationId
      const nhaId = copy.operationId;
      let id = `${module}_${method}_${slug(path.replace(/^\/(abha\/api|api\/hiecm|api|apis)\//, '/'))}`;
      // An MCP tool name is at most 64 characters, and a tool generator derives
      // it from operationId. A long path would otherwise produce an id no tool
      // can carry, so it is cut and a hash of the full id restores uniqueness.
      if (id.length > 64) id = `${id.slice(0, 57)}_${createHash('sha256').update(id).digest('hex').slice(0, 6)}`;
      let n = 2; while (ids.has(id)) id = `${id}_${n++}`;
      ids.add(id);
      copy.operationId = id;
      if (nhaId) copy['x-abdm-nha-operation-id'] = nhaId;
      note(module, id, nhaId ? `operationId was \`${nhaId}\`` : 'operationId added, NHA had none');
      // The reissued M1 swagger writes each summary as a name, not as a
      // sentence of documentation, so it is the page title as written rather
      // than run through the sentence-to-title rules.
      if (titlesFromSummary && copy.summary && !copy['x-abdm-title']) copy['x-abdm-title'] = copy.summary;
      // 3. M4 summaries
      if (module === 'm4' && !copy.summary) {
        copy.summary = (nhaId ?? slug(path)).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());
        copy['x-abdm-summary-derived'] = true;
        note(module, id, 'summary derived from operationId; NHA gave none');
      }
      // 5. M1 headers
      if (module === 'm1') {
        for (const p of copy.parameters ?? []) if (p.in === 'header' && normHeader(p.name) !== p.name) { note(module, id, `header \`${p.name}\` renamed \`${normHeader(p.name)}\``); p.name = normHeader(p.name); }
        if (method === 'patch' && path.endsWith('/profile/account') && !(copy.parameters ?? []).some((p) => p.name === 'X-token')) {
          copy.parameters = [{name: 'X-token', in: 'header', required: true, schema: {type: 'string'}, description: 'The user token from a login or enrolment response.'}, ...(copy.parameters ?? [])];
          note(module, id, 'X-token header added; the call updates the signed-in profile and NHA declared no user token on it');
        }
        // 9. authMethods: type array, no sibling items; NHA gave only an example.
        const authMethods = copy.responses?.['200']?.content?.['application/json']?.schema?.items?.properties?.ABHA?.items?.properties?.authMethods;
        if (authMethods?.type === 'array' && !authMethods.items) {
          authMethods.items = {type: 'string'};
          note(module, id, 'authMethods given a sibling `items: {type: string}`; NHA declared the array with only an example');
        }
      }
      // 9. subscription: path parameters that do not match their path segment.
      if (file === 'hiecm/subscription.yaml') {
        const segments = [...path.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
        for (const p of copy.parameters ?? []) {
          if (p.in !== 'path') continue;
          if (segments.includes(p.name)) continue;
          if (segments.length === 1) {
            note(module, id, `path parameter \`${p.name}\` renamed to \`${segments[0]}\` to match the path`);
            p.name = segments[0];
          } else if (segments.length === 0) {
            note(module, id, `parameter \`${p.name}\` declared \`in: path\` but the path has no {${p.name}} segment; changed to \`in: query\``);
            p.in = 'query';
          }
        }
      }
      for (const t of copy.tags ?? []) if (!spec.tags.some((x) => x.name === t)) spec.tags.push({name: t, description: (doc.tags ?? []).find((x) => x.name === t)?.description ?? ''});
      // 2. callbacks
      if (CALLBACK.test(path)) {
        (spec.webhooks[path] ??= {})[method] = copy;
        note(module, id, `callback path moved to webhooks`);
      } else {
        (spec.paths[path] ??= {})[method] = copy;
      }
      order[module].push({tag, op: copy});
    }
  }
  // M4 components: merge, refuse silent conflicts.
  for (const module of touched) {
    for (const [kind, defs] of Object.entries(doc.components ?? {})) {
      if (kind === 'securitySchemes') continue;
      specs[module].components[kind] ??= {};
      for (const [name, def] of Object.entries(defs)) {
        const have = specs[module].components[kind][name];
        if (have && JSON.stringify(have) !== JSON.stringify(def)) throw new Error(`${file}: components.${kind}.${name} conflicts with an earlier file`);
        specs[module].components[kind][name] = def;
      }
    }
    specs[module]['x-abdm-sources'].push({file: `catalogue/openapi/.raw/${set}/${file}`, role: 'upstream', hash: sha(full), fetched});
  }
}

// 8. The M1 info.description is not published (wrong cipher, wrong certificate path, third-party tool).
specs.m1.info.description = 'Encrypt Aadhaar numbers, mobile numbers, OTP values and passwords under the certificate from GET /abha/api/v3/profile/public/certificate. See /docs/hiecm/v3/concepts/encryption.';
note('m1', 'info', 'description replaced: NHA\'s text names RSA/ECB/PKCS1Padding, /v3/auth/cert and a third-party encryption site; the original is in the raw file');
specs.m1['x-abdm-sources'].push({file: 'catalogue/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Collection.json', role: 'upstream', hash: sha(join(RAW, 'abha/M1 ABHA Collection.json')), fetched: '2026-09-15', note: 'Used for the order of M1 calls only. See journeys/m1.yaml.'});

// 9. NHA's review of the M3 API pages, 15 September 2026. On consent request
// init the HIP block is optional and neither the HIP nor the HIU name is
// required; the corrected request sends hip null. On the health information
// request the key material fields carried no description beyond a regex.
{
  const init = specs.m3.paths['/api/hiecm/consent/v3/request/init']?.post?.requestBody?.content?.['application/json']?.schema?.properties?.consent;
  if (init) {
    init.properties.hip.required = ['id'];
    init.properties.hip.example = null;
    init.properties.hiu.required = ['id'];
    note('m3', 'POST /api/hiecm/consent/v3/request/init', 'consent.hip.name and consent.hiu.name are not required, and the example sends hip null, as NHA corrected on 15 September 2026; the raw file marks both names required');
  }
  const KEY_MATERIAL = {
    cryptoAlg: 'The key agreement algorithm. Always ECDH.',
    curve: 'The curve the key pair is generated on. Always Curve25519.',
    dhPublicKey: 'The public half of the ephemeral key pair generated for this transaction.',
    'dhPublicKey.expiry': 'When this key stops being valid, as an ISO 8601 timestamp.',
    'dhPublicKey.parameters': 'The key parameters. Ephemeral public key.',
    'dhPublicKey.keyValue': 'The public key, Base64 encoded, in X.509 SubjectPublicKeyInfo form.',
    nonce: '32 random bytes, Base64 encoded, generated for this transaction. The other side combines it with its own nonce to derive the AES-GCM key and initialisation vector.',
  };
  const describeKeyMaterial = (schema, where) => {
    const km = schema?.properties?.hiRequest?.properties?.keyMaterial;
    if (!km) return;
    for (const [path, text] of Object.entries(KEY_MATERIAL)) {
      const [a, b] = path.split('.');
      const target = b ? km.properties?.[a]?.properties?.[b] : km.properties?.[a];
      if (target) target.description = text;
    }
    km.description = 'The requester\'s half of the ECDH key agreement. The HIP derives the shared key from it and its own key pair, and encrypts every entry it pushes with AES-GCM.';
    note('m3', where, 'keyMaterial and its members described; the raw file carried only a regex or nothing');
  };
  describeKeyMaterial(specs.m3.paths['/api/hiecm/data-flow/v3/health-information/request']?.post?.requestBody?.content?.['application/json']?.schema, 'POST /api/hiecm/data-flow/v3/health-information/request');
  describeKeyMaterial(specs.m2.webhooks?.['/api/v3/hip/health-information/request']?.post?.requestBody?.content?.['application/json']?.schema, 'callback POST /api/v3/hip/health-information/request');
}

// 10. NHA's AI sandbox observations, 21 September 2026, on the M1 reference
// pages: the session API named Keycloak and described its credentials with a
// broken sentence, the public key call said what it returned rather than what
// the key is for, and the search call's scope carried only an example.
{
  const sessions = specs.gateway.paths['/api/hiecm/gateway/v3/sessions']?.post;
  if (sessions) {
    sessions.summary = 'This API is invoked to generate access token.';
    const props = sessions.requestBody?.content?.['application/json']?.schema?.properties ?? {};
    if (props.clientId) props.clientId.description = 'The client ID issued to the integrator by ABDM at registration.';
    if (props.clientSecret) props.clientSecret.description = 'The client secret issued to the integrator by ABDM along with the client ID.';
    note('gateway', 'POST /api/hiecm/gateway/v3/sessions', 'summary no longer names Keycloak, and clientId and clientSecret are described as the credentials issued to the integrator; the raw file says "Mandatory when the clientId." for both. NHA review, 21 September 2026');
  }
  const certificate = specs.m1.paths['/abha/api/v3/profile/public/certificate']?.get;
  if (certificate) {
    certificate.description = 'This API is used to fetch the public key used for encryption of Aadhaar, OTP, mobile and other fields which require encryption.';
    note('m1', 'GET /abha/api/v3/profile/public/certificate', 'description says what the key is for, encryption of Aadhaar, OTP, mobile and other fields; the raw file says it returns the key and algorithm. NHA review, 21 September 2026');
  }
  // The use-case split swagger of 22 September declares the search call once
  // per Find ABHA route, each under the same path with a fragment, so every
  // variant takes the edit.
  for (const [path, item] of Object.entries(specs.m1.paths)) {
    if (!path.startsWith('/abha/api/v3/profile/account/abha/search')) continue;
    const scope = item.post?.requestBody?.content?.['application/json']?.schema?.properties?.scope;
    if (!scope) continue;
    scope.description = 'The scope of the request. Use search-abha.';
    scope.items = {...(scope.items ?? {type: 'string'}), enum: ['search-abha']};
    note('m1', `POST ${path}`, 'scope described and constrained to search-abha; the raw file carried only the example. NHA review, 21 September 2026');
  }
  // "Description of all body parameters should be there." Six field names in
  // the reissued M1 swagger carry an example and no description. Each is
  // described once here, in the words the flow gives it, and only where the
  // raw file left it blank.
  const M1_FIELDS = {
    txnId: 'The transaction ID returned by the previous call in this flow.',
    abhaAddress: 'The ABHA address chosen for the account, without the @ suffix.',
    preferred: '1 to make this the preferred ABHA address of the account, 0 otherwise.',
    scope: 'The scopes of the request, which name the flow this call belongs to.',
    ABHANumber: 'The 14 digit ABHA number to sign in to, chosen from the accounts the previous call listed.',
    mobile: 'The mobile number, encrypted with the public key from GET /abha/api/v3/profile/public/certificate.',
  };
  let described = 0;
  const describe = (schema) => {
    if (!schema || typeof schema !== 'object') return;
    for (const [name, prop] of Object.entries(schema.properties ?? {})) {
      if (!prop.description && M1_FIELDS[name]) {
        prop.description = M1_FIELDS[name];
        described++;
      }
      describe(prop);
      describe(prop.items);
    }
  };
  for (const item of Object.values(specs.m1.paths)) {
    for (const method of METHODS) describe(item[method]?.requestBody?.content?.['application/json']?.schema);
  }
  if (described) note('m1', 'request bodies', `${described} body fields described (${Object.keys(M1_FIELDS).join(', ')}); the raw file carried only an example for each. NHA review, 21 September 2026`);
}

// 11. The HIP calls health-information/notify after pushing the data, so the
// operation belongs on the M2 list as well as the M3 one. NHA declares it
// once, under the HIU tag, so it is copied rather than moved (NHA's M2 API
// review of 21 September 2026 lists it under M2 as "Not Found").
{
  const NOTIFY = '/api/hiecm/data-flow/v3/health-information/notify';
  const notify = specs.m3.paths[NOTIFY]?.post;
  if (notify) {
    const copy = structuredClone(notify);
    copy.operationId = 'm2_post_data_flow_v3_health_information_notify';
    ids.add(copy.operationId);
    specs.m2.paths[NOTIFY] = {post: copy};
    for (const t of copy.tags ?? []) if (!specs.m2.tags.some((x) => x.name === t)) specs.m2.tags.push({name: t, description: ''});
    note('m2', copy.operationId, 'copied from m3: the HIP sends this notification after the data push, and NHA\'s review of 21 September 2026 lists it under M2');
  }
}

// 12. NHA's review of the M2 and M3 API pages, 15 and 21 September 2026.
// On link/context/notify the HIP block marked id, name and type required and
// NHA answered "only one is required, not all". The consent request init
// example still sent the HIU name the schema no longer requires. The HIP's
// on-request acknowledgement is an anyOf with no example, so its curl rendered
// "<VALUE>". The success examples of the linking replies carried an error
// object beside the success fields. And every M2 and M3 callback is declared
// at module level without naming the call it belongs to.
{
  const body = (op) => op?.requestBody?.content?.['application/json'];
  const hip = body(specs.m2.paths['/api/hiecm/hip/v3/link/context/notify']?.post)?.schema?.properties?.notification?.properties?.hip;
  if (hip) {
    hip.required = ['id'];
    hip.description = 'The HIP that linked the care context. Only id is required.';
    note('m2', 'POST /api/hiecm/hip/v3/link/context/notify', 'notification.hip requires id only; the raw file required id, name and type. NHA review, 15 September 2026');
  }
  const hiu = body(specs.m3.paths['/api/hiecm/consent/v3/request/init']?.post)?.schema?.properties?.consent?.properties?.hiu;
  if (hiu?.properties?.id?.example !== undefined) {
    hiu.example = {id: hiu.properties.id.example};
    note('m3', 'POST /api/hiecm/consent/v3/request/init', 'the example sends hiu with id only, as the schema requires; the raw file also sent name and type. NHA review, 15 September 2026');
  }
  const onRequest = body(specs.m2.paths['/api/hiecm/data-flow/v3/health-information/hip/on-request']?.post);
  const success = onRequest?.schema?.anyOf?.[0]?.properties;
  if (onRequest && onRequest.example === undefined && success?.hiRequest && success?.response) {
    onRequest.example = {
      hiRequest: {transactionId: success.hiRequest.properties.transactionId.example, sessionStatus: success.hiRequest.properties.sessionStatus.example},
      response: {requestId: success.response.properties.requestId.example},
    };
    note('m2', 'POST /api/hiecm/data-flow/v3/health-information/hip/on-request', 'request example taken from the success branch of the anyOf; the raw file carried none, so the curl rendered a placeholder. NHA review, 15 September 2026');
  }
  // A success example without the error object. The reference build samples
  // a request from the schema's examples, and a string with no example
  // becomes a named placeholder, so the error object appears in every curl
  // unless the media type carries its own example.
  const sample = (schema, name = '') => {
    if (!schema) return undefined;
    if (schema.example !== undefined) return schema.example;
    if (Array.isArray(schema.enum) && schema.enum.length) return schema.enum[0];
    const type = schema.type ?? (schema.properties ? 'object' : schema.items ? 'array' : 'string');
    if (type === 'object') {
      const out = {};
      for (const [k, v] of Object.entries(schema.properties ?? {})) {
        if (k === 'error') continue;
        const val = sample(v, k);
        if (val !== undefined) out[k] = val;
      }
      return Object.keys(out).length ? out : undefined;
    }
    if (type === 'array') { const item = sample(schema.items, name); return item === undefined ? [] : [item]; }
    if (type === 'integer' || type === 'number') return 0;
    if (type === 'boolean') return false;
    return `<${(name || 'value').replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/[^A-Za-z0-9]+/g, '_').toUpperCase()}>`;
  };
  const dropErrorExample = (module, path) => {
    const media = body(specs[module].paths[path]?.post);
    if (!media?.schema?.properties?.error || media.example !== undefined) return;
    media.example = sample(media.schema);
    note(module, `POST ${path}`, 'the request example carries the success fields only, as NHA\'s corrected curl does; the body table still lists error. NHA review, 15 September 2026');
  };
  for (const path of ['/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover', '/api/hiecm/user-initiated-linking/v3/link/care-context/on-init', '/api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm', '/api/hiecm/consent/v3/request/hip/on-notify']) dropErrorExample('m2', path);
  // Which call each callback belongs to. triggered-by: the integrator's call
  // that produces it. answered-by: the integrator's call that replies to it.
  const PAIRS = {
    m2: {
      '/api/v3/hip/token/on-generate-token': ['x-abdm-triggered-by', 'm2_post_v3_token_generate_token'],
      '/api/v3/link/on_carecontext': ['x-abdm-triggered-by', 'm2_post_hip_v3_link_carecontext'],
      '/api/v3/links/context/on-notify': ['x-abdm-triggered-by', 'm2_post_hip_v3_link_context_notify'],
      '/api/v3/patients/sms/on-notify': ['x-abdm-triggered-by', 'm2_post_hip_v3_link_patient_links_sms_notify2'],
      '/api/v3/hip/patient/care-context/discover': ['x-abdm-answered-by', 'm2_post_user_initiated_linking_v3_patient_care_context_on_8c9340'],
      '/api/v3/hip/link/care-context/init': ['x-abdm-answered-by', 'm2_post_user_initiated_linking_v3_link_care_context_on_init'],
      '/api/v3/hip/link/care-context/confirm': ['x-abdm-answered-by', 'm2_post_user_initiated_linking_v3_link_care_context_on_confirm'],
      '/api/v3/hip/health-information/request': ['x-abdm-answered-by', 'm2_post_data_flow_v3_health_information_hip_on_request'],
    },
    p2: {
      '/api/v3/hiu/patient/care-context/on-discover': ['x-abdm-triggered-by', 'p2_post_user_initiated_linking_v3_patient_care_context_discover'],
      '/api/v3/hiu/patient/care-context/on-init': ['x-abdm-triggered-by', 'p2_post_user_initiated_linking_v3_link_care_context_init'],
      '/api/v3/hiu/patient/care-context/on-confirm': ['x-abdm-triggered-by', 'p2_post_user_initiated_linking_v3_link_care_context_confirm'],
      '/api/v3/hiu/patient/on-share': ['x-abdm-triggered-by', 'p2_post_patient_share_v3_share'],
    },
    'scan-and-register': {
      '/api/v3/hip/patient/share': ['x-abdm-answered-by', 'scan-and-register_post_patient_share_v3_on_share'],
    },
    p3: {
      '/api/v3/hiu/hiecm/subscription-requests/on-init': ['x-abdm-triggered-by', 'p3_post_subscription_requests_v3_init'],
      '/api/v3/hiu/subscription-requests/hiu/notify': ['x-abdm-answered-by', 'p3_post_subscription_requests_v3_hiu_on_notify'],
      '/api/v3/hiu/subscription/notify': ['x-abdm-answered-by', 'p3_post_subscription_requests_v3_hiu_care_context_on_notify'],
    },
    'scan-and-pay': {
      '/v3/patient/share/open-order': ['x-abdm-answered-by', 'scan-and-pay_post_scan_gateway_v3_patient_on_share_open_order'],
      '/v3/patient/selection': ['x-abdm-answered-by', 'scan-and-pay_post_scan_gateway_v3_patient_on_selection'],
      '/v3/patient/scan-pay/on-notify': ['x-abdm-triggered-by', 'scan-and-pay_post_scan_gateway_v3_patient_scan_pay_notify'],
      '/v3/patient/scan-pay/order-status': ['x-abdm-answered-by', 'scan-and-pay_post_scan_gateway_v3_patient_scan_pay_on_ord_21f376'],
      '/v3/patient/on-share/open-order': ['x-abdm-triggered-by', 'scan-and-pay_post_scan_gateway_v3_patient_share_open_order'],
      '/v3/patient/on-selection': ['x-abdm-triggered-by', 'scan-and-pay_post_scan_gateway_v3_patient_selection'],
      '/v3/patient/scan-pay/notify': ['x-abdm-answered-by', 'scan-and-pay_post_scan_gateway_v3_patient_scan_pay_on_notify'],
      '/v3/patient/scan-pay/on-order-status': ['x-abdm-triggered-by', 'scan-and-pay_post_scan_gateway_v3_patient_scan_pay_order_status'],
    },
    m3: {
      '/api/v3/hiu/consent/request/on-init': ['x-abdm-triggered-by', 'm3_post_consent_v3_request_init'],
      '/api/v3/hiu/consent/request/on-status': ['x-abdm-triggered-by', 'm3_post_consent_v3_request_status'],
      '/api/v3/hiu/consent/request/notify': ['x-abdm-answered-by', 'm3_post_consent_v3_request_hiu_on_notify'],
      '/api/v3/hiu/consent/on-fetch': ['x-abdm-triggered-by', 'm3_post_consent_v3_fetch'],
      '/api/v3/hiu/health-information/on-request': ['x-abdm-triggered-by', 'm3_post_data_flow_v3_health_information_request'],
    },
  };
  for (const [module, pairs] of Object.entries(PAIRS)) {
    for (const [path, [key, target]] of Object.entries(pairs)) {
      const hook = specs[module].webhooks?.[path]?.post;
      if (!hook) throw new Error(`${module}: webhook ${path} not found for pairing`);
      if (!ids.has(target)) throw new Error(`${module}: ${target} not found for pairing ${path}`);
      hook[key] = target;
    }
    note(module, 'webhooks', `every callback names the call it belongs to (x-abdm-triggered-by or x-abdm-answered-by); the raw file declares them at module level with no pairing. NHA review, 15 September 2026`);
  }
}

// 13. NHA's PHR V3 document, the final source for the PHR application
// services. The PHR swagger names a security scheme, apiKeyAuth, that it
// never defines, so every PHR call it marks rendered with no Authorization
// header; the document marks the gateway session token mandatory on each.
// The document marks every body field of the /phr/app calls required, and
// the swagger marks none. Three profile reads take X-AUTH-TOKEN beside
// X-token. excludedSources on approving a subscription is optional. And the
// redaction pass had turned encrypted mobile numbers, login ids, OTPs and
// passwords into the photograph placeholder.
{
  const PHR = '/abha/api/v3/phr/app/';
  for (const module of ['p1', 'p2']) {
    let fixed = 0;
    for (const [path, item] of Object.entries(specs[module].paths)) {
      for (const method of METHODS) {
        const op = item[method];
        if (!op) continue;
        if (Array.isArray(op.security) && op.security.some((s) => 'apiKeyAuth' in s)) {
          op.security = op.security.map((s) => ('apiKeyAuth' in s ? {bearerAuth: []} : s));
          fixed++;
        }
      }
    }
    if (fixed) note(module, 'security', `${fixed} operations named apiKeyAuth, a scheme the raw file never defines; they carry the gateway session token as bearerAuth, as the PHR V3 document marks Authorization mandatory on each`);
    let required = 0;
    for (const [path, item] of Object.entries(specs[module].paths)) {
      if (!path.startsWith(PHR)) continue;
      const schema = item.post?.requestBody?.content?.['application/json']?.schema;
      if (!schema?.properties || schema.required) continue;
      schema.required = Object.keys(schema.properties).filter((k) => !(path.endsWith('/enrollment/suggestion') && k === 'email'));
      required++;
    }
    if (required) note(module, 'request bodies', `${required} /phr/app request bodies mark their fields required, as the PHR V3 document does; the raw file marked none. email on the address suggestion stays optional, since the document's own request omits it`);
    let placeholders = 0;
    const scrub = (node, key) => {
      if (Array.isArray(node)) return node.forEach((n) => scrub(n, key));
      if (!node || typeof node !== 'object') return;
      for (const [k, v] of Object.entries(node)) {
        if (v === '<BASE64_PHOTO>' && !/photo/i.test(k)) {
          node[k] = `<ENCRYPTED_${k.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toUpperCase()}>`;
          placeholders++;
        } else scrub(v, k);
      }
    };
    scrub(specs[module].paths);
    if (placeholders) note(module, 'examples', `${placeholders} encrypted values (mobile, loginId, otpValue, password) read <BASE64_PHOTO> after redaction and now read a placeholder named for the field`);
  }
  for (const path of ['/abha/api/v3/phr/app/login/profile', '/abha/api/v3/phr/app/login/profile/qrCode', '/abha/api/v3/phr/app/login/profile/phrCard']) {
    const op = specs.p2.paths[path]?.get;
    if (!op) continue;
    op.parameters ??= [];
    if (!op.parameters.some((x) => x.name === 'X-AUTH-TOKEN')) {
      op.parameters.push({name: 'X-AUTH-TOKEN', in: 'header', required: true, schema: {type: 'string'}, description: 'The user token issued at login. Send it beside X-token.'});
      note('p2', `GET ${path}`, 'X-AUTH-TOKEN header added; the PHR V3 document marks it mandatory beside X-token and the raw file declares X-token only');
    }
  }
  const approve = specs.p3.paths['/api/hiecm/subscription-requests/v3/{request-id}/approve']?.post?.requestBody?.content?.['application/json']?.schema;
  const walkRequired = (schema) => {
    if (!schema || typeof schema !== 'object') return;
    if (Array.isArray(schema.required) && schema.required.includes('excludedSources')) {
      schema.required = schema.required.filter((k) => k !== 'excludedSources');
      note('p3', 'POST /api/hiecm/subscription-requests/v3/{request-id}/approve', 'excludedSources is optional, as the PHR V3 document marks it; the raw file required it');
    }
    for (const v of Object.values(schema.properties ?? {})) walkRequired(v);
    walkRequired(schema.items);
  };
  walkRequired(approve);

  // NHA's AI sandbox observations of 23 September 2026 (PHR web sheet).
  // P2 carries ABHA service and gateway calls in one file, and a page takes
  // the file's first server, so every /api/hiecm call rendered against the
  // ABHA host. Those paths carry the gateway server of their own.
  const GATEWAY = [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}];
  let rehosted = 0;
  for (const [path, item] of Object.entries(specs.p2.paths)) {
    if (!path.startsWith('/api/hiecm/')) continue;
    item.servers = GATEWAY;
    rehosted++;
  }
  if (rehosted) note('p2', 'servers', `${rehosted} /api/hiecm paths carry the gateway server; they rendered against the ABHA service host, the file's first server. NHA sandbox observations, 23 September 2026`);
  // The PHR V3 document, 6.16 to 6.22, names the X-AUTH-TOKEN on the
  // patient's consent calls as the PHR login token, not an ABDM one.
  for (const [path, item] of Object.entries(specs.p2.paths)) {
    if (!/^\/api\/hiecm\/consent\/v3\/(request|artefact|revoke)/.test(path)) continue;
    for (const method of METHODS) {
      const header = item[method]?.parameters?.find((x) => x.name === 'X-AUTH-TOKEN');
      if (!header) continue;
      header.description = 'The user token the PHR service issued when the patient logged in.';
      note('p2', `${method.toUpperCase()} ${path}`, 'X-AUTH-TOKEN is the PHR login token, as the PHR V3 document says in 6.16 to 6.22; the raw file described an ABDM username and password token');
    }
  }
  // Approving a subscription: the document (8.3.4) marks hip optional, and
  // the raw example both included and excluded the same HIP. The example is
  // the one in NHA's PHR and locker collection, which applies to every HIP.
  const approveMedia = specs.p3.paths['/api/hiecm/subscription-requests/v3/{request-id}/approve']?.post?.requestBody?.content?.['application/json'];
  const source = approveMedia?.schema?.properties?.includedSources?.items;
  if (source?.required?.includes('hip')) {
    source.required = source.required.filter((k) => k !== 'hip');
    note('p3', 'POST /api/hiecm/subscription-requests/v3/{request-id}/approve', 'includedSources hip is optional, as the PHR V3 document (8.3.4) marks it; the raw file required it');
  }
  if (approveMedia) {
    delete approveMedia.examples;
    approveMedia.example = {
      isApplicableForAllHIPs: true,
      includedSources: [{
        hiTypes: ['Prescription', 'DiagnosticReport', 'OPConsultation', 'DischargeSummary', 'ImmunizationRecord', 'HealthDocumentRecord', 'WellnessRecord', 'Invoice'],
        purpose: {text: 'Care Management', code: 'CAREMGT', refUri: 'www.abdm.gov.in'},
        categories: ['LINK', 'DATA'],
        period: {from: '2025-01-09T09:00:00.000Z', to: '2124-12-31T09:00:00.000Z'},
      }],
      excludedSources: [],
    };
    note('p3', 'POST /api/hiecm/subscription-requests/v3/{request-id}/approve', 'example is the PHR and locker collection\'s; the raw example included and excluded the same HIP');
  }
  // Listing subscription requests: the document (8.3.1) marks limit, offset
  // and the status filter mandatory; the raw file marked them optional.
  for (const p of specs.p3.paths['/api/hiecm/subscription-requests/v3/requests']?.get?.parameters ?? []) {
    if (p.in !== 'query' || p.required) continue;
    p.required = true;
    note('p3', 'GET /api/hiecm/subscription-requests/v3/requests', `query ${p.name} is required, as the PHR V3 document (8.3.1) marks it`);
  }
  // Where the PHR swagger and the HIE-CM swagger both declare a call, the
  // HIE-CM one was kept. Two of the PHR swagger's parameters, which the PHR
  // V3 document also carries, were lost that way.
  const providers = specs.p2.paths['/api/hiecm/gateway/v3/providers']?.get;
  if (providers) {
    providers.parameters ??= [];
    for (const name of ['stateCode', 'districtCode']) {
      if (providers.parameters.some((x) => x.name === name)) continue;
      providers.parameters.push({name, in: 'query', required: false, schema: {type: 'string', example: '-1'}, description: `Filter by ${name === 'stateCode' ? 'state' : 'district'} code; -1 for all.`});
      note('p2', 'GET /api/hiecm/gateway/v3/providers', `query ${name} added, as the PHR swagger and the PHR V3 document (10.3.13) declare it; the HIE-CM gateway swagger does not`);
    }
  }
  const onDiscover = specs.m2.paths['/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover']?.post;
  if (onDiscover && !onDiscover.parameters?.some((x) => x.name === 'X-HIU-ID')) {
    (onDiscover.parameters ??= []).push({name: 'X-HIU-ID', in: 'header', required: true, schema: {type: 'string'}, example: 'IN2810014366', description: 'Identifier of the health information user to which the request was intended'});
    note('m2', 'POST /api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover', 'X-HIU-ID header added, required, as the PHR swagger and the PHR V3 document (10.3.3) declare it; the HIE-CM swagger does not');
  }
  // The session call takes one grant type. Stated as a one value enum, Try it
  // fills it in and locks it, as NHA's sandbox observations ask for fixed values.
  const grantType = specs.gateway.paths['/api/hiecm/gateway/v3/sessions']?.post?.requestBody?.content?.['application/json']?.schema?.properties?.grantType;
  if (grantType && !grantType.enum) {
    grantType.enum = ['client_credentials'];
    note('gateway', 'POST /api/hiecm/gateway/v3/sessions', 'grantType takes client_credentials only, as the PHR V3 document (3.0) sends it; the raw file gave it as an example');
  }
  // NHA's sandbox observations of 23 September 2026 deprecate updating the
  // email on a PHR profile, and name the P2 folder Consents Management. The
  // email flow shares its calls with the mobile flow, so it is taken out of
  // their examples, flow lists and descriptions rather than the calls going.
  const EMAIL = /Update Email/;
  const rename = (text) => text.replace(/P2-Management/g, 'P2-Consents Management');
  specs.p2.tags = (specs.p2.tags ?? []).filter((t) => !EMAIL.test(t.name)).map((t) => (t.description ? {...t, description: rename(t.description).replace(/ \/ P2 - Update Email \(optional\)/, '')} : t));
  let emailDropped = 0;
  const dropEmail = (examples) => {
    for (const key of Object.keys(examples ?? {})) if (EMAIL.test(key)) { delete examples[key]; emailDropped++; }
  };
  for (const item of Object.values(specs.p2.paths)) {
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      if (op.tags) op.tags = op.tags.filter((t) => !EMAIL.test(t));
      for (const media of Object.values(op.requestBody?.content ?? {})) dropEmail(media.examples);
      for (const response of Object.values(op.responses ?? {})) for (const media of Object.values(response.content ?? {})) dropEmail(media.examples);
      if (op.description) op.description = rename(op.description.split('\n').filter((line) => !EMAIL.test(line)).join('\n'));
      const flows = /^(\d+) flows: (.*)$/.exec(op.summary ?? '');
      if (flows && EMAIL.test(flows[2])) {
        const kept = flows[2].split(', ').filter((f) => !EMAIL.test(f));
        op.summary = `${kept.length} flows: ${kept.join(', ')}`;
      }
    }
  }
  if (emailDropped) note('p2', 'update email', `${emailDropped} update email examples, their flow names and the Update Email (optional) tag left out; NHA's sandbox observations of 23 September 2026 deprecate the flow. P2-Management in the collection paths reads P2-Consents Management`);
  // Email login goes the same way: the review of 23 September 2026 leaves
  // PHR login without its two email OTP routes. The calls stay, since every
  // other login route shares them; the email examples, their flow names and
  // their collection paths go. The email route's verify user example is the
  // collection's second, "Verify - User (2)", as journeys/p1.yaml records.
  const LOGIN_EMAIL = /Email(?! Verification Link)|Login via Email|Verify - User(?: -[^(]*)?\(2\)|Verify - User[^(]*\(2\)/;
  let loginEmailDropped = 0;
  const dropLoginEmail = (examples) => {
    for (const key of Object.keys(examples ?? {})) if (LOGIN_EMAIL.test(key)) { delete examples[key]; loginEmailDropped++; }
  };
  for (const [path, item] of Object.entries(specs.p1.paths)) {
    if (!/\/phr\/app\/login\//.test(path)) continue;
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      for (const media of Object.values(op.requestBody?.content ?? {})) dropLoginEmail(media.examples);
      for (const response of Object.values(op.responses ?? {})) for (const media of Object.values(response.content ?? {})) dropLoginEmail(media.examples);
      if (op.description) op.description = op.description.split('\n').filter((line) => !/Login via Email|Email OTP/.test(line)).join('\n');
      const flows = /^(\d+) flows: (.*)$/.exec(op.summary ?? '');
      if (flows) {
        const kept = flows[2].split(', ').filter((f) => !/Email/.test(f));
        const count = Number(flows[1]) - (flows[2].split(', ').length - kept.length) - (/verify\/user$/.test(path) ? 1 : 0);
        op.summary = `${count} flows: ${kept.join(', ')}`;
      }
    }
  }
  if (loginEmailDropped) note('p1', 'login email', `${loginEmailDropped} email login examples, their flow names and collection paths left out; NHA's sandbox observations of 23 September 2026 deprecate email in the PHR application`);
  // The two patient share calls carry the names NHA gave them. The summary is
  // what the Scalar reference shows as the name, so it changes with the title.
  for (const [path, name] of [['/api/hiecm/patient-share/v3/share', 'OPD token generation'], ['/api/hiecm/patient-share/v3/profile/getTokenDetails', 'OPD Token History']]) {
    const op = specs.p2.paths[path]?.post ?? specs.p2.paths[path]?.get;
    if (!op || op.summary === name) continue;
    op.summary = name;
    note('p2', path, `named ${name}, as NHA's sandbox observations of 23 September 2026 ask; NHA's sentence stays as the description`);
  }
}

// NHA's feedback of 23 September 2026. P2, P3 and P4 go to the gateway at
// https://dev.abdm.gov.in, as NHA stated; P1 stays on the ABHA service under
// /abha/api/v3/phr/app, and the Aadhaar flow calls under /abha/api/v3/.
// A path slot named {request-id} reads
// like the REQUEST-ID header every call carries. Every PHR path parameter now
// takes the name NHA's PHR Postman collection gives the variable that fills
// it. Only the documented name changes; the URL on the wire does not.
{
  const PHR_PATH_NAMES = [
    [/^\/api\/hiecm\/consent\/v3\/(request|artefact\/request)\/\{request-id\}/, 'request-id', 'consentRequestId'],
    [/^\/api\/hiecm\/consent\/v3\/artefact\/\{artefact-id\}/, 'artefact-id', 'consentId'],
    [/^\/api\/hiecm\/consent\/v3\/auto\/approve\/\{auto-approval-id\}/, 'auto-approval-id', 'consentId'],
    [/^\/api\/hiecm\/subscription-requests\/v3\/(request\/)?\{request-id\}/, 'request-id', 'subscriptionRequestId'],
    [/\{subscription-id\}/, 'subscription-id', 'subscriptionID'],
    [/\{lockerId\}/, 'lockerId', 'locker-id'],
    [/^\/api\/hiecm\/gateway\/v3\/providers\/\{provider-id\}/, 'provider-id', 'hip-id'],
  ];
  for (const module of ['p2', 'p3', 'p4']) {
    const renamed = {};
    for (const [path, item] of Object.entries(specs[module].paths)) {
      let next = path;
      for (const [match, from, to] of PHR_PATH_NAMES) {
        if (!match.test(next)) continue;
        next = next.replace(`{${from}}`, `{${to}}`);
        for (const method of METHODS) for (const param of item[method]?.parameters ?? []) if (param.in === 'path' && param.name === from) param.name = to;
        for (const param of item.parameters ?? []) if (param.in === 'path' && param.name === from) param.name = to;
        note(module, `${Object.keys(item).find((k) => METHODS.includes(k))?.toUpperCase()} ${path}`, `path parameter {${from}} named {${to}}, the variable NHA's PHR Postman collection fills it with; NHA's feedback of 23 September 2026`);
      }
      renamed[next] = item;
    }
    specs[module].paths = renamed;
  }
  // P2 mixes the two: its profile and link calls live on the PHR application
  // service, like P1, so each of those carries that server on the call.
  let phrAppCalls = 0;
  for (const [path, item] of Object.entries(specs.p2.paths)) {
    if (!path.startsWith('/abha/api/')) continue;
    for (const method of METHODS) if (item[method]) { item[method].servers = [{url: 'https://abhasbx.abdm.gov.in', description: 'PHR application service, sandbox'}]; phrAppCalls++; }
  }
  note('p2', 'servers', `${phrAppCalls} PHR application calls under /abha/api/v3/phr/app carry https://abhasbx.abdm.gov.in on the call, as P1's do; the gateway calls take https://dev.abdm.gov.in`);
  note('p2, p3, p4', 'servers', 'https://dev.abdm.gov.in only, the base URL NHA gave for P2, P3 and P4 on 23 September 2026; the PHR swagger declares https://abhasbx.abdm.gov.in, and P2 had rendered its gateway calls on it');
}

for (const [id, m] of Object.entries(MODULES)) {
  const count = Object.values(specs[id].paths).reduce((n, i) => n + METHODS.filter((x) => i[x]).length, 0) + Object.values(specs[id].webhooks).reduce((n, i) => n + METHODS.filter((x) => i[x]).length, 0);
  if (count !== m.expected) throw new Error(`${id}: ${count} operations, expected ${m.expected}: ${Object.keys(specs[id].paths).join(' ')}`);
  if (!Object.keys(specs[id].webhooks).length) delete specs[id].webhooks;
}

if (journeysMode) {
  const JOURNEYS = join(root, 'catalogue', 'openapi', 'hiecm', 'v3', 'journeys');
  const journeySlug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  let written = 0;
  for (const module of Object.keys(MODULES)) {
    if (module === 'm1') continue;
    const path = join(JOURNEYS, `${module}.yaml`);
    if (existsSync(path)) continue;
    const byTag = new Map(); // tag -> steps, in first-seen order
    for (const {tag, op} of order[module]) {
      if (!byTag.has(tag)) byTag.set(tag, []);
      byTag.get(tag).push({op: op.operationId});
    }
    const journeys = [...byTag.entries()].map(([tag, steps]) => ({
      id: `${module}-${journeySlug(tag)}`,
      title: tag.replace(/^abdm-/, '').replace(/-(hip|hiu|phr)$/, '').replace(/^./, (c) => c.toUpperCase()),
      steps,
    }));
    writeFileSync(path, stringify(journeys, {lineWidth: 0}));
    written++;
  }
  console.log(`wrote ${written} journey scaffold(s)`);
  process.exit(0);
}

// YAML 1.1 readers resolve an unquoted 2026-09-16 or 1991-24-04 as a timestamp,
// which loses the string NHA wrote and, on an impossible month, fails the load.
const DATEISH = /^\d{4}-\d{1,2}-\d{1,2}([Tt ].*)?$|^\d{1,2}-\d{1,2}-\d{4}$/;
// 10. Fill the header descriptions NHA left blank, every module, paths and
// webhooks alike. Logged per operation so the log shows what the file lacked.
for (const [module, spec] of Object.entries(specs)) {
  for (const group of [spec.paths, spec.webhooks]) {
    for (const item of Object.values(group ?? {})) {
      for (const method of METHODS) {
        const op = item[method];
        if (!op) continue;
        const filled = [];
        for (const p of op.parameters ?? []) {
          if (p.in === 'header' && !p.description && HEADER_DESC[p.name]) { p.description = HEADER_DESC[p.name]; filled.push(`\`${p.name}\``); }
        }
        if (filled.length) note(module, op.operationId, `header description added for ${filled.join(', ')}; NHA gave none`);
      }
    }
  }
}

const emit = (spec) => {
  const doc = new Document(spec);
  visit(doc, {Scalar(_, node) { if (typeof node.value === 'string' && DATEISH.test(node.value)) node.type = 'QUOTE_DOUBLE'; }});
  return doc.toString({lineWidth: 0});
};
note('all', 'dates', 'date and timestamp strings are quoted so a YAML 1.1 reader keeps them as strings');
const outputs = Object.entries(specs).map(([id, spec]) => [join(OUT, `hiecm-${id}.yaml`), emit(spec)]);
outputs.push([LOG, ['# 2026-09-16: the final set, ingested', '', 'Written by `scripts/ingest-nha.mjs`. Every line is one edit the script made to NHA\'s files so they render; nothing else was changed. Rerun the script to regenerate the specs and this log.', '', '| Module | Operation | Edit |', '| --- | --- | --- |', ...log, ''].join('\n')]);
let drift = 0;
for (const [path, text] of outputs) {
  if (check) { if (!existsSync(path) || readFileSync(path, 'utf8') !== text) { console.error(`out of date: ${path}`); drift++; } }
  else writeFileSync(path, text);
}
if (check && drift) process.exit(1);
console.log(check ? 'specs match the raw set' : `wrote ${outputs.length - 1} specs and the correction log`);
