// One self-contained script, no framework required on the host page.
// Preact rather than React: the same source, a tenth of the bytes, and this
// file ships to pages that did not ask for a UI runtime.
import {cpSync, mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';
import {build} from 'esbuild';

const dev = process.argv.includes('--dev');
const require = createRequire(import.meta.url);

const out =
  process.env.WIDGET_OUT ??
  join(import.meta.dirname, 'dist/abdm-support-agent.js');

await build({
  entryPoints: [join(import.meta.dirname, 'src/index.tsx')],
  bundle: true,
  format: 'iife',
  target: ['es2022'],
  minify: !dev,
  sourcemap: dev,
  jsx: 'automatic',
  jsxImportSource: 'preact',
  loader: {'.css': 'text'},
  // Relative to the caller, so the docs site can drop it straight into its
  // static tree without knowing where this package lives.
  outfile: out,
});

// The readers that turn a PDF or a screenshot into text, copied beside the
// widget rather than bundled into it.
//
// They are large and most readers never attach either, so the widget loads
// them from its own directory the first time one is needed. Copied from the
// installed packages rather than fetched from a CDN at runtime: a health
// documentation site should not depend on somebody else's host being up, and
// the language data has to come from an origin we control anyway.
const vendor = join(dirname(out), 'vendor');
mkdirSync(join(vendor, 'lang'), {recursive: true});

const copy = (from, to) => cpSync(from, join(vendor, to ?? from.split('/').pop()));
const pkg = (name, file) => join(dirname(require.resolve(name + '/package.json')), file);

// pdf.js reads the text layer a PDF already carries. Its worker is a
// separate file by design; the main build refuses to run without one.
copy(pkg('pdfjs-dist', 'build/pdf.min.mjs'));
copy(pkg('pdfjs-dist', 'build/pdf.worker.min.mjs'));

// Tesseract for an image, which carries no text layer at all. The core comes
// in three builds, relaxed SIMD, SIMD and plain, because the library picks by
// what the browser turns out to support, and it fetches the one it picked by
// name. Only the LSTM cores are copied: they are the ones a v4 language file
// needs, and the legacy pair alongside them would double the bytes served for
// an engine this never asks for.
copy(pkg('tesseract.js', 'dist/tesseract.min.js'));
copy(pkg('tesseract.js', 'dist/worker.min.js'));
for (const variant of ['relaxedsimd-lstm', 'simd-lstm', 'lstm']) {
  copy(pkg('tesseract.js-core', `tesseract-core-${variant}.wasm.js`));
  copy(pkg('tesseract.js-core', `tesseract-core-${variant}.wasm`));
}
copy(pkg('@tesseract.js-data/eng', '4.0.0/eng.traineddata.gz'), 'lang/eng.traineddata.gz');
