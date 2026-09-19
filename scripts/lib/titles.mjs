// Turns an NHA operation summary into a title a sidebar can show.
//
// NHA writes `summary` as a sentence of documentation, not as a name: "2. Use
// Case: Used to Fetch Public Key", "This API will be used to perform HIP
// initiated linking.". Rendered straight into a sidebar those truncate to "2.
// Use Case: Used to Fetch..." and tell the reader nothing.
//
// Two rules hold here. Strip NHA's boilerplate opener and keep the verb
// phrase underneath. When the strip leaves something that is not a name, fall
// back to the operation's method and path, which is data rather than prose and
// so is never wrong. Nothing invents words NHA did not write. The full summary
// stays on the page as the description, so no detail is lost by shortening.
//
// Acronyms are cased from the glossary, so the Catalogue stays the source of
// how a term is written.
import {loadAtoms, catalogueDir} from './atoms.mjs';
import {fixProse} from './prose.mjs';

// Acronyms carrying no glossary atom of their own. Each either names a gateway
// or registry the glossary covers under a longer title, or is ordinary
// technical vocabulary no reader needs defined. Delete a row the day its
// glossary atom lands.
const SUPPLEMENT = [
  'ABDM', 'HIE-CM', 'CM', 'HFR', 'HPR', 'HIP', 'HIU', 'PHR',
  'API', 'URL', 'SMS', 'QR', 'PID', 'JWT', 'RSA', 'LGD', 'ID', 'OTP', 'KYC',
];

// Proper nouns NHA cases inconsistently. Not acronyms, so not uppercased:
// spelled the one right way.
const PROPER = {aadhaar: 'Aadhaar', ayushman: 'Ayushman', bharat: 'Bharat', keycloak: 'Keycloak'};

// Acronyms NHA splits into words: "Fetch Hp Id Categories". Applied before the
// vocabulary, so the joined form is what gets cased.
const SPLIT = [[/\bhp\s+id\b/gi, 'HPID'], [/\bhpr\s+id\b/gi, 'HPR ID'], [/\babha\s+id\b/gi, 'ABHA ID']];

// Path segments that route rather than name: every operation has them, so they
// separate nothing and only make a title longer.
const ROUTING = new Set(['api', 'apis', 'abha', 'hiecm', 'hie-cm', 'gateway', 'web', 'app', '.well-known']);
// Any version segment: v1, v3, v1.5, v3.1.
const VERSION_SEGMENT = /^v\d+(?:\.\d+)*$/i;

let cached = null;

/**
 * The acronym vocabulary, longest first so "HIE-CM" is cased before "CM".
 *
 * Read from glossary atom titles: an atom titled "HIP, health information
 * provider" contributes HIP. An atom titled with a phrase contributes nothing,
 * which is what SUPPLEMENT covers.
 */
export function acronyms(dir = catalogueDir) {
  if (cached) return cached;
  const found = new Set(SUPPLEMENT);
  const {atoms} = loadAtoms(dir);
  for (const atom of atoms.values()) {
    if (atom.fm?.type !== 'glossary') continue;
    const head = String(atom.fm.title ?? '').split(',')[0].trim();
    if (/^[A-Z][A-Z0-9][A-Z0-9 -]*$/.test(head)) found.add(head);
  }
  cached = [...found].sort((a, b) => b.length - a.length);
  return cached;
}

/** Cases every acronym and proper noun in `text`, whatever case it arrived in. */
export function caseTerms(text, vocab = acronyms()) {
  let out = text;
  for (const [pattern, joined] of SPLIT) out = out.replace(pattern, joined);
  for (const term of vocab) {
    // Hyphens and spaces inside a term match either. A term never matches
    // inside a longer word, so "idempotency" keeps its lowercase id.
    const pattern = term.replace(/[-\s]/g, '[-\\s]');
    out = out.replace(new RegExp(`(?<![A-Za-z0-9/])${pattern}(?![A-Za-z0-9/])`, 'gi'), term);
  }
  for (const [lower, proper] of Object.entries(PROPER)) {
    out = out.replace(new RegExp(`(?<![A-Za-z0-9/])${lower}(?![A-Za-z0-9/])`, 'gi'), proper);
  }
  return out;
}

/**
 * A name built from the method and path, for when the summary yields none.
 *
 * "POST /abha/api/v3/enrollment/enrol/byAadhaar" becomes "Enrol by Aadhaar".
 * Deterministic and never wrong, because it only restates the route.
 */
