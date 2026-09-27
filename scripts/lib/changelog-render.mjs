// Entries into prose, from fixed templates, and prose into the What's New
// pages.
//
// One template per kind. The heading states the change as a fact, the body
// says what to check and links the page to open, in two or three sentences,
// as the changelog skill asks. Nothing here reads a specification or a
// diff: the entry carries everything, so a change to a template rewrites
// every past entry the same way on the next render, and no wording ever
// depends on when it was generated.
import {readFileSync} from 'node:fs';

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

/** The writing guide spells numbers up to twelve. */
export const words = (n) => (n <= 12 ? WORDS[n] : String(n));
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/** `2026-09-24` as `24 September 2026`. */
export function longDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

const isCallback = (item) => item.kind === 'callback';
function noun(items, one = 'call', many = 'calls') {
  if (items.length && items.every(isCallback)) return items.length === 1 ? 'callback' : 'callbacks';
  return items.length === 1 ? one : many;
}

/** A count with its noun, headed by a word where the guide asks for one. */
function counted(items, label) {
  const n = items.length;
  const what = noun(items);
  return n <= 12 ? `${cap(words(n))} ${label} ${what}` : `${label}: ${n} ${what}`;
}

const code = (item) => `\`${item.method} ${item.path}\``;

/** Up to `max` items as code, then "and N more". */
function listed(items, max = 4, show = code) {
  const shown = items.slice(0, max).map(show);
  const rest = items.length - shown.length;
  return rest > 0 ? `${shown.join(', ')} and ${rest} more` : shown.join(', ');
}

const quoted = (names) => names.map((n) => `\`${n}\``).join(', ');
/** `header:X-HIU-ID!` as `X-HIU-ID`, `query:limit!` as `limit`. */
const paramName = (p) => p.slice(p.indexOf(':') + 1).replace(/!$/, '');

/** Up to two names, then "and N more". */
const someNames = (names, max = 2) =>
  names.length > max ? `${names.slice(0, max).join(', ')} and ${names.length - max} more` : names.join(' and ');

/** What one contract change says, as a clause. */
function clause(change) {
  const {field, from, to} = change;
  const list = (xs) => (xs.length > 4 ? `${quoted(xs.slice(0, 4))} and ${xs.length - 4} more` : quoted(xs));
  if (field === 'server') return `goes to \`${to}\`, not \`${from}\``;
  const added = Array.isArray(to) ? to.filter((x) => !from.includes(x)) : [];
  const removed = Array.isArray(from) ? from.filter((x) => !to.includes(x)) : [];
  if (field === 'params') {
    const parts = [];
    const req = added.filter((p) => p.endsWith('!')).map(paramName);
    const opt = added.filter((p) => !p.endsWith('!')).map(paramName);
    if (req.length) parts.push(`requires ${list(req)}`);
    if (opt.length) parts.push(`takes ${list(opt)}`);
    if (removed.length) parts.push(`no longer takes ${list(removed.map(paramName))}`);
    return parts.join(' and ') || 'takes different parameters';
  }
  if (field === 'required') {
    const parts = [];
    if (added.length) parts.push(`requires ${list(added)}`);
    if (removed.length) parts.push(`no longer requires ${list(removed)}`);
    return parts.join(' and ');
  }
  if (field === 'properties') {
    const parts = [];
    if (added.length) parts.push(`carries ${list(added)} in the body`);
    if (removed.length) parts.push(`drops ${list(removed)} from the body`);
    return parts.join(' and ');
  }
  if (field === 'security') return `is authorised with ${list(to)}`;
  if (field === 'encrypted') return added.length ? `encrypts ${list(added)}` : `sends ${list(removed)} in clear`;
  if (field === 'responses') {
    const parts = [];
    if (added.length) parts.push(`can return ${list(added)}`);
    if (removed.length) parts.push(`no longer returns ${list(removed)}`);
    return parts.join(' and ');
  }
  return `changed its ${field}`;
}

