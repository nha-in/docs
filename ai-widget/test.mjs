// The pieces with logic in them: the markdown the model streams, the event
// stream it arrives on, and the scripted install flow. Run with `node test.mjs`.
import assert from 'node:assert/strict';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {build} from 'esbuild';

const out = join(tmpdir(), `abdm-widget-test-${process.pid}.mjs`);
await build({
  stdin: {
    contents: `export {toBlocks, absolute, headings, linkFor} from './src/markdown';
               export {readStream, failureMessage, UNREACHABLE} from './src/sse';
               export {revealStep, THINKING_HOLD, THINKING_BURST} from './src/pacing';
               export {say, answer, wantsTools, needsAgent, TOOLS, AGENTS} from './src/install';
               export {titleOf, remember, whenSaid, forgetOne, resumable} from './src/history';
               export {ABOUT, isAboutQuestion} from './src/about';
               export {startersFrom, DEFAULT_STARTERS} from './src/starters';
               export {forModel, memoryOf, sentFrom} from './src/transcript';
               export {parseLlms, searchPages, pageUrl, markdownUrl, isHtmlDocument} from './src/pages';
               export {moduleLabel, skillNote, COMMANDS, slashMatches} from './src/commands';
               export {CLOSED, offering, related, shownOf, trayKey} from './src/next';`,
    resolveDir: import.meta.dirname,
    loader: 'ts',
  },
  bundle: true,
  format: 'esm',
  jsx: 'automatic',
  jsxImportSource: 'preact',
  // The orb's shader library is written against React. Preact's compat layer
  // stands in for it, so the widget ships one small runtime rather than two.
  alias: {
    react: 'preact/compat',
    'react-dom': 'preact/compat',
    'react/jsx-runtime': 'preact/jsx-runtime',
  },
  loader: {'.css': 'text'},
  outfile: out,
});
const {
  toBlocks, absolute, headings, linkFor, readStream, failureMessage, UNREACHABLE, revealStep, THINKING_HOLD, THINKING_BURST,
  say, answer, wantsTools, needsAgent, TOOLS, AGENTS,
  titleOf, remember, whenSaid, forgetOne, resumable, ABOUT, isAboutQuestion, memoryOf, sentFrom,
  startersFrom, DEFAULT_STARTERS, forModel, parseLlms, searchPages, pageUrl, markdownUrl, isHtmlDocument,
  moduleLabel, skillNote, COMMANDS, slashMatches, CLOSED, offering, related, shownOf, trayKey,
} = await import(out);

// History: one conversation comes out, the rest stay in order.
assert.deepEqual(forgetOne([{id: 'a'}, {id: 'b'}, {id: 'c'}], 'b').map((s) => s.id), ['a', 'c']);

// Resuming: the tab's conversation comes back from the list, and nothing
// comes back when the tab was in none or the list has lost it.
const held = [{id: 'a', turns: [{from: 'you', text: 'q'}]}, {id: 'b', turns: []}];
assert.equal(resumable(held, 'a').id, 'a');
assert.equal(resumable(held, null), null);
assert.equal(resumable(held, 'gone'), null);

// Memory: counts the exchanges the next question takes, not the panel's own.
const turn = (from, text, extra = {}) => ({from, text, ...extra});
const ex = (n) => Array.from({length: n}, (_, i) => [turn('you', `q${i}`), turn('assistant', `a${i}`)]).flat();
assert.deepEqual(memoryOf([]), {earlier: 0, window: 15, percent: 0, full: false});
assert.deepEqual(memoryOf(ex(3)), {earlier: 3, window: 15, percent: 20, full: false});
assert.equal(memoryOf(ex(15)).full, true, 'fifteen exchanges fill the window');
assert.equal(memoryOf(ex(20)).percent, 100, 'never over 100');
// The line sits above the oldest message still carried, and only once
// something is no longer carried.
assert.equal(sentFrom(ex(15)), -1, 'all fifteen still go');
const long = ex(17);
assert.equal(sentFrom(long), 4, 'two exchanges (four turns) have dropped');
assert.equal(long[sentFrom(long)].text, 'q2');
const withOwn = [turn('you', 'What can you do?'), turn('assistant', 'I answer', {local: true}), ...ex(16)];
assert.equal(withOwn[sentFrom(withOwn)].text, 'q1', "the panel's own answers are not counted");
assert.equal(memoryOf([...ex(2), turn('you', 'What can you do?'), turn('assistant', 'I answer', {local: true})]).earlier, 2, "the panel's own answer takes no memory");

