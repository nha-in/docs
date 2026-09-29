// scripts/migration-report.mjs
// Run in every migration PR, before committing: proves each atom's API details
// reached its page, and prints the table the PR description carries.
//   npm run report:migration -- shared.glossary.link-token [--drop "/v3/x=reason"]
import {readFileSync, existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';

export function apiLiterals(text) {
  const out = new Set();
  for (const m of text.matchAll(/`([^`\n]+)`/g)) out.add(m[1]);
  for (const m of text.matchAll(/\b[A-Z]{2,6}-\d{3,5}\b/g)) out.add(m[0]);
  for (const m of text.replace(/`[^`\n]+`/g, '').matchAll(/(?<![\w.])\/[a-z0-9][a-z0-9/_{}.-]*[a-z0-9}]/gi)) out.add(m[0]);
  return out;
}

const words = (t) => t.split(/\s+/).filter(Boolean).length;
const body = (md) => md.replace(/^---\n[\s\S]*?\n---\n/, '');

export function compare(oldBody, newBody, dropped) {
  const after = apiLiterals(newBody);
  const missing = [...apiLiterals(oldBody)].filter((l) => !after.has(l) && !newBody.includes(l) && !dropped.has(l)).sort();
  return {wordsBefore: words(oldBody), wordsAfter: words(newBody), missing};
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const args = process.argv.slice(2);
  const dropped = new Map();
  const ids = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--drop') { const [l, ...r] = args[++i].split('='); dropped.set(l, r.join('=')); } else ids.push(args[i]);
  }
  const before = JSON.parse(execFileSync('git', ['show', 'HEAD:catalogue/registry.json'], {cwd: root, encoding: 'utf8'}));
  const now = JSON.parse(readFileSync(join(root, 'catalogue', 'registry.json'), 'utf8'));
  console.log('| Atom | Now on | Words before | Words after | Missing literals |\n|---|---|---|---|---|');
  let failed = false;
  for (const id of ids) {
    const was = before.find((e) => e.id === id && e.source === 'file');
    const is = now.find((e) => e.id === id && e.source === 'page');
    if (!was || !is) { console.log(`| ${id} | not migrated in this change | | | |`); failed = true; continue; }
    const oldBody = body(execFileSync('git', ['show', `HEAD:${was.file}`], {cwd: root, encoding: 'utf8'}));
    const genFile = join(root, 'catalogue', id.split('.')[0], was.file.split('/').at(-2), `${id.split('.')[2]}.md`);
    const newBody = existsSync(genFile) ? body(readFileSync(genFile, 'utf8')) : '';
    const r = compare(oldBody, newBody, dropped);
    if (r.missing.length) failed = true;
    console.log(`| ${id} | ${is.page}#${is.heading} | ${r.wordsBefore} | ${r.wordsAfter} | ${r.missing.map((m) => `\`${m}\``).join(', ') || 'none'} |`);
  }
  for (const [l, why] of dropped) console.log(`\nDropped \`${l}\`: ${why}`);
  process.exit(failed ? 1 : 0);
}