function fieldCounts(byField) {
  const names = {
    server: 'the host',
    security: 'authorisation',
    params: 'headers or parameters',
    required: 'required fields',
    properties: 'body fields',
    encrypted: 'encryption',
    responses: 'response codes',
  };
  return Object.entries(byField)
    .sort((a, b) => b[1] - a[1])
    .map(([field, n], i) => `${names[field] ?? field}${i === 0 ? ' changed' : ''} on ${n === 1 ? 'one call' : `${words(n)} calls`}`);
}

const open = (e, what = 'reference') => `[Open the ${e.label} ${what}](${e.link})`;
const lastSegment = (route) => cap(route.split('/').filter(Boolean).at(-1).replace(/-/g, ' '));

const BUILD_WITH_AI = '/docs/hiecm/v3/getting-started/build-with-ai';

/** A role as the page names it: the acronyms stay, the words take a plural. */
const ROLES = {his: 'HIS integrators', phr: 'PHR apps', payer: 'payers', provider: 'providers'};
const roleName = (r) => ROLES[r] ?? `${r}s`;

/** The `###` heading of an entry, the change stated as a fact. */
export function headingFor(e) {
  const items = e.items;
  switch (e.kind) {
    case 'coverage-module':
      return `${e.label} has an API reference`;
    case 'coverage-role':
      return `${e.label} is documented for ${items.map((i) => roleName(i.role)).join(' and ')}`;
    case 'coverage-errors':
      return `${e.label} error codes are listed`;
    case 'republished':
      return e.source.date
        ? `${e.label} follows the specification of ${longDate(e.source.date)}`
        : `${e.label} follows a republished specification`;
    case 'correction': {
      const fields = new Set(items.flatMap((i) => i.changes.map((c) => c.field)));
      const n = items.length;
      if (fields.size === 1 && fields.has('server')) {
        const hosts = new Set(items.map((i) => i.changes[0].to));
        if (hosts.size === 1) return `${e.label}: ${n === 1 ? 'one call goes' : `${words(n)} calls go`} to ${[...hosts][0].replace(/^https?:\/\//, '')}`;
      }
      const what = fields.size === 1 ? {params: 'headers or parameters', required: 'required fields', responses: 'response codes', properties: 'body fields', security: 'authorisation', encrypted: 'encryption'}[[...fields][0]] : null;
      return what
        ? `${e.label}: ${what} corrected on ${n === 1 ? 'one call' : `${words(n)} calls`}`
        : `${e.label}: ${n === 1 ? 'one call' : `${words(n)} calls`} corrected`;
    }
    case 'shared-correction': {
      const c = e.change;
      const n = e.items.length;
      const what = n === 1 ? 'one call' : `${words(n)} calls`;
      const added = Array.isArray(c.to) ? c.to.filter((x) => !c.from.includes(x)) : [];
      if (c.field === 'server') return `${e.label}: ${what} go to ${String(c.to).replace(/^https?:\/\//, '')}`;
      const removed = Array.isArray(c.from) ? c.from.filter((x) => !c.to.includes(x)) : [];
      if (c.field === 'params' && added.length && removed.length) return `${e.label}: ${what} take ${someNames(added.map(paramName))}, not ${someNames(removed.map(paramName))}`;
      if (c.field === 'params' && added.length) return `${e.label}: ${what} take ${someNames(added.map(paramName))}`;
      if (c.field === 'params' && removed.length) return `${e.label}: ${what} no longer take ${someNames(removed.map(paramName))} as headers`;
      if (c.field === 'required' && added.length) return `${e.label}: ${what} require ${added.join(' and ')}`;
      if (c.field === 'properties' && added.length) return `${e.label}: ${what} carry ${added.join(' and ')} in the body`;
      return `${e.label}: ${what} corrected the same way`;
    }
    case 'added':
      return `${counted(items, e.label)} added`;
    case 'withdrawn':
      return `${counted(items, e.label)} withdrawn`;
    case 'moved':
      return `${counted(items, '')} moved from ${e.fromLabel} to ${e.label}`.replace(/\s+/g, ' ');
    case 'path-changed':
      return `${e.label}: ${items.length === 1 ? 'one call' : `${words(items.length)} calls`} changed address`;
    case 'artefact-added': {
      const kind = items[0].artefact;
      if (kind === 'plugin') return `The ${items[0].name} plugin ${items[0].version} installs`;
      if (kind === 'postman') return `Postman collections for ${items[0].name}`;
      const what = kind === 'mcp-tool' ? 'Docs MCP tool' : 'skill';
      return items.length === 1
        ? `The ${items[0].name} ${what} is published`
        : `${cap(words(items.length))} ${what}s published: ${items.map((i) => i.name).join(', ')}`;
    }
    case 'artefact-removed':
      return items.length === 1
        ? `The ${items[0].name} skill is withdrawn`
        : `${cap(words(items.length))} skills withdrawn: ${items.map((i) => i.name).join(', ')}`;
    case 'plugin-version':
      return `The ${items[0].name} plugin is ${items[0].to}`;
    case 'procedure':
      return items[0].title;
    case 'declared-correction':
      return `${lastSegment(items[0].route)}: a correction`;
    default:
      return `${e.label}: ${e.kind}`;
  }
}

