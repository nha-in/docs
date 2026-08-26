# Report to NHA: requests for corrected specification files, 27 August 2026

Prepared by Eka Care from the ingest of NHA's three OpenAPI files and four
Postman collections into our ABDM Catalogue. The raw files are preserved
untouched under `catalogue/openapi/.raw/` with sha256 hashes, and every
departure we made from them is recorded in dated corrections files. This
report lists what we could not resolve from the documents alone.

First, credit where it is due. The specifications are better than most
vendor OpenAPI. All 70 operations carry an `operationId`, a `summary` and
a `description`, and `ABDM_M1_API_Swagger.yaml` passed our ruleset with no
changes at all. The requests below are about closing specific gaps, not
about quality in general. They are in priority order.

## 1. Callback definitions are absent from all three files

**Observed:** none of the three specification files describes a single
callback. What the files model as paths is the outbound half, including
the `on-discover`, `on-init` and `on-notify` responses an integrator
sends. What the gateway posts to a registered URL, including the gateway
to HIP discovery, link init, link confirm and consent notify payloads, is
in neither the specifications nor the Postman collections. For M2 and M3
that is half the integration.

**Evidence:** ingest record, 25 August 2026
(`catalogue/openapi/corrections/2026-08-25-m1-m2-m3-ingest.md`). We have
declared these as OpenAPI `webhooks` with a path and no body.

**Ask:** callback definitions for the inbound half of M2 and M3, or
review of our reconstruction under `webhooks` and confirmation that it is
right.

## 2. Eight references resolve to components that do not exist

**Observed:** 8 `$ref` targets resolve to nothing in the files that use
them, mostly in the session and bridge group. Where the target existed in
a sibling milestone file we copied it in. Where it existed nowhere we
inserted a marked placeholder object whose description says so.

**Evidence:** correction C2 in the ingest record, 25 August 2026.

**Ask:** the missing component schemas, so the placeholders can be
replaced with NHA's own definitions.

## 3. UUID format assertions contradict the files' own examples

**Observed:** the schemas declare `consentId`, `consentRequestId` and
`id` as `format: uuid` at 26 sites, and the examples for those same
fields are not UUIDs. Either the format is wrong or the examples are, and
the documents do not say which. We removed the assertion rather than
guess; it should return if real identifiers are UUIDs.

**Evidence:** correction C3 in the ingest record, 25 August 2026, and
pending item P1 in `catalogue/openapi/corrections/PENDING.md`.

**Ask:** confirmation of whether real values of these fields are UUIDs,
so either the format assertion or the examples can be corrected.

## 4. Domain errors arrive wrapped in misleading HTTP statuses

**Observed:** on 2026-08-25 the ABHA sandbox returned HTTP 404 whose body
carried `ABDM-1016`, "Invalid Timestamp", for a bad `TIMESTAMP` header.
The route existed and nothing was missing; the body code was the truth
and the status was not. The observed `code` field also carried a trailing
colon and space, the literal string `ABDM-1016: `, which defeats exact
match parsers.

**Evidence:** `catalogue/hiecm/errors/abdm-1016.md`, verified against the
sandbox on 2026-08-25, with the request and response pairs recorded.

**Ask:** whether wrapping domain rejections in statuses such as 404 is
intended behaviour, and if it is, for the specifications to document the
statuses each error can arrive under and the body shape that
distinguishes a rejection from a routing 404.

## 5. Confirmation that production accepts the UTC TIMESTAMP format

**Observed:** the sandbox accepts `TIMESTAMP` as ISO 8601 UTC with
milliseconds and the `Z` suffix, for example `2026-08-25T15:51:15.339Z`,
and rejects the +05:30 offset form with ABDM-1016. This matches the M1
specification's own wording, "ISO 8601 UTC timestamp of the request", so
we note it as confirmation of the spec rather than a defect. We have
verified this on `abhasbx.abdm.gov.in` only.

**Evidence:** recorded sandbox session, 2026-08-25, written up in
`catalogue/openapi/corrections/2026-08-26-timestamp-utc.md`.

**Ask:** confirmation that production, `abha.abdm.gov.in`, accepts the
same UTC format the sandbox does.

We are happy to share the raw request and response captures behind any
observation above, and to review corrected files against our ruleset on
receipt.

A note on scope: two earlier findings, the certificate endpoint and the
encrypt helper's response shape, were resolved by our own sandbox
verification on 26 August 2026 and are no longer asks. The certificate
endpoint works with a correctly formatted UTC TIMESTAMP, and the encrypt
helper returns {"encryptedData": "<base64>"}. We mention them only because
earlier drafts of this report requested them.
