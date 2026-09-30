// What scripts/ingest-uhi.mjs must produce from NHA's UHI set of 28 September
// 2026: three self-contained modules whose operations, examples and servers
// come from NHA's two Gateway spec files.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {listSpecTree} from './specs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'catalogue', 'uhi', 'openapi', 'v1');
const FILES = {network: 'uhi-network.yaml', consultation: 'uhi-consultation.yaml', ambulance: 'uhi-ambulance.yaml'};
const load = (m) => parse(readFileSync(join(dir, FILES[m]), 'utf8'));
const ops = (spec) => Object.entries(spec.paths ?? {}).flatMap(([path, item]) => Object.entries(item).filter(([m]) => m === 'post').map(([, op]) => ({path, op})));
const byId = () => new Map(Object.keys(FILES).flatMap((m) => ops(load(m)).map((o) => [o.op.operationId, o])));
const examples = (op) => op.requestBody?.content?.['application/json']?.examples ?? {};
const types = (value, out = new Set()) => {
  if (Array.isArray(value)) value.forEach((v) => types(v, out));
  else if (value && typeof value === 'object') for (const [k, v] of Object.entries(value)) {
    if ((k === 'fulfillment' || k === 'fulfillments') && v) [v].flat().forEach((f) => f?.type && out.add(f.type));
    types(v, out);
  }
  return out;
};

test('operation counts', () => {
  for (const m of Object.keys(FILES)) assert.ok(existsSync(join(dir, FILES[m])), `${FILES[m]} exists`);
  assert.equal(ops(load('network')).length, 5);
  assert.equal(ops(load('consultation')).length, 18);
  assert.equal(ops(load('ambulance')).length, 2);
});

test('operationIds unique across every gateway spec', () => {
  const ids = listSpecTree().flatMap(({files}) => files.flatMap((f) => {
    const s = parse(readFileSync(f.path, 'utf8'));
    return [...Object.values(s.paths ?? {}), ...Object.values(s.webhooks ?? {})].flatMap((item) => Object.values(item).map((o) => o?.operationId).filter(Boolean));
  }));
  assert.equal(new Set(ids).size, ids.length);
});

test('no suffix leaks', () => {
  for (const m of Object.keys(FILES)) for (const {path, op} of ops(load(m))) {
    assert.ok(!path.includes('('), `${path} carries NHA's (suffix)`);
    if (path.includes('#')) assert.match(op['x-actual-path'] ?? '', /^\/[^#]*$/, `${path} has an x-actual-path`);
  }
});

test('mandatory extensions', () => {
  const manifest = readFileSync(join(root, 'catalogue', 'uhi', 'openapi', '.raw', 'nha-2026-09-28-uhi', 'MANIFEST.md'), 'utf8');
  for (const m of Object.keys(FILES)) {
    const s = load(m);
    assert.equal(s.openapi, '3.1.1');
    assert.equal(s.info['x-abdm-gateway'], 'uhi');
    assert.equal(s.info['x-abdm-module'], m);
    assert.equal(s.info['x-abdm-phase'], 1);
    assert.deepEqual(s.info['x-abdm-roles'], ['eua', 'hspa']);
    assert.equal(s.info['x-portal'].module, m);
    assert.ok(s['x-abdm-sources']?.length >= 2);
    for (const src of s['x-abdm-sources']) {
      const rel = src.file.replace('catalogue/uhi/openapi/.raw/nha-2026-09-28-uhi/', '');
      assert.ok(manifest.includes(`| \`${rel}\` | \`${src.hash.replace('sha256:', '')}\``), `${src.file} hash matches the manifest`);
    }
  }
});

test('every service has examples on the gateway search', () => {
  const ex = examples(byId().get('uhi_network_gateway_search').op);
  for (const service of ['consultation', 'pmjay-hem', 'blood-bank', 'ambulance', 'jan-aushadhi', 'notto']) {
    assert.ok(Object.keys(ex).some((k) => k.startsWith(`${service}-`)), `${service} has a search example`);
  }
  const ja = Object.entries(ex).filter(([k]) => k.startsWith('jan-aushadhi-')).flatMap(([, e]) => [...types(e.value)]);
  for (const t of ['JANAUSHADHI', 'JANAUSHADHI_MEDICINE', 'JANAUSHADHI_KENDRA']) assert.ok(ja.includes(t), `Jan Aushadhi covers ${t}`);
});

test('consultation examples survive the teleconsultation filter', () => {
  const ids = byId();
  const has = (id, title) => Object.values(examples(ids.get(id).op)).some((e) => (e.summary ?? '').includes(title));
  assert.ok(has('uhi_network_search', 'Second search (HPR Address)'));
  assert.ok(has('uhi_network_on_search', '2nd on_search response'));
  assert.ok(has('uhi_consultation_on_confirm', 'HSPA Platform sends FAILED status'));
  for (const {op} of ids.values()) for (const e of Object.values(examples(op))) assert.doesNotMatch(e.summary ?? '', /\(Tele ?consultation\)/i);
});

test('servers put the sandbox first and give participant calls their own host', () => {
  const ids = byId();
  const served = (id) => ids.get(id).op.servers ?? load('network').servers;
  assert.equal(served('uhi_network_gateway_search')[0].url, 'https://uhigatewaysandbox.abdm.gov.in');
  assert.equal(served('uhi_network_search')[0].url, 'https://{provider_uri}');
  assert.equal(served('uhi_network_on_search')[0].url, 'https://{consumer_uri}');
});

test('hosting and pairing', () => {
  const ids = byId();
  const host = (id) => ids.get(id).op['x-abdm-hosted-by'];
  assert.equal(host('uhi_consultation_on_update_to_hspa'), 'hspa');
  assert.equal(host('uhi_consultation_on_update_to_eua'), 'eua');
  assert.equal(host('uhi_network_registry_lookup'), 'gateway');
  assert.equal(host('uhi_consultation_init'), 'hspa');
  assert.equal(ids.get('uhi_consultation_init').op['x-abdm-answered-by'], 'uhi_consultation_on_init');
  assert.equal(ids.get('uhi_consultation_on_init').op['x-abdm-triggered-by'], 'uhi_consultation_init');
});

test('agent readiness', () => {
  for (const {op} of byId().values()) {
    assert.ok(op.summary, `${op.operationId} has a summary`);
    assert.ok((op.description ?? '').length >= 40, `${op.operationId} has a description`);
  }
});
