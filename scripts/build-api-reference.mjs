// Builds the API reference from the OpenAPI files: one page per operation,
// one sidebar entry per operation, and the data each page renders.
//
// The spec tree is the source of structure: a YAML at catalogue/openapi/
// <platform>/<version>/<spec>.yaml renders under site/docs/<platform>/
// <version>/api. Each spec names its module in info.x-portal ({module, label,
// position}); the filename stem is the Scalar route (/reference/<stem>).
// Everything under .../api/<module>/endpoints, the generated reference pages
// and site/src/data/api are build outputs. Edit the specs, not the output.
import {existsSync, readdirSync, readFileSync, writeFileSync, mkdirSync, rmSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {listSpecTree} from './specs.mjs';
import {joinKey, hostOf} from './lib/api-join.mjs';
import {loadJourneys, operationIndex, stepDataName} from './lib/journeys.mjs';
import {errorsFromSpec} from './lib/spec-errors.mjs';
import {cleanTitle, cleanGroupLabel, caseTerms, imperative, cleanDescription} from './lib/titles.mjs';
import {fixProse} from './lib/prose.mjs';

/**
 * Write a page this script owns, refusing to destroy one a person wrote.
 *
 * Generated pages carry `generated: true` in their frontmatter. A file that
 * exists without that marker was authored by hand and sitting at a name this
 * script also wants, so it is left alone and reported. Silently overwriting it
 * loses the only copy of somebody's writing.
 */
const clobbered = [];
function writeGenerated(path, content) {
  if (existsSync(path) && !/^generated: true$/m.test(readFileSync(path, 'utf8'))) {
    clobbered.push(path);
    return;
  }
  writeFileSync(path, content);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'site', 'src', 'data', 'api');
const sidebarFile = join(root, 'site', 'src', 'data', 'api-sidebar.json');
// Where a call NHA names in a certification sheet is published here, and what
// it answers with. The test matrix joins its rows against this rather than
// carrying routes of its own, because a route is decided by this script and an
// atom written before the site is built cannot know one.
const routesFile = join(root, 'site', 'src', 'data', 'api-routes.json');
const apiRoutes = [];

const METHODS = ['get', 'put', 'post', 'delete', 'patch', 'options', 'head'];

// Hand written titles, keyed by operationId, for the operations whose summary
// names nothing a rule can rescue. Kept outside the specifications because
// ingest-nha.mjs rewrites those on every NHA drop. See the file's own header.
const titleOverrides = (() => {
  // At the catalogue root, outside catalogue/openapi entirely: listSpecTree
  // treats a YAML under <platform>/<version> as a module, and lint:agent reads
  // every YAML anywhere under openapi/ as a specification. This is neither.
  const file = join(root, 'catalogue', 'titles.yaml');
  if (!existsSync(file)) return {};
  return parse(readFileSync(file, 'utf8')) ?? {};
})();

const slug = (s) =>
  s
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

/** Local $ref resolution. The specs only reference their own components. */
function deref(spec, node, depth = 0) {
  if (!node || typeof node !== 'object' || depth > 8) return node;
  if (node.$ref?.startsWith('#/')) {
    const target = node.$ref
      .slice(2)
      .split('/')
      .reduce((acc, key) => acc?.[key], spec);
    return deref(spec, target, depth + 1);
  }
  if (Array.isArray(node)) return node.map((n) => deref(spec, n, depth + 1));
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    out[key] = deref(spec, value, depth + 1);
  }
  return out;
}

// The identifiers ABDM never takes raw. In an M1 request body each is RSA
// encrypted against NHA's public key before it is sent, so the try-it console
// takes the raw value and encrypts it in the browser. This list scopes that
// treatment; `fields()` only ever walks request bodies, so a `loginId` in a
// response is never in this set.
const ENCRYPTED_FIELDS = new Set(['loginId', 'aadhaar', 'otpValue', 'password']);

/** Flatten a JSON schema into rows a table can render, two levels deep. */
function fields(schema, prefix = '', depth = 0) {
  if (!schema || depth > 3) return [];
  const required = new Set(schema.required ?? []);
  const rows = [];
  for (const [name, raw] of Object.entries(schema.properties ?? {})) {
    const property = raw ?? {};
    const type = property.type === 'array'
      ? `${property.items?.type ?? 'object'}[]`
      : property.type ?? 'object';
    rows.push({
      name: prefix ? `${prefix}.${name}` : name,
      type,
      required: required.has(name),
      description: property.description ?? '',
      enum: property.enum,
      format: property.format,
      encrypted: property['x-abdm-encrypted'] === true || ENCRYPTED_FIELDS.has(name),
    });
    const child = property.type === 'array' ? property.items : property;
    if (child?.properties) {
      rows.push(...fields(child, prefix ? `${prefix}.${name}` : name, depth + 1));
    }
  }
  return rows;
}

/**
 * Build a request body from the schema when the specification carries no
 * example of its own.
 *
 * The schema is the contract, so deriving the sample from it means the two
 * cannot drift: a field added to the schema appears in the sample on the next
 * build, and a sample can never show a field the schema does not have. Values
 * the specification states are used as written; everything else becomes a
 * named placeholder, so a reader can see what to substitute.
 */
function sampleFromSchema(schema, name = '', depth = 0) {
  if (!schema || depth > 6) return undefined;
  if (schema.example !== undefined) return schema.example;
  if (Array.isArray(schema.enum) && schema.enum.length > 0) return schema.enum[0];

  const type =
    schema.type ?? (schema.properties ? 'object' : schema.items ? 'array' : 'string');

  if (type === 'object') {
    const properties = schema.properties ?? {};
    const out = {};
    for (const [key, value] of Object.entries(properties)) {
      const sample = sampleFromSchema(value, key, depth + 1);
      if (sample !== undefined) out[key] = sample;
    }
    return Object.keys(out).length > 0 ? out : undefined;
  }
  if (type === 'array') {
    const item = sampleFromSchema(schema.items, name, depth + 1);
    return item === undefined ? [] : [item];
  }
  if (type === 'integer' || type === 'number') return 0;
  if (type === 'boolean') return false;

  // A string. Formats that have one obvious shape get it; the rest become a
  // placeholder named after the field, matching the curl samples' convention.
  if (schema.format === 'uuid') return '5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11';
  if (schema.format === 'date-time') return '2026-08-24T10:15:30.000Z';
  if (schema.format === 'date') return '2026-08-24';
  const placeholder = (name || 'value')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^A-Za-z0-9]+/g, '_')
    .toUpperCase();
  return `<${placeholder}>`;
}

