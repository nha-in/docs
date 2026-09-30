// Run after `node scripts/build-postman.mjs`: reads the collections it writes.
import {test} from 'node:test';
import assert from 'node:assert';
import {readFileSync, readdirSync} from 'node:fs';
import {loadJourneys} from './lib/journeys.mjs';

const dir = new URL('../site/static/postman/', import.meta.url);
const read = (name) => JSON.parse(readFileSync(new URL(name, dir), 'utf8'));
const manifest = JSON.parse(readFileSync(new URL('../site/src/data/postman.json', import.meta.url), 'utf8'));
const environment = read(manifest.environment);
const requests = (collection) => collection.item.flatMap((folder) => folder.item.map((i) => i.request));

test('every milestone has a collection', () => {
  for (const module of ['m1', 'm2', 'm3', 'm4', 'p1', 'p2', 'p3', 'p4']) {
    assert.ok(manifest.modules[module], `no collection for ${module}`);
  }
  assert.deepEqual(
    readdirSync(dir).filter((f) => f.endsWith('.postman_collection.json')).sort(),
    [...Object.values(manifest.modules), ...Object.values(manifest.uhi.services)].map((m) => m.file).sort(),
  );
});

test('a journey becomes a folder, its calls in the order the journey gives', () => {
  const m2 = read('hiecm-m2.postman_collection.json');
  const journey = loadJourneys().get('m2').find((j) => j.id === 'm2-abdm-hip-initiated-linking-hip');
  const folder = m2.item.find((f) => f.name === journey.title);
  assert.deepEqual(
    folder.item.map((i) => i.name.split('. ')[0]),
    journey.steps.map((_, i) => String(i + 1)),
  );
  assert.equal(folder.item[0].request.url.raw, '{{gatewayUrl}}/api/hiecm/hip/v3/link/carecontext');
});

test('no callback is sent from a collection', () => {
  for (const {file} of Object.values(manifest.modules)) {
    const collection = read(file);
    assert.ok(!collection.item.some((f) => f.name === 'Callbacks'), `${file} has a Callbacks folder`);
  }
  const paths = requests(read('hiecm-m2.postman_collection.json')).map((r) => r.url.raw);
  assert.ok(!paths.some((p) => p.endsWith('/api/v3/consent/request/hip/notify')), 'M2 sends the consent notification it should receive');
});

test('every host a request names is a variable the environment defines', () => {
  const defined = new Set(environment.values.map((v) => v.key));
  for (const {file} of Object.values(manifest.modules)) {
    for (const request of requests(read(file))) {
      const host = request.url.host[0].replace(/^\{\{|\}\}$/g, '');
      assert.ok(defined.has(host), `${file}: ${request.url.raw} uses {{${host}}}, which the environment does not define`);
    }
  }
});

test('the environment ships no secret', () => {
  for (const key of ['clientId', 'clientSecret', 'accessToken']) {
    assert.equal(environment.values.find((v) => v.key === key).value, '', `${key} is not blank`);
  }
});

test('the token call goes to the gateway sessions path', () => {
  const exec = read('hiecm-m2.postman_collection.json').event[0].script.exec.join('\n');
  assert.match(exec, /\{\{gatewayUrl\}\}\/api\/hiecm\/gateway\/v3\/sessions/);
});

// The scripts run here against a stand-in for Postman's `pm`, so a script
// that does not parse, or sets the wrong variable, fails the build.
const script = (collection, listen) => collection.event.find((e) => e.listen === listen).script.exec.join('\n');

test('a response hands its txnId and X-token to the calls after it', () => {
  const m1 = read('hiecm-m1.postman_collection.json');
  const set = {};
  const pm = {
    response: {json: () => ({txnId: 't1', tokens: {token: 'x1', refreshToken: 'r1'}})},
    collectionVariables: {set: (key, value) => (set[key] = value)},
  };
  new Function('pm', script(m1, 'test'))(pm);
  assert.deepEqual(set, {txnId: 't1', 'X-token': 'x1', jwtToken: 'x1', 'R-jwtToken': 'r1'});
  assert.deepEqual(m1.variable.map((v) => v.key).sort(), Object.keys(set).concat('searchTxnId').sort());
});

