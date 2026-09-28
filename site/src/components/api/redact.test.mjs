// What Try it hands to Ask AI must not carry the reader's live tokens.
//
// Run: node --test site/src/components/api/redact.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import esbuild from 'esbuild';

const ts = readFileSync(new URL('./redact.ts', import.meta.url), 'utf8');
const {code} = await esbuild.transform(ts, {loader: 'ts', format: 'esm'});
const {redact} = await import(`data:text/javascript,${encodeURIComponent(code)}`);

test('every secret header in a curl loses its value, not its name', () => {
  const curl = [
    `curl --request POST \\`,
    `  --header 'Authorization: Bearer eyJhbGciOi.real.token' \\`,
    `  --header 'X-token: Bearer eyJ.user.token' \\`,
    `  -H "T-token: Bearer abc" \\`,
    `  --header 'X-Auth-Token: xyz' \\`,
    `  --header 'Cookie: session=1' \\`,
    `  --header 'REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8'`,
  ].join('\n');
  const out = redact(curl);
  for (const name of ['Authorization', 'X-token', 'T-token', 'X-Auth-Token', 'Cookie']) {
    assert.match(out, new RegExp(`${name}: <redacted>`));
  }
  assert.doesNotMatch(out, /eyJ|abc'|xyz|session=1/);
  assert.match(out, /REQUEST-ID: 18235d89-cb13-479d-ad71-7a57d5f669a8/);
});

test('token properties in a JSON body are redacted at any depth', () => {
  const body = JSON.stringify(
    {tokens: {token: 'eyJ.a', refreshToken: 'eyJ.b', expiresIn: 1800}, accessToken: 'eyJ.c', xToken: 'eyJ.d', txnId: 't-1'},
    null,
    2,
  );
  const out = redact(body);
  assert.doesNotMatch(out, /eyJ/);
  assert.match(out, /"refreshToken": "<redacted>"/);
  assert.match(out, /"expiresIn": 1800/);
  assert.match(out, /"txnId": "t-1"/);
});

test('text with nothing secret comes back unchanged', () => {
  const text = '{"message": "OTP sent", "txnId": "abc-123"}';
  assert.equal(redact(text), text);
});
