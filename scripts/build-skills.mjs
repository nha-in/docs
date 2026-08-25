// Compiles a module's documentation into an agent skill.
//
// One file per module, self contained, generated from the same data the pages
// render. A skill is loaded into an agent's context, so it carries the facts
// that stop an agent guessing (hosts, headers, the token rule, every endpoint
// with its purpose) and links back for the detail it does not carry.
//
// Output under site/static/skills is a build output. Edit the specs and the
// pages, not the skill.
import {readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = join(root, 'site', 'src', 'data', 'api');
const outDir = join(root, 'site', 'static', 'skills');

const MODULES = [
  {
    id: 'm1',
    slug: 'abdm-m1',
    title: 'M1, ABHA identity',
    docs: '/docs/hiecm/v3/api/m1',
    description:
      'Use when building ABDM Milestone 1: creating an ABHA number or address, ABHA login, profile management, or the gateway session token. Covers the endpoints, the required headers, the two token rule and the encryption rule.',
  },
];

const operations = readdirSync(dataDir)
  .filter((file) => file.endsWith('.json'))
  .map((file) => JSON.parse(readFileSync(join(dataDir, file), 'utf8')));

function truncate(text, limit) {
  const flat = (text ?? '').replace(/\s+/g, ' ').trim();
  return flat.length > limit ? `${flat.slice(0, limit - 1)}…` : flat;
}

function build(module) {
  const mine = operations
    .filter((op) => op.moduleId === module.id || op.moduleId === 'gateway')
    .sort((a, b) => a.tag.localeCompare(b.tag) || a.path.localeCompare(b.path));

  const servers = [
    ...new Map(
      mine.flatMap((op) => op.servers.map((s) => [s.url, s.description])),
    ).entries(),
  ];

  const lines = [];
  lines.push('---');
  lines.push(`name: ${module.slug}`);
  lines.push(`description: ${module.description}`);
  lines.push('---');
  lines.push('');
  lines.push(`# ABDM ${module.title}`);
  lines.push('');
  lines.push(
    'Generated from the ABDM Developer Portal. Every fact below comes from a page in that portal, which is the place to look when this file does not carry enough.',
  );
  lines.push('');
  lines.push('## Before anything else');
  lines.push('');
  lines.push(
    '- Nothing here has been run against the ABDM sandbox. Treat request and response shapes as unconfirmed, and check a response before you rely on its shape.',
  );
  lines.push(
    '- Get an access token first, from the gateway session endpoint. Every other call needs it in `Authorization: Bearer <token>`.',
  );
  lines.push(
    '- Two tokens exist and they are not interchangeable. The gateway access token goes in `Authorization`. The user token from an enrolment or a login goes in `X-token`. Profile endpoints need both.',
  );
  lines.push(
    '- Sensitive fields travel encrypted. Aadhaar numbers, mobile numbers, email addresses, OTP values and passwords are RSA encrypted with NHA\'s public certificate before they go in the body.',
  );
  lines.push(
    '- One path serves several jobs. The `scope` array in the body picks which one, so read it before assuming an endpoint does one thing.',
  );
  lines.push('');

  lines.push('## Hosts');
  lines.push('');
  for (const [url, description] of servers) {
    lines.push(`- \`${url}\`${description ? ` ${truncate(description, 90)}` : ''}`);
  }
  lines.push('');

  const byTag = new Map();
  for (const op of mine) {
    if (!byTag.has(op.tag)) byTag.set(op.tag, []);
    byTag.get(op.tag).push(op);
  }

  lines.push('## Endpoints');
  lines.push('');
  lines.push(`${mine.length} operations, grouped by the journey they belong to.`);
  lines.push('');
  for (const [tag, ops] of byTag) {
    lines.push(`### ${tag}`);
    lines.push('');
    lines.push('| Method | Path | What it does |');
    lines.push('| --- | --- | --- |');
    for (const op of ops) {
      lines.push(`| \`${op.method}\` | \`${op.path}\` | ${truncate(op.summary, 80)} |`);
    }
    lines.push('');
  }

  lines.push('## Headers');
  lines.push('');
  const headers = new Map();
  for (const op of mine) {
    for (const header of op.headers) {
      if (!headers.has(header.name)) {
        headers.set(header.name, header.description);
      }
    }
  }
  lines.push('| Header | What it is |');
  lines.push('| --- | --- |');
  for (const [name, description] of headers) {
    lines.push(`| \`${name}\` | ${truncate(description, 110)} |`);
  }
  lines.push('');

  lines.push('## A request, in full');
  lines.push('');
  const sample =
    mine.find((op) => op.id === 'm1_enrolment_by_aadhaar') ?? mine[0];
  lines.push('```bash');
  lines.push(sample.curl);
  lines.push('```');
  lines.push('');

  lines.push('## When it fails');
  lines.push('');
  lines.push(
    'M1 returns errors in more than one shape, depending on which layer rejected the call, so do not write a parser that expects one. A code can also appear twice with different meanings, so read the code together with the message.',
  );
  lines.push(
    `Full list: ${module.docs}/errors, and the aggregated reference at /docs/hiecm/v3/reference/error-codes.`,
  );
  lines.push('');

  lines.push('## Where the detail is');
  lines.push('');
  lines.push(`- Every endpoint, with its body fields and responses: ${module.docs}`);
  lines.push(`- The steps of each journey, and what to see when they work: ${module.docs}/sequence`);
  lines.push(`- The rules that hold across endpoints: ${module.docs}/apis`);
  lines.push(`- Terms: /docs/hiecm/v3/glossary`);
  lines.push('');

  return lines.join('\n');
}

rmSync(outDir, {recursive: true, force: true});
mkdirSync(outDir, {recursive: true});

let count = 0;
for (const module of MODULES) {
  const skill = build(module);
  const folder = join(outDir, module.slug);
  mkdirSync(folder, {recursive: true});
  writeFileSync(join(folder, 'SKILL.md'), skill);

  // Cursor reads the same content with its own frontmatter.
  const cursor = [
    '---',
    `description: ${module.description}`,
    'alwaysApply: false',
    '---',
    '',
    skill.replace(/^---\n[\s\S]*?\n---\n\n/, ''),
  ].join('\n');
  writeFileSync(join(outDir, `${module.slug}.mdc`), cursor);

  count += 1;
  console.log(
    `Built ${module.slug}: ${skill.split('\n').length} lines, ${Math.round(
      skill.length / 1024,
    )}KB.`,
  );
}

console.log(`Compiled ${count} skill(s) into site/static/skills.`);
