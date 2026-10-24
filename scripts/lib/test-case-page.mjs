// Reads a generated UI test case page, site/docs/hiecm/v3/resources/test-cases/<page>.mdx,
// back into its cases, and says what each case is for an entity type.
//
// The page is written by scripts/build-test-cases.py from NHA's workbook, so
// reading it here means a skill built from it carries the sheet's own words
// and markings and never a copy typed by hand. The marking rules mirror
// classify() and read_cases() in the python block of
// catalogue/shared/concepts/test-report.md, which is what `abdm_report.py
// plan` prints; scripts/check-test-report.py runs both on the M1 workbook and
// fails when they disagree on any case.
//
//   node scripts/lib/test-case-page.mjs <page> <government|private>
//     prints one "<case id> | <applicability>" line per case, in page order.
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(fileURLToPath(import.meta.url), '..', '..', '..');
export const pagesDir = join(root, 'site', 'docs', 'hiecm', 'v3', 'resources', 'test-cases');
export const ENTITIES = ['government', 'private'];

/** Markdown cell text back to plain text: line breaks kept, escapes and markup dropped. */
function plain(text) {
  return text
    .replace(/<br\/>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\\([\\|.*_#\-+!()[\]`<>{}])/g, '$1')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .join('\n');
}

/**
 * Every case on a page, in page order, as
 * {id, group: {number, name, applies}, marking, title, what, steps, expected, tester}.
 * `marking` is the cell's raw text after the id; `steps` is a list of lines.
 */
export function readPage(mdx) {
  const cases = [];
  let group = null;
  for (const line of mdx.split('\n')) {
    const heading = line.match(/^## (\d+)\\\. (.+)$/);
    if (heading) { group = {number: Number(heading[1]), name: heading[2].trim(), applies: ''}; continue; }
    const applies = line.match(/^Applies to: (.+)\.$/);
    if (applies && group) { group.applies = applies[1].trim(); continue; }
    const m = line.match(/^\| <Link id="[^"]*" to="[^"]*">([^<]+)<\/Link>(.*)$/);
    if (!m) continue;
    const cells = m[2].trimEnd().replace(/\|$/, '').split(' | ');
    const marking = cells[0].replace(/^<br\/>/, '').replace(/^Row [^<]*<br\/>/, '').trim();
    const what = cells[1] ?? '';
    const pass = cells[2] ?? '';
    const title = plain(what.match(/^\*\*(.+?)\*\*/)?.[1] ?? '');
    const steps = what.match(/<details><summary>Steps<\/summary>([\s\S]*?)<\/details>/)?.[1] ?? '';
    const description = what.replace(/^\*\*.+?\*\*/, '').replace(/<details>[\s\S]*<\/details>/, '');
    const [expected, tester] = pass.split('<br/>*For the tester:* ');
    cases.push({
      id: m[1].replace(/\s+/g, ''),
      group,
      marking,
      title,
      what: plain(description),
      steps: plain(steps).split('\n').filter(Boolean),
      expected: plain(expected ?? ''),
      tester: plain(tester ?? ''),
    });
  }
  return cases;
}

export function loadPage(page) {
  return readPage(readFileSync(join(pagesDir, `${page}.mdx`), 'utf8'));
}

/** The one entity type a group is for, when its Applicable To names only one. */
export function restrictedTo(applies) {
  const low = String(applies ?? '').toLowerCase();
  const gov = low.includes('gov');
  const priv = low.includes('priv');
  if (low.includes('all') || low.includes('both') || gov === priv) return null;
  return gov ? 'government' : 'private';
}

const EITHER = /^Government: \[([^\]]+)\]\([^)]*\) or \[([^\]]+)\]\([^)]*\) is mandatory\.<br\/>Private: optional\.$/;

/** {kind, pair} for one rendered marking and entity type, as classify() reads the sheet's. */
function classify(text, entity, id) {
  const either = text.match(EITHER);
  if (either) return entity === 'government' ? {kind: 'pair', pair: [either[1], either[2]]} : {kind: 'optional'};
  const t = plain(text);
  const low = t.toLowerCase();
  if (low === 'optional') return {kind: 'optional'};
  if (low === 'mandatory') return {kind: 'mandatory'};
  const who = low.match(/^mandatory for\s+(.*)$/);
  if (who) {
    const head = who[1].split('(')[0];
    const gov = head.includes('gov');
    const priv = head.includes('priv');
    if ((gov || priv) && !((entity === 'government' && gov) || (entity === 'private' && priv))) return {kind: 'optional'};
    if (who[1].includes('(') || /\bif\b/.test(who[1])) return {kind: 'conditional'};
    return {kind: 'mandatory'};
  }
  // A form the page has not carried before. Failing here is the point: the
  // python classifier would read it one way and a guess here another.
  throw new Error(`${id}: marking "${t}" is not a form scripts/lib/test-case-page.mjs reads; teach it the form, as classify() in test-report.md reads it`);
}

/**
 * What each case is for one entity type, in page order, as
 * {id, kind, pair, na, label} where kind is mandatory, conditional, pair or
 * optional, and na is true when the case's group is for the other entity type.
 * `label` is the words `abdm_report.py plan` prints for it.
 */
export function applicability(cases, entity) {
  const recs = cases.map((c) => ({id: c.id, applies: c.group?.applies ?? '', group: c.group?.name ?? '', ...classify(c.marking, entity, c.id)}));
  const byId = new Map(recs.map((r) => [r.id, r]));
  for (const r of recs.filter((x) => x.kind === 'pair')) {
    for (const id of r.pair) {
      const other = byId.get(id);
      if (other) Object.assign(other, {kind: 'pair', pair: r.pair});
    }
  }
  for (const r of recs) {
    const only = restrictedTo(r.applies);
    r.na = Boolean(only && only !== entity);
    if (r.na) Object.assign(r, {kind: 'optional', pair: undefined});
    r.label = r.na
      ? 'not applicable'
      : r.kind === 'pair'
        ? `mandatory, either ${r.pair.join(' or ')}`
        : r.kind;
  }
  return recs;
}

/** True when a case must pass, or one of its either pair must, for this entity type. */
export const isMandatory = (rec) => !rec.na && ['mandatory', 'conditional', 'pair'].includes(rec.kind);

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const [page, entity] = process.argv.slice(2);
  if (!page || !ENTITIES.includes(entity)) {
    console.error('usage: node scripts/lib/test-case-page.mjs <page> <government|private>');
    process.exit(2);
  }
  for (const r of applicability(loadPage(page), entity)) console.log(`${r.id} | ${r.label}`);
}
