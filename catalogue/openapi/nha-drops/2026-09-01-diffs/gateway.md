# Gateway diff report, NHA drop 2026-09-01

NEW: `catalogue/openapi/.raw/nha-2026-09-01/fixed/hiecm/gateway.yaml` (10 operations, OpenAPI 3.0.2, `openapi: 3.0.2`, sha256 `e7ca9d3e54d6e6c8...` per the drop's review index).

OURS: `catalogue/openapi/hiecm/v3/hiecm-gateway.yaml` (7 operations, OpenAPI 3.1.1).

Note on the drop's own review index: `catalogue/openapi/nha-drops/2026-09-01.md` records this file as "5 exact matches, 5 new." This report finds 6 matched, 4 new-in-drop, 1 ours-only. The difference is one operation, the bridge-service lookup by id, whose OpenAPI path-template variable name changed from `{serviceId}` (ours) to `{service-id}` (drop) while the literal path segments on both sides of it are identical. An automated path-string comparison would treat that as a different path. The actual URL an integrator calls is unaffected by the template variable's name, so this report matches it on the literal path and calls out the naming inconsistency inside that operation's diff instead of counting it as new.

## 1. Operation inventory

| Method | Path | operationId ours | operationId theirs | Classification |
|---|---|---|---|---|
| POST | /api/hiecm/gateway/v3/sessions | gateway_sessions_create | abdm-sessions 1 | MATCHED |
| PATCH | /api/hiecm/gateway/v3/bridge/url | gateway_update_bridge_url | abdm-gateway3 | MATCHED |
| GET | /api/hiecm/gateway/v3/bridge-services | gateway_list_bridge_services | abdm-gateway1 | MATCHED |
| GET | /api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId} (ours) vs {service-id} (theirs) | gateway_get_bridge_service_by_id | abdm-gateway2 | MATCHED, path template variable renamed |
| GET | /api/hiecm/gateway/v3/certs | gateway_get_gateway_certs | abdm-sessions 3 | MATCHED |
| GET | /api/hiecm/gateway/v3/.well-known/openid-configuration | gateway_get_oidc_config | abdm-sessions 2 | MATCHED |
| POST | /v4/int/v1/bridges/MutipleHRPAddUpdateServices | gateway_register_bridge_services | (absent) | OURS-ONLY |
| GET | /api/hiecm/gateway/v3/providers | (absent) | abdm-gateway4 | NEW-IN-DROP |
| GET | /api/hiecm/gateway/v3/providers/{provider-id} | (absent) | abdm-gateway5 | NEW-IN-DROP |
| GET | /api/hiecm/gateway/v3/govt-programs | (absent) | abdm-gateway6 | NEW-IN-DROP |
| GET | /api/hiecm/gateway/v3/health-lockers | (absent) | abdm-gateway7 | NEW-IN-DROP |

Counts: 6 matched, 4 new-in-drop, 1 ours-only.

A cross-cutting observation before the per-operation diffs: the drop's operationIds are non-descriptive placeholders, `abdm-gateway1` through `abdm-gateway7` and `abdm-sessions 1` through `abdm-sessions 3` (the session-group ids contain a literal space character, which is legal YAML but an unusual operationId). Ours already carries descriptive operationIds plus, on 5 of the 7 operations, an `x-abdm-nha-operation-id` extension recording NHA's earlier descriptive id (`updateBridgeUrl`, `listBridgeServices`, `getBridgeServiceById`, `getGatewayCerts`, `getOidcConfig`). Keep our descriptive ids; there is nothing in the drop worth adopting for naming.

## 2. Matched operation diffs

### POST /api/hiecm/gateway/v3/sessions

**Headers.** Both sides require the same three headers, `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`, all required, all string. Examples differ only cosmetically: ours uses `5f7a4a1e-59ba-4c0c-9e0c-8e6b3b6e2f11` and `2026-08-25T15:51:15.339Z`; the drop uses `18235d89-cb13-479d-ad71-7a57d5f669a8` and `2022-10-06T15:10:00.587Z`. Both TIMESTAMP examples are UTC with milliseconds and a `Z` suffix, so no material difference and no contradiction of the recorded timestamp-utc correction (see section 5).

