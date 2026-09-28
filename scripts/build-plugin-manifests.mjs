// One plugin, every client that reads a plugin.
//
// Agent Plugins 1.0.0 (agent-plugins.org, published 6 August 2026) is the
// vendor neutral packaging standard for Agent Skills and MCP servers. Vercel
// proposed it; AWS, Anysphere, GitHub, Microsoft and OpenAI refined it, and
// Google joined as a core maintainer. ChatGPT, Codex, Cursor, GitHub Copilot,
// Kiro and VS Code read it. Claude Code does not: it keeps its own manifest at
// .claude-plugin/plugin.json and ignores a root one.
//
// So the same folder needs three manifests, and each client's own directory is
// where it looks:
//
//   plugin.json                the standard, read by the Agent Plugins clients
//   .claude-plugin/plugin.json Claude Code, and the source of truth here
//   .codex-plugin/plugin.json  Codex, which points at ./skills/ explicitly
//
// plus .agents/plugins/marketplace.json at the repository root, which is what
// `codex plugin marketplace add nha-in/docs` reads, mirroring the
// .claude-plugin/marketplace.json beside it.
//
// Three manifests naming the same version is three chances to disagree, so
// they are generated rather than kept by hand. The Claude manifest and the
// Claude marketplace are the source; everything else here is derived. Run with
// --check to fail rather than write, which is what CI does.
//
// Only a plugin the standard can actually carry is emitted. Agent Plugins 1.0
// covers skills and MCP servers and nothing else, so a plugin with commands/
// or agents/ in it, as the contributors' assistant has, would arrive in
// another client missing most of itself. Those stay Claude Code's.
import {readFileSync, writeFileSync, mkdirSync, existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

const SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';

/** What Codex calls the marketplace in its own plugin directory. The Claude
    marketplace names the owner rather than the shelf, and "ABDM Developer
    Portal working group" is who publishes it, not what it is called. */
const MARKETPLACE_NAME = 'ABDM Developer Portal';

/**
 * The shop window Codex renders a plugin with. Claude Code's manifest has no
 * field for any of it, so it lives here rather than being invented from the
 * description, which is a paragraph and would read as one in a card.
 */
const STOREFRONT = {
  'abdm-integrators-assistant': {
    shortDescription: 'Build and debug an ABDM integration, milestone by milestone.',
    longDescription:
      "India's health data network, written as skills an agent reads before it writes code. Build skills scaffold a milestone flow by flow against the sandbox; debug skills walk a failed call to a named fix. Every step cites the documentation page it came from.",
    defaultPrompt: [
      'Add ABHA creation and login to this codebase.',
      'Link a care context and share records with an HIU.',
      'This ABDM call is failing. Find out why.',
    ],
    capabilities: ['Read', 'Write'],
  },
  nhcx: {
    shortDescription: 'Build an NHCX claims integration, one use case at a time.',
    longDescription:
      "India's health claims exchange, written as skills an agent reads before it writes code. One skill per use case, from coverage to reprocess. Each checks what the system already has, builds only what is missing, and holds every bundle to the NHCX package's pinned samples.",
    defaultPrompt: [
      'Add NHCX policy search and coverage eligibility to this hospital system.',
      'File the NHCX claim at discharge from this system.',
      'This NHCX call was refused. Find out why.',
    ],
    capabilities: ['Read', 'Write'],
  },
};

const files = [];
const record = (path, value) => {
  files.push({path, body: `${JSON.stringify(value, null, 2)}\n`});
};

/**
 * The standard's manifest schema, enforced here rather than discovered by a
 * reader whose install failed.
 *
 * It is a closed schema: a field not on this list invalidates the whole
 * plugin, which is a worse failure than most, because the plugin then does
 * not appear at all. The Claude manifest this is derived from has fields the
 * standard does not (displayName, and whatever Claude Code adds next), so the
 * mapping below has to drop them, and this is what says so out loud on the
 * day it stops doing that.
 */
const ALLOWED = new Set([
  '$schema',
  'name',
  'version',
  'description',
  'author',
  'homepage',
  'repository',
  'license',
  'keywords',
  'extensions',
]);
const NAME = /^(?!.*(--|\.\.))[a-z0-9][a-z0-9.-]{0,62}[a-z0-9]$/;

function standard(manifest) {
  const extra = Object.keys(manifest).filter((key) => !ALLOWED.has(key));
  if (extra.length > 0) {
    throw new Error(`plugin.json carries fields the standard rejects: ${extra.join(', ')}`);
  }
  if (!NAME.test(manifest.name)) {
    throw new Error(`plugin.json name is not a valid plugin name: ${manifest.name}`);
  }
  for (const key of Object.keys(manifest.author ?? {})) {
    if (!['name', 'email', 'url'].includes(key)) {
      throw new Error(`plugin.json author carries an unknown field: ${key}`);
    }
  }
  return manifest;
}

const market = JSON.parse(
  readFileSync(join(root, '.claude-plugin', 'marketplace.json'), 'utf8'),
);

/**
 * Component folders a plugin keeps for Claude Code, having accepted that the
 * standard cannot carry them.
 *
 * Agent Plugins 1.0 defines skills and MCP servers and nothing else, so
 * anything else is left behind wherever the standard is read. Whether that is
 * acceptable is a question about the particular plugin, not a rule:
 *
 *   The contributors' assistant is mostly its commands and agents. Publishing
 *   the skills alone would put a plugin in another client that is missing most
 *   of itself, so it is not published there and declares nothing here.
 *
 *   The integrators' assistant is its skills. Its commands and agents are
 *   entry points into them, useful in Claude Code and no loss elsewhere, so it
 *   declares them and publishes the skills.
 *
 * A folder not declared here still blocks publication, which is what keeps
 * this a decision someone made rather than one that happened.
 */
const CLAUDE_ONLY = {
  'abdm-integrators-assistant': ['commands', 'agents'],
  // The same case as the integrators' assistant: NHCX is its seven skills, and
  // the commands and the call debugger are entry points into them.
  nhcx: ['commands', 'agents'],
};

const COMPONENTS = ['commands', 'agents', 'hooks'];

/**
 * Whether Agent Plugins 1.0 can carry enough of this plugin to be worth
 * publishing: it has skills, and every component the standard cannot carry is
 * one this plugin has declared it will leave behind.
 */
function portable(dir, name) {
  if (!existsSync(join(dir, 'skills'))) return false;
  const declared = CLAUDE_ONLY[name] ?? [];
  return COMPONENTS.every(
    (part) => !existsSync(join(dir, part)) || declared.includes(part),
  );
}

const carried = [];

for (const entry of market.plugins) {
  const dir = join(root, entry.source);
  const claudePath = join(dir, '.claude-plugin', 'plugin.json');
  if (!existsSync(claudePath)) continue;
  const claude = JSON.parse(readFileSync(claudePath, 'utf8'));
  if (!portable(dir, claude.name)) continue;

  const left = (CLAUDE_ONLY[claude.name] ?? []).filter((part) =>
    existsSync(join(dir, part)),
  );
  if (left.length) {
    console.log(
      `${claude.name}: publishing skills only. ${left.join(' and ')} stay Claude Code's.`,
    );
  }
  const storefront = STOREFRONT[claude.name];
  if (!storefront) {
    throw new Error(`No storefront copy for the portable plugin ${claude.name}`);
  }
  const homepage = entry.homepage ?? market.owner?.url;
  const author = {
    name: claude.author?.name ?? market.owner?.name,
    ...(market.owner?.url ? {url: market.owner.url} : {}),
  };

  // The standard's manifest schema is closed: $schema and name are required,
  // everything else below is one of the eight optional fields it allows, and
  // anything not on that list makes the plugin invalid rather than merely odd.
  // displayName is not on it, which is why it appears only in Codex's
  // interface block further down.
  record(join(dir, 'plugin.json'), standard({
    $schema: SCHEMA,
    name: claude.name,
    version: claude.version,
    description: claude.description,
    author,
    homepage,
    repository: homepage,
    license: claude.license,
    keywords: claude.keywords,
  }));

  // Codex reads its own manifest and wants the component paths spelled out
  // rather than discovered. A plugin that carries ./.mcp.json, the Docs MCP
  // server at its published address, names it; Claude Code finds the same
  // file on its own.
  const mcp = existsSync(join(dir, '.mcp.json')) ? {mcpServers: './.mcp.json'} : {};
  record(join(dir, '.codex-plugin', 'plugin.json'), {
    name: claude.name,
    version: claude.version,
    description: claude.description,
    author,
    homepage,
    repository: homepage,
    license: claude.license,
    keywords: claude.keywords,
    skills: './skills/',
    ...mcp,
    interface: {
      displayName: claude.displayName ?? claude.name,
      shortDescription: storefront.shortDescription,
      longDescription: storefront.longDescription,
      defaultPrompt: storefront.defaultPrompt,
      developerName: market.owner?.name,
      category: title(entry.category),
      capabilities: storefront.capabilities,
      websiteURL: homepage,
    },
  });

  carried.push({
    name: claude.name,
    source: {source: 'local', path: `./${entry.source.replace(/^\.\//, '')}`},
    // installation only. The other marketplaces publishing this file carry
    // authentication: ON_INSTALL because they hold credentials; this plugin
    // holds none, the value that says so is not published anywhere, and
    // guessing one would make every install ask for a secret that does not
    // exist.
    policy: {installation: 'AVAILABLE'},
    category: title(entry.category),
  });
}

if (carried.length === 0) throw new Error('No portable plugin found to publish');

record(join(root, '.agents', 'plugins', 'marketplace.json'), {
  name: market.name,
  interface: {displayName: MARKETPLACE_NAME},
  plugins: carried,
});

/** Codex renders the category as it is given. Claude's is lower case. */
function title(value) {
  if (!value) return undefined;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

let stale = 0;
for (const {path, body} of files) {
  const shown = path.slice(root.length + 1);
  if (check) {
    const found = existsSync(path) ? readFileSync(path, 'utf8') : null;
    if (found === body) continue;
    console.error(`${shown} is out of date. Run npm run build:plugins.`);
    stale += 1;
    continue;
  }
  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, body);
  console.log(`Wrote ${shown}.`);
}

if (stale > 0) process.exit(1);
if (check) console.log(`${files.length} plugin manifest(s) up to date.`);