function firstExample(content) {
  const media = content?.['application/json'];
  if (!media) return undefined;
  if (media.example !== undefined) return media.example;
  const examples = Object.values(media.examples ?? {});
  return examples[0]?.value;
}

const UNDOCUMENTED_BODY = /^Response body:\s*not documented\.?$/i;

// A specification hard wraps its descriptions near column 72, so the first
// *line* is usually a fragment. Taking it left a quarter of the endpoint
// pages with a meta description ending mid sentence, and that string is what
// a link preview shows when somebody pastes the page into a chat. Take the
// first paragraph, reflow it, drop the inline markdown, and cut on a word
// boundary rather than mid word.
function metaDescription(operation) {
  const source = (operation.description || operation.summary || '').trim();
  const plain = source
    .split(/\n{2,}/)[0]
    .replace(/\s*\n\s*/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .trim();
  if (plain.length <= 160) return plain;
  const cut = plain.slice(0, 157);
  const boundary = cut.lastIndexOf(' ');
  return `${(boundary > 100 ? cut.slice(0, boundary) : cut).trimEnd()}...`;
}

// The credentials a call carries come from `security`, which names a scheme,
// not from the header parameters. A curl assembled only from parameters is
// therefore missing the one header every authenticated ABDM call needs, and
// pasting it returns 401. Only the header borne schemes produce a line: a
// query or cookie scheme belongs elsewhere in the request, and none is
// declared in this catalogue.
function securityHeaders(security = []) {
  return security.flatMap((entry) => {
    if (entry.type === 'http' && entry.scheme === 'bearer') {
      return [{name: 'Authorization'}];
    }
    if (entry.type === 'apiKey' && entry.in === 'header' && entry.headerName) {
      return [{name: entry.headerName}];
    }
    return [];
  });
}

// One request, described once. The three samples below all render from this,
// so a header added to the curl cannot go missing from the Python.
function requestFor(operation) {
  // A scheme whose header is also declared as a parameter keeps the
  // parameter, because that carries the better example. Anything the
  // parameters do not cover is added ahead of them.
  const declared = new Set(operation.headers.map((h) => h.name.toLowerCase()));
  const headers = [
    ...securityHeaders(operation.security).filter(
      (h) => !declared.has(h.name.toLowerCase()),
    ),
    ...operation.headers,
  ].map((header) => ({
    name: header.name,
    value:
      header.name.toLowerCase() === 'authorization'
        ? 'Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
        : header.example ?? `<${header.name.toUpperCase().replace(/-/g, '_')}>`,
  }));
  if (operation.requestExample !== undefined) {
    headers.push({name: 'Content-Type', value: 'application/json'});
  }
  return {
    method: operation.method,
    url: `${operation.server}${operation.path}`,
    headers,
    body: operation.requestExample,
  };
}

function curlFor(operation) {
  const {method, url, headers, body} = requestFor(operation);
  const lines = [`curl --request ${method} \\`, `  --url ${url} \\`];
  for (const header of headers) {
    lines.push(`  --header '${header.name}: ${header.value}' \\`);
  }
  if (body !== undefined) {
    lines.push(`  --data '${JSON.stringify(body, null, 2)}'`);
  } else {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\$/, '');
  }
  return lines.join('\n');
}

// requests and fetch, because they are what an integrator already has: no
// SDK to install, and nothing here that a reader has to translate back into
// their own stack. Placeholders keep the curl's shape, so the three samples
// substitute the same way.
function pythonFor(operation) {
  const {method, url, headers, body} = requestFor(operation);
  const lines = ['import requests', '', `response = requests.${method.toLowerCase()}(`];
  lines.push(`    ${JSON.stringify(url)},`);
  lines.push('    headers={');
  for (const header of headers) {
    lines.push(`        ${JSON.stringify(header.name)}: ${JSON.stringify(header.value)},`);
  }
  lines.push('    },');
  if (body !== undefined) {
    const json = JSON.stringify(body, null, 4)
      .split('\n')
      .map((line, index) => (index === 0 ? line : `    ${line}`))
      .join('\n');
    lines.push(`    json=${json},`);
  }
  lines.push(')', '', 'print(response.status_code, response.text)');
  return lines.join('\n');
}

function nodeFor(operation) {
  const {method, url, headers, body} = requestFor(operation);
  const lines = [`const response = await fetch(${JSON.stringify(url)}, {`];
  lines.push(`  method: ${JSON.stringify(method)},`);
  lines.push('  headers: {');
  for (const header of headers) {
    lines.push(`    ${JSON.stringify(header.name)}: ${JSON.stringify(header.value)},`);
  }
  lines.push('  },');
  if (body !== undefined) {
    const json = JSON.stringify(body, null, 2)
      .split('\n')
      .map((line, index) => (index === 0 ? line : `  ${line}`))
      .join('\n');
    lines.push(`  body: JSON.stringify(${json}),`);
  }
  lines.push('});', '', 'console.log(response.status, await response.text());');
  return lines.join('\n');
}

// Clear previous output so a renamed operation cannot linger.
rmSync(dataDir, {recursive: true, force: true});
mkdirSync(dataDir, {recursive: true});

const tree = listSpecTree();
const sidebar = [];
let count = 0;

// The journey order is defined in exactly one place: the journey files under
// catalogue/openapi/hiecm/v3/journeys. Each names its steps as operationIds,
// in the order a reader walks them, so the sidebar follows the journey
// without the order being copied anywhere else.
const journeys = loadJourneys();
const opIndex = operationIndex();