**Request body.** Same three required fields, `clientId`, `clientSecret`, `grantType`, all typed `string` on both sides. No material difference.

**Security.** Both sides mark this operation as not requiring a bearer token (ours: `security: []`; the drop: no `security` key and no document-level default). No material difference.

**Response status code.** Material difference. Ours documents only `"200"` returning `SessionResponse`. The drop documents `"202" Accepted` returning the token body, plus `"204"`, `"400"`, `"401"`, `"403"`, `"500"`, `"503"`. Before: `responses: '200': description: A session was created and a bearer token was issued.` After: `"202": description: Accepted`, body unchanged in shape.

**Response body shape.** Both sides return `accessToken`, `expiresIn`, `refreshExpiresIn`, `refreshToken`, `tokenType`. Field names and semantics match; no material difference in the body itself, only in the status code it arrives under.

**Error responses.** Ours documents none. The drop documents:
- `204`: body `{"error": {"code": "ABDM-1001", "message": "No data found"}}`, code pattern `^(ABDM-\d{4}|\d{3,6})(: )?$`.
- `400`: body `{"error": {"code": "ABDM-1015", "message": "Bad Request, invalid response"}}`.
- `401`: body `{"code": "900901", "message": "Invalid Credentials", "description": "Invalid Credentials. Make sure your API invocation call has a header: 'Authorization : Bearer ACCESS_TOKEN' or 'Authorization : Basic ACCESS_TOKEN' or 'apikey: API_KEY'"}`. Note the described remedy references headers that make little sense on the call that issues the very first token; likely generic boilerplate reused across operations rather than written for this endpoint specifically.
- `403`: plain text body, example `Forbidden`.
- `500`: body `{"error": {"code": "ABDM-9999", "message": "Unknown exception"}}`.
- `503`: body `{"code": "ABDM-1024", "message": "Dependent service unavailable"}`.

### PATCH /api/hiecm/gateway/v3/bridge/url

**Servers.** Material difference, and a defect in our file independent of the drop's content. Ours sets an operation-level `servers` override: `- url: https://dev.abdm.gov.in/api/hiecm`. Combined with the path key `/api/hiecm/gateway/v3/bridge/url`, the resolved URL is `https://dev.abdm.gov.in/api/hiecm/api/hiecm/gateway/v3/bridge/url`, a doubled `/api/hiecm` segment. The drop has no per-operation servers override; it resolves correctly against the document's global `servers` block to `https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge/url`. See recommended correction 1, this defect repeats on 4 more of our operations.

**Headers.** Material difference. Ours declares only `REQUEST-ID` and `TIMESTAMP` (via `$ref`). The drop adds `X-CM-ID` as a third required header. Ours is missing `X-CM-ID` here.

**Security.** Material difference. Ours declares no `security` key on this operation and the document has no default, so per OpenAPI semantics this operation currently requires no authentication at all. The drop declares `security: - bearerAuth: []`, a bearer token required. See recommended correction 4.

**Request body.** Same shape both sides: object, `required: [url]`, `url` typed `string, format: uri`. Before (ours): `example: https://your-hip.example.com/abdm/callback`, `description: HTTPS callback URL for the HIP/HIU`. After (drop): `example: https://webhook.site/`, `description: The bridge URL to be updated`. Cosmetic only.

**Response status code and body.** Material difference. Ours documents `"200"` returning `MessageResponse`, `{"message": "Operation completed successfully"}`. The drop documents `"202" Accepted` with **no content block at all**, no body. If the 202 status is adopted, the expectation of a JSON `message` field back must be dropped too, not just the status number.

**Error responses.** Same pattern as the sessions operation: ours documents none; the drop documents `204`, `400`, `401`, `403`, `500`, `503` with the same bodies described above.

### GET /api/hiecm/gateway/v3/bridge-services

**Servers.** Same doubled-path defect as bridge/url above. See recommended correction 1.

**Headers.** Material difference. Ours declares `REQUEST-ID` and `TIMESTAMP` only. The drop adds required `X-CM-ID`.

