#!/usr/bin/env node
// Fails a site build that is missing anything the agent tools fetch from it.
//
// The skills, the plugin prompts and the MCP setup are all fetched from the
// published site by an agent that cannot see the repository: a skill folder
// named in an index but absent from the build, an archive that does not
// unpack, or a prompt pointing at a URL the build does not serve is a broken
// install that nothing else would catch before a reader does. This runs after
// `docusaurus build` (the site's postbuild) and checks the build output itself,
// not the sources that produced it.
//
// Checks:
//   skills     every skill in skills/index.json and skills/nhcx-index.json has
//              its folder, every file the index lists, and, for NHCX, an
//              archive that is a readable tar.gz holding the same SKILL.md
//   stale      no skill folder or archive in the build that no index lists
//   prompts    agent-setup/prompt.md and agent-setup/nhcx.md exist, and every
//              site URL they name is a file in the build
//   plugins    each plugin that ships a .mcp.json names an HTTP server with a
//              URL, and its Codex manifest points at that file
//   llms       llms.txt is present
//
// Usage: node scripts/check-build-assets.mjs [site/build]
import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {root} from './lib/atoms.mjs';

const build = process.argv[2] ?? join(root, 'site', 'build');
const problems = [];
const fail = (msg) => problems.push(msg);

if (!existsSync(join(build, 'index.html'))) {
  console.error(`check-build-assets: ${build} holds no build`);
  process.exit(1);
}

// ---- skills -----------------------------------------------------------------
const skillsDir = join(build, 'skills');
const listed = new Set();
for (const indexName of ['index.json', 'nhcx-index.json']) {
  const indexFile = join(skillsDir, indexName);
  if (!existsSync(indexFile)) {
    fail(`skills/${indexName} is missing`);
    continue;
  }
  const index = JSON.parse(readFileSync(indexFile, 'utf8'));
  if (!Array.isArray(index.skills) || index.skills.length === 0) {
    fail(`skills/${indexName} lists no skill`);
    continue;
  }
  for (const skill of index.skills) {
    listed.add(skill.name);
    const dir = join(skillsDir, skill.name);
    if (!existsSync(join(dir, 'SKILL.md'))) {
      fail(`skills/${skill.name}/SKILL.md is missing (listed in ${indexName})`);
      continue;
    }
    for (const file of skill.files ?? []) {
      if (!existsSync(join(dir, file))) fail(`skills/${skill.name}/${file} is missing (listed in ${indexName})`);
    }
    if (skill.archive) {
      listed.add(skill.archive);
      const archive = join(skillsDir, skill.archive);
      if (!existsSync(archive)) {
        fail(`skills/${skill.archive} is missing (listed in ${indexName})`);
        continue;
      }
      let entries = [];
      try {
        entries = execFileSync('tar', ['-tzf', archive], {encoding: 'utf8'}).split('\n');
      } catch {
        fail(`skills/${skill.archive} is not a readable tar.gz`);
        continue;
      }
      if (!entries.includes(`${skill.name}/SKILL.md`)) {
        fail(`skills/${skill.archive} does not hold ${skill.name}/SKILL.md`);
      } else {
        const packed = execFileSync('tar', ['-xzOf', archive, `${skill.name}/SKILL.md`], {encoding: 'utf8'});
        if (packed !== readFileSync(join(dir, 'SKILL.md'), 'utf8')) {
          fail(`skills/${skill.archive} holds a different ${skill.name}/SKILL.md from the folder beside it`);
        }
      }
      const files = entries.filter((e) => e && !e.endsWith('/')).length;
      if (skill.files && files !== skill.files.length) {
        fail(`skills/${skill.archive} holds ${files} files, the index lists ${skill.files.length}`);
      }
    }
  }
}
if (existsSync(skillsDir)) {
  for (const entry of readdirSync(skillsDir)) {
    if (entry.endsWith('.json')) continue;
    if (!listed.has(entry)) fail(`skills/${entry} is in the build but no index lists it (a withdrawn skill?)`);
  }
}

// ---- prompts ----------------------------------------------------------------
// Every URL a prompt names on the site itself has to resolve to a file here.
// The site's own address is whatever the build was stamped with, so it is
// read from the prompt's links rather than assumed.
const siteFile = (path) => {
  const clean = decodeURIComponent(path.split(/[?#]/)[0]);
  const full = join(build, clean);
  if (existsSync(full) && statSync(full).isFile()) return true;
  // A skill folder is named as the base the agent fetches files under.
  if (existsSync(full) && statSync(full).isDirectory() && readdirSync(full).length > 0) return true;
  return existsSync(join(full, 'index.html'));
};
for (const prompt of ['prompt.md', 'nhcx.md']) {
  const file = join(build, 'agent-setup', prompt);
  if (!existsSync(file)) {
    fail(`agent-setup/${prompt} is missing`);
    continue;
  }
  const text = readFileSync(file, 'utf8');
  const origin = (text.match(/https?:\/\/[^\s/`)]+(?=\/skills\/)/) ?? [])[0];
  const paths = new Set();
  for (const m of text.matchAll(/https?:\/\/[^\s`)'"]+/g)) {
    if (origin && m[0].startsWith(origin)) paths.add(m[0].slice(origin.length).replace(/[.,;:]$/, ''));
  }
  for (const m of text.matchAll(/`(\/(?:skills|agent-setup|docs)\/[^\s`]+)`/g)) paths.add(m[1]);
  for (const path of paths) {
    if (/[<{$]/.test(path)) continue; // a template or a shell variable, not a file
    if (!siteFile(path)) fail(`agent-setup/${prompt} names ${path}, which the build does not serve`);
  }
}

// ---- plugins ----------------------------------------------------------------
const pluginsDir = join(root, 'plugins');
for (const name of existsSync(pluginsDir) ? readdirSync(pluginsDir) : []) {
  const mcpFile = join(pluginsDir, name, '.mcp.json');
  if (!existsSync(mcpFile)) continue;
  let mcp;
  try {
    mcp = JSON.parse(readFileSync(mcpFile, 'utf8'));
  } catch {
    fail(`plugins/${name}/.mcp.json is not valid JSON`);
    continue;
  }
  const servers = Object.entries(mcp.mcpServers ?? {});
  if (!servers.length) fail(`plugins/${name}/.mcp.json names no server`);
  for (const [server, conf] of servers) {
    if (!/^https:\/\//.test(conf.url ?? '')) fail(`plugins/${name}/.mcp.json: ${server} has no https URL`);
  }
  const codex = join(pluginsDir, name, '.codex-plugin', 'plugin.json');
  if (existsSync(codex) && JSON.parse(readFileSync(codex, 'utf8')).mcpServers !== './.mcp.json') {
    fail(`plugins/${name}/.codex-plugin/plugin.json does not point at ./.mcp.json (run npm run build:plugins)`);
  }
}

// ---- llms.txt ---------------------------------------------------------------
if (!existsSync(join(build, 'llms.txt'))) fail('llms.txt is missing');

if (problems.length) {
  console.error(`check-build-assets: ${problems.length} problem(s) in ${build}:`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}
const count = (f) => (existsSync(join(skillsDir, f)) ? JSON.parse(readFileSync(join(skillsDir, f), 'utf8')).skills.length : 0);
console.log(
  `check-build-assets: ${count('index.json')} ABDM and ${count('nhcx-index.json')} NHCX skill(s), their archives, both agent prompts and the plugin MCP configs are all in the build.`,
);
