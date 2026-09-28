// What's New, as a function of the catalogue rather than a habit.
//
//   node scripts/build-whats-new.mjs            read the facts, diff them against the
//                                               last published snapshot, append the
//                                               entries the rules produce, move the
//                                               snapshot, render the pages
//   node scripts/build-whats-new.mjs --check    fail if the snapshot or the pages are
//                                               stale, which is what CI runs
//   node scripts/build-whats-new.mjs --render   render the pages from the entries
//                                               only; the site's prebuild step
//   node scripts/build-whats-new.mjs --date=YYYY-MM-DD   date the entries
//
// Three things live under catalogue/changelog/. `facts/` is the last published
// snapshot, one file per module, the cursor this run diffs against. `entries/`
// is the durable record, one JSON file per date, which a person may still edit
// (an entry a revert made moot can go; two can be merged). The pages under
// site/docs/whats-new/ are rendered from the entries and carry `generated:
// true`; the five hand written pages from before this script stay as they
// are and only have their sidebar position managed.
//
// The first run, with no snapshot, writes one and no entries: a baseline is a
// cursor, not news. See scripts/lib/changelog-facts.mjs for what is a fact,
// changelog-rules.mjs for what a difference means, changelog-render.mjs for
// the templates.
import {existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {extractFacts, SITE_FACTS} from './lib/changelog-facts.mjs';
import {entriesFor, unchanged} from './lib/changelog-rules.mjs';
import {headingFor, headingsOf, renderIndex, renderPage, sortEntries} from './lib/changelog-render.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const factsDir = join(root, 'catalogue', 'changelog', 'facts');
const entriesDir = join(root, 'catalogue', 'changelog', 'entries');
const pagesDir = join(root, 'site', 'docs', 'whats-new');

const args = process.argv.slice(2);
const check = args.includes('--check');
const renderOnly = args.includes('--render');
const dateArg = args.find((a) => a.startsWith('--date='))?.slice(7);

/** Today in Asia/Kolkata, the date the existing pages are written in. */
function today() {
  if (dateArg) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateArg)) throw new Error(`--date wants YYYY-MM-DD, got ${dateArg}`);
    return dateArg;
  }
  return new Date().toLocaleDateString('en-CA', {timeZone: 'Asia/Kolkata'});
}

const stable = (value) => `${JSON.stringify(value, null, 2)}\n`;

function readFacts() {
  if (!existsSync(factsDir)) return {modules: {}, site: {}};
  const modules = {};
  let site = {};
  for (const name of readdirSync(factsDir)) {
    if (!name.endsWith('.json')) continue;
    const json = JSON.parse(readFileSync(join(factsDir, name), 'utf8'));
    if (name === SITE_FACTS) site = json;
    else modules[name.replace(/\.json$/, '')] = json;
  }
  return {modules, site};
}

function writeIfChanged(file, content) {
  if (existsSync(file) && readFileSync(file, 'utf8') === content) return false;
  writeFileSync(file, content);
  return true;
}

/** Write the snapshot, one file per module, and drop the file of a module that is gone. */
function writeFacts(facts) {
  mkdirSync(factsDir, {recursive: true});
  const keep = new Set([SITE_FACTS]);
  for (const [key, module] of Object.entries(facts.modules)) {
    keep.add(`${key}.json`);
    writeIfChanged(join(factsDir, `${key}.json`), stable(module));
  }
  writeIfChanged(join(factsDir, SITE_FACTS), stable(facts.site));
  for (const name of readdirSync(factsDir)) if (!keep.has(name)) rmSync(join(factsDir, name));
}

function readEntries() {
  if (!existsSync(entriesDir)) return new Map();
  const byDate = new Map();
  for (const name of readdirSync(entriesDir).sort()) {
    const match = /^(\d{4}-\d{2}-\d{2})\.json$/.exec(name);
    if (!match) continue;
    byDate.set(match[1], JSON.parse(readFileSync(join(entriesDir, name), 'utf8')));
  }
  return byDate;
}

