// One self-contained script, no framework required on the host page.
// Preact rather than React: the same source, a tenth of the bytes, and this
// file ships to pages that did not ask for a UI runtime.
import {join} from 'node:path';
import {build} from 'esbuild';

const dev = process.argv.includes('--dev');

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
  outfile:
    process.env.WIDGET_OUT ??
    join(import.meta.dirname, 'dist/abdm-support-agent.js'),
});
