// What a response carries to the next call, as the Try It panel and the
// Postman collections both read it.
//
// Run: node --test site/src/components/api/carry.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import esbuild from 'esbuild';

const ts = readFileSync(new URL('./carry.ts', import.meta.url), 'utf8');
const {code} = await esbuild.transform(ts, {loader: 'ts', format: 'esm'});
const {carriedValues, fillFrom} = await import(`data:text/javascript,${encodeURIComponent(code)}`);

test('an ABHA enrolment carries its txnId and the X-token it issues', () => {
  assert.deepEqual(
    carriedValues({txnId: 'a1', tokens: {token: 'jwt', refreshToken: 'r'}, ABHAProfile: {}}),
    {txnId: 'a1', 'X-token': 'jwt', jwtToken: 'jwt', 'R-jwtToken': 'r'},
  );
});

test('an OTP request carries only its txnId', () => {
  assert.deepEqual(carriedValues({txnId: 'a2', message: 'OTP sent'}), {txnId: 'a2'});
});

test('a PHR login carries the token inside jwtResponse', () => {
  assert.deepEqual(carriedValues({jwtResponse: {token: 't', refreshToken: 'r'}}), {
    'X-token': 't',
    jwtToken: 't',
    'R-jwtToken': 'r',
  });
});

test('a search answers with a list, and its txnId becomes searchTxnId', () => {
  assert.deepEqual(carriedValues([{txnId: 's1', ABHA: []}]), {searchTxnId: 's1'});
});

test('the gateway session carries nothing here: its token is the bearer, not an X-token', () => {
  assert.deepEqual(carriedValues({accessToken: 'g', expiresIn: 1200, refreshToken: 'gr'}), {});
});

test('nothing comes from a body that is not an object', () => {
  for (const body of [null, 'OTP sent', 42, [], [null]]) assert.deepEqual(carriedValues(body), {});
});

test('a placeholder is filled when its value has been carried', () => {
  assert.equal(fillFrom('Bearer {{X-token}}', {'X-token': 'jwt'}), 'Bearer jwt');
  assert.equal(fillFrom('{{txnId}}', {txnId: 'a1'}), 'a1');
});

test('nothing is filled when a placeholder has no value yet, or there is none', () => {
  assert.equal(fillFrom('Bearer {{X-token}}', {}), undefined);
  assert.equal(fillFrom('sbx', {txnId: 'a1'}), undefined);
  assert.equal(fillFrom(undefined, {txnId: 'a1'}), undefined);
});
