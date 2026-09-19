// Every error code a spec's response examples carry. Nothing is invented: a
// code is here because an example on some operation returns it.
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

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
  return [...seen.values()].sort((a, b) => a.code.localeCompare(b.code, undefined, {numeric: true}));
}
