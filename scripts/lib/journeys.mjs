import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'yaml';
import {listSpecTree} from '../specs.mjs';

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

/** File stem for one journey step's generated data: <opslug>--<journeyId>-<nn>. */
export const stepDataName = (op, journeyId, index) =>
  `${op.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}--${journeyId}-${String(index + 1).padStart(2, '0')}`;

/** operationId -> {module, method, path, op, kind} across every hiecm/v3 spec. */
export function operationIndex() {
  const index = new Map();
  for (const {platform, version, files} of listSpecTree()) {
    if (platform !== 'hiecm' || version !== 'v3') continue;
    for (const file of files) {
      const spec = parse(readFileSync(file.path, 'utf8'));
      const module = spec.info?.['x-portal']?.module;
      for (const [kind, block] of [['operation', spec.paths ?? {}], ['callback', spec.webhooks ?? {}]]) {
        for (const [path, item] of Object.entries(block)) for (const method of METHODS) {
          if (item?.[method]?.operationId) index.set(item[method].operationId, {module, method, path, op: item[method], kind});
        }
      }
    }
  }
  return index;
}

/** moduleId -> journeys, from catalogue/openapi/hiecm/v3/journeys/<module>.yaml. */
export function loadJourneys(dir) {
  dir ??= join(new URL('../../catalogue/openapi/hiecm/v3/journeys/', import.meta.url).pathname);
  const out = new Map();
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir).sort()) {
    if (!name.endsWith('.yaml')) continue;
    out.set(name.replace(/\.yaml$/, ''), parse(readFileSync(join(dir, name), 'utf8')) ?? []);
  }
  return out;
}

/** Every problem in the journey files, as strings. Empty means valid. */
export function validateJourneys(journeys = loadJourneys(), index = operationIndex()) {
  const problems = [];
  const ids = new Set();
  for (const [module, list] of journeys) {
    for (const j of list) {
      if (!j.id || !j.title || !Array.isArray(j.steps) || !j.steps.length) { problems.push(`${module}: journey without id, title or steps`); continue; }
      if (ids.has(j.id)) problems.push(`${module}: duplicate journey id ${j.id}`); ids.add(j.id);
      j.steps.forEach((s, i) => {
        const entry = index.get(s.op);
        if (!entry) { problems.push(`${module}/${j.id} step ${i + 1}: unknown operation ${s.op}`); return; }
        if (s.example) {
          const examples = entry.op.requestBody?.content?.['application/json']?.examples ?? {};
          if (!examples[s.example]) problems.push(`${module}/${j.id} step ${i + 1}: ${s.op} has no request example named "${s.example}"; it has ${Object.keys(examples).map((k) => `"${k}"`).join(', ') || 'none'}`);
        }
      });
    }
  }
  return problems;
}
