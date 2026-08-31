// Generates catalogue/atom-routes.json: for every atom, the published docs
// page a support answer should link to, and the section anchor within it.
//
// Why this exists. An atom is authored before the site is built, and atoms
// are not published one to one as pages, so an atom cannot carry a route of
// its own without guessing. The site is the thing that assigns routes, so
// the routes are derived here, from what the site actually publishes, and
// written to a file the indexer reads. No atom is ever edited.
//
// Priority order, first match wins:
//   0. A page claims the atom in its own `covers:` frontmatter key.
//   1. Endpoint and callback atoms pair with the generated API page built
//      from the same spec operation.
//   2. Error codes and glossary terms are found in a rendered page, and the
//      heading above the hit becomes the anchor.
//   3. Flow atoms match a numbered journey on their module's journey page.
//
// Every result is then checked against the built sitemap, because a file
// under site/docs does not mean a route exists. Run after `npm run build`
// for that check; without a build it is skipped and the run says so.
//
//   node scripts/build-atom-routes.mjs           write the file
//   node scripts/build-atom-routes.mjs --check   fail if it is out of date
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from "node:fs";
import { join, relative, extname, basename, dirname } from "node:path";
import { parse } from "yaml";
import { loadAtoms, root } from "./lib/atoms.mjs";

const check = process.argv.includes("--check");
const docsRoot = join(root, "site", "docs");
const outFile = join(root, "catalogue", "atom-routes.json");
const sitemap = join(root, "site", "build", "sitemap.xml");

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// The atom writes <ABHA_NUMBER> where the spec writes {abhaNumber}.
const normPath = (p) =>
  decodeURIComponent(p).replace(/\{[^}]+\}/g, "*").replace(/<[^>]+>/g, "*").replace(/\/$/, "");

function walk(dir, out = []) {
  for (const e of readdirSync(dir)) {
    if (e.startsWith(".")) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) walk(p, out);
    else if ([".md", ".mdx"].includes(extname(e))) out.push(p);
  }
  return out;
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return {};
  try { return parse(m[1]) ?? {}; } catch { return {}; }
}

// ---------- Pages ----------
const files = walk(docsRoot);
const rawByPath = new Map(files.map((f) => [f, readFileSync(f, "utf8")]));

// A glossary term lives in a partial that a real page imports, so a page's
// searchable text includes what it pulls in.
function bodyWithImports(file, depth = 0) {
  let text = rawByPath.get(file) ?? "";
  if (depth > 2) return text;
  for (const m of text.matchAll(/from\s+'@site\/(docs\/[^']+)'/g)) {
    const target = join(root, "site", m[1]);
    if (rawByPath.has(target)) text += "\n" + bodyWithImports(target, depth + 1);
  }
  return text;
}

const isPartial = (f) =>
  relative(docsRoot, f).split("/").some((s) => s.startsWith("_"));

const pages = files.filter((f) => !isPartial(f)).map((f) => {
  let route = "/docs/" + relative(docsRoot, f).replace(/\.mdx?$/, "");
  const b = basename(route);
  if (b === "index" || b === "README") route = dirname(route);
  return { route, body: bodyWithImports(f), fm: frontmatter(rawByPath.get(f)) };
});

