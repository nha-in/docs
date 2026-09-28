// The UHI quickstart's builder, against the sample search in section 1.3 of
// the UHI developer guide (catalogue/openapi/.raw/nha-2026-09-28-uhi).
//
// Run: node --test site/src/components/docs/uhi-quickstart-values.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import esbuild from 'esbuild';

const ts = readFileSync(new URL('./uhi-quickstart-values.ts', import.meta.url), 'utf8');
const {code} = await esbuild.transform(ts, {loader: 'ts', format: 'esm'});
const v = await import(`data:text/javascript,${encodeURIComponent(code)}`);

const INPUTS = {
  subscriberId: 'my-eua',
  consumerUri: 'https://eua.example.in/uhi',
  latitude: '17.3787973',
  longitude: '78.4368433',
  radiusKm: '13.0',
  uuid: '6a1f3c2e-0000-4000-8000-000000000001',
  timestamp: '2026-09-29T06:30:00.000Z',
  today: '2026-09-29',
};

test('the body is the guide sample, one line, one UUID for both ids', () => {
  const body = v.searchBody(INPUTS);
  assert.ok(!body.includes('\n'));
  const parsed = JSON.parse(body);
  assert.equal(parsed.context.domain, 'nic2004:85112');
  assert.equal(parsed.context.core_version, '0.7.1');
  assert.equal(parsed.context.message_id, parsed.context.transaction_id);
  assert.equal(parsed.message.intent.fulfillment.type, 'PMJAYHEM');
  assert.equal(parsed.message.intent.fulfillment.start.time.timestamp, '2026-09-29T00:00:00');
  assert.equal(parsed.message.intent.fulfillment.end.time.timestamp, '2026-09-29T23:59:59');
  assert.deepEqual(parsed.message.intent.item.descriptor, {code: 'PMJAY', name: 'PMJAY', flag: false});
  assert.equal(parsed.message.intent.location.gps, '17.3787973,78.4368433');
  assert.deepEqual(parsed.message.intent.location.radius, {type: 'CONSTANT', value: '13.0', unit: 'km'});
});

test('inputs are checked before a body is offered', () => {
  assert.equal(v.whatIsWrong(INPUTS), '');
  assert.match(v.whatIsWrong({...INPUTS, subscriberId: ' '}), /subscriber ID/);
  assert.match(v.whatIsWrong({...INPUTS, consumerUri: 'http://eua.example.in'}), /https/);
  assert.match(v.whatIsWrong({...INPUTS, latitude: '91'}), /Latitude/);
  assert.match(v.whatIsWrong({...INPUTS, longitude: 'east'}), /Longitude/);
  assert.match(v.whatIsWrong({...INPUTS, radiusKm: '0'}), /radius/);
});

test('pasted headers lose their names, and the digest gains its prefix', () => {
  assert.equal(v.headerValue('Authorization: Signature keyId="a"', 'Authorization'), 'Signature keyId="a"');
  assert.equal(v.digestValue('abc=='), 'BLAKE-512=abc==');
  assert.equal(v.digestValue('Digest: BLAKE-512=abc=='), 'BLAKE-512=abc==');
  assert.equal(v.digestValue(''), '');
});

test('the curl sends the body byte for byte, quotes included', () => {
  const body = v.searchBody({...INPUTS, subscriberId: "o'brien"});
  const curl = v.curlCommand(body, 'Signature keyId="k",signature="s"', 'abc==');
  // Ask a real shell what the --data-binary argument becomes.
  const arg = curl.split('--data-binary ')[1];
  const echoed = execFileSync('sh', ['-c', `printf %s ${arg}`], {encoding: 'utf8'});
  assert.equal(echoed, body);
  assert.match(curl, /-H 'Digest: BLAKE-512=abc=='/);
  assert.match(curl, /Authorization: Signature keyId="k",signature="s"/);
});

test('the transaction id is read from a pasted body or taken as pasted', () => {
  const body = JSON.stringify({context: {transaction_id: INPUTS.uuid}, message: {}});
  assert.equal(v.pastedTransactionId(body), INPUTS.uuid);
  assert.equal(v.pastedTransactionId(`  ${INPUTS.uuid}\n`), INPUTS.uuid);
  assert.equal(v.pastedTransactionId('{"context": {}}'), '');
  assert.equal(v.pastedTransactionId('{not json'), '');
});
