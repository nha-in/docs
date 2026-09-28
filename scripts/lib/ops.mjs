// Every HIE-CM operation the specifications declare, paths and webhooks, so
// lint can check that an atom's `operation` names one that exists.
import {readdirSync, readFileSync} from 'node:fs';
import {join} from 'node:path';
import {parse} from 'yaml';

// Callbacks are OpenAPI 3.1 webhooks keyed by the path ABDM posts to on your
// side, so a callback atom can name its operationId too. They come after the
// paths, so a path operation is listed before a webhook on the same path.
export function loadOps(root) {
  const specDir = join(root, 'catalogue', 'hiecm', 'openapi', 'v3');
  return readdirSync(specDir).filter((f) => f.endsWith('.yaml')).flatMap((f) => {
    const spec = parse(readFileSync(join(specDir, f), 'utf8'));
    return [spec.paths, spec.webhooks].flatMap((group) => Object.entries(group ?? {}).flatMap(([p, item]) =>
      Object.entries(item).filter(([, o]) => o?.operationId).map(([m, o]) => ({operationId: o.operationId, method: m, path: p.split('#')[0]}))));
  });
}
