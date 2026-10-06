import {test} from 'node:test';
import assert from 'node:assert/strict';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadPinnedPackage} from './lib/nrces-package.mjs';
import {buildRecords, RECORDS} from './build-fhir-builder.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const {files} = loadPinnedPackage(root);
const {index, records} = buildRecords(root);

test('index lists the eight record types in order', () => {
  assert.deepEqual(
    index.map((r) => r.key),
    ['diagnostic-report', 'discharge-summary', 'health-document', 'immunization', 'op-consult', 'prescription', 'wellness', 'invoice'],
  );
  for (const r of index) assert.equal(r.file, `${r.key}.json`);
  for (const r of index) assert.equal(r.exampleUrl, records.get(r.key).exampleUrl);
  for (const r of index) assert.ok(r.holds && r.holds.length > 10, r.key);
});

for (const {key, example} of RECORDS) {
  test(`${key}: the emitted bundle deep-equals ${example} in the package`, () => {
    const record = records.get(key);
    assert.deepEqual(record.bundle, JSON.parse(files.get(`package/example/${example}`)));
    assert.equal(record.example, example);
    assert.equal(record.exampleUrl, `https://nrces.in/ndhm/fhir/r4/${example.replace(/\.json$/, '')}.html`);
    assert.ok(Object.keys(record.annotations).length > 50);
  });
}
