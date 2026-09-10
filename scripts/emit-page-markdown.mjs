#!/usr/bin/env node
// Emits an index.md beside every built doc route so agents can fetch any
// page as markdown, plus llms-full.txt and per-module llms.txt indexes.
// Runs as the site's postbuild step; reads the finished build, never edits
// source. Routes come from the same walk build-atom-routes validates.
//
// The body is rendered from the built HTML, not from the .mdx source. Source
// is the wrong input, because half of what these pages say lives inside React
// components and no regex over JSX can read it. The stripper this replaced
// deleted every card, table and install command it recognised as a component,
// and passed through the `export const` blocks it did not, so Build with AI
// arrived carrying raw JSX and none of its commands. The built page is what a
// reader actually gets, so it is what the markdown is made of.
import {readFileSync, writeFileSync, existsSync, readdirSync, statSync} from 'node:fs';
import {join, relative, dirname} from 'node:path';
import {load} from 'cheerio';
import {unified} from 'unified';
import rehypeParse from 'rehype-parse';
import rehypeRemark from 'rehype-remark';
import remarkGfm from 'remark-gfm';
import remarkStringify from 'remark-stringify';

const SITE = join(import.meta.dirname, '..', 'site');
const BUILD = join(SITE, 'build');
const DOCS_SRC = join(SITE, 'docs');
const API_DATA = join(SITE, 'src', 'data', 'api');

// Docusaurus's own content container. Everything outside it is chrome the
// markdown has no use for: breadcrumbs, the table of contents, the sidebars,
// the previous and next pager.
const CONTENT = '.theme-doc-markdown';

// Chrome that sits inside it. A button does nothing in a text file, and an
// icon is decoration carrying no text, so both go before conversion.
const CHROME = 'button, svg, .hash-link, .pagination-nav, [aria-hidden="true"]';

const pipeline = unified()
  .use(rehypeParse, {fragment: true})
  .use(rehypeRemark)
  .use(remarkGfm)
  .use(remarkStringify, {bullet: '-', fences: true, rule: '-'});

/**
 * A tab panel makes no sense without its tab. Radix names each panel's
 * trigger with `aria-labelledby`, so the label is recoverable; without it
 * several alternatives run together in the markdown with nothing to tell
 * them apart. Runs before CHROME is stripped, because the trigger is a
 * button and stripping takes the label with it.
 */
function labelTabPanels($, root) {
  root.find('[role="tabpanel"]').each((_, el) => {
    const panel = $(el);
    // A panel whose first child is a visually hidden label already names
    // itself, for a screen reader and for this, so leave it alone.
    if (panel.children().first().hasClass('sr-only')) return;
    const id = panel.attr('aria-labelledby');
    if (!id || id.includes('"')) return;
    const label = $(`[id="${id}"]`).text().trim();
    if (label) panel.prepend(`<p><strong>${label}</strong></p>`);
  });
}

/**
 * Prism renders a code block as a tree of coloured spans and puts the
 * language on the `<pre>`, where hast-util-to-mdast does not look for it.
 * Flattening to one `<code class="language-x">` carrying the text gets a
 * fenced block with its language instead of a run of styled fragments.
 */
function flattenCodeBlocks($, root) {
  root.find('pre').each((_, el) => {
    const pre = $(el);
    const classes = `${pre.attr('class') ?? ''} ${pre.find('code').attr('class') ?? ''}`;
    const lang = /language-([\w-]+)/.exec(classes)?.[1];
    const code = $('<code>').text(pre.text());
    if (lang) code.addClass(`language-${lang}`);
    pre.replaceWith($('<pre>').append(code));
  });
}

/**
 * Docusaurus renders mermaid in the browser, so a diagram is simply not in
 * the built HTML: no source, no SVG, nothing to convert. It is the one thing
 * a page's markdown source still carries that its HTML does not, and the
 * milestone and concept pages carry 24 of them, so the fences are read back
 * from source and put under the heading they followed.
 */
function mermaidBlocks(src) {
  const out = [];
  const lines = src.split('\n');
  let heading = null;
  for (let i = 0; i < lines.length; i += 1) {
    const h = /^#{1,6}\s+(.*)$/.exec(lines[i]);
    if (h) {
      heading = h[1].trim();
      continue;
    }
    if (!/^\s*```mermaid\s*$/.test(lines[i])) continue;
    const block = [lines[i]];
    for (i += 1; i < lines.length; i += 1) {
      block.push(lines[i]);
      if (/^\s*```\s*$/.test(lines[i])) break;
    }
    out.push({heading, block: block.join('\n')});
  }
  return out;
}

