// Builds the API reference from the OpenAPI files: one page per operation,
// one sidebar entry per operation, and the data each page renders.
//
// The spec tree is the source of structure: a YAML at catalogue/openapi/
// <platform>/<version>/<spec>.yaml renders under site/docs/<platform>/
// <version>/api. Each spec names its module in info.x-portal ({module, label,
// position}); the filename stem is the Scalar route (/reference/<stem>).
// Everything under .../api/<module>/endpoints, the generated reference pages
// and site/src/data/api are build outputs. Edit the specs, not the output.
import {existsSync, readFileSync, writeFileSync, mkdirSync, rmSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parse} from 'yaml';
import {listSpecTree} from './specs.mjs';

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

const METHODS = ['get', 'put', 'post', 'delete', 'patch', 'options', 'head'];

// Acronyms stay in capitals wherever a label is built from an identifier.
// A key like `x-abdm-errors-uidai` used to render as the heading "uidai
// codes", which reads as a typo and is one.
const ACRONYMS = new Set([
  'abdm', 'abha', 'api', 'apis', 'eua', 'fhir', 'hfr', 'hip', 'hiu', 'hpr',
  'hspa', 'jwt', 'kyc', 'nha', 'nhcx', 'otp', 'phr', 'qr', 'rsa', 'sms',
  'uhi', 'uidai', 'url', 'uuid',
]);

const label = (text) =>
  String(text)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) =>
      ACRONYMS.has(word.toLowerCase())
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1),
    )
    .join(' ');


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

function curlFor(operation) {
  const lines = [`curl --request ${operation.method} \\`];
  lines.push(`  --url ${operation.server}${operation.path} \\`);
  for (const header of operation.headers) {
    const value = header.name.toLowerCase() === 'authorization'
      ? 'Bearer <ACCESS_TOKEN_FROM_SESSIONS_CALL>'
      : header.example ?? `<${header.name.toUpperCase().replace(/-/g, '_')}>`;
    lines.push(`  --header '${header.name}: ${value}' \\`);
  }
  if (operation.requestExample !== undefined) {
    lines.push(`  --header 'Content-Type: application/json' \\`);
    lines.push(`  --data '${JSON.stringify(operation.requestExample, null, 2)}'`);
  } else {
    lines[lines.length - 1] = lines[lines.length - 1].replace(/ \\$/, '');
  }
  return lines.join('\n');
}

// Clear previous output so a renamed operation cannot linger.
rmSync(dataDir, {recursive: true, force: true});
mkdirSync(dataDir, {recursive: true});

