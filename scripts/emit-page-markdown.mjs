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
// Line-based, not a single regex, so it can handle a fence indented under a
// list item (any amount of leading whitespace, not capped at three spaces)
// and an unterminated fence that CommonMark treats as running to EOF.
// Returns alternating {fenced: false} prose and {fenced: true} code groups
// that partition the input's lines, so joining them with '\n' reproduces it.
function splitOnFences(text) {
  const lines = text.split('\n');
  const openRe = /^[ \t]*(`{3,}|~{3,})/;
  const groups = [];
  let i = 0;
  let prose = [];
  while (i < lines.length) {
    const open = openRe.exec(lines[i]);
    if (!open) {
      prose.push(lines[i]);
      i += 1;
      continue;
    }
    if (prose.length) {
      groups.push({fenced: false, lines: prose});
      prose = [];
    }
    const marker = open[1][0];
    const minLen = open[1].length;
    const closeRe = new RegExp(`^[ \\t]*\\${marker}{${minLen},}[ \\t]*$`);
    const fenceLines = [lines[i]];
    let j = i + 1;
    while (j < lines.length) {
      fenceLines.push(lines[j]);
      const closed = closeRe.test(lines[j]);
      j += 1;
      if (closed) break;
    }
    // If no closing fence was found, j has reached lines.length and the
    // fence (correctly) swallowed every remaining line, to EOF.
    groups.push({fenced: true, lines: fenceLines});
    i = j;
  }
  if (prose.length) groups.push({fenced: false, lines: prose});
  return groups;
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
    .map((group) => {
      const text = group.lines.join('\n');
      return group.fenced ? text : stripJsx(text);
    })
    .join('\n');
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
      const description =
        /^description:\s*"?([^"\n]+)"?/m.exec(raw)?.[1]?.trim() ?? '';
      if (!apiModulePages.has(moduleId)) apiModulePages.set(moduleId, []);
      apiModulePages.get(moduleId).push({title, route, description});
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

  // Same llmstxt.org shape as the root llms.txt (build-nav.mjs): H1, a `>`
  // summary, one `## section`, then `- [Title](url): description` lines.
  for (const [moduleId, pages] of apiModulePages) {
    pages.sort((a, b) => a.route.localeCompare(b.route));
    const outDir = join(BUILD, 'docs', 'hiecm', 'v3', 'api', moduleId);
    if (!existsSync(outDir)) continue;
    const label = moduleId.toUpperCase();
    const lines = [
      `# ${label}`,
      '',
      `> Every page of the ${label} module of the ABDM Developer Portal, fetchable as markdown.`,
      '',
      '## Pages',
      '',
    ];
    for (const p of pages) {
      lines.push(`- [${p.title}](${siteUrl}${base}/${p.route})${p.description ? `: ${p.description}` : ''}`);
    }
    lines.push('');
    writeFileSync(join(outDir, 'llms.txt'), lines.join('\n'));
  }

  console.log(
    `emit-page-markdown: ${emitted} pages emitted, ${skipped} skipped (no matching build route), llms-full.txt written, ${apiModulePages.size} module llms.txt file(s) written.`,
  );
}

if (process.argv[1] === new URL(import.meta.url).pathname) main();
