import {test} from 'node:test';
import assert from 'node:assert/strict';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadPinnedPackage} from './nrces-package.mjs';
import {annotateBundle, structureDefinitions} from './fhir-annotate.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const {files} = loadPinnedPackage(root);
const sds = structureDefinitions(files);
const example = (name) => JSON.parse(files.get(`package/example/${name}`));
const prescription = example('Bundle-Prescription-example-06.json');
const annotations = annotateBundle(prescription, sds);

test('Composition.type.coding.code is annotated from PrescriptionRecord, fixed and required', () => {
  const a = annotations['entry[0].resource.type.coding[0].code'];
  assert.equal(a.element, 'Composition.type.coding.code');
  assert.equal(a.profile, 'PrescriptionRecord');
  assert.equal(a.min, 1);
  assert.equal(a.fixed, '440545006');
  assert.equal(
    a.anchor,
    'https://nrces.in/ndhm/fhir/r4/StructureDefinition-PrescriptionRecord-definitions.html#key_Composition.type.coding.code',
  );
});

test('Composition.type.coding.system carries the fixed SNOMED CT system', () => {
  const a = annotations['entry[0].resource.type.coding[0].system'];
  assert.equal(a.element, 'Composition.type.coding.system');
  assert.equal(a.fixed, 'http://snomed.info/sct');
});

test('the bundle root is annotated from DocumentBundle', () => {
  assert.equal(annotations[''].profile, 'DocumentBundle');
  assert.equal(annotations[''].element, 'Bundle');
});

test('medicationCodeableConcept resolves to MedicationRequest.medication[x]', () => {
  const a = annotations['entry[3].resource.medicationCodeableConcept'];
  assert.equal(a.element, 'MedicationRequest.medication[x]');
  assert.equal(a.profile, 'MedicationRequest');
});

test('a Condition coding with system http://snomed.info/sct resolves to the SNOMEDCT slice', () => {
  assert.equal(annotations['entry[5].resource.code.coding[0]'].element, 'Condition.code.coding:SNOMEDCT');
  const code = annotations['entry[5].resource.code.coding[0].code'];
  assert.equal(code.element, 'Condition.code.coding:SNOMEDCT.code');
  assert.equal(code.min, 1);
});

test('a coding whose system matches no slice falls back to the unsliced element', () => {
  const clone = structuredClone(prescription);
  clone.entry[5].resource.code.coding[0].system = 'http://example.org';
  const a = annotateBundle(clone, sds);
  assert.equal(a['entry[5].resource.code.coding[0]'].element, 'Condition.code.coding');
  // The snapshot defines no children for the unsliced element, only for its
  // slices, so the code inside an unmatched coding carries no annotation
  // rather than borrowing a slice's.
  assert.equal(a['entry[5].resource.code.coding[0].code'], undefined);
});

test('every anchor names an element present in its StructureDefinition snapshot', () => {
  const names = [
    'Bundle-DiagnosticReport-Lab-example-03.json',
    'Bundle-DischargeSummary-example-04.json',
    'Bundle-HealthDocumentRecord-example-01.json',
    'Bundle-ImmunizationRecord-example-07.json',
    'Bundle-OPConsultNote-example-05.json',
    'Bundle-Prescription-example-06.json',
    'Bundle-WellnessRecord-example-01.json',
    'Bundle-InvoiceRecord-example-01.json',
  ];
  const ids = new Map();
  for (const sd of sds.values()) ids.set(sd.name, new Set(sd.snapshot.element.map((e) => e.id)));
  for (const name of names) {
    const all = Object.values(annotateBundle(example(name), sds));
    assert.ok(all.length > 50, `${name} has annotations`);
    for (const a of all) assert.ok(ids.get(a.profile)?.has(a.element), `${name}: ${a.profile} ${a.element}`);
  }
});

test('an OP consult section matches its slice through code.coding.code, across the coding list', () => {
  const a = annotateBundle(example('Bundle-OPConsultNote-example-05.json'), sds);
  assert.equal(a['entry[0].resource.section[0]'].element, 'Composition.section:ChiefComplaints');
  const code = a['entry[0].resource.section[0].code.coding[0].code'];
  assert.equal(code.element, 'Composition.section:ChiefComplaints.code.coding.code');
  assert.equal(code.fixed, '422843007');
});
