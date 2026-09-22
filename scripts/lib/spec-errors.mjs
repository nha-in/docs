// Every error code a spec's response examples carry, plus the codes NHA lists
// for the module in catalogue/openapi/hiecm/v3/errors/<module>.yaml. Nothing
// is invented: a code is here because an example on some operation returns it
// or because NHA's own list for the module names it.
import {existsSync, readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];
const LIST_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'catalogue', 'openapi', 'hiecm', 'v3', 'errors');

/** NHA's own code list for the module, or null when it supplied none. */
export function moduleErrorList(spec) {
  const module = spec?.info?.['x-portal']?.module;
  if (!module || spec?.info?.['x-abdm-gateway'] !== 'hiecm') return null;
  const file = join(LIST_DIR, `${module}.yaml`);
  if (!existsSync(file)) return null;
  const list = parse(readFileSync(file, 'utf8')) ?? {};
  return {intro: list.intro ?? '', source: list.source ?? '', codes: list.codes ?? []};
}

function* codesIn(value) {
  if (Array.isArray(value)) { for (const v of value) yield* codesIn(v); return; }
  if (!value || typeof value !== 'object') return;
  if (typeof value.code === 'string' && /^[A-Z]{2,5}-\d{3,5}$|^\d{3,6}$/.test(value.code) && typeof value.message === 'string') yield {code: value.code, message: value.message};
  for (const v of Object.values(value)) yield* codesIn(v);
}

export function errorsFromSpec(spec) {
  const seen = new Map();
  for (const block of [spec.paths ?? {}, spec.webhooks ?? {}]) {
    for (const item of Object.values(block)) for (const method of METHODS) {
      const op = item?.[method]; if (!op) continue;
      for (const [status, response] of Object.entries(op.responses ?? {})) {
        if (!/^[45]/.test(status)) continue;
        const media = response?.content?.['application/json'] ?? {};
        const samples = [media.example, ...Object.values(media.examples ?? {}).map((e) => e?.value)];
        for (const sample of samples) for (const {code, message} of codesIn(sample)) {
          if (!seen.has(code)) seen.set(code, {code, http: status, message: message.trim(), operationId: op.operationId});
        }
      }
    }
  }
  const fromExamples = [...seen.values()].sort((a, b) => a.code.localeCompare(b.code, undefined, {numeric: true}));
  // NHA's list follows, in NHA's order, without the rows an example already
  // carries. It names no HTTP status and no call, so those stay empty and the
  // renderers say so rather than guessing.
  const list = moduleErrorList(spec);
  const listed = [];
  const have = new Set(fromExamples.map((e) => `${e.code}|${e.message}`));
  for (const {code, message} of list?.codes ?? []) {
    const key = `${code}|${String(message).trim()}`;
    if (have.has(key)) continue;
    have.add(key);
    listed.push({code, http: '', message: String(message).trim(), operationId: '', listed: true});
  }
  return [...fromExamples, ...listed];
}