export function restoreMermaid(md, src) {
  const blocks = mermaidBlocks(src ?? '');
  if (!blocks.length) return md;
  const byHeading = new Map();
  const loose = [];
  for (const {heading, block} of blocks) {
    if (!heading) {
      loose.push(block);
      continue;
    }
    if (!byHeading.has(heading)) byHeading.set(heading, []);
    byHeading.get(heading).push(block);
  }
  const out = [];
  for (const line of md.split('\n')) {
    out.push(line);
    const h = /^#{1,6}\s+(.*)$/.exec(line);
    if (!h) continue;
    const group = byHeading.get(h[1].trim());
    if (!group) continue;
    for (const block of group) out.push('', block);
    byHeading.delete(h[1].trim());
  }
  // A heading the conversion reworded still leaves its diagram on the page,
  // at the end rather than nowhere.
  for (const group of byHeading.values()) for (const block of group) out.push('', block);
  for (const block of loose) out.push('', block);
  return out.join('\n');
}

/**
 * One built page's content as markdown, or null when the page carries no
 * content container. Null means the build's template changed shape, which
 * the caller reports rather than papering over with an empty file.
 */
export function htmlToMarkdown(html, src) {
  const $ = load(html);
  const root = $(CONTENT).first();
  if (!root.length) return null;
  labelTabPanels($, root);
  root.find(CHROME).remove();
  // React separates two adjacent text nodes with an empty comment when it
  // renders to HTML. Left in, each one splits its enclosing link in two, so
  // `Open in Claude` arrived as an empty-looking link followed by a second
  // copy of the same URL.
  root
    .find('*')
    .addBack()
    .contents()
    .filter((_, node) => node.type === 'comment')
    .remove();
  flattenCodeBlocks($, root);
  const md = restoreMermaid(String(pipeline.processSync(root.html() ?? '')), src);
  return `${md.replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

// A worked response is the most useful thing here for an agent writing a
// parser, and the least useful thing to paste whole: two phr-services
// operations carried 594 KB each, of a Beckn catalogue whose shape repeats
// down a long array, and response examples were 2.7 MB of a 4.0 MB file.
//
// An array says everything it has to say in its first couple of entries, so
// the rest goes and the count stays. Anything still oversized after that is
// wide rather than long, and gets its top level shape instead: the field
// names are what a parser is written against, and the page itself carries
// the whole thing for anyone who wants it.
const EXAMPLE_ITEMS = 2;
const EXAMPLE_BYTES = 4096;

function trimExample(value) {
  if (Array.isArray(value)) {
    const kept = value.slice(0, EXAMPLE_ITEMS).map(trimExample);
    if (value.length > EXAMPLE_ITEMS) {
      kept.push(`... ${value.length - EXAMPLE_ITEMS} more of the same shape`);
    }
    return kept;
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, inner]) => [key, trimExample(inner)]),
    );
  }
  return value;
}

function shapeOf(value) {
  if (Array.isArray(value)) return 'array';
  if (value === null) return 'null';
  if (typeof value !== 'object') return typeof value;
  return Object.fromEntries(Object.entries(value).map(([key, inner]) => [key, shapeOf(inner)]));
}

export function exampleFor(value) {
  if (value === undefined) return '';
  const trimmed = JSON.stringify(trimExample(value), null, 2);
  if (trimmed.length <= EXAMPLE_BYTES) return trimmed;
  // The shape is not capped in turn. It is bounded by how many distinct
  // fields the schema has rather than by how much data came back, and an
  // object wide enough to exceed the cap on names alone is one where those
  // names are exactly what the reader needs. Returning nothing here would
  // drop the widest responses, which are the ones hardest to guess.
  return JSON.stringify(shapeOf(value), null, 2);
}

/** One parameter or body field, as a bullet an agent can read back. */
function fieldLine(field) {
  const type = field.type
    ? ` (${field.type}${field.required ? ', required' : ''})`
    : '';
  const enums = field.enum?.length ? ` One of: ${field.enum.join(', ')}.` : '';
  const description = (field.description ?? '').replace(/\s*\n\s*/g, ' ').trim();
  return `- \`${field.name}\`${type}${description ? `: ${description}` : ''}${enums}`;
}

