// Checks every module skill built per functionality: the abdm-<module> folders
// whose cases are mapped in catalogue/hiecm/tests/<module>.yaml.
//
// 1. No rule twice. A sentence of twelve words or more, read from paragraphs
//    with their wrapped lines joined, or a table row of twelve words or more
//    with its case id cells left out, that appears twice in the folder fails,
//    in two files or in one, ignoring case and spacing. Quoted text is not
//    compared: NHA's own case text under each case's heading in "## Cases",
//    a blockquote such as the consent language, and code.
// 2. Every functionality file is complete: its cases, a screen requirement
//    citing each of them, its calls and its errors.
// 3. No job file is left beside the functionality files, every relative link
//    lands inside the folder, every atom cited exists, and no em dash.
//
//   node scripts/check-functionality-skills.mjs              the integrators plugin
//   node scripts/check-functionality-skills.mjs <skills dir>  any copy, such as a broken one
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {loadAtoms} from './lib/atoms.mjs';

const root = join(fileURLToPath(import.meta.url), '..', '..');
const testsDir = join(root, 'catalogue', 'hiecm', 'tests');
const JOB_FILES = ['scaffold.md', 'design.md', 'integrate.md', 'debug.md', 'test.md'];
const REQUIRED = ['## Cases', '## Screen requirements', '## Calls', '## Errors'];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : name.endsWith('.md') ? [p] : [];
  });
}

