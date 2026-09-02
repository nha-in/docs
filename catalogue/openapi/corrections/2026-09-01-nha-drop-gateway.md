# Corrections, gateway.yaml against the 2026-09-01 NHA drop

Diffed in `catalogue/openapi/nha-drops/2026-09-01-diffs/gateway.md`. The raw
drop file is stored untouched at
`catalogue/openapi/.raw/nha-2026-09-01/fixed/hiecm/gateway.yaml`, hash
`sha256:e7ca9d3e54d6e6c864f3f1ef7b2422a322c38f6ef0bf64e421c57960b8851dc7`,
recorded under `x-abdm-sources` in `hiecm-gateway.yaml`. Nothing was fixed
silently; every departure from either side is listed here.

## Applied, HIGH confidence

### 1. The doubled `/api/hiecm` server bug (our bug, not the drop's)

`gateway_update_bridge_url`, `gateway_list_bridge_services`,
`gateway_get_bridge_service_by_id`, `gateway_get_gateway_certs` and
`gateway_get_oidc_config` each carried an operation level `servers` override,
`https://dev.abdm.gov.in/api/hiecm`. Combined with paths that already start
`/api/hiecm/...`, the resolved URL doubled the segment:
`https://dev.abdm.gov.in/api/hiecm/api/hiecm/gateway/v3/bridge/url`. The
document's global `servers` block already resolves these paths correctly
without any override, and the drop carries no per-operation override at all.
The override is removed from all five operations, along with the
`**Server:** ...` line in their descriptions that stated the wrong URL as if
it were correct.

### 2 and 3. Missing `X-CM-ID` header and missing security on three operations

`gateway_update_bridge_url`, `gateway_list_bridge_services` and
`gateway_get_bridge_service_by_id` declared only `REQUEST-ID` and
`TIMESTAMP`, and declared no `security` key at all, which under OpenAPI
semantics with no document level default means they required no
authentication. That cannot be right for bridge management calls. The drop
requires `X-CM-ID` and a bearer token on all three. `X-CM-ID` is added by
`$ref` to the existing `CmId` parameter, and
`security: [gatewaySession: []]` is added, using our own already defined
`gatewaySession` scheme rather than the drop's `bearerAuth`, because
`bearerAuth` is not defined anywhere in this file's
`components.securitySchemes`.

### 4. Additive JWKS fields

`x5c`, `x5t` and `x5t2` are added to `JwksResponse.keys` items, next to the
existing `kid`, `kty`, `alg`, `use`, `n`, `e`. Purely additive; nothing that
read the old shape breaks.

### 5. Full replacement, `gateway_list_bridge_services` response

The drop's shape shares no field names with ours. Ours had
`services: [{ serviceId, bridgeId, serviceType, serviceName, facilityName,
hipType, active }]`. The drop returns a top level `bridge` object
(`id, name, url, active, blocklisted`) plus a `services` array of
`{ id, name, types (array, not a single enum), endpoints: { hipEndpoints,
hiuEndpoints, healthLockerEndpoints }, active }`. `BridgeServicesResponse`
now carries the `bridge` object, and its `services` items reference a new
schema, `BridgeServiceSummary`, rather than reusing `BridgeServiceDetail`,
because the by-id operation's response (correction 6) is a different shape
again. A new shared `BridgeServiceEndpoint` schema backs the three endpoint
arrays.

### 6. Full replacement, `gateway_get_bridge_service_by_id` response

Same pattern. Ours had a `serviceType`/`hipType` enum pair. The drop replaces
both with four independent booleans (`isHip`, `isHiu`, `isHealthLocker`,
`isPhr`), changes `id` to an explicit `number`, and adds three nullable
timestamp fields (`registerTime`, `dateCreated`, `dateModified`). One thing
was fixed while transcribing: the drop's own schema writes
`format: date time` (a space) on those three fields, which is not a real
OpenAPI format string. Corrected to `format: date-time`, since this is
fixing something malformed in the drop's file, not deciding what the
contract should be.

### 12. New-in-drop operations added

Per this repo's rule for genuine new gateway operations, the four
registry lookups the drop adds are folded into `hiecm-gateway.yaml` as new
paths, not left as a diff-only finding:

- `GET /api/hiecm/gateway/v3/providers` -> `gateway_list_providers`
- `GET /api/hiecm/gateway/v3/providers/{provider-id}` -> `gateway_get_provider_by_id`
- `GET /api/hiecm/gateway/v3/govt-programs` -> `gateway_list_govt_programs`
- `GET /api/hiecm/gateway/v3/health-lockers` -> `gateway_list_health_lockers`

All four are plain synchronous `GET` lookups, not callback legs, each
requiring `gatewaySession` and the three standard headers. The drop's own
placeholder operationIds (`abdm-gateway4` through `abdm-gateway7`) are kept
as `x-abdm-nha-operation-id` for traceability, not adopted as our
operationId, matching the report's finding that none of the drop's ids
(placeholders, and two session-group ids with a literal space character) are
worth adopting over our descriptive naming.

Each carries an `x-abdm-atom` pointing at the id an endpoint atom for it
would use (`hiecm.endpoint.gateway-list-providers` and so on), following the
convention that the extension is written ahead of the atom existing. No atom
file exists yet for any of the four; generating those stubs and writing
their bodies is the normal `openapi-ingest` stub flow plus `atom-author`,
out of scope for a spec correction pass, exactly as the diff report says.
The govt-programs response schema (`GatewayProviderSummary`, shared with the
provider-by-id response) is documented as the drop states it, with a note in
the schema description that its shape looks copy-pasted from the
provider-by-id response rather than modelled from a real government-program
payload, per the diff report's own observation. That is a flag for sandbox
verification, not something this pass can settle.

