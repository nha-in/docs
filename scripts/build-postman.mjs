// One Postman collection per HIE-CM module and one per UHI service, each
// gateway with the sandbox environment its collections share, written to
// site/static/postman. A build output: edit the specs or the
// journeys, never the collections.
//
// It reads the per-call data build-api-reference.mjs writes rather than the
// specs, so a collection carries the same host, headers and body as the page
// it came from and the two cannot disagree. Run it after that script.
//
// Each collection opens with the journeys in the order the journey files give,
// one folder each, then every other call the module makes. Callbacks are left
// out: ABDM sends those to the integrator, so there is nothing to send from
// Postman. The only script is a collection-level one that fetches a gateway
// session token when there is none or it has expired.
import {existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import esbuild from 'esbuild';
import {loadJourneys, stepDataName} from './lib/journeys.mjs';

const root = join(import.meta.dirname, '..');
const dataDir = join(root, 'site', 'src', 'data', 'api');
const outDir = join(root, 'site', 'static', 'postman');
const manifestFile = join(root, 'site', 'src', 'data', 'postman.json');
// Collection ids in NHA's public Postman workspace, written back by hand after
// the first publish-postman.mjs run. Empty until then.
const published = JSON.parse(readFileSync(join(root, 'catalogue', 'hiecm', 'postman.json'), 'utf8'));

const SCHEMA = 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json';

// Every sandbox host a HIE-CM call is served from, as the variable that stands
// for it. A host missing here fails the build rather than shipping a collection
// with a hard-coded URL nobody can repoint.
const HOSTS = {
  'https://dev.abdm.gov.in': 'gatewayUrl',
  'https://abhasbx.abdm.gov.in': 'abhaUrl',
  'https://apihspsbx.abdm.gov.in/v4/int': 'hprUrl',
  '{bridgeUrl}': 'bridgeUrl',
};

// Headers whose value is the same on every call, or comes from the
// environment. Anything else keeps the example the page shows.
const HEADERS = {
  authorization: 'Bearer {{accessToken}}',
  'request-id': '{{$guid}}',
  timestamp: '{{$isoTimestamp}}',
  'x-cm-id': '{{cmId}}',
  'x-hip-id': '{{hipId}}',
  'x-hiu-id': '{{hiuId}}',
};

const read = (name) => JSON.parse(readFileSync(join(dataDir, `${name}.json`), 'utf8'));

const calls = readdirSync(dataDir)
  .filter((name) => name.endsWith('.json') && !name.includes('--'))
  .sort()
  .map((name) => JSON.parse(readFileSync(join(dataDir, name), 'utf8')))
  .filter((op) => op.gateway === 'hiecm' && op.moduleId && op.kind === 'operation');

const session = calls.find((op) => op.moduleId === 'gateway' && op.path.endsWith('/sessions'));
if (!session) throw new Error('build-postman: no gateway sessions call, so no token script can be written');

function variableFor(server) {
  const name = HOSTS[server];
  if (!name) throw new Error(`build-postman: ${server} has no variable. Add it to HOSTS.`);
  return `{{${name}}}`;
}

function requestFor(op) {
  const declared = new Set(op.headers.map((h) => h.name.toLowerCase()));
  const bearer = (op.security ?? []).some((s) => s.type === 'http' && s.scheme === 'bearer');
  const headers = [...(bearer && !declared.has('authorization') ? [{name: 'Authorization'}] : []), ...op.headers]
    .filter((h) => h.name.toLowerCase() !== 'content-type')
    .map((h) => ({
      key: h.name,
      value: HEADERS[h.name.toLowerCase()] ?? String(h.example ?? `<${h.name.toUpperCase().replace(/-/g, '_')}>`),
      ...(h.required === false && {disabled: true}),
    }));
  const hasBody = op.requestExample !== undefined && op.method !== 'GET';
  if (hasBody) headers.push({key: 'Content-Type', value: 'application/json'});

  const path = op.path.replace(/\{([^}]+)\}/g, ':$1');
  const query = (op.queryParams ?? []).map((p) => ({
    key: p.name,
    value: String(p.example ?? ''),
    ...(!p.required && {disabled: true}),
  }));
  const on = query.filter((q) => !q.disabled);
  const host = variableFor(op.server);
  return {
    method: op.method,
    header: headers,
    url: {
      raw: `${host}${path}${on.length ? `?${on.map((q) => `${q.key}=${q.value}`).join('&')}` : ''}`,
      host: [host],
      path: path.split('/').filter(Boolean),
      ...(query.length && {query}),
      ...(op.pathParams?.length && {variable: op.pathParams.map((p) => ({key: p.name, value: ''}))}),
    },
    ...(hasBody && {body: {mode: 'raw', raw: JSON.stringify(op.requestExample, null, 2), options: {raw: {language: 'json'}}}}),
  };
}

