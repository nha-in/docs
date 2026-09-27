// The changelog rules, replayed over three real snapshots of this repository.
//
// The fixtures are the facts extractor's output at the commits that added
// the 22 and 23 September 2026 What's New pages, and at main on 25
// September. What the humans wrote on those pages is known, so the rules are
// held to it: they must find what earned an entry, and must not find what
// the changelog skill says never earns one (a rename, a placeholder change,
// wording, a journey reshuffle).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {join} from 'node:path';
import {entriesFor} from './lib/changelog-rules.mjs';
import {normalisePath, operationKey} from './lib/changelog-facts.mjs';
import {render, headingFor, slug} from './lib/changelog-render.mjs';

const fixture = (name) =>
  JSON.parse(readFileSync(join(import.meta.dirname, 'fixtures', 'changelog', `${name}.json`), 'utf8'));

const sep22 = fixture('2026-09-22');
const sep23 = fixture('2026-09-23');
const sep25 = fixture('2026-09-25');

const of = (entries, kind, module) =>
  entries.filter((e) => e.kind === kind && (module === undefined || e.module === module));

test('a placeholder rename is the same address', () => {
  assert.equal(normalisePath('/v3/{request-id}/approve'), '/v3/{}/approve');
  assert.equal(operationKey('post', '/v3/{a}/x'), operationKey('POST', '/v3/{b}/x'));
});

test('the index anchor is the heading id Docusaurus writes', () => {
  assert.equal(slug("The PHR public key is not the ABHA service's key"), 'the-phr-public-key-is-not-the-abha-services-key');
  assert.equal(slug('NHCX: four calls no longer take x-hcx-api_call_id as headers'), 'nhcx-four-calls-no-longer-take-x-hcx-api_call_id-as-headers');
  assert.equal(slug('P2 consent, linking and share calls go to the gateway'), 'p2-consent-linking-and-share-calls-go-to-the-gateway');
});

test('a baseline produces no entries', () => {
  assert.deepEqual(entriesFor({modules: {}}, sep25, '2026-09-28'), []);
  assert.deepEqual(entriesFor(sep25, sep25, '2026-09-28'), []);
});

test('22 to 23 September: the query parameters and the M2 error list, and not the five module renames', () => {
  const entries = entriesFor(sep22, sep23, '2026-09-23');
  // Listing subscription requests now requires limit, offset and status.
  const p3 = of(entries, 'correction', 'p3');
  assert.equal(p3.length, 1);
  assert.ok(p3[0].items.some((i) => i.changes.some((c) => c.field === 'params' && c.to.includes('query:limit!'))));
  // M2 gained its error code list.
  assert.equal(of(entries, 'coverage-errors', 'm2').length, 1);
  // M1 to M4 and P2 were relabelled that day. Naming earns nothing.
  for (const m of ['m1', 'm3', 'm4', 'p2']) assert.equal(entries.filter((e) => e.module === m).length, 0, m);
  assert.ok(!entries.some((e) => JSON.stringify(e.items).includes('label')), 'no entry is about a label');
});

