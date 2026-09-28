// scripts/rekey-verification.mjs
// Rekeys sandbox records from atom ids, which get deleted, to operation ids,
// which come from the specification. A record is labelled by what happened:
// only a 2xx is evidence that a call works.
//   node scripts/rekey-verification.mjs
import {readdirSync, readFileSync, writeFileSync, rmSync} from 'node:fs';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';

export function parseCurl(curl) {
  const m = curl.match(/-X\s+([A-Z]+)\s+'(https?:\/\/[^']+)'/);
  if (!m) throw new Error(`cannot read a method and URL from: ${curl.slice(0, 80)}`);
  return {method: m[1], url: m[2]};
}

// A spec path with {params} becomes a pattern; a recorded URL may carry either
// the literal {param} or a real value in that position.
const pattern = (path) => new RegExp('^' + path.split(/\{[^}]+\}/).map((s) => s.replace(/[.*+?^$()|[\]\\]/g, '\\$&')).join('[^/]+') + '$');

export function rekey(rec, ops) {
  const {method, url} = parseCurl(rec.request);
  const pathname = decodeURI(new URL(url).pathname);
  const hit = ops.find((o) => o.method === method.toLowerCase() && (o.path === pathname || pattern(o.path).test(pathname)));
  if (!hit) throw new Error(`no operation matches ${method} ${pathname}`);
  const {atom, ...rest} = rec;
  return {operation: hit.operationId, outcome: String(rec.status).startsWith('2') ? 'succeeded' : 'failed', ...rest};
}

export function fileNames(recs) {
  const count = new Map();
  return recs.map((r) => {
    const key = `${r.operation}.${r.on}`;
    count.set(key, (count.get(key) ?? 0) + 1);
    return `${key}.${count.get(key)}.json`;
  });
}

// Every operation in one platform's specifications (HIE-CM unless named), as
// {operationId, method, path}.
// Callbacks are OpenAPI 3.1 webhooks keyed by the path ABDM posts to on your
// side, so a callback atom can name its operationId too. They come after the
// paths so a recorded gateway call still matches a path operation first.
export function loadOps(root, platform = 'hiecm', version = 'v3') {
  const specDir = join(root, 'catalogue', 'openapi', platform, version);
  return readdirSync(specDir).filter((f) => f.endsWith('.yaml')).flatMap((f) => {
    const spec = parse(readFileSync(join(specDir, f), 'utf8'));
    return [spec.paths, spec.webhooks].flatMap((group) => Object.entries(group ?? {}).flatMap(([p, item]) =>
      Object.entries(item).filter(([, o]) => o?.operationId).map(([m, o]) => ({operationId: o.operationId, method: m, path: p.split('#')[0]}))));
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(fileURLToPath(import.meta.url), '..', '..');
  const ops = loadOps(root);
  const dir = join(root, 'catalogue', 'verification');
  const files = readdirSync(dir).filter((x) => x.endsWith('.json')).sort();
  const recs = files.map((f) => rekey(JSON.parse(readFileSync(join(dir, f), 'utf8')), ops));
  const names = fileNames(recs);
  for (const f of files) rmSync(join(dir, f));
  recs.forEach((r, i) => writeFileSync(join(dir, names[i]), `${JSON.stringify(r, null, 2)}\n`));
  console.log(`rekeyed ${recs.length}: ${recs.filter((r) => r.outcome === 'succeeded').length} succeeded, ${recs.filter((r) => r.outcome === 'failed').length} failed`);
}
