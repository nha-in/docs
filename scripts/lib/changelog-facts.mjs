// The facts a reader of this site can act on, read from one checkout.
//
// What's New is a function of these facts and nothing else:
//
//     entries = rules(facts(now) - facts(last published))
//
// So this file decides what counts as a fact. Wording is not one: summaries,
// descriptions and titles are never read here, which is what keeps a voice
// pass or a rename out of the changelog. What is read is the contract of every
// operation, the upstream file each module was generated from, the modules
// and roles, the error code lists, the artefacts an agent installs, and the
// two things a person declares in a page's frontmatter (a procedure, a
// correction to prose). See changelog-rules.mjs for what a difference means.
//
// Output is canonical: keys sorted, arrays sorted where order carries no
// meaning, so two runs over the same tree are byte identical and a diff of
// the committed files reads by module.
import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs';
import {join, relative} from 'node:path';
import {parse} from 'yaml';
import {specRoots} from './paths.mjs';

const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

/** Swagger's own housekeeping paths, which NHA's files carry and no integrator calls. */
const HOUSEKEEPING = /\/(v[23]\/api-docs|swagger-resources)(\/|$)/;

const isDir = (p) => existsSync(p) && statSync(p).isDirectory();

/** `{request-id}` and `{subscriptionRequestId}` are the same address to a caller. */
export function normalisePath(path) {
  return path.replace(/\{[^}]*\}/g, '{}');
}

/** The key an operation is known by across snapshots: method and address. */
export function operationKey(method, path) {
  return `${method.toUpperCase()} ${normalisePath(path)}`;
}

function sortedUnique(values) {
  return [...new Set(values)].sort();
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.keys(value)
        .sort()
        .map((k) => [k, sortKeys(value[k])]),
    );
  }
  return value;
}

/** Follow a local $ref one level, which is as deep as NHA's request bodies nest. */
function resolve(spec, schema) {
  if (!schema?.$ref) return schema;
  return schema.$ref
    .replace(/^#\//, '')
    .split('/')
    .reduce((at, key) => at?.[key], spec);
}

/**
 * The contract of one operation: what a caller sends and what comes back,
 * with nothing that is only prose. Headers compare case-insensitively
 * because HTTP does.
 */
function contract(spec, op, method, path, kind) {
  const body = resolve(spec, op.requestBody?.content?.['application/json']?.schema);
  const params = (op.parameters ?? []).map((p) => resolve(spec, p));
  const servers = (op.servers ?? spec.servers ?? []).map((s) => s.url);
  const properties = body?.properties ?? {};
  return {
    id: op.operationId ?? null,
    kind,
    method: method.toUpperCase(),
    path,
    server: servers[0] ?? null,
    servers: sortedUnique(servers),
    security: sortedUnique((op.security ?? spec.security ?? []).flatMap((s) => Object.keys(s))),
    // A path parameter is positional to the caller, so its name is not part
    // of the contract, any more than it is part of the address above. Header
    // names keep the case the specification writes them in, for the reader;
    // the rules compare them without it, as HTTP does.
    params: sortedUnique(
      params.map((p) => `${p.in}:${p.in === 'path' ? '{}' : p.name}${p.required ? '!' : ''}`),
    ),
    required: sortedUnique(body?.required ?? []),
    properties: Object.keys(properties).sort(),
    encrypted: Object.keys(properties)
      .filter((name) => properties[name]?.['x-abdm-encrypted'] === true)
      .sort(),
    responses: Object.keys(op.responses ?? {}).sort(),
  };
}

function moduleFacts(gateway, version, file, spec) {
  const portal = spec.info?.['x-portal'] ?? {};
  const module = portal.module ?? file.replace(/\.ya?ml$/, '');
  const operations = {};
  const walk = (table, kind) => {
    for (const [path, item] of Object.entries(table ?? {})) {
      // A key that is not an address was never callable: NHA's NHCX files
      // carried `v1_claim_submit` beside `/v1/claim/submit`.
      if (!path.startsWith('/') || HOUSEKEEPING.test(path)) continue;
      for (const method of METHODS) {
        if (!item?.[method]) continue;
        operations[operationKey(method, path)] = contract(spec, item[method], method, path, kind);
      }
    }
  };
  walk(spec.paths, 'call');
  walk(spec.webhooks, 'callback');
  const sources = {};
  for (const s of spec['x-abdm-sources'] ?? []) {
    if (!s.file) continue;
    sources[sourceKey(s.file)] = {hash: s.hash ?? null, fetched: s.fetched ? String(s.fetched) : null};
  }
  return {
    gateway,
    version,
    module,
    file,
    label: portal.label ?? spec.info?.title ?? module,
    roles: sortedUnique(spec.info?.['x-abdm-roles'] ?? []),
    sources,
    operations,
    errors: [],
  };
}

/** NHA's per-module error code list, where one is recorded beside the specs. */
function errorCodes(dir, module) {
  for (const name of [`${module}.yaml`, `${module}.yml`]) {
    const file = join(dir, 'errors', name);
    if (!existsSync(file)) continue;
    const list = parse(readFileSync(file, 'utf8'));
    return sortedUnique((list?.codes ?? []).map((c) => String(c.code)));
  }
  return [];
}

/** The YAML block between the first two `---` lines, or null. */
export function frontmatter(text) {
  const match = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!match) return null;
  try {
    return parse(match[1]) ?? null;
  } catch {
    return null;
  }
}

