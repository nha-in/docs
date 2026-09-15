import {test} from 'node:test';
import assert from 'node:assert';
import {exampleFor, htmlToMarkdown, renderOperationMarkdown, routeFor} from './emit-page-markdown.mjs';

test('operation JSON renders to markdown with method, path and curl', () => {
  const op = {
    title: 'Link care contexts to an ABHA address',
    method: 'post',
    path: '/hiecm/hip/v3/link/carecontext',
    description: 'Links one or more care contexts.',
    curl: "curl --request POST --url https://dev.abdm.gov.in/api/hiecm/hip/v3/link/carecontext",
  };
  const md = renderOperationMarkdown(op);
  assert.match(md, /^# Link care contexts to an ABHA address/);
  assert.match(md, /POST \/hiecm\/hip\/v3\/link\/carecontext/);
  assert.match(md, /```bash\ncurl --request POST/);
});

test('operation JSON with real catalogue field names (summary, no title) still renders', () => {
  const op = {
    summary: 'Find Bridge Service by Service ID',
    method: 'GET',
    path: '/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}',
    description: 'Look up a specific registered HIP/HIU service by its service ID.',
    curl: "curl --request GET \\\n  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId}",
  };
  const md = renderOperationMarkdown(op);
  assert.match(md, /^# Find Bridge Service by Service ID/);
  assert.match(md, /GET \/api\/hiecm\/gateway\/v3\/bridge-service\/serviceId\/\{serviceId\}/);
});

test('routeFor follows the file path when no slug is set', () => {
  const r = routeFor('site/docs/hiecm/v3/getting-started/sandbox.md', '---\ntitle: x\n---\n');
  assert.strictEqual(r, 'docs/hiecm/v3/getting-started/sandbox');
});

test('routeFor collapses an index file to its folder', () => {
  const r = routeFor('site/docs/hiecm/v3/milestones/index.mdx', '---\ntitle: x\n---\n');
  assert.strictEqual(r, 'docs/hiecm/v3/milestones');
});

test('routeFor honours a slug that moves the page off its path', () => {
  // Get started lives in getting-started/index.mdx and publishes at /hiecm/v3.
  // Following the path would write the markdown where no page is served.
  const r = routeFor(
    'site/docs/hiecm/v3/getting-started/index.mdx',
    '---\ntitle: Get started\nslug: /hiecm/v3\n---\n',
  );
  assert.strictEqual(r, 'docs/hiecm/v3');
});

test('a response example keeps its shape and loses only repetition', () => {
  const example = {items: Array.from({length: 40}, (_, i) => ({id: i, name: `row ${i}`}))};
  const out = JSON.parse(exampleFor(example));
  assert.strictEqual(out.items.length, 3, 'two entries plus the note');
  assert.deepStrictEqual(out.items[0], {id: 0, name: 'row 0'});
  assert.match(out.items[2], /38 more of the same shape/);
});

test('an example too wide to trim falls back to its shape', () => {
  const wide = Object.fromEntries(
    Array.from({length: 400}, (_, i) => [`field${i}`, 'x'.repeat(40)]),
  );
  const out = JSON.parse(exampleFor(wide));
  assert.strictEqual(out.field0, 'string', 'values become their type');
  assert.strictEqual(Object.keys(out).length, 400, 'every field name survives');
});

test('a small example is passed through untouched', () => {
  const small = {txnId: 'abc', status: 'SUCCESS'};
  assert.deepStrictEqual(JSON.parse(exampleFor(small)), small);
});

test('no example renders nothing rather than the word undefined', () => {
  assert.strictEqual(exampleFor(undefined), '');
});

// The page body now comes from the built HTML, so these guard the two ways
// the JSX stripper it replaced got a page wrong: content that lived inside a
// component was deleted, and a construct the grammar did not recognise came
// through as raw JSX.

const page = (body) =>
  '<html><body><nav>Breadcrumbs</nav>' +
  `<div class="theme-doc-markdown markdown">${body}</div>` +
  '<div class="theme-doc-toc-desktop">On this page</div></body></html>';

test('htmlToMarkdown takes the content container and leaves the chrome around it', () => {
  const md = htmlToMarkdown(page('<h1>Build with AI</h1><p>Body text.</p>'));
  assert.match(md, /^# Build with AI/);
  assert.match(md, /Body text\./);
  assert.doesNotMatch(md, /Breadcrumbs/);
  assert.doesNotMatch(md, /On this page/);
});

test('htmlToMarkdown keeps a component-rendered card link, which the stripper deleted', () => {
  const md = htmlToMarkdown(
    page(
      '<div class="card-group"><a href="/docs/hiecm/v3/getting-started/sandbox">' +
        'Get your sandbox credentials</a></div>',
    ),
  );
  assert.match(md, /\[Get your sandbox credentials\]\(\/docs\/hiecm\/v3\/getting-started\/sandbox\)/);
});

test('htmlToMarkdown keeps every tab panel and names it after its trigger', () => {
  const md = htmlToMarkdown(
    page(
      '<div><button id="t-cli" role="tab">Claude Code (CLI)</button>' +
        '<button id="t-generic" role="tab">Claude Desktop / generic</button>' +
        '<div role="tabpanel" aria-labelledby="t-cli"><p>claude mcp add abdm-docs</p></div>' +
        '<div role="tabpanel" aria-labelledby="t-generic" hidden>' +
        '<p>Paste this JSON config</p></div></div>',
    ),
  );
  assert.match(md, /\*\*Claude Code \(CLI\)\*\*/);
  assert.match(md, /claude mcp add abdm-docs/);
  // The panel that is not on screen is the one an agent would otherwise
  // never see, and on Build with AI it is half the install instructions.
  assert.match(md, /\*\*Claude Desktop \/ generic\*\*/);
  assert.match(md, /Paste this JSON config/);
});

test('htmlToMarkdown flattens a Prism block to a fence carrying its language', () => {
  const md = htmlToMarkdown(
    page(
      '<pre class="prism-code language-bash"><code>' +
        '<span class="token">curl</span> <span class="token">-X POST</span></code></pre>',
    ),
  );
  assert.match(md, /```bash\ncurl -X POST\n```/);
  assert.doesNotMatch(md, /span|token/);
});

test('htmlToMarkdown keeps a table', () => {
  const md = htmlToMarkdown(
    page('<table><thead><tr><th>Gateway</th></tr></thead><tbody><tr><td>HIE-CM</td></tr></tbody></table>'),
  );
  assert.match(md, /\| Gateway\s+\|/);
  assert.match(md, /\| HIE-CM\s+\|/);
});

test('htmlToMarkdown returns null when the build carries no content container', () => {
  assert.strictEqual(htmlToMarkdown('<html><body><div id="other">x</div></body></html>'), null);
});

test('htmlToMarkdown puts a mermaid diagram back under its heading', () => {
  const src = [
    '## The whole path',
    '',
    '```mermaid',
    'sequenceDiagram',
    '    HIU->>GW: request',
    '```',
    '',
    '## Stage 1',
  ].join('\n');
  // Docusaurus renders mermaid in the browser, so the built HTML has nothing
  // between the two headings.
  const md = htmlToMarkdown(page('<h2>The whole path</h2><h2>Stage 1</h2>'), src);
  assert.match(md, /## The whole path\n\n```mermaid\nsequenceDiagram\n {4}HIU->>GW: request\n```/);
  assert.match(md, /## Stage 1/);
});

test('htmlToMarkdown keeps a diagram whose heading did not survive conversion', () => {
  const src = '## Gone\n\n```mermaid\ngraph TD\n```\n';
  const md = htmlToMarkdown(page('<p>No headings here.</p>'), src);
  assert.match(md, /```mermaid\ngraph TD\n```/);
});