## Applied, MEDIUM confidence

### 7. `REQUEST-ID` and `TIMESTAMP` headers on `gateway_get_gateway_certs` and `gateway_get_oidc_config`

Both operations previously declared no `parameters` block at all. The drop
requires both headers on both. Graded MEDIUM rather than HIGH because both
are conventionally public discovery-style endpoints (JWKS, OIDC), and NHA's
own file reuses the same three-header block on every path in this
document, including ones that are supposed to stay public, so there is a
real chance the headers are present because of a shared template rather
than because the gateway enforces them here. Added on the strength that
declaring a header the gateway does not check is a much smaller cost than
omitting one it does check. `X-CM-ID` is not added here, since the drop
itself does not require it on these two operations either (unlike the three
operations in corrections 2 and 3).

## Deferred to sandbox

- **`security: [bearerAuth]` on `gateway_get_gateway_certs`.** The drop gates
  the JWKS endpoint behind the very bearer token JWKS would be used to
  verify, an unusual requirement for a certificate discovery endpoint, and a
  direct contradiction of our current `security: []`. Not adopted. One
  unauthenticated sandbox call against `/api/hiecm/gateway/v3/certs` settles
  whether the drop is right or whether this is an authoring artifact, the
  same as the OIDC schema defect below. Left as `security: []` for now.

- **`OidcConfigResponse` full replacement, `gateway_get_oidc_config`.** Not
  adopted. The drop's schema lists `required: [url]` while defining no `url`
  property anywhere in the schema, only `jwks_uri`, an internal
  contradiction in the drop's own file rather than a corrected contract. Our
  current full OIDC discovery document shape is kept
  (`issuer, authorization_endpoint, token_endpoint, jwks_uri,
  response_types_supported, subject_types_supported,
  id_token_signing_alg_values_supported`). This is a defect to raise back to
  NHA, the same pattern as `corrections/2026-08-27-report-to-nha.md`, not
  something a sandbox call would settle since it is a contradiction inside
  the drop's own document, not a live-behaviour question.

- **`200` to `202 Accepted` on `gateway_sessions_create` and
  `gateway_update_bridge_url`.** This is the conflict this pass was told
  not to resolve by picking a side: the `gateway-sessions` endpoint atom
  currently states the operation returns `200`, sourced from NHA's own
  Postman collection during the original ingest. This drop, a different
  NHA-originated source, says `202`. Two NHA artefacts disagree on the
  status code for the same call. Neither is adopted here. What would settle
  it: one real sandbox call to `POST /api/hiecm/gateway/v3/sessions`,
  reading the actual status code back, then updating both the spec and the
  `gateway-sessions` atom together with the observed result, recording both
  historical claims, following the evidentiary pattern already used for the
  timestamp-utc correction. The same applies to
  `PATCH /api/hiecm/gateway/v3/bridge/url`, where the drop's `202` carries
  no body at all, unlike the session operation's `202`; if the status
  changes, the `MessageResponse` body expectation would need to be dropped
  for this operation specifically, not just the status number. The drop's
  `204, 400, 401, 403, 500, 503` error responses for both operations are
  bundled with this same status-code question in the diff report and are
  left undocumented for now rather than added on their own, since adding
  them without settling the status code would leave the response set half
  correct.

- **Path template variable name, `{serviceId}` vs `{service-id}`.** The
  drop names the bridge-service-by-id path variable `service-id`; ours is
  `serviceId`. The literal path segments before and after it are identical,
  so the actual URL an integrator calls is unaffected either way. This was
  not a numbered, confidence-graded correction in the diff report, only a
  note in its per-operation section, so it is left unchanged rather than
  renamed on a cosmetic call. Worth revisiting for consistency with the drop
  the next time this operation is touched for another reason.

- **`bearerAuth` reference in `gateway_register_bridge_services`.** Flagged
  by the diff report as unrelated to this drop (the operation lives against
  a different host, the HSP Registry, which the drop does not cover) and
  graded LOW. `security: [bearerAuth: []]` in that operation references a
  scheme not defined anywhere in this file's `components.securitySchemes`,
  a pre-existing broken reference. Left as is; worth fixing on its own,
  independent of any drop.

## Not applied, cosmetic only

Timestamp example values, request body example URLs, and the path
parameter description on `gateway_get_bridge_service_by_id` differ between
ours and the drop in wording only, no material change to what an
integrator sends or reads. Left as ours. Full detail is in the diff report,
section 2.

## Still missing after this pass

- **Verification.** Nothing in this file has been run against the sandbox
  from this repository. The three sandbox questions above (the certs
  security requirement, the session and bridge/url status codes) all need a
  real call, not a reading of either document.
- **Atom stubs for the four new operations.** Added to the spec, not yet
  drafted as atoms. Dispatch the normal `openapi-ingest` stub generation and
  `atom-author` flow.
- **A concurrent, unrelated edit to `hiecm-m2.yaml` was in progress in this
  same working tree while this pass ran**, outside this file's scope and
  untouched by it. Noted here only so a reader of this correction doc is
  not confused if `hiecm-m2.yaml`'s history around this date does not match
  this file's.
