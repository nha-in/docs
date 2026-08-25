// Checks that the specifications are usable by a retrieval index and by an MCP
// tool generator, not only by a human reading the rendered page.
//
// The rules come from how those two consumers actually work. A tool generator
// derives a tool name from operationId and decides which tool to call by
// reading summary and description. A retrieval index chunks per operation, so
// a chunk with no prose retrieves against nothing.
import {readFileSync} from 'node:fs';
import {join, dirname, relative} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {listSpecs} from './specs.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const METHODS = ['get', 'put', 'post', 'delete', 'patch', 'options', 'head'];
// MCP tool names must match this, and are commonly derived from operationId.
const TOOL_NAME = /^[a-zA-Z0-9_-]{1,64}$/;

const problems = [];
const warnings = [];
const seenIds = new Map();
let ops = 0;
let specs = 0;

for (const entry of listSpecs()) {
  const spec = parse(readFileSync(entry.path, 'utf8'));
  const where = relative(root, entry.path);
  specs += 1;

  // Document level facets. A per-operation chunk loses them, so the indexer
  // copies them in; they have to exist to be copied.
  for (const key of ['x-abdm-gateway', 'x-abdm-module']) {
    if (spec.info?.[key] === undefined) problems.push(`${where}: info is missing ${key}`);
  }
  if (!Array.isArray(spec['x-abdm-sources']) || spec['x-abdm-sources'].length === 0) {
    problems.push(`${where}: no x-abdm-sources, so a retrieved chunk cannot say where it came from`);
  }

  const walk = (container, kind) => {
    for (const [path, item] of Object.entries(container ?? {})) {
      for (const [method, op] of Object.entries(item ?? {})) {
        if (!METHODS.includes(method)) continue;
        ops += 1;
        const at = `${where}: ${method.toUpperCase()} ${path}`;

        const id = op.operationId;
        if (!id) problems.push(`${at}: no operationId, so no tool can be generated`);
        else {
          if (!TOOL_NAME.test(id)) problems.push(`${at}: operationId "${id}" is not a legal MCP tool name`);
          const prior = seenIds.get(id);
          if (prior) problems.push(`${at}: operationId "${id}" is already used by ${prior}`);
          else seenIds.set(id, at);
        }

        if (!op.summary) problems.push(`${at}: no summary, which is what a tool generator shows the model`);
        if (!op.description) problems.push(`${at}: no description, so this chunk retrieves against its path alone`);
        else if (op.description.trim().length < 40) {
          warnings.push(`${at}: description is under 40 characters`);
        }
        if (!op.tags?.length) warnings.push(`${at}: no tag, so it has no within-module facet`);
        if (kind === 'path' && !op['x-abdm-atom']) {
          warnings.push(`${at}: no x-abdm-atom, so the chunk cannot join to its atom`);
        }
        if (!op.responses || Object.keys(op.responses).length === 0) {
          problems.push(`${at}: no responses at all`);
        }
      }
    }
  };
  walk(spec.paths, 'path');
  walk(spec.webhooks, 'webhook');
}

console.log(`${ops} operations across ${specs} specification(s)`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings.slice(0, 15)) console.log('  ' + w);
  if (warnings.length > 15) console.log(`  ... and ${warnings.length - 15} more`);
}
if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 25)) console.error('  ' + p);
  if (problems.length > 25) console.error(`  ... and ${problems.length - 25} more`);
  process.exit(1);
}
console.log('\nEvery operation is addressable by a tool generator and carries prose to retrieve against.');
