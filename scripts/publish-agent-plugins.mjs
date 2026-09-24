// Writes the public plugin marketplace, nha-in/agent-plugins, from this
// repository. This repository is private; the plugins it builds are not, and
// the public repository is the one integrators add as a marketplace.
//
//   node scripts/publish-agent-plugins.mjs <path to an agent-plugins checkout>
//
// publish/agent-plugins.json names the repository, the marketplace and which
// plugins are public. Each public plugin folder is copied whole, with the same
// plugins/<name>/ layout it has here, so a path such as
// plugins/nhcx/skills/nhcx-full reads the same in both repositories. Both
// marketplace files are written: .claude-plugin/marketplace.json for Claude
// Code, and .agents/plugins/marketplace.json for Codex, which takes only local
// folders, which is why the folders are published rather than archives.
//
// The site is geofenced to India, so nothing published here may send a
// coding agent to it. The build writes a markdown copy of every page beside
// its HTML; those are published under docs/, and every link a published file
// makes to a site page is rewritten to that copy on GitHub. The note each
// skill opens with, to re-download it from the portal's /skills/ path, is
// pointed at the skill's own folder here instead. The MCP server is the one
// thing left on the site, and every skill already falls back without it.
//
// Run npm run build first: the plugin folders are build outputs. The target is
// made to match exactly; a plugin dropped from the list is removed there too.
// Nothing is committed or pushed; that stays a person's decision.
import {readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync} from 'node:fs';
import {join, dirname, resolve, relative} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = process.argv[2] ? resolve(process.argv[2]) : null;
if (!out) {
  console.error('usage: node scripts/publish-agent-plugins.mjs <path to an agent-plugins checkout>');
  process.exit(1);
}
if (!existsSync(join(out, '.git'))) {
  console.error(`${out} is not a git checkout; clone nha-in/agent-plugins there first`);
  process.exit(1);
}

const read = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const pub = read('publish/agent-plugins.json');
const claude = read('.claude-plugin/marketplace.json');
const codex = read('.agents/plugins/marketplace.json');
const write = (path, body) => {
  mkdirSync(dirname(join(out, path)), {recursive: true});
  writeFileSync(join(out, path), typeof body === 'string' ? body : `${JSON.stringify(body, null, 2)}\n`);
};

// The plugins, whole. Anything under plugins/ that is not on the list goes.
mkdirSync(join(out, 'plugins'), {recursive: true});
for (const name of readdirSync(join(out, 'plugins'))) {
  if (!pub.plugins.includes(name)) rmSync(join(out, 'plugins', name), {recursive: true, force: true});
}
for (const name of pub.plugins) {
  const from = join(root, 'plugins', name);
  if (!existsSync(join(from, '.claude-plugin', 'plugin.json'))) throw new Error(`plugins/${name} has no .claude-plugin/plugin.json`);
  rmSync(join(out, 'plugins', name), {recursive: true, force: true});
  cpSync(from, join(out, 'plugins', name), {recursive: true});
}

// The page copies. Every markdown file the build wrote under docs/, whole
// tree, so a page's own links to other pages resolve here too.
const build = join(root, 'site', 'build');
if (!existsSync(join(build, 'docs'))) throw new Error('site/build/docs is missing; run npm run build first');
rmSync(join(out, 'docs'), {recursive: true, force: true});
const pages = new Set();
const copyPages = (dir) => {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) copyPages(full);
    else if (entry.name.endsWith('.md')) {
      const rel = relative(build, full);
      mkdirSync(dirname(join(out, rel)), {recursive: true});
      cpSync(full, join(out, rel));
      pages.add(rel.split('\\').join('/'));
    }
  }
};
copyPages(join(build, 'docs'));

// The OpenAPI files the site's interactive references render.
rmSync(join(out, 'specs'), {recursive: true, force: true});
mkdirSync(join(out, 'specs'), {recursive: true});
const specs = new Set();
for (const name of readdirSync(join(build, 'specs'))) {
  if (!name.endsWith('.yaml')) continue;
  cpSync(join(build, 'specs', name), join(out, 'specs', name));
  specs.add(name);
}

