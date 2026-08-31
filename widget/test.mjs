// The two pieces with logic in them: the markdown the model streams, and the
// event stream it arrives on. Run with `node test.mjs`.
import assert from 'node:assert/strict';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'esbuild';

const out = join(tmpdir(), `abdm-widget-test-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `export {toBlocks, absolute} from './src/markdown';
               export {readStream} from './src/sse';`,
    resolveDir: import.meta.dirname,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  loader: {'.css': 'text'},
  outfile: out,
});
const {toBlocks, absolute, readStream} = await import(out);

// Markdown: a paragraph, a list, and a fence that has not closed yet.
assert.deepEqual(toBlocks('one\ntwo'), [{kind: 'p', text: 'one two'}]);
assert.deepEqual(toBlocks('- a\n- b'), [{kind: 'ul', items: ['a', 'b']}]);
assert.deepEqual(toBlocks('1. a\n2. b'), [{kind: 'ol', items: ['a', 'b']}]);
assert.deepEqual(toBlocks('```json\n{"a":1}'), [
  {kind: 'code', text: '{"a":1}'},
]);

// Links resolve against the docs origin, and only http(s) survives.
assert.equal(absolute('/docs/m1', 'https://d.example/'), 'https://d.example/docs/m1');
assert.equal(absolute('https://x.test/a', 'https://d.example'), 'https://x.test/a');
assert.equal(absolute('javascript:alert(1)', 'https://d.example'), null);

// The stream: events split on blank lines, deltas concatenated, a payload
// that arrives in two chunks mid-event still parses.
const chunks = [
  'event: tool\ndata: {"name":"search","detail":"Consulting the catalogue"}\n\n',
  'event: text\ndata: {"delta":"Hel',
  'lo"}\n\nevent: text\ndata: {"delta":" there"}\n\n',
  'event: sources\ndata: [{"id":"a","title":"A","status":"verified","url":"/docs/a"}]\n\n',
  'event: done\ndata: {}\n\n',
];
const encoder = new TextEncoder();
const stream = new ReadableStream({
  start(controller) {
    for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
    controller.close();
  },
});
let text = '';
let tool = null;
let sources = null;
await readStream(stream, {
  onText: (delta) => (text += delta),
  onTool: (detail) => (tool = detail),
  onSources: (s) => (sources = s),
  onError: () => assert.fail('no error expected'),
});
assert.equal(text, 'Hello there');
assert.equal(tool, 'Consulting the catalogue');
assert.deepEqual(sources, [
  {id: 'a', title: 'A', status: 'verified', url: '/docs/a'},
]);

console.log('ok');