const CASE_IDS = /^[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+(?:,\s*[A-Z][A-Z0-9]*(?:_[A-Z0-9]+)+)*$/;
const norm = (text) => text.replace(/\s+/g, ' ').trim().toLowerCase();
const wordCount = (text) => text.split(' ').filter(Boolean).length;

/**
 * The comparable units of one file, in order: each sentence of twelve words
 * or more, from paragraphs whose wrapped lines are joined first, and each
 * table row of twelve words or more with the cells that only hold case ids
 * left out. Code is not compared, nor NHA's case text quoted under each
 * "### <case id>" heading of a file's "## Cases".
 */
export function units(text) {
  const out = [];
  let inCode = false;
  let inCases = false;
  let quoting = false;
  let para = [];
  const flush = () => {
    if (!para.length) return;
    const joined = para.join(' ');
    para = [];
    for (const sentence of joined.split(/(?<=[.!?])\s+(?=[A-Z`"*(\[])/)) {
      const n = norm(sentence);
      if (wordCount(n) >= 12) out.push(n);
    }
  };
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('```')) { flush(); inCode = !inCode; continue; }
    if (inCode) continue;
    if (/^## /.test(line)) { flush(); inCases = line === '## Cases'; quoting = false; continue; }
    if (inCases && /^### /.test(line)) { flush(); quoting = true; continue; }
    if (/^#/.test(line) || !line) { flush(); continue; }
    if (quoting || line.startsWith('>')) { flush(); continue; }
    if (line.startsWith('|')) {
      flush();
      if (/^\|[-| :]+\|$/.test(line)) continue;
      const cells = line.replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map((c) => c.trim()).filter((c) => !CASE_IDS.test(c));
      const n = norm(cells.join(' | '));
      if (wordCount(n) >= 12) out.push(`row: ${n}`);
      continue;
    }
    if (/^([-*]|\d+\.)\s/.test(line)) flush();
    para.push(line.replace(/^([-*]|\d+\.)\s*/, ''));
  }
  flush();
  return out;
}

/** Sections of a markdown file by `## ` heading. */
function h2(text) {
  const out = new Map();
  for (const part of text.split(/\n(?=## )/)) {
    const m = part.match(/^## (.+)$/m);
    if (m) out.set(`## ${m[1].trim()}`, part.slice(part.indexOf('\n') + 1).trim());
  }
  return out;
}

export function checkFolder(folder, mapping, atoms) {
  const problems = [];
  const name = folder.split('/').pop();
  const fail = (msg) => problems.push(`${name}: ${msg}`);
  const files = walk(folder);
  const rel = (f) => relative(folder, f);

  for (const job of JOB_FILES) if (existsSync(join(folder, 'references', job))) fail(`references/${job} is a job file; a skill built per functionality has none`);
  for (const must of ['SKILL.md', 'references/run.md', 'references/errors.md']) if (!existsSync(join(folder, must))) fail(`${must} is missing`);

  // 1. No rule in two files.
  const seen = new Map();
  for (const file of files) {
    for (const u of units(readFileSync(file, 'utf8'))) {
      if (!seen.has(u)) seen.set(u, rel(file));
      else fail(`the same text is in ${seen.get(u)}${seen.get(u) === rel(file) ? ' twice' : ` and ${rel(file)}`}: "${u.slice(0, 120)}${u.length > 120 ? '...' : ''}"`);
    }
  }

  // 2. Every functionality file is complete.
  for (const f of mapping.functionalities ?? []) {
    const file = join(folder, 'references', 'functionalities', `${f.id}.md`);
    if (!existsSync(file)) { fail(`references/functionalities/${f.id}.md is missing`); continue; }
    const text = readFileSync(file, 'utf8');
    const parts = h2(text);
    const where = `functionalities/${f.id}.md`;
    for (const heading of REQUIRED) if (!parts.get(heading)) fail(`${where} has no ${heading} section, or an empty one`);
    const ids = f.cases.map((c) => c.id);
    const casesText = parts.get('## Cases') ?? '';
    for (const id of ids) if (!new RegExp(`^\\| ${id} \\|`, 'm').test(casesText)) fail(`${where} lists no row for case ${id} under ## Cases`);
    const screens = parts.get('## Screen requirements') ?? '';
    for (const id of ids) {
      if (screens && !new RegExp(`${id}(?![_A-Z0-9])`).test(screens)) fail(`${where}: no screen requirement cites case ${id}`);
    }
  }

  // 3. Links, atoms, em dashes.
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    if (text.includes('\u2014')) fail(`${rel(file)} holds an em dash`);
    for (const [, id] of text.matchAll(/`((?:hiecm|uhi|shared)\.[a-z]+\.[a-z0-9-]+)`/g)) {
      if (!atoms.has(id)) fail(`${rel(file)} cites atom ${id}, which the Catalogue does not define`);
    }
    for (const [, target] of text.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(https?:|mailto:|#|\/)/.test(target)) continue;
      const path = target.split('#')[0];
      if (!path) continue;
      const resolved = join(dirname(file), path);
      if (!resolved.startsWith(folder)) fail(`${rel(file)} links out of the folder: ${target}`);
      else if (!existsSync(resolved)) fail(`${rel(file)} links to a missing file: ${target}`);
    }
  }
  return problems;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const skillsDir = process.argv[2] ?? join(root, 'plugins', 'abdm-integrators-assistant', 'skills');
  const {atoms} = loadAtoms();
  const problems = [];
  let checked = 0;
  for (const file of readdirSync(testsDir).filter((f) => f.endsWith('.yaml'))) {
    const mapping = parse(readFileSync(join(testsDir, file), 'utf8'));
    const folder = join(skillsDir, `abdm-${mapping.module}`);
    if (!existsSync(folder)) { problems.push(`abdm-${mapping.module}: no skill folder in ${skillsDir}`); continue; }
    if (!existsSync(join(folder, 'references', 'functionalities'))) {
      problems.push(`abdm-${mapping.module}: its cases are mapped, so it is built per functionality, but it has no references/functionalities/`);
      continue;
    }
    problems.push(...checkFolder(folder, mapping, atoms));
    checked++;
  }
  for (const p of problems) console.error(p);
  if (!problems.length) console.log(`check-functionality-skills: ${checked} skill${checked === 1 ? '' : 's'} built per functionality, every file complete, no rule in two files`);
  process.exit(problems.length ? 1 : 0);
}
