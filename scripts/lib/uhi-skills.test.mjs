// scripts/lib/uhi-skills.test.mjs
import {test} from 'node:test';
import assert from 'node:assert';
import {UHI_SERVICES, UHI_CONTRACT, UHI_EXTERNAL, buildLoop, debugLoop, skillFolder, atomIdsNamed} from './uhi-skills.mjs';

const atom = (id, type, title, summary, sections) => [id, {
  fm: {id, type, title, summary},
  body: `# ${title}\n\n${Object.entries(sections).map(([h, t]) => `## ${h}\n\n${t}`).join('\n\n')}\n`,
}];

const pmjay = UHI_SERVICES.find((s) => s.id === 'pmjay-hem');

// Every atom the PM-JAY HEM skill names, with just enough body to render.
function fixtureAtoms() {
  const m = new Map();
  for (const id of atomIdsNamed(pmjay)) {
    const type = id.split('.')[1];
    m.set(...atom(id, type, `Title of ${id}`, `Summary of ${id}.`, {
      'In plain words': `Plain words of ${id}.`,
      ...(type === 'flow' ? {'Before you start': 'Hold a subscriber id.', 'How you know it worked': 'An `on_search` arrives with your `transaction_id`.', 'When it goes wrong': 'No HSPA answers a wrong `PMJAYHEM`.'} : {}),
      ...(type === 'troubleshooting' ? {'What happens': `What happens in ${id}.`, 'When it goes wrong': `Fix for ${id}.`} : {}),
    }));
  }
  m.set(...atom('uhi.endpoint.network-gateway-search', 'endpoint', 'Search through the Gateway', 'The EUA searches.', {'In plain words': 'Sends the search.'}));
  m.get('uhi.endpoint.network-gateway-search').fm.operation = 'uhi_network_gateway_search';
  return m;
}

const stepData = (op) => ({
  id: op, method: 'POST', path: op.includes('gateway') ? '/api/v1/uhi/search' : '/search',
  title: `Title ${op}`, summary: `/x (EUA → Gateway)`,
  servers: [{url: 'https://uhigatewaysandbox.abdm.gov.in', description: 'Sandbox'}],
  headers: [{name: 'Authorization', description: 'UHI Auth header'}],
  curl: `curl --request POST \\\n  --url https://uhigatewaysandbox.abdm.gov.in${op}`,
  responses: [{status: '200', example: {message: {ack: '<ACK>'}}}],
});
const journeys = new Map([['network', [{id: 'uhi-pmjay-hem', title: 'PM-JAY HEM hospital discovery', steps: [{op: 'uhi_network_gateway_search'}, {op: 'uhi_network_on_search'}]}]]]);
const hostedBy = new Map([['uhi_network_gateway_search', 'gateway'], ['uhi_network_on_search', 'eua']]);
const ctx = () => ({journeys, stepData: (op) => stepData(op), hostedBy, atoms: fixtureAtoms()});

test('every service names its journeys and a flow atom for each', () => {
  assert.deepEqual(UHI_SERVICES.map((s) => s.slug), ['uhi-consultation', 'uhi-ambulance', 'uhi-pmjay-hem', 'uhi-blood-bank', 'uhi-jan-aushadhi', 'uhi-notto']);
  for (const s of UHI_SERVICES) for (const j of s.journeys) assert.ok(j.flow.startsWith('uhi.flow.'), `${s.id} ${j.id}`);
});

