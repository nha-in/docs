// scripts/check-test-mapping.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {checkFiles, mappingProblems, pageCases} from './check-test-mapping.mjs';

const page = [
  {id: 'CASE_1', apis: ['/v3/a', '/v3/b/{n}']},
  {id: 'CASE_2', apis: []},
];
const journeys = new Map([
  ['m1', new Map([['m1-flow', new Set(['m1_a', 'm1_b'])], ['m1-other', new Set(['m1_c'])]])],
  ['scan-and-register', new Map([['sr-flow', new Set(['sr_a'])]])],
]);
const ops = new Map([
  ['m1_a', {module: 'm1', path: '/v3/a'}],
  ['m1_b', {module: 'm1', path: '/v3/b/{n}'}],
  ['m1_c', {module: 'm1', path: '/v3/c'}],
  ['sr_a', {module: 'scan-and-register', path: '/v3/share'}],
]);
const skills = new Set(['abdm-m1', 'abdm-scan-and-register']);

const good = () => ({
  module: 'm1',
  functionalities: [
    {id: 'do-a', title: 'Do A', skill: 'abdm-m1', journeys: ['m1-flow'], applies: 'all', cases: [
      {id: 'CASE_1', screen: 'A screen', ops: ['m1_a', 'm1_b'], needs: ['otp'], source: 'apis-column'},
    ]},
    {id: 'check-b', title: 'Check B', skill: 'abdm-m1', journeys: [], applies: 'all', cases: [
      {id: 'CASE_2', screen: 'B screen', ops: [], needs: [], source: 'reviewed', reason: 'Screen only.'},
    ]},
  ],
});
const run = (mapping, over = {}) => mappingProblems({mapping, name: 't.yaml', page, journeys, ops, skills, ...over});
const has = (problems, text) => assert.ok(problems.some((p) => p.includes(text)), `expected "${text}" in:\n${problems.join('\n')}`);

test('a clean mapping has no problems', () => {
  assert.deepEqual(run(good()), []);
});

test('a case missing from the mapping, mapped twice, or not on the page fails', () => {
  const m = good();
  m.functionalities[1].cases = [];
  has(run(m), 'case CASE_2 has no functionality');
  const twice = good();
  twice.functionalities[1].cases.push({...twice.functionalities[0].cases[0], source: 'reviewed', reason: 'x'});
  has(run(twice), 'mapped twice');
  const extra = good();
  extra.functionalities[1].cases.push({id: 'CASE_9', screen: 's', ops: [], needs: [], source: 'reviewed', reason: 'x'});
  has(run(extra), 'case CASE_9 is not on the page');
});

test('a journey from another module, or none at all, fails', () => {
  const m = good();
  m.functionalities[0].journeys.push('sr-flow');
  has(run(m), "journey sr-flow is not in m1's journeys file");
  const missing = good();
  missing.functionalities[0].journeys = ['m1-nope'];
  has(run(missing), 'journey m1-nope is not in');
});

test('a functionality whose skill is another module uses that module\'s journeys and operations', () => {
  const m = good();
  m.functionalities.push({id: 'share', title: 'Share', skill: 'abdm-scan-and-register', journeys: ['sr-flow'], applies: 'all', cases: []});
  m.functionalities[1].cases[0] = {id: 'CASE_2', screen: 's', ops: ['sr_a'], needs: [], source: 'reviewed', reason: 'x'};
  m.functionalities[2].cases = [m.functionalities[1].cases.pop()];
  assert.deepEqual(run(m).filter((p) => !p.includes('check-b')), []);
  m.functionalities[2].cases[0].ops = ['m1_a'];
  has(run(m), 'operation m1_a is in the m1 spec, not abdm-scan-and-register\'s');
});

