// Shared atom loader. Walks the Catalogue, parses frontmatter, and hands back
// a Map keyed by atom id. Used by the linter and the skill compiler so both
// read atoms the same way.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

export const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
export const catalogueDir = join(root, "catalogue");

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

// Returns { atoms: Map<id, {file, fm, body, raw}>, problems: {file, msg}[] }.
// A problem here means the atom could not be parsed at all; callers decide
// whether that is fatal.
export function loadAtoms(dir = catalogueDir) {
  const atoms = new Map();
  const problems = [];
  for (const file of walk(dir)) {
    const raw = readFileSync(file, "utf8");
    const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!m) { problems.push({ file, msg: "no frontmatter block" }); continue; }
    let fm;
    try { fm = parse(m[1]); } catch (e) { problems.push({ file, msg: `frontmatter is not valid YAML: ${e.message}` }); continue; }
    atoms.set(fm?.id, { file, fm, body: m[2], raw });
  }
  return { atoms, problems };
}

// Pulls the text under a "## Heading" up to the next "## " heading, or end
// of body if it is the last section.
export function section(body, heading) {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => l.trim() === `## ${heading}`);
  if (start === -1) return "";
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((l) => /^##\s/.test(l));
  return (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();
}