test('a response that is not JSON leaves the variables alone', () => {
  const set = {};
  const pm = {response: {json: () => { throw new Error('not JSON'); }}, collectionVariables: {set: (k, v) => (set[k] = v)}};
  new Function('pm', script(read('hiecm-m1.postman_collection.json'), 'test'))(pm);
  assert.deepEqual(set, {});
});

test('the sessions call does not fetch a token for itself', () => {
  let fetched = false;
  const pm = {
    request: {url: {getPath: () => '/api/hiecm/gateway/v3/sessions'}},
    environment: {get: () => ''},
    variables: {get: () => '', replaceIn: (s) => s},
    sendRequest: () => (fetched = true),
  };
  new Function('pm', script(read('hiecm-gateway.postman_collection.json'), 'prerequest'))(pm);
  assert.equal(fetched, false);
});

// UHI: one collection per service, signed by a header the integrator pastes.
const uhiEnvironment = read(manifest.uhi.environment);
const uhiServices = ['consultation', 'ambulance', 'pmjay-hem', 'blood-bank', 'jan-aushadhi', 'notto'];

test('every UHI service has its own collection', () => {
  assert.deepEqual(Object.keys(manifest.uhi.services).sort(), [...uhiServices].sort());
  for (const service of uhiServices) assert.equal(manifest.uhi.services[service].file, `uhi-${service}.postman_collection.json`);
});

test('a UHI journey becomes a folder, and every collection can look up a signing key', () => {
  const pmjay = read('uhi-pmjay-hem.postman_collection.json');
  const journey = loadJourneys({platform: 'uhi', version: 'v1'}).get('network').find((j) => j.id === 'uhi-pmjay-hem');
  const folder = pmjay.item.find((f) => f.name === journey.title);
  assert.deepEqual(folder.item.map((i) => i.name.split('. ')[0]), journey.steps.map((_, i) => String(i + 1)));
  assert.equal(folder.item[0].request.url.raw, '{{gatewayUrl}}/api/v1/uhi/search');
  for (const service of uhiServices) {
    const names = requests(read(`uhi-${service}.postman_collection.json`)).map((r) => r.url.raw);
    assert.ok(names.includes('{{gatewayUrl}}/api/v1/networkregistry/lookup'), `${service} has no registry lookup`);
  }
});

test('a Physical Consultation collection leaves out select, which is not implemented', () => {
  const paths = requests(read('uhi-consultation.postman_collection.json')).map((r) => r.url.raw);
  assert.ok(!paths.some((p) => /\/(on_)?select$/.test(p)), 'select or on_select is in the collection');
  assert.ok(paths.includes('{{providerUri}}/init'));
});

test('every UHI request is signed with the pasted header, on a host the environment defines', () => {
  const defined = new Set(uhiEnvironment.values.map((v) => v.key));
  for (const service of uhiServices) {
    for (const request of requests(read(`uhi-${service}.postman_collection.json`))) {
      assert.equal(request.header.find((h) => h.key === 'Authorization').value, '{{authorization}}');
      const host = request.url.host[0].replace(/^\{\{|\}\}$/g, '');
      assert.ok(defined.has(host), `${service}: ${request.url.raw} uses {{${host}}}`);
    }
  }
  assert.equal(uhiEnvironment.values.find((v) => v.key === 'authorization').value, '');
});

test('an expired UHI header stops the request before it is sent', () => {
  const pre = script(read('uhi-pmjay-hem.postman_collection.json'), 'prerequest');
  const run = (authorization) => new Function('pm', pre)({variables: {get: () => authorization}});
  const past = Math.floor(Date.now() / 1000) - 10;
  assert.throws(() => run(JSON.stringify({created: String(past - 10), expires: String(past)})), /expired/);
  assert.doesNotThrow(() => run(JSON.stringify({created: String(past), expires: String(past + 60)})));
  assert.throws(() => run(''), /Paste/);
});
