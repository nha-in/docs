import {test} from 'node:test';
import assert from 'node:assert/strict';
import {units} from './check-functionality-skills.mjs';
import {loadPage, applicability, isMandatory} from './lib/test-case-page.mjs';

test('units skip headings, code, short lines and the quoted cases', () => {
  const text = [
    '# Title with many many words in it to pass the twelve word floor ok',
    'A line that is long enough to count as a rule of this skill, surely.',
    'Too short to count.',
    '```',
    'a code line that is long enough to count as a rule of this skill, surely',
    '```',
    '## Cases',
    'NHA case text that is long enough to count as a rule of this skill, surely.',
    '## Calls',
    '| a | table row that is long enough to count as a rule of this skill | x |',
  ].join('\n');
  assert.deepEqual(units(text), [
    'A line that is long enough to count as a rule of this skill, surely.',
    '| a | table row that is long enough to count as a rule of this skill | x |',
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
