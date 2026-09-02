#!/usr/bin/env node
// The site generator's name is not something this portal publishes. Docusaurus
// writes a generator meta tag and two locale/tag metas of its own into every
// page's head, which put its name in the source of a government documentation
// site. There is no option to turn them off, so they are removed from the
// built HTML. Runs after the build, alongside the markdown emitter.
import {readdirSync, readFileSync, statSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';

const BUILD = join(import.meta.dirname, '..', 'site', 'build');

// Each pattern matches one tag, quoted or unquoted: a production build emits
// attributes unquoted, a dev build quotes them.
const PATTERNS = [
  /<meta name=("?)generator\1 content=("?)Docusaurus[^>]*>/gi,
  /<meta[^>]*name=("?)docusaurus_locale\1[^>]*>/gi,
  /<meta[^>]*name=("?)docusaurus_tag\1[^>]*>/gi,
  /<meta[^>]*name=("?)docsearch:docusaurus_tag\1[^>]*>/gi,
  // The base-url diagnostic banner. It only renders when the site fails to
  // load, and it renders the generator's name and a link to its docs, which
  // is not what a reader of a government portal should be shown.
  /<script data-rh=true>document\.addEventListener\("DOMContentLoaded"[\s\S]*?<\/script>/gi,
];

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* htmlFiles(path);
    else if (name.endsWith('.html')) yield path;
  }
}

let changed = 0;
for (const file of htmlFiles(BUILD)) {
  const before = readFileSync(file, 'utf8');
  let after = before;
  for (const pattern of PATTERNS) after = after.replace(pattern, '');
  if (after !== before) {
    writeFileSync(file, after);
    changed += 1;
  }
}
console.log(`strip-generator-meta: cleaned ${changed} page(s).`);
