/**
 * What one ABDM response hands to the calls after it.
 *
 * A flow such as creating an ABHA is a chain: the OTP request returns a
 * `txnId` the verify call needs, and the verify call returns the X-token the
 * profile calls need. The request examples already name those values as
 * placeholders (`{{txnId}}`, `Bearer {{X-token}}`), so the reader's only job
 * should be to type what is theirs, not to copy what the last response said.
 *
 * Two readers use this: the Try It panel, and the Postman collections, which
 * embed this function's source in their post-response script
 * (scripts/build-postman.mjs). So it stays self-contained: no imports, no
 * outer references, nothing a Postman sandbox would not have.
 *
 * The gateway session's `accessToken` is not here: session.ts carries that as
 * the bearer token. Its `refreshToken` is ignored on purpose, since it is not
 * the user refresh token `R-jwtToken` stands for.
 */
export function carriedValues(body: unknown): Record<string, string> {
  const list = Array.isArray(body);
  const first = list ? (body as unknown[])[0] : body;
  if (!first || typeof first !== 'object') return {};
  const read = (path: string): string | undefined => {
    let at: unknown = first;
    for (const key of path.split('.')) {
      if (!at || typeof at !== 'object') return undefined;
      at = (at as Record<string, unknown>)[key];
    }
    return typeof at === 'string' && at ? at : undefined;
  };
  const out: Record<string, string> = {};
  // A search answers with a list of matches, and the OTP request after it
  // names that transaction searchTxnId rather than txnId.
  const txnId = read('txnId');
  if (txnId) out[list ? 'searchTxnId' : 'txnId'] = txnId;
  const tokenAt = ['tokens.token', 'jwtResponse.token', 'token'].find((path) => read(path));
  if (tokenAt) {
    const token = read(tokenAt) as string;
    out['X-token'] = token;
    out.jwtToken = token;
    const refresh = read(tokenAt.replace(/token$/, 'refreshToken'));
    if (refresh) out['R-jwtToken'] = refresh;
  }
  return out;
}

/**
 * An example with its `{{name}}` placeholders filled from `carried`, or
 * undefined when the example names none, or names one nothing has carried.
 * `Bearer {{X-token}}` becomes `Bearer eyJ...` once a login has run.
 */
export function fillFrom(example: unknown, carried: Record<string, string>): string | undefined {
  if (typeof example !== 'string' || !/\{\{[^{}]+\}\}/.test(example)) return undefined;
  let missing = false;
  const filled = example.replace(/\{\{([^{}]+)\}\}/g, (_, name: string) => {
    const value = carried[name.trim()];
    if (value === undefined) missing = true;
    return value ?? '';
  });
  return missing ? undefined : filled;
}
