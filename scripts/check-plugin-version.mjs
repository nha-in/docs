// scripts/check-plugin-version.mjs
// A plugin whose files change must change its version, or nobody who
// installed it ever receives the change: `claude plugin update` compares
// version numbers only.
//   npm run check:plugin-version            compares against origin/main
//   BASE_REF=origin/x npm run check:plugin-version
import {readdirSync, readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

export function versionProblems({changed, plugins}) {
  return plugins
    .filter(({dir, before, after}) => before === after && changed.some((f) => f.startsWith(`plugins/${dir}/`)))
    .map(({dir, after}) => `plugins/${dir} changed but its version is still ${after}. Bump "version" in plugins/${dir}/.claude-plugin/plugin.json, then run npm run build:plugins`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const base = process.env.BASE_REF ?? 'origin/main';
  const git = (...a) => execFileSync('git', a, {cwd: root, encoding: 'utf8'});
  const changed = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
  const plugins = readdirSync(join(root, 'plugins')).filter((d) => existsSync(join(root, 'plugins', d, '.claude-plugin', 'plugin.json'))).map((dir) => {
    const rel = `plugins/${dir}/.claude-plugin/plugin.json`;
    const after = JSON.parse(readFileSync(join(root, rel), 'utf8')).version;
    let before = null;
    try { before = JSON.parse(git('show', `${base}:${rel}`)).version; } catch {}
    return {dir, before, after};
  });
  const problems = versionProblems({changed, plugins});
  for (const p of problems) console.error(p);
  process.exit(problems.length ? 1 : 0);
}
