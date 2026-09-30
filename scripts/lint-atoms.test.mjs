// scripts/lint-atoms.test.mjs: atom contract v2, as lint-atoms applies it.
import {test} from 'node:test';
import assert from 'node:assert';
import {contractProblems} from './lib/contract.mjs';

const five = '## In plain words\n\na\n\n## Before you start\n\nb\n\n## What happens\n\nc\n\n## How you know it worked\n\nd\n\n## When it goes wrong\n\ne\n';
const ctx = {operations: {hiecm: new Set(['m1_post_profile_verify'])}, atomIds: new Set(['hiecm.endpoint.old'])};
const fm = (over) => ({id: 'hiecm.endpoint.verify', type: 'endpoint', gateway: 'hiecm', sources: [{url: 'u', status: 's'}], ...over});

test('an endpoint atom needs an operation that resolves', () => {
  assert.ok(contractProblems(fm({}), five, ctx).some((p) => p.includes('operation')));
  assert.ok(contractProblems(fm({operation: 'nope_op'}), five, ctx).some((p) => p.includes('operation "nope_op"')));
  assert.deepEqual(contractProblems(fm({operation: 'm1_post_profile_verify'}), five, ctx), []);
});

test('an NHCX endpoint may leave operation out until the NHCX source is decided', () => {
  assert.deepEqual(contractProblems(fm({id: 'nhcx.endpoint.x', gateway: 'nhcx'}), five, ctx), []);
});

test('an error atom needs only In plain words and When it goes wrong', () => {
  const two = '## In plain words\n\na\n\n## When it goes wrong\n\ne\n';
  assert.deepEqual(contractProblems(fm({id: 'hiecm.error.x', type: 'error'}), two, ctx), []);
  assert.ok(contractProblems(fm({id: 'hiecm.error.x', type: 'error'}), '## In plain words\n\na\n', ctx).some((p) => p.includes('## When it goes wrong')));
});

test('a flow still needs all five sections, in order', () => {
  const swapped = five.replace('## Before you start\n\nb\n\n## What happens\n\nc', '## What happens\n\nc\n\n## Before you start\n\nb');
  assert.ok(contractProblems(fm({id: 'hiecm.flow.x', type: 'flow'}), swapped, ctx).some((p) => p.includes('out of order')));
});

test('a fact source must index into sources', () => {
  const bad = fm({operation: 'm1_post_profile_verify', facts: [{key: 'http_status', value: 202, source: 5}]});
  assert.ok(contractProblems(bad, five, ctx).some((p) => p.includes('facts[0].source 5')));
  const good = fm({operation: 'm1_post_profile_verify', facts: [{key: 'http_status', value: 202, source: 0}]});
  assert.deepEqual(contractProblems(good, five, ctx), []);
});

test('side and status take their allowed values, and superseded_by names an atom', () => {
  const p = contractProblems(fm({operation: 'm1_post_profile_verify', side: 'insurer', status: 'retired', superseded_by: 'hiecm.endpoint.gone'}), five, ctx);
  assert.ok(p.some((x) => x.includes('side')));
  assert.ok(p.some((x) => x.includes('status')));
  assert.ok(p.some((x) => x.includes('superseded_by')));
  assert.deepEqual(contractProblems(fm({operation: 'm1_post_profile_verify', side: 'hip', status: 'deprecated', superseded_by: 'hiecm.endpoint.old'}), five, ctx), []);
});

test('a generated atom needs only In plain words', () => {
  assert.deepEqual(contractProblems(fm({id: 'shared.glossary.x', type: 'glossary', gateway: 'shared', generated: true}), '## In plain words\n\na\n', ctx), []);
});
