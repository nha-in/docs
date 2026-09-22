// Run after `node scripts/build-api-reference.mjs`: reads the page data it writes.
import {test} from 'node:test';
import assert from 'node:assert';
import {readFileSync} from 'node:fs';

const page = (name) => JSON.parse(readFileSync(new URL(`../site/src/data/api/${name}.json`, import.meta.url), 'utf8'));

test('a P2 gateway call renders against the gateway, not the ABHA service', () => {
  const op = page('p2-get-consent-v3-request');
  assert.equal(op.server, 'https://dev.abdm.gov.in');
  assert.match(op.curl, /--url "https:\/\/dev\.abdm\.gov\.in\/api\/hiecm\/consent\/v3\/request\?limit=/);
});

test('a P2 ABHA service call keeps the ABHA service host', () => {
  assert.equal(page('p2-get-v3-phr-app-login-profile').server, 'https://abhasbx.abdm.gov.in');
});

test('required query parameters reach the samples, quoted for the shell', () => {
  const op = page('p3-get-subscription-requests-v3-requests');
  assert.match(op.curl, /--url "[^"]*\?limit=5&offset=5&status=ALL" \\/);
  assert.match(JSON.stringify(op.samples), /\?limit=5&offset=5&status=ALL/);
});

test('a call with no query keeps its bare URL', () => {
  assert.match(page('p3-post-subscription-requests-v3-request-id-approve').curl, /--url https:\/\/dev\.abdm\.gov\.in\/\S+approve \\/);
});

test('a oneOf callback body renders its success shape, not a placeholder', () => {
  const op = page('m2-post-v3-link-on-carecontext');
  assert.deepEqual(Object.keys(op.requestExample), ['abhaAddress', 'status', 'response']);
  assert.ok(op.body.some((f) => f.name === 'response.requestId'));
});

test('a value the schema fixes is marked, and nothing else is', () => {
  const session = page('gateway-post-gateway-v3-sessions');
  assert.deepEqual(session.body.filter((f) => f.fixed !== undefined).map((f) => [f.name, f.fixed]), [['grantType', 'client_credentials']]);
  const otp = page('m1-post-v3-enrollment-request-otp-aadhaar-otp');
  assert.deepEqual(otp.body.find((f) => f.name === 'scope').fixed, ['abha-enrol']);
});
