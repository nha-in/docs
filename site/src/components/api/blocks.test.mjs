// An NHCX description is a short document: `###` sections, lists under them
// and a closing paragraph. These are the shapes the specifications ship.
//
// Run: node --test site/src/components/api/blocks.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import esbuild from 'esbuild';

const ts = readFileSync(new URL('./blocks.ts', import.meta.url), 'utf8');
const {code} = await esbuild.transform(ts, {loader: 'ts', format: 'esm'});
const {blocks} = await import(`data:text/javascript,${encodeURIComponent(code)}`);

test('a hard wrapped paragraph is one paragraph', () => {
  assert.deepEqual(blocks('Fetch the public\ncertificate.\n\nThen use it.'), [
    {kind: 'paragraph', lines: ['Fetch the public', 'certificate.']},
    {kind: 'paragraph', lines: ['Then use it.']},
  ]);
});

test('a heading is a block of its own, with or without a blank line after it', () => {
  assert.deepEqual(blocks('### When to use\nAfter discharge.'), [
    {kind: 'heading', level: 3, text: 'When to use'},
    {kind: 'paragraph', lines: ['After discharge.']},
  ]);
});

test('consecutive items are one list, and each item is its own entry', () => {
  assert.deepEqual(blocks('### Preconditions\n\n- An approved preauth exists.\n- Claim.use is claim.'), [
    {kind: 'heading', level: 3, text: 'Preconditions'},
    {kind: 'list', ordered: false, items: ['An approved preauth exists.', 'Claim.use is claim.']},
  ]);
});

test('a list may follow its opening sentence with no blank line', () => {
  assert.deepEqual(blocks('Send these:\n- one\n- two'), [
    {kind: 'paragraph', lines: ['Send these:']},
    {kind: 'list', ordered: false, items: ['one', 'two']},
  ]);
});

test('a wrapped item continues the item, not a new paragraph', () => {
  assert.deepEqual(blocks('- a long\n  item\n- next'), [
    {kind: 'list', ordered: false, items: ['a long item', 'next']},
  ]);
});

test('numbered items are an ordered list, apart from a bulleted one', () => {
  assert.deepEqual(blocks('1. first\n2. second\n- loose'), [
    {kind: 'list', ordered: true, items: ['first', 'second']},
    {kind: 'list', ordered: false, items: ['loose']},
  ]);
});

test('a hyphen inside a sentence is not a list', () => {
  assert.deepEqual(blocks('Codes PAYR-1301 - PAYR-1302 apply.'), [
    {kind: 'paragraph', lines: ['Codes PAYR-1301 - PAYR-1302 apply.']},
  ]);
});
