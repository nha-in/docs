// Source freshness check. When NHA updates a raw source file, the catalogue
// must notice. This script hashes everything under catalogue/openapi/.raw/,
// collects every source reference the catalogue has recorded (a spec's
// x-abdm-sources list, an atom's frontmatter sources list), and reports:
//
//   MISMATCH  a recorded sha256 differs from the current .raw hash. The
//             source changed under us; every consumer that recorded the old
//             hash is listed. CI fails on this.
//   MISSING   a recorded file exists nowhere under .raw/. A warning, not a
//             failure: some sources (websites, packs never stored) are
//             legitimately absent.
//   UNHASHED  a reference recorded with a status instead of a hash.
//             Coverage debt, counted only.
//
// Output is one line per finding, prefixed with the bucket name, so it greps.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";
import { parse } from "yaml";
import { loadAtoms, root } from "./lib/atoms.mjs";

const rawDir = join(root, "catalogue", "openapi", ".raw");
const openapiDir = join(root, "catalogue", "openapi");

// ---------------------------------------------------------------- raw hashes
// Map: path relative to .raw/ (posix separators) -> sha256 hex.
function walkFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walkFiles(p));
    else out.push(p);
  }
  return out;
}

const rawHashes = new Map();
for (const file of walkFiles(rawDir)) {
  const rel = relative(rawDir, file).split(sep).join("/");
  if (rel === ".gitkeep") continue;
  rawHashes.set(rel, createHash("sha256").update(readFileSync(file)).digest("hex"));
}

// ------------------------------------------------------- recorded references
// Every reference is { file, hash|status, consumer }. `file` values are
// relative names such as "ABDM Sandbox/ABDM/M1 ABHA Collection.postman_
// collection.json" or "catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml";
// they are matched to .raw contents by path suffix. Entries carrying only a
// url record a source that was never stored as a file; nothing to hash.
const refs = [];
let urlOnly = 0;

function record(entry, consumer) {
  if (!entry || typeof entry !== "object") return;
  if (!entry.file) { if (entry.url) urlOnly += 1; return; }
  const hash = entry.hash ?? entry.sha256;
  refs.push({ file: String(entry.file), hash, status: entry.status, consumer });
}

// Specs: same glob the spec linter uses, catalogue/openapi/*/*/*.yaml.
for (const gateway of readdirSync(openapiDir)) {
  const gdir = join(openapiDir, gateway);
  if (gateway.startsWith(".") || !statSync(gdir).isDirectory()) continue;
  for (const version of readdirSync(gdir)) {
    const vdir = join(gdir, version);
    if (!statSync(vdir).isDirectory()) continue;
    for (const name of readdirSync(vdir)) {
      if (!name.endsWith(".yaml")) continue;
      const specPath = join(vdir, name);
      let doc;
      try { doc = parse(readFileSync(specPath, "utf8")); }
      catch (e) {
        console.error(`ERROR ${relative(root, specPath)} is not parseable YAML: ${e.message}`);
        process.exitCode = 1;
        continue;
      }
      for (const entry of doc?.["x-abdm-sources"] ?? []) {
        record(entry, relative(root, specPath));
      }
    }
  }
}

// Atoms: frontmatter `sources:` lists, via the shared loader.
const { atoms, problems } = loadAtoms();
for (const { file, msg } of problems) {
  console.error(`ERROR ${relative(root, file)}: ${msg}`);
  process.exitCode = 1;
}
for (const { file, fm } of atoms.values()) {
  for (const entry of fm?.sources ?? []) record(entry, relative(root, file));
}

// ------------------------------------------------------------ suffix matching
// A recorded file matches a raw file when their path segments agree from the
// end: "ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json" matches
// .raw's "M1 ABHA Collection.postman_collection.json", and a recorded
// "catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml" matches .raw's
// "ABDM_M1_API_Swagger.yaml". With several candidates the longest shared
// segment suffix wins.
function sharedSuffix(a, b) {
  const as = a.split("/").filter(Boolean);
  const bs = b.split("/").filter(Boolean);
  let n = 0;
  while (n < as.length && n < bs.length &&
         as[as.length - 1 - n] === bs[bs.length - 1 - n]) n += 1;
  return n;
}

function findRaw(recorded) {
  const rec = recorded.replace(/\\/g, "/");
  let best = null;
  let bestLen = 0;
  for (const rel of rawHashes.keys()) {
    const n = sharedSuffix(rec, rel);
    // The whole raw path must be inside the shared suffix, or the whole
    // recorded path must be; a bare basename match also counts.
    const ok = n > 0 && (n === rel.split("/").length ||
                         n === rec.split("/").filter(Boolean).length ||
                         basename(rec) === basename(rel));
    if (ok && n > bestLen) { best = rel; bestLen = n; }
  }
  return best;
}

// ------------------------------------------------------------------- buckets
const mismatches = [];             // { raw, recordedHex, currentHex, consumer }
const missing = new Map();         // recorded file -> Set of consumers
let unhashed = 0;

for (const ref of refs) {
  const raw = findRaw(ref.file);
  if (!raw) {
    if (!missing.has(ref.file)) missing.set(ref.file, new Set());
    missing.get(ref.file).add(ref.consumer);
    if (!ref.hash) unhashed += 1;
    continue;
  }
  if (!ref.hash) { unhashed += 1; continue; }
  const recordedHex = String(ref.hash).replace(/^sha256:/, "").toLowerCase();
  const currentHex = rawHashes.get(raw);
  if (recordedHex !== currentHex) {
    mismatches.push({ raw, recordedHex, currentHex, consumer: ref.consumer });
  }
}

// -------------------------------------------------------------------- report
const short = (hex) => hex.slice(0, 12);

for (const m of mismatches) {
  console.log(`MISMATCH catalogue/openapi/.raw/${m.raw} recorded sha256:${short(m.recordedHex)}... current sha256:${short(m.currentHex)}... by ${m.consumer}`);
}
for (const [file, consumers] of missing) {
  // A recorded source can be an in-repo document (a conventions file, a site
  // page) rather than a stored upstream file; say so instead of implying loss.
  let where = "not under .raw/";
  try { statSync(join(root, file)); where = "in the repo but not under .raw/"; } catch {}
  console.log(`MISSING ${file} ${where} (recorded by ${consumers.size} consumer${consumers.size === 1 ? "" : "s"}: ${[...consumers].slice(0, 3).join(", ")}${consumers.size > 3 ? ", ..." : ""})`);
}
if (unhashed > 0) {
  console.log(`UNHASHED ${unhashed} source reference${unhashed === 1 ? "" : "s"} carry a status instead of a hash (coverage debt)`);
}

console.log(`SUMMARY ${rawHashes.size} raw files, ${refs.length} recorded references (${urlOnly} url-only skipped), ${mismatches.length} mismatch, ${missing.size} missing file${missing.size === 1 ? "" : "s"}, ${unhashed} unhashed`);

if (mismatches.length > 0) {
  console.error(`FAIL a raw source changed under the catalogue; re-derive the consumers listed above or update their recorded hashes`);
  process.exitCode = 1;
} else {
  console.log("OK no recorded hash disagrees with the current .raw contents");
}
