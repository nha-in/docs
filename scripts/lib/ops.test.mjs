import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {loadOps} from './ops.mjs';

test('callbacks, declared as webhooks, are operations too, keyed by their path', () => {
  const root = mkdtempSync(join(tmpdir(), 'ops-'));
  const dir = join(root, 'catalogue', 'openapi', 'hiecm', 'v3');
  mkdirSync(dir, {recursive: true});
  writeFileSync(join(dir, 'hiecm-m2.yaml'), [
    'openapi: 3.1.0',
    'paths:',
    '  /api/hiecm/v3/link/carecontext#hip:',
    '    post: {operationId: m2_post_link}',
    'webhooks:',
    '  /api/v3/link/on_carecontext:',
    '    post: {operationId: m2_post_v3_link_on_carecontext}',
  ].join('\n'));
  assert.deepEqual(loadOps(root), [
    {operationId: 'm2_post_link', method: 'post', path: '/api/hiecm/v3/link/carecontext'},
    {operationId: 'm2_post_v3_link_on_carecontext', method: 'post', path: '/api/v3/link/on_carecontext'},
  ]);
});