for (const {platform, version, files} of tree) {
  // A spec places itself: info.x-portal names the module folder, the sidebar
  // label and the order; the filename stem is the Scalar route.
  const modules = files
    .map((file) => {
      const spec = parse(readFileSync(file.path, 'utf8'));
      const portal = spec.info?.['x-portal'] ?? {};
      const stem = file.name.replace(/\.(yaml|json)$/, '');
      return {
        id: portal.module ?? stem,
        label: portal.label ?? spec.info?.title ?? stem,
        position: portal.position,
        // A lucide name, matched by a sidebar-icon--* rule in sidebar.css. A
        // module that declares none falls back to the neutral mark the same
        // stylesheet gives every other group, so a new specification renders
        // correctly before anyone has picked its icon.
        icon: portal.icon,
        dir: portal.module ?? stem,
        file: file.name,
        route: `/reference/${stem}`,
        spec,
      };
    })
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999) || a.file.localeCompare(b.file));

  const docsDir = join(root, 'site', 'docs', platform, version, 'api');
  // Only HIE-CM v3 has a troubleshooting section and the callback atoms today;
  // the other gateways would link to pages and claim atoms that do not exist.
  const isHiecmV3 = platform === 'hiecm' && version === 'v3';
  for (const module of modules) {
    rmSync(join(docsDir, module.dir, 'endpoints'), {recursive: true, force: true});
  }
  // A module folder left behind by a specification that no longer exists still
  // imports the data files this run deletes, which fails the site build. The
  // generator owns this folder, so it removes what it does not write.
  if (existsSync(docsDir)) {
    const kept = new Set(modules.map((m) => m.dir));
    for (const entry of readdirSync(docsDir, {withFileTypes: true})) {
      if (entry.isDirectory() && !kept.has(entry.name)) {
        rmSync(join(docsDir, entry.name), {recursive: true, force: true});
      }
    }
  }

  // ---- which call each callback belongs to ----
  //
  // A specification declares its webhooks at module level, so the pairing with
  // a single operation is not in the shape of the file. It is stated per
  // webhook instead: `x-abdm-triggered-by` names the call that produces the
  // callback, `x-abdm-answered-by` names the call you make in reply. Both name
  // an operationId, which may sit in another module's specification, so the
  // index below spans every module of this gateway version.
  //
  // A webhook carrying neither key has no stated pairing. It is never guessed
  // at: its own page says the specification does not name a call, and the API
  // index lists it under the module that declares it.
  // An operation a journey names has no page outside it, so its route is the
  // first step that names it, in the order the journey files list them.
  const operationPage = (moduleDir, id) => {
    const base = `/docs/${platform}/${version}/api/${moduleDir}/endpoints`;
    for (const journey of isHiecmV3 ? journeys.get(moduleDir) ?? [] : []) {
      const i = journey.steps.findIndex((step) => step.op === id);
      if (i >= 0) return `${base}/${journey.id}/${String(i + 1).padStart(2, '0')}-${slug(id)}`;
    }
    return `${base}/${slug(id)}`;
  };

  // A status code on a reference page was a dead end. The troubleshooting
  // section already knows what a blanket 401 means and what a 202 followed by
  // silence means, and each module's errors page lists the codes it returns,
  // and none of it was linked from the place the reader meets the failure.
  // Only HIE-CM v3 has those pages, so only it gets the links.
  const helpFor = (status, moduleDir) => {
    if (!isHiecmV3) return undefined;
    const troubleshooting = (name) => `/docs/${platform}/${version}/troubleshooting/${name}`;
    if (status === '401') {
      return {label: 'Everything returns 401', href: troubleshooting('everything-returns-401')};
    }
    if (status === '202') {
      return {label: 'The callback never arrives', href: troubleshooting('callback-never-arrives')};
    }
    // Only a module that gets an errors page (see the error pages below) is
    // linked to one.
    const owner = modules.find((m) => m.dir === moduleDir);
    const hasErrorsPage = owner && (errorsFromSpec(owner.spec).length || Object.keys(owner.spec.webhooks ?? {}).length);
    if (/^[45]/.test(status) && hasErrorsPage) {
      return {
        label: 'Error codes for this module',
        href: `/docs/${platform}/${version}/api/${moduleDir}/errors`,
      };
    }
    return undefined;
  };

  const operations = new Map();
  for (const module of modules) {
    for (const [path, item] of Object.entries(module.spec.paths ?? {})) {
      for (const method of METHODS) {
        const op = item?.[method];
        if (!op) continue;
        const id = op.operationId ?? slug(`${method}-${path}`);
        operations.set(id, {
          summary: (op.summary ?? id).trim(),
          route: operationPage(module.dir, id),
        });
      }
    }
  }

  // operationId -> the callbacks its page shows. Callback id -> its pairing.
  const callbacksByOperation = new Map();
  const pairingByCallback = new Map();
  const unpairedCallbacks = [];
  for (const module of modules) {
    for (const [path, item] of Object.entries(module.spec.webhooks ?? {})) {
      for (const method of METHODS) {
        const hook = item?.[method];
        if (!hook) continue;
        const id = hook.operationId ?? slug(`${method}-${path}`);
        const entry = {
          module: module.label,
          method: method.toUpperCase(),
          path,
          summary: (hook.summary ?? '').trim(),
          route: operationPage(module.dir, id),
        };
        const triggeredBy = hook['x-abdm-triggered-by'];
        const answeredBy = hook['x-abdm-answered-by'];
        const target = triggeredBy ?? answeredBy;
        if (!target || !operations.has(target)) {
          // A journey that walks a call before this callback places it after
          // its trigger, which is documentation enough to leave it off the list.
          const placed = [...journeys.values()].flat().some((journey) => journey.steps.findIndex((step) => step.op === id) > 0);
          if (!(isHiecmV3 && placed)) unpairedCallbacks.push(entry);
          continue;
        }
        entry.relation = triggeredBy ? 'triggered-by' : 'answered-by';
        entry.operation = {id: target, ...operations.get(target)};
        if (!callbacksByOperation.has(target)) callbacksByOperation.set(target, []);
        callbacksByOperation.get(target).push(entry);
        pairingByCallback.set(id, entry);
      }
    }
  }

  // One row per operation and per callback, keyed the way a sheet's URL
  // reduces, so the test matrix can turn "NHA names this call" into a link to
  // the page for it.
  //
  // Callbacks are in here as rows of their own, not only as the `callbacks`
  // of an operation, and that is the half that matters. A certification sheet
  // lists a use case's calls in one column and mixes the two freely: M2's
  // linking cases name `/link/carecontext`, which is a call you make, beside
  // `/consent/request/hip/on-notify`, which is one you receive. Which is
  // which is not in the sheet, it is in the specification, where one sits
  // under `paths` and the other under `webhooks`. So the kind travels with
  // the row and the matrix splits its two columns on it rather than guessing
  // from the path.
  //
  // The `callbacks` list is the second source, and it reaches what the sheets
  // do not name: a use case that names only the call it makes still shows the
  // callback that call produces, where the specification pairs them with
  // x-abdm-triggered-by or x-abdm-answered-by.
  for (const module of modules) {
    const hosts = (module.spec.servers ?? []).map((server) => hostOf(server.url));
    const collect = (kind, section) => {
      for (const [path, item] of Object.entries(section ?? {})) {
        for (const method of METHODS) {
          const op = item?.[method];
          if (!op) continue;
          const id = op.operationId ?? slug(`${method}-${path}`);
          apiRoutes.push({
            key: joinKey(path),
            // Kept as a list because a specification can serve one path on
            // more than one host, and a sheet names exactly one of them.
            hosts,
            kind,
            operationId: id,
            module: module.label,
            moduleDir: module.dir,
            method: method.toUpperCase(),
            path,
            summary: (op.summary ?? id).trim(),
            route: operationPage(module.dir, id),
            // Taken from the pairing above rather than guessed at, so a call
            // with no stated pairing carries none.
            callbacks: (callbacksByOperation.get(id) ?? []).map((entry) => ({
              method: entry.method,
              path: entry.path,
              summary: entry.summary,
              route: entry.route,
              relation: entry.relation,
            })),
          });
        }
      }
    };
    collect('operation', module.spec.paths);
    collect('callback', module.spec.webhooks);
  }

  /** The Callbacks section appended to an operation's page, if it has any. */
  function callbackSection(operationId) {
    const entries = callbacksByOperation.get(operationId) ?? [];
    if (entries.length === 0) return [];
    return [
      '## Callbacks',
      '',
      // No lead sentence: an operation can be the one that produces a callback
      // or the one you send in reply, and each bullet says which it is.
      ...entries.map((entry) =>
        entry.relation === 'triggered-by'
          ? `- After this call, ABDM posts **${entry.summary}** to \`${entry.path}\`. [Open the callback](${entry.route}).`
          : `- You make this call in reply to **${entry.summary}**, which ABDM posts to \`${entry.path}\`. [Open the callback](${entry.route}).`,
      ),
      '',
    ];
  }

  /** The section appended to a callback's own page, saying where it fits. */
  function callbackOriginSection(callbackId, moduleFile) {
    const pairing = pairingByCallback.get(callbackId);
    if (!pairing) {
      return [
        '## Where this fits',
        '',
        `\`${moduleFile}\` declares this callback at module level and names no call against it. Which call produces it is not documented, so this page does not say.`,
        '',
      ];
    }
    return [
      '## Where this fits',
      '',
      pairing.relation === 'triggered-by'
        ? `You produce this callback by calling [${pairing.operation.summary}](${pairing.operation.route}).`
        : `Answer this callback by calling [${pairing.operation.summary}](${pairing.operation.route}).`,
      '',
    ];
  }

  for (const [moduleIndex, module] of modules.entries()) {
    const spec = module.spec;
    const servers = (spec.servers ?? []).map((s) => ({
      url: s.url,
      description: s.description ?? '',
    }));
    // What a specification *declares* is a superset of what a call
    // *requires*: m1 declares three schemes and requires one. The requirement
    // is stated in `security`, on the operation or at root, and reading the
    // declaration instead is what listed Authorization on the page twice.
    // An empty `security: []` is a real answer meaning this call takes no
    // credential, so it is distinguished from the key being absent.
    const securitySchemes = spec.components?.securitySchemes ?? {};
    const describeScheme = (name) => {
      const scheme = securitySchemes[name];
      if (!scheme) {
        console.warn(
          `  ! ${module.file}: security names "${name}", which the specification does not declare`,
        );
        return [];
      }
      return [{
        name,
        type: scheme.type,
        scheme: scheme.scheme,
        in: scheme.in,
        headerName: scheme.name,
        description: scheme.description ?? '',
      }];
    };
    const securityFor = (op) => {
      const requirement = op.security ?? spec.security ?? [];
      const names = [...new Set(requirement.flatMap((entry) => Object.keys(entry)))];
      return names.flatMap(describeScheme);
    };
    const byTag = new Map();

    // An operation a journey names is published under that journey, once per
    // journey that names it. What is left over is everything no journey walks.
    const named = new Set(
      [...(journeys.get(module.id) ?? [])].flatMap((j) => j.steps.map((s) => s.op)),
    );

    const entries = [];
    for (const [path, item] of Object.entries(spec.paths ?? {})) {
      for (const method of METHODS) {
        if (item?.[method]) entries.push({path, method, kind: 'operation', op: item[method], shared: item.parameters});
      }
    }
    for (const [name, item] of Object.entries(spec.webhooks ?? {})) {
      for (const method of METHODS) {
        if (item?.[method]) entries.push({path: name, method, kind: 'callback', op: item[method], shared: item.parameters});
      }
    }

    for (const entry of entries) {
      const op = deref(spec, entry.op);
      const shared = deref(spec, entry.shared ?? []);
      const parameters = [...(shared ?? []), ...(op.parameters ?? [])];
      const requestSchema = op.requestBody?.content?.['application/json']?.schema;
      const responses = Object.entries(op.responses ?? {}).map(([status, response]) => ({
        status,
        // "not documented" is this repo's own placeholder from an early
        // ingest, not NHA's wording, and it dead ends the reader: it reports
        // that we failed rather than telling them what to do. The absence is
        // real and must not be papered over with an invented schema, so the
        // sentence says what is true and points at the one thing on the page
        // that will answer it.
        description: UNDOCUMENTED_BODY.test((response.description ?? '').trim())
          ? 'The specification does not describe this body. Send the call with Try it to see what comes back.'
          : response.description ?? '',
        // An explicit example wins; otherwise the response schema supplies
        // one, same as the request side, so a status with a documented body
        // never renders as prose alone.
        example:
          firstExample(response.content) ??
          sampleFromSchema(response.content?.['application/json']?.schema),
        help: helpFor(status, module.dir),
      }));

      const id = op.operationId ?? slug(`${entry.method}-${entry.path}`);
      const name = slug(id);
      // The reader picks a journey. Everything the journeys do not name falls
      // into one group at the end rather than into tags of its own; an
      // operation a journey names is read through that journey, so it carries
      // no tag and gets no page outside the journey.
      const unnamed = !named.has(id);
      const tag = unnamed ? 'Other operations' : undefined;

      const operation = {
        id,
        module: module.label,
        moduleId: module.id,
        kind: entry.kind,
        method: entry.method.toUpperCase(),
        path: entry.path,
        server: servers[0]?.url ?? '',
        servers,
        summary: caseTerms(fixProse(op.summary ?? id)),
        // What a heading, a sidebar row and a table cell show. NHA's summary
        // is a sentence of documentation, so it stays as the description and
        // this carries the name. Always an instruction starting with a verb.
        // `x-abdm-title` overrides it where NHA's summary names nothing a rule
        // can rescue. See scripts/lib/titles.mjs.
        title: titleOverrides[id]
          ? caseTerms(titleOverrides[id])
          : imperative(cleanTitle(op.summary, {path: entry.path, method: entry.method}), {
              method: entry.method,
              kind: entry.kind,
            }),
        description: cleanDescription(op.description),
        security: securityFor(op),
        headers: parameters
          .filter((p) => p.in === 'header')
          .map((p) => ({
            name: p.name,
            required: Boolean(p.required),
            description: p.description ?? '',
            example: p.example ?? p.schema?.example,
            type: p.schema?.type ?? 'string',
          })),
        pathParams: parameters
          .filter((p) => p.in === 'path')
          .map((p) => ({name: p.name, required: true, description: p.description ?? '', type: p.schema?.type ?? 'string'})),
        queryParams: parameters
          .filter((p) => p.in === 'query')
          .map((p) => ({name: p.name, required: Boolean(p.required), description: p.description ?? '', type: p.schema?.type ?? 'string'})),
        body: fields(requestSchema),
        // An explicit example wins; otherwise the schema supplies one, so the
        // panel and the curl are never blank for an operation that takes a body.
        requestExample:
          firstExample(op.requestBody?.content) ?? sampleFromSchema(requestSchema),
        responses,
        tag,
      };
      operation.curl = curlFor(operation);
      // `curl` stays as it was: the console, the page markdown and llms-full
      // all read it by that name. The other two sit beside it.
      operation.samples = [
        {id: 'curl', label: 'cURL', language: 'bash', code: operation.curl},
        {id: 'python', label: 'Python', language: 'python', code: pythonFor(operation)},
        {id: 'node', label: 'Node', language: 'javascript', code: nodeFor(operation)},
      ];

      writeFileSync(
        join(dataDir, `${name}.json`),
        `${JSON.stringify(operation, null, 2)}\n`,
      );

      // The JSON is written for every operation, because the journey step
      // pages read it. The page beside it is written only when no journey
      // names the operation, so nothing is published twice.
      if (unnamed) {
      const endpointsDir = join(docsDir, module.dir, 'endpoints');
      mkdirSync(endpointsDir, {recursive: true});
      const frontMatter = [
        '---',
        `title: ${JSON.stringify(operation.title)}`,
        `sidebar_label: ${JSON.stringify(operation.title)}`,
        `sidebar_class_name: api-method api-method--${operation.method.toLowerCase()}`,
        `description: ${JSON.stringify(metaDescription(operation))}`,
        'hide_table_of_contents: true',
        'hide_title: true',
        'wrapperClassName: api-doc',
        `source: ${module.file}`,
        'generated: true',
        '---',
        '',
        "import ApiEndpoint from '@site/src/components/api/ApiEndpoint';",
        `import operation from '@site/src/data/api/${name}.json';`,
        '',
        '<ApiEndpoint operation={operation} />',
        '',
        // The callback belongs with the call, not on a page of its own listing
        // every webhook the gateway has. An operation shows the callbacks a
        // specification ties to it; a callback shows the call it pairs with,
        // or says that no specification names one.
        ...(entry.kind === 'callback'
          ? callbackOriginSection(id, module.file)
          : callbackSection(id)),
      ].join('\n');
      writeFileSync(join(endpointsDir, `${name}.mdx`), frontMatter);

        if (!byTag.has(tag)) byTag.set(tag, []);
        byTag.get(tag).push({
          type: 'doc',
          id: `${platform}/${version}/api/${module.dir}/endpoints/${name}`,
          label: operation.title,
          className: `api-method api-method--${operation.method.toLowerCase()}`,
        });
      }
      count += 1;
    }

    // ---- one page per journey step ----
    //
    // A call more than one journey names gets a page under each of them,
    // opening on that journey's own request example, so every method reads
    // as a complete sequence rather than sending the reader elsewhere.
    const journeyGroups = [];
    for (const journey of journeys.get(module.id) ?? []) {
      const items = [];
      journey.steps.forEach((step, i) => {
        const entry = opIndex.get(step.op);
        if (!entry) throw new Error(`${module.id}/${journey.id}: unknown operation ${step.op}`);
        const baseFile = join(dataDir, `${slug(step.op)}.json`);
        if (!existsSync(baseFile)) {
          throw new Error(
            `${module.id}/${journey.id} step ${i + 1}: ${step.op} has no generated page yet. ` +
              'A journey may only name an operation from its own module or from one built before it.',
          );
        }
        const base = JSON.parse(readFileSync(baseFile, 'utf8'));
        const nn = String(i + 1).padStart(2, '0');
        const stepped = {...base, journey: {id: journey.id, title: journey.title, step: i + 1, of: journey.steps.length, optional: Boolean(step.optional)}};
        if (step.example) {
          const ex = entry.op.requestBody?.content?.['application/json']?.examples?.[step.example];
          if (!ex) throw new Error(`${module.id}/${journey.id} step ${i + 1}: no example "${step.example}" on ${step.op}`);
          stepped.requestExample = ex.value;
          stepped.exampleName = step.example;
          stepped.curl = curlFor(stepped);
          stepped.samples = [
            {id: 'curl', label: 'cURL', language: 'bash', code: stepped.curl},
            {id: 'python', label: 'Python', language: 'python', code: pythonFor(stepped)},
            {id: 'node', label: 'Node', language: 'javascript', code: nodeFor(stepped)},
          ];
        }
        const dataName = stepDataName(step.op, journey.id, i);
        writeFileSync(join(dataDir, `${dataName}.json`), `${JSON.stringify(stepped, null, 2)}\n`);
        const dir = join(docsDir, module.dir, 'endpoints', journey.id);
        mkdirSync(dir, {recursive: true});
        const title = `${i + 1}. ${stepped.title}${step.optional ? ' (optional)' : ''}`;
        writeFileSync(join(dir, `${nn}-${slug(step.op)}.mdx`), [
          '---',
          // The step number stays in the id. Docusaurus strips an "NN-" file
          // prefix by default, which collides when one journey names the same
          // operation twice, and leaves the sidebar ids below pointing nowhere.
          `id: ${nn}-${slug(step.op)}`,
          `title: ${JSON.stringify(title)}`,
          `sidebar_label: ${JSON.stringify(title)}`,
          `sidebar_class_name: api-method api-method--${stepped.method.toLowerCase()}`,
          `description: ${JSON.stringify(metaDescription(stepped))}`,
          'hide_table_of_contents: true', 'hide_title: true', 'wrapperClassName: api-doc',
          `source: ${module.file}`, 'generated: true',
          '---', '',
          "import ApiEndpoint from '@site/src/components/api/ApiEndpoint';",
          `import operation from '@site/src/data/api/${dataName}.json';`,
          '', '<ApiEndpoint operation={operation} />', '',
          ...(entry.kind === 'callback' ? callbackOriginSection(step.op, module.file) : callbackSection(step.op)),
        ].join('\n'));
        items.push({type: 'doc', id: `${platform}/${version}/api/${module.dir}/endpoints/${journey.id}/${nn}-${slug(step.op)}`, label: title, className: `api-method api-method--${stepped.method.toLowerCase()}`});
        count += 1;
      });
      journeyGroups.push({label: journey.title, items});
    }

    // The module folder is a sidebar category. Its label and order come from
    // the specification, so a dropped YAML places itself in the tree. The
    // endpoints folder is pinned between the module's guide pages and its
    // errors page; the sidebar generator swaps it for the use-case groups.
    mkdirSync(join(docsDir, module.dir), {recursive: true});
    writeFileSync(
      join(docsDir, module.dir, '_category_.json'),
      `${JSON.stringify(
        {
          label: module.label,
          position: moduleIndex + 2,
          ...(module.icon && {
            className: `sidebar-icon sidebar-icon--${module.icon}`,
          }),
        },
        null,
        2,
      )}\n`,
    );
    if (entries.length > 0) {
      writeFileSync(
        join(docsDir, module.dir, 'endpoints', '_category_.json'),
        `${JSON.stringify({label: 'Endpoints', position: 50}, null, 2)}\n`,
      );
    }

    // Journeys whose titles share the part before the comma are one family:
    // "ABHA creation, Aadhaar OTP" and "ABHA creation, Aadhaar biometric" fold
    // into an "ABHA creation" section with the variants as children. The split
    // is presentation only; the title in the journey file stays the one name.
    // Journeys come first and the leftovers last.
    const pretty = (tag) => cleanGroupLabel(tag);
    const families = new Map();
    for (const {label: title, items} of [
      ...journeyGroups,
      ...[...byTag.entries()].map(([label, items]) => ({label, items})),
    ]) {
      const label = pretty(title);
      const comma = label.indexOf(', ');
      const family = comma === -1 ? label : label.slice(0, comma);
      if (!families.has(family)) families.set(family, []);
      families.get(family).push({label, items});
    }
    const groups = [...families.entries()].map(([family, members]) =>
      members.length === 1
        ? members[0]
        : {
            label: family,
            children: members.map((member) => {
              const variant = member.label.slice(family.length + 2) || member.label;
              return {
                label: caseTerms(variant.replace(/^./, (c) => c.toUpperCase())),
                items: member.items,
              };
            }),
          },
    );

    sidebar.push({
      platform,
      version,
      moduleId: module.id,
      moduleDir: `${platform}/${version}/api/${module.dir}`,
      label: module.label,
      route: module.route,
      // Which integrator roles this module is for. Declared in the spec as
      // info.x-abdm-roles, so the sidebar's role switcher is driven by the
      // catalogue rather than by a list kept in the site.
      roles: module.spec?.info?.['x-abdm-roles'] ?? [],
      groups,
    });
  }

  // The overview index: one line per module, linking into the endpoints.
  const indexLines = [
    '---',
    'title: API references',
    'sidebar_label: All endpoints',
    'sidebar_position: 1',
    'description: Every operation published for this gateway, module by module.',
    'source: the published OpenAPI specifications',
    'generated: true',
    '---',
    '',
    '# API references',
    '',
    'Every endpoint below is generated from the specification that declares it. Each one has its own page with the headers, the body and a request you can send.',
    '',
    'This page lists every module, including any that the role you have chosen does not use. The sidebar shows only yours.',
    '',
    ...(isHiecmV3
      ? [
          'In M2 and M3 a call is acknowledged now and answered later. The answer arrives as a callback, a POST from ABDM to the URL you registered, declared in the specification as a webhook. Each callback is shown on the call it belongs to, and has a page of its own under that module.',
          '',
        ]
      : []),
  ];

  for (const module of modules) {
    const entry = sidebar.find(
      (s) => s.platform === platform && s.version === version && s.moduleId === module.id,
    );
    // A family group holds its endpoints one level down, in its children.
    const flatGroups = entry.groups.flatMap((g) => g.children ?? [g]);
    const total = flatGroups.reduce((n, g) => n + g.items.length, 0);
    indexLines.push(`## ${module.label}`);
    indexLines.push('');
    indexLines.push(
      total
        ? `${total} endpoint${total === 1 ? '' : 's'} across ${
            entry.groups.length
          } use case${entry.groups.length === 1 ? '' : 's'}: ${entry.groups
            .map((g) => g.label)
            .join(', ')}. Each endpoint has its own page in the sidebar.`
        : 'No endpoint is published in this specification yet.',
    );
    indexLines.push('');
    indexLines.push(`[Read the whole specification](${module.route})`);
    indexLines.push('');
  }

  // The callbacks no specification pairs with a call. They are named here
  // rather than shown against an operation that may not be the one, so a
  // reader can still find them without being told something NHA has not said.
  if (unpairedCallbacks.length > 0) {
    indexLines.push('## Callbacks with no documented trigger');
    indexLines.push('');
    indexLines.push(
      `${unpairedCallbacks.length} callback${
        unpairedCallbacks.length === 1 ? ' is' : 's are'
      } declared at module level with no call named against ${
        unpairedCallbacks.length === 1 ? 'it' : 'them'
      }. Which call produces ${
        unpairedCallbacks.length === 1 ? 'it' : 'each one'
      } is not documented, so this page does not say.`,
    );
    indexLines.push('');
    indexLines.push('| Module | Method | Arrives at | What it carries |');
    indexLines.push('| --- | --- | --- | --- |');
    for (const entry of unpairedCallbacks) {
      indexLines.push(
        `| ${entry.module} | <span class="api-chip api-chip--${entry.method.toLowerCase()}">${
          entry.method
        }</span> | [\`${entry.path}\`](${entry.route}) | ${entry.summary} |`,
      );
    }
    indexLines.push('');
  }

  mkdirSync(docsDir, {recursive: true});
  writeGenerated(join(docsDir, 'index.md'), `${indexLines.join('\n')}\n`);

  // -------------------------------------------------------------------------
  // The reference pages. Everything below is generated from the
  // specifications, so a fact stated on one of these pages exists in a spec
  // or it does not exist.

  const refDir = join(root, 'site', 'docs', platform, version, 'reference');
  mkdirSync(refDir, {recursive: true});

  // covers names the catalogue atoms a page is the published home for, and
  // scripts/build-atom-routes.mjs reads it to point a support answer at a
  // real page. On a generated page it has to be emitted here: hand-adding it
  // to the file works until the next generator run silently drops it.
  // The sidebar icon has to be emitted here for the same reason as covers:
  // these pages are generated, so front matter added by hand survives until
  // the next run and then disappears. See the `sidebar-icons` skill.
  const frontMatter = (title, label, description, position, covers = [], icon = null) =>
    [
      '---',
      `title: ${title}`,
      `sidebar_label: ${label}`,
      `sidebar_position: ${position}`,
      `description: ${description}`,
        'source: the published OpenAPI specifications',
      'generated: true',
      ...(icon ? [`sidebar_class_name: sidebar-icon sidebar-icon--${icon}`] : []),
      ...(covers.length ? [`covers: [${covers.join(', ')}]`] : []),
      '---',
      '',
    ].join('\n');

  // ---- authentication: security schemes and the headers every call carries ----
  {
    const lines = [
      frontMatter(
        'Authentication',
        'Authentication',
        'The credentials every ABDM call carries, and the headers that go with them.',
        1,
        [],
        'lock-keyhole',
      ),
      '# Authentication',
      '',
      'Generated from the specifications. Every scheme and header below is declared in one of them.',
      '',
    ];

    for (const module of modules) {
      const spec = module.spec;
      const schemes = Object.entries(spec.components?.securitySchemes ?? {});
      const headers = Object.entries(spec.components?.parameters ?? {}).filter(
        ([, p]) => p.in === 'header',
      );
      if (schemes.length === 0 && headers.length === 0) {
        continue;
      }
      lines.push(`## ${module.label}`);
      lines.push('');
      for (const [name, scheme] of schemes) {
        lines.push(
          `**${name}**, \`${scheme.type}\`${scheme.scheme ? ` \`${scheme.scheme}\`` : ''}. ${(
            scheme.description ?? ''
          )
            .replace(/\s+/g, ' ')
            .trim()}`.trimEnd(),
        );
        lines.push('');
      }
      if (headers.length) {
        lines.push('| Header | Required | What it is |');
        lines.push('| --- | --- | --- |');
        for (const [, header] of headers) {
          lines.push(
            `| \`${header.name}\` | ${header.required ? 'yes' : 'no'} | ${(
              header.description ?? ''
            )
              .replace(/\s+/g, ' ')
              .trim()} |`,
          );
        }
        lines.push('');
      }
    }
    writeGenerated(join(refDir, 'authentication.md'), `${lines.join('\n')}\n`);
  }

  // ---- error codes: every code the response examples return ----
  {
    const lines = [
      frontMatter(
        'Error codes',
        'Error codes',
        'Every error code the specifications carry, with its message and what to do.',
        3,
        ['hiecm.concept.error-codes'],
        'circle-alert',
      ),
      '# Error codes',
      '',
      // Only hiecm/v3 has a troubleshooting section today; other platforms
      // and other versions of hiecm would link to a page that does not
      // exist.
      ...(isHiecmV3
        ? [`Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/${platform}/${version}/troubleshooting/).`, '']
        : []),
      'A code is on this page because a response example in a specification returns it.',
      '',
    ];
    let total = 0;
    for (const module of modules) {
      const codes = errorsFromSpec(module.spec);
      if (!codes.length) continue;
      total += codes.length;
      lines.push(`## ${module.label}`, '', '| Code | HTTP | Message | Returned by |', '| --- | --- | --- | --- |');
      for (const e of codes) lines.push(`| \`${e.code}\` | ${e.http} | ${e.message.replace(/\|/g, '\\|')} | \`${e.operationId}\` |`);
      lines.push('');
    }
    lines.push(
      `${total} code${total === 1 ? '' : 's'} are recorded. A code you meet that is not here is one the specifications do not carry yet.`,
    );
    lines.push('');
    writeGenerated(join(refDir, 'error-codes.md'), `${lines.join('\n')}\n`);
    console.log(`Built the ${platform}/${version} error reference from ${total} recorded code(s).`);
  }

  // ---- one error page per module, from that module's own records ----
  for (const module of modules) {
    const spec = module.spec;
    const codes = errorsFromSpec(spec);
    // A spec whose examples return no code and that has no webhooks (the
    // gateway session) gets no errors page; a module in the async flows keeps
    // one even before any code is recorded, so the gap is stated rather than
    // hidden.
    if (!codes.length && !Object.keys(spec.webhooks ?? {}).length) {
      // An errors page an earlier specification produced would otherwise
      // outlive it and keep publishing codes this one does not return.
      const stale = join(docsDir, module.dir, 'errors.md');
      if (existsSync(stale) && /^generated: true$/m.test(readFileSync(stale, 'utf8'))) rmSync(stale);
      continue;
    }

    const lines = [
      '---',
      `title: ${module.label} errors`,
      'sidebar_label: Errors',
      'sidebar_position: 98',
      `description: What ${module.label} returns when a call fails, and what to do about it.`,
        `source: ${module.file}`,
      'generated: true',
      '---',
      '',
      `# ${module.label} errors`,
      '',
      ...(isHiecmV3
        ? [`Seeing a symptom rather than a code? Start at [Troubleshooting](/docs/${platform}/${version}/troubleshooting/).`, '']
        : []),
    ];

    if (codes.length) {
      lines.push('## Codes', '', '| Code | HTTP | Message | Returned by |', '| --- | --- | --- | --- |');
      for (const e of codes) lines.push(`| \`${e.code}\` | ${e.http} | ${e.message.replace(/\|/g, '\\|')} | \`${e.operationId}\` |`);
      lines.push('');
    } else {
      lines.push(
        `The ${module.label} specification records no error code yet. That is a gap in the specification, not a promise that this module cannot fail.`,
      );
      lines.push('');
    }

    lines.push(
      `Every code above is recorded in the specification that owns it. The aggregated list across modules is at [error codes](/docs/${platform}/${version}/reference/error-codes).`,
    );
    lines.push('');

    // The ladder's next rung, as plain HTML so the page stays CommonMark. The
    // classes are the same next-step card the hand written pages render through
    // the PathForward component; hub.css styles both.
    lines.push(
      '<a class="next-step" href="/docs/support">',
      '<span class="next-step__eyebrow">Next</span>',
      '<span class="next-step__label">Still stuck? Ask for help</span>',
      '<span class="next-step__detail">Where to file what you hit, so the answer lands back in these pages.</span>',
      '</a>',
      '',
    );

    const dir = join(docsDir, module.dir);
    mkdirSync(dir, {recursive: true});
    writeGenerated(join(dir, 'errors.md'), `${lines.join('\n')}\n`);
  }

  // ---- the base URLs partial each module's conventions page renders ----
  for (const module of modules) {
    const servers = module.spec.servers ?? [];
    if (!servers.length) continue;
    const lines = [
      '| Environment | Base URL |',
      '| --- | --- |',
      ...servers.map(
        (server) =>
          `| ${(server.description ?? '').replace(/\s+/g, ' ').trim() || 'Not labelled'} | \`${server.url}\` |`,
      ),
      '',
    ];
    const dir = join(docsDir, module.dir);
    mkdirSync(dir, {recursive: true});
    writeFileSync(join(dir, '_servers.md'), `${lines.join('\n')}\n`);
  }
}

