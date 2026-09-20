// The Quickstart's result reader, against the response shapes NHA's own
// specification records. The bodies below are taken from the 200 and 4xx
// examples for /abha/api/v3/enrollment/enrol/byAadhaar in
// catalogue/openapi/hiecm/v3/hiecm-m1.yaml, not invented here.
//
// The bug this guards: reading only the top level, and only strings, found
// neither ABHANumber (nested under ABHAProfile) nor the address (a list), so a
// creation that had entirely succeeded rendered as nothing but raw JSON.
//
// Run: node --test site/src/components/docs/quickstart-values.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import esbuild from 'esbuild';

const ts = readFileSync(new URL('./quickstart-values.ts', import.meta.url), 'utf8');
const {code} = await esbuild.transform(ts, {loader: 'ts', format: 'esm'});
const {field, readable, otpIsWellFormed, mobileIsWellFormed} = await import(
  `data:text/javascript,${encodeURIComponent(code)}`
);

const CREATED = {
  message: 'Account created successfully',
  tokens: {token: 'eyJ...', expiresIn: 1800, refreshToken: 'eyJ...'},
  ABHAProfile: {
    firstName: 'Ravi',
    middleName: '',
    lastName: 'Kumar',
    dob: '01-01-1990',
    gender: 'M',
    mobile: '******0903',
    phrAddress: ['ravikumar@sbx'],
    ABHANumber: '91-1234-5678-9012',
    abhaStatus: 'ACTIVE',
  },
};

const DEAD_TXN = {error: {code: 'ABDM-1017', message: 'Invalid Transaction Id'}};

test('the ABHA number is found where NHA nests it', () => {
  assert.equal(
    field(CREATED, ['ABHANumber', 'abhaNumber', 'healthIdNumber']),
    '91-1234-5678-9012',
  );
});

test('the address is read out of the list NHA sends it in', () => {
  assert.equal(
    field(CREATED, ['preferredAbhaAddress', 'abhaAddress', 'phrAddress', 'healthId']),
    'ravikumar@sbx',
  );
});

test('a name is assembled from the nested profile, and an empty part is not', () => {
  assert.equal(field(CREATED, ['firstName']), 'Ravi');
  assert.equal(field(CREATED, ['middleName']), '');
  assert.equal(field(CREATED, ['lastName']), 'Kumar');
});

test('the error code is found so the dead transaction can be explained', () => {
  assert.equal(field(DEAD_TXN, ['code']), 'ABDM-1017');
});

test('a name at the top level wins over the same name nested deeper', () => {
  // `message` is top level on a created account and inside `error` on a
  // failure. The outer one has to win, or a body carrying both reports the
  // wrong one.
  const both = {message: 'Account created successfully', error: {message: 'nope'}};
  assert.equal(field(both, ['message']), 'Account created successfully');
});

test('the spellings are tried in the order given', () => {
  const body = {abhaNumber: 'second', ABHANumber: 'first'};
  assert.equal(field(body, ['ABHANumber', 'abhaNumber']), 'first');
});

test('nothing found stays empty rather than throwing', () => {
  assert.equal(field(null, ['ABHANumber']), '');
  assert.equal(field({}, ['ABHANumber']), '');
  assert.equal(field('a string', ['ABHANumber']), '');
  assert.equal(field({a: [1, 2]}, ['a']), '');
});

test('blank and whitespace values do not count as found', () => {
  assert.equal(readable('   '), '');
  assert.equal(readable(['', '  ', 'here']), 'here');
  assert.equal(field({ABHANumber: '  ', p: {ABHANumber: '91-0000'}}, ['ABHANumber']), '91-0000');
});

// The shapes are the site's own, from docs/hiecm/v3/concepts/encryption: an
// OTP is exactly six digits, a mobile number ten with the first between 1 and
// 9, optionally prefixed +91 or 0. They are checked before the call because
// the transaction dies on its first use, so a mistyped code costs the reader
// the whole transaction rather than one attempt.

test('an OTP is exactly six digits', () => {
  assert.equal(otpIsWellFormed('123456'), true);
  assert.equal(otpIsWellFormed(' 123456 '), true);
  assert.equal(otpIsWellFormed('12345'), false);
  assert.equal(otpIsWellFormed('1234567'), false);
  assert.equal(otpIsWellFormed('12345a'), false);
  assert.equal(otpIsWellFormed(''), false);
});

test('a mobile number is ten digits, the first between 1 and 9', () => {
  assert.equal(mobileIsWellFormed('8939236130'), true);
  assert.equal(mobileIsWellFormed('+918939236130'), true);
  assert.equal(mobileIsWellFormed('08939236130'), true);
  assert.equal(mobileIsWellFormed('893 923 6130'), true, 'spaces are how people write it');
  assert.equal(mobileIsWellFormed('893-923-6130'), true, 'so are dashes');
  assert.equal(mobileIsWellFormed('0939236130'), false, 'ten digits starting 0 is not one');
  assert.equal(mobileIsWellFormed('893923613'), false, 'nine digits');
  assert.equal(mobileIsWellFormed('89392361301'), false, 'eleven digits');
  assert.equal(mobileIsWellFormed('893923613a'), false);
  assert.equal(mobileIsWellFormed(''), false);
});
