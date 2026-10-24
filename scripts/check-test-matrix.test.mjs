// scripts/check-test-matrix.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {matrixProblems, pageRows} from './check-test-matrix.mjs';

const mdx = [
  '| <Link id="case_1" to="#case_1">CASE_1</Link><br/>Mandatory | **A**<br/>x | 1\\. The token is created\\. | `POST /v3/a` |',
  '| <Link id="case_2" to="#case_2">CASE_2</Link><br/>Optional | **B** | Not stated. | None. |',
].join('\n');
const page = pageRows(mdx);
const ops = new Map([['m2_a', {module: 'm2'}], ['sr_a', {module: 'scan-and-register'}]]);
const journeys = new Map([['m2-flow', new Set(['m2_a'])]]);
const good = () => ({
  page: 'p.mdx',
  cases: [
    {id: 'CASE_1', anchor: 'case_1', marking: {government: 'Mandatory', private: 'Mandatory'}, mandatory: {government: true, private: true},
      expected: '1. The token is created.', apis: [{source: 'https://h/v3/a', path: '/v3/a', spec: 'm2', operations: ['m2_a'], journeys: ['m2-flow']}]},
    {id: 'CASE_2', anchor: 'case_2', marking: {government: 'Optional', private: 'Optional'}, mandatory: {government: false, private: false},
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
  has(run(other), 'operation sr_a is in the scan-and-register spec, not m2');
});

test('a journey that does not exist or does not use the operation fails', () => {
  const m = good();
  m.cases[0].apis[0].journeys = ['m2-nope'];
  has(run(m), 'journey m2-nope does not exist');
  const unused = good();
  unused.cases[0].apis[0].operations = ['sr_a'];
  unused.cases[0].apis[0].spec = 'scan-and-register';
  has(run(unused), 'journey m2-flow uses none of the operations');
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
