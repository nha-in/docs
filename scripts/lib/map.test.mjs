// scripts/lib/map.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {loadMap} from './map.mjs';

function repo(files) {
  const root = mkdtempSync(join(tmpdir(), 'map-'));
  mkdirSync(join(root, 'catalogue', 'map.d'), {recursive: true});
  for (const [p, body] of Object.entries(files)) writeFileSync(join(root, p), body);
  return root;
}

test('map.yaml and every map.d fragment merge into one map', () => {
  const root = repo({
    'catalogue/map.yaml': 'a.glossary.x:\n  type: glossary\n',
    'catalogue/map.d/hiecm-m1.yaml': 'hiecm.endpoint.y:\n  type: endpoint\n',
    'catalogue/map.d/empty.yaml': '# nothing yet\n',
    'catalogue/map.d/notes.txt': 'not.yaml.z:\n  type: glossary\n',
  });
  const {map, problems} = loadMap(root);
  assert.deepEqual(Object.keys(map).sort(), ['a.glossary.x', 'hiecm.endpoint.y']);
  assert.deepEqual(problems, []);
});

test('an id defined in two map files is a problem naming both', () => {
  const root = repo({
    'catalogue/map.yaml': 'a.glossary.x:\n  type: glossary\n',
    'catalogue/map.d/b.yaml': 'a.glossary.x:\n  type: concept\n',
  });
  const {problems} = loadMap(root);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /a\.glossary\.x/);
  assert.match(problems[0], /catalogue\/map\.yaml/);
  assert.match(problems[0], /catalogue\/map\.d\/b\.yaml/);
});

test('a repository with no map.d reads map.yaml alone', () => {
  const root = mkdtempSync(join(tmpdir(), 'map-'));
  mkdirSync(join(root, 'catalogue'));
  writeFileSync(join(root, 'catalogue', 'map.yaml'), 'a.glossary.x:\n  type: glossary\n');
  assert.deepEqual(Object.keys(loadMap(root).map), ['a.glossary.x']);
});
