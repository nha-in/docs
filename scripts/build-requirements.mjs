// Marks each operation with the certification requirement NHA's own test
// sheets put on it, and writes it into the specification as
// `x-abdm-requirement`.
//
// Why this is derived rather than written. "Is this call mandatory" is a
// certification question, and NHA answers it in the test sheets under
// catalogue/openapi/.raw, one marking per case, with a column naming the calls
// each case exercises. Hand marking 299 operations would be this portal
// deciding what NHA requires, which is the one thing an API reference must
// never do. So the marking is joined from the sheets, and an operation no
// sheet names carries no marking at all.
//
// The join is in scripts/lib/api-join.mjs, shared with build-api-reference
// .mjs so the certification level and the matrix's own endpoint links are
// matched the same way. Every call that fails to join is an M4 one on the HPR
// or HFR hosts, which have no specification here because M4 is phase 2.
//
// One operation, several cases. An endpoint is usually named by more than one
// case, and the cases can disagree: `enrolment/enrol/byAadhaar` is mandatory
// in the Aadhaar OTP journey and optional in the driving licence one. The
// level is the strongest marking any case gives it, because a call you must
// make to pass one mandatory case is a call you must implement. Every case id
// is recorded beside the level, so a reader can check the claim rather than
// trust it.
//
//   node scripts/build-requirements.mjs           write into the specs
//   node scripts/build-requirements.mjs --check   fail if a spec is out of date
import {readFileSync, writeFileSync} from 'node:fs';
import {join, dirname, basename} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {listSpecs} from './specs.mjs';
import {joinKey, hostOf} from './lib/api-join.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const matrixDir = join(root, 'site', 'src', 'data', 'test-matrix');
const MODULES = ['m1', 'm2', 'm3', 'm4'];

// Strongest first: a call named by one mandatory case is mandatory, whatever
// else names it. `Unmarked` and `Portal check` never set a level, because
// neither is NHA saying anything about the call.
const RANK = {Mandatory: 3, Conditional: 2, Optional: 1};

function readMatrices() {
  // joinKey -> {level, cases:Set, conditions:Set}
  const wanted = new Map();
  for (const module of MODULES) {
    const file = join(matrixDir, `${module}.json`);
    const data = JSON.parse(readFileSync(file, 'utf8'));
    for (const group of data.groups) {
      for (const row of group.rows) {
        const rank = RANK[row.type];
        if (!rank) continue;
        for (const url of row.apis ?? []) {
          const key = `${hostOf(url)}|${joinKey(url)}`;
          const seen = wanted.get(key) ?? {rank: 0, cases: new Set(), conditions: new Set()};
          if (rank > seen.rank) seen.rank = rank;
          seen.cases.add(row.id);
          if (row.condition) seen.conditions.add(row.condition);
          wanted.set(key, seen);
        }
      }
    }
  }
  return wanted;
}

const LEVEL = {3: 'mandatory', 2: 'conditional', 1: 'optional'};

/**
 * The requirement block for each operationId a sheet names.
 *
 * Matching is on the identifying segments, then narrowed by host where the
 * key alone is ambiguous: `phr/app/enrollment/encrypt` is an operation in both
 * the M1 and the P1 specification, and only the sheet's host tells them apart.
 */
function requirements(specs, wanted) {
  const found = new Map();
  const unmatched = new Set(wanted.keys());
  for (const spec of specs) {
    const document = parse(readFileSync(spec.path, 'utf8'));
    const hosts = new Set((document.servers ?? []).map((server) => hostOf(server.url)));
    for (const section of ['paths', 'webhooks']) {
      for (const [path, item] of Object.entries(document[section] ?? {})) {
        for (const [method, operation] of Object.entries(item ?? {})) {
          if (!/^(get|put|post|delete|patch)$/.test(method)) continue;
          const key = joinKey(path);
          for (const [candidate, entry] of wanted) {
            const [host, wantedKey] = candidate.split('|');
            if (wantedKey !== key) continue;
            // A host the specification does not serve is a different module's
            // operation wearing the same path.
            if (hosts.size && !hosts.has(host)) continue;
            unmatched.delete(candidate);
            const already = found.get(operation.operationId);
            const merged = already ?? {rank: 0, cases: new Set(), conditions: new Set()};
            merged.rank = Math.max(merged.rank, entry.rank);
            for (const id of entry.cases) merged.cases.add(id);
            for (const text of entry.conditions) merged.conditions.add(text);
            found.set(operation.operationId, merged);
          }
        }
      }
    }
  }
  return {found, unmatched};
}

