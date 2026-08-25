// Where the OpenAPI files live inside the catalogue.
//
// They used to sit directly in catalogue/openapi and now sit under a gateway
// and version below it (catalogue/openapi/hiecm/v3). Every script that reads a
// spec goes through here, so the next time they move only this file changes.
import {readdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
export const specsRoot = join(root, 'catalogue', 'openapi');

/** Every spec under catalogue/openapi, at any depth, as {name, path}. */
export function listSpecs(dir = specsRoot) {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // .raw holds the untouched downloads, not specs the site serves.
      return entry.name.startsWith('.') ? [] : listSpecs(full);
    }
    return /\.(yaml|json)$/.test(entry.name) ? [{name: entry.name, path: full}] : [];
  });
}

/** The path of one spec by file name, or undefined when it is not there. */
export function findSpec(name) {
  return listSpecs().find((spec) => spec.name === name)?.path;
}

/**
 * The spec tree as structure: every catalogue/openapi/<platform>/<version>
 * folder that holds specs, with its files. Dropping a YAML into a new folder
 * is what creates a platform or version; nothing else has to be told.
 */
export function listSpecTree() {
  const pairs = new Map();
  for (const spec of listSpecs()) {
    const rel = spec.path.slice(specsRoot.length + 1).split('/');
    if (rel.length !== 3) continue; // corrections and loose files carry no structure
    const [platform, version] = rel;
    const key = `${platform}/${version}`;
    if (!pairs.has(key)) pairs.set(key, {platform, version, files: []});
    pairs.get(key).files.push(spec);
  }
  return [...pairs.values()];
}
