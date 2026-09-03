#!/usr/bin/env node
// Joins eval cases and atoms to the annexure. A case or an atom that cites a
// row which does not exist is a citation to nothing, and the whole point of
// the annexure is that every claim can be followed back to NHA.
import {readFileSync, readdirSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const annexurePath = join(root, 'catalogue/annexure/askai-sources.md');
const casesDir = join(root, 'evals/askai/cases');
const atomsDir = join(root, 'catalogue');

const text = readFileSync(annexurePath, 'utf8');
const rows = new Map();
for (const line of text.split('\n')) {
  const m = /^\|\s*([a-z0-9-]+)\s*\|/.exec(line);
  if (m && m[1] !== 'id' && !/^-+$/.test(m[1])) rows.set(m[1], {atoms: 0, cases: 0});
}

const failures = [];
const walk = (dir, out = []) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
};

// Cases: every case must cite a row.
try {
  for (const file of walk(casesDir).filter((f) => f.endsWith('.json'))) {
    const c = JSON.parse(readFileSync(file, 'utf8'));
    const ref = String(c.source_row ?? '');
    const id = ref.startsWith('annexure#') ? ref.slice('annexure#'.length) : '';
    if (!rows.has(id)) failures.push(`${file}: source_row "${ref}" is not a row in the annexure`);
    else rows.get(id).cases += 1;
  }
} catch (err) {
  if (err.code !== 'ENOENT') throw err; // no cases yet is fine
}

// Atoms: a `sources:` entry may cite `annexure#<id>`; if it does, the row must exist.
for (const file of walk(atomsDir).filter((f) => f.endsWith('.md') && !f.includes('/annexure/'))) {
  const body = readFileSync(file, 'utf8');
  for (const m of body.matchAll(/annexure#([a-z0-9-]+)/g)) {
    if (!rows.has(m[1])) failures.push(`${file}: cites annexure#${m[1]}, which does not exist`);
    else rows.get(m[1]).atoms += 1;
  }
}

// Rewrite the counts in place so the table stays true.
let updated = text;
for (const [id, n] of rows) {
  updated = updated.replace(
    new RegExp(`^(\\|\\s*${id}\\s*\\|(?:[^|]*\\|){4})[^|]*\\|[^|]*\\|`, 'm'),
    `$1 ${n.atoms} | ${n.cases} |`,
  );
}
if (process.argv.includes('--write') && updated !== text) writeFileSync(annexurePath, updated);
else if (updated !== text && process.env.CI) failures.push('annexure counts are stale; run npm run lint:annexure -- --write');

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`lint-annexure: ${rows.size} rows, all citations resolve`);