export function pathTitle(path, method = '', vocab = acronyms()) {
  const segments = String(path ?? '')
    .split('/')
    .filter(Boolean)
    .filter((s) => !ROUTING.has(s.toLowerCase()) && !VERSION_SEGMENT.test(s))
    .map((s) => s.replace(/^\{(.+)\}$/, 'by $1'))
    // camelCase and snake_case to words: byAadhaar to "by Aadhaar".
    .map((s) => s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_]+/g, ' ').trim());
  if (!segments.length) return caseTerms(method ? `${method} call` : 'Call', vocab);
  // "enrollment/enrol" and "links/link" are the same word twice. Keep the
  // later one, which is the more specific.
  const deduped = segments.filter((s, i) => {
    const next = segments[i + 1];
    return !next || s.slice(0, 5).toLowerCase() !== next.slice(0, 5).toLowerCase();
  });
  // The last three segments carry the operation. Anything before them is the
  // area of the API, which the module and journey headings already say.
  const kept = deduped.slice(-3);
  // A route often names its own verb: /enrollment/request/otp. Lead with it so
  // the title is an instruction rather than a noun pile.
  const verbAt = kept.findIndex((segment) => VERBS.has(segment.split(' ')[0].toLowerCase()));
  const ordered =
    verbAt === -1 ? kept : [kept[verbAt], ...kept.slice(0, verbAt), ...kept.slice(verbAt + 1)];
  // camelCase splitting leaves "link And Delink"; sentence case settles it and
  // caseTerms puts the acronyms back up.
  const name = sentenceCase(ordered.join(' ').replace(/\s+/g, ' ').trim());
  return caseTerms(name.replace(/^./, (c) => c.toUpperCase()), vocab);
}

// "This API endpoint is a callback API for /x", and the many spellings of it.
const CALLBACK = /^(?:this\s+)?(?:is\s+)?(?:an?\s+)?(?:api\s+)?(?:endpoint\s+)?(?:is\s+)?(?:an?\s+)?call\s?back\s+(?:api|endpoint)?\s*(?:which|that)?\s*(?:is\s+|will\s+be\s+)?(?:called\s+)?(?:by\s+[\w/-]+\s+)?(?:of|for|to)\s+/i;

// The openers NHA puts before the verb: "This API will be used to", "This is
// ABDM HIE-CM API called by HIU to", "API used to", "Used to".
const OPENER = /^(?:this\s+)?(?:is\s+)?(?:an?\s+)?(?:abdm\s+)?(?:hie-cm\s+)?(?:api|endpoint)s?(?:\s+endpoint)?\s*(?:which|that)?\s*(?:will\s+be|shall\s+be|can\s+be|is|are)?\s*(?:used|invoked|called|leveraged|designed|intended|meant|responsible)?\s*(?:by\s+[^,.]{0,52}?\s+)?\s*(?:to|for)\s+/i;
// "This API will fetch the service ids": the opener carries no "to", so the
// verb sits directly after the modal.
const OPENER_DIRECT = /^(?:this\s+)?(?:api|endpoint)s?(?:\s+endpoint)?\s+(?:will\s+|shall\s+|can\s+|may\s+)?(?=[a-z])/i;
const BARE = /^(?:used|invoked|called|designed|intended|meant)\s+(?:to|by|for|from)\s+/i;

// A summary that is itself a route, which names nothing the path does not.
const IS_A_PATH = /^[\w.{}-]*(?:\/[\w.{}-]+)+\/?$/;

// A leftover opener: the strip removed a prefix and left a fragment that names
// nothing, so the path is the better title.
const NOT_A_NAME = /^(?:the|this|that|a|an|it|its|his|her|their|there|these|those)\b/i;
const STILL_BOILERPLATE = /\b(?:api|endpoint)\s+(?:is|will|shall|can|endpoint)\b|\bis\s+(?:a|an)\s+call\s?back\b/i;

/**
 * NHA's Title Case down to sentence case, so the sidebar reads one way.
 *
 * Only a plain Title Case word is lowered. An all-caps word and a word that is
 * mixed case inside are left alone, and `caseTerms` runs afterwards to put the
 * acronyms and proper nouns back up.
 */
function sentenceCase(text) {
  return text
    .split(' ')
    .map((word, i) => (i > 0 && /^[A-Z][a-z]+$/.test(word) ? word.toLowerCase() : word))
    .join(' ');
}

