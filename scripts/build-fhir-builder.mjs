// Writes the data behind "Build a record" on the HIE-CM FHIR page: one file
// per ABDM record type under site/static/fhir-builder/, holding NRCeS's own
// example bundle for it, unchanged, and an annotation per node read from the
// NRCeS profiles. The source is the pinned package only
// (catalogue/openapi/nrces/PINNED); nothing about a profile is written here.
//
// Run with --check to build in memory and fail rather than write, which is
// what CI does: a hash mismatch, a missing example or an annotation naming an
// element its profile does not have all fail it.

import {mkdirSync, rmSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {loadPinnedPackage} from './lib/nrces-package.mjs';
import {annotateBundle, structureDefinitions} from './lib/fhir-annotate.mjs';

/** The eight record types, in the order the FHIR page's table lists them, with its "What it holds". */
export const RECORDS = [
  {key: 'diagnostic-report', label: 'Diagnostic Report Record', holds: 'Radiology and laboratory reports', example: 'Bundle-DiagnosticReport-Lab-example-03.json'},
  {key: 'discharge-summary', label: 'Discharge Summary Record', holds: 'The discharge summary for the ABDM health data set', example: 'Bundle-DischargeSummary-example-04.json'},
  {key: 'health-document', label: 'Health Document Record', holds: 'Unstructured historical records, usually uploaded by patients through a health locker', example: 'Bundle-HealthDocumentRecord-example-01.json'},
  {key: 'immunization', label: 'Immunization Record', holds: 'Immunisations, vaccine certificates and next dose recommendations', example: 'Bundle-ImmunizationRecord-example-07.json'},
  {key: 'op-consult', label: 'OP Consult Record', holds: 'Outpatient notes: examinations, procedures, medications and clinical advice', example: 'Bundle-OPConsultNote-example-05.json'},
  {key: 'prescription', label: 'Prescription Record', holds: 'Medication advice, following Pharmacy Council of India guidelines', example: 'Bundle-Prescription-example-06.json'},
  {key: 'wellness', label: 'Wellness Record', holds: 'Vitals, physical examination and general health data, often captured in a PHR app', example: 'Bundle-WellnessRecord-example-01.json'},
  {key: 'invoice', label: 'Invoice Record', holds: 'Pharmacy invoices, consultation invoices and other billing', example: 'Bundle-InvoiceRecord-example-01.json'},
];

/** The index and one record per type, built from the pinned package. */
export function buildRecords(root) {
  const {files} = loadPinnedPackage(root);
  const sds = structureDefinitions(files);
  const ids = new Map([...sds.values()].map((sd) => [sd.name, new Set(sd.snapshot.element.map((e) => e.id))]));
  const records = new Map();
  for (const {key, label, example} of RECORDS) {
    const raw = files.get(`package/example/${example}`);
    if (!raw) throw new Error(`build-fhir-builder: ${example} is not in the pinned NRCeS package`);
    const bundle = JSON.parse(raw);
    const annotations = annotateBundle(bundle, sds);
    for (const [path, a] of Object.entries(annotations)) {
      if (!ids.get(a.profile)?.has(a.element)) {
        throw new Error(`build-fhir-builder: ${example} ${path} names ${a.profile} ${a.element}, which its profile does not have`);
      }
    }
    records.set(key, {
      key,
      label,
      example,
      exampleUrl: `https://nrces.in/ndhm/fhir/r4/${example.replace(/\.json$/, '')}.html`,
      bundle,
      annotations,
    });
  }
  const index = RECORDS.map(({key, label, holds}) => ({key, label, holds, file: `${key}.json`, exampleUrl: records.get(key).exampleUrl}));
  return {index, records};
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = join(dirname(fileURLToPath(import.meta.url)), '..');
  const {index, records} = buildRecords(root);
  if (process.argv.includes('--check')) {
    console.log(`fhir-builder: ${records.size} record type(s) build from the pinned NRCeS package.`);
  } else {
    const out = join(root, 'site', 'static', 'fhir-builder');
    rmSync(out, {recursive: true, force: true});
    mkdirSync(out, {recursive: true});
    writeFileSync(join(out, 'index.json'), JSON.stringify(index));
    for (const [key, record] of records) writeFileSync(join(out, `${key}.json`), JSON.stringify(record));
    console.log(`Built fhir-builder: ${records.size} record type(s) into site/static/fhir-builder/.`);
  }
}