const item = (name, op) => ({name, request: {...requestFor(op), description: op.description ?? ''}});

// The sessions call itself is skipped, or it would fetch a token for itself.
// Both scripts sit inside a function so an early return never depends on how
// a client wraps a script.
const tokenScript = `// Gets a gateway session token when there is none or it has expired.
(function () {
if (pm.request.url.getPath().endsWith('${session.path}')) return;
const expiry = Number(pm.environment.get('accessTokenExpiry') || 0);
if (pm.environment.get('accessToken') && Date.now() < expiry) return;
pm.sendRequest({
  url: pm.variables.replaceIn('{{gatewayUrl}}${session.path}'),
  method: 'POST',
  header: {
    'Content-Type': 'application/json',
    'REQUEST-ID': pm.variables.replaceIn('{{$guid}}'),
    'TIMESTAMP': new Date().toISOString(),
    'X-CM-ID': pm.variables.replaceIn('{{cmId}}'),
  },
  body: {
    mode: 'raw',
    raw: JSON.stringify({
      clientId: pm.variables.get('clientId'),
      clientSecret: pm.variables.get('clientSecret'),
      grantType: 'client_credentials',
    }),
  },
}, (error, response) => {
  if (error || response.code >= 300) {
    console.error('Session token request failed', error || response.text());
    return;
  }
  const {accessToken, expiresIn} = response.json();
  pm.environment.set('accessToken', accessToken);
  // A minute early, so a token never expires between this check and the call.
  pm.environment.set('accessTokenExpiry', Date.now() + (expiresIn - 60) * 1000);
});
})();`;

// The values a response hands to the calls after it, by the same rule the
// site's Try It panel uses: carry.ts, embedded here as its own source.
const carryTs = readFileSync(join(root, 'site', 'src', 'components', 'api', 'carry.ts'), 'utf8');
const {code: carryJs} = await esbuild.transform(carryTs, {loader: 'ts', format: 'esm'});
const {carriedValues} = await import(`data:text/javascript,${encodeURIComponent(carryJs)}`);
const CARRIED = ['txnId', 'searchTxnId', 'X-token', 'jwtToken', 'R-jwtToken'];
const carryScript = `// Keeps what this response hands to the calls after it, such as the txnId an
// OTP request returns and the X-token a login returns, as collection variables.
(function () {
let body;
try { body = pm.response.json(); } catch (error) { return; }
${carriedValues.toString()}
const values = carriedValues(body);
Object.keys(values).forEach(function (key) { pm.collectionVariables.set(key, values[key]); });
})();`;

const DESCRIPTION = [
  'Generated from the ABDM HIE-CM specifications. Import hiecm-sandbox.postman_environment.json beside it and fill in clientId and clientSecret: the collection fetches a gateway session token before a call when it needs one.',
  '',
  'Folders follow the order a journey is built in. Send the steps in order: each response keeps the txnId and the X-token it returns as collection variables, and the steps after it read them. Callbacks are not included: ABDM sends those to your bridge URL, so receiving them needs a public endpoint, not Postman.',
  '',
  'Values ABDM expects encrypted, such as an Aadhaar number or an OTP, are shown as the specification gives them. Encrypt your own values before sending.',
].join('\n');

rmSync(outDir, {recursive: true, force: true});
mkdirSync(outDir, {recursive: true});

const journeys = loadJourneys();
const modules = [...new Set(calls.map((op) => op.moduleId))].sort();
const manifest = {
  environment: 'hiecm-sandbox.postman_environment.json',
  ...(published.workspace && {workspace: published.workspace}),
  modules: {},
};
const used = new Set();

