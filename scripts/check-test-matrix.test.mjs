// scripts/check-test-matrix.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {matrixProblems, pageRows} from './check-test-matrix.mjs';

const mdx = [
  '| <Link id="case_1" to="#case_1">CASE_1</Link><br/>Mandatory | **A**<br/>x | 1\\. The token is created\\.<br/>*For the tester:* note | `POST /v3/a` |',
  '| <Link id="case_2" to="#case_2">CASE_2</Link><br/>Optional | **B** | Not stated. | None. |',
].join('\n');
const page = pageRows(mdx);
const ops = new Map([['m2_a', {module: 'm2'}], ['sr_a', {module: 'scan-and-register'}]]);
const journeys = new Map([['m2-flow', Object.assign(new Set(['m2_a']), {module: 'm2'})], ['sr-flow', Object.assign(new Set(['sr_a']), {module: 'scan-and-register'})]]);
const good = () => ({
  page: 'p.mdx',
  specs: ['m2'],
  cases: [
    {id: 'CASE_1', anchor: 'case_1', marking: {government: 'mandatory', private: 'mandatory'}, mandatory: {government: true, private: true},
      expected: '1. The token is created.', apis: [{source: 'https://h/v3/a', path: '/v3/a', spec: 'm2', operations: ['m2_a'], journeys: ['m2-flow']}]},
    {id: 'CASE_2', anchor: 'case_2', marking: {government: 'optional', private: 'optional'}, mandatory: {government: false, private: false},
      expected: '', apis: [{source: 'https://h/docs?x=1', path: '/docs', unresolved: true, reason: 'a docs link'}]},
  ],
});
const run = (matrix, over = {}) => matrixProblems({matrix, name: 'm.json', page, ops, journeys, ...over});
const has = (problems, text) => assert.ok(problems.some((p) => p.includes(text)), `expected "${text}" in:\n${problems.join('\n')}`);

test('the page parser reads each case and its Pass when cell', () => {
  assert.deepEqual(page.map((r) => r.id), ['CASE_1', 'CASE_2']);
});

test('a clean matrix has no problems', () => {
  assert.deepEqual(run(good()), []);
});

test('a case on the page but not in the matrix, or the reverse, fails', () => {
  const dropped = good();
  dropped.cases.pop();
  has(run(dropped), 'case CASE_2: is on p.mdx but in no matrix');
  const extra = good();
  extra.cases.push({...extra.cases[0], id: 'CASE_9', anchor: 'case_9'});
  has(run(extra), 'case CASE_9: is not on p.mdx');
});

test('an Expected Result that differs from the page fails', () => {
  const m = good();
  m.cases[0].expected = 'The token is deleted.';
  has(run(m), 'Expected Result differs');
});

test('an operation that does not exist, or lives in another spec, fails', () => {
  const missing = good();
  missing.cases[0].apis[0].operations = ['m2_nope'];
  has(run(missing), 'operation m2_nope is in no spec');
  const other = good();
  other.cases[0].apis[0].operations = ['sr_a'];
  has(run(other), 'operation sr_a is in the scan-and-register spec, not m2: flag it other_module');
  const drives = good();
  Object.assign(drives.cases[0].apis[0], {operations: ['sr_a'], other_module: true});
  has(run(drives), 'an other_module operation must not drive journeys');
  const claimed = good();
  claimed.cases[0].apis[0].other_module = true;
  has(run(claimed), "operation m2_a is in this module's m2 spec but the row says other_module");
});

test('a journey that does not exist or does not use the operation fails', () => {
  const m = good();
  m.cases[0].apis[0].journeys = ['m2-nope'];
  has(run(m), 'journey m2-nope does not exist');
  const unused = good();
  unused.cases[0].apis[0].journeys = ['sr-flow'];
  has(run(unused), 'journey sr-flow belongs to the scan-and-register journeys, not m2');
});

test('a path neither resolved nor flagged, or flagged without a reason, fails', () => {
  const bare = good();
  bare.cases[0].apis = [{source: 'x', path: '/x'}];
  has(run(bare), 'neither resolved to an operation nor flagged unresolved');
  const noReason = good();
  delete noReason.cases[1].apis[0].reason;
  has(run(noReason), 'unresolved but no reason is given');
});

test('a missing marking fails', () => {
  const m = good();
  delete m.cases[0].marking.private;
  has(run(m), 'no marking for private');
});

test('an Expected Result that is longer or shorter than the page\'s fails; a tester note is not part of it', () => {
  const m = good();
  assert.deepEqual(run(m), []);
  m.cases[0].expected = '1. The token is created. And more.';
  has(run(m), 'Expected Result differs');
  const shorter = good();
  shorter.cases[0].expected = '1. The token';
  has(run(shorter), 'Expected Result differs');
});

test('a mandatory flag that plan\'s marking contradicts fails', () => {
  const m = good();
  m.cases[0].mandatory.private = false;
  has(run(m), 'mandatory is false for private but plan prints "mandatory"');
});

test('a case whose sheet lists APIs but whose matrix has none fails', () => {
  const m = good();
  m.cases[0].apis = [];
  has(run(m), 'the sheet lists APIs for this case but the matrix has none');
});

test('a repeated id keeps its #n and still matches the page', () => {
  const m = good();
  m.cases[0].id = 'CASE_1#2';
  assert.deepEqual(run(m), []);
});
