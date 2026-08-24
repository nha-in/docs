// Copies the catalogue's OpenAPI/AsyncAPI files into the site's static
// directory so the Scalar plugin can serve them. The catalogue is the only
// place specs are edited; site/static/specs is a build output.
import { cpSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "catalogue", "openapi");
const dest = join(root, "site", "static", "specs");

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

const specs = readdirSync(src).filter((f) => f.endsWith(".yaml") || f.endsWith(".json"));
for (const f of specs) {
  cpSync(join(src, f), join(dest, f));
}
console.log(`Synced ${specs.length} spec(s) to site/static/specs: ${specs.join(", ")}`);

// Vendor the Scalar API reference browser bundle so the site loads it from
// our own origin instead of cdn.jsdelivr.net. Self-hosted means no runtime
// dependency on any third-party CDN.
const scalarSrc = join(root, "node_modules", "@scalar", "api-reference", "dist", "browser");
const scalarDest = join(root, "site", "static", "vendor", "scalar");
rmSync(scalarDest, { recursive: true, force: true });
mkdirSync(scalarDest, { recursive: true });
cpSync(scalarSrc, scalarDest, { recursive: true });
console.log("Vendored @scalar/api-reference browser bundle to site/static/vendor/scalar");