/** The pages as they should be, from the entries and the hand written files. */
function renderAll(byDate) {
  const pages = [];
  for (const name of readdirSync(pagesDir)) {
    const match = /^(\d{4}-\d{2}-\d{2})\.mdx$/.exec(name);
    if (!match) continue;
    const file = join(pagesDir, name);
    const generated = /^generated: true$/m.test(readFileSync(file, 'utf8'));
    pages.push({date: match[1], file, generated});
  }
  for (const date of byDate.keys()) {
    if (!pages.some((p) => p.date === date)) pages.push({date, file: join(pagesDir, `${date}.mdx`), generated: true});
  }
  for (const p of pages) {
    if (p.generated && !byDate.has(p.date)) {
      throw new Error(`${p.file} is generated but catalogue/changelog/entries/${p.date}.json does not exist`);
    }
    if (!p.generated && byDate.has(p.date)) {
      throw new Error(`${p.file} was written by hand and entries/${p.date}.json also exists: keep one`);
    }
  }
  pages.sort((a, b) => b.date.localeCompare(a.date));
  const files = new Map();
  pages.forEach((p, index) => {
    const position = index + 1;
    if (p.generated) {
      const entries = byDate.get(p.date);
      files.set(p.file, renderPage(p.date, entries, position));
      p.headings = sortEntries(entries).map(headingFor);
    } else {
      // A hand written page keeps its words; only its place in the sidebar moves.
      const text = readFileSync(p.file, 'utf8');
      files.set(p.file, text.replace(/^sidebar_position: \d+$/m, `sidebar_position: ${position}`));
      p.headings = headingsOf(p.file);
    }
  });
  files.set(join(pagesDir, 'index.mdx'), renderIndex(pages.map(({date, headings}) => ({date, headings}))));
  return files;
}

function main() {
  const byDate = readEntries();

  if (renderOnly) {
    let written = 0;
    for (const [file, content] of renderAll(byDate)) if (writeIfChanged(file, content)) written += 1;
    console.log(`whats-new: ${byDate.size} generated page(s) rendered, ${written} file(s) written.`);
    return;
  }

  const prev = readFacts();
  const next = extractFacts(root);
  const baseline = !Object.keys(prev.modules).length;

  if (check) {
    const problems = [];
    if (baseline) problems.push('no snapshot under catalogue/changelog/facts/');
    else if (!unchanged(prev, next)) {
      const moved = Object.keys({...prev.modules, ...next.modules}).filter(
        (k) => JSON.stringify(prev.modules[k]) !== JSON.stringify(next.modules[k]),
      );
      if (JSON.stringify(prev.site) !== JSON.stringify(next.site)) moved.push('site');
      problems.push(`the facts changed for ${moved.join(', ')}`);
    }
    for (const [file, content] of renderAll(byDate)) {
      if (!existsSync(file) || readFileSync(file, 'utf8') !== content) problems.push(`${file.slice(root.length + 1)} is stale`);
    }
    if (problems.length) {
      console.error(`whats-new: ${problems.join('; ')}.`);
      console.error('  Run npm run changelog and commit what it writes.');
      process.exit(1);
    }
    console.log('whats-new: snapshot and pages are current.');
    return;
  }

  const date = today();
  const entries = baseline ? [] : entriesFor(prev, next, date);
  if (entries.length) {
    const file = join(entriesDir, `${date}.json`);
    const handWritten = join(pagesDir, `${date}.mdx`);
    if (existsSync(handWritten) && !/^generated: true$/m.test(readFileSync(handWritten, 'utf8'))) {
      throw new Error(`${handWritten} was written by hand; pass --date for another day or fold it into entries`);
    }
    const existing = byDate.get(date) ?? [];
    const ids = new Set(existing.map((e) => e.id));
    const fresh = entries.filter((e) => !ids.has(e.id));
    mkdirSync(entriesDir, {recursive: true});
    writeFileSync(file, stable([...existing, ...fresh]));
    byDate.set(date, [...existing, ...fresh]);
    for (const e of fresh) console.log(`  + ${e.kind.padEnd(18)} ${e.gateway}/${e.module}: ${headingFor(e)}`);
    console.log(`whats-new: ${fresh.length} entr${fresh.length === 1 ? 'y' : 'ies'} for ${date} written to ${file.slice(root.length + 1)}.`);
  } else if (baseline) {
    console.log('whats-new: no snapshot yet; writing the baseline. A baseline is a cursor, not news.');
  } else if (unchanged(prev, next)) {
    console.log('whats-new: no reader-facing change.');
  } else {
    console.log('whats-new: the facts moved but nothing a reader acts on changed; the snapshot follows.');
  }
  writeFacts(next);
  let written = 0;
  for (const [file, content] of renderAll(byDate)) if (writeIfChanged(file, content)) written += 1;
  if (written) console.log(`whats-new: ${written} page file(s) rendered.`);
}

main();
