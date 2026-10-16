// scripts/lib/map.mjs
// The atom registry is every gateway's content map, catalogue/<gateway>/map/
// *.yaml, one file per batch so a batch of atoms lands in a file of its own
// without every batch editing, and conflicting in, one file. An id may be
// defined only once.
import {readFileSync} from 'node:fs';
import {relative} from 'node:path';
import {parse} from 'yaml';
import {mapFiles} from './paths.mjs';

export function loadMap(root) {
  const map = {};
  const from = {};
  const problems = [];
  for (const file of mapFiles(root)) {
    const f = relative(root, file);
    for (const [id, e] of Object.entries(parse(readFileSync(file, 'utf8')) ?? {})) {
      if (from[id]) { problems.push(`${id} is defined in both ${from[id]} and ${f}. Keep one entry`); continue; }
      map[id] = e;
      from[id] = f;
    }
  }
  return {map, problems};
}
