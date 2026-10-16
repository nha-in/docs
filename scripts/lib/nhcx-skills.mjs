// The NHCX skills' rows in the skills manifest. The folders are copied in from
// upstream rather than compiled, so their titles and example prompts are held
// here, and everything else is counted from the folder itself. Read by
// build-skills.mjs for the install panel and by stamp-nhcx-skills.mjs for the
// prompts it stamps into each router.
import {existsSync, readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

export const NHCX = {
  'nhcx-full': {
    title: 'NHCX, end to end',
    example: 'Build the whole NHCX integration into this system, on whichever side it sits',
  },
  'nhcx-coverage': {
    title: 'NHCX coverage',
    example: 'Add NHCX policy search and coverage eligibility to this system',
  },
  'nhcx-preauth': {
    title: 'NHCX pre-authorisation',
    example: 'Add NHCX pre-authorisation, with the insurance plan and its authorisation requirements, to this system',
  },
  'nhcx-claim': {
    title: 'NHCX claim',
    example: 'Add the NHCX claim at discharge, and its adjudication, to this system',
  },
  'nhcx-communication': {
    title: 'NHCX communication',
    example: 'Add NHCX queries, notifications and their acknowledgements to this system',
  },
  'nhcx-payment': {
    title: 'NHCX payment',
    example: 'Add NHCX payment notices, sent and acknowledged, to this system',
  },
  'nhcx-reprocess': {
    title: 'NHCX reprocess',
    example: 'Add the NHCX reprocess and shortfall Tasks, asked and answered, to this system',
  },
};

const countFiles = (dir) =>
  readdirSync(dir, {withFileTypes: true}).reduce(
    (n, entry) => n + (entry.isDirectory() ? countFiles(join(dir, entry.name)) : 1),
    0,
  );

// An NHCX skill is counted from its own files, so its install panel shows what
// it holds the way a module skill's does. A skill holds one spec file per call
// it builds, under apis/, and one per callback it hosts, under callbacks/;
// its end-to-end tests are the rows of the table in steps/L8-e2e-tests.md.
// The skills carry no error table of their own: codes come from the knowledge
// source (the nhcx-docs MCP server's decode_error, or the NHCX package), so
// the panel promises no Debug row for them.
const specFiles = (dir) =>
  existsSync(dir) ? readdirSync(dir).filter((f) => /^[A-Z]\d+-.+\.md$/.test(f)).length : 0;
function useCaseCounts(dir) {
  const e2e = join(dir, 'steps', 'L8-e2e-tests.md');
  const tests = existsSync(e2e)
    ? (readFileSync(e2e, 'utf8').match(/^\| X\d+ \|/gm) ?? []).length
    : 0;
  return {
    operations: specFiles(join(dir, 'apis')) + specFiles(join(dir, 'callbacks')),
    codes: 0,
    tests,
  };
}

/** The install panel's rows for an NHCX skill, and the file behind each. */
export const NHCX_SECTION_FILES = {
  scaffold: 'references/SCAFFOLDING.md',
  integrate: 'apis/INDEX.md',
  test: 'steps/L8-e2e-tests.md',
};

/** One NHCX skill's manifest row, counted from its folder at src. */
export function nhcxEntry(name, src) {
  return {
    gateway: 'nhcx',
    module: 'NHCX',
    title: NHCX[name].title,
    docs: '/docs/nhcx/v1/getting-started/build-with-ai',
    example: NHCX[name].example,
    errorExample: null,
    ...useCaseCounts(src),
    // A row on the install panel, and the file in the folder that backs it.
    // These used to be bare labels, which read as references/integrate.md and
    // the like: names an ABDM skill has and an NHCX skill never did.
    sections: Object.keys(NHCX_SECTION_FILES).filter((section) =>
      existsSync(join(src, NHCX_SECTION_FILES[section])),
    ),
    sectionFiles: NHCX_SECTION_FILES,
    folder: true,
    files: countFiles(src),
  };
}