// A site page link, relative or absolute, to the raw markdown copy on GitHub,
// which an agent reads as text. A link with no copy is left as it is and
// counted, so a gap shows up rather than a dead link appearing.
const raw = `https://raw.githubusercontent.com/${pub.repo}/main`;
const tree = `https://github.com/${pub.repo}/tree/main`;
const SITE_PAGE = /(?:https?:\/\/docs\.abdm\.gov\.in|(?<![\w./:-]))(\/docs\/(?:hiecm|nhcx|uhi|abdm|whats-new|support)[A-Za-z0-9_\-./]*)(#[A-Za-z0-9_-]+)?/g;
// An interactive API reference is a page on the site; its OpenAPI file, published under specs/, is what an agent can read.
const SITE_REFERENCE = /(?:https?:\/\/docs\.abdm\.gov\.in|(?<![\w./:-]))\/reference\/([a-z0-9-]+)\/?(?![\w-])/g;
let rewritten = 0;
const unresolved = new Set();
const copyFor = (path) => {
  const bare = path.replace(/\/+$/, '').replace(/^\//, '');
  const stem = bare.replace(/\/index\.md$|\.md$/, '');
  for (const candidate of [bare, `${stem}.md`, `${stem}/index.md`]) if (pages.has(candidate)) return candidate;
  return null;
};
const rewrite = (text, skillFolder) => {
  let next = text.replace(SITE_REFERENCE, (match, id) => {
    if (!specs.has(`${id}.yaml`)) { unresolved.add(`/reference/${id}`); return match; }
    rewritten++;
    return `${raw}/specs/${id}.yaml`;
  });
  next = next.replace(SITE_PAGE, (match, found, hash = '') => {
    // A full stop ending the sentence is not part of the path.
    const path = found.replace(/\.+$/, '');
    const trail = found.slice(path.length);
    const copy = copyFor(path);
    if (!copy) { unresolved.add(path); return match; }
    rewritten++;
    return `${raw}/${copy}${hash}${hash ? '' : trail}`;
  });
  if (skillFolder) {
    next = next.replace(/the portal's \/skills\/([a-z0-9-]+)\/ path/g, (m, name) => { rewritten++; return `${tree}/${skillFolder}`; });
  }
  return next;
};
const rewriteTree = (dir, base) => {
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) { rewriteTree(full, base); continue; }
    if (!/\.(md|txt)$/.test(entry.name)) continue;
    const rel = relative(out, full).split('\\').join('/');
    const skill = /^plugins\/[^/]+\/skills\/[^/]+/.exec(rel)?.[0];
    const before = readFileSync(full, 'utf8');
    const after = rewrite(before, skill);
    if (after !== before) writeFileSync(full, after);
  }
};
for (const name of pub.plugins) rewriteTree(join(out, 'plugins', name));
rewriteTree(join(out, 'docs'));

const pick = (entries) => pub.plugins.map((name) => {
  const entry = entries.find((e) => e.name === name);
  if (!entry) throw new Error(`${name} is public but missing from this repository's marketplace`);
  return entry;
});

write('.claude-plugin/marketplace.json', {
  $schema: claude.$schema,
  name: pub.name,
  description: pub.description,
  owner: pub.owner,
  plugins: pick(claude.plugins),
});
write('.agents/plugins/marketplace.json', {
  name: pub.name,
  interface: {displayName: pub.displayName},
  plugins: pick(codex.plugins),
});
write('LICENSE', readFileSync(join(root, 'LICENSE'), 'utf8'));

const version = (name) => read(`plugins/${name}/.claude-plugin/plugin.json`).version;
write('README.md', [
  `# ${pub.displayName} agent plugins`,
  '',
  pub.description,
  '',
  '## Install',
  '',
  'Claude Code:',
  '',
  '```bash',
  `claude plugin marketplace add ${pub.repo}`,
  ...pub.plugins.map((name) => `claude plugin install ${name}@${pub.name}`),
  '```',
  '',
  'Codex:',
  '',
  '```bash',
  `codex plugin marketplace add ${pub.repo}`,
  '```',
  '',
  'Then install a plugin from Codex\'s plugin directory.',
  '',
  '## Plugins',
  '',
  '| Plugin | Version | What it is for |',
  '| --- | --- | --- |',
  ...pick(claude.plugins).map((e) => `| \`${e.name}\` | ${version(e.name)} | ${String(e.description).split('. ')[0].replace(/\.$/, '')}. |`),
  '',
  '`docs/` holds a markdown copy of every documentation page and `specs/` the OpenAPI file behind every API reference, published with each release. The skills link there rather than to the site, so they work wherever GitHub does.',
  '',
  'Documentation: https://docs.abdm.gov.in',
  '',
  'This repository is generated from the ABDM Developer Portal and published as it is. Changes made here are overwritten on the next publish; report issues through the portal.',
  '',
].join('\n'));

console.log(`Wrote ${pub.plugins.length} plugin(s), ${pages.size} page copies, ${specs.size} OpenAPI files and both marketplace files to ${out}; ${rewritten} site link(s) now point at GitHub.`);
if (unresolved.size) console.log(`  ${unresolved.size} site path(s) have no page copy and were left as they are: ${[...unresolved].slice(0, 8).join(', ')}${unresolved.size > 8 ? ', ...' : ''}`);
