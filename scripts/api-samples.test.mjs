// Run after `node scripts/build-api-reference.mjs`: reads the page data it writes.
import {test} from 'node:test';
import assert from 'node:assert';
import {readFileSync, readdirSync} from 'node:fs';

const page = (name) => JSON.parse(readFileSync(new URL(`../site/src/data/api/${name}.json`, import.meta.url), 'utf8'));
const uhiPages = () => readdirSync(new URL('../site/src/data/api/', import.meta.url)).filter((f) => f.startsWith('uhi-')).map((f) => page(f.replace(/\.json$/, '')));
const mdx = (path) => readFileSync(new URL(`../site/docs/uhi/v1/api/${path}.mdx`, import.meta.url), 'utf8');

test('uhi samples are signed and point at a real host', () => {
  const pages = uhiPages();
  assert.ok(pages.length > 0);
  for (const op of pages) {
    const url = op.curl.match(/--url (\S+)/)?.[1] ?? '';
    for (const bad of ['(', '#', '{provider_uri}', '{consumer_uri}', 'uhigatewaybeta']) {
      assert.ok(!url.includes(bad) && !op.path.includes(bad) && !op.server.includes(bad), `${op.id}: the URL, path or server carries ${bad}`);
    }
    assert.ok(!op.curl.includes('Bearer'), `${op.id}: a Bearer token`);
    assert.doesNotMatch(JSON.stringify(op.samples), /\{(provider|consumer)_uri\}|Bearer/, `${op.id}: a raw server variable or a Bearer token in the samples`);
    assert.match(op.curl, /Authorization: <SIGNED_AUTHORIZATION_HEADER>/, `${op.id}: the signed header`);
  }
});

test('uhi pages offer no try-it console', () => {
  for (const op of uhiPages()) assert.equal(op.tryIt, false, op.id);
  assert.equal(page('m2-post-v3-link-on-carecontext').tryIt, undefined);
});

test('a uhi page says who serves the call and pairs within its journey', () => {
  const init = mdx('consultation/endpoints/uhi-consultation-order/01-uhi-consultation-init');
  assert.match(init, /The HSPA serves this call/);
  assert.match(init, /\(\/docs\/uhi\/v1\/api\/consultation\/endpoints\/uhi-consultation-order\/02-uhi-consultation-on-init\)/);
  const bloodAnswer = mdx('network/endpoints/uhi-blood-bank/04-uhi-network-on-search');
  assert.match(bloodAnswer, /\(\/docs\/uhi\/v1\/api\/network\/endpoints\/uhi-blood-bank\/02-uhi-network-search\)/);
  const second = mdx('consultation/endpoints/uhi-consultation-discovery/06-uhi-network-on-search');
  assert.match(second, /\(\/docs\/uhi\/v1\/api\/consultation\/endpoints\/uhi-consultation-discovery\/05-uhi-network-search\)/);
});

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

test('no sample URL carries a space, which curl refuses', () => {
  assert.match(page('onboarding-validate').curl, /\?transactionId=<TRANSACTIONID>&passcode=<PASSCODE>"/);
});
