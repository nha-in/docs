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
// Run npm run build first: the plugin folders are build outputs. The target is
// made to match exactly; a plugin dropped from the list is removed there too.
// Nothing is committed or pushed; that stays a person's decision.
import {readFileSync, writeFileSync, mkdirSync, rmSync, cpSync, existsSync, readdirSync} from 'node:fs';
import {join, dirname, resolve} from 'node:path';
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
  'Documentation: https://docs.abdm.gov.in',
  '',
  'This repository is generated from the ABDM Developer Portal and published as it is. Changes made here are overwritten on the next publish; report issues through the portal.',
  '',
].join('\n'));

console.log(`Wrote ${pub.plugins.length} plugin(s) and both marketplace files to ${out}. Review, then commit and push there.`);
