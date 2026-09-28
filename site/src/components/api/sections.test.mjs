// NHA's descriptions carry their own header and body tables under bold
// labels. These are the shapes the specifications ship, trimmed.
//
// Run: node --test site/src/components/api/sections.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import esbuild from 'esbuild';

const ts = readFileSync(new URL('./sections.ts', import.meta.url), 'utf8');
const {code} = await esbuild.transform(ts, {loader: 'ts', format: 'esm'});
const {chunks, sections} = await import(`data:text/javascript,${encodeURIComponent(code)}`);

// An M1 journey step, as build-api-reference.mjs writes it.
const JOURNEY = `**Endpoint:** \`PATCH /abha/api/v3/profile/account\`

**Flow:** **Profile - Update Photo** - step 1 of 1
- Previous: none (first call of this flow)
- Next: none (last call of this flow)

---

Send the photo as a Base64 string.

**Headers** (plus \`Authorization: Bearer <gateway token>\`):

| Header | Required | Description |
|---|---|---|
| X-token | yes | User token received after login. |

**Request body for this use case:**

| Field | Value / Type | Required | Description |
|---|---|---|---|
| \`profilePhoto\` | string | no | Base64 encoded profile photo. |

> **Note:** The source spec has no response example for this use case.
`;

// A P2 callback: labels indented by a space, and a Hosted by line first.
const CALLBACK = `**Hosted by the HIP/HIU, not by ABDM.** ABDM calls this endpoint.
This API is invoked by **HIU** to share the response.

 **Header**

REQUEST-ID unique UUID

 **Request Body**

response is mandatory object in both the cases
`;

// An NHCX description: sections of its own, and no labels to split on.
const NHCX = `### Business purpose

Submit a claim.

### When to use

- After discharge
`;

test('a journey step splits into its three tabs', () => {
  const {overview, headers, body} = sections(JOURNEY);
  assert.match(overview, /^\*\*Endpoint:\*\*/);
  assert.match(overview, /Next: none/);
  assert.match(overview, /Send the photo as a Base64 string\.$/);
  assert.match(headers, /^\*\*Headers\*\* \(plus/);
  assert.match(headers, /X-token/);
  assert.doesNotMatch(headers, /profilePhoto/);
  assert.match(body, /^\*\*Request body for this use case:\*\*/);
  assert.match(body, /profilePhoto/);
});

test('a note under the body table stays with the body', () => {
  assert.match(sections(JOURNEY).body, /Note:\*\* The source spec/);
});

test('indented labels still split, and Hosted by stays in the overview', () => {
  const {overview, headers, body} = sections(CALLBACK);
  assert.match(overview, /^\*\*Hosted by the HIP\/HIU/);
  assert.match(overview, /invoked by \*\*HIU\*\*/);
  assert.match(headers, /REQUEST-ID/);
  assert.match(body, /response is mandatory/);
});

test('a bold word inside a sentence is not a label', () => {
  assert.equal(sections(CALLBACK).headers.includes('invoked by'), false);
});

test('a description with no labels is all overview', () => {
  assert.deepEqual(sections(NHCX), {overview: NHCX.trim(), headers: '', body: ''});
});

test('nothing is lost: the chunks rejoin to the original text', () => {
  for (const text of [JOURNEY, CALLBACK, NHCX]) {
    assert.equal(chunks(text).map((chunk) => chunk.text).join(''), text);
  }
});

test('an empty or missing description gives three empty tabs', () => {
  const empty = {overview: '', headers: '', body: ''};
  assert.deepEqual(sections(''), empty);
  assert.deepEqual(sections(undefined), empty);
});
