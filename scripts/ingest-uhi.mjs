// Generates the UHI specifications from NHA's set of 28 September 2026.
//
//   node scripts/ingest-uhi.mjs          write the three specs and the correction log
//   node scripts/ingest-uhi.mjs --check  fail if the committed specs differ
//
// NHA sent the Gateway spec v2.0.2 twice: grouped by role (the contract) and
// grouped by service (which example belongs to which service). The contract
// comes from the first, the examples from the second. Every edit either file
// needed is one row in the correction log; the raw files are never touched.
import {readFileSync, writeFileSync, existsSync, mkdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {parse, Document, visit} from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SET = 'nha-2026-09-28-uhi';
const RAW = join(root, 'catalogue', 'openapi', '.raw', SET);
const OUT = join(root, 'catalogue', 'openapi', 'uhi', 'v1');
const LOG = join(root, 'catalogue', 'openapi', 'corrections', '2026-09-28-uhi-ingest.md');
const ROLE_FILE = 'gateway/UHI Documentation Requirements.yaml';
const SERVICE_FILE = 'gateway/UHI Gateway Service.yaml';
const check = process.argv.includes('--check');

const byRole = parse(readFileSync(join(RAW, ROLE_FILE), 'utf8'));
const byService = parse(readFileSync(join(RAW, SERVICE_FILE), 'utf8'));
if (JSON.stringify(byRole).includes('"nullable"')) throw new Error('nullable appears in the role-grouped spec: convert it to a type array before ingesting');

const log = [];
const note = (module, op, what) => log.push(`| ${module} | \`${op}\` | ${what} |`);

// ---- the three modules and their operations ------------------------------
//
// `path` is the key in our spec, `actual` the real endpoint, `role` the key in
// NHA's role-grouped file, `host` who serves the call, `answer` the callback
// that answers it.
const MODULES = {
  network: {label: 'Network and discovery', position: 1, title: 'UHI network and discovery', summary: 'The Gateway search, the discovery pair every service answers, and the network registry lookup.'},
  consultation: {label: 'Physical Consultation', position: 2, title: 'UHI Physical Consultation', summary: 'Book, fulfil and cancel a physical consultation, directly between EUA and HSPA after discovery.', tag: 'Consultation (Tele + Physical)'},
  ambulance: {label: 'Ambulance Booking', position: 3, title: 'UHI Ambulance Booking', summary: 'Send a patient\'s details to the chosen ambulance provider and get a quote and terms back.', tag: 'Ambulance'},
};
const op = (module, name, path, host, extra = {}) => ({module, name, id: `uhi_${module}_${name}`, path, actual: extra.actual ?? path, role: extra.role ?? path, host, answer: extra.answer});
const OPS = [
  op('network', 'gateway_search', '/api/v1/uhi/search', 'gateway', {answer: 'uhi_network_gateway_on_search'}),
  op('network', 'gateway_on_search', '/api/v1/uhi/on_search', 'gateway'),
  op('network', 'search', '/search', 'hspa', {answer: 'uhi_network_on_search'}),
  op('network', 'on_search', '/on_search', 'eua'),
  op('network', 'registry_lookup', '/api/v1/networkregistry/lookup', 'gateway'),
  ...['select', 'init', 'confirm', 'status', 'cancel'].flatMap((n) => [
    op('consultation', n, `/${n}`, 'hspa', {answer: `uhi_consultation_on_${n}`}),
    op('consultation', `on_${n}`, `/on_${n}`, 'eua'),
  ]),
  op('consultation', 'on_update_to_eua', '/on_update#to-eua', 'eua', {actual: '/on_update', role: '/on_update(EUA)'}),
  op('consultation', 'on_update_to_hspa', '/on_update#to-hspa', 'hspa', {actual: '/on_update', role: '/on_update(HSPA)'}),
  op('consultation', 'on_message_to_eua', '/on_message#to-eua', 'eua', {actual: '/on_message', role: '/on_message(EUA)'}),
  op('consultation', 'on_message_to_hspa', '/on_message#to-hspa', 'hspa', {actual: '/on_message', role: '/on_message(HSPA)'}),
  ...['confirm', 'status', 'update', 'cancel'].map((n) => op('consultation', `on_${n}_audit`, `/api/v1/uhi/on_${n}_audit`, 'gateway')),
  op('ambulance', 'init', '/init', 'hspa', {answer: 'uhi_ambulance_on_init'}),
  op('ambulance', 'on_init', '/on_init', 'eua'),
];
const TRIGGER = Object.fromEntries(OPS.filter((o) => o.answer).map((o) => [o.answer, o.id]));

// NHA's summaries name only the path and its direction ("/on_init (HSPA →
// EUA)"), which the title rules cannot turn into a name. Each title is taken
// from the guide's call tables (Part 3) and NHA's own operation descriptions.
const TITLES = {
  uhi_network_gateway_search: 'Search through the Gateway',
  uhi_network_gateway_on_search: 'Send a catalog through the Gateway',
  uhi_network_search: 'Search an HSPA',
  uhi_network_on_search: 'Send a catalog to the EUA',
  uhi_network_registry_lookup: 'Look up a network participant',
  uhi_consultation_select: 'Select items and build an order',
  uhi_consultation_on_select: 'Send a quoted draft order',
  uhi_consultation_init: 'Initialise an order',
  uhi_consultation_on_init: 'Send the order with its quote and terms',
  uhi_consultation_confirm: 'Confirm the order',
  uhi_consultation_on_confirm: 'Send the confirmed order and PIN',
  uhi_consultation_status: 'Request the order status',
  uhi_consultation_on_status: 'Send the order status',
  uhi_consultation_cancel: 'Cancel the order',
  uhi_consultation_on_cancel: 'Send the cancelled order',
  uhi_consultation_on_update_to_eua: 'Send an order update to the EUA',
  uhi_consultation_on_update_to_hspa: 'Send an order update to the HSPA',
  uhi_consultation_on_message_to_eua: 'Send a message to the EUA',
  uhi_consultation_on_message_to_hspa: 'Send a message to the HSPA',
  uhi_consultation_on_confirm_audit: 'Copy on_confirm to the Gateway audit',
  uhi_consultation_on_status_audit: 'Copy on_status to the Gateway audit',
  uhi_consultation_on_update_audit: 'Copy on_update to the Gateway audit',
  uhi_consultation_on_cancel_audit: 'Copy on_cancel to the Gateway audit',
  uhi_ambulance_init: 'Send the patient\'s details for a quote',
  uhi_ambulance_on_init: 'Send the quote and terms',
};

// NHA's service-grouped keys: `/search(NOTTO)`, `/on_update(Consultation-EUA)`.
const SERVICES = {Consultation: 'consultation', 'PMJAY-HEM': 'pmjay-hem', BloodBank: 'blood-bank', Ambulance: 'ambulance', JanAushadhi: 'jan-aushadhi', NOTTO: 'notto'};
const DISCOVERY = new Set(['/api/v1/uhi/search', '/api/v1/uhi/on_search', '/search', '/on_search']);
const place = (key) => {
  if (key === '/api/v1/networkregistry/lookup') return {service: 'registry', target: 'uhi_network_registry_lookup'};
  const m = key.match(/^([^()]+)\(([A-Za-z]+(?:-HEM)?)(?:-(EUA|HSPA))?\)$/);
  if (!m || !SERVICES[m[2]]) throw new Error(`cannot place ${key}`);
  const [, path, svc, to] = m;
  const service = SERVICES[svc];
  const name = path.replace(/^\/(api\/v1\/uhi\/)?/, '');
  if (DISCOVERY.has(path)) return {service, target: path.startsWith('/api/') ? `uhi_network_gateway_${name}` : `uhi_network_${name}`};
  if (service === 'ambulance') return {service, target: `uhi_ambulance_${name}`};
  if (service === 'consultation') return {service, target: `uhi_consultation_${name}${to ? `_to_${to.toLowerCase()}` : ''}`};
  throw new Error(`cannot place ${key}`);
};

// ---- examples, per operation, in NHA's order -------------------------------
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60).replace(/-+$/, '');
const TELE_TITLE = /\(Tele ?consultation\)/i;
const fulfilmentTypes = (value, out = new Set()) => {
  if (Array.isArray(value)) value.forEach((v) => fulfilmentTypes(v, out));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) {
    if ((k === 'fulfillment' || k === 'fulfillments') && v) [v].flat().forEach((f) => typeof f?.type === 'string' && out.add(f.type));
    fulfilmentTypes(v, out);
  }
  return out;
};
const moduleOf = (id) => OPS.find((o) => o.id === id).module;
const examplesFor = new Map(OPS.map((o) => [o.id, {}]));
const vendor = new Map(); // operationId -> the service-grouped operation first seen, for its summary
const dropped = new Map();
for (const [key, item] of Object.entries(byService.paths)) {
  const {service, target} = place(key);
  const theirs = item.post;
  if (!vendor.has(target)) vendor.set(target, theirs);
  for (const [title, example] of Object.entries(theirs.requestBody?.content?.['application/json']?.examples ?? {})) {
    if (TELE_TITLE.test(title)) { dropped.set(target, (dropped.get(target) ?? 0) + 1); continue; }
    const types = fulfilmentTypes(example.value);
    let summary = title;
    if (types.has('Online')) {
      summary = `Teleconsultation example, send Physical: ${title}`;
      note(moduleOf(target), target, `example "${title}" carries fulfillment type Online; kept because the spec has no physical example of it, and its summary says so`);
    }
    if (/Physical/i.test(title) && types.has('Online') && !types.has('Physical')) note(moduleOf(target), target, `example "${title}" is titled physical but its body says Online; left as NHA gave it`);
    const bucket = examplesFor.get(target);
    const prefix = service === 'registry' ? 'network' : service;
    let name = `${prefix}-${slug(title)}`;
    for (let n = 2; bucket[name]; n++) name = `${prefix}-${slug(title)}-${n}`;
    bucket[name] = {summary, value: example.value};
  }
}
for (const [target, n] of dropped) note(moduleOf(target), target, `${n} example(s) titled Teleconsultation left out: the portal documents Physical Consultation only`);

