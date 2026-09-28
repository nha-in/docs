// Journeys, operation indexes, error lists and reference features are read
// per platform and version, so a module of one gateway never picks up another
// gateway's journeys or error list.
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadJourneys, operationIndex} from './journeys.mjs';
import {moduleErrorList} from './spec-errors.mjs';
import {platformFeatures} from '../specs.mjs';

test('loadJourneys takes a platform and version', () => {
  assert.ok(loadJourneys({platform: 'hiecm', version: 'v3'}).has('m2'));
  assert.ok(loadJourneys().has('m2'), 'the default stays hiecm/v3');
  assert.equal(loadJourneys({platform: 'nhcx', version: 'v1'}).size, 0);
});

test('operationIndex filters by platform', () => {
  const nhcx = operationIndex({platform: 'nhcx', version: 'v1'});
  const hiecm = operationIndex();
  assert.ok(nhcx.size > 0);
  assert.ok(hiecm.has('m2_post_v3_token_generate_token'));
  for (const id of nhcx.keys()) assert.ok(!hiecm.has(id), `${id} is in both indexes`);
});

test('moduleErrorList reads the errors folder beside the spec named by where', () => {
  const m2 = {info: {'x-portal': {module: 'm2'}}};
  const list = moduleErrorList(m2, {platform: 'hiecm', version: 'v3'});
  assert.ok(list && list.codes.length > 0);
  assert.equal(moduleErrorList({info: {'x-portal': {module: 'network'}, 'x-abdm-gateway': 'uhi'}}, {platform: 'uhi', version: 'v1'}), null);
  assert.equal(moduleErrorList({info: {'x-portal': {module: 'claim'}, 'x-abdm-gateway': 'nhcx'}}), null);
});

test('platformFeatures names what each gateway version has', () => {
  assert.deepEqual(platformFeatures('hiecm', 'v3'), {journeys: true, troubleshooting: true, hiecmCopy: true, errorConcept: 'hiecm.concept.error-codes'});
  assert.deepEqual(platformFeatures('nhcx', 'v1'), {journeys: false, troubleshooting: false, hiecmCopy: false, errorConcept: 'nhcx.concept.error-code-spaces'});
  assert.deepEqual(platformFeatures('uhi', 'v1'), {journeys: true, troubleshooting: false, hiecmCopy: false, errorConcept: null});
});
