import {test} from 'node:test';
import assert from 'node:assert';
import {cleanTitle, caseTerms, pathTitle, cleanGroupLabel, imperative, cleanDescription} from './titles.mjs';

// The vocabulary is passed explicitly so these cases do not depend on which
// glossary atoms happen to exist today.
const vocab = ['HIE-CM', 'HPID', 'ABHA', 'HIP', 'HIU', 'HPR', 'HFR', 'OTP', 'API', 'SMS', 'QR', 'CM', 'ID'];

test('NHA numbering and "Use Case" prefixes are stripped', () => {
  assert.equal(cleanTitle('2. Use Case: Used to Fetch Public Key', {vocab}), 'Fetch public key');
  assert.equal(cleanTitle('UseCase : Create ABHA address', {vocab}), 'Create ABHA address');
});

test('the boilerplate opener goes and the verb phrase stays', () => {
  assert.equal(
    cleanTitle('This API will be used to perform HIP initiated linking.', {vocab}),
    'Perform HIP initiated linking',
  );
  assert.equal(
    cleanTitle('This is ABDM HIE-CM API called by HIU to fetch the consent details', {vocab}),
    'Fetch the consent details',
  );
});

test('a callback is named as one', () => {
  assert.match(
    cleanTitle('Callback API of consent status request.', {vocab}),
    /^Callback for consent status request$/,
  );
});

test('acronyms are cased however NHA wrote them, and never inside a longer word', () => {
  assert.equal(caseTerms('notify hiu when consent is approved', vocab), 'notify HIU when consent is approved');
  assert.equal(caseTerms('send an sms to the hip', vocab), 'send an SMS to the HIP');
  // "idempotency" carries "id" but is not the acronym.
  assert.equal(caseTerms('idempotency and hprid', vocab), 'idempotency and hprid');
  // A route keeps its lowercase segments.
  assert.equal(caseTerms('/api/hiecm/v3/sessions', vocab), '/api/hiecm/v3/sessions');
});

test('a summary that cannot be shortened honestly falls back to the path', () => {
  // Strips to "the PHR-HIU application for sharing...", which names nothing.
  assert.equal(
    cleanTitle('This API will be invoked from the PHR-HIU application for sharing the patient profile with the HMIS.', {
      path: '/api/hiecm/patient-share/v3/share',
      method: 'POST',
      vocab,
    }),
    // The route names its own verb, so the fallback leads with it.
    'Share patient share',
  );
  // A summary that is only a route.
  assert.equal(
    cleanTitle('v3/gateway/bridge-service', {path: '/api/hiecm/gateway/v3/bridge-service', method: 'PUT', vocab}),
    'Bridge service',
  );
});

test('no title is ever cut mid sentence', () => {
  const long = 'This API is invoked to retrieve the benefit details associated with a specific ABHA number and every programme linked to it';
  const out = cleanTitle(long, {path: '/abha/api/v3/profile/benefit/abha/{abhanumber}', method: 'GET', vocab});
  assert.ok(out.length <= 72, `got ${out.length} chars: ${out}`);
  assert.ok(!long.startsWith(out), 'a truncated prefix of the summary is not an honest title');
});

test('path titles drop routing segments and split camelCase', () => {
  assert.equal(pathTitle('/abha/api/v3/enrollment/enrol/byAadhaar', 'POST', vocab), 'Enrol by Aadhaar');
  assert.equal(pathTitle('/api/hiecm/gateway/v3/sessions', 'POST', vocab), 'Sessions');
});

test('a slug group label becomes words with its acronym cased', () => {
  assert.equal(cleanGroupLabel('hip-initiated-linking', vocab), 'HIP initiated linking');
  assert.equal(cleanGroupLabel('Consent and data flow', vocab), 'Consent and data flow');
});

test('no title carries an em dash', () => {
  // Built from the code point, because the repo forbids the character itself.
  const emDash = String.fromCharCode(0x2014);
  assert.ok(!cleanTitle('ABHA enrollment - Send OTP using Aadhaar number', {vocab}).includes(emDash));
});

test('every title is an instruction starting with a verb', () => {
  assert.equal(imperative('Public certificate', {method: 'GET', vocab}), 'Get the public certificate');
  assert.equal(imperative('Bridge service', {method: 'PUT', vocab}), 'Update the bridge service');
  assert.equal(imperative('Retrieves the ABHA profile', {method: 'GET', vocab}), 'Retrieve the ABHA profile');
  // NHA's collection bookkeeping is not a name.
  assert.equal(imperative('3 flows: Suggestion API', {method: 'POST', vocab}), 'Submit the suggestion API');
});

test('a callback names receiving, and never stacks two verbs', () => {
  assert.equal(
    imperative('Callback for consent status request', {method: 'POST', kind: 'callback', vocab}),
    'Receive the consent status request',
  );
  // Already imperative, so it is left alone rather than becoming
  // "Receive the confirm the linking".
  assert.equal(
    imperative('Confirm the linking of care contexts', {method: 'POST', kind: 'callback', vocab}),
    'Confirm the linking of care contexts',
  );
});

test('titles and descriptions take Indian English and lose NHA typos', () => {
  assert.equal(imperative('Fetch the list of govt programs', {method: 'GET', vocab}), 'Fetch the list of govt programmes');
  assert.equal(imperative('Register Professtional', {method: 'POST', vocab}), 'Register Professional');
  assert.match(cleanDescription('This API is used to generate a access token.', {vocab}), /^Generate an access token\.$/);
  assert.match(cleanDescription('This API is designed to retrieve the details.', {vocab}), /^Retrieve the details\.$/);
});

test('a description whose opener cannot be stripped is left as NHA wrote it', () => {
  const awkward = 'This is an API will be invoked get the historical token numbers of the patient.';
  assert.equal(cleanDescription(awkward, {vocab}), awkward);
});

test('a hostname keeps the case it is written in', () => {
  const v = ['ABDM', 'NHA', ...vocab];
  assert.equal(
    caseTerms('call apisbeta.nha.gov.in or apisbx.abdm.gov.in', v),
    'call apisbeta.nha.gov.in or apisbx.abdm.gov.in',
  );
  assert.equal(caseTerms('https://apisbx.abdm.gov.in/hcx for abdm', v), 'https://apisbx.abdm.gov.in/hcx for ABDM');
  // A full stop that ends a sentence still lets the term case.
  assert.equal(caseTerms('ask nha. then abdm.', v), 'ask NHA. then ABDM.');
});
