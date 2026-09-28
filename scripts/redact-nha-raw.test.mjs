// The redactor on a throwaway raw set: an HPR address keeps its suffix and
// reads as an HPR address, and a binary file is hashed but never rewritten.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdirSync, writeFileSync, readFileSync, rmSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const SET = '__redact-test__';
const dir = join(root, 'catalogue', 'openapi', '.raw', SET);
const sha = (b) => createHash('sha256').update(b).digest('hex');

test('in a UHI set a name is a person only under a person-shaped parent', () => {
  const uhi = join(root, 'catalogue', 'openapi', '.raw', '__redact-test-uhi');
  rmSync(uhi, {recursive: true, force: true});
  mkdirSync(uhi, {recursive: true});
  try {
    const yaml = [
      'parameters:',
      '  - name: Authorization',
      'item:',
      '  descriptor:',
      '    name: Consultation',
      'agent:',
      '  id: drmehra@hpr.ndhm',
      '  name: Ganesh Vikram Borse',
      'billing:',
      "  name: 'Manish Pravin Kahane'",
      '',
    ].join('\n');
    const md = '{"descriptor": {"name": "Commercial Terms"}, "agent": {"id": "x", "name": "Santosh Ramchandra Jagtap"}, "category": {"descriptor": {"name": "Whole Blood"}}, "person": [{"name": "Kushal Pandita"}]}\n';
    writeFileSync(join(uhi, 'spec.yaml'), yaml);
    writeFileSync(join(uhi, 'doc.md'), md);
    execFileSync('node', [join(root, 'scripts', 'redact-nha-raw.mjs')], {
      env: {...process.env, RAW_SET: '__redact-test-uhi', ORIGINAL_HASHES: `spec.yaml=${sha(yaml)},doc.md=${sha(md)}`},
    });
    const outYaml = readFileSync(join(uhi, 'spec.yaml'), 'utf8');
    assert.match(outYaml, /- name: Authorization/);
    assert.match(outYaml, /name: Consultation/);
    assert.doesNotMatch(outYaml, /Ganesh|Manish/);
    const outMd = readFileSync(join(uhi, 'doc.md'), 'utf8');
    assert.match(outMd, /"name": "Commercial Terms"/);
    assert.match(outMd, /"name": "Whole Blood"/);
    assert.doesNotMatch(outMd, /Santosh/);
    assert.doesNotMatch(outMd, /Kushal/, 'a person inside an array under a person-shaped key');
  } finally {
    rmSync(uhi, {recursive: true, force: true});
  }
});

test('names passed in REDACT_NAMES are removed wherever they stand, and never written to the repo', () => {
  const set = join(root, 'catalogue', 'openapi', '.raw', '__redact-test-names');
  rmSync(set, {recursive: true, force: true});
  mkdirSync(set, {recursive: true});
  try {
    const md = '| order.billing.name | string | Yes | Patient billing name | Kushal Pandita |\n1. Anagha Vinod - support\n"name": "contactPerson - DIGHE"\n';
    writeFileSync(join(set, 'doc.md'), md);
    execFileSync('node', [join(root, 'scripts', 'redact-nha-raw.mjs')], {
      env: {...process.env, RAW_SET: '__redact-test-names', ORIGINAL_HASHES: `doc.md=${sha(md)}`, REDACT_NAMES: 'Kushal Pandita|Anagha Vinod|DIGHE'},
    });
    const out = readFileSync(join(set, 'doc.md'), 'utf8');
    assert.doesNotMatch(out, /Kushal|Anagha|DIGHE/);
    assert.match(out, /\| <NAME> \|/);
    assert.match(out, /contactPerson - <NAME>/);
    assert.doesNotMatch(readFileSync(join(set, 'MANIFEST.md'), 'utf8'), /Kushal|Anagha|DIGHE/);
  } finally {
    rmSync(set, {recursive: true, force: true});
  }
});

test('HPR addresses become placeholders with their suffix, and binaries are left byte for byte', () => {
  rmSync(dir, {recursive: true, force: true});
  mkdirSync(dir, {recursive: true});
  try {
    const yaml = 'agent:\n  id: drmehra@hpr.ndhm\n';
    const docx = Buffer.concat([Buffer.from('PK\x03\x04'), Buffer.from(' contact x.y@gmail.com 9876543210 drmehra@hpr.ndhm '), Buffer.from([0, 255, 254, 0])]);
    writeFileSync(join(dir, 'sample.yaml'), yaml);
    writeFileSync(join(dir, 'guide.docx'), docx);
    execFileSync('node', [join(root, 'scripts', 'redact-nha-raw.mjs')], {
      env: {...process.env, RAW_SET: SET, ORIGINAL_HASHES: `sample.yaml=${sha(yaml)}`},
    });
    const out = readFileSync(join(dir, 'sample.yaml'), 'utf8');
    assert.match(out, /id: <HPR_ADDRESS>@hpr\.ndhm/);
    assert.doesNotMatch(out, /drmehra/);
    assert.ok(readFileSync(join(dir, 'guide.docx')).equals(docx), 'the docx must not be rewritten');
    const manifest = readFileSync(join(dir, 'MANIFEST.md'), 'utf8');
    assert.match(manifest, /\| `sample\.yaml` \| `[0-9a-f]{64}` \| `[0-9a-f]{64}` \| hpr-address 1 \|/);
    assert.match(manifest, new RegExp(`\\| \`guide\\.docx\` \\| \`${sha(docx)}\` \\| \`${sha(docx)}\` \\| none \\|`));
  } finally {
    rmSync(dir, {recursive: true, force: true});
  }
});
