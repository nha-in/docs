// The path, lock and edit rules behind "Build a record", run against NRCeS's
// own Prescription example and its annotations, built the way the site build
// builds them. Run: node --test site/src/components/fhir/fhir.test.mjs

import {test} from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import esbuild from 'esbuild';
import {buildRecords} from '../../../../scripts/build-fhir-builder.mjs';

const bundled = await esbuild.build({
  stdin: {
    contents: "export * from './paths.ts'; export * from './locks.ts'; export * from './edit.ts'; export * from './latest.ts'; export * from './steps.ts';",
    resolveDir: fileURLToPath(new URL('.', import.meta.url)),
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  platform: 'neutral',
  write: false,
  logLevel: 'error',
});
const {toKey, getAt, lockReason, setAt, emptyRequired, createLatest, groupFields, labelOf} = await import(
  `data:text/javascript,${encodeURIComponent(bundled.outputFiles[0].text)}`
);

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const {bundle, annotations} = buildRecords(root).records.get('prescription');
const lock = (path) => lockReason(bundle, path, annotations);

test('toKey matches the build script keys', () => {
  assert.equal(toKey([]), '');
  assert.equal(toKey(['entry', 0, 'resource', 'type', 'coding', 0, 'system']), 'entry[0].resource.type.coding[0].system');
  assert.equal(getAt(bundle, ['entry', 5, 'resource', 'code', 'coding', 0, 'code']), '21522001');
});

test('a fixed system is locked as fixed', () => {
  assert.equal(lock(['entry', 5, 'resource', 'code', 'coding', 0, 'system']), 'fixed');
});

test('a reference and a fullUrl are locked as link', () => {
  assert.equal(lock(['entry', 0, 'fullUrl']), 'link');
  assert.equal(lock(['entry', 0, 'resource', 'subject', 'reference']), 'link');
  assert.equal(lock(['entry', 0, 'resource', 'id']), 'link');
});

test('resourceType and meta.profile are locked', () => {
  assert.equal(lock(['entry', 1, 'resource', 'resourceType']), 'resourceType');
  assert.equal(lock(['entry', 1, 'resource', 'meta', 'profile', 0]), 'profile');
});

test('Composition.type.text is locked as record-type', () => {
  assert.equal(lock(['entry', 0, 'resource', 'type', 'text']), 'record-type');
});

test('Binary.data is locked as data, and narrative as narrative', () => {
  assert.equal(lock(['entry', 6, 'resource', 'data']), 'data');
  assert.equal(lock(['entry', 1, 'resource', 'text', 'div']), 'narrative');
});

test('a patient name is editable', () => {
  assert.equal(lock(['entry', 1, 'resource', 'name', 0, 'text']), null);
});

test('setAt does not mutate its input', () => {
  const before = JSON.stringify(bundle);
  const result = setAt(bundle, ['entry', 1, 'resource', 'name', 0, 'text'], 'Test Patient');
  assert.equal(result.ok, true);
  assert.equal(getAt(result.value, ['entry', 1, 'resource', 'name', 0, 'text']), 'Test Patient');
  assert.equal(JSON.stringify(bundle), before);
});

test('setAt keeps a number a number', () => {
  const doc = {dose: {value: 1}};
  const result = setAt(doc, ['dose', 'value'], '10');
  assert.deepEqual(result, {ok: true, value: {dose: {value: 10}}});
});

test('setAt rejects "ten" for a number', () => {
  assert.deepEqual(setAt({dose: {value: 1}}, ['dose', 'value'], 'ten'), {ok: false, reason: 'not-a-number'});
  assert.deepEqual(setAt({dose: {value: 1}}, ['dose', 'value'], ''), {ok: false, reason: 'not-a-number'});
});

test('setAt keeps a boolean a boolean', () => {
  assert.deepEqual(setAt({active: true}, ['active'], 'false'), {ok: true, value: {active: false}});
  assert.deepEqual(setAt({active: true}, ['active'], 'no'), {ok: false, reason: 'not-a-boolean'});
});

test('setAt edits one item of a string array by index', () => {
  const doc = {given: ['Ram', 'Kumar']};
  assert.deepEqual(setAt(doc, ['given', 1], 'Lal').value, {given: ['Ram', 'Lal']});
});

test('emptyRequired names a min 1 leaf set to ""', () => {
  const path = ['entry', 5, 'resource', 'code', 'coding', 0, 'code'];
  assert.equal(annotations[toKey(path)].min, 1);
  assert.deepEqual(emptyRequired(bundle, annotations), []);
  const emptied = setAt(bundle, path, '').value;
  assert.deepEqual(emptyRequired(emptied, annotations), [toKey(path)]);
});

test('only the latest pick is current, so a slower earlier fetch is ignored', () => {
  const latest = createLatest();
  const wellness = latest.next();
  const prescription = latest.next();
  assert.equal(latest.isCurrent(prescription), true);
  assert.equal(latest.isCurrent(wellness), false);
});

test('labelOf gives readable names, not JSON paths', () => {
  assert.equal(labelOf(['birthDate']), 'Date of birth');
  assert.equal(labelOf(['name', 0, 'text']), 'Name');
  assert.equal(labelOf(['code', 'coding', 0, 'display']), 'Code display');
  assert.equal(labelOf(['valueQuantity', 'unit']), 'Value quantity unit');
});

test('groupFields sorts the Prescription into patient, author and clinical steps', () => {
  const groups = groupFields(bundle, annotations);
  const patient = groups.filter((g) => g.step === 'patient');
  assert.equal(patient.length, 1);
  assert.equal(patient[0].title, 'Patient: ABC');
  const name = patient[0].fields.find((f) => f.key === 'entry[1].resource.name[0].text');
  assert.equal(name.label, 'Name');
  assert.equal(name.required, true);
  assert.ok(groups.some((g) => g.step === 'author' && g.title.startsWith('Practitioner')));
  const clinical = groups.filter((g) => g.step === 'clinical').map((g) => g.title);
  assert.equal(clinical[0].startsWith('Record'), true);
  assert.ok(clinical.includes('Condition: Abdominal pain'));
});

test('groupFields shows only editable leaves, each exactly once, and drops groups with none', () => {
  const groups = groupFields(bundle, annotations);
  const keys = groups.flatMap((g) => g.fields.map((f) => f.key));
  assert.equal(new Set(keys).size, keys.length);
  for (const g of groups) {
    assert.ok(g.fields.length > 0, g.title);
    for (const f of g.fields) assert.equal(lockReason(bundle, f.path, annotations), null, f.key);
  }
  assert.ok(!groups.some((g) => g.title.startsWith('Binary')));
  let editable = 0;
  bundle.entry.forEach((entry, i) => {
    const walk = (v, path) => {
      if (v !== null && typeof v === 'object') {
        (Array.isArray(v) ? v.map((x, j) => [j, x]) : Object.entries(v)).forEach(([k, x]) => walk(x, [...path, k]));
      } else if (lockReason(bundle, path, annotations) === null) editable++;
    };
    walk(entry.resource, ['entry', i, 'resource']);
  });
  assert.equal(keys.length, editable);
});

test('a contentType beside base64 data is locked with it', () => {
  assert.equal(lock(['entry', 6, 'resource', 'contentType']), 'data');
});

test('main fields are what a person fills in; plumbing waits under More fields', () => {
  const patient = groupFields(bundle, annotations).find((g) => g.step === 'patient');
  const main = patient.fields.filter((f) => f.main).map((f) => f.label);
  for (const label of ['Name', 'Gender', 'Date of birth']) assert.ok(main.includes(label), label);
  for (const label of ['Version id', 'Last updated', 'Status', 'Identifier system', 'Type code']) {
    assert.ok(!main.includes(label), label);
  }
  const more = patient.fields.filter((f) => !f.main).map((f) => f.label);
  assert.ok(more.includes('Version id'));
  const record = groupFields(bundle, annotations).find((g) => g.title.startsWith('Record'));
  assert.ok(!record.fields.some((f) => f.main && f.path.includes('section')));
  assert.equal(record.fields.find((f) => f.key === 'entry[0].resource.subject.display').main, false);
});