// ---- components each module references -------------------------------------
const refsIn = (node, out = new Set()) => {
  if (Array.isArray(node)) node.forEach((n) => refsIn(n, out));
  else if (node && typeof node === 'object') for (const [k, v] of Object.entries(node)) {
    if (k === '$ref' && typeof v === 'string') { const m = v.match(/^#\/components\/schemas\/([^/]+)/); if (m) out.add(m[1]); }
    else refsIn(v, out);
  }
  return out;
};
const schemasFor = (paths) => {
  const all = byRole.components.schemas;
  const want = refsIn(paths);
  for (const queue = [...want]; queue.length;) for (const name of refsIn(all[queue.pop()])) if (!want.has(name)) { want.add(name); queue.push(name); }
  return Object.fromEntries(Object.keys(all).filter((n) => want.has(n)).map((n) => [n, all[n]]));
};

// ---- servers -----------------------------------------------------------------
const ORDER = ['https://uhigatewaysandbox.abdm.gov.in', 'https://uhigateway.abdm.gov.in', 'https://uhigatewaybeta.abdm.gov.in'];
const DESCRIBE = {
  'https://uhigatewaysandbox.abdm.gov.in': 'Sandbox',
  'https://uhigateway.abdm.gov.in': 'Production',
  'https://uhigatewaybeta.abdm.gov.in': 'Beta. Use it only when NHA asks you to.',
};
const gatewayServers = byRole.servers.map((s) => s.url).sort((a, b) => ORDER.indexOf(a) - ORDER.indexOf(b)).map((url) => ({url, description: DESCRIBE[url]}));
const PARTICIPANT = {
  hspa: [{url: 'https://{provider_uri}', description: 'The HSPA\'s provider_uri, taken from context.provider_uri in its on_search.', variables: {provider_uri: {default: 'provider_uri'}}}],
  eua: [{url: 'https://{consumer_uri}', description: 'The EUA\'s consumer_uri, taken from context.consumer_uri in the request.', variables: {consumer_uri: {default: 'consumer_uri'}}}],
};

// ---- sources -----------------------------------------------------------------
const sha = (file) => createHash('sha256').update(readFileSync(join(RAW, file))).digest('hex');
const SOURCES = [ROLE_FILE, SERVICE_FILE].map((file) => ({file: `catalogue/openapi/.raw/${SET}/${file}`, role: 'upstream', hash: `sha256:${sha(file)}`, fetched: '2026-09-28'}));

// ---- build -------------------------------------------------------------------
const SIGN = 'Sign this request first: [Signing](/docs/uhi/v1/network/signing).';
const RETRY = 'Retry behaviour: not yet published.';
const isCallback = (o) => /^on_/.test(o.name);
const clone = (v) => JSON.parse(JSON.stringify(v));
const specs = {};
for (const [module, meta] of Object.entries(MODULES)) {
  const paths = {};
  const tags = new Set();
  for (const o of OPS.filter((x) => x.module === module)) {
    const theirs = byRole.paths[o.role]?.post;
    if (!theirs) throw new Error(`${o.role} is not in ${ROLE_FILE}`);
    const vend = vendor.get(o.id);
    if (!vend) throw new Error(`${o.id} has no entry in ${SERVICE_FILE}`);
    const {operationId: nhaId, summary: _s, description: _d, tags: theirTags, ...rest} = clone(theirs);
    if (nhaId) note(module, o.id, `operationId was \`${nhaId}\`; kept in x-abdm-nha-operation-id`);
    const body = rest.requestBody?.content?.['application/json'];
    if (body) body.examples = examplesFor.get(o.id);
    // The guide signs every outbound call; NHA declares the header on every
    // operation but select and on_select, so those two get the same one.
    if (!(rest.parameters ?? []).some((p) => p.in === 'header' && p.name === 'Authorization')) {
      rest.parameters = [...(rest.parameters ?? []), {schema: {type: 'string'}, in: 'header', name: 'Authorization', description: 'UHI Auth header', required: true}];
      note(module, o.id, 'Authorization header parameter added, as NHA declares it on every other operation and the guide signs every call');
    }
    const summary = vend.summary;
    const said = (theirs.description ?? '').trim() || (vend.description ?? '').trim() || summary.split(': ').slice(1).join(': ');
    (theirTags ?? []).forEach((t) => tags.add(t));
    const out = {
      tags: theirTags,
      summary,
      operationId: o.id,
      description: [SIGN, said, isCallback(o) ? RETRY : ''].filter(Boolean).join('\n\n'),
      ...(o.host === 'gateway' ? {} : {servers: PARTICIPANT[o.host]}),
      ...rest,
      ...(o.path !== o.actual ? {'x-actual-path': o.actual} : {}),
      'x-abdm-title': TITLES[o.id],
      'x-abdm-hosted-by': o.host,
      ...(o.answer ? {'x-abdm-answered-by': o.answer} : {}),
      ...(TRIGGER[o.id] ? {'x-abdm-triggered-by': TRIGGER[o.id]} : {}),
      ...(nhaId ? {'x-abdm-nha-operation-id': nhaId} : {}),
    };
    if (o.path !== o.role) note(module, o.id, `path \`${o.role}\` becomes \`${o.path}\`, with the real endpoint \`${o.actual}\` in x-actual-path`);
    note(module, o.id, `summary from ${SERVICE_FILE}; description opens with the signing link${isCallback(o) ? ' and closes with the retry line' : ''}`);
    paths[o.path] = {post: out};
  }
  const infoDescription = module === 'network' ? byRole.info.description : byService.tags.find((t) => t.name === meta.tag)?.description;
  specs[module] = {
    openapi: '3.1.1',
    info: {
      'x-portal': {module, label: meta.label, position: meta.position},
      title: meta.title,
      summary: meta.summary,
      description: infoDescription,
      version: byRole.info.version,
      contact: byRole.info.contact,
      'x-abdm-gateway': 'uhi',
      'x-abdm-module': module,
      'x-abdm-phase': 1,
      'x-abdm-roles': ['eua', 'hspa'],
    },
    'x-abdm-sources': SOURCES,
    servers: gatewayServers,
    tags: [...tags].map((name) => ({name})),
    paths,
    components: {schemas: schemasFor(paths)},
  };
}
note('all', 'info', 'termsOfService `termsOfServiceUrl` and license `https://licenseUrl.com` are NHA\'s placeholders and are left out');
note('all', 'servers', 'the sandbox server is listed first and the beta server last, described as used only when NHA asks; participant calls name the HSPA\'s provider_uri or the EUA\'s consumer_uri');
note('all', 'openapi', '3.0.3 becomes 3.1.1; the role-grouped file carries no nullable, so no schema changes');

// ---- write -------------------------------------------------------------------
const DATEISH = /^\d{4}-\d{1,2}-\d{1,2}([Tt ].*)?$|^\d{1,2}-\d{1,2}-\d{4}$/;
const emit = (spec) => {
  const doc = new Document(spec);
  visit(doc, {Scalar(_, node) { if (typeof node.value === 'string' && DATEISH.test(node.value)) node.type = 'QUOTE_DOUBLE'; }});
  return doc.toString({lineWidth: 0});
};
note('all', 'dates', 'date and timestamp strings are quoted so a YAML 1.1 reader keeps them as strings');
const outputs = Object.entries(specs).map(([m, spec]) => [join(OUT, `uhi-${m}.yaml`), emit(spec)]);
outputs.push([LOG, ['# 2026-09-28: the UHI set, ingested', '', `Written by \`scripts/ingest-uhi.mjs\` from \`${ROLE_FILE}\` (the contract) and \`${SERVICE_FILE}\` (which example belongs to which service). Every line is one edit the script made; nothing else was changed. Rerun the script to regenerate the specs and this log.`, '', '| Module | Operation | Edit |', '| --- | --- | --- |', ...log, ''].join('\n')]);
let drift = 0;
mkdirSync(OUT, {recursive: true});
for (const [path, text] of outputs) {
  if (check) { if (!existsSync(path) || readFileSync(path, 'utf8') !== text) { console.error(`out of date: ${path}`); drift++; } }
  else writeFileSync(path, text);
}
if (check && drift) process.exit(1);
console.log(check ? 'UHI specs match the raw set' : `wrote ${outputs.length - 1} UHI specs and the correction log`);