for (const module of modules) {
  const own = calls.filter((op) => op.moduleId === module);
  const folders = [];
  const named = new Set();
  for (const journey of journeys.get(module) ?? []) {
    // A callbacks journey lists what ABDM sends the integrator. Some of those
    // sit under a specification's paths rather than its webhooks, so kind
    // alone does not catch them.
    const receives = journey.id.endsWith('-callbacks');
    const items = [];
    journey.steps.forEach((step, i) => {
      named.add(step.op);
      if (receives) return;
      const name = stepDataName(step.op, journey.id, i);
      if (!existsSync(join(dataDir, `${name}.json`))) return;
      const op = read(name);
      if (op.kind !== 'operation') return;
      items.push(item(`${i + 1}. ${op.title}`, op));
      used.add(op.server);
    });
    if (items.length) folders.push({name: journey.title, item: items});
  }
  const rest = own.filter((op) => !named.has(op.id));
  if (rest.length) {
    folders.push({name: folders.length ? 'Other calls' : 'Calls', item: rest.map((op) => item(op.title, op))});
    rest.forEach((op) => used.add(op.server));
  }
  if (!folders.length) continue;

  const label = own[0]?.module ?? module;
  const file = `hiecm-${module}.postman_collection.json`;
  const collection = {
    info: {name: `ABDM HIE-CM ${label}`, description: DESCRIPTION, schema: SCHEMA},
    event: [
      {listen: 'prerequest', script: {type: 'text/javascript', exec: tokenScript.split('\n')}},
      {listen: 'test', script: {type: 'text/javascript', exec: carryScript.split('\n')}},
    ],
    // Declared empty so a reader can see what the script will fill in.
    variable: CARRIED.map((key) => ({key, value: ''})),
    item: folders,
  };
  writeFileSync(join(outDir, file), `${JSON.stringify(collection, null, 2)}\n`);
  manifest.modules[module] = {
    file,
    label,
    requests: folders.reduce((n, f) => n + f.item.length, 0),
    ...(published.collections?.[module] && {uid: published.collections[module]}),
  };
}

// Secrets stay blank: the environment ships the sandbox hosts and nothing a
// reader would have to keep private.
const environment = {
  name: 'ABDM HIE-CM sandbox',
  values: [
    ...Object.entries(HOSTS)
      .filter(([server]) => used.has(server))
      .map(([server, key]) => ({key, value: server.startsWith('{') ? '' : server, enabled: true})),
    {key: 'cmId', value: 'sbx', enabled: true},
    {key: 'clientId', value: '', enabled: true},
    {key: 'clientSecret', value: '', type: 'secret', enabled: true},
    {key: 'hipId', value: '', enabled: true},
    {key: 'hiuId', value: '', enabled: true},
    {key: 'accessToken', value: '', type: 'secret', enabled: true},
    {key: 'accessTokenExpiry', value: '', enabled: true},
  ],
  _postman_variable_scope: 'environment',
};
writeFileSync(join(outDir, manifest.environment), `${JSON.stringify(environment, null, 2)}\n`);

// ---------------------------------------------------------------------------
// UHI: one collection per service, and one sandbox environment they share.
//
// UHI is peer to peer, so a collection carries every call in the journey, the
// ones a provider system sends included: an HSPA tests its on_search and
// on_init by sending them. Physical Consultation's select and on_select are in
// the specification but not in a journey, and are not implemented, so no
// collection sends them. Every collection ends with the registry lookup,
// which every service needs to check a signature.
//
// Every UHI call is signed with the sender's Ed25519 key over the exact body.
// Postman holds no such key, so the collection sends the Authorization header
// the integrator generates for the body shown, with the Header Generation
// Utility, and refuses to send one whose expires has passed.
const UHI_HOSTS = {
  'https://uhigatewaysandbox.abdm.gov.in': 'gatewayUrl',
  'https://<consumer_uri>': 'consumerUri',
  'https://<provider_uri>': 'providerUri',
};
const UHI_SERVICES = [
  {id: 'consultation', label: 'Physical Consultation', journeys: (all) => all.get('consultation') ?? []},
  {id: 'ambulance', label: 'Ambulance Booking', journeys: (all) => all.get('ambulance') ?? []},
  {id: 'pmjay-hem', label: 'PM-JAY HEM hospital discovery', journeys: (all) => (all.get('network') ?? []).filter((j) => j.id === 'uhi-pmjay-hem')},
  {id: 'blood-bank', label: 'Blood Bank discovery', journeys: (all) => (all.get('network') ?? []).filter((j) => j.id === 'uhi-blood-bank')},
  {id: 'jan-aushadhi', label: 'Jan Aushadhi', journeys: (all) => (all.get('network') ?? []).filter((j) => j.id.startsWith('uhi-jan-aushadhi-'))},
  {id: 'notto', label: 'NOTTO hospital discovery', journeys: (all) => (all.get('network') ?? []).filter((j) => j.id === 'uhi-notto')},
];

