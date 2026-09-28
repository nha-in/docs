// scripts/lib/sections.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {sectionsById, literals, plainMarkdown} from './sections.mjs';

const page = [
  '{/* partial */}', '',
  '### Link token {#link-token}', '',
  'The token that authorises linking. Valid for six months.', '',
  '<AgentOnly>',
  '**How you know it worked.** You can say how long a `linkToken` lasts.', '',
  'Validate it before every link.',
  '</AgentOnly>', '',
  '### M1 {#m1}', 'Milestone 1.', '',
  '### No id', 'Ignored.', '',
  '```mdx', '### Fenced {#fenced}', '```',
].join('\n');

test('a section is found by its explicit id, with visible and agent text apart', () => {
  const s = sectionsById(page).get('link-token');
  assert.equal(s.heading, 'Link token');
  assert.match(s.text, /Valid for six months\./);
  assert.doesNotMatch(s.text, /Validate it/);
  assert.equal(s.agent.worked, 'You can say how long a `linkToken` lasts.');
});

test('agent text without a label is reported, never filed under a guessed heading', () => {
  const s = sectionsById(page).get('link-token');
  assert.equal(s.agent.wrong, '');
  assert.deepEqual(s.unlabelled, ['Validate it before every link.']);
});

test('a section stops at a sub-heading with its own id, so no text belongs to two sections', () => {
  const nested = '## Consent {#consent}\nParent text.\n\n### Artefacts {#artefacts}\nChild text.\n\n### Plain sub-heading\nMore parent text.\n';
  const secs = sectionsById(nested);
  assert.doesNotMatch(secs.get('consent').text, /Child text/);
  assert.match(secs.get('artefacts').text, /Child text/);
  assert.doesNotMatch(secs.get('artefacts').text, /More parent text/);
});

test('a section stops at the next heading of the same level', () => {
  assert.doesNotMatch(sectionsById(page).get('link-token').text, /Milestone 1/);
});

test('rewording a heading keeps its id', () => {
  const s = sectionsById(page.replace('### Link token {#link-token}', '### The link token {#link-token}')).get('link-token');
  assert.equal(s.heading, 'The link token');
});

test('headings without an explicit id, and headings inside code fences, are not sections', () => {
  assert.deepEqual([...sectionsById(page).keys()], ['link-token', 'm1']);
});

test('literals are the backticked spans', () => {
  assert.deepEqual(literals('Send `linkToken` to `/v3/link` now.'), ['linkToken', '/v3/link']);
});

test('[rev] relative anchors become absolute page links', () => {
  const {text} = plainMarkdown('Links to [HIP](#hip) and [care contexts](#care-context).', '/docs/hiecm/v3/getting-started/glossary#link-token');
  assert.equal(text, 'Links to [HIP](/docs/hiecm/v3/getting-started/glossary#hip) and [care contexts](/docs/hiecm/v3/getting-started/glossary#care-context).');
});

test('[rev] imports go, admonitions unwrap, other JSX is a problem', () => {
  const {text, problems} = plainMarkdown("import X from './x';\n\n:::note\nKeep this.\n:::\n\n<Expandable title=\"t\">inner</Expandable>\n\nValue is {props.v}.", '/docs/p#s');
  assert.doesNotMatch(text, /import X/);
  assert.match(text, /Keep this\./);
  assert.doesNotMatch(text, /:::/);
  assert.ok(problems.some((p) => p.includes('<Expandable')));
  assert.ok(problems.some((p) => p.includes('{props.v}')));
});

test('[rev] code fences are left alone', () => {
  const {text, problems} = plainMarkdown('```json\n{"a": 1}\n```', '/docs/p#s');
  assert.equal(text, '```json\n{"a": 1}\n```');
  assert.deepEqual(problems, []);
});
