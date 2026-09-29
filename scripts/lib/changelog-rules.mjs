// What a difference between two facts snapshots means to a reader.
//
// The changelog skill admits six kinds of entry and nothing else: new
// coverage, a correction, a source republished, an operation renamed, added
// or withdrawn, a new artefact, and a procedure documented for the first
// time. Every rule here produces one of those or nothing. The rules are
// fixed and the prose is templated (changelog-render.mjs), so the same two
// snapshots always give the same entries, and every entry can be traced to
// the facts that produced it.
//
// The normalisations that keep noise out live in the extractor: paths with
// placeholders stripped, path parameters positional, headers lower cased,
// housekeeping paths dropped, no prose read. What is left here is judgement
// that needs both snapshots: what moved, what was republished, what was
// corrected, and how to fold a hundred field changes into one entry.
import {createHash} from 'node:crypto';
import {sourceKey} from './changelog-facts.mjs';

/** Contract fields compared for a change, in the order the entry lists them. */
export const CONTRACT_FIELDS = ['server', 'security', 'params', 'required', 'properties', 'encrypted', 'responses'];

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function entryId(kind, gateway, module, items) {
  return createHash('sha1')
    .update(JSON.stringify([kind, gateway, module, items]))
    .digest('hex')
    .slice(0, 12);
}

function moduleLink(m) {
  return `/docs/${m.gateway}/${m.version}/api/${m.module}/`;
}

/**
 * Whether a module's upstream changed under it between the snapshots.
 *
 * A republish is a file the module already cited carrying a different hash,
 * or a file from a set no module cited before. A file that another module
 * already cited is a re-placement, not news from NHA: the gateway's list
 * calls moving to P2 added the gateway's upstream file to P2's sources
 * without NHA publishing anything.
 */
export function republish(prevModule, nextModule, prevAll) {
  const keyed = (sources) => Object.fromEntries(Object.entries(sources ?? {}).map(([file, v]) => [sourceKey(file), v]));
  const before = keyed(prevModule?.sources);
  const citedBefore = new Set(Object.values(prevAll).flatMap((m) => Object.keys(keyed(m.sources))));
  const changed = [];
  for (const [file, {hash, fetched}] of Object.entries(keyed(nextModule.sources))) {
    if (before[file]) {
      if (before[file].hash !== hash) changed.push({file, fetched});
    } else if (!citedBefore.has(file)) {
      changed.push({file, fetched});
    }
  }
  if (!changed.length) return null;
  const dates = changed.map((c) => c.fetched).filter(Boolean).sort();
  return {files: changed.map((c) => c.file).sort(), date: dates.at(-1) ?? null};
}

const lower = (xs) => xs.map((x) => x.toLowerCase()).sort();
const diffSets = (from, to) => ({added: to.filter((x) => !from.includes(x)), removed: from.filter((x) => !to.includes(x))});

function contractChanges(before, after) {
  const changes = [];
  for (const field of CONTRACT_FIELDS) {
    // Headers compare without case, as HTTP reads them; the entry keeps the
    // case the specification wrote.
    const equal = field === 'params' ? same(lower(before[field]), lower(after[field])) : same(before[field], after[field]);
    if (!equal) changes.push({field, from: before[field], to: after[field]});
  }
  // A field that became required and appeared in the body at the same time
  // is one change, said once: "requires type" already says the body has it.
  const required = changes.find((c) => c.field === 'required');
  const properties = changes.find((c) => c.field === 'properties');
  if (required && properties) {
    const r = diffSets(required.from, required.to);
    const p = diffSets(properties.from, properties.to);
    if (p.added.every((x) => r.added.includes(x)) && p.removed.every((x) => r.removed.includes(x))) {
      changes.splice(changes.indexOf(properties), 1);
    }
  }
  return changes;
}

/**
 * The entries two snapshots produce, dated `date`. `prev` may be empty on
 * the very first run, in which case nothing is returned: a baseline is a
 * cursor, not news.
 */
