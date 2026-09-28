// scripts/lib/notes.mjs
// Hand-written notes on a generated API page. The generator owns the page and
// rewrites it on every run, so what a person writes about one operation, or
// about one module's error codes, lives in a partial the page imports:
//   site/docs/_notes/<platform>/<operationId>.mdx
//   site/docs/_notes/<platform>/errors/<module>.mdx
// A folder starting with _ is never routed, so the partial has no page of its own.
import {existsSync} from 'node:fs';
import {join} from 'node:path';

// The import path of the partial, or null when nobody has written one.
export function notesFor(root, platform, name) {
  const rel = `_notes/${platform}/${name}.mdx`;
  return existsSync(join(root, 'site', 'docs', rel)) ? `@site/docs/${rel}` : null;
}

// A generated error page is CommonMark. One that imports notes must be MDX,
// where NHA's message text ("<ABHA_NUMBER>", "<<hospital name>>") would parse
// as JSX, so text lines are escaped outside inline code, and the raw HTML
// lines take React's className.
export function toMdx(lines, importPath) {
  const end = lines[0] === '---' ? lines.indexOf('---', 1) + 1 : 0;
  const escape = (line) => line.split(/(`[^`]*`)/).map((part, i) => (i % 2 ? part : part.replace(/[<>{}]/g, (c) => `&#${c.charCodeAt(0)};`))).join('');
  const body = lines.slice(end).map((line) => (line.startsWith('<') ? line.replace(/ class="/g, ' className="') : escape(line)));
  return [...lines.slice(0, end), '', `import Notes from '${importPath}';`, ...body];
}