**Security.** Material difference. Ours declares no security (same gap as bridge/url). The drop declares `security: - bearerAuth: []`.

**Response body schema.** Major material difference, full shape replacement, not an incremental field change. Ours (`BridgeServicesResponse` wrapping `BridgeServiceDetail`):
```
services: [ { serviceId, bridgeId, serviceType (enum HIP/HIU/HRP), serviceName, facilityName, hipType (enum HOSPITAL/CLINIC/LAB/PHARMACY/WELLNESS/DIAGNOSTIC/OTHER), active } ]
```
The drop:
```
bridge: { id, name, url, active, blocklisted }
services: [ { id, name, types: [enum HIP/HIU/HEALTH_LOCKER/PHR], endpoints: { hipEndpoints: [{use, connectionType, address}], hiuEndpoints: [...], healthLockerEndpoints: [...] }, active } ]
```
None of the field names carry over. Ours has no `bridge` object at all; the drop's `services[].types` is an array where ours has a single-value `serviceType` enum; the drop nests connection endpoints per service, ours has no endpoints field. This needs a full schema replacement, not a patch. See recommended correction 5.

**Error responses.** Ours documents none; the drop documents `204`, `400`, `401`, `403`, `500`, `503` with the same bodies described above.

### GET /api/hiecm/gateway/v3/bridge-service/serviceId/{serviceId (ours) / service-id (theirs)}

**Path template variable.** Ours names it `serviceId`, the drop names it `service-id`. The literal path segments before and after the variable are identical (`.../bridge-service/serviceId/{...}`), so the actual URL an integrator constructs is unaffected. Worth aligning the name for consistency with the drop, low stakes.

**Servers.** Same doubled-path defect as bridge/url. See recommended correction 1.

**Path parameter description.** Ours: `description: Service identifier`, `examples: [CityHospital_HIP]`. The drop: `description: The service id`, no example given. Cosmetic.

**Headers.** Material difference, same as the two operations above: ours has `REQUEST-ID`/`TIMESTAMP` only, missing `X-CM-ID`.

**Security.** Material difference, same gap: ours has none, the drop requires `bearerAuth`.

**Response body schema.** Major material difference, full shape replacement. Ours (`BridgeServiceDetail`):
```
{ serviceId, bridgeId, serviceType (enum HIP/HIU/HRP), serviceName, facilityName, hipType (enum), active }
```
The drop:
```
{ id (number), bridgeId, serviceId, name, isHip (bool), isHiu (bool), isHealthLocker (bool), isPhr (bool), active (bool), registerTime (nullable date-time), dateCreated (nullable date-time), dateModified (nullable date-time) }
```
The enum-typed `serviceType`/`hipType` fields in ours are replaced by four independent boolean flags in the drop, `id` changes type from implicit string to explicit `number`, and three timestamp fields appear that ours has no equivalent for. Full replacement needed. See recommended correction 6.

**Error responses.** Ours documents none; the drop documents `204`, `400`, `401`, `403`, `500`, `503`.

### GET /api/hiecm/gateway/v3/certs

**Servers.** Same doubled-path defect as bridge/url. See recommended correction 1.

**Headers.** Material difference, and unlike the previous three operations this one is not a simple addition. Ours declares no `parameters` block at all for this operation, no `REQUEST-ID`, no `TIMESTAMP`, no `X-CM-ID`. The drop requires all three. This is consistent with ours treating certificate retrieval as a fully public, header-less call (see security note next), while the drop treats it like every other gateway call.

**Security.** Material difference and a direct contradiction, not just an addition. Ours: `security: []`, explicitly public. The drop: `security: - bearerAuth: []`, bearer token required. A JWKS-style certificate endpoint being gated behind the very bearer token that JWKS is used to verify is unusual (though not strictly circular, since the token comes from client id and secret, not from JWKS itself). Flag for sandbox verification rather than blind adoption; see recommended correction 8.

**Response body schema.** Additive material difference. Ours (`JwksResponse.keys[]`): `kid, kty, alg, use, n, e`. The drop's `keys[]` items: `e, kid, kty, n, use, x5c (array of certificate strings), x5t, x5t2, alg`. All of ours' fields are present in the drop; the drop adds `x5c`, `x5t`, `x5t2`. Safe to add, existing consumers of the current schema are unaffected. See recommended correction 7.

