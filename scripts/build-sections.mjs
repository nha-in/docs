// scripts/build-sections.mjs
// catalogue/map.yaml is the atom registry: each atom id and the page section
// that holds its words. This script builds, from the map and the pages, the
// atom-shaped files every consumer already reads (catalogue/generated/), and
// catalogue/registry.json, the list of every atom and where its words live.
//   npm run build:sections
//   npm run check:sections      CI: fails on any problem or stale output
import {readFileSync, writeFileSync, mkdirSync, rmSync, existsSync, readdirSync, statSync} from 'node:fs';
import {join, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse, stringify} from 'yaml';
import {loadAtoms} from './lib/atoms.mjs';
import {sectionsById, literals} from './lib/sections.mjs';

// The folder per type that scripts/lint-atoms.mjs requires.
const FOLDER = {concept: 'concepts', flow: 'flows', endpoint: 'endpoints', callback: 'callbacks', error: 'errors', test: 'tests', decision: 'decisions', glossary: 'glossary', fhir: 'fhir', sandbox: 'sandbox', troubleshooting: 'troubleshooting'};
const SECTIONS = [['In plain words', (s) => s.text], ['Before you start', (s) => s.agent.before], ['What happens', (s) => s.agent.happens], ['How you know it worked', (s) => s.agent.worked], ['When it goes wrong', (s) => s.agent.wrong]];

export const generatedPath = (id, e) => `catalogue/generated/${e.gateway}/${FOLDER[e.type]}/${id.split('.')[2]}.md`;

export function renderAtom(id, e, s) {
  const fm = {
    id, type: e.type, gateway: e.gateway, milestone: e.milestone, version: 'abdm-v3',
    title: e.title, summary: e.summary, generated: true,
    sources: [{url: `https://github.com/nha-in/docs/blob/main/${e.page}`, status: 'page', note: `Generated from ${e.page}#${e.heading}. Edit the page, never this file.`}],
    related: e.related ?? {},
  };
  // A section with nothing in it is left out: the indexer makes one chunk per
  // "## " section, and identical filler chunks would crowd search results.
  const body = SECTIONS.map(([h, get]) => [h, (get(s) ?? '').trim()]).filter(([, t]) => t).map(([h, t]) => `## ${h}\n\n${t}`).join('\n\n');
  return `---\n${stringify(fm).trimEnd()}\n---\n\n# ${e.title}\n\n${body}\n`;
}

export function problems({map, pages, handIds, specText}) {
  const out = [];
  for (const [id, e] of Object.entries(map)) {
    if (handIds.has(id)) out.push(`${id} is both a hand-written file and a map entry. Delete the hand-written file once its words are on the page`);
    if (!FOLDER[e.type]) out.push(`${id}: type "${e.type}" is not an atom type`);
    const raw = pages[e.page];
    if (raw === undefined) { out.push(`${id}: page ${e.page} does not exist`); continue; }
    const s = sectionsById(raw).get(e.heading);
    if (!s) { out.push(`${id}: heading id "${e.heading}" is missing from ${e.page}. Put {#${e.heading}} back on the heading that holds its words, or point the atom at the section that now does`); continue; }
    for (const para of s.unlabelled) out.push(`${id}: ${e.page}#${e.heading} has agent text without a label: "${para.slice(0, 60)}". Start the paragraph with **Before you start.**, **What happens.**, **How you know it worked.** or **When it goes wrong.**`);
    const visible = raw.replace(/<AgentOnly>[\s\S]*?<\/AgentOnly>/g, '');
    for (const lit of literals(Object.values(s.agent).join('\n'))) {
      if (!visible.includes(lit) && !specText.includes(lit)) out.push(`${id}: agent note introduces \`${lit}\`, which neither ${e.page} nor any specification states. Put it on the page, or take it out of the note`);
    }
  }
  return out;
}

export function registry({map, hand}) {
  const fromPages = Object.entries(map).map(([id, e]) => ({id, type: e.type, gateway: e.gateway, source: 'page', page: e.page, heading: e.heading, url: e.url}));
  const fromFiles = hand.map((a) => ({id: a.id, type: a.type, gateway: a.gateway, source: 'file', file: a.file}));
  return [...fromPages, ...fromFiles].sort((a, b) => a.id.localeCompare(b.id));
}

function walkFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walkFiles(p) : [p]; });
}

function specText(root) {
  return walkFiles(join(root, 'catalogue', 'openapi')).filter((f) => f.endsWith('.yaml') && !f.includes('/.raw/')).map((f) => readFileSync(f, 'utf8')).join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const map = parse(readFileSync(join(root, 'catalogue', 'map.yaml'), 'utf8')) ?? {};
  const pages = Object.fromEntries([...new Set(Object.values(map).map((e) => e.page))].filter((p) => existsSync(join(root, p))).map((p) => [p, readFileSync(join(root, p), 'utf8')]));
  const {atoms} = loadAtoms();
  const hand = [...atoms.values()].filter((a) => !a.file.includes('/catalogue/generated/')).map((a) => ({id: a.fm.id, type: a.fm.type, gateway: a.fm.gateway, file: relative(root, a.file)}));
  const found = problems({map, pages, handIds: new Set(hand.map((a) => a.id)), specText: specText(root)});
  const want = new Map(Object.entries(map).filter(([, e]) => pages[e.page] && sectionsById(pages[e.page]).get(e.heading)).map(([id, e]) => [generatedPath(id, e), renderAtom(id, e, sectionsById(pages[e.page]).get(e.heading))]));
  const reg = `${JSON.stringify(registry({map, hand}), null, 2)}\n`;
  const genDir = join(root, 'catalogue', 'generated');
  if (process.argv.includes('--check')) {
    for (const [p, body] of want) if (!existsSync(join(root, p)) || readFileSync(join(root, p), 'utf8') !== body) found.push(`${p} is stale; run npm run build:sections`);
    for (const f of walkFiles(genDir)) if (!want.has(relative(root, f))) found.push(`${relative(root, f)} has no map entry; run npm run build:sections`);
    const regPath = join(root, 'catalogue', 'registry.json');
    if (!existsSync(regPath) || readFileSync(regPath, 'utf8') !== reg) found.push('catalogue/registry.json is stale; run npm run build:sections');
    for (const p of found) console.error(p);
    process.exit(found.length ? 1 : 0);
  }
  if (found.length) { for (const p of found) console.error(p); process.exit(1); }
  rmSync(genDir, {recursive: true, force: true});
  for (const [p, body] of want) { mkdirSync(dirname(join(root, p)), {recursive: true}); writeFileSync(join(root, p), body); }
  writeFileSync(join(root, 'catalogue', 'registry.json'), reg);
  console.log(`sections: ${want.size} atoms from pages, ${hand.length} hand-written`);
}
