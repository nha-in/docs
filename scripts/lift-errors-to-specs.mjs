// One time lift: reads the error tables out of the reference page and writes
// them into the specifications as `x-abdm-errors`, so the codes have one home.
//
// After this runs, scripts/build-api-reference.mjs generates the error pages
// from the specs and this script is no longer needed. It is kept so the lift
// is reviewable rather than a hand edit nobody can check.
import {readFileSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const page = readFileSync(
  join(root, 'site', 'docs', 'abdm', 'v3', 'reference', 'error-codes.md'),
  'utf8',
);

/** Rows of a markdown table under a heading, as arrays of cells. */
function rowsUnder(heading) {
  const start = page.indexOf(`## ${heading}`);
  if (start < 0) return [];
  const rest = page.slice(start);
  const end = rest.indexOf('\n## ', 3);
  const block = end > 0 ? rest.slice(0, end) : rest;
  return block
    .split('\n')
    .filter((line) => line.startsWith('| `'))
    .map((line) =>
      line
        .split('|')
        .slice(1, -1)
        .map((cell) => cell.trim().replace(/^`|`$/g, '')),
    );
}

const SECTIONS = [
  {
    heading: 'M2 codes',
    spec: 'hiecm-m2.yaml',
    source:
      "NHA's published M2 list, which carries code and message only. The action is this catalogue's reading of the message text.",
    map: ([code, message, action]) => ({code, message, action}),
  },
  {
    heading: 'M1 codes',
    spec: 'hiecm-m1.yaml',
    source:
      "Saved example responses in NHA's M1 ABHA Postman collection. NHA's M1 document carries its code reference as screenshots with no text.",
    map: ([code, message, action]) => ({code, message, action}),
  },
  {
    heading: 'M1 failures with no `ABDM-` code',
    spec: 'hiecm-m1.yaml',
    key: 'x-abdm-errors-untagged',
    source:
      "The same collection, and the only source that recorded HTTP statuses.",
    map: ([code, http, message, action]) => ({
      code,
      http: Number(http) || http,
      message,
      action,
    }),
  },
  {
    heading: 'UIDAI codes inside `ABDM-1204`',
    spec: 'hiecm-m1.yaml',
    key: 'x-abdm-errors-uidai',
    source:
      "Codes from the Unique Identification Authority of India, passed through inside the message of ABDM-1204. NHA passes through more than these, so parse the message.",
    map: ([code, meaning]) => ({code, message: meaning}),
  },
];

const quote = (value) =>
  typeof value === 'number' ? String(value) : JSON.stringify(String(value));

const byFile = new Map();
for (const section of SECTIONS) {
  const rows = rowsUnder(section.heading).map(section.map);
  if (rows.length === 0) {
    console.warn(`No rows found under "${section.heading}"`);
    continue;
  }
  const key = section.key ?? 'x-abdm-errors';
  const block = [
    '',
    `# Lifted from the error reference so the codes have one home.`,
    `${key}:`,
    `  source: ${quote(section.source)}`,
    '  codes:',
    ...rows.flatMap((row) => [
      `    - code: ${quote(row.code)}`,
      ...(row.http !== undefined ? [`      http: ${row.http}`] : []),
      `      message: ${quote(row.message)}`,
      ...(row.action ? [`      action: ${quote(row.action)}`] : []),
    ]),
  ].join('\n');
  const existing = byFile.get(section.spec) ?? [];
  existing.push({key, block, count: rows.length});
  byFile.set(section.spec, existing);
}

for (const [file, blocks] of byFile) {
  const path = join(root, 'catalogue', 'openapi', file);
  let text = readFileSync(path, 'utf8');
  for (const {key, block, count} of blocks) {
    if (text.includes(`\n${key}:`)) {
      console.log(`${file}: ${key} already present, left alone`);
      continue;
    }
    text = `${text.trimEnd()}\n${block}\n`;
    console.log(`${file}: wrote ${count} code(s) into ${key}`);
  }
  writeFileSync(path, text);
}