function fieldSection(lines, title, fields) {
  if (!fields?.length) return;
  lines.push(`## ${title}`, '', ...fields.map(fieldLine), '');
}

export function renderOperationMarkdown(op) {
  // The catalogue's generated api/*.json carries `summary`, not `title`;
  // the test above passes `title` directly, so accept either.
  const title = op.title ?? op.summary ?? '';
  const lines = [`# ${title}`, '', `\`${(op.method ?? '').toUpperCase()} ${op.path ?? ''}\``, ''];
  if (op.description) lines.push(op.description.trim(), '');
  if (op.curl) lines.push('```bash', op.curl.trim(), '```', '');

  // Until now this stopped at the curl, so the corpus an agent reads said
  // what to send and never what comes back, on an API whose harder half is
  // the response. Everything below already sits in the operation JSON that
  // builds the page; it was simply never written out.
  fieldSection(
    lines,
    'Authorization',
    (op.security ?? []).map((scheme) => ({
      name:
        scheme.type === 'apiKey' && scheme.headerName
          ? scheme.headerName
          : 'Authorization',
      type: scheme.scheme === 'bearer' ? 'bearer token' : scheme.type,
      required: true,
      description: scheme.description,
    })),
  );
  fieldSection(lines, 'Headers', op.headers);
  fieldSection(lines, 'Path parameters', op.pathParams);
  fieldSection(lines, 'Query parameters', op.queryParams);
  fieldSection(lines, 'Body', op.body);

  if (op.responses?.length) {
    lines.push('## Responses', '');
    for (const response of op.responses) {
      const description = (response.description ?? '').replace(/\s*\n\s*/g, ' ').trim();
      lines.push(`- \`${response.status}\`${description ? `: ${description}` : ''}`);
      if (response.help) lines.push(`  See ${response.help.label}: ${response.help.href}`);
    }
    lines.push('');
    // A worked example beats a schema for an agent writing a parser, so the
    // first success carrying one is shown in full. It is labelled for what it
    // is: NHA published field lists rather than captured bodies, so the string
    // values are placeholders and the numbers are schema defaults. Calling it
    // an example response invited exactly one misreading, that `expiresIn` is
    // 0 when the sandbox returns a real lifetime.
    const shown = op.responses.find(
      (response) =>
        String(response.status).startsWith('2') && response.example !== undefined,
    );
    if (shown) {
      const example = exampleFor(shown.example);
      if (example) {
        lines.push(
          `Shape of the ${shown.status} response, generated from the schema. The values are placeholders, not a captured response:`,
          '',
          '```json',
          example,
          '```',
          '',
        );
      }
    }
  }
  return lines.join('\n');
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

/**
 * Where a page is actually published.
 *
 * Usually that follows the file's own path, but front matter can override it
 * with `slug:`, and then the file path is not where the page lives. Get
 * started is exactly that case: it sits in `getting-started/index.mdx` and
 * publishes at `/hiecm/v3`. Deriving the route from the path alone wrote its
 * markdown beside a route that does not exist and never wrote one beside the
 * route that does, so both Copy for LLM and View as Markdown failed on it.
 */
export function routeFor(srcPath, raw) {
  const slug = /^slug:\s*(\S+)\s*$/m.exec(raw ?? '')?.[1];
  if (slug) return join('docs', slug.replace(/^\/+/, '').replace(/\/+$/, ''));

  // site/docs/hiecm/v3/getting-started/sandbox.md -> docs/hiecm/v3/getting-started/sandbox
  let r = relative(DOCS_SRC, srcPath).replace(/\.(mdx?|md)$/, '');
  if (r.endsWith('/index') || r.endsWith('\\index')) r = dirname(r);
  return join('docs', r);
}

/**
 * The Scalar reference pages at /reference/<gateway>-<module> render entirely
 * in the browser, so fetching one as markdown got an empty shell. They are
 * linked from 21 pages of prose, which means an agent reading this site as
 * markdown followed a link and arrived nowhere.
 *
 * The interactive page stays as it is, for a reader with a browser. What is
 * written beside it is a short pointer at the two machine readable forms of
 * the same module: the page-per-operation markdown under api/, and the
 * specification the reference itself is built from.
 */
function emitReferenceStubs(buildDir) {
  const dir = join(buildDir, 'reference');
  if (!existsSync(dir)) return 0;
  let written = 0;
  for (const id of readdirSync(dir)) {
    const outDir = join(dir, id);
    if (!statSync(outDir).isDirectory()) continue;
    const [gateway, ...rest] = id.split('-');
    const moduleId = rest.join('-');
    if (!gateway || !moduleId) continue;
    const label = moduleId.toUpperCase();
    const md = [
      `# ${label} API reference`,
      '',
      `The ${label} reference is an interactive page. It renders in a browser and`,
      'carries no text to read here.',
      '',
      'The same operations in a form you can read:',
      '',
      `- [Every ${label} page as markdown](/docs/${gateway}/v3/api/${moduleId}), one page per operation, each with its headers, parameters, responses and a worked curl.`,
      `- [The OpenAPI specification](/specs/${id}.yaml) this reference is generated from.`,
      `- [The module index](/docs/${gateway}/v3/api/${moduleId}/llms.txt), which lists every operation with a link.`,
      '',
    ].join('\n');
    writeFileSync(join(outDir, 'index.md'), md);
    writeFileSync(`${outDir}.md`, md);
    written += 1;
  }
  return written;
}

function main() {
  const full = [];
  let emitted = 0;
  let skipped = 0;
  const unrendered = [];
  // module id -> [{title, route}], for the per-module llms.txt under hiecm/v3/api.
  const apiModulePages = new Map();

  for (const src of walk(DOCS_SRC)) {
    if (!/\.(md|mdx)$/.test(src)) continue;
    if (/README\.md$|_category_\.json/.test(src)) continue;
    if (/[\\/]_glossary[\\/]/.test(src)) continue; // partials, not routes

    const raw = readFileSync(src, 'utf8');
    const route = routeFor(src, raw);
    const outDir = join(BUILD, route);
    if (!existsSync(outDir)) {
      skipped += 1;
      continue; // page exists in source but not in this build; skip
    }

    let md;
    let title;
    const opImport = /from '@site\/src\/data\/api\/([\w-]+)\.json'/.exec(raw);
    if (opImport && existsSync(join(API_DATA, `${opImport[1]}.json`))) {
      // An operation page renders from its own JSON rather than from the
      // built HTML: the JSON carries the headers, parameters, responses and
      // worked example in full, and the page shows them through a reference
      // component that reads worse linearised than the source data does.
      const op = JSON.parse(readFileSync(join(API_DATA, `${opImport[1]}.json`), 'utf8'));
      md = renderOperationMarkdown(op);
      title = op.title ?? op.summary ?? '';
    } else {
      const html = join(outDir, 'index.html');
      if (!existsSync(html)) {
        skipped += 1;
        continue;
      }
      md = htmlToMarkdown(readFileSync(html, 'utf8'), raw);
      if (md === null) {
        unrendered.push(route);
        continue;
      }
      title = /title:\s*"?([^"\n]+)"?/.exec(raw)?.[1] ?? md.match(/^#\s+(.+)$/m)?.[1] ?? '';
    }
    writeFileSync(join(outDir, 'index.md'), md);
    // The same markdown at <route>.md as well as <route>/index.md. Appending
    // .md to a documentation URL is the convention agents try first, because
    // Stripe and Mintlify both serve it, and here it returned the HTML shell:
    // an agent following its own habit got a page of script tags. Writing the
    // sibling costs one small file per route and makes the habit work.
    writeFileSync(`${outDir.replace(/[\\/]+$/, '')}.md`, md);
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

  const stubs = emitReferenceStubs(BUILD);

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
    `emit-page-markdown: ${emitted} pages emitted, ${skipped} skipped (no matching build route), ${stubs} reference stub(s), llms-full.txt written, ${apiModulePages.size} module llms.txt file(s) written.`,
  );
  if (unrendered.length) {
    console.error(
      `emit-page-markdown: ${unrendered.length} built page(s) carried no ${CONTENT} container, so no markdown was written for them. The theme's markup has changed shape.`,
    );
    for (const route of unrendered) console.error(`  ${route}`);
    process.exit(1);
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) main();
