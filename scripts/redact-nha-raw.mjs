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
const REDACT = ['abha/M1 ABHA Swagger 1.yaml', 'abha/M1 ABHA Collection.json', 'phr/PHR and locker.postman_collection.json'];

// Order matters: tokens before anything that could match inside a token,
// addresses before emails.
const RULES = [
  ['photo', /(profilePhoto["']?\s*:\s*["']?)[A-Za-z0-9+/=]{100,}/g, '$1<BASE64_PHOTO>'],
  ['photo', /(?:\/9j\/|\biVBORw0)[A-Za-z0-9+/=]{100,}/g, '<BASE64_PHOTO>'],
  ['pid-block', /(fingerPrintAuthPid|faceAuthPid|irisAuthPid|"?Pid"?|pid)(\\?["']?\s*:\s*\\?["']?)[A-Za-z0-9+/=]{200,}/g, '$1$2<PID_BLOCK>'],
  ['token', /\{\{(?:bearer_token|json_web_token)_[a-z0-9]+\}\}[A-Za-z0-9_.-]*/g, '<TOKEN>'],
  ['token', /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}(?:\.[A-Za-z0-9_-]+)?/g, '<TOKEN>'],
  ['token', /\b[A-Za-z0-9+/_=-]*eyJ[A-Za-z0-9+/_=-]{200,}/g, '<TOKEN>'],
  ['abha-address', /\b[a-z0-9][a-z0-9._-]{2,}@(?:sbx|abdm)\b/gi, '<ABHA_ADDRESS>'],
  ['email', /\b[\w.+*-]+@[\w-]+\.[\w.-]+\b/g, '<EMAIL>'],
  ['abha-number', /\b91-\d{4}-\d{4}-\d{4}\b/g, '<ABHA_NUMBER>'],
  ['abha-number', /\b91\d{12}\b/g, '<ABHA_NUMBER>'],
  ['abha-number', /\b\d{2}-\d{4}-\d{4}-\d{4}\b/g, '<ABHA_NUMBER>'],
  ['mobile', /\b[6-9]\d{9}\b/g, '<MOBILE_NUMBER>'],
  ['internal-host', /https?:\/\/[a-z0-9.-]+\.abdm\.gov\.internal(?::\d+)?/g, 'https://abhasbx.abdm.gov.in'],
  ['third-party-url', /https?:\/\/webhook\.site\/[A-Za-z0-9-]+/g, '<YOUR_CALLBACK_URL>'],
];

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
  if (REDACT.includes(rel)) {
    for (const [name, re, to] of RULES) {
      text = text.replace(re, (whole, g1, g2) => { counts[name] = (counts[name] ?? 0) + 1; return to.replace('$1', g1 ?? '').replace('$2', g2 ?? ''); });
    }
    if (text !== before.toString('utf8')) writeFileSync(file, text);
  }
  const after = readFileSync(file);
  const original = REDACT.includes(rel) ? originals.get(rel) : sha(before);
  if (!original) throw new Error(`no original hash for ${rel}: pass ORIGINAL_HASHES on the first run`);
  const redactions = Object.entries(counts).map(([k, v]) => `${k} ${v}`).join(', ') || (REDACT.includes(rel) ? recorded.get(rel) : '') || 'none';
  rows.push({rel, committed: sha(after), original, redactions});
}

const lines = [
  '# NHA final set, 16 September 2026',
  '',
  'Every file NHA supplied, with the sha256 of the bytes committed here. Two files carried personal data (sandbox tokens decoding to mobile numbers, ABHA numbers and addresses; internal hostnames) and are committed redacted. The sha256 of the original bytes is recorded so a reissued file can be matched, and the originals are held outside git.',
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