const tree = listSpecTree();
const sidebar = [];
let count = 0;

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
        dir: portal.module ?? stem,
        file: file.name,
        route: `/reference/${stem}`,
        spec,
      };
    })
    .sort((a, b) => (a.position ?? 999) - (b.position ?? 999) || a.file.localeCompare(b.file));

  const docsDir = join(root, 'site', 'docs', platform, version, 'api');
  for (const module of modules) {
    rmSync(join(docsDir, module.dir, 'endpoints'), {recursive: true, force: true});
  }

  for (const [moduleIndex, module] of modules.entries()) {
    const spec = module.spec;
    const servers = (spec.servers ?? []).map((s) => ({
      url: s.url,
      description: s.description ?? '',
    }));
    const security = Object.entries(spec.components?.securitySchemes ?? {}).map(
      ([name, scheme]) => ({
        name,
        type: scheme.type,
        scheme: scheme.scheme,
        description: scheme.description ?? '',
      }),
    );
    const tagInfo = Object.fromEntries(
      (spec.tags ?? []).map((t) => [t.name, t.description ?? '']),
    );

    const byTag = new Map();

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
        description: response.description ?? '',
        example: firstExample(response.content),
      }));

      const id = op.operationId ?? slug(`${entry.method}-${entry.path}`);
      const name = slug(id);
      // The reader picks a journey, not an OpenAPI tag. `x-abdm-use-case` names
      // the journey; the tag is the fallback for a spec that has not been
      // annotated yet.
      const tag = op['x-abdm-use-case'] ?? op.tags?.[0] ?? 'Endpoints';

      const operation = {
        id,
        module: module.label,
        moduleId: module.id,
        kind: entry.kind,
        method: entry.method.toUpperCase(),
        path: entry.path,
        server: servers[0]?.url ?? '',
        servers,
        summary: op.summary ?? id,
        description: op.description ?? '',
        security: op.security === undefined ? security : security.filter((s) => (op.security ?? []).some((entry) => entry[s.name])),
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
        tagDescription: tagInfo[tag] ?? '',
      };
      operation.curl = curlFor(operation);

      writeFileSync(
        join(dataDir, `${name}.json`),
        `${JSON.stringify(operation, null, 2)}\n`,
      );

      const endpointsDir = join(docsDir, module.dir, 'endpoints');
      mkdirSync(endpointsDir, {recursive: true});
      const frontMatter = [
        '---',
        `title: ${JSON.stringify(operation.summary)}`,
        `sidebar_label: ${JSON.stringify(operation.summary)}`,
        `sidebar_class_name: api-method api-method--${operation.method.toLowerCase()}`,
        `description: ${JSON.stringify(
          (operation.description || operation.summary).split('\n')[0].slice(0, 160),
        )}`,
        'hide_table_of_contents: true',
        'hide_title: true',
        'wrapperClassName: api-doc',
        'verification: unverified',
        `source: ${module.file}`,
        'generated: true',
        '---',
        '',
        "import ApiEndpoint from '@site/src/components/api/ApiEndpoint';",
        `import operation from '@site/src/data/api/${name}.json';`,
        '',
        '<ApiEndpoint operation={operation} />',
        '',
      ].join('\n');
      writeFileSync(join(endpointsDir, `${name}.mdx`), frontMatter);

      if (!byTag.has(tag)) byTag.set(tag, []);
      byTag.get(tag).push({
        type: 'doc',
        id: `${platform}/${version}/api/${module.dir}/endpoints/${name}`,
        label: operation.summary,
        className: `api-method api-method--${operation.method.toLowerCase()}`,
      });
      count += 1;
    }

    // The module folder is a sidebar category. Its label and order come from
    // the specification, so a dropped YAML places itself in the tree. The
    // endpoints folder is pinned between the module's guide pages and its
    // errors page; the sidebar generator swaps it for the use-case groups.
    mkdirSync(join(docsDir, module.dir), {recursive: true});
    writeFileSync(
      join(docsDir, module.dir, '_category_.json'),
      `${JSON.stringify({label: module.label, position: moduleIndex + 2}, null, 2)}\n`,
    );
    if (entries.length > 0) {
      writeFileSync(
        join(docsDir, module.dir, 'endpoints', '_category_.json'),
        `${JSON.stringify({label: 'Endpoints', position: 50}, null, 2)}\n`,
      );
    }

    // Use cases whose tags share the part before the comma are one family:
    // "ABHA creation, Aadhaar OTP" and "ABHA creation, Aadhaar biometric" fold
    // into an "ABHA creation" section with the variants as children. The split
    // is presentation only; the tag in the specification stays the one name.
    const pretty = (tag) =>
      /[A-Z]/.test(tag)
        ? tag
        : tag.replace(/-/g, ' ').replace(/^./, (c) => c.toUpperCase());
    const families = new Map();
    for (const [tag, items] of byTag.entries()) {
      const label = pretty(tag);
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
              const variant = member.label.slice(family.length + 2);
              return {
                label: variant.replace(/^./, (c) => c.toUpperCase()),
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
    'verification: unverified',
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
  const frontMatter = (title, label, description, position, covers = []) =>
    [
      '---',
      `title: ${title}`,
      `sidebar_label: ${label}`,
      `sidebar_position: ${position}`,
      `description: ${description}`,
      'verification: unverified',
      'source: the published OpenAPI specifications',
      'generated: true',
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
            .trim()}`,
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

  // ---- callbacks: the webhooks the specifications declare ----
  {
    const lines = [
      frontMatter(
        'Callbacks',
        'Callbacks',
        'The calls ABDM makes back to your bridge, as the specifications declare them.',
        2,
        ['hiecm.concept.asynchronous-callbacks', 'hiecm.decision.callbacks-as-webhooks'],
      ),
      '# Callbacks',
      '',
      'A call you make is acknowledged, and the answer arrives later at your own endpoint. Those inbound calls are declared as webhooks in the specifications, and this page is generated from them.',
      '',
    ];
    let total = 0;
    for (const module of modules) {
      const hooks = Object.entries(module.spec.webhooks ?? {});
      if (hooks.length === 0) {
        continue;
      }
      total += hooks.length;
      lines.push(`## ${module.label}`);
      lines.push('');
      lines.push('| Method | Callback | What it carries |');
      lines.push('| --- | --- | --- |');
      for (const [name, item] of hooks) {
        for (const method of METHODS) {
          if (!item?.[method]) continue;
          lines.push(
            `| \`${method.toUpperCase()}\` | \`${name}\` | ${(
              item[method].summary ?? ''
            ).trim()} |`,
          );
        }
      }
      lines.push('');
    }
    if (total === 0) {
      lines.push(
        'No specification declares a webhook yet. The callbacks each module expects are described in its own pages until they are written into the specification that owns them.',
      );
      lines.push('');
    }
    writeGenerated(join(refDir, 'callbacks.md'), `${lines.join('\n')}\n`);
  }

  // ---- error codes: the x-abdm-errors blocks ----
  {
    const lines = [
      frontMatter(
        'Error codes',
        'Error codes',
        'Every error code the specifications carry, with its message and what to do.',
        3,
        ['hiecm.concept.error-codes'],
      ),
      '# Error codes',
      '',
      'Generated from the specifications. A code is on this page because a specification records it.',
      '',
    ];
    let total = 0;
    for (const module of modules) {
      const spec = module.spec;
      const blocks = Object.keys(spec)
        .filter((key) => key.startsWith('x-abdm-errors'))
        .map((key) => [key, spec[key]]);
      for (const [key, block] of blocks) {
        const ranges = block?.ranges ?? [];
        if (ranges.length) {
          lines.push(`## ${module.label}`);
          lines.push('');
          if (block.source) {
            lines.push(String(block.source).replace(/\s+/g, ' ').trim());
            lines.push('');
          }
          lines.push('| Range | What it covers | Examples |');
          lines.push('| --- | --- | --- |');
          for (const entry of ranges) {
            lines.push(
              `| \`${entry.range}\` | ${entry.covers} | ${entry.examples} |`,
            );
          }
          lines.push('');
        }
        const codes = block?.codes ?? [];
        if (codes.length === 0) continue;
        total += codes.length;
        const suffix = key.replace('x-abdm-errors', '').replace(/^-/, '');
        lines.push(`## ${module.label}${suffix ? `, ${label(suffix)}` : ''}`);
        lines.push('');
        if (block.source) {
          lines.push(block.source);
          lines.push('');
        }
        const withHttp = codes.some((c) => c.http !== undefined);
        lines.push(
          withHttp ? '| Code | HTTP | Message | What to do |' : '| Code | Message | What to do |',
        );
        lines.push(withHttp ? '| --- | --- | --- | --- |' : '| --- | --- | --- |');
        for (const entry of codes) {
          const cells = [`\`${entry.code}\``];
          if (withHttp) cells.push(entry.http ?? '');
          cells.push((entry.message ?? '').replace(/\|/g, '\\|'));
          cells.push(entry.action ?? '');
          lines.push(`| ${cells.join(' | ')} |`);
        }
        lines.push('');
      }
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
    const blocks = Object.keys(spec)
      .filter((key) => key.startsWith('x-abdm-errors'))
      .map((key) => [key, spec[key]]);
    // A spec with no error records and no webhooks (the gateway session) gets
    // no errors page; a module in the async flows keeps one even before any
    // code is recorded, so the gap is stated rather than hidden.
    if (blocks.length === 0 && Object.keys(spec.webhooks ?? {}).length === 0) continue;
    const codes = blocks.flatMap(([, block]) => block?.codes ?? []);
    const ranges = blocks.flatMap(([, block]) => block?.ranges ?? []);
    const notes = blocks.map(([, block]) => block?.notes).filter(Boolean);

    const lines = [
      '---',
      `title: ${module.label} errors`,
      'sidebar_label: Errors',
      'sidebar_position: 98',
      `description: What ${module.label} returns when a call fails, and what to do about it.`,
      'verification: unverified',
      `source: ${module.file}`,
      'generated: true',
      '---',
      '',
      `# ${module.label} errors`,
      '',
    ];

    if (notes.length) {
      lines.push(notes.join('\n\n').trim());
      lines.push('');
    }

    if (codes.length) {
      for (const [key, block] of blocks) {
        const rows = block?.codes ?? [];
        if (!rows.length) continue;
        const suffix = key.replace('x-abdm-errors', '').replace(/^-/, '');
        lines.push(`## ${suffix ? `${label(suffix)} codes` : 'Codes'}`);
        lines.push('');
        if (block.source) {
          lines.push(String(block.source).replace(/\s+/g, ' ').trim());
          lines.push('');
        }
        const withHttp = rows.some((row) => row.http !== undefined);
        lines.push(withHttp ? '| Code | HTTP | Message | What to do |' : '| Code | Message | What to do |');
        lines.push(withHttp ? '| --- | --- | --- | --- |' : '| --- | --- | --- |');
        for (const row of rows) {
          const cells = [`\`${row.code}\``];
          if (withHttp) cells.push(row.http ?? '');
          cells.push((row.message ?? '').replace(/\|/g, '\\|'));
          cells.push(row.action ?? '');
          lines.push(`| ${cells.join(' | ')} |`);
        }
        lines.push('');
      }
    }

    if (ranges.length) {
      lines.push('## Code ranges');
      lines.push('');
      lines.push('| Range | What it covers | Examples |');
      lines.push('| --- | --- | --- |');
      for (const entry of ranges) {
        lines.push(`| \`${entry.range}\` | ${entry.covers} | ${entry.examples} |`);
      }
      lines.push('');
    }

    if (!codes.length && !ranges.length) {
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
console.log(
  `Built ${count} endpoint page(s) from ${tree
    .map((pv) => `${pv.platform}/${pv.version} (${pv.files.length} spec(s))`)
    .join(', ')}.`,
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
