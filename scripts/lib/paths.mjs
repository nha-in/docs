// Every catalogue path the scripts use, in one place. HIE-CM and UHI own a
// folder each, catalogue/<gateway>/, holding their content map, specs with
// corrections and upstream sets, and one folder per atom type. NHCX's specs,
// corrections and sets are still under catalogue/openapi/ until NHCX is
// restructured, so the spec and source helpers read both.
import {existsSync, readdirSync} from 'node:fs';
import {join, relative} from 'node:path';

export const GATEWAYS = ['hiecm', 'nhcx', 'uhi', 'shared'];

// Folder name per atom type.
export const FOLDER = {
  concept: 'concepts', flow: 'flows', endpoint: 'endpoints',
  callback: 'callbacks', error: 'errors', test: 'tests',
  decision: 'decisions', glossary: 'glossary', fhir: 'fhir', sandbox: 'sandbox',
  troubleshooting: 'troubleshooting',
};

// The only names allowed at catalogue/ and at catalogue/<gateway>/.
// openapi/ and titles.yaml stay at the top for NHCX.
export const TOP_LEVEL = ['README.md', 'VERSION', ...GATEWAYS, 'openapi', 'titles.yaml', 'annexure', 'changelog', 'registry.json', 'atom-routes.json'];
export const GATEWAY_LEVEL = ['README.md', 'map', 'openapi', 'titles.yaml', 'postman.json', 'vocabulary.yaml', 'atom-questions.json', ...Object.values(FOLDER)];

export const atomPath = (id, type, gateway) =>
  `catalogue/${gateway}/${FOLDER[type]}/${id.split('.').slice(2).join('.')}.md`;

const dirs = (d) => (existsSync(d) ? readdirSync(d, {withFileTypes: true}).filter((e) => e.isDirectory()).map((e) => e.name) : []);

/** Where each gateway's specs live: <dir>/<version>/<file>.yaml. */
export function specRoots(root) {
  const cat = join(root, 'catalogue');
  return GATEWAYS.flatMap((gateway) => {
    for (const dir of [join(cat, gateway, 'openapi'), join(cat, 'openapi', gateway)]) {
      if (dirs(dir).some((v) => !v.startsWith('.'))) return [{gateway, dir}];
    }
    return [];
  });
}

export function rawDirs(root) {
  const cat = join(root, 'catalogue');
  return [join(cat, 'openapi', '.raw'), ...GATEWAYS.map((g) => join(cat, g, 'openapi', '.raw'))].filter(existsSync);
}

export function mapFiles(root) {
  const cat = join(root, 'catalogue');
  return GATEWAYS.flatMap((g) => {
    const d = join(cat, g, 'map');
    return existsSync(d) ? readdirSync(d).filter((f) => f.endsWith('.yaml')).map((f) => join(d, f)) : [];
  }).sort((a, b) => relative(root, a).localeCompare(relative(root, b)));
}

/** Every name at catalogue/ or catalogue/<gateway>/ that the tree does not allow. */
export function layoutProblems(root) {
  const cat = join(root, 'catalogue');
  const stray = (dir, allowed) => readdirSync(dir).filter((n) => !n.startsWith('.') && !allowed.includes(n));
  const out = stray(cat, TOP_LEVEL).map((n) => `catalogue/${n}`);
  for (const g of GATEWAYS) {
    if (existsSync(join(cat, g))) out.push(...stray(join(cat, g), GATEWAY_LEVEL).map((n) => `catalogue/${g}/${n}`));
  }
  return out.map((p) => `${p} is not part of the catalogue tree (catalogue/README.md)`);
}
