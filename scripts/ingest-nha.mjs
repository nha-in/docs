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
  gateway: {label: 'Gateway session', position: 1, icon: 'key-round', roles: ['his', 'phr'], title: 'ABDM gateway, sessions and bridges', summary: 'The access token every call carries, and the bridge registry.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 11},
  m1: {label: 'M1 ABHA identity', position: 2, icon: 'id-card', roles: ['his'], title: 'ABDM M1, ABHA identity', summary: 'Create, find, log into and manage an ABHA.', servers: [{url: 'https://abhasbx.abdm.gov.in', description: 'ABHA service, sandbox'}], expected: 30},
  m2: {label: 'M2 Linking and sharing', position: 3, icon: 'link', roles: ['his'], title: 'ABDM M2, linking and sharing as a HIP', summary: 'Link care contexts to an ABHA address and share records when consent arrives.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 21},
  m3: {label: 'M3 Consent and fetching', position: 4, icon: 'file-check', roles: ['his'], title: 'ABDM M3, consent and fetching as an HIU', summary: 'Raise a consent request, fetch its artefacts, and receive records.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 12},
  m4: {label: 'M4 HPR and HFR', position: 5, icon: 'building-2', roles: ['his'], title: 'ABDM M4, professional and facility registries', summary: 'Register healthcare professionals and facilities on the NHPR.', servers: [{url: 'https://apihspsbx.abdm.gov.in/v4/int', description: 'NHPR, sandbox'}], expected: 100},
  p1: {label: 'P1 Registration and login', position: 6, icon: 'user-round', roles: ['phr'], title: 'ABDM P1, PHR registration and login', summary: 'Create an ABHA address in a PHR app and log in to it.', servers: [{url: 'https://abhasbx.abdm.gov.in', description: 'ABHA service, sandbox'}], expected: 11},
  p2: {label: 'P2 Management', position: 7, icon: 'files', roles: ['phr'], title: 'ABDM P2, PHR management', summary: 'Manage the PHR profile, link an ABHA number, switch profiles, and handle linking, sharing and consent for the patient.', servers: [{url: 'https://abhasbx.abdm.gov.in', description: 'ABHA service, sandbox'}, {url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}], expected: 32},
  p3: {label: 'P3 Subscription', position: 8, icon: 'bell', roles: ['phr'], title: 'ABDM P3, PHR subscriptions', summary: 'Read, approve, deny, enable, disable and update the patient\'s subscriptions and subscription requests.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}], expected: 8},
  p4: {label: 'P4 Locker', position: 9, icon: 'lock', roles: ['phr'], title: 'ABDM P4, health lockers', summary: 'Set up a health locker and list the lockers and requests on an ABHA address.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}], expected: 4},
  subscription: {label: 'Subscriptions', position: 10, icon: 'bell', roles: ['his'], title: 'ABDM subscriptions', summary: 'Subscribe an HIU to changes on an ABHA address.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 6},
  'scan-and-pay': {label: 'Scan and Pay', position: 11, icon: 'qr-code', roles: ['his'], title: 'ABDM Scan and Pay', summary: 'Open orders, patient selection and payment status between a facility and a PHR app.', servers: [{url: 'https://dev.abdm.gov.in', description: 'ABDM gateway, sandbox'}, {url: 'https://apis.abdm.gov.in', description: 'ABDM gateway, production'}], expected: 18},
};

// The patient side follows NHA's PHR collection folders, P1 to P4, by tag.
// The locker calls carry subscription tags, so they are placed by path.
const PHR_TAGS = {
  'ABHA enrolment via Aadhaar': 'p1', 'P1 - Create ABHA Address Flow': 'p1', 'P1 - Login via ABHA Address - Password': 'p1', 'P1 - PHR Login': 'p1', 'P1-Registration-login': 'p1',
  'P2 - Link ABHA Number': 'p2', 'P2 - Switch Profile': 'p2', 'P2 -PHR Profile': 'p2', 'abdm-hiecm-patient-share-phr': 'p2', 'abdm-hip-initiated-linking-phr': 'p2', 'abdm-user-initiated-linking-phr': 'p2', 'consent-management-data-flow-phr': 'p2',
  'subscription-phr': 'p3', 'abdm-hiecm-scan-pay-phr': 'scan-and-pay', Gateway: 'gateway',
};
const LOCKER = /\/subscription-requests\/v3\/(patients\/lockers(\/\{[^}]+\})?|patients\/requests|setup-locker)$/;
// undefined: no mapping; only allowed for a call an earlier file already declared.
const phrPlace = (tag, path) => (LOCKER.test(path) ? 'p4' : PHR_TAGS[tag]);

// Which module an operation lands in. Returns null to drop it.
const FILES = [
  {file: 'hiecm/gateway.yaml', place: () => 'gateway'},
  {file: 'abha/M1 ABHA Swagger 1.yaml', place: (tag, path) => (path.includes('/gateway/') ? null : 'm1')},
  {file: 'hiecm/hip-initiated-linking.yaml', place: byRole('m2')},
  {file: 'hiecm/user-initiated-linking.yaml', place: byRole('m2')},
  {file: 'hiecm/link-token.yaml', place: byRole('m2')},
  {file: 'hiecm/patient-share.yaml', place: byRole('m2')},
  {file: 'hiecm/consent-management-data-flow.yaml', place: (tag, path) => (tag.endsWith('-phr') ? phrPlace(tag, path) : tag.endsWith('-hiu') ? 'm3' : 'm2')},
  {file: 'hiecm/subscription.yaml', place: (tag, path) => (tag === 'subscription-phr' || LOCKER.test(path) ? phrPlace(tag, path) : 'subscription')},
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

const sha = (p) => 'sha256:' + createHash('sha256').update(readFileSync(p)).digest('hex');
const slug = (s) => s.toLowerCase().replace(/\{([^}]+)\}/g, '$1').replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
const log = [];
const note = (module, op, what) => log.push(`| ${module} | \`${op}\` | ${what} |`);

const specs = Object.fromEntries(Object.entries(MODULES).map(([id, m]) => [id, {
  openapi: '3.1.1',
  info: {
    'x-portal': {module: id, label: m.label, position: m.position, icon: m.icon},
    title: m.title, summary: m.summary, version: 'abdm-v3',
    license: {name: 'MIT', identifier: 'MIT'},
    contact: {name: 'ABDM sandbox support', url: 'https://sandboxsupport.abdm.gov.in/'},
    'x-abdm-gateway': 'hiecm', 'x-abdm-module': id === 'gateway' ? 'gateway' : id.toUpperCase(), 'x-abdm-phase': 1, 'x-abdm-roles': m.roles,
  },
  'x-abdm-sources': [],
  servers: m.servers,
  security: id === 'gateway' ? [] : [{bearerAuth: []}],
  tags: [], paths: {}, webhooks: {},
  components: {securitySchemes: {bearerAuth: {type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'The access token from POST /api/hiecm/gateway/v3/sessions.'}}},
}]));

const seenPath = new Map();   // "METHOD path" -> module that first declared it
const ids = new Set();
// module -> [{tag, op}] in the exact order operations were encountered in NHA's
// files, paths and webhooks interleaved. --journeys scaffolding reads this.
const order = Object.fromEntries(Object.keys(MODULES).map((id) => [id, []]));
const normHeader = (name) => M1_HEADERS[name.toLowerCase()] ?? name;

for (const {file, place} of FILES) {
  const full = join(RAW, file);
  const doc = file.endsWith('.json') ? JSON.parse(readFileSync(full, 'utf8')) : parse(readFileSync(full, 'utf8'));
  if (file.startsWith('M4/')) dedupeM4Components(doc, file);
  const touched = new Set();
  for (const [path, item] of Object.entries(doc.paths ?? {})) {
    for (const method of METHODS) {
      const op = item?.[method];
      if (!op) continue;
      const tag = (op.tags ?? ['untagged'])[0];
      const module = place(tag, path);
      const key = `${method.toUpperCase()} ${path.replace(/^\/(abha\/api|api\/hiecm)/, '').replace(/\{[^}]+\}/g, '{}')}`;
      if (seenPath.has(key)) { const first = seenPath.get(key); note(first.module, key, `dropped from ${file}: already declared by ${first.file} in the ${first.module} module`); continue; }
      if (!module || !MODULES[module]) throw new Error(`${file}: ${method.toUpperCase()} ${path} has tag "${tag}", which no module takes`);
      seenPath.set(key, {file, module});
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
    specs[module]['x-abdm-sources'].push({file: `catalogue/openapi/.raw/nha-2026-09-16/${file}`, role: 'upstream', hash: sha(full), fetched: '2026-09-16'});
  }
}

// 8. The M1 info.description is not published (wrong cipher, wrong certificate path, third-party tool).
specs.m1.info.description = 'Encrypt Aadhaar numbers, mobile numbers, OTP values and passwords under the certificate from GET /abha/api/v3/profile/public/certificate. See /docs/hiecm/v3/concepts/encryption.';
note('m1', 'info', 'description replaced: NHA\'s text names RSA/ECB/PKCS1Padding, /v3/auth/cert and a third-party encryption site; the original is in the raw file');
specs.m1['x-abdm-sources'].push({file: 'catalogue/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Collection.json', role: 'upstream', hash: sha(join(RAW, 'abha/M1 ABHA Collection.json')), fetched: '2026-09-15', note: 'Used for the order of M1 calls only. See journeys/m1.yaml.'});

for (const [id, m] of Object.entries(MODULES)) {
  const count = Object.values(specs[id].paths).reduce((n, i) => n + METHODS.filter((x) => i[x]).length, 0) + Object.values(specs[id].webhooks).reduce((n, i) => n + METHODS.filter((x) => i[x]).length, 0);
  if (count !== m.expected) throw new Error(`${id}: ${count} operations, expected ${m.expected}`);
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