// About: the panel answers questions about itself, and only those.
for (const q of ['What can the Ask AI assistant do?', 'what can you do', 'Who are you?', 'help', 'What is Ask AI?', 'How do I use this?']) {
  assert.ok(isAboutQuestion(q), `about: ${q}`);
}
for (const q of ['What can an HIU do with a consent artefact?', 'Hi', 'What does ABDM-1016 mean?', 'can you help me link care contexts', 'what are you returning here']) {
  assert.ok(!isAboutQuestion(q), `not about: ${q}`);
}
assert.ok(isAboutQuestion(DEFAULT_STARTERS.find((s) => s.label === 'Learn about Ask AI').prompt), 'the starter is answered by the panel');
assert.ok(!/\u2014/.test(ABOUT), 'no em dash in the about answer');
assert.ok(!/NHCX|HIE-CM|payer|claim/i.test(ABOUT), 'the about answer is about the panel, not a gateway');

// Starters: a pill's label and the question it asks; old hosts still work.
assert.equal(startersFrom(''), DEFAULT_STARTERS);
assert.deepEqual(startersFrom('Create an ABHA | How do I create an ABHA?'),
  [{label: 'Create an ABHA', prompt: 'How do I create an ABHA?'}]);
assert.deepEqual(startersFrom('What is a care context?'),
  [{label: 'What is a care context?', prompt: 'What is a care context?'}]);
assert.equal(startersFrom('a\nb\nc\nd\ne\nf').length, 5, 'at most five');
assert.ok(DEFAULT_STARTERS.some((s) => s.prompt === 'What can the Ask AI assistant do?'), 'the assistant can be asked about itself');
assert.ok(DEFAULT_STARTERS.every((s) => s.label.split(' ').length <= 4), 'pills stay short');

// Transcript: the panel's own exchanges go in pairs, so roles still alternate.
const said = (from, text, extra = {}) => ({from, text, ...extra});
const shown = forModel([
  said('you', 'q1'), said('assistant', 'a1'),
  said('you', 'Install AI tools'), said('assistant', 'Which tool?', {install: {at: 'tools'}}),
  said('you', 'q2'),
]);
assert.deepEqual(shown.map((t) => t.text), ['q1', 'a1', 'q2'], 'the install pair is dropped whole');
assert.deepEqual(forModel([said('you', 'q'), said('assistant', 'Which module?', {local: true}), said('you', 'q again')])
  .map((t) => t.text), ['q again'], 'an unresolved command pair is dropped whole');
for (let i = 1; i < shown.length; i += 1) assert.notEqual(shown[i].from, shown[i - 1].from);

// Pages: llms.txt parsed to paths, re-rooted on the widget's own docs origin.
const llms = [
  '# ABDM Developer Portal', '',
  '- [Gateway session](https://abdm-docs.example.com/docs/hiecm/v3/api/gateway): Every call carries a token.',
  '- [M2 Health Information Provider](https://abdm-docs.example.com/docs/hiecm/v3/milestones/m2/): Link records.',
  '- [Care context](https://abdm-docs.example.com/docs/hiecm/v3/concepts/care-context): A visit or episode.',
  '- [Duplicate](https://abdm-docs.example.com/docs/hiecm/v3/api/gateway): again',
  '- [Module list](https://abdm-docs.example.com/llms/m2.txt): not a page',
].join('\n');
const entries = parseLlms(llms);
assert.deepEqual(entries.map((e) => e.path), [
  '/docs/hiecm/v3/api/gateway', '/docs/hiecm/v3/milestones/m2', '/docs/hiecm/v3/concepts/care-context',
], 'docs pages only, no trailing slash, no duplicates');
assert.equal(entries[1].description, 'Link records.');
assert.equal(searchPages(entries, 'care')[0].title, 'Care context', 'a word starting the title wins');
assert.equal(searchPages(entries, 'records')[0].title, 'M2 Health Information Provider', 'the description counts too');
assert.deepEqual(searchPages(entries, 'care gateway'), [], 'every word must match');
assert.deepEqual(searchPages(entries, '   '), []);
assert.doesNotThrow(() => searchPages(entries, '(m2 [ *'), 'regex characters are safe');
assert.equal(pageUrl('https://docs.example.org/', '/docs/a'), 'https://docs.example.org/docs/a');
assert.equal(markdownUrl('https://docs.example.org', '/docs/a'), 'https://docs.example.org/docs/a.md');
// An app shell served in place of a missing page is not the page.
assert.ok(isHtmlDocument('<!DOCTYPE html>\n<html lang="en">'));
assert.ok(isHtmlDocument('  <html>'));
assert.ok(!isHtmlDocument('# Care contexts\n\nA care context is <b>one</b> visit.'));
assert.ok(!isHtmlDocument('<details> in markdown'));