/** The body of an entry: what to check, and where. */
export function render(e) {
  const items = e.items;
  switch (e.kind) {
    case 'coverage-module': {
      const calls = items.filter((i) => !isCallback(i)).length;
      const hooks = items.length - calls;
      const roles = e.roles?.length ? `, for ${e.roles.map(roleName).join(' and ')}` : '';
      const parts = [];
      if (calls) parts.push(`${words(calls)} ${calls === 1 ? 'call' : 'calls'}`);
      if (hooks) parts.push(`${words(hooks)} ${hooks === 1 ? 'callback' : 'callbacks'}`);
      return `${cap(parts.join(' and ') || 'no calls yet')}${roles}, each on its own page with a request you can send. ${open(e)}.`;
    }
    case 'coverage-role':
      return `The ${e.label} calls now say what ${items.map((i) => roleName(i.role)).join(' and ')} send and receive. ${open(e)}.`;
    case 'coverage-errors':
      return `${cap(words(items[0].codes))} codes, each with the message it returns. ${open(e, 'error codes')}.`;
    case 'republished': {
      const counts = fieldCounts(e.byField ?? {});
      const changed = counts.length ? `${cap(counts.length > 1 ? `${counts.slice(0, -1).join(', ')}, and ${counts.at(-1)}` : counts[0])}.` : 'The calls themselves are unchanged.';
      return `The ${e.label} reference is built from the specification published on ${e.source.date ? longDate(e.source.date) : 'that date'}. ${changed} ${open(e)} and check the calls you make.`;
    }
    case 'correction': {
      const specifics = items.slice(0, 3).map((i) => `${code(i)} ${i.changes.map(clause).join(', and ')}`);
      const rest = items.length - specifics.length;
      return `${specifics.join('; ')}${rest > 0 ? `; and ${rest} more` : ''}. If you built against the earlier reference, check these calls. ${open(e)}.`;
    }
    case 'shared-correction': {
      const modules = e.modules.map((m) => `${m}`).join(', ');
      return `Each of these calls ${clause(e.change)}, across ${modules}: ${listed(items, 3, (i) => `\`${i.method} ${i.path}\``)}. If you built against the earlier reference, check them. [Open the ${e.label} reference](${e.link}).`;
    }
    case 'added':
      return `${listed(items)}. ${open(e)}.`;
    case 'withdrawn':
      return `${listed(items)}. If you call ${items.length === 1 ? 'it' : 'these'}, stop: the reference no longer carries ${items.length === 1 ? 'it' : 'them'}. ${open(e)}.`;
    case 'moved':
      return `${listed(items)}, now in ${e.label} rather than ${e.fromLabel}. The calls are unchanged; their pages moved. ${open(e)}.`;
    case 'path-changed':
      return `${listed(items, 3, (i) => `\`${i.method} ${i.from}\` is now \`${i.method} ${i.to}\``)}. If your code sends the old address, change it. ${open(e)}.`;
    case 'artefact-added': {
      const kind = items[0].artefact;
      if (kind === 'plugin') return `One install gives your agent every skill in it. [Build with AI](${e.link ?? BUILD_WITH_AI}).`;
      if (kind === 'postman') return `Each module's reference page offers its collection and the sandbox environment they share, with the session token fetched for you. [Open the API reference](${e.link ?? '/docs/hiecm/v3/api/'}).`;
      if (kind === 'mcp-tool') return `Your agent can call ${quoted(items.map((i) => i.name))} over the Docs MCP. [Build with AI](${e.link ?? BUILD_WITH_AI}).`;
      return `Install ${items.length === 1 ? 'it' : 'them'} with your agent, alongside the others. [Build with AI](${e.link ?? BUILD_WITH_AI}).`;
    }
    case 'artefact-removed':
      return `${items.length === 1 ? 'It is' : 'They are'} no longer published; remove ${items.length === 1 ? 'it' : 'them'} from your agent. [Build with AI](${e.link ?? BUILD_WITH_AI}).`;
    case 'plugin-version':
      return `Reinstall to move from ${items[0].from}. [Build with AI](${e.link ?? BUILD_WITH_AI}).`;
    case 'procedure':
      return `${items[0].description ? `${items[0].description.replace(/\.?$/, '.')} ` : ''}[Read the procedure](${e.link}).`;
    case 'declared-correction': {
      const c = items[0];
      return `The page said ${c.was.replace(/\.?$/, '')}. ${cap(c.now.replace(/\.?$/, ''))}. [Read the page](${e.link}).`;
    }
    default:
      return `[Open the page](${e.link ?? '/docs'}).`;
  }
}

