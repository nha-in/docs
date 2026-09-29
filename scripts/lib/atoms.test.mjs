import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadAtoms} from './atoms.mjs';

test('two files carrying one id are a duplicate naming both', () => {
  const dir = mkdtempSync(join(tmpdir(), 'atoms-'));
  for (const f of ['hiecm/concepts/a.md', 'shared/concepts/a.md']) {
    mkdirSync(join(dir, f, '..'), {recursive: true});
    writeFileSync(join(dir, f), '---\nid: hiecm.concept.a\n---\nbody\n');
  }
  const {duplicates} = loadAtoms(dir);
  assert.equal(duplicates.length, 1);
  assert.match(duplicates[0], /^hiecm\.concept\.a: .*hiecm\/concepts\/a\.md, .*shared\/concepts\/a\.md$/);
});
