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
import {moduleLabel} from './emit-page-markdown.mjs';

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
  if (!process.env.DOCUSAURUS_URL && process.env.CI) {
    console.error('build-nav: DOCUSAURUS_URL is required in CI so llms.txt never ships placeholder URLs.');
    process.exit(1);
  }
  if (!process.env.DOCUSAURUS_URL) {
    console.warn('build-nav: DOCUSAURUS_URL unset, llms.txt will use https://docs.abdm.gov.in.');
  }
  const siteUrl = (process.env.DOCUSAURUS_URL ?? 'https://docs.abdm.gov.in').replace(/\/+$/, '');
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
      // One endpoint per line for 299 endpoints made this index 86 KB, most
      // of it a flat list of calls. Each module already publishes its own
      // llms.txt naming its endpoints, and those are linked under Optional
      // below, so the root stays a directory an agent can read in one go and
      // the call level detail is one hop away in a file sized for the module
      // being worked on.
      if (/\/api\/[^/]+\/endpoints$/.test(route)) continue;
      const raw = readFileSync(path, 'utf8');
      const fm = raw.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
      const field = (name) =>
        fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1].trim().replace(/^['"]|['"]$/g, '');
      const slug = entry.name.replace(/\.mdx?$/, '');
      pages.push({
        // A page that sets its own slug is served there, so list it there.
        route: field('slug') ? `/docs${field('slug')}` : slug === 'index' ? route : `${route}/${slug}`,
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
    '> Documentation for integrating with ABDM, India\'s health data exchange: the HIE-CM gateway milestones M1 to M3, the ABHA, HPR and HFR registries, UHI, and the NHCX claims exchange between hospitals and insurers. Nothing here has been run against the ABDM sandbox unless a page says so, so treat request and response shapes as unconfirmed.',
  );
  lines.push('');
  // The links below are the pages themselves, because this index is written
  // before the build and cannot know which routes the build produced. Every
  // one of them also answers as markdown, which is worth saying once here
  // rather than leaving an agent to fetch a page of HTML shell per link.
  lines.push(
    'Add `.md` to any link below to get that page as markdown. Individual API operations are not listed here: each module has its own `llms.txt` naming every call it carries, linked under Optional. `llms-full.txt` beside this file carries every page in one document.',
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
  // One llms.txt per API module of every gateway (HIE-CM m1, m2, ...,
  // gateway, p1, ...; NHCX claim, preauth, ...), so an agent does not have to
  // guess a module's llms.txt URL. Written by scripts/emit-page-markdown.mjs
  // as a postbuild step; listed here from the same docs tree so a module
  // without a build directory is not listed. HIE-CM is listed first.
  const visible = (e) => e.isDirectory() && !e.name.startsWith('_') && !e.name.startsWith('.');
  const apiRoots = [];
  for (const platform of readdirSync(docsRoot, {withFileTypes: true}).filter(visible)) {
    for (const version of readdirSync(join(docsRoot, platform.name), {withFileTypes: true}).filter(visible)) {
      const dir = join(docsRoot, platform.name, version.name, 'api');
      if (existsSync(dir)) apiRoots.push({platform: platform.name, version: version.name, dir});
    }
  }
  const hiecmFirst = (p) => (p === 'hiecm' ? 0 : 1);
  apiRoots.sort(
    (a, b) =>
      hiecmFirst(a.platform) - hiecmFirst(b.platform) ||
      a.platform.localeCompare(b.platform) ||
      a.version.localeCompare(b.version),
  );
  for (const {platform, version, dir} of apiRoots) {
    const moduleIds = readdirSync(dir, {withFileTypes: true})
      .filter(visible)
      .map((e) => e.name)
      .sort();
    for (const moduleId of moduleIds) {
      const label = moduleLabel({platform, version, moduleId}, apiSidebar);
      lines.push(
        `- [${label} module index](${siteUrl}${base}/docs/${platform}/${version}/api/${moduleId}/llms.txt): per-page links for the ${label} module.`,
      );
    }
  }
  lines.push('');

  writeFileSync(join(root, 'site', 'static', 'llms.txt'), lines.join('\n'));
  console.log(`Built llms.txt from ${pages.length} page(s).`);

  // /robots.txt was a 404 while /sitemap.xml answered, so a crawler had to
  // guess the sitemap was there. Written here rather than dropped in static/
  // because Sitemap: takes an absolute URL, and only this file knows the one
  // this deployment is being built for. The two agent indexes are named for
  // the same reason: a crawler that reads robots.txt is exactly the visitor
  // that should be told they exist.
  writeFileSync(
    join(root, 'site', 'static', 'robots.txt'),
    [
      'User-agent: *',
      'Allow: /',
      '',
      `Sitemap: ${siteUrl}${base}/sitemap.xml`,
      '',
      '# Documentation for language models:',
      `#   ${siteUrl}${base}/llms.txt        an index of the site`,
      `#   ${siteUrl}${base}/llms-full.txt   every page in one document`,
      '# Adding .md to any documentation URL returns that page as markdown.',
      '',
    ].join('\n'),
  );
  console.log('Built robots.txt.');
}

console.log(
  `Built navigation for ${platforms.length} platform(s): ${platforms
    .map((p) => `${p.id} (${p.versions.map((v) => v.label).join(', ')})`)
    .join('; ')}.`,
);
