// Renders the built site and fails on tables whose content does not fit.
//
// Why a real browser: only a layout engine knows how wide a rendered cell is.
// Every previous attempt to reason about this from the stylesheet alone, or
// from guessed column widths, shipped a table that broke somewhere else.
//
// Two symptoms, both of which have actually shipped:
//
//   overflow  content wider than the cell holding it, so it runs into the
//             column beside it. Caused by pinning a column to a constant.
//
//   split     a word broken across lines when it would have fitted on one,
//             "Consen / t / artefact". Caused by letting a column size below
//             its own longest word.
//
// Runs against site/build, so it checks what ships rather than what the dev
// server happens to render.
import {createServer} from 'node:http';
import {readFile, stat} from 'node:fs/promises';
import {join, extname, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const buildDir = join(root, 'site', 'build');

// Widths worth checking: the desktop the tables were designed against, and a
// laptop narrow enough that the bleed has nothing to reach into.
const VIEWPORTS = [
  {name: 'desktop', width: 1440, height: 900},
  {name: 'laptop', width: 1280, height: 800},
];

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.ico': 'image/x-icon', '.woff2': 'font/woff2',
  '.yaml': 'text/yaml', '.map': 'application/json',
};

async function serve() {
  const server = createServer(async (req, res) => {
    try {
      const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
      let file = join(buildDir, url);
      const found = await stat(file).catch(() => null);
      if (!found || found.isDirectory()) file = join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, {'Content-Type': MIME[extname(file)] ?? 'application/octet-stream'});
      res.end(body);
    } catch {
      res.writeHead(404).end('not found');
    }
  });
  await new Promise((resolve) => server.listen(0, resolve));
  return {server, port: server.address().port};
}

/** Every built page that contains a table, as routes. */
async function pagesWithTables() {
  const {globby} = await import('globby').catch(() => ({globby: null}));
  let files;
  if (globby) {
    files = await globby('**/index.html', {cwd: buildDir});
  } else {
    const {readdirSync, statSync} = await import('node:fs');
    files = [];
    const walk = (dir, base = '') => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full, `${base}${name}/`);
        else if (name === 'index.html') files.push(`${base}${name}`);
      }
    };
    walk(buildDir);
  }
  const withTables = [];
  for (const file of files) {
    const html = await readFile(join(buildDir, file), 'utf8');
    if (html.includes('<table')) withTables.push('/' + file.replace(/index\.html$/, ''));
  }
  return withTables;
}

/** Runs inside the page. Returns one entry per offending cell. */
const AUDIT = () => {
  const problems = [];
  for (const table of document.querySelectorAll('.markdown table')) {
    const caption = (table.querySelector('th')?.textContent ?? '').trim().slice(0, 30);
    for (const cell of table.querySelectorAll('td, th')) {
      // 1. Does anything inside the cell stick out of it?
      //    scrollWidth rounds, so a pixel of slack avoids false alarms on
      //    sub-pixel layout.
      if (cell.scrollWidth > cell.clientWidth + 1) {
        problems.push({
          kind: 'overflow', table: caption,
          text: cell.textContent.trim().slice(0, 44),
          by: cell.scrollWidth - cell.clientWidth,
        });
      }
      // 2. Is a word split across lines when it need not be? A word laid out
      //    over two line boxes has client rects at two different tops.
      for (const node of [...cell.childNodes].filter((n) => n.nodeType === 3)) {
        const words = /[A-Za-z]{4,}/g;
        let match;
        while ((match = words.exec(node.textContent))) {
          const range = document.createRange();
          range.setStart(node, match.index);
          range.setEnd(node, match.index + match[0].length);
          const tops = new Set([...range.getClientRects()].map((r) => Math.round(r.top)));
          if (tops.size > 1) {
            problems.push({kind: 'split', table: caption, text: match[0]});
          }
        }
      }
    }
  }
  return problems;
};

const {chromium} = await import('playwright').catch(() => ({chromium: null}));
if (!chromium) {
  console.error('playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
}

const {server, port} = await serve();
const routes = await pagesWithTables();
console.log(`${routes.length} built page(s) contain a table`);

const browser = await chromium.launch();
const failures = [];
let cellsChecked = 0;

for (const viewport of VIEWPORTS) {
  const page = await browser.newPage({viewport: {width: viewport.width, height: viewport.height}});
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:${port}${route}`, {waitUntil: 'load'});
    const problems = await page.evaluate(AUDIT);
    cellsChecked += await page.evaluate(
      () => document.querySelectorAll('.markdown table td, .markdown table th').length,
    );
    for (const problem of problems) failures.push({...problem, route, viewport: viewport.name});
  }
  await page.close();
}

await browser.close();
server.close();

console.log(`${cellsChecked} table cell(s) checked across ${VIEWPORTS.length} viewport(s)`);

if (failures.length) {
  // One line per distinct problem: the same table repeated at two viewports
  // is one thing to fix, not two.
  const seen = new Map();
  for (const f of failures) {
    const key = `${f.route}|${f.kind}|${f.text}`;
    if (!seen.has(key)) seen.set(key, f);
  }
  console.error(`\n${seen.size} table layout problem(s):`);
  for (const f of [...seen.values()].slice(0, 25)) {
    console.error(
      f.kind === 'overflow'
        ? `  overflow by ${f.by}px  ${f.route}  "${f.text}"`
        : `  word split       ${f.route}  "${f.text}"`,
    );
  }
  if (seen.size > 25) console.error(`  ... and ${seen.size - 25} more`);
  process.exit(1);
}

console.log('\nEvery table cell holds its content, and no word is split that could fit.');
