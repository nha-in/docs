// scripts/check-test-mapping.mjs
// Every NHA UI test case maps to exactly one functionality, and every
// functionality to journeys and operations that exist.
//
// Reads each catalogue/hiecm/tests/*.yaml, which must carry a `module` key,
// and compares it with the generated page of the same name,
// site/docs/hiecm/v3/resources/test-cases/<module>.mdx, the journeys under
// catalogue/hiecm/openapi/v3/journeys/, the specs and the skill folders. A new
// module needs only its mapping file.
//   npm run check:test-mapping                  every mapping
//   node scripts/check-test-mapping.mjs <file>  one mapping file, any path
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {loadJourneys, operationIndex} from './lib/journeys.mjs';

const root = join(fileURLToPath(import.meta.url), '..', '..');
const testsDir = join(root, 'catalogue', 'hiecm', 'tests');
const pagesDir = join(root, 'site', 'docs', 'hiecm', 'v3', 'resources', 'test-cases');
const skillDirs = [join(root, 'skills-src'), join(root, 'plugins', 'abdm-integrators-assistant', 'skills')];

// What a case needs from the tester. The one place each need is defined.
export const NEEDS = {
  'aadhaar-holder': 'a person present with their Aadhaar number and the mobile linked to it; the Aadhaar may already hold an ABHA',
  'aadhaar-without-abha': 'an Aadhaar that holds no ABHA, its holder present: a fresh one, or one freed by deleting its ABHA on the ABHA sandbox portal',
  'otp': 'the person reads out an OTP sent to their phone',
  'second-mobile': 'a second mobile number the person can receive an OTP on, other than the one linked to their Aadhaar or ABHA',
  'mobile-without-abha': 'a mobile number linked to no ABHA',
  'second-abha-address': 'a second ABHA address on the same ABHA number',
  'patient-registered': 'the patient or ABHA is already registered in the product, from an earlier case',
  'face-device': 'a phone with the ABHA Face RD app, or able to install it, and a camera',
  'biometric-device': 'a registered fingerprint or iris device attached to the product',
  'abha-app': 'the ABHA app on a phone, logged in with the tester\'s ABHA address',
  'counter-qr': 'the facility\'s counter QR code, displayed for scanning',
  'second-counter-qr': 'the QR code of a second counter or queue at the same facility',
  'public-callback': 'the product\'s bridge callback URL reachable from ABDM',
  'driving-licence': 'a driving licence, its holder present, to enter and photograph',
};
const SOURCES = ['apis-column', 'reviewed'];
const APPLIES = ['all', 'government', 'private'];
const CASE_KEYS = ['screen', 'ops', 'needs', 'source'];

/**
 * The cases a generated test case page carries, in order, as {id, apis}:
 * the id with spaces removed, and the paths its APIs column shows, `{{x}}`
 * read as `{x}`. A path the page shortened by the prefix it states above the
 * tables is listed both ways.
 */
export function pageCases(mdx) {
  const base = mdx.match(/API paths in the tables below start with `([^`]+)`/)?.[1] ?? '';
  const cases = [];
  for (const line of mdx.split('\n')) {
    const m = line.match(/^\| <Link id="[^"]*" to="[^"]*">([^<]+)<\/Link>/);
    if (!m) continue;
    const cells = line.trimEnd().replace(/\|$/, '').split(' | ');
    const apis = [...cells.at(-1).matchAll(/`([^`]+)`/g)]
      .map((a) => a[1].trim().split(/\s+/).at(-1))
      .filter((p) => p.startsWith('/'))
      .map((p) => p.replace(/\{\{([^}]+)\}\}/g, '{$1}'));
    cases.push({id: m[1].replace(/\s+/g, ''), apis: apis.flatMap((p) => (base && !p.startsWith(base + '/') ? [p, base + p] : [p]))});
  }
  return cases;
}

/**
 * Every problem in one mapping, as strings. Empty means valid.
 *   page      the page's cases, from pageCases
 *   journeys  module -> Map(journey id -> Set of the operation ids its steps use)
 *   ops       operation id -> {module, path}, the path without its #fragment
 *   skills    the skill folder names that exist
 */
