// scripts/build-sections.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {renderAtom, generatedPath, problems, registry, writePlan} from './build-sections.mjs';

const entry = {type: 'glossary', gateway: 'hiecm', milestone: 'n/a', title: 'Link token, the token that authorises linking', summary: 'Authorises linking.', page: 'g.mdx', heading: 'link-token', url: '/docs/g#link-token', related: {}};
const page = '### Link token {#link-token}\n\nValid for six months.\n\n<AgentOnly>\n**When it goes wrong.** Validate it before every link.\n</AgentOnly>\n';

test('a generated atom carries the page text and only the sections that have content', () => {
  const md = renderAtom('hiecm.glossary.link-token', entry, {text: 'Valid for six months.', agent: {before: '', happens: '', worked: '', wrong: 'Validate it before every link.'}});
  assert.match(md, /^---\nid: hiecm\.glossary\.link-token\n/);
  assert.match(md, /generated: true/);
  assert.match(md, /## In plain words\n\nValid for six months\./);
  assert.match(md, /## When it goes wrong\n\nValidate it before every link\./);
  for (const h of ['Before you start', 'What happens', 'How you know it worked']) assert.doesNotMatch(md, new RegExp(`## ${h}`));
  assert.doesNotMatch(md, /Nothing beyond/);
});

test('agent text without a label fails, naming the atom and the fix', () => {
  const unlabelled = page.replace('**When it goes wrong.** ', '');
  const p = problems({map: {'hiecm.glossary.link-token': entry}, pages: {'g.mdx': unlabelled}, handIds: new Set(), specText: ''});
  assert.ok(p.some((x) => x.includes('has agent text without a label')));
});

test('the generated file sits in the folder lint-atoms expects for its type', () => {
  assert.equal(generatedPath('hiecm.glossary.link-token', entry), 'catalogue/hiecm/glossary/link-token.md');
});

test('a clean map has no problems', () => {
  assert.deepEqual(problems({map: {'hiecm.glossary.link-token': entry}, pages: {'g.mdx': page}, handIds: new Set(), specText: ''}), []);
});

test('a heading id the map needs, gone from the page, fails and names the atom', () => {
  const p = problems({map: {'hiecm.glossary.link-token': entry}, pages: {'g.mdx': page.replace(' {#link-token}', '')}, handIds: new Set(), specText: ''});
  assert.deepEqual(p, ['hiecm.glossary.link-token: heading id "link-token" is missing from g.mdx. Put {/* #link-token */} back on the heading that holds its words, or point the atom at the section that now does']);
  const md = problems({map: {'hiecm.glossary.link-token': {...entry, page: 'g.md'}}, pages: {'g.md': page.replace(' {#link-token}', '')}, handIds: new Set(), specText: ''});
  assert.match(md[0], /Put \{#link-token\} back/);
});

test('an atom written in two places fails', () => {
  const p = problems({map: {'hiecm.glossary.link-token': entry}, pages: {'g.mdx': page}, handIds: new Set(['hiecm.glossary.link-token']), specText: ''});
  assert.ok(p.some((x) => x.includes('is both a hand-written file and a map entry')));
});

test('an agent note that introduces a literal no page or spec states fails', () => {
  const bad = page.replace('Validate it before every link.', 'Send `X-LINK-SECRET` on every link.');
  // stays labelled: the replacement keeps the "**When it goes wrong.**" prefix
  const p = problems({map: {'hiecm.glossary.link-token': entry}, pages: {'g.mdx': bad}, handIds: new Set(), specText: 'REQUEST-ID'});
  assert.ok(p.some((x) => x.includes('agent note introduces `X-LINK-SECRET`')));
});

test('the registry lists page-sourced and hand-written atoms, with no prose', () => {
  const r = registry({map: {'hiecm.glossary.link-token': entry}, hand: [{id: 'nhcx.error.payr-1107', type: 'error', gateway: 'nhcx', file: 'catalogue/nhcx/errors/payr-1107.md'}]});
  assert.deepEqual(r.map((e) => [e.id, e.source]), [['hiecm.glossary.link-token', 'page'], ['nhcx.error.payr-1107', 'file']]);
  assert.equal(JSON.stringify(r).includes('six months'), false);
});

test('a map entry that lists itself as related fails', () => {
  const self = {...entry, related: {concepts: ['hiecm.glossary.link-token']}};
  const p = problems({map: {'hiecm.glossary.link-token': self}, pages: {'g.mdx': page}, handIds: new Set(), specText: ''});
  assert.ok(p.some((x) => x.includes('lists itself as related')));
});

test('a map entry whose related names an unknown id fails', () => {
  const dangling = {...entry, related: {concepts: ['shared.glossary.nowhere']}};
  const p = problems({map: {'hiecm.glossary.link-token': dangling}, pages: {'g.mdx': page}, handIds: new Set(), specText: ''});
  assert.ok(p.some((x) => x.includes('related names shared.glossary.nowhere, which no atom defines')));
});

test('[rev] a section with JSX fails the build naming the atom and the tag', () => {
  const jsx = page.replace('Valid for six months.', 'Valid for <Expandable>six</Expandable> months.');
  const p = problems({map: {'hiecm.glossary.link-token': entry}, pages: {'g.mdx': jsx}, handIds: new Set(), specText: ''});
  assert.ok(p.some((x) => x.includes('hiecm.glossary.link-token') && x.includes('<Expandable')));
});

test('a generated atom carries the map entry contract v2 fields', () => {
  const e = {...entry, type: 'endpoint', operation: 'm1_post_x', side: 'hip', status: 'current', facts: [{key: 'http_status', value: 202, source: 0}]};
  const md = renderAtom('hiecm.endpoint.x', e, {text: 'Plain.', agent: {before: '', happens: '', worked: '', wrong: ''}});
  assert.match(md, /\noperation: m1_post_x\n/);
  assert.match(md, /\nside: hip\n/);
  assert.match(md, /\nfacts:\n/);
  assert.doesNotMatch(renderAtom('hiecm.glossary.link-token', entry, {text: 'x', agent: {before: '', happens: '', worked: '', wrong: ''}}), /operation:/);
});

test('the build never overwrites a hand-written atom at a path the map wants', () => {
  const plan = writePlan(new Map([['catalogue/hiecm/concepts/x.md', 'body']]), new Map([['catalogue/hiecm/concepts/x.md', {generated: false}]]));
  assert.deepEqual(plan.write, []);
  assert.deepEqual(plan.problems, ['catalogue/hiecm/concepts/x.md is hand-written; build:sections will not overwrite it']);
});

test('the build removes a written atom no map entry wants, and never a hand-written one', () => {
  const onDisk = new Map([
    ['catalogue/hiecm/concepts/gone.md', {generated: true}],
    ['catalogue/hiecm/concepts/hand.md', {generated: false}],
    ['catalogue/hiecm/concepts/kept.md', {generated: true}],
  ]);
  const plan = writePlan(new Map([['catalogue/hiecm/concepts/kept.md', 'body'], ['catalogue/hiecm/concepts/new.md', 'body']]), onDisk);
  assert.deepEqual(plan.remove, ['catalogue/hiecm/concepts/gone.md']);
  assert.deepEqual(plan.write.sort(), ['catalogue/hiecm/concepts/kept.md', 'catalogue/hiecm/concepts/new.md']);
  assert.deepEqual(plan.problems, []);
});

test('a map entry that names its version carries it; the rest stay abdm-v3', () => {
  const blank = {text: 'x', agent: {before: '', happens: '', worked: '', wrong: ''}};
  assert.match(renderAtom('uhi.concept.x', {...entry, type: 'concept', gateway: 'uhi', version: 'uhi-v1'}, blank), /\nversion: uhi-v1\n/);
  assert.match(renderAtom('shared.glossary.link-token', entry, blank), /\nversion: abdm-v3\n/);
});