**Error responses.** Ours documents none; the drop documents `204`, `400`, `401`, `403`, `500`, `503`.

### GET /api/hiecm/gateway/v3/.well-known/openid-configuration

**Servers.** Same doubled-path defect as bridge/url. See recommended correction 1.

**Headers.** Material difference, same pattern as certs: ours declares no `parameters` block at all. The drop requires `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`.

**Security.** No material difference. Ours: `security: []`. The drop has no `security` key on this operation and no document-level default, which resolves to the same effect, no authentication required. Both sides agree this one stays public even though the drop gates the neighbouring certs operation.

**Response body schema.** Material difference, and the drop's side looks defective rather than authoritative. Ours (`OidcConfigResponse`) is a complete OIDC discovery document: `issuer, authorization_endpoint, token_endpoint, jwks_uri, response_types_supported, subject_types_supported, id_token_signing_alg_values_supported`, matching the real OIDC discovery convention. The drop's schema: `required: [url]`, but the only property actually defined is `jwks_uri`; there is no `url` property anywhere in the schema, so the `required` list references a field that does not exist. This is an internal contradiction in the drop's own file, not a corrected contract. Do not replace ours with it; see recommended correction 9 and section 5.

**Error responses.** Ours documents none; the drop documents `204`, `400`, `401`, `403`, `500`, `503`.

## 3. New-in-drop operations

All four are plain, synchronous `GET` registry lookups against the gateway, not callback legs. Each requires `bearerAuth` and all three standard headers (`REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`).

**GET /api/hiecm/gateway/v3/providers** (`abdm-gateway4`). Summary: "This API is invoked to fetch the list of providers filtered by name." Optional query parameter `name`. Returns an array of provider objects: `identifier {name, id}`, `facilityType` (array of enum HIP/HIU/HEALTH_LOCKER), `isHIP`, `isHiu`, `isHealthLocker`, `isPhr`, `isGovtEntity`, `endpoints.healthLockerEndpoints`. Real gateway operation, a provider directory lookup.

**GET /api/hiecm/gateway/v3/providers/{provider-id}** (`abdm-gateway5`). Summary: "fetch the record for provider details for requested provider id." Path parameter `provider-id`. Returns a single provider object with only `identifier {name, id}`, `facilityType`, `isHIP`, a much narrower field set than the list operation above returns per item. Real gateway operation, not a callback.

**GET /api/hiecm/gateway/v3/govt-programs** (`abdm-gateway6`). Summary: "fetch the list of govt programs." No operation-specific query parameters beyond the standard headers. Returns an array shaped identically to the by-id provider response above: `identifier {name, id}`, `facilityType`, `isHIP`. The identical shape to a provider record, right down to field order, suggests this schema was copied from the provider-by-id operation during authoring rather than modelled from a real government-program payload; worth confirming with NHA before trusting it as the true shape. Real gateway operation, not a callback.

**GET /api/hiecm/gateway/v3/health-lockers** (`abdm-gateway7`). Summary: "fetch the record with health locker enabled provider details." Optional query parameter `name`. Returns an array of objects: `identifier {name, id}`, `facilityType`, `isHip`, `isGovtEntity`, `endpoints.healthLockerEndpoints`. Real gateway operation, a health-locker-enabled provider directory lookup, not a callback.

None of these four are asynchronous or webhook-shaped; all are synchronous `200`-returning list or lookup calls. They belong as new endpoint atoms once this diff is folded in, out of scope for this report to draft.

## 4. Recommended corrections

1. **HIGH.** Remove the erroneous operation-level `servers` override from all 5 operations that carry it: `gateway_update_bridge_url`, `gateway_list_bridge_services`, `gateway_get_bridge_service_by_id`, `gateway_get_gateway_certs`, `gateway_get_oidc_config`. Each sets `servers: [{url: https://dev.abdm.gov.in/api/hiecm}]`, which combined with paths that already start with `/api/hiecm/...` resolves to a doubled `/api/hiecm/api/hiecm/...` URL. The document's global `servers` block already resolves these paths correctly without any override. This is not something the drop introduced; it is a pre-existing defect in our file that this comparison surfaces because the drop's paths resolve cleanly against the same global servers.

