// Checks every module skill built per functionality: the abdm-<module> folders
// whose cases are mapped in catalogue/hiecm/tests/<module>.yaml.
//
// 1. No rule in two files. A paragraph, list item or table row of more than
//    twelve words that appears verbatim in two files of the folder fails.
//    NHA's own case text under each file's "## Cases" is quoted, not a rule,
//    and code blocks are calls and scripts, so neither is compared.
// 2. Every functionality file is complete: its cases, its screen requirements
//    citing them, its calls and its errors.
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
const MIN_WORDS = 13;

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : name.endsWith('.md') ? [p] : [];
  });
}

/** The comparable units of one file: lines outside code and outside "## Cases", with more than twelve words. */
export function units(text) {
  const out = [];
  let inCode = false;
  let inCases = false;
  for (const raw of text.split('\n')) {
    const line = raw.trim();
    if (line.startsWith('```')) { inCode = !inCode; continue; }
    if (inCode) continue;
    if (/^## /.test(line)) inCases = line === '## Cases';
    if (inCases || !line || /^#/.test(line) || /^\|[-| :]+\|$/.test(line)) continue;
    const norm = line.replace(/\s+/g, ' ');
    if (norm.split(' ').length >= MIN_WORDS) out.push(norm);
  }
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
    for (const u of new Set(units(readFileSync(file, 'utf8')))) {
      if (!seen.has(u)) seen.set(u, rel(file));
      else if (seen.get(u) !== rel(file)) fail(`the same text is in ${seen.get(u)} and ${rel(file)}: "${u.slice(0, 120)}${u.length > 120 ? '...' : ''}"`);
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
    if (screens && !ids.some((id) => screens.includes(id))) fail(`${where}: no screen requirement cites one of its cases`);
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
