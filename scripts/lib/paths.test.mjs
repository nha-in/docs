import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, relative} from 'node:path';
import {atomPath, mapFiles, specRoots, rawDirs, layoutProblems} from './paths.mjs';

const tree = (files) => {
  const root = mkdtempSync(join(tmpdir(), 'paths-'));
  for (const f of files) {
    mkdirSync(join(root, f, '..'), {recursive: true});
    writeFileSync(join(root, f), '');
  }
  return root;
};

test('an atom sits at catalogue/<gateway>/<type folder>/<id slug>.md', () => {
  assert.equal(atomPath('shared.glossary.link-token', 'glossary', 'shared'), 'catalogue/shared/glossary/link-token.md');
  assert.equal(atomPath('hiecm.endpoint.m2-generate-link-token', 'endpoint', 'hiecm'), 'catalogue/hiecm/endpoints/m2-generate-link-token.md');
});

test('map files are every gateway map, sorted by path', () => {
  const root = tree(['catalogue/hiecm/map/b.yaml', 'catalogue/hiecm/map/a.yaml', 'catalogue/shared/map/x.yaml']);
  assert.deepEqual(mapFiles(root).map((f) => relative(root, f)), ['catalogue/hiecm/map/a.yaml', 'catalogue/hiecm/map/b.yaml', 'catalogue/shared/map/x.yaml']);
});

test('a gateway reads its specs from its own folder, NHCX still from catalogue/openapi', () => {
  const root = tree(['catalogue/hiecm/openapi/v3/hiecm-m1.yaml', 'catalogue/openapi/nhcx/v1/nhcx-claim.yaml']);
  assert.deepEqual(specRoots(root).map(({gateway, dir}) => [gateway, relative(root, dir)]), [
    ['hiecm', 'catalogue/hiecm/openapi'],
    ['nhcx', 'catalogue/openapi/nhcx'],
  ]);
});

test('upstream sets are read from catalogue/openapi/.raw and every gateway .raw', () => {
  const root = tree(['catalogue/openapi/.raw/a/x', 'catalogue/uhi/openapi/.raw/b/y']);
  assert.deepEqual(rawDirs(root).map((d) => relative(root, d)), ['catalogue/openapi/.raw', 'catalogue/uhi/openapi/.raw']);
});

test('a name outside the tree is a layout problem, naming it', () => {
  const clean = tree(['catalogue/README.md', 'catalogue/VERSION', 'catalogue/hiecm/map/a.yaml', 'catalogue/hiecm/concepts/x.md', 'catalogue/openapi/CONVENTIONS.md', 'catalogue/titles.yaml', 'catalogue/uhi/glossary/eua.md']);
  assert.deepEqual(layoutProblems(clean), []);
  for (const [stray, named] of [
    ['catalogue/generated/hiecm/x.md', 'catalogue/generated'],
    ['catalogue/verification/x.json', 'catalogue/verification'],
    ['catalogue/hiecm/stuff/x.md', 'catalogue/hiecm/stuff'],
  ]) {
    const problems = layoutProblems(tree(['catalogue/VERSION', stray]));
    assert.equal(problems.length, 1, `${stray}: ${problems}`);
    assert.ok(problems[0].startsWith(named), problems[0]);
  }
});
