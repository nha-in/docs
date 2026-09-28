// scripts/lib/map.mjs
// The atom registry is catalogue/map.yaml plus every catalogue/map.d/*.yaml,
// so a batch of atoms can land in a file of its own without every batch
// editing, and conflicting in, the one file. An id may be defined only once.
import {readFileSync, readdirSync, existsSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'yaml';

export function loadMap(root) {
  const dir = join(root, 'catalogue', 'map.d');
  const files = ['catalogue/map.yaml', ...(existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.yaml')).sort().map((f) => `catalogue/map.d/${f}`) : [])];
  const map = {};
  const from = {};
  const problems = [];
  for (const f of files) {
    if (!existsSync(join(root, f))) continue;
    for (const [id, e] of Object.entries(parse(readFileSync(join(root, f), 'utf8')) ?? {})) {
      if (from[id]) { problems.push(`${id} is defined in both ${from[id]} and ${f}. Keep one entry`); continue; }
      map[id] = e;
      from[id] = f;
    }
  }
  return {map, problems};
}
