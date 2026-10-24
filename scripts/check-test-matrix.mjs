// scripts/check-test-matrix.mjs
// The case to API matrix of each module skill built per job, kept true.
//
// catalogue/hiecm/tests/matrix/<module>.json is written by
// scripts/build-test-cases.py from NHA's workbooks. This holds it to:
//   every case on the generated test case page is in exactly one matrix,
//   and every matrix case is on the page;
//   the Expected Result is the page's, which is the sheet's;
//   every operation id exists, in the specification the matrix names;
//   every journey exists and uses that operation;
//   a path is either resolved to operations or flagged with its reason;
//   the file is current: regenerating from the sheets gives the same bytes.
//   npm run check:test-matrix
import {existsSync, mkdtempSync, readdirSync, readFileSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, relative} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {loadJourneys, operationIndex} from './lib/journeys.mjs';

const root = join(fileURLToPath(import.meta.url), '..', '..');
const matrixDir = join(root, 'catalogue', 'hiecm', 'tests', 'matrix');

// Letters and digits only, so the page's markdown escapes and line breaks do not matter.
const squash = (text) => String(text).replace(/<br\/?>/g, ' ').replace(/[^\p{L}\p{N}]+/gu, '').toLowerCase();

/** The cases of a generated test case page, as {anchor, id, passes}: the "Pass when" cell, which may end in a tester note. */
export function pageRows(mdx) {
  const rows = [];
  for (const line of mdx.split('\n')) {
    const m = line.match(/^\| <Link id="([^"]*)" to="[^"]*">([^<]+)<\/Link>/);
    if (!m) continue;
    const cells = line.trimEnd().replace(/\|$/, '').split(' | ');
    // The page's last column lists the APIs; a sheet with none has three columns and no list to compare.
    rows.push({anchor: m[1], id: m[2], passes: (cells[2] ?? '').split('<br/>*For the tester:*')[0], apis: cells.length > 3 ? cells.at(-1) : null});
  }
  return rows;
}

/**
 * Every problem in one module's matrix, as strings. Empty means valid.
 *   page      the page's rows, from pageRows
 *   ops       operation id -> {module}
 *   journeys  journey id -> Set of the operation ids its steps use, with .module the journeys file it is in
 *   anchors   every case anchor of the matrices that share this page (the PHR page has four); default this matrix's own
 */