// Commands: four of them, and the lines the panel shows for a skill event.
assert.deepEqual(COMMANDS.map((c) => c.id), ['scaffold', 'design', 'integrate', 'debug']);
assert.equal(slashMatches('/').length, 4, 'a bare slash offers every skill');
assert.deepEqual(slashMatches('/d').map((c) => c.id), ['design', 'debug']);
assert.deepEqual(slashMatches('/Deb').map((c) => c.id), ['debug']);
assert.deepEqual(slashMatches('/debug why'), [], 'a space makes it a question');
assert.deepEqual(slashMatches('a/b'), []);
assert.equal(moduleLabel('abdm-m2'), 'M2');
assert.equal(moduleLabel('abdm-scan-and-pay'), 'Scan and pay');
assert.equal(skillNote({module: 'abdm-m2', section: 'debug', status: 'used'}), 'Using M2 · Debug');
assert.equal(skillNote({module: 'abdm-p2', section: 'design', status: 'missing'}),
  'No design guide for P2 yet. Answering from the docs.');
assert.equal(skillNote({section: 'debug', status: 'unresolved'}), 'Which module is this about?');
for (const c of COMMANDS) assert.ok(!/\u2014/.test(skillNote({module: 'abdm-m1', section: c.id, status: 'used'})), 'no em dash');

// History: named after the first question, one entry per conversation, fifty kept.
assert.equal(titleOf([{from: 'assistant', text: 'Hello'}, {from: 'you', text: '  ABDM\n1016  '}]), 'ABDM 1016');
assert.equal(titleOf([{from: 'assistant', text: 'Hello'}]), '');
assert.equal(titleOf([{from: 'you', text: 'x'.repeat(200)}]).length, 72);
const one = {id: 'a', at: 1, title: 'a', turns: []};
assert.deepEqual(remember([one], {...one, title: 'a2'}).length, 1, 'the same conversation replaces itself');
assert.equal(remember([one], {...one, title: 'a2'})[0].title, 'a2');
assert.equal(remember([one], {id: 'b', at: 2, title: 'b', turns: []})[0].id, 'b', 'newest first');
const many = Array.from({length: 60}, (_, i) => ({id: String(i), at: i, title: String(i), turns: []}));
assert.equal(many.reduce((list, s) => remember(list, s), []).length, 50, 'capped');
assert.equal(whenSaid(0, 30_000), 'just now');
assert.equal(whenSaid(0, 7 * 60_000), '7m ago');
assert.equal(whenSaid(0, 3 * 3600_000), '3h ago');
assert.equal(whenSaid(0, 2 * 86400_000), '2d ago');

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
  'event: tool\ndata: {"name":"search_docs","detail":"UHI create ABHA with Aadhaar OTP: request OTP"}\n\n',
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
// The activity line names what the assistant is doing, never the query it
// wrote: that read as the reader's own question repeated back.
assert.equal(tool, 'Searching the docs');
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

// A links event arrives once before sources and is handed over as sent;
// linkFor turns an exact literal into an absolute page and nothing else.
{
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(enc.encode('event: links\ndata: [{"literal":"/api/hiecm/v3/token/generate-token","url":"/docs/hiecm/v3/api/m2/generate-token"}]\n\n'));
      c.enqueue(enc.encode('event: done\ndata: {}\n\n'));
      c.close();
    },
  });
  let links = null;
  await readStream(stream, {
    onText: () => {},
    onTool: () => {},
    onSources: () => {},
    onLinks: (l) => (links = l),
    onError: () => assert.fail('no error expected'),
  });
  assert.deepEqual(links, [{literal: '/api/hiecm/v3/token/generate-token', url: '/docs/hiecm/v3/api/m2/generate-token'}]);
  assert.equal(linkFor('/api/hiecm/v3/token/generate-token', links, 'https://docs.example'), 'https://docs.example/docs/hiecm/v3/api/m2/generate-token');
  assert.equal(linkFor('/api/hiecm/v3/token/generate-token?x=1', links, 'https://docs.example'), null);
  assert.equal(linkFor('POST /api/hiecm/v3/token/generate-token', links, 'https://docs.example'), 'https://docs.example/docs/hiecm/v3/api/m2/generate-token');
  assert.equal(linkFor('X-LINK-TOKEN', undefined, 'https://docs.example'), null);
}

