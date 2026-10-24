import {test} from 'node:test';
import assert from 'node:assert/strict';
import {units} from './check-functionality-skills.mjs';
import {loadPage, applicability, isMandatory} from './lib/test-case-page.mjs';

test('units join wrapped lines, split sentences, drop case id cells and skip quotes', () => {
  const text = [
    '# A title that has many many words in it and would pass the floor easily',
    'A rule that is long enough to count, wrapped across',
    'two lines of the source file. Short sentence here.',
    '```',
    'a code line that is long enough to count as a rule of this skill, surely',
    '```',
    '> A quoted declaration that is long enough to count as a rule, but is quoted.',
    '## Cases',
    'Mandatory for a government entity: none, and that is the whole summary line.',
    '### CRT_ABHA_101: Create ABHA Option',
    'NHA case text that is long enough to count as a rule of this skill, surely.',
    '## Calls',
    '| CRT_ABHA_101, CRT_ABHA_102 | a table row that is long enough to count as a rule of the skill |',
  ].join('\n');
  assert.deepEqual(units(text), [
    'a rule that is long enough to count, wrapped across two lines of the source file.',
    'mandatory for a government entity: none, and that is the whole summary line.',
    'row: a table row that is long enough to count as a rule of the skill',
  ]);
});

test('the M1 page reads as plan reads the workbook', () => {
  const cases = loadPage('m1');
  assert.equal(cases.length, 100);
  const priv = applicability(cases, 'private');
  const gov = applicability(cases, 'government');
  assert.equal(priv.filter((r) => r.na).length, 10);
  assert.equal(priv.find((r) => r.id === 'CRT_ABHA_115').label, 'optional');
  assert.equal(gov.find((r) => r.id === 'CRT_ABHA_114').label, 'mandatory, either CRT_ABHA_114 or CRT_ABHA_115');
  assert.ok(isMandatory(priv.find((r) => r.id === 'SHARE_PATIENT_PROFILE_702')));
  assert.ok(!isMandatory(priv.find((r) => r.id === 'CRT_ABHA_301')));
});