export function entriesFor(prev, next, date) {
  if (!prev || !Object.keys(prev.modules ?? {}).length) return [];
  const entries = [];
  const prevModules = prev.modules ?? {};
  const nextModules = next.modules ?? {};
  const add = (kind, m, items, extra = {}) => {
    const module = m.module;
    entries.push({
      id: entryId(kind, m.gateway, module, items),
      date,
      kind,
      gateway: m.gateway,
      version: m.version,
      module,
      label: m.label,
      link: moduleLink(m),
      count: items.length,
      items,
      ...extra,
    });
  };

  // Operations that left a module and operations that arrived in one, kept
  // until every module has been read, because a move is one of each.
  const gone = []; // {m, key, op}
  const arrived = []; // {m, key, op}

  for (const key of new Set([...Object.keys(prevModules), ...Object.keys(nextModules)])) {
    const p = prevModules[key];
    const n = nextModules[key];

    if (!p) {
      const ops = Object.values(n.operations);
      add(
        'coverage-module',
        n,
        ops.map((op) => ({method: op.method, path: op.path, kind: op.kind})),
        {roles: n.roles},
      );
      // Its operations still take part in move matching, so a call that
      // came here from another module reads as a move; the rest are covered
      // by the entry above and are not listed again as additions.
      for (const [k, op] of Object.entries(n.operations)) arrived.push({m: n, key: k, op, covered: true});
      continue;
    }
    if (!n) {
      for (const [k, op] of Object.entries(p.operations)) gone.push({m: p, key: k, op});
      continue;
    }

    const roles = n.roles.filter((r) => !p.roles.includes(r));
    if (roles.length) add('coverage-role', n, roles.map((role) => ({role})));

    if (!p.errors.length && n.errors.length) {
      add('coverage-errors', n, [{codes: n.errors.length}], {link: `${moduleLink(n)}errors`});
    }

    const changed = [];
    for (const k of new Set([...Object.keys(p.operations), ...Object.keys(n.operations)])) {
      const before = p.operations[k];
      const after = n.operations[k];
      if (!before) arrived.push({m: n, key: k, op: after});
      else if (!after) gone.push({m: p, key: k, op: before});
      else {
        const diff = contractChanges(before, after);
        if (diff.length) changed.push({method: after.method, path: after.path, changes: diff});
      }
    }

    // The same operation at a new address: NHA's file, or ours, had the
    // path wrong. Callers who copied the old address have to change it.
    const renamed = [];
    for (const g of gone.filter((x) => x.m === p && x.op.id)) {
      const a = arrived.find((x) => x.m === n && x.op.id === g.op.id);
      if (!a) continue;
      renamed.push({method: a.op.method, from: g.op.path, to: a.op.path});
      gone.splice(gone.indexOf(g), 1);
      arrived.splice(arrived.indexOf(a), 1);
    }
    if (renamed.length) add('path-changed', n, renamed);

    const source = republish(p, n, prevModules);
    if (source) {
      const byField = {};
      for (const c of changed) for (const d of c.changes) byField[d.field] = (byField[d.field] ?? 0) + 1;
      add(
        'republished',
        n,
        changed.map((c) => ({method: c.method, path: c.path, fields: c.changes.map((d) => d.field)})),
        {source, byField},
      );
    } else if (changed.length) {
      add('correction', n, changed);
    }
  }

  // A move is the same operation leaving one module and arriving in another
  // of the same gateway. Grouped by the pair, so the entry names both.
  const moves = new Map();
  for (const g of [...gone]) {
    const a = arrived.find((x) => x.key === g.key && x.m.gateway === g.m.gateway);
    if (!a) continue;
    const pair = `${g.m.module}->${a.m.module}`;
    if (!moves.has(pair)) moves.set(pair, {from: g.m, to: a.m, items: []});
    moves.get(pair).items.push({method: a.op.method, path: a.op.path, kind: a.op.kind});
    gone.splice(gone.indexOf(g), 1);
    arrived.splice(arrived.indexOf(a), 1);
  }
  for (const {from, to, items} of moves.values()) {
    add('moved', to, items, {from: from.module, fromLabel: from.label});
  }

  const byModule = (list) => {
    const groups = new Map();
    for (const x of list) {
      const k = `${x.m.gateway}-${x.m.module}`;
      if (!groups.has(k)) groups.set(k, {m: x.m, items: []});
      groups.get(k).items.push({method: x.op.method, path: x.op.path, kind: x.op.kind});
    }
    return [...groups.values()];
  };
  // A withdrawal from a module that is itself gone has no module page to
  // open; the gateway's API index is where the reader goes instead.
  for (const {m, items} of byModule(gone)) {
    const stillThere = nextModules[`${m.gateway}-${m.module}`];
    add('withdrawn', m, items, stillThere ? {} : {link: `/docs/${m.gateway}/${m.version}/api/`});
  }
  for (const {m, items} of byModule(arrived.filter((x) => !x.covered))) add('added', m, items);

  foldSharedCorrections(entries);

  // What belongs to no module: the artefacts an agent installs, and what a
  // person declared in a page.
  const ps = prev.site ?? {};
  const ns = next.site ?? {};
  const site = {gateway: 'site', version: '', module: 'site', label: 'Site'};
  const siteAdd = (kind, items, extra) => add(kind, site, items, {link: null, ...extra});
  const newSkills = (ns.skills ?? []).filter((s) => !(ps.skills ?? []).includes(s));
  const lostSkills = (ps.skills ?? []).filter((s) => !(ns.skills ?? []).includes(s));
  if (newSkills.length) siteAdd('artefact-added', newSkills.map((name) => ({artefact: 'skill', name})), {link: '/docs/hiecm/v3/getting-started/build-with-ai'});
  if (lostSkills.length) siteAdd('artefact-removed', lostSkills.map((name) => ({artefact: 'skill', name})));
  const newTools = (ns.mcpTools ?? []).filter((s) => !(ps.mcpTools ?? []).includes(s));
  if (newTools.length) siteAdd('artefact-added', newTools.map((name) => ({artefact: 'mcp-tool', name})), {link: '/docs/hiecm/v3/getting-started/build-with-ai'});
  for (const [name, version] of Object.entries(ns.plugins ?? {})) {
    const was = ps.plugins?.[name];
    if (was === undefined) siteAdd('artefact-added', [{artefact: 'plugin', name, version}]);
    else if (was !== version) siteAdd('plugin-version', [{name, from: was, to: version}]);
  }
  for (const [route, page] of Object.entries(ns.procedures ?? {})) {
    if (!ps.procedures?.[route]) siteAdd('procedure', [{route, ...page}], {link: route});
  }
  for (const [route, list] of Object.entries(ns.corrections ?? {})) {
    const before = ps.corrections?.[route] ?? [];
    const fresh = list.filter((c) => !before.some((b) => same(b, c)));
    if (fresh.length) siteAdd('declared-correction', fresh.map((c) => ({route, ...c})), {link: route});
  }

  return entries;
}

