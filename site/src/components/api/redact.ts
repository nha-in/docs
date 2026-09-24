/**
 * Takes the reader's live credentials out of text Try it hands to Ask AI.
 *
 * The request as typed carries the gateway token and the user's X-token, and
 * a live response can carry fresh tokens in its body. The assistant needs the
 * shape of the call to answer about it, never the values, so each is swapped
 * for `<redacted>` and its name kept. See redact.test.mjs.
 */
const HEADER = /(^|['"\s])(authorization|x-token|t-token|x-auth-token|cookie):[^'"\n]*/gim;
const TOKEN_FIELD = /"(accessToken|refreshToken|token|xToken|authToken)"(\s*:\s*)"(?:[^"\\]|\\.)*"/gi;

export function redact(text: string): string {
  return text
    .replace(HEADER, '$1$2: <redacted>')
    .replace(TOKEN_FIELD, '"$1"$2"<redacted>"');
}
