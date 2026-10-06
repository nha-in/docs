import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, readFileSync, writeFileSync, symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {loadPinnedPackage, readTar} from './nrces-package.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const EXAMPLES = [
  'Bundle-DiagnosticReport-Lab-example-03.json',
  'Bundle-DischargeSummary-example-04.json',
  'Bundle-HealthDocumentRecord-example-01.json',
  'Bundle-ImmunizationRecord-example-07.json',
  'Bundle-OPConsultNote-example-05.json',
  'Bundle-Prescription-example-06.json',
  'Bundle-WellnessRecord-example-01.json',
  'Bundle-InvoiceRecord-example-01.json',
];

test('loads the pinned package and its eight examples', () => {
  const {version, files} = loadPinnedPackage(root);
  assert.equal(version, '6.5.0');
  for (const name of EXAMPLES) assert.ok(files.has(`package/example/${name}`), name);
  const ig = JSON.parse(files.get('package/ImplementationGuide-ndhm.in.json'));
  assert.equal(ig.version, '6.5.0');
});

test('rejects a package whose hash differs', () => {
  const dir = mkdtempSync(join(tmpdir(), 'nrces-'));
  const pinned = readFileSync(join(root, 'catalogue/openapi/nrces/PINNED'), 'utf8');
  mkdirSync(join(dir, 'catalogue/openapi/nrces'), {recursive: true});
  writeFileSync(
    join(dir, 'catalogue/openapi/nrces/PINNED'),
    pinned.replace(/^sha256: .*$/m, `sha256: ${'0'.repeat(64)}`),
  );
  const tgz = pinned.match(/^file: (.*)$/m)[1].trim();
  mkdirSync(join(dir, dirname(tgz)), {recursive: true});
  symlinkSync(join(root, tgz), join(dir, tgz));
  assert.throws(() => loadPinnedPackage(dir), /nrces package hash mismatch/);
});

/** One ustar entry: a 512 byte header, then the data padded to 512. */
function entry(name, data) {
  const header = Buffer.alloc(512);
  header.write(name, 0, 'utf8');
  header.write(data.length.toString(8).padStart(11, '0') + '\0', 124, 'ascii');
  header.write('0', 156, 'ascii');
  header.write('ustar\0', 257, 'ascii');
  const body = Buffer.alloc(Math.ceil(data.length / 512) * 512);
  data.copy(body);
  return Buffer.concat([header, body]);
}

test('readTar returns file contents byte for byte', () => {
  const a = Buffer.from('{"a":1}');
  const b = Buffer.alloc(700, 7);
  const tar = Buffer.concat([entry('package/a.json', a), entry('package/b.bin', b), Buffer.alloc(1024)]);
  const files = readTar(tar);
  assert.deepEqual([...files.keys()], ['package/a.json', 'package/b.bin']);
  assert.ok(files.get('package/a.json').equals(a));
  assert.ok(files.get('package/b.bin').equals(b));
});
