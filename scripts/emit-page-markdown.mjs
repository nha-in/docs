#!/usr/bin/env node
// Emits an index.md beside every built doc route so agents can fetch any
// page as markdown, plus llms-full.txt and per-module llms.txt indexes.
// Runs as the site's postbuild step; reads the finished build, never edits
// source. Routes come from the same walk build-atom-routes validates.
import {readFileSync, writeFileSync, existsSync, readdirSync, statSync} from 'node:fs';
import {join, relative, dirname} from 'node:path';

const SITE = join(import.meta.dirname, '..', 'site');
const BUILD = join(SITE, 'build');
const DOCS_SRC = join(SITE, 'docs');
const API_DATA = join(SITE, 'src', 'data', 'api');

// Splits markdown on fenced code blocks (``` or ~~~, with an optional info
// string such as ```tsx) so JSX stripping can skip fenced content entirely.
// Returns alternating {fenced: false} prose and {fenced: true} code segments.
function splitOnFences(text) {
  const fence = /^(```|~~~)[^\n]*\n[\s\S]*?\n\1[ \t]*$/gm;
  const parts = [];
  let last = 0;
  let m;
  while ((m = fence.exec(text))) {
    parts.push({fenced: false, text: text.slice(last, m.index)});
    parts.push({fenced: true, text: m[0]});
    last = m.index + m[0].length;
  }
  parts.push({fenced: false, text: text.slice(last)});
  return parts;
}

// Drops JSX component lines the markdown reader cannot use; keeps prose.
// Only ever called on non-fenced segments.
function stripJsx(text) {
  return text
    .replace(/^<([A-Z]\w*)(?:\s[^>]*)?\/>$/gm, '')
    // Closing tag must match the opening tag name, so a run of different
    // sibling components cannot match past the wrong closer.
    .replace(/^<([A-Z]\w*)[^>]*>[\s\S]*?^<\/\1>$/gm, '');
}

export function stripToMarkdown(src) {
  let body = src.replace(/^---\n[\s\S]*?\n---\n/, '');
  body = body.replace(/^import .*$/gm, '');
  body = splitOnFences(body)
    .map((part) => (part.fenced ? part.text : stripJsx(part.text)))
    .join('');
  const title = /title:\s*"?([^"\n]+)"?/.exec(src)?.[1];
  if (title && !new RegExp(`^# `, 'm').test(body)) body = `# ${title}\n\n${body}`;
  return body.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

export function renderOperationMarkdown(op) {
  // The catalogue's generated api/*.json carries `summary`, not `title`;
  // the test above passes `title` directly, so accept either.
  const title = op.title ?? op.summary ?? '';
  const lines = [`# ${title}`, '', `\`${(op.method ?? '').toUpperCase()} ${op.path ?? ''}\``, ''];
  if (op.description) lines.push(op.description.trim(), '');
  if (op.curl) lines.push('```bash', op.curl.trim(), '```', '');
  return lines.join('\n');
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function routeFor(srcPath) {
  // site/docs/hiecm/v3/getting-started/sandbox.md -> docs/hiecm/v3/getting-started/sandbox
  let r = relative(DOCS_SRC, srcPath).replace(/\.(mdx?|md)$/, '');
  if (r.endsWith('/index') || r.endsWith('\\index')) r = dirname(r);
  return join('docs', r);
}

function main() {
  const full = [];
  let emitted = 0;
  let skipped = 0;
  // module id -> [{title, route}], for the per-module llms.txt under hiecm/v3/api.
  const apiModulePages = new Map();

  for (const src of walk(DOCS_SRC)) {
    if (!/\.(md|mdx)$/.test(src)) continue;
    if (/README\.md$|_category_\.json/.test(src)) continue;
    if (/[\\/]_glossary[\\/]/.test(src)) continue; // partials, not routes

    const raw = readFileSync(src, 'utf8');
    let md;
    let title;
    const opImport = /from '@site\/src\/data\/api\/([\w-]+)\.json'/.exec(raw);
    if (opImport && existsSync(join(API_DATA, `${opImport[1]}.json`))) {
      const op = JSON.parse(readFileSync(join(API_DATA, `${opImport[1]}.json`), 'utf8'));
      md = renderOperationMarkdown(op);
      title = op.title ?? op.summary ?? '';
    } else {
      md = stripToMarkdown(raw);
      title = /title:\s*"?([^"\n]+)"?/.exec(raw)?.[1] ?? md.match(/^#\s+(.+)$/m)?.[1] ?? '';
    }

    const route = routeFor(src);
    const outDir = join(BUILD, route);
    if (!existsSync(outDir)) {
      skipped += 1;
      continue; // page exists in source but not in this build; skip
    }
    writeFileSync(join(outDir, 'index.md'), md);
    full.push(md);
    emitted += 1;

    const moduleMatch = /^docs[\\/]hiecm[\\/]v3[\\/]api[\\/]([\w-]+)([\\/]|$)/.exec(route);
    if (moduleMatch) {
      const moduleId = moduleMatch[1];
      if (!apiModulePages.has(moduleId)) apiModulePages.set(moduleId, []);
      apiModulePages.get(moduleId).push({title, route});
    }
  }

  writeFileSync(join(BUILD, 'llms-full.txt'), full.join('\n\n---\n\n'));

  // Per-module llms.txt, same DOCUSAURUS_URL fallback-and-warn as build-nav.mjs.
  if (!process.env.DOCUSAURUS_URL && process.env.CI) {
    console.error('emit-page-markdown: DOCUSAURUS_URL is required in CI so llms.txt never ships placeholder URLs.');
    process.exit(1);
  }
  if (!process.env.DOCUSAURUS_URL) {
    console.warn('emit-page-markdown: DOCUSAURUS_URL unset, module llms.txt will use the example.com placeholder (local build only).');
  }
  const siteUrl = (process.env.DOCUSAURUS_URL ?? 'https://abdm-docs.example.com').replace(/\/+$/, '');
  const base = (process.env.DOCUSAURUS_BASE_URL ?? '/').replace(/\/+$/, '');

  for (const [moduleId, pages] of apiModulePages) {
    pages.sort((a, b) => a.route.localeCompare(b.route));
    const lines = pages.map((p) => `${p.title} ${siteUrl}${base}/${p.route}`);
    const outDir = join(BUILD, 'docs', 'hiecm', 'v3', 'api', moduleId);
    if (!existsSync(outDir)) continue;
    writeFileSync(join(outDir, 'llms.txt'), lines.join('\n') + '\n');
  }

  console.log(
    `emit-page-markdown: ${emitted} pages emitted, ${skipped} skipped (no matching build route), llms-full.txt written, ${apiModulePages.size} module llms.txt file(s) written.`,
  );
}

if (process.argv[1] === new URL(import.meta.url).pathname) main();
