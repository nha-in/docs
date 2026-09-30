// Where the OpenAPI files live inside the catalogue.
//
// HIE-CM and UHI keep theirs in their own folder, catalogue/<gateway>/openapi/
// <version>/; NHCX's are still under catalogue/openapi/nhcx/v1 until NHCX is
// restructured. lib/paths.mjs decides which, and every script that reads a
// spec goes through here, so the next move changes only those two files.
import {readdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {specRoots} from './lib/paths.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

/** The folder holding a gateway's <version>/ spec folders, or undefined. */
export const specDir = (platform) => specRoots(root).find((r) => r.gateway === platform)?.dir;

function walk(dir) {
  return readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      // .raw holds the untouched downloads, journeys/ holds step lists read
      // through lib/journeys.mjs, errors/ holds NHA's per-module error code
      // lists read through lib/spec-errors.mjs, and corrections/ and nrces/
      // hold notes. None is an OpenAPI document.
      return entry.name.startsWith('.') || ['journeys', 'errors', 'corrections', 'nrces'].includes(entry.name) ? [] : walk(full);
    }
    return /\.(yaml|json)$/.test(entry.name) ? [{name: entry.name, path: full}] : [];
  });
}

/** Every spec of every gateway, as {name, path}, or every spec under `dir`. */
export function listSpecs(dir) {
  return dir ? walk(dir) : specRoots(root).flatMap((r) => walk(r.dir));
}

/** The path of one spec by file name, or undefined when it is not there. */
export function findSpec(name) {
  return listSpecs().find((spec) => spec.name === name)?.path;
}

/**
 * The spec tree as structure: every <gateway>/<version> folder that holds
 * specs, with its files. Dropping a YAML into a new version folder is what
 * creates a version; nothing else has to be told.
 */
export function listSpecTree() {
  const pairs = new Map();
  for (const {gateway: platform, dir} of specRoots(root)) {
    for (const spec of walk(dir)) {
      const rel = spec.path.slice(dir.length + 1).split('/');
      if (rel.length !== 2) continue; // loose files carry no structure
      const [version] = rel;
      const key = `${platform}/${version}`;
      if (!pairs.has(key)) pairs.set(key, {platform, version, files: []});
      pairs.get(key).files.push(spec);
    }
  }
  return [...pairs.values()];
}

/**
 * What the generated reference offers for one gateway version: journey order,
 * links into a troubleshooting section, the HIE-CM index wording, and the
 * concept atom an errors page relates to. A version not listed gets none.
 */
const FEATURES = {
  'hiecm/v3': {journeys: true, troubleshooting: true, hiecmCopy: true, errorConcept: 'hiecm.concept.error-codes'},
  'nhcx/v1': {journeys: false, troubleshooting: false, hiecmCopy: false, errorConcept: 'nhcx.concept.error-code-spaces'},
  'uhi/v1': {journeys: true, troubleshooting: false, hiecmCopy: false, errorConcept: null},
};
export function platformFeatures(platform, version) {
  return {...(FEATURES[`${platform}/${version}`] ?? {journeys: false, troubleshooting: false, hiecmCopy: false, errorConcept: null})};
}
