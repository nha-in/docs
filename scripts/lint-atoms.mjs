// Mechanised checks over the Catalogue's atoms. Everything here is a rule the
// plan states, turned into something CI can fail on. An atom that passes this
// is well formed; whether it is honest is still a reviewer's job.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const catalogue = join(root, "catalogue");

const TYPES = ["concept", "flow", "endpoint", "callback", "error", "test",
               "decision", "glossary", "fhir", "sandbox"];
const GATEWAYS = ["hiecm", "uhi", "shared"];
const STATUSES = ["draft", "unverified", "verified", "stale"];
const SECTIONS = ["In plain words", "Before you start", "What happens",
                  "How you know it worked", "When it goes wrong"];
// Folder name per type, so an atom cannot claim a type it is not filed under.
const FOLDER = {
  concept: "concepts", flow: "flows", endpoint: "endpoints",
  callback: "callbacks", error: "errors", test: "tests",
  decision: "decisions", glossary: "glossary", fhir: "fhir", sandbox: "sandbox",
};

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "openapi") continue;
      out.push(...walk(p));
    } else if (
      name.endsWith(".md") &&
      name !== "CONVENTIONS.md" &&
      // The catalogue root README documents the tree and is not an atom.
      // The Go indexer skips it the same way (mcp/cmd/indexer).
      !(name === "README.md" && dir.endsWith("catalogue"))
    ) {
      out.push(p);
    }
  }
  return out;
}

const files = walk(catalogue);
const problems = [];
const atoms = new Map();

function fail(file, msg) {
  problems.push(`${relative(root, file)}: ${msg}`);
}

// Pass one: parse and record ids, so the link check has everything to resolve.
for (const file of files) {
  const raw = readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) { fail(file, "no frontmatter block"); continue; }
  let fm;
  try { fm = parse(m[1]); } catch (e) { fail(file, `frontmatter is not valid YAML: ${e.message}`); continue; }
  atoms.set(fm?.id, { file, fm, body: m[2], raw });
}

for (const [id, atom] of atoms) {
  const { file, fm, body, raw } = atom;

  for (const field of ["id", "type", "gateway", "milestone", "version", "title", "summary", "sources", "verified", "related"]) {
    if (fm[field] === undefined) fail(file, `missing mandatory field: ${field}`);
  }
  if (!id) continue;

  if (!TYPES.includes(fm.type)) fail(file, `type must be one of ${TYPES.join(", ")}`);
  if (fm.gateway === "nhcx") fail(file, "gateway nhcx is out of scope and rejected by design");
  else if (!GATEWAYS.includes(fm.gateway)) fail(file, `gateway must be one of ${GATEWAYS.join(", ")}`);

  // id is gateway.type.slug, lowercase, and must match where the file lives.
  if (!/^[a-z0-9]+\.[a-z]+\.[a-z0-9-]+$/.test(id)) fail(file, `id "${id}" is not gateway.type.slug in lowercase`);
  else {
    const [g, t] = id.split(".");
    if (g !== fm.gateway) fail(file, `id says gateway "${g}" but frontmatter says "${fm.gateway}"`);
    if (t !== fm.type) fail(file, `id says type "${t}" but frontmatter says "${fm.type}"`);
    if (FOLDER[fm.type] && !file.includes(`/${FOLDER[fm.type]}/`)) {
      fail(file, `type ${fm.type} must live in a ${FOLDER[fm.type]}/ folder`);
    }
  }

  if (fm.gateway === "shared" && fm.milestone !== "n/a") fail(file, "shared atoms take milestone: n/a");

  if (!Array.isArray(fm.sources) || fm.sources.length === 0) fail(file, "sources must list at least one entry");
  else fm.sources.forEach((s, i) => {
    if (!s?.url && !s?.file) fail(file, `sources[${i}] needs a url or a file`);
    if (!s?.status && !s?.hash) fail(file, `sources[${i}] needs a status or a hash`);
  });

  const v = fm.verified ?? {};
  if (!STATUSES.includes(v.status)) fail(file, `verified.status must be one of ${STATUSES.join(", ")}`);
  if (v.status === "verified") {
    for (const f of ["against", "on", "by"]) {
      if (!v[f]) fail(file, `verified.status is verified, so verified.${f} is required. Never claim verification you did not observe.`);
    }
  }

  // The five sections, present and in order.
  const headings = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((h) => h[1]);
  const found = SECTIONS.map((s) => headings.indexOf(s));
  SECTIONS.forEach((s, i) => { if (found[i] === -1) fail(file, `missing mandatory section: ## ${s}`); });
  if (found.every((i) => i !== -1)) {
    for (let i = 1; i < found.length; i++) {
      if (found[i] < found[i - 1]) { fail(file, `sections are out of order at "## ${SECTIONS[i]}"`); break; }
    }
  }

  if (raw.includes("—")) fail(file, "em dash found. Use a full stop, a comma or a colon.");

  // Relative links in the body must point at a file that exists. A dead link
  // in an atom sends the reader hunting for something we already wrote.
  for (const m of body.matchAll(/\]\((\.[^)]+?\.md)\)/g)) {
    const target = join(dirname(file), m[1]);
    try { statSync(target); } catch { fail(file, `link points at "${m[1]}", which does not exist`); }
  }

  for (const [kind, ids] of Object.entries(fm.related ?? {})) {
    for (const ref of ids ?? []) {
      if (!atoms.has(ref)) fail(file, `related.${kind} points at "${ref}", which no atom defines`);
    }
  }
}

const byType = {};
for (const a of atoms.values()) byType[a.fm?.type] = (byType[a.fm?.type] ?? 0) + 1;
const byStatus = {};
for (const a of atoms.values()) byStatus[a.fm?.verified?.status] = (byStatus[a.fm?.verified?.status] ?? 0) + 1;

console.log(`${atoms.size} atoms`);
console.log("  by type:  " + Object.entries(byType).map(([k, v]) => `${k} ${v}`).join(", "));
console.log("  by status: " + Object.entries(byStatus).map(([k, v]) => `${k} ${v}`).join(", "));

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`);
  for (const p of problems) console.error("  " + p);
  process.exit(1);
}
console.log("\nAll atom rules pass.");