/** The order entries take within a date: what you gained, then what you must fix. */
const ORDER = ['coverage-module', 'coverage-role', 'coverage-errors', 'republished', 'correction', 'shared-correction', 'path-changed', 'moved', 'withdrawn', 'added', 'artefact-added', 'plugin-version', 'artefact-removed', 'procedure', 'declared-correction'];
export function sortEntries(entries) {
  return [...entries].sort(
    (a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind) || a.gateway.localeCompare(b.gateway) || a.module.localeCompare(b.module),
  );
}

/** Docusaurus's heading id, so the index can link to it. */
export function slug(heading) {
  return heading
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9 -]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/** One dated page, rendered from its entries. */
export function renderPage(date, entries, position) {
  const long = longDate(date);
  const body = sortEntries(entries)
    .map((e) => `### ${headingFor(e)}\n\n${render(e)}\n`)
    .join('\n');
  return [
    '---',
    `title: ${long}`,
    `sidebar_label: ${long}`,
    `sidebar_position: ${position}`,
    'hide_title: true',
    `description: What changed in these pages on ${long}.`,
    'page_type: reference',
    'source: catalogue/changelog/entries',
    'generated: true',
    '---',
    '',
    "import ReleaseGroup from '@site/src/components/docs/ReleaseGroup';",
    '',
    `<ReleaseGroup date="${date}" as="h1">`,
    '',
    body,
    '</ReleaseGroup>',
    '',
  ].join('\n');
}

/** The `###` headings of a dated page, generated or hand written. */
export function headingsOf(file) {
  return [...readFileSync(file, 'utf8').matchAll(/^### (.+)$/gm)].map((m) => m[1].trim());
}

/** The index: every date, newest first, with its entries linked and counted. */
export function renderIndex(pages) {
  const groups = pages
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(({date, headings}) => {
      const n = headings.length;
      const bullets = headings.map((h) => `- [${h}](/docs/whats-new/${date}#${slug(h)})`).join('\n');
      return `<ReleaseGroup date="${date}" label="${n} change${n === 1 ? '' : 's'}">\n\n${bullets}\n\n</ReleaseGroup>`;
    })
    .join('\n\n');
  return [
    '---',
    "title: What's new",
    "sidebar_label: What's new",
    'sidebar_position: 0',
    'description: Dated changes to what you can build against, newest first.',
    'source: catalogue/changelog/entries',
    'generated: true',
    '---',
    '',
    "import ReleaseGroup from '@site/src/components/docs/ReleaseGroup';",
    "import Rules from './_rules.mdx';",
    '',
    "# What's new",
    '',
    'Changes that affect what you can build against, newest first. Each entry links to what you',
    'can now read, run or consume.',
    '',
    groups,
    '',
    '<Rules />',
    '',
  ].join('\n');
}
