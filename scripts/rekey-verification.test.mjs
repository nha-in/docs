// scripts/rekey-verification.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {parseCurl, rekey, fileNames, loadOps} from './rekey-verification.mjs';

const ops = [
  {operationId: 'gateway_get_bridge_service_by_id', method: 'get', path: '/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}'},
  {operationId: 'm1_post_profile_verify', method: 'post', path: '/abha/api/v3/profile/login/verify'},
];
const curl = "curl -X GET 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}' \\\n  -H 'Authorization: Bearer <scrubbed>'";

test('the method and URL come out of the stored curl string', () => {
  assert.deepEqual(parseCurl(curl), {method: 'GET', url: 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}'});
});

test('a record is keyed to its operation and labelled by outcome', () => {
  const out = rekey({atom: 'hiecm.endpoint.x', on: '2026-09-17', request: curl, status: 200, body: ''}, ops);
  assert.equal(out.operation, 'gateway_get_bridge_service_by_id');
  assert.equal(out.outcome, 'succeeded');
  assert.equal(out.atom, undefined);
  assert.equal(rekey({atom: 'x', on: 'd', request: curl, status: 415, body: ''}, ops).outcome, 'failed');
});

test('two records for one operation get two file names, never one', () => {
  const recs = [{operation: 'm1_post_profile_verify', on: '2026-09-17'}, {operation: 'm1_post_profile_verify', on: '2026-09-17'}];
  assert.deepEqual(fileNames(recs), ['m1_post_profile_verify.2026-09-17.1.json', 'm1_post_profile_verify.2026-09-17.2.json']);
});

test('a request that matches no operation is reported, not guessed', () => {
  const bad = "curl -X GET 'https://dev.abdm.gov.in/nowhere'";
  assert.throws(() => rekey({atom: 'x', on: 'd', request: bad, status: 404}, ops), /no operation matches GET \/nowhere/);
});

test('callbacks, declared as webhooks, are operations too, keyed by their path', () => {
  const root = mkdtempSync(join(tmpdir(), 'ops-'));
  const dir = join(root, 'catalogue', 'openapi', 'hiecm', 'v3');
  mkdirSync(dir, {recursive: true});
  writeFileSync(join(dir, 'hiecm-m2.yaml'), [
    'openapi: 3.1.0',
    'paths:',
    '  /api/hiecm/v3/link/carecontext#hip:',
    '    post: {operationId: m2_post_link}',
    'webhooks:',
    '  /api/v3/link/on_carecontext:',
    '    post: {operationId: m2_post_v3_link_on_carecontext}',
  ].join('\n'));
  assert.deepEqual(loadOps(root), [
    {operationId: 'm2_post_link', method: 'post', path: '/api/hiecm/v3/link/carecontext'},
    {operationId: 'm2_post_v3_link_on_carecontext', method: 'post', path: '/api/v3/link/on_carecontext'},
  ]);
});
