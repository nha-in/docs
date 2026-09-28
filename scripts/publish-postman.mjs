// Publishes the collections build-postman.mjs wrote to NHA's public Postman
// workspace, and the sandbox environment beside them. Run by
// .github/workflows/publish-postman.yml on main; the site never depends on it.
//
//   POSTMAN_API_KEY=... node scripts/publish-postman.mjs
//
// The workspace is catalogue/postman.json's `workspace`. A collection already
// in the workspace under the same name is replaced; one that is not is
// created. Matching by name means a rerun never duplicates a collection, even
// before its id is committed. The ids this prints go into
// catalogue/postman.json, which is what turns on "Run in Postman".
//
// Without POSTMAN_API_KEY it says so and exits 0, so a fork or a self-hosted
// copy runs the same workflow and publishes nothing.
import {appendFileSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const root = join(import.meta.dirname, '..');
const key = process.env.POSTMAN_API_KEY;
if (!key) {
  console.log('POSTMAN_API_KEY is not set: nothing published.');
  process.exit(0);
}
const {workspace} = JSON.parse(readFileSync(join(root, 'catalogue', 'postman.json'), 'utf8'));
if (!workspace) throw new Error('catalogue/postman.json has no workspace id to publish to');

const manifest = JSON.parse(readFileSync(join(root, 'site', 'src', 'data', 'postman.json'), 'utf8'));
const read = (file) => JSON.parse(readFileSync(join(root, 'site', 'static', 'postman', file), 'utf8'));

async function api(method, path, body) {
  const res = await fetch(`https://api.getpostman.com${path}`, {
    method,
    headers: {'X-Api-Key': key, 'Content-Type': 'application/json'},
    ...(body && {body: JSON.stringify(body)}),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${method} ${path}: ${res.status} ${text.slice(0, 500)}`);
  return JSON.parse(text);
}

const {workspace: current} = await api('GET', `/workspaces/${workspace}`);
const byName = (list = []) => new Map(list.map((item) => [item.name, item.uid]));
const collections = byName(current.collections);
const environments = byName(current.environments);

// Create or replace one item, by name. Postman's PUT replaces the whole item,
// so anything edited by hand in the workspace is overwritten: the specs are
// the source.
async function publish(kind, list, name, body) {
  const uid = list.get(name);
  const result = uid
    ? await api('PUT', `/${kind}s/${uid}`, {[kind]: body})
    : await api('POST', `/${kind}s?workspace=${workspace}`, {[kind]: body});
  const published = uid ?? result[kind].uid;
  console.log(`${uid ? 'Updated' : 'Created'} ${kind} ${name}: ${published}`);
  return published;
}

const ids = {};
for (const [module, entry] of Object.entries(manifest.modules)) {
  const collection = read(entry.file);
  ids[module] = await publish('collection', collections, collection.info.name, collection);
}
const environment = read(manifest.environment);
await publish('environment', environments, environment.name, environment);

const record = JSON.stringify({workspace, collections: ids}, null, 2);
console.log(`\ncatalogue/postman.json, to turn on Run in Postman:\n${record}`);
if (process.env.GITHUB_STEP_SUMMARY) {
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Postman collections published\n\nCommit this as \`catalogue/postman.json\` if it differs:\n\n\`\`\`json\n${record}\n\`\`\`\n`,
  );
}