test('23 to 25 September: what moved, what NHA republished, what we corrected', () => {
  const entries = entriesFor(sep23, sep25, '2026-09-25');
  const kinds = Object.fromEntries([...new Set(entries.map((e) => e.kind))].map((k) => [k, of(entries, k).length]));

  // The gateway's list calls moved to P2 and P4; the two OpenID calls and the
  // bridge service update were withdrawn.
  const moves = of(entries, 'moved');
  assert.ok(moves.some((e) => e.from === 'gateway' && e.module === 'p4' && e.items.some((i) => i.path.endsWith('/health-lockers'))));
  assert.ok(moves.some((e) => e.from === 'gateway' && e.module === 'p2' && e.items.length === 3));
  const gatewayGone = of(entries, 'withdrawn', 'gateway');
  assert.equal(gatewayGone.length, 1);
  assert.equal(gatewayGone[0].items.length, 3);

  // Subscriptions became the first journey of P3: six operations moved, none withdrawn.
  const toP3 = moves.find((e) => e.from === 'subscription' && e.module === 'p3');
  assert.equal(toP3?.items.length, 6);
  assert.equal(of(entries, 'withdrawn', 'subscription').length, 0);
  assert.equal(of(entries, 'added', 'p3').length, 0, 'placeholder renames in P3 are not additions');

  // P2's gateway calls now target the gateway host: a correction, since NHA
  // published nothing; and the change is the primary server, not the set.
  const p2 = of(entries, 'correction', 'p2');
  assert.equal(p2.length, 1);
  const servers = p2[0].items.filter((i) => i.changes.some((c) => c.field === 'server'));
  assert.ok(servers.length >= 17, `P2 host corrections: ${servers.length}`);
  assert.equal(of(entries, 'republished', 'p2').length, 0);

  // M4 follows the 24 September set: republished, folded into one entry, no correction.
  const m4 = of(entries, 'republished', 'm4');
  assert.equal(m4.length, 1);
  assert.equal(m4[0].source.date, '2026-09-24');
  assert.ok(m4[0].count > 50);
  assert.equal(of(entries, 'correction', 'm4').length, 0);

  // M2's discovery reply requires X-HIU-ID: a correction from NHA's observations.
  const m2 = of(entries, 'correction', 'm2');
  assert.equal(m2.length, 1);
  assert.ok(m2[0].items[0].changes.some((c) => c.field === 'params' && c.to.some((x) => x.toLowerCase() === 'header:x-hiu-id!')));

  // NHCX: the claim paths were repaired, the internal calls withdrawn, the
  // registry calls need Accept, predetermination is gone, task is new, and
  // the adjudicator is documented for payers.
  assert.equal(of(entries, 'path-changed', 'registry')[0]?.items.length, 3);
  const claimGone = of(entries, 'withdrawn', 'claim')[0];
  assert.equal(claimGone?.items.length, 2, 'the two internal claim calls, and not the non-addresses NHA listed beside the real paths');
  assert.ok(claimGone.items.every((i) => i.path.startsWith('/internal/')));
  // The same correction across several NHCX modules is one entry: Accept on
  // the registry side, payload and type on every callback.
  const shared = of(entries, 'shared-correction');
  assert.ok(shared.some((e) => e.change.field === 'params' && e.change.to.some((x) => x.toLowerCase() === 'header:accept!') && e.modules.includes('registry')));
  assert.ok(shared.some((e) => e.change.field === 'required' && e.change.to.join() === 'payload,type' && e.modules.length >= 8));
  assert.equal(of(entries, 'correction', 'claim').length, 0, 'claim has nothing left once the shared corrections are folded out');
  assert.equal(of(entries, 'withdrawn', 'predetermination').length, 1);
  // Every link points at a page that exists after the change: a withdrawal
  // from a module that is itself gone opens the gateway's API index.
  assert.equal(of(entries, 'withdrawn', 'predetermination')[0].link, '/docs/nhcx/v1/api/');
  for (const e of entries.filter((x) => x.gateway !== 'site')) {
    const m = e.link.match(/^\/docs\/([^/]+)\/[^/]+\/api\/([^/]+)\//);
    if (m) assert.ok(sep25.modules[`${m[1]}-${m[2]}`], `${e.kind} ${e.module} links to a module that is gone: ${e.link}`);
  }
  assert.equal(of(entries, 'coverage-module', 'task').length, 1);
  assert.deepEqual(of(entries, 'coverage-role', 'adjudicator')[0]?.items, [{role: 'payer'}]);
  // The adjudicator's operationIds changed on unchanged paths: not a withdrawal.
  assert.equal(of(entries, 'withdrawn', 'adjudicator').length, 0);
  assert.equal(of(entries, 'added', 'adjudicator').length, 0);

  // The NHCX plugin went from 0.1.0 to 1.0.0.
  assert.deepEqual(of(entries, 'plugin-version')[0]?.items, [{name: 'nhcx', from: '0.1.0', to: '1.0.0'}]);

  // Nothing about journeys, labels or summaries.
  const text = JSON.stringify(entries);
  const facts = JSON.stringify(entries.map((e) => [e.items, e.change ?? null]));
  for (const word of ['journey', 'label', 'summary', 'description']) assert.ok(!facts.includes(word), word);
  assert.ok(Object.keys(kinds).every((k) => ['moved', 'withdrawn', 'added', 'correction', 'shared-correction', 'republished', 'path-changed', 'coverage-module', 'coverage-role', 'coverage-errors', 'plugin-version', 'artefact-added', 'artefact-removed'].includes(k)), JSON.stringify(kinds));
});

test('every template renders as the writing guide asks', () => {
  const entries = [...entriesFor(sep22, sep23, '2026-09-23'), ...entriesFor(sep23, sep25, '2026-09-25')];
  assert.ok(entries.length > 10);
  const seen = new Set();
  for (const e of entries) {
    const heading = headingFor(e);
    const body = render(e);
    seen.add(e.kind);
    assert.ok(!/—/.test(heading + body), `em dash in ${e.kind}`);
    assert.ok(heading.length > 8 && heading.length < 110, `heading length: ${heading}`);
    assert.ok(!/^\d/.test(heading), `heading starts with a numeral: ${heading}`);
    const sentences = body.replace(/\([^)]*\)/g, '').split(/(?<=[.!?])\s+(?=[A-Z`])/).filter(Boolean);
    assert.ok(sentences.length <= 4, `${e.kind}: ${sentences.length} sentences`);
    assert.ok((body.match(/\]\(/g) ?? []).length >= 1, `${e.kind} has no link`);
    assert.ok(!/undefined|null|\[object/.test(heading + body), `${e.kind}: ${body}`);
  }
  assert.ok(seen.size >= 8, [...seen].join(','));
});