test('a journey loop acts per step, says who receives it, and exits on the flow atom', () => {
  const md = buildLoop(pmjay, ctx());
  assert.match(md, /^---\nname: uhi-pmjay-hem-build\n/);
  assert.match(md, /Loop limit: 8 passes per step\./);
  assert.match(md, /#### 1\. Title uhi_network_gateway_search \(`uhi_network_gateway_search`\)/);
  assert.match(md, /--url https:\/\/uhigatewaysandbox\.abdm\.gov\.in/);
  assert.match(md, /arrives at the EUA's `consumer_uri`/);
  assert.match(md, /\*\*Before you start\*\*\n\nHold a subscriber id\./);
  assert.match(md, /\*\*Exit condition \(Observe until this is true\)\*\*\n\nAn `on_search` arrives with your `transaction_id`\./);
  assert.match(md, /From `uhi\.flow\.pmjay-hem-discovery`\./);
});

test('a journey whose flow atom is missing fails the build rather than shipping without an exit', () => {
  const c = ctx();
  c.atoms.delete('uhi.flow.pmjay-hem-discovery');
  assert.throws(() => buildLoop(pmjay, c), /uhi\.flow\.pmjay-hem-discovery/);
});

test('the debug loop has one block per symptom, each with an exit condition, and a limit', () => {
  const md = debugLoop(pmjay, ctx());
  assert.match(md, /^---\nname: uhi-pmjay-hem-debug\n/);
  assert.match(md, /## Symptoms/);
  assert.match(md, /Loop limit: 5 passes per symptom\./);
  const blocks = md.split('\n### ').length - 1;
  assert.ok(blocks >= 4, `${blocks} blocks`);
  assert.equal((md.match(/\*\*Exit condition: the original step now succeeds\.\*\*/g) ?? []).length, blocks);
  assert.match(md, /Fix for uhi\.troubleshooting\.http-statuses\./);
  assert.match(md, /No HSPA answers a wrong `PMJAYHEM`\./);
});

test('a skill folder is a router plus references, and the router cites atoms that exist', () => {
  const {files, manifest} = skillFolder(pmjay, {
    ...ctx(), scaffold: 'LOOP', debug: 'DEBUG', survey: '## Survey\n\nRead the repo.',
    buildDate: '2026-09-29', catalogueVersion: '2026.09.29', skillUrl: '/skills/uhi-pmjay-hem/',
  });
  assert.deepEqual(Object.keys(files).sort(), ['SKILL.md', 'references/debug.md', 'references/design.md', 'references/integrate.md', 'references/scaffold.md', 'references/test.md']);
  const router = files['SKILL.md'];
  assert.match(router, /^---\nname: uhi-pmjay-hem\n/);
  assert.match(router, /\ndomain: pmjay-hem\n/);
  assert.match(router, /\ncan_orchestrate: false\n/);
  assert.match(router, /## Before anything else/);
  assert.doesNotMatch(router, /## Practices/);
  assert.match(router, /Summary of uhi\.decision\.choose-role\. \(`uhi\.decision\.choose-role`\)/);
  const fixtures = fixtureAtoms();
  for (const [, id] of router.matchAll(/`(uhi\.[a-z]+\.[a-z0-9-]+)`/g)) assert.ok(fixtures.has(id), id);
  assert.match(files['references/scaffold.md'], /## Before the first journey[\s\S]*uhi\.sandbox\.key-pair[\s\S]*LOOP/);
  assert.match(files['references/integrate.md'], /\| `POST` \| `\/api\/v1\/uhi\/search` \|/);
  assert.match(files['references/integrate.md'], /Sends the search\./);
  assert.match(files['references/test.md'], /uhi\.test\.pmjay-hem-context/);
  assert.equal(manifest.gateway, 'uhi');
  assert.deepEqual(manifest.sections, ['scaffold', 'design', 'integrate', 'debug', 'test']);
});

test('every requires is produced by a service or brought from outside', () => {
  const produced = new Set(Object.values(UHI_CONTRACT).flatMap((c) => c.produces));
  for (const [id, {requires}] of Object.entries(UHI_CONTRACT)) {
    for (const label of requires) assert.ok(produced.has(label) || UHI_EXTERNAL.has(label), `${id} requires ${label}`);
  }
  assert.deepEqual(Object.keys(UHI_CONTRACT).sort(), UHI_SERVICES.map((s) => s.id).sort());
});
