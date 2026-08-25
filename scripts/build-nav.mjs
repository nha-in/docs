// Builds the navigation model from the docs tree: one platform per folder
// under site/docs, one version per folder under it. A contributor creates a
// gateway or a version by creating the folder; _platform.json alongside the
// version folders carries the display label, the description and any
// unpublished versions worth noting in the picker.
//
// site/src/data/platforms.json and reference-links.json are build outputs.
import {existsSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const docsRoot = join(root, 'site', 'docs');
const dataDir = join(root, 'site', 'src', 'data');

// Tabs, partials (_glossary) and hidden folders are not platforms.
const NOT_PLATFORMS = new Set(['whats-new', 'support']);

const platforms = [];
for (const entry of readdirSync(docsRoot, {withFileTypes: true})) {
  if (!entry.isDirectory() || entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
  if (NOT_PLATFORMS.has(entry.name)) continue;
  const dir = join(docsRoot, entry.name);
  const versionDirs = readdirSync(dir, {withFileTypes: true})
    .filter((v) => v.isDirectory() && !v.name.startsWith('_') && !v.name.startsWith('.'))
    .map((v) => v.name)
    // Newest first, the way a picker reads.
    .sort((a, b) => b.localeCompare(a, undefined, {numeric: true}));
  if (versionDirs.length === 0) continue;

  const metaPath = join(dir, '_platform.json');
  const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, 'utf8')) : {};
  const current = versionDirs[0];

  const versions = versionDirs.map((v) => ({
    label: v.toUpperCase(),
    to: `/docs/${entry.name}/${v}`,
  }));
  for (const [label, extra] of Object.entries(meta.versions ?? {})) {
    versions.push({label: label.toUpperCase(), ...extra});
  }
  versions.sort((a, b) => b.label.localeCompare(a.label, undefined, {numeric: true}));

  platforms.push({
    id: entry.name,
    label: meta.label ?? entry.name.toUpperCase(),
    description: meta.description ?? '',
    position: meta.position ?? 999,
    version: current.toUpperCase(),
    versions,
    apiTo: `/docs/${entry.name}/${current}/api`,
    to: `/docs/${entry.name}/${current}`,
    match: `/docs/${entry.name}`,
  });
}
platforms.sort((a, b) => a.position - b.position || a.id.localeCompare(b.id));

writeFileSync(
  join(dataDir, 'platforms.json'),
  `${JSON.stringify(platforms, null, 2)}\n`,
);

// One interactive Scalar reference per specification, from the sidebar the
// API reference build just wrote.
const apiSidebar = JSON.parse(readFileSync(join(dataDir, 'api-sidebar.json'), 'utf8'));
const referenceLinks = apiSidebar.map((module) => ({
  label: module.label,
  to: module.route,
}));
writeFileSync(
  join(dataDir, 'reference-links.json'),
  `${JSON.stringify(referenceLinks, null, 2)}\n`,
);

console.log(
  `Built navigation for ${platforms.length} platform(s): ${platforms
    .map((p) => `${p.id} (${p.versions.map((v) => v.label).join(', ')})`)
    .join('; ')}.`,
);
