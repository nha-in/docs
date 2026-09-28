// Copies the catalogue's OpenAPI files into the site's static
// directory, where each endpoint page offers them to download. The catalogue is the only
// place specs are edited; site/static/specs is a build output.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { parse } from "yaml";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listSpecs } from "./specs.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "site", "static", "specs");

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

// The catalogue nests specs by gateway and version; the site serves them flat,
// so they are copied by file name. That makes the file name the site wide
// identity of a specification: it is the served path (/specs/<name>) and the
// old /reference/<stem> route that redirects to its module. Two gateways using one name would silently serve one
// specification in both places, so the clash is refused here rather than
// discovered by a reader looking at the wrong API.
const specs = listSpecs();
const byName = new Map();
for (const spec of specs) {
  const seen = byName.get(spec.name);
  if (seen) {
    console.error(
      [
        "",
        `Two specifications are both named ${spec.name}:`,
        `  ${seen.path.slice(root.length + 1)}`,
        `  ${spec.path.slice(root.length + 1)}`,
        "",
        "A specification's file name is its download path (/specs/<name>) across",
        "the whole site, so it has to be unique. Prefix it with its gateway,",
        `for example ${spec.path.split("/").slice(-3, -2)[0]}-${spec.name}.`,
        "",
      ].join("\n"),
    );
    process.exit(1);
  }
  byName.set(spec.name, spec);
  cpSync(spec.path, join(dest, spec.name));
  // A JSON copy beside each YAML one, so an endpoint page offers both. The
  // pages are static, so the conversion happens here, once.
  if (/\.ya?ml$/.test(spec.name)) {
    const doc = parse(readFileSync(spec.path, "utf8"));
    writeFileSync(join(dest, spec.name.replace(/\.ya?ml$/, ".json")), `${JSON.stringify(doc, null, 2)}\n`);
  }
}
console.log(
  `Synced ${specs.length} spec(s) to site/static/specs: ${specs.map((s) => s.name).join(", ")}`,
);