/**
 * The same correction made across several modules of one gateway is one
 * piece of news, not one per module: NHA's NHCX review put `payload` and
 * `type` on every callback at once. A change's signature is what was added
 * and removed, not the whole list, so two callbacks with different headers
 * still share it. A signature seen in two or more modules of a gateway
 * becomes one gateway level correction, and leaves the module entries.
 */
function signature(change) {
  const {field, from, to} = change;
  if (!Array.isArray(from) || !Array.isArray(to)) return JSON.stringify([field, from, to]);
  const added = to.filter((x) => !from.includes(x));
  const removed = from.filter((x) => !to.includes(x));
  return JSON.stringify([field, added, removed]);
}

function foldSharedCorrections(entries) {
  const corrections = entries.filter((e) => e.kind === 'correction' && e.gateway !== 'site');
  const byGateway = new Map();
  for (const e of corrections) {
    for (const item of e.items) {
      for (const change of item.changes) {
        const key = `${e.gateway} ${signature(change)}`;
        if (!byGateway.has(key)) byGateway.set(key, {gateway: e.gateway, version: e.version, change, modules: new Set(), items: []});
        const group = byGateway.get(key);
        group.modules.add(e.module);
        group.items.push({module: e.module, method: item.method, path: item.path});
      }
    }
  }
  for (const group of byGateway.values()) {
    if (group.modules.size < 2) continue;
    const sig = signature(group.change);
    for (const e of corrections) {
      e.items = e.items
        .map((item) => ({...item, changes: item.changes.filter((c) => signature(c) !== sig)}))
        .filter((item) => item.changes.length);
      e.count = e.items.length;
    }
    const m = {gateway: group.gateway, version: group.version, module: group.gateway, label: group.gateway.toUpperCase()};
    entries.push({
      id: entryId('shared-correction', group.gateway, group.gateway, group.items),
      date: entries[0]?.date,
      kind: 'shared-correction',
      gateway: group.gateway,
      version: group.version,
      module: group.gateway,
      label: m.label,
      link: `/docs/${group.gateway}/${group.version}/api/`,
      count: group.items.length,
      items: group.items,
      change: group.change,
      modules: [...group.modules].sort(),
    });
  }
  for (let i = entries.length - 1; i >= 0; i -= 1) {
    if (entries[i].kind === 'correction' && entries[i].items.length === 0) entries.splice(i, 1);
  }
}

/** True when nothing a reader can act on differs between the snapshots. */
export function unchanged(prev, next) {
  return same(prev, next);
}
