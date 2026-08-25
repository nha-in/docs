/**
 * The access token, shared across every Try It panel in the tab.
 *
 * A reader runs the sessions call once and then wants to try any endpoint.
 * Pasting the same bearer token into every page is the friction this removes:
 * the token is captured from the sessions response, held for the browser
 * session, and read back by every panel that mounts afterwards.
 *
 * sessionStorage rather than localStorage on purpose. The token is a live
 * credential, so it should not outlive the tab that fetched it.
 */

const KEY = 'abdm-docs.access-token';
const EVENT = 'abdm-docs:access-token';

/** Read the token held for this browser session, if there is one. */
export function readToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.sessionStorage.getItem(KEY) ?? '';
  } catch {
    return ''; // Storage disabled. The panel still works, it just will not remember.
  }
}

/** Hold a token for this session and tell every mounted panel about it. */
export function writeToken(token: string): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) window.sessionStorage.setItem(KEY, token);
    else window.sessionStorage.removeItem(KEY);
  } catch {
    // Storage refused. Fall through: the event still syncs panels on this page.
  }
  window.dispatchEvent(new CustomEvent(EVENT, {detail: token}));
}

/** Run `onChange` whenever any panel in this tab sets the token. */
export function subscribeToken(onChange: (token: string) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => onChange((event as CustomEvent<string>).detail);
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

/**
 * Pull an access token out of a response body.
 *
 * The sessions call returns `accessToken`, and a couple of other calls spell
 * it `access_token`. Capturing whichever is present is what lets the reader
 * move from one call to the next without copying anything by hand.
 *
 * A bare `token` is deliberately not accepted here. The M1 login verify
 * responses return `token` for a user-scoped X-token, not a gateway access
 * token, and that value is not a bearer credential: holding it as one would
 * poison the Authorization field of every other panel in the tab.
 */
export function findToken(body: string): string {
  try {
    const parsed = JSON.parse(body);
    if (!parsed || typeof parsed !== 'object') return '';
    for (const name of ['accessToken', 'access_token']) {
      const value = (parsed as Record<string, unknown>)[name];
      if (typeof value === 'string' && value.length > 20) return value;
    }
  } catch {
    // Not JSON, so there is no token to find.
  }
  return '';
}

/**
 * Which consent manager the selected host belongs to.
 *
 * `X-CM-ID` is `sbx` against the sandbox and `abdm` against production, and
 * sending the wrong one against the right host reads as an authorisation
 * error rather than a mismatch. Deriving it from the chosen server removes
 * the chance of that pairing being wrong.
 */
export function consentManagerFor(server: string): string {
  return /sbx|sandbox|dev\./i.test(server) ? 'sbx' : 'abdm';
}

/** A fresh value for the headers NHA requires to be new on every request. */
export function perRequestHeaders(): Record<string, string> {
  const uuid =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  // The gateway wants IST, the +05:30 offset, not UTC. Shifting the clock
  // before toISOString gives IST wall time; the suffix is then corrected.
  const ist = new Date(Date.now() + 330 * 60 * 1000)
    .toISOString()
    .replace('Z', '+05:30');
  return {'REQUEST-ID': uuid, TIMESTAMP: ist};
}

/** Headers this panel fills in itself, so the reader does not type them. */
export const GENERATED_HEADERS = new Set(['REQUEST-ID', 'TIMESTAMP']);
