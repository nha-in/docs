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

const CARRIED_KEY = 'abdm-docs.carried';
const CARRIED_EVENT = 'abdm-docs:carried';

/**
 * The values earlier responses handed on (carry.ts): a txnId, an X-token.
 * Held beside the access token and for the same reason, so the next step's
 * panel, on its own page, opens with them filled in.
 */
export function readCarried(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(window.sessionStorage.getItem(CARRIED_KEY) ?? '{}');
  } catch {
    return {};
  }
}

/** Add what a response carried, newest winning, and tell every mounted panel. */
export function writeCarried(values: Record<string, string>): void {
  if (typeof window === 'undefined' || !Object.keys(values).length) return;
  const merged = {...readCarried(), ...values};
  try {
    window.sessionStorage.setItem(CARRIED_KEY, JSON.stringify(merged));
  } catch {
    // Storage refused. The event still reaches panels on this page.
  }
  window.dispatchEvent(new CustomEvent(CARRIED_EVENT, {detail: merged}));
}

/** Run `onChange` whenever any panel in this tab carries a value on. */
export function subscribeCarried(onChange: (values: Record<string, string>) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = (event: Event) => onChange((event as CustomEvent<Record<string, string>>).detail);
  window.addEventListener(CARRIED_EVENT, handler);
  return () => window.removeEventListener(CARRIED_EVENT, handler);
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
  // The gateway wants ISO 8601 UTC with milliseconds and the Z suffix, and
  // rejects non-UTC offsets such as +05:30 with ABDM-1016 Invalid Timestamp.
  // toISOString emits exactly the accepted shape.
  return {'REQUEST-ID': uuid, TIMESTAMP: new Date().toISOString()};
}

/** Headers this panel fills in itself, so the reader does not type them. */
export const GENERATED_HEADERS = new Set(['REQUEST-ID', 'TIMESTAMP']);