function* walkFiles(dir) {
  if (!isDir(dir)) return;
  for (const entry of readdirSync(dir, {withFileTypes: true})) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(full);
    else yield full;
  }
}

/** The route a docs file renders at, the same way Docusaurus derives it. */
function routeOf(docsDir, file) {
  let route = relative(docsDir, file).replace(/\.mdx?$/, '');
  route = route.replace(/(^|\/)index$/, '');
  return `/docs/${route}`.replace(/\/$/, '') || '/docs';
}

/**
 * What a person declares. A page that documents a procedure for the first
 * time says `page_type: procedure`; a page whose prose stated a wrong fact
 * lists the correction under `corrections`, with `was` and `now`. Both are
 * read here as facts, so they reach the changelog by the same diff as a
 * specification change, and no free prose enters the generator.
 */
function declared(root) {
  const docsDir = join(root, 'site', 'docs');
  const procedures = {};
  const corrections = {};
  for (const file of walkFiles(docsDir)) {
    if (!/\.mdx?$/.test(file) || /(^|\/)_/.test(relative(docsDir, file))) continue;
    const fm = frontmatter(readFileSync(file, 'utf8'));
    if (!fm) continue;
    const route = routeOf(docsDir, file);
    if (fm.page_type === 'procedure') {
      procedures[route] = {title: String(fm.title ?? route), description: String(fm.description ?? '')};
    }
    if (Array.isArray(fm.corrections) && fm.corrections.length) {
      corrections[route] = fm.corrections
        .filter((c) => c && c.was && c.now)
        .map((c) => ({date: String(c.date ?? ''), was: String(c.was), now: String(c.now)}))
        .sort((a, b) => (a.date + a.was).localeCompare(b.date + b.was));
    }
  }
  return {procedures, corrections};
}

/** The things an agent installs: skills, plugins and the Docs MCP's tools. */
function artefacts(root) {
  const skills = [];
  for (const dir of [join(root, 'skills-src'), join(root, 'plugins', 'nhcx', 'skills')]) {
    if (!isDir(dir)) continue;
    for (const name of readdirSync(dir)) {
      if (existsSync(join(dir, name, 'SKILL.md'))) skills.push(name);
    }
  }
  const plugins = {};
  const pluginsDir = join(root, 'plugins');
  if (isDir(pluginsDir)) {
    for (const name of readdirSync(pluginsDir)) {
      const manifest = join(pluginsDir, name, '.claude-plugin', 'plugin.json');
      if (!existsSync(manifest)) continue;
      const json = JSON.parse(readFileSync(manifest, 'utf8'));
      plugins[json.name ?? name] = String(json.version ?? '');
    }
  }
  const mcpFile = join(root, 'mcp', 'internal', 'server', 'mcp.go');
  const mcpTools = existsSync(mcpFile)
    ? sortedUnique([...readFileSync(mcpFile, 'utf8').matchAll(/^\s*Name:\s*"([a-z_]+)"/gm)].map((m) => m[1]))
    : [];
  return {skills: sortedUnique(skills), plugins, mcpTools};
}

/**
 * Every fact in one checkout, keyed the way the committed snapshot is laid
 * out: one entry per module under `modules`, and one `site` entry for what
 * belongs to no module.
 */
/**
 * A source file as the facts key it: the part after `.raw/`, the set and the
 * file, so moving a set between gateway folders is not news from NHA.
 */
export const sourceKey = (file) => {
  const at = file.lastIndexOf('/.raw/');
  return at === -1 ? file : file.slice(at + '/.raw/'.length);
};

export function extractFacts(root) {
  const modules = {};
  for (const {gateway, dir: base} of specRoots(root)) {
    {
      for (const version of readdirSync(base)) {
        const dir = join(base, version);
        if (version.startsWith('.') || !isDir(dir)) continue;
        for (const file of readdirSync(dir)) {
          if (!/\.ya?ml$/.test(file)) continue;
          const spec = parse(readFileSync(join(dir, file), 'utf8'));
          if (!spec?.openapi) continue;
          const facts = moduleFacts(gateway, version, file, spec);
          facts.errors = errorCodes(dir, facts.module);
          modules[`${gateway}-${facts.module}`] = facts;
        }
      }
    }
  }
  return sortKeys({modules, site: {...artefacts(root), ...declared(root)}});
}

/** The module facts file name, and the site one. */
export const factsFileFor = (key) => `${key}.json`;
export const SITE_FACTS = '_site.json';