/** The YAML block to sit under an operationId, at that line's indentation. */
function block(indent, entry) {
  const cases = [...entry.cases].sort();
  const lines = [
    `${indent}x-abdm-requirement:`,
    `${indent}  level: ${LEVEL[entry.rank]}`,
    `${indent}  cases: [${cases.join(', ')}]`,
  ];
  if (entry.conditions.size) {
    // NHA's own wording, kept because "conditional" on its own tells a reader
    // nothing about which condition they are under.
    lines.push(`${indent}  conditions:`);
    for (const text of [...entry.conditions].sort()) {
      lines.push(`${indent}    - ${JSON.stringify(text)}`);
    }
  }
  return lines;
}

/**
 * Rewrite one specification, in place, line by line.
 *
 * Not a YAML round trip. These files carry comments and anchors that a parse
 * and re-emit would silently drop, and the diff of a re-emitted 4000 line
 * specification is unreadable, which is how a real change hides. The block is
 * inserted under the operationId line instead, where `x-abdm-atom` already
 * sits, and any previous block is removed first so the script is idempotent.
 */
function rewrite(text, found) {
  const lines = text.split('\n');
  const out = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const existing = /^(\s*)x-abdm-requirement:\s*$/.exec(line);
    if (existing) {
      // Skip the whole block: every following line indented deeper than it.
      const depth = existing[1].length;
      index += 1;
      while (index < lines.length) {
        const next = lines[index];
        if (next.trim() === '') break;
        const at = next.length - next.trimStart().length;
        if (at <= depth) break;
        index += 1;
      }
      index -= 1;
      continue;
    }
    out.push(line);
    const declared = /^(\s*)operationId:\s*(\S+)\s*$/.exec(line);
    if (!declared) continue;
    const entry = found.get(declared[2]);
    if (entry) out.push(...block(declared[1], entry));
  }
  return out.join('\n');
}

function main() {
  const check = process.argv.includes('--check');
  const specs = listSpecs().filter((spec) => spec.path.includes('/openapi/hiecm/'));
  const wanted = readMatrices();
  const {found, unmatched} = requirements(specs, wanted);

  let failed = false;
  let written = 0;
  for (const spec of specs) {
    const before = readFileSync(spec.path, 'utf8');
    const after = rewrite(before, found);
    const name = basename(spec.path);
    const marked = [...found.keys()].filter((id) =>
      new RegExp(`^\\s*operationId: ${id}\\s*$`, 'm').test(after),
    ).length;
    if (before === after) {
      console.log(`  ${name}: current, ${marked} operation(s) marked`);
      continue;
    }
    if (check) {
      console.log(`  ${name}: OUT OF DATE`);
      failed = true;
    } else {
      writeFileSync(spec.path, after);
      written += 1;
      console.log(`  ${name}: rewritten, ${marked} operation(s) marked`);
    }
  }

  const levels = {};
  for (const entry of found.values()) {
    levels[LEVEL[entry.rank]] = (levels[LEVEL[entry.rank]] ?? 0) + 1;
  }
  console.log(
    `  ${found.size} operation(s) named by NHA's certification sheets ` +
      `(${Object.entries(levels).map(([k, v]) => `${v} ${k}`).join(', ')})`,
  );
  if (unmatched.size) {
    console.log(`  ${unmatched.size} call(s) named by a sheet with no operation here:`);
    for (const key of [...unmatched].sort()) console.log(`    ${key.replace('|', ' ')}`);
  }
  if (failed) {
    console.log('Run: node scripts/build-requirements.mjs');
    process.exit(1);
  }
  if (!check && written === 0) console.log('  nothing to write');
}

main();
