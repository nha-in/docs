// scripts/lib/map.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {loadMap} from './map.mjs';

function repo(files) {
  const root = mkdtempSync(join(tmpdir(), 'map-'));
  for (const [p, body] of Object.entries(files)) {
    mkdirSync(join(root, p, '..'), {recursive: true});
    writeFileSync(join(root, p), body);
  }
  return root;
}

test('every gateway content map merges into one map', () => {
  const root = repo({
    'catalogue/hiecm/map/glossary.yaml': 'hiecm.glossary.x:\n  type: glossary\n',
    'catalogue/hiecm/map/m1.yaml': 'hiecm.endpoint.y:\n  type: endpoint\n',
    'catalogue/hiecm/map/empty.yaml': '# nothing yet\n',
    'catalogue/hiecm/map/notes.txt': 'not.yaml.z:\n  type: glossary\n',
    'catalogue/uhi/map/a.yaml': 'uhi.glossary.eua:\n  type: glossary\n',
  });
  const {map, problems} = loadMap(root);
  assert.deepEqual(Object.keys(map).sort(), ['hiecm.endpoint.y', 'hiecm.glossary.x', 'uhi.glossary.eua']);
  assert.deepEqual(problems, []);
});

test('an id defined in two map files is a problem naming both', () => {
  const root = repo({
    'catalogue/hiecm/map/a.yaml': 'a.glossary.x:\n  type: glossary\n',
    'catalogue/hiecm/map/glossary.yaml': 'a.glossary.x:\n  type: concept\n',
  });
  const {problems} = loadMap(root);
  assert.equal(problems.length, 1);
  assert.match(problems[0], /a\.glossary\.x/);
  assert.match(problems[0], /catalogue\/hiecm\/map\/a\.yaml/);
  assert.match(problems[0], /catalogue\/hiecm\/map\/glossary\.yaml/);
});

test('a catalogue with no content map reads as empty', () => {
  const root = mkdtempSync(join(tmpdir(), 'map-'));
  mkdirSync(join(root, 'catalogue'));
  assert.deepEqual(loadMap(root), {map: {}, problems: []});
});