writeFileSync(sidebarFile, `${JSON.stringify(sidebar, null, 2)}\n`);
// Sorted, so the file's diff is the operations that changed rather than the
// order the specs happened to be read in.
apiRoutes.sort((a, b) => a.operationId.localeCompare(b.operationId));
writeFileSync(routesFile, `${JSON.stringify(apiRoutes, null, 2)}\n`);
const hooks = apiRoutes.filter((entry) => entry.kind === 'callback').length;
const withCallbacks = apiRoutes.filter((entry) => entry.callbacks.length > 0).length;
console.log(
  `Built ${count} endpoint page(s) from ${tree
    .map((pv) => `${pv.platform}/${pv.version} (${pv.files.length} spec(s))`)
    .join(', ')}.`,
);
console.log(
  `  api-routes.json: ${apiRoutes.length - hooks} operation(s) and ${hooks} callback(s), ` +
    `${withCallbacks} of them paired.`,
);

// A hand written page sitting where a generated one goes is a conflict only a
// person can settle: keep the writing under another name, or delete it and let
// the specification own the page. Failing here is the point, because the
// alternative is publishing a gateway whose reference silently went missing.
if (clobbered.length > 0) {
  console.error(
    [
      '',
      'These pages are written by hand at names this script generates:',
      ...clobbered.map((path) => `  ${path.slice(root.length + 1)}`),
      '',
      'They were left untouched, so their generated versions are missing.',
      'Rename the hand written page, or delete it to let the specification',
      'own that page.',
      '',
    ].join('\n'),
  );
  process.exit(1);
}
