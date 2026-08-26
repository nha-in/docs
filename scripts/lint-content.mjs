// Enforces the content paradigm in CONTRIBUTING.md over site/docs.
//
// The paradigm's claim is that a page is too long because its scope is too
// wide, not because its prose is fat. So the budgets here are per page type
// and generous; busting one is a signal to split the page, not to compress
// sentences.
//
// Everything is counted over prose only. Code blocks, tables, headings,
// frontmatter and JSX are stripped first, because counting them punishes a
// reference page for being a reference page and pollutes every average.
// (GitLab's docs linter excludes the same three for the same reason.)
//
// Two tiers. An error fails CI. A warning is reported and does not, so the
// standing stock can be cleaned page by page rather than in one merge.
import {readdirSync, readFileSync, statSync} from 'node:fs';
import {join, dirname, relative, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docsDir = join(root, 'site', 'docs');

// Prose word budgets. Reference pages are data, not prose, and carry none.
const TYPES = {
  'module-overview': {budget: 600, label: 'module overview'},
  concept: {budget: 900, label: 'concept'},
  howto: {budget: 700, label: 'use case or how-to'},
  endpoint: {budget: 400, label: 'endpoint'},
  reference: {budget: null, label: 'reference'},
};

const SENTENCE_WARN = 25; // GOV.UK's ceiling: comprehension falls off above it
const SENTENCE_ERROR = 35;
const PARAGRAPH_SENTENCES = 5;
const IN_SHORT_ABOVE = 300; // a page longer than this states its answer up front
const DESCRIPTION_MAX = 160;
const BUDGET_ERROR_FACTOR = 1.3;

/** Page type from the path, unless frontmatter names one. */
function pageType(file, fm) {
  if (fm?.page_type) return fm.page_type;
  const path = relative(docsDir, file);
  const name = basename(path);
  if (/\/endpoints\//.test(path)) return 'endpoint';
  if (/(^|\/)reference\//.test(path) || name === 'errors.md') return 'reference';
  if (/(^|\/)concepts\//.test(path)) return 'concept';
  if (/(^|\/)api\/[^/]+\/index\.mdx?$/.test(path)) return 'module-overview';
  return 'howto';
}

/**
 * The prose of a page: what a reader actually reads in sentences.
 *
 * Order matters. Code fences go first so a table or heading inside a sample is
 * never mistaken for the page's own.
 */
function prose(body) {
  return body
    .replace(/^```[\s\S]*?^```/gm, '') // fenced code, mermaid included
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/^(import|export)\s.*$/gm, '') // MDX module lines
    .replace(/<([A-Z]\w*)[\s\S]*?<\/\1>/g, '') // JSX with children
    .replace(/<[A-Z]\w*[\s\S]*?\/>/g, '') // self closing JSX
    // Raw HTML blocks: the generated next-step cards and similar. Their text is
    // navigation furniture, not prose the reader reads in sentences.
    .replace(/^<(a|div|section|aside|nav|figure)\b[\s\S]*?<\/\1>\s*$/gm, '')
    .replace(/<\/?[a-z][^>]*>/g, '')
    .replace(/^\s*\|.*$/gm, '') // table rows
    .replace(/^\s*#{1,6}\s.*$/gm, '') // headings
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1') // links keep their text, drop the URL
    .replace(/`[^`]*`/g, 'x') // inline code is one word, whatever it holds
    .replace(/^\s*:::.*$/gm, ''); // admonition markers
}

const words = (text) =>
  text.split(/\s+/).filter((token) => /[A-Za-z0-9]/.test(token)).length;

/** Sentences, treating an unterminated bullet or line as one sentence. */
function sentences(text) {
  const out = [];
  for (const block of text.split(/\n/)) {
    const line = block.replace(/^\s*([-*+]|\d+\.)\s+/, '').trim();
    if (!line) continue;
    for (const piece of line.split(/(?<=[.!?])\s+/)) {
      const clean = piece.trim();
      if (clean) out.push(clean);
    }
  }
  return out;
}

/** Paragraphs only. A run of bullets is a list, and is not held to the limit. */
function paragraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter((block) => block && !/^([-*+]|\d+\.|>)\s/.test(block));
}

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name.startsWith('_')) continue; // partials, never rendered as pages
    const path = join(dir, name);
    if (statSync(path).isDirectory()) out.push(...walk(path));
    // READMEs are contributor notes for their folder and never render.
    else if (/\.mdx?$/.test(name) && name !== 'README.md') out.push(path);
  }
  return out;
}

const errors = [];
const warnings = [];
// Over budget is listed on its own: those pages need splitting, which is a
// different piece of work from an edit, and burying them in the warning list
// means nobody ever does it.
const overBudget = [];
const files = walk(docsDir);
let checked = 0;

for (const file of files) {
  const where = relative(root, file);
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  let fm = null;
  let body = raw;
  if (match) {
    try {
      fm = parse(match[1]);
    } catch (e) {
      errors.push(`${where}: frontmatter is not valid YAML: ${e.message}`);
    }
    body = match[2];
  }

  // Generated pages are the specifications rendered. A rule broken there is a
  // bug in the generator or the specification, so report it against the page
  // but never block a merge on content nobody hand wrote.
  const generated = fm?.generated === true;
  const report = generated ? warnings : errors;

  const type = pageType(file, fm);
  const {budget, label} = TYPES[type] ?? TYPES.howto;
  const text = prose(body);
  const count = words(text);
  checked += 1;

  // 1. The summary. It is the page's TL;DR everywhere the page is not: search
  //    results, link previews, and the retrieval index.
  if (fm && fm.description === undefined) {
    warnings.push(`${where}: no description in frontmatter`);
  } else if (typeof fm?.description === 'string' && fm.description.length > DESCRIPTION_MAX) {
    report.push(
      `${where}: description is ${fm.description.length} characters, over ${DESCRIPTION_MAX}`,
    );
  }

  // 2. Scope. Over budget means split the page or cut its scope.
  //
  // ponytail: a warning even well over budget, because the fix is a page split
  // with redirects rather than an edit. Four pages are over today (M4
  // undocumented, PHR, HPR, HFR, UHI onboarding). Promote the
  // BUDGET_ERROR_FACTOR branch to an error once they are split.
  if (budget && count > budget) {
    overBudget.push(
      `${where}: ${count} prose words in a ${label} page, budget ${budget}` +
        (count > budget * BUDGET_ERROR_FACTOR ? ' (split this page)' : ''),
    );
  }

  // 3. The visible summary, on any page long enough to need one.
  if (count > IN_SHORT_ABOVE && !/^\s*#{2,3}\s+In short\s*$/m.test(body)) {
    warnings.push(
      `${where}: ${count} prose words and no "## In short" block (required above ${IN_SHORT_ABOVE})`,
    );
  }

  // 4. No wind-up. A reader who lands here from search skips anything labelled
  //    introduction or overview, so the first heading must not be one.
  const firstHeading = body.match(/^#{2,6}\s+(.+)$/m)?.[1]?.trim();
  if (firstHeading && /^(introduction|overview)$/i.test(firstHeading)) {
    report.push(`${where}: first section is "${firstHeading}"; open with the answer instead`);
  }

  // 5. Sentence length.
  for (const sentence of sentences(text)) {
    const length = words(sentence);
    if (length > SENTENCE_ERROR) {
      report.push(`${where}: ${length} word sentence: "${sentence.slice(0, 60)}..."`);
    } else if (length > SENTENCE_WARN) {
      warnings.push(`${where}: ${length} word sentence: "${sentence.slice(0, 60)}..."`);
    }
  }

  // 6. One idea per paragraph.
  for (const paragraph of paragraphs(text)) {
    const n = sentences(paragraph).length;
    if (n > PARAGRAPH_SENTENCES) {
      warnings.push(`${where}: ${n} sentence paragraph: "${paragraph.slice(0, 60)}..."`);
    }
  }

  // 7. The em dash. Banned outright by the writing guide.
  if (body.includes('—')) {
    report.push(`${where}: contains an em dash`);
  }
}

const show = (list, limit = 40) => {
  for (const line of list.slice(0, limit)) console.log(`  ${line}`);
  if (list.length > limit) console.log(`  ... and ${list.length - limit} more`);
};

console.log(`${checked} page(s) checked against the content paradigm.`);

if (overBudget.length) {
  console.log(`\n${overBudget.length} page(s) over budget, to be split:`);
  show(overBudget, overBudget.length);
}

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s), not blocking:`);
  show(warnings);
}

if (errors.length) {
  console.error(`\n${errors.length} error(s):`);
  show(errors);
  process.exit(1);
}

console.log('\nNo blocking content problems.');