function uhiRequest(op) {
  const host = UHI_HOSTS[op.server];
  if (!host) throw new Error(`build-postman: UHI host ${op.server} has no variable. Add it to UHI_HOSTS.`);
  const path = op.path.split('#')[0];
  return {
    method: op.method,
    header: [
      {key: 'Authorization', value: '{{authorization}}'},
      {key: 'Content-Type', value: 'application/json'},
    ],
    url: {raw: `{{${host}}}${path}`, host: [`{{${host}}}`], path: path.split('/').filter(Boolean)},
    // Compact, so the bytes Postman sends are the bytes you paste into the
    // Header Generation Utility.
    body: {mode: 'raw', raw: JSON.stringify(op.requestExample), options: {raw: {language: 'json'}}},
    description: op.description ?? '',
  };
}

const uhiScript = `// Refuses to send a UHI request whose Authorization header is missing or has
// expired. A header is signed over one body and lasts a few seconds, so sign
// the body shown again, with the Header Generation Utility, before each send.
(function () {
const pasted = pm.variables.get('authorization');
if (!pasted) throw new Error('Paste the Authorization header you generated for this exact body into the authorization variable.');
let header;
try { header = JSON.parse(pasted); } catch (error) { return; }
const expires = Number(header.expires || 0);
if (expires && expires * 1000 < Date.now()) {
  throw new Error('The Authorization header expired at ' + new Date(expires * 1000).toISOString() + '. Sign this body again and paste the new header.');
}
})();`;

const UHI_DESCRIPTION = [
  'Generated from the UHI Gateway specification v2.0.2 and its journeys. Import uhi-sandbox.postman_environment.json beside it.',
  '',
  'Every UHI call is signed. Generate your key pair and a header for each body with the Header Generation Utility, https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility. Sign the body exactly as shown, paste the header into the authorization variable, and send. Change one byte of the body and the header no longer matches it.',
  '',
  'A call answers only with an ACK. The results arrive later at your consumer_uri, so set consumerUri to a public HTTPS endpoint you can watch. From init onwards, calls go straight to the other side, at providerUri or consumerUri.',
  '',
  'Folders follow the order a journey is built in. Signing: https://docs.abdm.gov.in/docs/uhi/v1/concepts/signing',
].join('\n');

const uhiJourneys = loadJourneys({platform: 'uhi', version: 'v1'});
const uhiLookup = read('uhi-network-registry-lookup');
manifest.uhi = {environment: 'uhi-sandbox.postman_environment.json', services: {}};
for (const service of UHI_SERVICES) {
  const folders = service.journeys(uhiJourneys).map((journey) => ({
    name: journey.title,
    item: journey.steps.map((step, i) => {
      const op = read(stepDataName(step.op, journey.id, i));
      return {name: `${i + 1}. ${op.title}`, request: uhiRequest(op)};
    }),
  }));
  if (!folders.length) throw new Error(`build-postman: UHI ${service.id} has no journey`);
  folders.push({name: 'Look up a signing key', item: [{name: uhiLookup.title, request: uhiRequest(uhiLookup)}]});
  const file = `uhi-${service.id}.postman_collection.json`;
  const collection = {
    info: {name: `UHI ${service.label}`, description: UHI_DESCRIPTION, schema: SCHEMA},
    event: [{listen: 'prerequest', script: {type: 'text/javascript', exec: uhiScript.split('\n')}}],
    item: folders,
  };
  writeFileSync(join(outDir, file), `${JSON.stringify(collection, null, 2)}\n`);
  manifest.uhi.services[service.id] = {file, label: service.label, requests: folders.reduce((n, f) => n + f.item.length, 0)};
}
writeFileSync(
  join(outDir, manifest.uhi.environment),
  `${JSON.stringify(
    {
      name: 'UHI sandbox',
      values: [
        ...Object.entries(UHI_HOSTS).map(([server, key]) => ({key, value: server.includes('<') ? '' : server, enabled: true})),
        {key: 'authorization', value: '', type: 'secret', enabled: true},
      ],
      _postman_variable_scope: 'environment',
    },
    null,
    2,
  )}\n`,
);

writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(
  `Built ${Object.keys(manifest.modules).length} Postman collection(s) to site/static/postman: ` +
    Object.entries(manifest.modules).map(([m, v]) => `${m} (${v.requests})`).join(', '),
);
console.log(
  `Built ${Object.keys(manifest.uhi.services).length} UHI Postman collection(s): ` +
    Object.entries(manifest.uhi.services).map(([m, v]) => `${m} (${v.requests})`).join(', '),
);