// The last "## heading" at or before the hit. Headings are collected from the
// whole body: slicing first can cut a heading line in half and yield a
// truncated anchor that does not exist on the rendered page.
function headingFor(body, needle) {
  const i = body.toLowerCase().indexOf(needle.toLowerCase());
  if (i < 0) return null;
  let best = null;
  for (const m of body.matchAll(/^##\s+(.+)$/gm)) {
    if (m.index > i) break;
    best = m[1].trim();
  }
  return best;
}

// ---------- What the site actually publishes ----------
let published = null;
if (existsSync(sitemap)) {
  published = new Set(
    [...readFileSync(sitemap, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => new URL(m[1]).pathname.replace(/\/$/, "")));
}
const isPublished = (route) => !published || published.has(route.replace(/\/$/, ""));

// ---------- Rule 0: a page claims the atom ----------
const claimed = new Map();
for (const p of pages) {
  const covers = p.fm.covers;
  if (!covers) continue;
  for (const id of [].concat(covers)) claimed.set(String(id).trim(), p);
}

// ---------- Rule 1: same spec operation ----------
const apiPageByOperation = new Map();
for (const p of pages) {
  const m = p.body.match(/@site\/src\/data\/api\/([^']+)\.json/);
  if (m) apiPageByOperation.set(m[1], p.route);
}
const apiPageByMethodPath = new Map();
for (const [name, route] of apiPageByOperation) {
  const jf = join(root, "site", "src", "data", "api", `${name}.json`);
  if (!existsSync(jf)) continue;
  try {
    const op = JSON.parse(readFileSync(jf, "utf8"));
    const method = String(op.method ?? op.httpMethod ?? "").toUpperCase();
    const path = op.path ?? op.url ?? "";
    if (method && path) apiPageByMethodPath.set(`${method} ${normPath(path)}`, route);
  } catch {}
}

const pageAt = (re) => pages.find((p) => re.test(p.route));
const callbacksPage = pageAt(/\/reference\/callbacks$/);
const errorsPage = pageAt(/\/reference\/error-codes$/);
const glossaryPage = pageAt(/glossary$/);

function requestKey(body) {
  const m = body.match(/curl\s+(?:-X\s+(GET|POST|PUT|PATCH|DELETE)\s+)?'?"?(https?:\/\/[^'"\s]+)/i);
  if (!m) return null;
  try { return { method: (m[1] ?? "GET").toUpperCase(), path: normPath(new URL(m[2]).pathname) }; }
  catch { return null; }
}

// Path alone is not safe: M2 HIP and M3 HIU both expose
// /health-information/notify, so this can land on the wrong module's page.
// Only ever a fallback behind operation identity, and flagged when used.
function joinByMethodPath(k) {
  if (!k) return null;
  const exact = apiPageByMethodPath.get(`${k.method} ${k.path}`);
  if (exact) return exact;
  for (const [key, route] of apiPageByMethodPath) {
    const sp = key.indexOf(" ");
    const method = key.slice(0, sp), path = key.slice(sp + 1);
    if (method === k.method && (path.endsWith(k.path) || k.path.endsWith(path))) return route;
  }
  return null;
}

// ---------- Resolve ----------
const { atoms, problems } = loadAtoms();
if (problems.length) {
  for (const p of problems) console.error(`${p.file}: ${p.msg}`);
  process.exit(1);
}

const rows = [];
for (const [id, atom] of atoms) {
  const { fm, body, file } = atom;
  const type = fm.type;
  const title = String(fm.title ?? "");
  let route = null, anchor = null, rule = null, confidence = null;

  const claim = claimed.get(id);
  if (claim) {
    const subject = title.split(",")[0].trim();
    const h = headingFor(claim.body, subject)
           ?? headingFor(claim.body, id.split(".").pop().replace(/-/g, " "));
    route = claim.route; anchor = h ? slug(h) : null;
    rule = `claimed by ${basename(claim.route)}`; confidence = "derived";
  }

  if (!route && (type === "endpoint" || type === "callback")) {
    const stem = basename(file).replace(/\.md$/, "");
    const byOperation = apiPageByOperation.has(stem) ? apiPageByOperation.get(stem) : null;
    if (byOperation) {
      route = byOperation; rule = "same spec operation as the generated API page";
      confidence = "derived";
    } else {
      const viaPath = joinByMethodPath(requestKey(body));
      if (viaPath) {
        route = viaPath; rule = "method and path join, module unconfirmed";
        confidence = "needs review";
      } else if (type === "callback" && callbacksPage) {
        // A callback atom describes a call it receives, so it has no cURL.
        // The inbound path is named in the prose instead.
        const paths = [...body.matchAll(/`(\/(?:v0\.5|api\/v3|api-hiu)\/[^`]+)`/g)].map((m) => m[1]);
        const hit = paths.find((p) => callbacksPage.body.includes(p));
        if (hit) {
          const h = headingFor(callbacksPage.body, hit);
          route = callbacksPage.route; anchor = h ? slug(h) : null;
          rule = `inbound path listed on the callbacks page`; confidence = "derived";
        }
      }
    }
  }

  if (!route && type === "error") {
    const raw = (id.match(/\.([a-z]*-?\d+)$/) ?? [])[1];
    const code = raw ? raw.toUpperCase().replace(/^([A-Z]+)(\d)/, "$1-$2") : null;
    if (code && errorsPage?.body.toUpperCase().includes(code)) {
      const h = headingFor(errorsPage.body, code);
      route = errorsPage.route; anchor = h ? slug(h) : null;
      rule = `error code listed on the error codes page`; confidence = "derived";
    }
  }

  if (!route && type === "glossary") {
    const term = title.split(",")[0].trim();
    // The glossary first, then reference and getting started, because header
    // terms like X-CM-ID are defined where they are used, not in the list.
    const candidates = [glossaryPage, ...pages.filter((p) => /\/reference\/|\/getting-started\//.test(p.route))]
      .filter(Boolean);
    const page = candidates.find((p) => p.body.toLowerCase().includes(term.toLowerCase()));
    if (page) {
      const h = headingFor(page.body, term);
      route = page.route; anchor = h ? slug(h) : null;
      rule = `term defined on ${basename(page.route)}`; confidence = "derived";
    }
  }

  if (!route && type === "flow") {
    const mod = (id.match(/\.(m\d)-/) ?? [])[1];
    const jp = pages.find((p) => new RegExp(`/api/${mod}/user-journey$`).test(p.route));
    if (jp) {
      const words = id.split(".").pop().replace(/^m\d-/, "").split("-").filter((w) => w.length > 2);
      let best = null, bestScore = 0;
      for (const m of jp.body.matchAll(/^##\s+(.+)$/gm)) {
        const h = m[1].trim(), hs = slug(h);
        const score = words.filter((w) => hs.includes(w)).length;
        if (score > bestScore) { bestScore = score; best = h; }
      }
      if (best && bestScore >= 2) {
        route = jp.route; anchor = slug(best);
        rule = `journey on the ${mod.toUpperCase()} user journey page`; confidence = "derived";
      }
    }
  }

  // A route the site does not serve is not a route.
  if (route && !isPublished(route)) {
    rule = `resolved to ${route}, which the site does not publish`;
    route = null; anchor = null; confidence = null;
  }

  rows.push({
    atom: id, type,
    route, anchor,
    link: route ? route + (anchor ? `#${anchor}` : "") : null,
    rule: rule ?? "no rule matched",
    confidence: confidence ?? "unmapped",
  });
}

rows.sort((a, b) => a.atom.localeCompare(b.atom));

const mapped = rows.filter((r) => r.route).length;
const derived = rows.filter((r) => r.confidence === "derived").length;
const payload = JSON.stringify({
  note: "Generated by scripts/build-atom-routes.mjs. Do not edit by hand. An atom never carries a route; a page may claim one with covers:.",
  atoms: rows.length, mapped, derived,
  validatedAgainstBuild: Boolean(published),
  routes: rows,
}, null, 2) + "\n";

if (check) {
  const current = existsSync(outFile) ? readFileSync(outFile, "utf8") : "";
  if (current !== payload) {
    console.error("catalogue/atom-routes.json is out of date. Run: node scripts/build-atom-routes.mjs");
    process.exit(1);
  }
  if (!published) {
    console.error("No site build found, so routes were not validated. Run npm run build first.");
    process.exit(1);
  }
  console.log(`atom-routes.json is current: ${mapped}/${rows.length} atoms mapped, validated against the build.`);
} else {
  writeFileSync(outFile, payload);
  console.log(`${rows.length} atoms, ${mapped} mapped (${derived} with no human involvement)`);
  console.log(published
    ? `validated against ${published.size} published routes`
    : "no site build found, routes NOT validated. Run npm run build, then rerun.");
  const unmapped = rows.filter((r) => !r.route);
  if (unmapped.length) {
    console.log(`\n${unmapped.length} atom(s) with no page:`);
    for (const r of unmapped) console.log(`  ${r.atom}: ${r.rule}`);
  }
  const review = rows.filter((r) => r.confidence === "needs review");
  if (review.length) {
    console.log(`\n${review.length} mapped by a rule that needs a human check:`);
    for (const r of review) console.log(`  ${r.atom} -> ${r.link}`);
  }
}
