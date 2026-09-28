// scripts/migration-report.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {apiLiterals, compare} from './migration-report.mjs';

test('api literals are backticked spans, error codes and paths', () => {
  assert.deepEqual([...apiLiterals('Send `linkToken` to /v3/link. ABDM-1062 means expired.')].sort(), ['/v3/link', 'ABDM-1062', 'linkToken']);
});

test('a literal the new text lost is reported, unless dropped with a reason', () => {
  assert.deepEqual(compare('Use `linkToken` on /v3/link.', 'Use `linkToken`.', new Map()).missing, ['/v3/link']);
  assert.deepEqual(compare('Use `linkToken` on /v3/link.', 'Use `linkToken`.', new Map([['/v3/link', 'path retired by NHA']])).missing, []);
});

test('word counts are reported before and after', () => {
  const r = compare('one two three', 'one two', new Map());
  assert.equal(r.wordsBefore, 3);
  assert.equal(r.wordsAfter, 2);
});