2. **HIGH.** Add the `X-CM-ID` header (`$ref: '#/components/parameters/CmId'`) to `gateway_update_bridge_url`, `gateway_list_bridge_services`, and `gateway_get_bridge_service_by_id`. All three currently list only `REQUEST-ID` and `TIMESTAMP`; the drop requires `X-CM-ID` on every one of these plus every new operation.

3. **HIGH.** Add `security: [gatewaySession: []]`, referencing our own already-defined `gatewaySession` securityScheme, to `gateway_update_bridge_url`, `gateway_list_bridge_services`, and `gateway_get_bridge_service_by_id`. All three currently declare no `security` key and the document has no default, so as written they require no authentication, which cannot be right for bridge-management operations. Use our own scheme name, not the drop's `bearerAuth`, since `bearerAuth` is not defined anywhere in our file's `components.securitySchemes` (only `gatewaySession` is; see also the unrelated dangling `bearerAuth` reference noted against the ours-only operation below).

4. **HIGH.** Add the `x5c`, `x5t`, `x5t2` fields to `JwksResponse.keys` items in `gateway_get_gateway_certs`. Purely additive next to the existing `kid, kty, alg, use, n, e`; no existing consumer of the current schema breaks.

5. **HIGH, full replacement.** Replace the response schema of `gateway_list_bridge_services` with the drop's shape: a top-level `bridge` object (`id, name, url, active, blocklisted`) plus a `services` array of `{id, name, types (array of enum HIP/HIU/HEALTH_LOCKER/PHR), endpoints: {hipEndpoints, hiuEndpoints, healthLockerEndpoints}, active}`. This is not an incremental patch to `BridgeServicesResponse`/`BridgeServiceDetail`; it is a different shape entirely. Call this out explicitly in the correction commit since it changes what integrators must parse.

6. **HIGH, full replacement.** Replace the response schema of `gateway_get_bridge_service_by_id` with the drop's shape: `{id (number), bridgeId, serviceId, name, isHip, isHiu, isHealthLocker, isPhr, active, registerTime, dateCreated, dateModified}`. Same caveat as correction 5, this replaces rather than extends the current `BridgeServiceDetail` schema.

7. **MEDIUM.** Add `REQUEST-ID` and `TIMESTAMP` headers to `gateway_get_gateway_certs` and `gateway_get_oidc_config`, which currently declare no `parameters` block at all. The drop requires both headers on both operations. Graded MEDIUM rather than HIGH because both are conventionally public discovery-style endpoints (JWKS, OIDC), and it is worth one sandbox call to confirm the headers are actually enforced rather than present only because NHA's authors reused the same header template across every gateway path.

8. **LOW, needs sandbox.** Do not adopt `security: [bearerAuth]` for `gateway_get_gateway_certs` without confirming it against the sandbox first. The drop requires a bearer token to fetch the JWKS used to verify tokens, which is an unusual requirement for a certificate-discovery endpoint and contradicts our current `security: []`. A single unauthenticated call against the sandbox will settle whether the drop is right or whether this is another authoring artifact like the OIDC schema defect in correction 9.

9. **LOW, do not apply.** Do not replace `OidcConfigResponse` with the drop's schema for `gateway_get_oidc_config`. The drop's schema lists `required: [url]` while defining no `url` property anywhere, only `jwks_uri`; this is an internal contradiction in the drop's own file rather than a corrected contract. Keep our current full OIDC discovery document shape (`issuer, authorization_endpoint, token_endpoint, jwks_uri, response_types_supported, subject_types_supported, id_token_signing_alg_values_supported`). Raise this specific schema defect back to NHA using the same pattern as `catalogue/openapi/corrections/2026-08-27-report-to-nha.md`.

