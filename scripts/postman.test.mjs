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
    Object.values(manifest.modules).map((m) => m.file).sort(),
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
