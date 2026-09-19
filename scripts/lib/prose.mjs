// House style applied to the text NHA supplies, before it is published.
//
// The portal is published by NHA and read by integrators in India, so it is
// written in Indian English. NHA's own swagger mixes American spellings in,
// carries a few typos, and gets article agreement wrong in front of acronyms.
// These are mechanical corrections to mechanical mistakes. Nothing here
// rewrites a claim, changes a field name or alters meaning.
//
// What is never touched: anything inside backticks, any URL, any path, and any
// ALL CAPS token. Those carry header names like AUTHORIZATION and REQUEST-ID
// and route segments like /v3/enrollment/, which are identifiers rather than
// prose and must survive exactly as NHA wrote them.

// American to Indian English. Lower case only, on purpose: a capitalised
// "Authorization" in NHA's text is the HTTP header, not the noun.
const SPELLING = {
  authorized: 'authorised',
  authorization: 'authorisation',
  unauthorized: 'unauthorised',
  authorize: 'authorise',
  authorizes: 'authorises',
  organization: 'organisation',
  organizations: 'organisations',
  enroll: 'enrol',
  enrolls: 'enrols',
  enrolling: 'enrolling',
  enrollment: 'enrolment',
  enrollments: 'enrolments',
  enrolled: 'enrolled',
  canceled: 'cancelled',
  canceling: 'cancelling',
  cancelation: 'cancellation',
  fulfill: 'fulfil',
  fulfills: 'fulfils',
  center: 'centre',
  centers: 'centres',
  catalog: 'catalogue',
  behavior: 'behaviour',
  favor: 'favour',
  analyze: 'analyse',
  recognize: 'recognise',
  initialize: 'initialise',
  customize: 'customise',
  optimize: 'optimise',
  personalize: 'personalise',
  // The writing guide bans this word outright rather than respelling it.
  utilize: 'use',
  utilizes: 'uses',
  utilized: 'used',
  utilizing: 'using',
  utilise: 'use',
  utilised: 'used',
};

// A benefit programme is a scheme, not a computer program. NHA means the
// former everywhere it appears in these specifications.
const PROGRAMME = /\bprograms?\b/g;

// NHA's own misspellings, corrected where they appear in prose. A typo inside
// a path or an operation id is an identifier and is left alone.
const TYPOS = {
  professtional: 'professional',
  Professtional: 'Professional',
  universites: 'universities',
  Universites: 'Universities',
  resent: 'resend',
  Resent: 'Resend',
  healdth: 'health',
  Healdth: 'Health',
  reponse: 'response',
  recieve: 'receive',
  recieved: 'received',
  succesful: 'successful',
  successfull: 'successful',
  seperate: 'separate',
  occured: 'occurred',
  refered: 'referred',
};

// A word starting with a, e, i or o takes "an". A "u" word is left alone
// because "a user", "a unique id" and "a UUID" are all correct. These are the
// a/e/i/o words that still take "a", and the acronyms whose spoken form starts
// with a vowel although their spelling does not.
const TAKES_A = new Set(['one', 'once', 'european', 'euro', 'eulogy', 'ewe', 'unit', 'union']);
const TAKES_AN = new Set(['hpid', 'hpr', 'hfr', 'sms', 'otp', 'ndhm', 'mdm', 'rsa', 'ssl', 'xml', 'fhir']);

function takesAn(word) {
  const w = word.toLowerCase();
  if (TAKES_A.has(w)) return false;
  if (TAKES_AN.has(w)) return true;
  return /^[aeio]/.test(w);
}

// Runs that are identifiers rather than prose: backticked spans, URLs, paths,
// and ALL CAPS tokens such as AUTHORIZATION, REQUEST-ID and X-CM-ID.
const PROTECTED = /(`[^`]*`|<[^>]+>|https?:\/\/\S+|\/[A-Za-z0-9_.{}-]+(?:\/[A-Za-z0-9_.{}-]+)+|\b[A-Z][A-Z0-9]{2,}(?:[-_][A-Z0-9]+)*\b)/g;

/** Applies `fn` to the prose in `text`, leaving every protected run untouched. */
function onProse(text, fn) {
  return String(text ?? '')
    .split(PROTECTED)
    .map((part, i) => (i % 2 === 1 ? part : fn(part)))
    .join('');
}

function respell(part) {
  let out = part;
  for (const [from, to] of Object.entries(SPELLING)) {
    out = out.replace(new RegExp(`\\b${from}\\b`, 'g'), to);
    // Sentence-initial form, which is still prose and not a header name.
    const From = from[0].toUpperCase() + from.slice(1);
    const To = to[0].toUpperCase() + to.slice(1);
    out = out.replace(new RegExp(`\\b${From}\\b`, 'g'), To);
  }
  out = out.replace(PROGRAMME, (m) => (m.endsWith('s') ? 'programmes' : 'programme'));
  for (const [from, to] of Object.entries(TYPOS)) {
    out = out.replace(new RegExp(`\\b${from}\\b`, 'g'), to);
  }
  return out;
}

/**
 * "a access token" to "an access token".
 *
 * Runs over the whole string rather than the prose runs, because the word
 * deciding the article is often an acronym, and an acronym is a protected run.
 * Splitting first would put "a" and "OTP" on opposite sides of the boundary.
 * Only the article itself is rewritten, so the protected word is untouched.
 */
function fixArticles(text) {
  return text.replace(/(?<![A-Za-z0-9])([Aa])(\s+)([A-Za-z]+)/g, (whole, article, gap, word) =>
    takesAn(word) ? `${article}n${gap}${word}` : whole,
  );
}

function tidy(part) {
  return part
    // "photo , update" and "reports ." close up.
    .replace(/\s+([,;:.!?])/g, '$1')
    // A missing space after a full stop between two words.
    .replace(/([a-z])\.([A-Z][a-z])/g, '$1. $2')
    .replace(/[ \t]{2,}/g, ' ');
}

/**
 * NHA's text in the portal's house style.
 *
 * Safe to run more than once: every rule maps a wrong form to a right one, and
 * the right forms are not themselves matched.
 */
export function fixProse(text) {
  if (!text) return '';
  return fixArticles(onProse(text, (part) => tidy(respell(part))));
}
