// Copies the catalogue's OpenAPI files into the site's static
// directory so the Scalar plugin can serve them. The catalogue is the only
// place specs are edited; site/static/specs is a build output.
import { cpSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { listSpecs } from "./specs.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dest = join(root, "site", "static", "specs");

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

// The catalogue nests specs by gateway and version; the site serves them flat,
// so they are copied by file name.
const specs = listSpecs();
for (const spec of specs) {
  cpSync(spec.path, join(dest, spec.name));
}
console.log(
  `Synced ${specs.length} spec(s) to site/static/specs: ${specs.map((s) => s.name).join(", ")}`,
);

// Vendor the Scalar API reference browser bundle so the site loads it from
// our own origin instead of cdn.jsdelivr.net. Self-hosted means no runtime
// dependency on any third-party CDN.
const scalarSrc = join(root, "node_modules", "@scalar", "api-reference", "dist", "browser");
const scalarDest = join(root, "site", "static", "vendor", "scalar");
rmSync(scalarDest, { recursive: true, force: true });
mkdirSync(scalarDest, { recursive: true });
cpSync(scalarSrc, scalarDest, { recursive: true });
console.log("Vendored @scalar/api-reference browser bundle to site/static/vendor/scalar");