test('an unknown operation, or one no listed journey uses, fails', () => {
  const m = good();
  m.functionalities[0].cases[0].ops = ['m1_fake'];
  has(run(m), 'operation m1_fake is in no spec');
  const off = good();
  off.functionalities[0].cases[0] = {...off.functionalities[0].cases[0], ops: ['m1_c'], source: 'reviewed', reason: 'x'};
  has(run(off), 'operation m1_c is a step of none of this functionality\'s journeys');
});

test('apis-column is checked against the case\'s APIs column, and needs ops', () => {
  const m = good();
  m.functionalities[0].journeys.push('m1-other');
  m.functionalities[0].cases[0].ops = ['m1_a', 'm1_c'];
  has(run(m), '/v3/c (m1_c) is not in the case\'s APIs column');
  const empty = good();
  empty.functionalities[0].cases[0].ops = [];
  has(run(empty), 'source is apis-column but no ops are given');
});

test('a functionality with no journeys fails unless every case is screen only with a reason', () => {
  const m = good();
  m.functionalities[1].cases[0].ops = ['m1_a'];
  has(run(m), 'no journeys, so every case must be screen only');
  const noReason = good();
  delete noReason.functionalities[1].cases[0].reason;
  has(run(noReason), 'no journeys, so every case must be screen only');
  has(run(noReason), 'source is reviewed but no reason is given');
});

test('a page with no cases fails', () => {
  has(run(good(), {page: []}), 'the page has no cases');
});

test('ops, needs, screen and source are required per case', () => {
  for (const key of ['ops', 'needs', 'screen', 'source']) {
    const m = good();
    delete m.functionalities[1].cases[0][key];
    has(run(m), `no ${key} key`);
  }
});

test('duplicate functionality ids, an unknown skill and a need listed twice fail', () => {
  const m = good();
  m.functionalities[1].id = 'do-a';
  has(run(m), 'id used twice');
  const skill = good();
  skill.functionalities[0].skill = 'm1';
  has(run(skill), 'skill "m1" is not a skill folder');
  const twice = good();
  twice.functionalities[0].cases[0].needs = ['otp', 'otp'];
  has(run(twice), 'need "otp" listed twice');
  const unknown = good();
  unknown.functionalities[0].cases[0].needs = ['fresh-aadhaar'];
  has(run(unknown), 'need "fresh-aadhaar" is not one of');
});

test('gaps need source reviewed with a reason, and a step and note each', () => {
  const m = good();
  m.functionalities[0].cases[0].gaps = [{step: 5, note: 'No operation.'}];
  has(run(m), 'a case with gaps must be source: reviewed with a reason');
  const shape = good();
  shape.functionalities[1].cases[0].gaps = [{step: 1}];
  has(run(shape), 'every gap needs a step and a note');
  const ok = good();
  ok.functionalities[1].cases[0].gaps = [{step: 1, note: 'No operation.'}];
  assert.deepEqual(run(ok), []);
});

test('the page parser reads ids and APIs paths, {{x}} as {x}', () => {
  const mdx = '| <Link id="a_1" to="#a_1">A_ 1</Link><br/>Mandatory | t | p | `/v3/a`<br/>[`GET /v3/b/{{n}}`](/docs/x)<br/>`/sandbox/v3/new-documentation/swagger` |\n';
  assert.deepEqual(pageCases(mdx), [{id: 'A_1', apis: ['/v3/a', '/v3/b/{n}', '/sandbox/v3/new-documentation/swagger']}]);
});

test('no mapping file, or a yaml without module, fails', () => {
  has(checkFiles([]).problems, 'no mapping file was checked');
  const dir = mkdtempSync(join(tmpdir(), 'test-mapping-'));
  writeFileSync(join(dir, 'x.yaml'), 'functionalities: []\n');
  const {problems} = checkFiles([join(dir, 'x.yaml')]);
  has(problems, 'no module key');
  has(problems, 'no mapping file was checked');
});

test('the shipped mappings pass', () => {
  assert.deepEqual(checkFiles([join(import.meta.dirname, '..', 'catalogue', 'hiecm', 'tests', 'm1.yaml')]).problems, []);
});