export function mappingProblems({mapping, name, page, journeys, ops, skills}) {
  const problems = [];
  const at = (where, msg) => problems.push(`${name}: ${where}: ${msg}`);
  const seen = new Map();
  const functionalityIds = new Set();
  const columns = new Map(page.map((c) => [c.id, c.apis]));

  for (const f of mapping.functionalities ?? []) {
    const where = `functionality ${f.id ?? '(no id)'}`;
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(f.id ?? '')) at(where, 'id must be kebab case');
    if (functionalityIds.has(f.id)) at(where, 'id used twice');
    functionalityIds.add(f.id);
    if (!f.title) at(where, 'no title');
    if (!APPLIES.includes(f.applies)) at(where, `applies must be one of ${APPLIES.join(', ')}`);
    if (!skills.has(f.skill)) at(where, `skill "${f.skill}" is not a skill folder in skills-src/ or the integrators plugin`);
    // A skill abdm-<module> owns the <module> spec and journeys file.
    const module = String(f.skill ?? '').replace(/^abdm-/, '');
    const own = journeys.get(module) ?? new Map();
    const listed = f.journeys ?? [];
    const reachable = new Set();
    for (const j of listed) {
      if (!own.has(j)) at(where, `journey ${j} is not in ${module}'s journeys file`);
      else for (const op of own.get(j)) reachable.add(op);
    }
    const cases = f.cases ?? [];
    if (!cases.length) at(where, 'no cases');
    const screenOnly = (c) => Array.isArray(c.ops) && !c.ops.length && c.source === 'reviewed' && c.reason;
    if (!listed.length && !cases.every(screenOnly)) at(where, 'no journeys, so every case must be screen only (no ops) with a reason');

    for (const c of cases) {
      const id = String(c.id ?? '');
      const here = `${where}, case ${id || '(no id)'}`;
      if (seen.has(id)) at(here, `mapped twice, also under ${seen.get(id)}`);
      else seen.set(id, f.id);
      for (const key of CASE_KEYS) if (!(key in c)) at(here, `no ${key} key`);
      if ('screen' in c && !c.screen) at(here, 'screen is empty');
      for (const key of ['ops', 'needs']) if (key in c && !Array.isArray(c[key])) at(here, `${key} must be a list`);
      const caseOps = Array.isArray(c.ops) ? c.ops : [];
      for (const op of caseOps) {
        if (!ops.has(op)) { at(here, `operation ${op} is in no spec`); continue; }
        if (ops.get(op).module !== module) at(here, `operation ${op} is in the ${ops.get(op).module} spec, not ${f.skill}'s`);
        if (!reachable.has(op)) at(here, `operation ${op} is a step of none of this functionality's journeys`);
      }
      const needs = Array.isArray(c.needs) ? c.needs : [];
      for (const n of needs) if (!(n in NEEDS)) at(here, `need "${n}" is not one of ${Object.keys(NEEDS).join(', ')}`);
      for (const n of new Set(needs.filter((n, i) => needs.indexOf(n) !== i))) at(here, `need "${n}" listed twice`);
      if ('source' in c && !SOURCES.includes(c.source)) at(here, `source must be one of ${SOURCES.join(', ')}`);
      if (c.source === 'reviewed' && !c.reason) at(here, 'source is reviewed but no reason is given');
      if (c.source === 'apis-column') {
        if (!caseOps.length) at(here, 'source is apis-column but no ops are given');
        const column = columns.get(id) ?? [];
        for (const op of caseOps) {
          if (ops.has(op) && !column.includes(ops.get(op).path)) at(here, `source is apis-column but ${ops.get(op).path} (${op}) is not in the case's APIs column`);
        }
      }
      if ('gaps' in c) {
        if (!Array.isArray(c.gaps) || !c.gaps.length) at(here, 'gaps must be a non-empty list');
        else for (const g of c.gaps) if (g?.step === undefined || !g?.note) at(here, 'every gap needs a step and a note');
        if (c.source !== 'reviewed' || !c.reason) at(here, 'a case with gaps must be source: reviewed with a reason');
      }
    }
  }

  if (!page.length) at('page', 'the page has no cases');
  for (const id of columns.keys()) if (!seen.has(id)) at('page', `case ${id} has no functionality`);
  for (const id of seen.keys()) if (!columns.has(id)) at('mapping', `case ${id} is not on the page`);
  return problems;
}

/** Problems for a list of mapping files, read from disk, and how many were checked. */
export function checkFiles(files) {
  const journeys = new Map([...loadJourneys()].map(([module, list]) =>
    [module, new Map(list.map((j) => [j.id, new Set((j.steps ?? []).map((s) => s.op))]))]));
  const ops = new Map([...operationIndex()].map(([id, e]) => [id, {module: e.module, path: e.path.split('#')[0]}]));
  const skills = new Set(skillDirs.filter(existsSync).flatMap((d) => readdirSync(d)));
  const problems = [];
  let checked = 0;
  for (const file of files) {
    const name = relative(root, file);
    const mapping = parse(readFileSync(file, 'utf8'));
    if (!mapping?.module) { problems.push(`${name}: no module key; every catalogue/hiecm/tests/*.yaml is a mapping`); continue; }
    checked++;
    const pagePath = join(pagesDir, `${mapping.module}.mdx`);
    if (!existsSync(pagePath)) { problems.push(`${name}: no page ${relative(root, pagePath)} for module ${mapping.module}`); continue; }
    const page = pageCases(readFileSync(pagePath, 'utf8'));
    problems.push(...mappingProblems({mapping, name, page, journeys, ops, skills}));
  }
  if (!checked) problems.push('no mapping file was checked');
  return {problems, checked};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const files = process.argv.slice(2).length
    ? process.argv.slice(2)
    : readdirSync(testsDir).filter((f) => f.endsWith('.yaml')).sort().map((f) => join(testsDir, f));
  const {problems, checked} = checkFiles(files);
  for (const p of problems) console.error(p);
  if (!problems.length) console.log(`check:test-mapping: ${checked} mapping file${checked === 1 ? '' : 's'}, every case mapped once`);
  process.exit(problems.length ? 1 : 0);
}