export function matrixProblems({matrix, name, page, ops, journeys, anchors}) {
  const problems = [];
  const at = (where, msg) => problems.push(`${name}: ${where}: ${msg}`);
  const cases = matrix.cases ?? [];
  const byAnchor = new Map(page.map((r) => [r.anchor, r]));
  const seen = new Set();
  if (!cases.length) at('matrix', 'has no cases');
  for (const c of cases) {
    const here = `case ${c.id ?? '(no id)'}`;
    if (seen.has(c.anchor)) at(here, `anchor ${c.anchor} used twice`);
    seen.add(c.anchor);
    const row = byAnchor.get(c.anchor);
    if (!row) at(here, `is not on ${matrix.page}`);
    else {
      // A repeated id is ID#2, ID#3, as plan prints it; the page shows the id alone.
      if (row.id !== String(c.id).replace(/#\d+$/, '')) at(here, `the page names it ${row.id}`);
      if (squash(c.expected || 'Not stated.') !== squash(row.passes)) {
        at(here, 'Expected Result differs from the page, which carries the sheet\'s');
      }
      // The sheet lists APIs for this row, so the matrix must hold them.
      if (row.apis !== null && !row.apis.startsWith('None.') && !(c.apis ?? []).length) {
        at(here, 'the sheet lists APIs for this case but the matrix has none');
      }
    }
    for (const e of ['government', 'private']) {
      if (!c.marking?.[e]) at(here, `no marking for ${e}`);
      if (typeof c.mandatory?.[e] !== 'boolean') at(here, `no mandatory flag for ${e}`);
      // plan prints "mandatory..." or "conditional..." for a case that must be run, and anything else for one that need not be.
      else if (c.marking?.[e] && c.mandatory[e] !== /^(mandatory|conditional)\b/i.test(c.marking[e])) {
        at(here, `mandatory is ${c.mandatory[e]} for ${e} but plan prints "${c.marking[e]}"`);
      }
    }
    for (const a of c.apis ?? []) {
      const api = `${here}, ${a.source ?? a.path ?? '(no path)'}`;
      if (a.unresolved) {
        if (!a.reason) at(api, 'unresolved but no reason is given');
        if (a.operations?.length) at(api, 'flagged unresolved but names operations');
        continue;
      }
      if (!a.operations?.length) { at(api, 'neither resolved to an operation nor flagged unresolved'); continue; }
      // Operations are held to the module's own specs, not to the row's say-so: another module's must be flagged and drives no journey.
      const own = matrix.specs ?? [];
      for (const op of a.operations) {
        if (!ops.has(op)) { at(api, `operation ${op} is in no spec`); continue; }
        const module = ops.get(op).module;
        if (a.other_module ? own.includes(module) : !own.includes(module)) {
          at(api, a.other_module ? `operation ${op} is in this module's ${module} spec but the row says other_module`
            : `operation ${op} is in the ${module} spec, not ${own.join(' or ')}: flag it other_module`);
        }
      }
      if (a.other_module && a.journeys?.length) at(api, 'an other_module operation must not drive journeys');
      for (const j of a.journeys ?? []) {
        if (!journeys.has(j)) at(api, `journey ${j} does not exist`);
        else if (!own.includes(journeys.get(j).module)) at(api, `journey ${j} belongs to the ${journeys.get(j).module} journeys, not ${own.join(' or ')}`);
        else if (!a.operations.some((op) => journeys.get(j).has(op))) at(api, `journey ${j} uses none of the operations`);
      }
    }
  }
  const all = anchors ?? seen;
  for (const r of page) if (!all.has(r.anchor)) at(`case ${r.id}`, `is on ${matrix.page} but in no matrix`);
  return problems;
}

/** Problems for every matrix under the directory, whether it is current, and how many were checked. */
export function checkAll({dir = matrixDir, regenerate = true} = {}) {
  const journeys = new Map([...loadJourneys()].flatMap(([module, list]) => list.map((j) => [j.id, Object.assign(new Set((j.steps ?? []).map((s) => s.op)), {module})])));
  const ops = new Map([...operationIndex()].map(([id, e]) => [id, {module: e.module}]));
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.json')).sort() : [];
  const problems = [];
  const matrices = files.map((f) => ({file: f, matrix: JSON.parse(readFileSync(join(dir, f), 'utf8'))}));
  const pages = new Map();
  const pageRowsFor = (page) => {
    if (!pages.has(page)) pages.set(page, existsSync(join(root, page)) ? pageRows(readFileSync(join(root, page), 'utf8')) : null);
    return pages.get(page);
  };
  // A page is owned by every matrix naming it; a page row must be in one of them.
  const owners = new Map();
  for (const {matrix} of matrices) owners.set(matrix.page, [...(owners.get(matrix.page) ?? []), matrix]);
  for (const {file, matrix} of matrices) {
    const name = relative(root, join(dir, file));
    const page = pageRowsFor(matrix.page);
    if (!page) { problems.push(`${name}: no page ${matrix.page}`); continue; }
    const anchors = new Set(owners.get(matrix.page).flatMap((m) => m.cases.map((c) => c.anchor)));
    problems.push(...matrixProblems({matrix, name, page, ops, journeys, anchors}));
  }
  if (!matrices.length) problems.push(`no matrix under ${relative(root, dir)}`);
  if (regenerate && matrices.length) {
    const tmp = mkdtempSync(join(tmpdir(), 'test-matrix-'));
    try {
      const run = spawnSync('python3', [join(root, 'scripts', 'build-test-cases.py'), '--matrix-out', tmp], {cwd: root, encoding: 'utf8'});
      if (run.status !== 0) problems.push(`python3 scripts/build-test-cases.py --matrix-out failed: ${(run.stderr || run.stdout).trim().split('\n').pop()}`);
      else {
        const fresh = readdirSync(tmp).filter((f) => f.endsWith('.json')).sort();
        for (const f of new Set([...fresh, ...files])) {
          const current = existsSync(join(dir, f)) ? readFileSync(join(dir, f), 'utf8') : null;
          const wanted = existsSync(join(tmp, f)) ? readFileSync(join(tmp, f), 'utf8') : null;
          if (current !== wanted) problems.push(`${relative(root, join(dir, f))}: ${current === null ? 'is missing' : wanted === null ? 'is not generated any more' : 'is out of date'}. Run: python3 scripts/build-test-cases.py`);
        }
      }
    } finally {
      rmSync(tmp, {recursive: true, force: true});
    }
  }
  return {problems: [...new Set(problems)], checked: matrices.length, cases: matrices.reduce((n, m) => n + m.matrix.cases.length, 0)};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const {problems, checked, cases} = checkAll();
  for (const p of problems) console.error(p);
  if (!problems.length) console.log(`check:test-matrix: ${checked} matrices, ${cases} cases, each on its page with real operations and journeys, and current`);
  process.exit(problems.length ? 1 : 0);
}
