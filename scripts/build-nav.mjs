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

// ---- llms.txt ----
//
// An index of the site for an agent that browses it, to the spec at
// https://llmstxt.org. Mintlify's benchmark over 2,400 agent runs found a
// linked llms.txt cut dead-URL fetches from 2.23 per task to 0.11, so this is
// mostly about an agent finding the right page rather than guessing a URL.
//
// The link list is generated from the same tree the sidebar is, so a page that
// exists is listed and a page that does not cannot be.
{
  const siteUrl = (process.env.DOCUSAURUS_URL ?? 'https://abdm-docs.example.com').replace(/\/+$/, '');
  const base = (process.env.DOCUSAURUS_BASE_URL ?? '/').replace(/\/+$/, '');

  const pages = [];
  const walk = (dir, route) => {
    for (const entry of readdirSync(dir, {withFileTypes: true})) {
      if (entry.name.startsWith('_') || entry.name.startsWith('.')) continue;
      const path = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(path, `${route}/${entry.name}`);
        continue;
      }
      if (!/\.mdx?$/.test(entry.name) || entry.name === 'README.md') continue;
      const raw = readFileSync(path, 'utf8');
      const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      const field = (name) =>
        fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^['"]|['"]$/g, '');
      const slug = entry.name.replace(/\.mdx?$/, '');
      pages.push({
        route: slug === 'index' ? route : `${route}/${slug}`,
        title: field('title') ?? raw.match(/^#\s+(.+)$/m)?.[1] ?? slug,
        description: field('description') ?? '',
        // The top folder under docs is the section an agent scans by.
        section: route.split('/').filter(Boolean).slice(0, 2).join('/') || 'root',
      });
    }
  };
  walk(docsRoot, '/docs');
  pages.sort((a, b) => a.route.localeCompare(b.route));

  const bySection = new Map();
  for (const page of pages) {
    if (!bySection.has(page.section)) bySection.set(page.section, []);
    bySection.get(page.section).push(page);
  }

  const lines = ['# ABDM Developer Portal', ''];
  lines.push(
    '> Documentation for integrating with ABDM, India\'s health data exchange: the HIE-CM gateway milestones M1 to M3, the ABHA, HPR and HFR registries, and UHI. Nothing here has been run against the ABDM sandbox unless a page says so, so treat request and response shapes as unconfirmed.',
  );
  lines.push('');
  for (const [section, list] of [...bySection].sort()) {
    lines.push(`## ${section}`);
    lines.push('');
    for (const page of list) {
      lines.push(
        `- [${page.title}](${siteUrl}${base}${page.route})${page.description ? `: ${page.description}` : ''}`,
      );
    }
    lines.push('');
  }
  lines.push('## Optional');
  lines.push('');
  lines.push(
    `- [Agent skills](${siteUrl}${base}/skills): one markdown file per module, carrying its endpoints, error codes and test cases.`,
  );
  lines.push('');

  writeFileSync(join(root, 'site', 'static', 'llms.txt'), lines.join('\n'));
  console.log(`Built llms.txt from ${pages.length} page(s).`);
}

console.log(
  `Built navigation for ${platforms.length} platform(s): ${platforms
    .map((p) => `${p.id} (${p.versions.map((v) => v.label).join(', ')})`)
    .join('; ')}.`,
);
