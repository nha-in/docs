/**
 * The values the Quickstart reads out of NHA's responses, and the two it can
 * check before sending.
 *
 * Its own right place is beside the Quickstart, but it is its own module so it
 * can be tested without a browser or a React renderer. See
 * quickstart-values.test.mjs.
 */

/**
 * The two shapes this page can check before NHA does, taken from
 * /docs/hiecm/v3/concepts/encryption rather than guessed: an OTP is exactly
 * six digits, a mobile number is ten with the first between 1 and 9, with an
 * optional +91 or 0 in front.
 *
 * Checked here because the transaction dies on its first use. A code with a
 * digit missing spends it, and the reader's next attempt is then refused for a
 * reason that has nothing to do with what they typed.
 */
const OTP_SHAPE = /^\d{6}$/;
const MOBILE_SHAPE = /^(?:\+91|0)?[1-9]\d{9}$/;

export const otpIsWellFormed = (value: string): boolean => OTP_SHAPE.test(value.trim());

/** Spaces and dashes are how people write a number down, not part of it. */
export const mobileIsWellFormed = (value: string): boolean =>
  MOBILE_SHAPE.test(value.trim().replace(/[\s-]/g, ''));

/** A value the page can print: a non empty string, or the first one in a list. */
export function readable(value: unknown): string {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) {
    const first = value.find((item) => typeof item === 'string' && item.trim());
    return typeof first === 'string' ? first.trim() : '';
  }
  return '';
}

/**
 * Read a field back under any of the spellings the specification records, at
 * whatever depth it records them.
 *
 * NHA nests the account it has just created under `ABHAProfile`, and writes
 * the address as a list of them under `phrAddress`. Reading the top level
 * only, and strings only, found neither: a creation that had entirely
 * succeeded rendered as nothing but the raw response. See the byAadhaar 200
 * schema in catalogue/openapi/hiecm/v3/hiecm-m1.yaml.
 *
 * Every requested spelling is tried at the current level before descending, so
 * a name that exists at the top still wins over the same name nested deeper.
 * That matters for `message`, which the enrolment body carries at the top and
 * an error body carries inside `error`.
 */
export function field(json: unknown, names: string[]): string {
  if (!json || typeof json !== 'object' || Array.isArray(json)) return '';
  const record = json as Record<string, unknown>;
  for (const name of names) {
    const found = readable(record[name]);
    if (found) return found;
  }
  for (const value of Object.values(record)) {
    const found = field(value, names);
    if (found) return found;
  }
  return '';
}
