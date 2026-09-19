// The lede is what a reader sees above the method and path, so it must be a
// true prefix of NHA's description: never a rejoin of matched pieces, never a
// cut mid sentence. These cases are the shapes NHA actually ships.
//
// Run: node --test site/src/components/api/lede.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import esbuild from 'esbuild';

// Compile the TypeScript module and import it, so the test runs the real
// source rather than a copy of the logic.
const ts = readFileSync(new URL('./lede.ts', import.meta.url), 'utf8');
const {code} = await esbuild.transform(ts, {loader: 'ts', format: 'esm'});
const mod = await import(`data:text/javascript,${encodeURIComponent(code)}`);
const {splitLede} = mod;

test('a short description is the whole lede', () => {
  const [lede, rest] = splitLede('Fetch the public certificate.');
  assert.equal(lede, 'Fetch the public certificate.');
  assert.equal(rest, '');
});

test('a restating paragraph keeps the first sentence and moves the rest down', () => {
  const d =
    'This API is used to generate a access token. When invoked, it facilitates the authentication ' +
    'process by providing a secure token that can be used to access various services and resources ' +
    'within the system. This functionality is essential for ensuring secure and authorized access.';
  const [lede, rest] = splitLede(d);
  assert.equal(lede, 'This API is used to generate a access token.');
  assert.match(rest, /^When invoked/);
});

test('NHA raw HTML starts the detail, not the lede', () => {
  const d =
    "This is an API is called by HIP to check the status of reports.<ol type='1'> <li> <b>Header</b> " +
    '<br/> <li>AUTHORIZATION will be provided by the gateway session API.';
  const [lede, rest] = splitLede(d);
  assert.equal(lede, 'This is an API is called by HIP to check the status of reports.');
  assert.match(rest, /^<ol/);
});

test('a markdown list starts the detail', () => {
  const [lede, rest] = splitLede('Flows in the Postman collection:\n- P1 login\n- P1 register');
  assert.equal(lede, 'Flows in the Postman collection:');
  assert.match(rest, /^- P1 login/);
});

test('one sentence longer than the budget is kept whole, never cut', () => {
  const one =
    'This API endpoint is invoked by the Hospital Management Information System or the Laboratory ' +
    'Information Management System to notify the consent manager that a care context is now linked ' +
    'to the patient record held at the facility.';
  const [lede, rest] = splitLede(one);
  assert.equal(lede, one);
  assert.equal(rest, '');
});

test('the lede is always a true prefix of the description', () => {
  const cases = [
    'Short one.',
    'First. Second. Third sentence that runs on and on and on and on and on and on and on and on and on and on and on and on and on for a while.',
    "Sentence.<ul><li>a</li></ul>",
    'No terminal punctuation at all just a long run of words that keeps going and going and going and going and going and going and going',
    '',
  ];
  for (const d of cases) {
    const [lede] = splitLede(d);
    assert.ok(d.trim().startsWith(lede), `not a prefix for: ${JSON.stringify(d.slice(0, 40))}`);
  }
});

test('an empty description yields two empty strings', () => {
  assert.deepEqual(splitLede(''), ['', '']);
  assert.deepEqual(splitLede(undefined), ['', '']);
});

test('a lede that only restates the title is dropped', () => {
  const {isRestatement} = mod;
  assert.ok(isRestatement('Retrieve certificate information', 'Get the certificate information'));
  assert.ok(isRestatement('Generate an access token.', 'Generate Keycloak token/access token'));
});

test('a lede that adds information is kept', () => {
  const {isRestatement} = mod;
  assert.ok(
    !isRestatement(
      'Notify the Consent Management system about any updates to the HiTypes of an already linked care context.',
      'Notify a change to a linked care context',
    ),
  );
  assert.ok(!isRestatement('', 'Get the thing'));
});