10. **MEDIUM.** Change the documented success status from `200` to `202 Accepted` for `gateway_sessions_create`, and add the drop's `204`, `400`, `401`, `403`, `500`, `503` error responses. Graded MEDIUM, not HIGH, because this contradicts what the endpoint atom currently states (see section 5) and a status-code change of this kind changes what a correctly written client checks for; settle it with one real sandbox call before committing to it, per the pattern already used for the timestamp-utc and certificate corrections.

11. **MEDIUM.** Change the documented success status from `200` to `202 Accepted` for `gateway_update_bridge_url`, and note that the drop's `202` response for this operation has **no body at all**, unlike the sessions operation's `202`. If adopted, drop the `MessageResponse` body expectation entirely for this operation rather than keeping it under the new status code. Add the drop's `204`, `400`, `401`, `403`, `500`, `503` error responses.

12. **HIGH, out of scope for this file.** Generate new endpoint stubs for the 4 new-in-drop operations, `GET /api/hiecm/gateway/v3/providers`, `GET /api/hiecm/gateway/v3/providers/{provider-id}`, `GET /api/hiecm/gateway/v3/govt-programs`, `GET /api/hiecm/gateway/v3/health-lockers`. All four are genuine new gateway registry operations with no callback shape and no existing counterpart. This report only diffs the specs; dispatch the normal openapi-ingest stub generation and atom-author flow separately.

13. **LOW, unrelated to the drop, noted in passing.** The ours-only operation `gateway_register_bridge_services` (`POST /v4/int/v1/bridges/MutipleHRPAddUpdateServices`) references a security scheme named `bearerAuth` in its `security: [bearerAuth: []]` block, but `bearerAuth` is not defined anywhere in this file's `components.securitySchemes`, only `gatewaySession` is. This is a pre-existing broken reference, untouched by this drop since the drop does not cover this path at all (it lives against a different host, `apihspsbx.abdm.gov.in`, the HSP Registry). Worth fixing independently of this drop; flagged here only because correction 3 above deliberately avoids repeating the same mistake by naming `gatewaySession` instead of `bearerAuth`.

## 5. Contradictions with recorded corrections

- **Timestamp UTC correction** (`catalogue/openapi/corrections/2026-08-26-timestamp-utc.md`). No contradiction. Every `TIMESTAMP` example in the drop, across all 10 operations, is UTC with milliseconds and a `Z` suffix (for example `2022-10-06T15:10:00.587Z`), consistent with what the correction settled. The drop's example year is stale (2022) against ours (2026), cosmetic only.

- **C3, the `RequestId` UUID format removal** (`catalogue/openapi/corrections/2026-08-25-m1-m2-m3-ingest.md`, tracked further in `PENDING.md` P1). No contradiction and no resolution either. P1 concerns `consentId`, `consentRequestId`, and `id` fields elsewhere in the M2 and M3 files, not the `REQUEST-ID` header this gateway file carries. The drop's `REQUEST-ID` example, `18235d89-cb13-479d-ad71-7a57d5f669a8`, is itself a well-formed UUID, same as before; this file's C3 marker is untouched by anything in the drop.

- **The `gateway-sessions` endpoint atom** (`catalogue/hiecm/endpoints/gateway-sessions.md`). Direct contradiction. The atom currently states: "NHA's own collection records responses for this operation at status 200, and those bodies are in the specification as examples with the personal data scrubbed." That claim was sourced from NHA's Postman collection during the original ingest, not from this swagger drop. This swagger drop now says the same operation returns `202 Accepted`, not `200`. Two NHA-originated sources disagree on the status code for the same call; do not silently pick one. Settle with a real sandbox call (see recommended correction 10) and update the atom's wording to record both historical claims and the observed result, following the same evidentiary pattern as the timestamp-utc correction file.

- **PENDING.md P5, NHA repeats the gateway group across milestone files.** Not a contradiction, but relevant context. P5 was written when the session, certificate and bridge group only existed embedded inside the M1, M2 and M3 swagger files, three copies that could drift apart. This drop ships the group as its own standalone `gateway.yaml` file for the first time. That is a structural change on NHA's side worth folding into P5's watch note: there may now be a fourth copy (or NHA may be consolidating toward one canonical file), which changes what the source watcher should be comparing against going forward.
