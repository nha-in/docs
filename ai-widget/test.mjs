// The pieces with logic in them: the markdown the model streams, the event
// stream it arrives on, and the scripted install flow. Run with `node test.mjs`.
import assert from 'node:assert/strict';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'esbuild';

const out = join(tmpdir(), `abdm-widget-test-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `export {toBlocks, absolute, headings} from './src/markdown';
               export {readStream} from './src/sse';
               export {revealStep, THINKING_HOLD, THINKING_BURST} from './src/pacing';
               export {say, answer, wantsTools, needsAgent, TOOLS, AGENTS} from './src/install';`,
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
const {
  toBlocks, absolute, headings, readStream, revealStep, THINKING_HOLD, THINKING_BURST,
  say, answer, wantsTools, needsAgent, TOOLS, AGENTS,
} = await import(out);

// Headings: the second level only, fenced code left alone, markers stripped.
assert.deepEqual(headings('# Page\n## One\n### Deeper\n## `Two`'), ['One', 'Two']);
assert.deepEqual(headings('```sh\n## not a heading\n```\n## Real'), ['Real']);
assert.deepEqual(headings('no headings here'), []);

// Pacing: hold while thinking, drain a share of the backlog, never overrun it.
assert.equal(revealStep(0, 9999, true, false), 0);
assert.equal(revealStep(10, 0, false, false), 0, 'holds during the think');
assert.equal(revealStep(THINKING_BURST, 0, false, false) > 0, true, 'a big burst does not wait');
assert.equal(revealStep(10, THINKING_HOLD, false, false) > 0, true, 'the hold expires');
assert.equal(revealStep(600, 9999, true, false), 100, 'a sixth of the backlog');
assert.equal(revealStep(1, 9999, true, false), 1, 'never more than is waiting');
assert.equal(revealStep(600, 0, false, true), 600, 'reduced motion shows it all');

// Markdown: a paragraph, a list, and a fence that has not closed yet.
assert.deepEqual(toBlocks('one\ntwo'), [{kind: 'p', text: 'one two'}]);
assert.deepEqual(toBlocks('- a\n- b'), [{kind: 'ul', items: ['a', 'b']}]);
assert.deepEqual(toBlocks('1. a\n2. b'), [{kind: 'ol', items: ['a', 'b']}]);
assert.deepEqual(toBlocks('```json\n{"a":1}'), [
  {kind: 'code', text: '{"a":1}', lang: 'json', closed: false},
]);

// A diagram is only a diagram once its fence has closed. Half of one is a
// syntax error, and mermaid draws syntax errors rather than throwing them.
assert.deepEqual(toBlocks('```mermaid\nsequenceDiagram\n```'), [
  {kind: 'code', text: 'sequenceDiagram', lang: 'mermaid', closed: true},
]);
assert.deepEqual(toBlocks('```mermaid\nsequenceDiagram'), [
  {kind: 'code', text: 'sequenceDiagram', lang: 'mermaid', closed: false},
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

// The install flow is offered to somebody doing the work, not to somebody
// reading. These are the panel's own opening questions and the shapes a
// reader in trouble actually types.
for (const asked of [
  'What is a care context?',
  'What format does the TIMESTAMP header need?',
  'What does ABDM stand for?',
  'Who runs the HIE-CM gateway?',
]) {
  assert.equal(wantsTools(asked), false, `should not offer tools for: ${asked}`);
}
for (const asked of [
  'How do I integrate M2 into my HIP?',
  'I want to implement consent management',
  'help me debug ABDM-1016',
  'my link request keeps failing',
  'how do I create an ABHA with an Aadhaar OTP?',
  'the callback is not working',
  'What does ABDM-1016 mean and how do I fix it?',
  'how do I set up the sandbox?',
]) {
  assert.equal(wantsTools(asked), true, `should offer tools for: ${asked}`);
}

// The flow: three tools, four agents, and every tool asks which agent. The
// plugin used to skip that question when it was Claude Code's alone.
const ctx = {
  docsOrigin: 'https://d.example/',
  mcpUrl: 'https://mcp.example/x',
  pluginRepo: 'example-org/example-docs',
};
assert.deepEqual(TOOLS.map((t) => t.id), ['skills', 'mcp', 'plugin']);
assert.deepEqual(AGENTS.map((a) => a.id), ['claude', 'codex', 'cursor', 'other']);
for (const tool of ['skills', 'mcp', 'plugin']) {
  assert.equal(needsAgent(tool), true, `${tool} should ask which agent`);
}

// Every combination says something, and the command it hands out is fenced
// so the panel's own code block renders it with its copy button.
for (const tool of ['skills', 'mcp', 'plugin']) {
  for (const agent of ['claude', 'codex', 'cursor', 'other']) {
    const step = {at: 'answer', tool, agent, named: agent === 'other' ? 'Zed' : undefined};
    const {text, link} = answer(step, ctx);
    assert.equal(typeof text, 'string');
    assert.equal(text.length > 0, true, `${tool}/${agent} says nothing`);
    assert.equal(text.includes('\u2014'), false, 'no em dash');
    if (link) assert.match(link.href, /^(claude|cursor|https):/);
  }
}
assert.match(answer({at: 'answer', tool: 'mcp', agent: 'claude'}, ctx).text,
  /claude mcp add --transport http abdm-docs https:\/\/mcp\.example\/x -s user/);
assert.match(answer({at: 'answer', tool: 'skills', agent: 'other', named: 'Zed'}, ctx).text,
  /Zed included/);
assert.match(answer({at: 'answer', tool: 'plugin', agent: 'claude'}, ctx).text,
  /claude plugin marketplace add example-org\/example-docs/);
// Codex installs the same plugin from the same repository, since Agent
// Plugins 1.0. Cursor reads the standard but installs from its own
// marketplace, so it is told that rather than given a command that fails.
assert.match(answer({at: 'answer', tool: 'plugin', agent: 'codex'}, ctx).text,
  /codex plugin marketplace add example-org\/example-docs/);
const cursorPlugin = answer({at: 'answer', tool: 'plugin', agent: 'cursor'}, ctx);
assert.equal(cursorPlugin.text.includes('```'), false, 'no command Cursor cannot run');
assert.match(cursorPlugin.text, /not listed in one yet/);

// No MCP address in this build is a sentence, never a placeholder command.
const locked = answer({at: 'answer', tool: 'mcp', agent: 'claude'},
  {docsOrigin: 'https://d.example', mcpUrl: null, pluginRepo: 'example-org/example-docs'});
assert.equal(locked.text.includes('```'), false, 'no command without an address');
assert.match(locked.text, /does not carry its address/);

// The steps before the answer: the overview, then the one question.
assert.match(say({at: 'tools'}, ctx), /Skills/);
assert.match(say({at: 'agents', tool: 'mcp'}, ctx), /Which agent are you working in\?/);

console.log('ok');
