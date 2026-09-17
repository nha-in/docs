// Replaces personal data in NHA's raw files with named placeholders and
// writes MANIFEST.md. Idempotent: a second run changes nothing.
//
//   ORIGINAL_HASHES="<rel>=<sha256>,<rel>=<sha256>" node scripts/redact-nha-raw.mjs
//   node scripts/redact-nha-raw.mjs        rerun; original hashes come from the manifest
import {readFileSync, writeFileSync, readdirSync, statSync, existsSync} from 'node:fs';
import {join, relative, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(root, 'catalogue', 'openapi', '.raw', 'nha-2026-09-16');
const MANIFEST = join(RAW, 'MANIFEST.md');
// One policy for the whole raw set. The shapes that carried personal data in
// the three files redacted first also sat in files the manifest had called
// byte-exact, so every file the walker finds goes through the same rules.
const redacted = () => true;

// Order matters: tokens before anything that could match inside a token,
// addresses before emails.
const RULES = [
  ['photo', /(profilePhoto\\?["']?\s*:\s*\\?["']?)[A-Za-z0-9+/=]{100,}/g, '$1<BASE64_PHOTO>'],
  // NHA truncates some of these to a couple of dozen characters and reuses the
  // JPEG header as a generic base64 example, so the threshold is low.
  ['photo', /(?:\/9j\/|\biVBORw0)[A-Za-z0-9+/=]{8,}/g, '<BASE64_PHOTO>'],
  ['photo', /\bUklGR[A-Za-z0-9+/=]{100,}/g, '<BASE64_PHOTO>'],
  // A body left behind a placeholder that replaced only the image's header.
  ['photo', /(<BASE64_PHOTO>)[ \t]*[A-Za-z0-9+/=]{100,}/g, '$1'],
  ['pid-block', /(fingerPrintAuthPid|faceAuthPid|irisAuthPid|"?Pid"?|pid)(\\?["']?\s*:\s*\\?["']?)[A-Za-z0-9+/=]{200,}/g, '$1$2<PID_BLOCK>'],
  ['token', /\{\{(?:bearer_token|json_web_token)_[a-z0-9]+\}\}[A-Za-z0-9_.-]*/g, '<TOKEN>'],
  ['token', /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}(?:\.[A-Za-z0-9_-]+)?/g, '<TOKEN>'],
  ['token', /\b[A-Za-z0-9+/_=-]*eyJ[A-Za-z0-9+/_=-]{200,}/g, '<TOKEN>'],
  ['abha-address', /\b[a-z0-9][a-z0-9._*-]{2,}@(?:sbx|abdm)\b/gi, '<ABHA_ADDRESS>'],
  ['email', /\b[\w.+*-]+@[\w-]+\.[\w.-]+\b/g, '<EMAIL>'],
  ['abha-number', /\b91-\d{4}-\d{4}-\d{4}\b/g, '<ABHA_NUMBER>'],
  ['abha-number', /\b91\d{12}\b/g, '<ABHA_NUMBER>'],
  ['hpr-id', /\b7\d-\d{4}-\d{4}-\d{4}\b/g, '<HPR_ID>'],
  ['abha-number', /\b\d{2}-\d{4}-\d{4}-\d{4}\b/g, '<ABHA_NUMBER>'],
  // Numbers masked only in the last group still carry twelve real digits.
  ['hpr-id', /\b7\d-\d{4}-\d{4}-XXXX\b/g, '<HPR_ID>'],
  ['abha-number', /\b\d{2}-\d{4}-\d{4}-XXXX\b/g, '<ABHA_NUMBER>'],
  ['mobile', /\b[6-9]\d{9}\b/g, '<MOBILE_NUMBER>'],
  ['internal-host', /https?:\/\/[a-z0-9.-]+\.abdm\.gov\.internal(?::\d+)?/g, 'https://abhasbx.abdm.gov.in'],
  ['third-party-url', /https?:\/\/webhook\.site(?:\/[A-Za-z0-9-]*)?/g, '<YOUR_CALLBACK_URL>'],
];

// Personal identity: names, dates of birth, addresses, pincodes and ABHA
// addresses written without a suffix. Matched by the key that holds the value,
// so field names, schema keys and enum values are never touched.
const IDENTITY = {
  name: ['fullName', 'firstName', 'middleName', 'lastName', 'careOf', 'patientName', 'givenName', 'familyName'],
  dob: ['dateOfBirth', 'dob', 'birthdate', 'birthDate', 'dayOfBirth', 'monthOfBirth', 'yearOfBirth'],
  address: ['address', 'house', 'street', 'locality', 'landmark', 'villageName', 'townName', 'districtName', 'subDistrictName', 'subdistrictName'],
  pincode: ['pincode', 'pinCode'],
  'abha-address': ['abhaAddress', 'preferredAbhaAddress', 'phrAddress', 'abhaAddressList'],
};
const PLACEHOLDER = {name: '<NAME>', dob: '<DOB>', address: '<ADDRESS>', pincode: '<PINCODE>', 'abha-address': '<ABHA_ADDRESS>'};
const CATEGORY = Object.fromEntries(Object.entries(IDENTITY).flatMap(([c, keys]) => keys.map((k) => [k, c])));
CATEGORY.name = 'name';
const KEYS = Object.keys(CATEGORY).join('|');
// Values that identify nobody: empty, schema words, templates, placeholders,
// masks, John Doe, NHA's own organisation and office, and the Marathi field
// labels printed on the ABHA card.
const KEEP = /^(?:\s*|string|null|john|doe|john doe|doe john|username|ayushman|bharat|mission|ayushman bharat mission|<[A-Z_]+>|\{\{.*|[^\s]*(?:\*\*|XXXX)[^\s]*|.*Jeevan Bharati.*|मोबाईल|लिंग|जन्मतारीख|आभा क्रमांक|आभा पत्ता|पत्ता|नाव)$/i;
// A bare `name` is a request title, header or organisation far more often than
// a person, so it is redacted only when it reads as two to four name words.
const NOT_A_PERSON = new Set('abc abcd abha abdm aadhaar address and api apis auth authmethod benefit bio biometric body bridge card clinic cowin dentist doctor empty fingerprint hip hiu hospital india lab pradesh service valley certificate copy council creation diagnostics dto enroll enrollment enrolment expired face find flow gateway get id invalid link locker login loginhint loginid logout medicine miscellaneous mobile modern naturopathy negative new north number of otp nurse pharmacist pharmacy phr pid positive profile refresh request scope send session south submiting submitting switch test token transaction txnid update url used user using value verify via without yoga'.split(' '));
// One word counts only in the YAML specs, where it sits in a profile example;
// the JSON files hold LGD district lists under the same key.
const personName = (v, yaml) => (yaml ? /^(?:\p{Lu}\p{Ll}+|\p{Lo}[\p{Lo}\p{M}]*|[\p{L}\p{M}.']+(?: [\p{L}\p{M}.']+){1,3})$/u : /^[\p{L}\p{M}.']+(?: [\p{L}\p{M}.']+){1,3}$/u).test(v) && !v.toLowerCase().split(/[ .]+/).some((w) => NOT_A_PERSON.has(w) || /andaman|nursing/.test(w));
let inYaml = false;
const identifies = (key, v) => {
  if (KEEP.test(v)) return false;
  const n = Number(v);
  if (key === 'name') return personName(v, inYaml);
  if (key === 'dayOfBirth') return /^\d{1,2}$/.test(v) && n >= 1 && n <= 31;
  if (key === 'monthOfBirth') return /^\d{1,2}$/.test(v) && n >= 1 && n <= 12;
  if (key === 'yearOfBirth') return /^\d{4}$/.test(v) && n >= 1900 && n <= 2026;
  if (CATEGORY[key] === 'dob') return /\d/.test(v);
  if (CATEGORY[key] === 'pincode') return /^\d{6}$/.test(v);
  if (CATEGORY[key] === 'abha-address') return /^[a-z0-9][a-z0-9._-]{2,}(?: *@(?:sbx|abdm))?$/i.test(v) && /[a-z]/i.test(v);
  if (CATEGORY[key] === 'address' && /^https?:\/\//.test(v)) return false;
  return /[\p{L}\d]/u.test(v);
};
const redactIdentity = (text, yaml, counts) => {
  inYaml = yaml;
  const hit = (key) => { const c = CATEGORY[key]; counts[c] = (counts[c] ?? 0) + 1; return PLACEHOLDER[c]; };
  // "key": "value", \"key\": \"value\", key: "value"
  text = text.replace(new RegExp(`(?<![\\w$])(${KEYS})(\\\\?"?\\s*:\\s*)(\\\\?")([^"\\\\\\r\\n]*)\\3`, 'g'),
    (m, k, sep, q, v) => (identifies(k, v) ? `${k}${sep}${q}${hit(k)}${q}` : m));
  // "key": 1990, \"key\": 110001
  text = text.replace(new RegExp(`(?<![\\w$])(${KEYS})(\\\\?)("\\s*:\\s*)(\\d+)(?=\\s*[,}\\r\\n\\\\])`, 'g'),
    (m, k, bs, sep, v) => (k !== 'name' && identifies(k, v) ? `${k}${bs}${sep}${bs}"${hit(k)}${bs}"` : m));
  // Postman query and form rows: "key": "abhaAddress", "value": "value"
  text = text.replace(new RegExp(`("key":\\s*"(${KEYS})",\\s*"value":\\s*")([^"\\\\\\r\\n]*)"`, 'g'),
    (m, pre, k, v) => (identifies(k, v) ? `${pre}${hit(k)}"` : m));
  // "abhaAddressList": ["value", ...], escaped or not
  text = text.replace(/(abhaAddress(?:List)?\\?"?\s*:\s*\[)([^\]]*)\]/g, (m, pre, body) => `${pre}${body.replace(/(\\?")([^"\\\r\n]*)\1/g,
    (e, q, v) => (identifies('abhaAddress', v) ? `${q}${hit('abhaAddress')}${q}` : e))}]`);
  // <strong>name:</strong> ... <code>value</code>, in the HTML field tables
  text = text.replace(new RegExp(`(<strong>(${KEYS}):(?:\\(required\\))?</strong>(?:(?!<strong>(?!Type:|Example:)[^<]*:)[^]){0,400}?<code>)([^<]*)(</code>)`, 'gi'),
    (m, pre, k, v, post) => { k = Object.keys(CATEGORY).find((x) => x.toLowerCase() === k.toLowerCase()); return identifies(k, v) ? `${pre}${hit(k).replace('<', '&lt;').replace('>', '&gt;')}${post}` : m; });
  // ?abhaAddress=value
  text = text.replace(/([?&](?:abhaAddress|preferredAbhaAddress|phrAddress)=)([^&\s"'\\<{]+)/g,
    (m, pre, v) => (identifies('abhaAddress', v) ? `${pre}${hit('abhaAddress')}` : m));
  if (!yaml) return text;
  // key: 'value', which YAML lets run over several lines
  text = text.replace(new RegExp(`^([ \\t]*(?:- )?(?:${KEYS}):[ \\t]+)'((?:[^']|'')*)'`, 'gm'),
    (m, pre, v) => { const k = pre.trim().replace(/^- /, '').slice(0, -1); return identifies(k, v.replace(/\s+/g, ' ')) ? `${pre}'${hit(k)}'` : m; });
  // key: value, example: value under a key of that name, and list items
  const stack = [];
  const redactList = (body) => body.replace(/(["'])([^"'\r\n]*)\1/g, (e, q, v) => (identifies('abhaAddress', v) ? `${q}${hit('abhaAddress')}${q}` : e));
  let inList = false;
  return text.split('\n').map((line) => {
    if (inList) { inList = !line.includes(']'); return redactList(line); }
    const m = line.match(/^([ \t]*)(- )?([\w$-]+):([ \t]*)(.*?)(\r?)$/);
    if (!m) {
      const item = line.match(/^([ \t]*)- ([^\s'"{\[#<][^\s#]*)(\r?)$/);
      const parent = stack.at(-1);
      return item && parent && CATEGORY[parent.key] === 'abha-address' && parent.indent <= item[1].length && identifies('abhaAddress', item[2]) ? `${item[1]}- ${hit('abhaAddress')}${item[3]}` : line;
    }
    const indent = m[1].length + (m[2] ? 2 : 0);
    while (stack.length && stack.at(-1).indent >= indent - (m[2] ? 1 : 0)) stack.pop();
    const example = m[3] === 'example';
    const key = example ? stack.at(-1)?.key : m[3];
    // An OpenAPI parameter, `- name: abhaAddress`, names the key its sibling
    // `example:` belongs to; recorded one column shallower so siblings keep it.
    const param = m[2] && m[3] === 'name' && CATEGORY[m[5].trim()] ? m[5].trim() : null;
    stack.push(param ? {indent: indent - 1, key: param} : {indent, key});
    const at = (v) => `${m[1]}${m[2] ?? ''}${m[3]}:${m[4]}${v}${m[6]}`;
    if (!key || !CATEGORY[key] || !m[5]) return line;
    if (m[5].startsWith('[')) {
      if (CATEGORY[key] !== 'abha-address') return line;
      inList = !m[5].includes(']');
      return at(redactList(m[5]));
    }
    // Quoted values under their own key were handled above.
    const q = m[5].match(/^(["'])(.*)\1$/);
    if (q) return example && identifies(key, q[2]) ? at(`${q[1]}${hit(key)}${q[1]}`) : line;
    if (/^['"{|>&*!#%@`<-]/.test(m[5])) return line;
    return identifies(key, m[5].replace(/\s+#.*$/, '').trim()) ? at(hit(key)) : line;
  }).join('\n');
};

const sha = (buf) => createHash('sha256').update(buf).digest('hex');
const walk = (dir) => readdirSync(dir).flatMap((n) => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : n === 'MANIFEST.md' || n === '.DS_Store' ? [] : [p];
});

// Original hashes and redaction counts: from the environment and the run on
// the first pass, from the manifest after, so a rerun on already redacted
// files records the same row.
const originals = new Map();
const recorded = new Map();
for (const pair of (process.env.ORIGINAL_HASHES ?? '').split(',').filter(Boolean)) {
  const i = pair.lastIndexOf('=');
  originals.set(pair.slice(0, i), pair.slice(i + 1));
}
if (existsSync(MANIFEST)) {
  for (const m of readFileSync(MANIFEST, 'utf8').matchAll(/^\| `([^`]+)` \| `[0-9a-f]{64}` \| `([0-9a-f]{64})` \| ([^|]+) \|/gm)) {
    if (!originals.has(m[1])) originals.set(m[1], m[2]);
    recorded.set(m[1], m[3].trim());
  }
}

const rows = [];
for (const file of walk(RAW).sort()) {
  const rel = relative(RAW, file);
  const before = readFileSync(file);
  let text = before.toString('utf8');
  // A rerun sees already redacted text, so the counts a previous run recorded
  // are carried forward and the new rules add to them.
  const counts = {};
  for (const m of (recorded.get(rel) ?? '').matchAll(/([a-z-]+) (\d+)/g)) counts[m[1]] = Number(m[2]);
  if (redacted(rel)) {
    for (const [name, re, to] of RULES) {
      text = text.replace(re, (whole, g1, g2) => { counts[name] = (counts[name] ?? 0) + 1; return to.replace('$1', g1 ?? '').replace('$2', g2 ?? ''); });
    }
    text = redactIdentity(text, /\.ya?ml$/.test(file), counts);
    if (text !== before.toString('utf8')) writeFileSync(file, text);
  }
  const after = readFileSync(file);
  const original = redacted(rel) ? originals.get(rel) : sha(before);
  if (!original) throw new Error(`no original hash for ${rel}: pass ORIGINAL_HASHES on the first run`);
  const redactions = Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ') || (redacted(rel) ? recorded.get(rel) : '') || 'none';
  rows.push({rel, committed: sha(after), original, redactions});
}

const lines = [
  '# NHA final set, 16 September 2026',
  '',
  'Every file NHA supplied, with the sha256 of the bytes committed here. Every one of them is redacted by the same rules, because sandbox tokens, mobile numbers, ABHA numbers and addresses, HPR identifiers, photographs and internal hostnames turned up across the set rather than in a few files. Each row records the sha256 of the original bytes so a reissued file can be matched, and the originals are held outside git.',
  '',
  'The M1 collection of 15 September sits beside the set because it supplies the order of M1 calls, and nothing else.',
  '',
  '| File | sha256 committed | sha256 original | Redactions |',
  '| --- | --- | --- | --- |',
  ...rows.map((r) => `| \`${r.rel}\` | \`${r.committed}\` | \`${r.original}\` | ${r.redactions} |`),
  '',
];
writeFileSync(MANIFEST, lines.join('\n'));
console.log(rows.map((r) => `${r.rel}: ${r.redactions}`).join('\n'));