// Suggestions arrive on their own event and are handed over as sent.
{
  const enc = new TextEncoder();
  const stream = new ReadableStream({
    start(c) {
      c.enqueue(enc.encode('event: suggestions\ndata: [{"id":"b","title":"Link a care context","prompt":"Link a care context"}]\n\n'));
      c.enqueue(enc.encode('event: done\ndata: {}\n\n'));
      c.close();
    },
  });
  let got = null;
  await readStream(stream, {
    onText: () => {},
    onTool: () => {},
    onSources: () => {},
    onSuggestions: (s) => (got = s),
    onError: () => assert.fail('no error expected'),
  });
  assert.deepEqual(got, [{id: 'b', title: 'Link a care context', prompt: 'Link a care context'}]);
}

// A refused request is not an unreachable assistant. The server's 429 says
// which limit and how long; the panel says that, and keeps "unreachable" for
// a failure it cannot name. NHA's testers, asking back to back, saw
// "unreachable" for every rate limit.
assert.equal(
  failureMessage(429, {error: 'x', limit: 'minute', retry_after_seconds: 40}),
  'Too many questions in the last minute. Wait about 40 seconds and ask again.',
);
assert.equal(
  failureMessage(429, {error: 'x', limit: 'minute', retry_after_seconds: 1}),
  'Too many questions in the last minute. Wait a moment and ask again.',
);
assert.equal(
  failureMessage(429, {error: 'x', limit: 'day', retry_after_seconds: 3600}),
  "This connection has used today's questions. The limit resets at midnight UTC.",
);
assert.equal(failureMessage(429, null), 'Too many questions in a short time. Wait a minute and ask again.');
assert.equal(failureMessage(500, {error: 'boom'}), UNREACHABLE);
assert.equal(failureMessage(502, null), UNREACHABLE);

// What the composer offers: the next step takes the box and Tab; a related
// question takes it only once the reader moves to it; Escape puts both away,
// and Shift and Tab is never held.
{
  const step = {id: 's', title: 'S', prompt: 'What is the next step?', kind: 'step'};
  const rel = [
    {id: 'a', title: 'A', prompt: 'How do I link records as a HIP?'},
    {id: 'b', title: 'B', prompt: 'How do I fetch records with consent?'},
  ];
  const s = [step, ...rel];
  assert.equal(offering('', s, CLOSED, false), true);
  assert.equal(offering('typed', s, CLOSED, false), false);
  assert.equal(offering('', s, CLOSED, true), false);
  assert.equal(offering('', [], CLOSED, false), false);
  assert.equal(offering('', s, {active: -1, dismissed: true}, false), false);
  assert.deepEqual(related(s), rel);
  assert.equal(shownOf(s, CLOSED), step, 'the box shows the next step');
  assert.equal(shownOf(rel, CLOSED), null, 'a related question never takes the box unasked');
  assert.deepEqual(trayKey('Tab', false, s, CLOSED), {kind: 'fill', text: step.prompt});
  assert.deepEqual(trayKey('Tab', false, rel, CLOSED), {kind: 'none'}, 'Tab is left alone with no step');
  assert.deepEqual(trayKey('Tab', true, s, CLOSED), {kind: 'none'});
  assert.deepEqual(trayKey('ArrowDown', false, s, CLOSED), {kind: 'move', tray: {active: 0, dismissed: false}});
  assert.deepEqual(trayKey('ArrowDown', false, s, {active: 1, dismissed: false}), {kind: 'move', tray: {active: 1, dismissed: false}});
  assert.deepEqual(trayKey('ArrowUp', false, s, {active: 0, dismissed: false}), {kind: 'move', tray: {active: -1, dismissed: false}});
  assert.deepEqual(trayKey('Tab', false, s, {active: 1, dismissed: false}), {kind: 'fill', text: rel[1].prompt});
  assert.deepEqual(trayKey('Escape', false, s, CLOSED), {kind: 'dismiss', tray: {active: -1, dismissed: true}});
  assert.deepEqual(trayKey('ArrowDown', false, [step], CLOSED), {kind: 'none'});
  assert.deepEqual(trayKey('a', false, s, CLOSED), {kind: 'none'});
  assert.deepEqual(trayKey('Tab', false, [], CLOSED), {kind: 'none'});
}