/** The text before the first sentence break, so a paragraph yields one clause. */
function firstSentence(text) {
  const m = text.match(/^(.*?[.!?])(?:\s+[A-Z(]|\s*$)/s);
  return (m ? m[1] : text).trim();
}

/**
 * A short title for one operation.
 *
 * Pass `path` and `method` so a summary that strips to nothing still gets a
 * name. Without them an unusable summary returns an empty string, and the
 * caller decides.
 */
export function cleanTitle(summary, {path = '', method = '', vocab = acronyms(), max = 72} = {}) {
  const viaPath = () => (path ? pathTitle(path, method, vocab) : '');
  let text = String(summary ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return viaPath();

  // The leading number goes before the sentence split, or "2. Use Case: ..."
  // splits at that first full stop and leaves "2.".
  text = text.replace(/^\d+\s*[.)]\s*/, '');
  text = firstSentence(text);
  // "Use Case:", "UseCase :", "Use case -", sometimes behind the number:
  // "2. Use Case: Used to Fetch Public Key".
  for (let i = 0; i < 3; i += 1) {
    const stripped = text.replace(/^use\s?case\s*[:\-]\s*/i, '').replace(/^\d+\s*[.)]\s*/, '');
    if (stripped === text) break;
    text = stripped;
  }

  if (IS_A_PATH.test(text)) return viaPath();

  let prefix = '';
  if (CALLBACK.test(text)) {
    prefix = 'Callback for ';
    text = text.replace(CALLBACK, '');
  } else {
    text = text.replace(OPENER, '').replace(OPENER_DIRECT, '');
  }
  text = text
    .replace(BARE, '')
    .replace(/[.\s]+$/, '')
    // NHA uses a spaced hyphen as a separator: "ABHA enrollment - Send OTP".
    // It is not punctuation the sentence needs, and the repo writes no dashes.
    .replace(/\s+-\s+/g, ' ')
    // "photo , update" back to "photo, update".
    .replace(/\s+([,;:])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  text = sentenceCase(text);

  // Every reason to distrust what the strip left. Shortening a sentence by
  // cutting it produces a confident half-truth, so the path is used instead.
  const unusable =
    !text ||
    text.length > max ||
    /^[/[(]/.test(text) ||
    // The sentence quotes a route. The path itself is the cleaner name.
    /\/\w+\/\w+/.test(text) ||
    NOT_A_NAME.test(text) ||
    STILL_BOILERPLATE.test(text);
  if (unusable) {
    const fallback = viaPath();
    if (!fallback) return '';
    return prefix ? caseTerms(prefix + fallback.replace(/^./, (c) => c.toLowerCase()), vocab) : fallback;
  }

  return caseTerms((prefix + text).replace(/^./, (c) => c.toUpperCase()), vocab);
}


// Every title names an action the integrator takes, so every title starts with
// a verb in the imperative. These are the verbs that appear across the eleven
// specifications, as path segments and as the first word of a summary.
const VERBS = new Set([
  'get', 'fetch', 'read', 'list', 'search', 'find', 'lookup', 'retrieve', 'download',
  'create', 'make', 'generate', 'issue', 'register', 'enrol', 'enroll', 'add', 'upload',
  'send', 'resend', 'submit', 'post', 'push', 'notify', 'share', 'transfer', 'request',
  'update', 'edit', 'change', 'patch', 'set', 'reset', 'recover', 'refresh', 'switch',
  'delete', 'remove', 'revoke', 'delink', 'unlink', 'unsubscribe', 'disable', 'logout',
  'verify', 'validate', 'check', 'confirm', 'authenticate', 'approve', 'deny', 'reject',
  'link', 'attach', 'init', 'initiate', 'start', 'open', 'close', 'setup', 'subscribe',
  'login', 'encrypt', 'decrypt', 'capture', 'select', 'claim', 'suggest', 'discover',
  'perform', 'receive', 'answer', 'acknowledge', 'enable', 'confirm', 'pull', 'store',
]);

// NHA writes some summaries in the third person. The imperative is the base form.
const THIRD_PERSON = {
  retrieves: 'retrieve', returns: 'return', generates: 'generate', creates: 'create',
  fetches: 'fetch', gets: 'get', sends: 'send', updates: 'update', provides: 'provide',
  allows: 'allow', enables: 'enable', verifies: 'verify', validates: 'validate',
  checks: 'check', deletes: 'delete', links: 'link', notifies: 'notify', shares: 'share',
  initiates: 'initiate', registers: 'register', searches: 'search', lists: 'list',
};

// The verb an operation gets when neither its summary nor its path supplies one.
// POST is deliberately "Submit" rather than "Create": these specifications use
// POST for searches, verifications and notifications as often as for creation.
const METHOD_VERB = {GET: 'Get', POST: 'Submit', PUT: 'Update', PATCH: 'Update', DELETE: 'Delete'};

// An acronym keeps its capitals; an ordinary word is lower cased mid sentence.
const lower = (text) => text.replace(/^./, (c) => (/[A-Z]/.test(text[1] ?? '') ? c : c.toLowerCase()));
// "the" unless the phrase already opens with a determiner.
const article = (text) => (/^(?:the|a|an|this|that|each|every|all|any)\b/i.test(text) ? '' : 'the ');

const firstWord = (text) => String(text).trim().split(/[\s-]+/)[0].toLowerCase().replace(/[^a-z]/g, '');
const startsWithVerb = (text) => VERBS.has(firstWord(text));

/**
 * A title as an instruction: "Get the public certificate", never "Public
 * certificate" or "Retrieves the certificate".
 *
 * A callback is an endpoint the integrator implements and ABDM calls, so the
 * action it names is receiving.
 */
export function imperative(title, {method = '', kind = 'operation', vocab = acronyms()} = {}) {
  let text = fixProse(String(title ?? '').trim());
  if (!text) return text;

  // "3 flows: isExists API" is NHA's collection bookkeeping, not a name.
  text = text.replace(/^\d+\s+flows?\s*:\s*/i, '').trim();

  const [head, ...tail] = text.split(' ');
  const base = THIRD_PERSON[head.toLowerCase()];
  if (base) text = [base.replace(/^./, (c) => c.toUpperCase()), ...tail].join(' ');

  if (kind === 'callback') {
    // "Callback for X" already names the thing received.
    text = text.replace(/^callback\s+for\s+/i, '');
    // A summary that already opens with a verb is an instruction, so prefixing
    // "Receive the" would stack two verbs: "Receive the confirm the linking".
    if (!startsWithVerb(text)) text = `Receive ${article(text)}${lower(text)}`;
  } else if (!startsWithVerb(text)) {
    const verb = METHOD_VERB[method.toUpperCase()] ?? 'Call';
    text = `${verb} ${article(text)}${lower(text)}`;
  }

  return caseTerms(text.replace(/^./, (c) => c.toUpperCase()), vocab);
}


/**
 * A description with NHA's opening boilerplate removed and house style applied.
 *
 * "This API is used to generate a access token." becomes "Generate an access
 * token." The sentence keeps its meaning; it loses the four words that say
 * nothing. Only the opener of the first sentence is touched, so a description
 * that explains something keeps every explanatory word.
 */
export function cleanDescription(description, {vocab = acronyms()} = {}) {
  const text = fixProse(String(description ?? '').trim());
  if (!text) return '';

  const [first, ...rest] = text.split(/(\n\n)/);
  let head = first;
  const before = head;
  if (!CALLBACK.test(head)) head = head.replace(OPENER, '').replace(OPENER_DIRECT, '');
  head = head.replace(BARE, '');
  if (head === before) return caseTerms(text, vocab);

  head = head.trim();
  const [lead, ...others] = head.split(' ');
  const baseForm = THIRD_PERSON[lead.toLowerCase()];
  if (baseForm) head = [baseForm, ...others].join(' ');
  head = head.replace(/^./, (c) => c.toUpperCase());
  // A strip that leaves a fragment starting with an article or a route has
  // removed the subject too. Keep NHA's sentence in that case.
  if (!head || NOT_A_NAME.test(head) || /^[/[(]/.test(head)) return caseTerms(text, vocab);
  return caseTerms([head, ...rest].join(''), vocab);
}

/** A slug or tag as a heading: "hip-initiated-linking" to "HIP initiated linking". */
export function cleanGroupLabel(label, vocab = acronyms()) {
  const text = /^[a-z0-9-]+$/.test(label) ? label.replace(/-/g, ' ') : label;
  return caseTerms(text.replace(/^./, (c) => c.toUpperCase()), vocab);
}
