// scripts/check-plugin-version.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {versionProblems} from './check-plugin-version.mjs';

test('a plugin whose files changed under the same version fails, naming the fix', () => {
  const p = versionProblems({changed: ['plugins/abdm-integrators-assistant/skills/abdm-m1/SKILL.md'], plugins: [{dir: 'abdm-integrators-assistant', before: '0.4.0', after: '0.4.0'}]});
  assert.deepEqual(p, ['plugins/abdm-integrators-assistant changed but its version is still 0.4.0. Bump "version" in plugins/abdm-integrators-assistant/.claude-plugin/plugin.json, then run npm run build:plugins']);
});

test('a bumped version passes', () => {
  assert.deepEqual(versionProblems({changed: ['plugins/abdm-integrators-assistant/skills/abdm-m1/SKILL.md'], plugins: [{dir: 'abdm-integrators-assistant', before: '0.4.0', after: '0.4.1'}]}), []);
});

test('a plugin with no changed files needs no bump', () => {
  assert.deepEqual(versionProblems({changed: ['site/docs/x.mdx'], plugins: [{dir: 'nhcx', before: '1.0.0', after: '1.0.0'}]}), []);
});
