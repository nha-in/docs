# M2 Linking, diff against the 2026-09-01 NHA drop

Compares four files under `catalogue/openapi/.raw/nha-2026-09-01/fixed/hiecm/`
(`hip-initiated-linking.yaml`, 7 ops; `user-initiated-linking.yaml`, 12 ops;
`link-token.yaml`, 2 ops; `patient-share.yaml`, 5 ops; 26 ops total) against
`catalogue/openapi/hiecm/v3/hiecm-m2.yaml` (10 paths, 6 webhooks, 16 total),
plus `hiecm-m1.yaml` and `hiecm-p2.yaml` for the patient-share ops, per the
task's instruction to check those files before calling a patient-share op
new. Nothing was edited. This file is the only output.

Note on paths: the task described the source tree as
`.raw/nha-2026-09-01/swagger/fixed/hiecm/`. The actual path in this checkout
is `.raw/nha-2026-09-01/fixed/hiecm/` (no `swagger/` segment). File names and
operation counts match exactly (7, 12, 2, 5), so this is a path typo in the
task, not a different drop.

## Counts

| Class | Count |
|---|---|
| MATCHED-TO-PATH | 10 |
| MATCHED-TO-WEBHOOK | 3 |
| NEW-IN-DROP | 13 |
| OURS-ONLY | 6 |
| Drop total | 26 |
| Ours total (hiecm-m2.yaml) | 16 |

## 1. Operation inventory

### hip-initiated-linking.yaml (7 ops)

| Drop operationId | Drop path | Class | Ours |
|---|---|---|---|
| `abdm-hip-initiated-linking-hip 1` | POST /api/hiecm/hip/v3/link/carecontext | MATCHED-TO-PATH | `m2_hip_link_care_context` |
| `hip-initiated-linking 2` | POST /api/v3/link/on_carecontext | NEW-IN-DROP | none |
| `abdm-hip-initiated-linking-hip 3` | POST /api/hiecm/hip/v3/link/context/notify | MATCHED-TO-PATH | `m2_link_care_context_notify` |
| `hip-initiated-linking 3` | POST /api/v3/links/context/on-notify | NEW-IN-DROP | none |
| `abdm-hip-initiated-linking-hip 4` | POST /api/hiecm/hip/v3/link/patient/links/sms/notify2 | MATCHED-TO-PATH | `m2_sms_deep_link_notify` |
| `hip-initiated-linking 5` | POST /api/v3/patients/sms/on-notify | NEW-IN-DROP | none |
| `abdm-hip-initiated-linking-hip 2` | GET /api/hiecm/hip/v3/link/patient/links | NEW-IN-DROP | none |

### user-initiated-linking.yaml (12 ops)

| Drop operationId | Drop path | Class | Ours |
|---|---|---|---|
| `abdm-user-initiated-linking 1` | POST /api/v3/hip/patient/care-context/discover | MATCHED-TO-WEBHOOK | `m2_on_discovery_request` |
| `abdm-user-initiated-linking 2` | POST /api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover | MATCHED-TO-PATH | `m2_on_discover_care_contexts` |
| `abdm-user-initiated-linking 3` | POST /api/v3/hip/link/care-context/init | MATCHED-TO-WEBHOOK | `m2_on_link_init` |
| `abdm-user-initiated-linking 4` | POST /api/hiecm/user-initiated-linking/v3/link/care-context/on-init | MATCHED-TO-PATH | `m2_receive_link_init` |
| `abdm-user-initiated-linking 5` | POST /api/v3/hip/link/care-context/confirm | MATCHED-TO-WEBHOOK | `m2_on_link_confirm` |
| `abdm-user-initiated-linking 6` | POST /api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm | MATCHED-TO-PATH | `m2_receive_link_confirm` |
| `abdm-user-initiated-linking-phr 1` | POST /api/hiecm/user-initiated-linking/v3/patient/care-context/discover | NEW-IN-DROP | none (HIU/PHR side) |
| `abdm-user-initiated-linking-phr 2` | POST /api/v3/hiu/patient/care-context/on-discover | NEW-IN-DROP | none (HIU/PHR side) |
| `abdm-user-initiated-linking-phr 3` | POST /api/hiecm/user-initiated-linking/v3/link/care-context/init | NEW-IN-DROP | none (HIU/PHR side) |
| `abdm-user-initiated-linking-phr 4` | POST /api/v3/hiu/patient/care-context/on-init | NEW-IN-DROP | none (HIU/PHR side) |
| `abdm-user-initiated-linking-phr 5` | POST /api/hiecm/user-initiated-linking/v3/link/care-context/confirm | NEW-IN-DROP | none (HIU/PHR side) |
| `abdm-user-initiated-linking-phr 6` | POST /api/v3/hiu/patient/care-context/on-confirm | NEW-IN-DROP | none (HIU/PHR side) |

The six `-phr` operations are the HIU/PHR-application half of the same
discover/init/confirm protocol whose HIP half is matched above. `hiecm-m2.yaml`
is explicitly the HIP side of M2 ("M2 is the provider side", per its
`info.description`), so these six have no counterpart there by design, not by
omission. They likely belong with the HIU-facing surface (M3, or a P-series
file) rather than M2. Flagged, not filed as M2 corrections.

### link-token.yaml (2 ops)

| Drop operationId | Drop path | Class | Ours |
|---|---|---|---|
| `abdm-link-token 1` | POST /api/hiecm/v3/token/generate-token | MATCHED-TO-PATH | `m2_generate_link_token` |
| `link-token 1` | POST /api/v3/hip/token/on-generate-token | NEW-IN-DROP | none |

### patient-share.yaml (5 ops)

Checked first against `hiecm-m1.yaml` and `hiecm-p2.yaml`, per instruction.
`grep -n "patient-share\|profile/share\|profile-share\|getTokenDetails" ` across
`hiecm-m1.yaml`, `hiecm-p2.yaml`, `hiecm-m3.yaml`, `hiecm-p1.yaml` finds hits
only in `hiecm-m1.yaml` (`/patient-share/v3/share`, `/patient-share/v3/on-share`)
and `hiecm-p2.yaml` (`/api/hiecm/patient-share/v3/on-share`,
`/scan-share/profile/share`). None of these ops belong to `hiecm-m2.yaml`;
none are new modules either. All 5 are folded into the M2 report because the
task named this file's scope, but every match below is cross-file.

| Drop operationId | Drop path | Class | Ours |
|---|---|---|---|
| `patient-share 1` | POST /api/v3/hip/patient/share | MATCHED-TO-PATH | `hiecm-m1.yaml` `/patient-share/v3/share` (`m1_receive_patient_share`) |
| `patient-share 2` | POST /api/hiecm/patient-share/v3/on-share | MATCHED-TO-PATH | `hiecm-m1.yaml` `/patient-share/v3/on-share` (`m1_on_share_acknowledgement`) **and** `hiecm-p2.yaml` `/api/hiecm/patient-share/v3/on-share` (`p2_onpatientshare`), same path, two files |
| `abdm-patient-share-hip 1` | POST /api/hiecm/patient-share/v3/share | MATCHED-TO-PATH (functional, different path string) | `hiecm-p2.yaml` `/scan-share/profile/share` (`p2_profile_share`) |
| `profile-share 2` | POST /api/v3/hiu/patient/on-share | NEW-IN-DROP | none |
| `profile-share 3` | GET /api/hiecm/patient-share/v3/profile/getTokenDetails | NEW-IN-DROP | none |

One pre-existing fact this surfaces on its own: `hiecm-m1.yaml` and
`hiecm-p2.yaml` both carry an operation at the identical path
`/api/hiecm/patient-share/v3/on-share` (`m1_on_share_acknowledgement` and
`p2_onpatientshare`), independent of the drop. That is our own duplication,
not something the drop introduced, but the drop is what exposed it by giving
one canonical shape to compare both of ours against.

### OURS-ONLY (6, not covered by any of the 4 drop files)

These are the consent-acknowledgement and data-flow half of `hiecm-m2.yaml`.
They would be covered by `hiecm/consent-management-data-flow.yaml` in the
drop, which is out of scope for this M2-linking report.

| Ours | Kind |
|---|---|
| `m2_consent_hip_on_notify` (`/hiecm/consent/v3/request/hip/on-notify`) | path |
| `m2_hip_health_information_on_request` (`/hiecm/data-flow/v3/health-information/hip/on-request`) | path |
| `m2_hip_data_flow_notify` (`/hiecm/data-flow/v3/health-information/notify`) | path |
| `m2_on_health_information_request` (`/v0.5/health-information/hip/request`) | webhook |
| `m2_on_consent_notify_hiu` (`/v0.5/consents/hiu/notify`) | webhook |
| `m2_on_data_notification` (`/api-hiu/data/notification`) | webhook |

## 2. Material differences, matched items

A structural fact that applies to every path operation below before the
per-field diffs: **`hiecm-m2.yaml`'s 10 path operations do not reference the
`RequestId`, `Timestamp` or `CmId` parameters that `components/parameters`
defines.** Only `m2_hip_link_care_context` references a parameter at all
(`XLinkToken`). Every matching drop operation, without exception, declares
`REQUEST-ID`, `TIMESTAMP`, and a role header (`X-CM-ID`, `X-HIP-ID` or
`X-HIU-ID`) as required headers. `X-HIP-ID` and `X-HIU-ID` do not exist in
`components/parameters` at all today. This is not called out again per
operation below; it applies to all ten.

### A1. `m2_hip_link_care_context` vs `abdm-hip-initiated-linking-hip 1`

Path matches exactly: `/hiecm/hip/v3/link/carecontext` (ours, `/hiecm/hip/...`
is relative to `https://dev.abdm.gov.in/api`) vs
`/api/hiecm/hip/v3/link/carecontext` (drop, `/api/...` is absolute). Same
endpoint, base URL folded differently. No material difference there.

- **Headers.** Ours: none declared. Drop: `REQUEST-ID`, `TIMESTAMP`,
  `X-CM-ID`, `X-HIP-ID`, `X-LINK-TOKEN`. Ours separately declares
  `X-Link-Token` as a component parameter but does not attach it to this
  operation as a `$ref`; the raw file's `parameters` list for this path in
  our copy is absent (see structural note above), even though our own prose
  ("Requires the `X-Link-Token` header with a freshly generated link token")
  says it is required.
- **Request body field name and type.** Ours, `PatientCareContextEntry.hiType`:
  ```yaml
  hiType:
    type: array
    items:
      $ref: '#/components/schemas/HIType'
  ```
  Drop, same position in the same request:
  ```json
  "hiTypes": {
    "type": "string",
    "enum": ["DiagnosticReport", "DischargeSummary", "HealthDocumentRecord",
      "ImmunizationRecord", "OPConsultation", "Prescription", "WellnessRecord",
      "Invoice"],
    "example": "DiagnosticReport"
  }
  ```
  Two differences at once: the field is named `hiTypes` (plural) in the drop
  and `hiType` (singular) in ours, and the drop's `hiTypes` is a bare string
  where every other occurrence of this concept, in both files, is a list.
  Correction C4 (`2026-08-25-m1-m2-m3-ingest.md`) already fixed the same
  string-vs-array bug at two sites in user-initiated-linking; this is a third
  site, in a different drop file, that C4 did not touch, and that our own
  schema already gets right (as an array) independent of C4.
- **`HIType` enum is missing a value.** The drop's enum above has 8 entries.
  Ours (`components.schemas.HIType`) has 7:
  ```yaml
  HIType:
    type: string
    enum:
    - Prescription
    - DiagnosticReport
    - OPConsultation
    - DischargeSummary
    - ImmunizationRecord
    - HealthDocumentRecord
    - WellnessRecord
  ```
  `Invoice` is absent. The same 8-value enum, with `Invoice`, recurs in every
  drop operation that carries a HI type list (hip-initiated-linking op 1 and
  op 3, user-initiated-linking on-discover and on-confirm, GET
  patient/links). This is not a one-off typo in the drop.
- **Response codes.** Ours: `202`, `400` (`BadRequest`), `401`
  (`Unauthorized`). Drop: `202`, `400`, `401`, `403`, `404`, `500`. Missing
  in ours: `403`, `404`, `500`.
- **Error schema shape and type.** Ours, `ErrorResponse`:
  ```yaml
  ErrorResponse:
    type: object
    properties:
      code:
        type: integer
      message:
        type: string
  ```
  `code` is declared `integer`. Every ABDM error code in this file and in
  the drop is a string like `ABDM-1006`; an integer type cannot hold it. The
  drop's 400/404/500 responses nest the pair under an `error` key and type
  `code` as a string with an explicit pattern:
  ```json
  "code": {
    "type": "string",
    "pattern": "^(ABDM-\\d{4}|\\d{3,6})(: )?$",
    "example": "ABDM-1006"
  }
  ```
  The drop's 401/403 responses are shaped differently again: flat (no
  `error` wrapper), carrying a `description` field, and an example code of
  `900902`, a bare numeric family distinct from `ABDM-xxxx` everywhere else
  in both specs. This confirms our `ErrorResponse` is wrong on type (should
  be `string`) and incomplete on shape (does not model the `error` wrapper
  or the flat 401/403 variant).
- **The trailing colon-space pattern is now in NHA's own spec.** The pattern
  `^(ABDM-\d{4}|\d{3,6})(: )?$` explicitly allows a trailing `": "`. This is
  the exact defect `catalogue/hiecm/errors/abdm-1016.md` recorded from a live
  sandbox response (`"code":"ABDM-1016: "`) and that
  `2026-08-27-report-to-nha.md` item 4 asked NHA to document. The drop is
  NHA documenting it. See section 5.

### A2. `m2_link_care_context_notify` vs `abdm-hip-initiated-linking-hip 3`

- **Headers.** Drop: `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`, `X-HIP-ID`. Ours:
  none attached (see structural note).
- **`notification.hip` required fields.** Ours,
  `LinkCareContextNotifyRequest.notification.hip`:
  ```yaml
  hip:
    type: object
    properties:
      id:
        type: string
  ```
  No `required` list, so `id` is the only field described at all. Drop:
  ```json
  "hip": {
    "required": ["id", "name", "type"],
    "properties": {"id": {...}}
  }
  ```
  (the drop's own schema only bothers to define `id`'s properties, but lists
  `name` and `type` as required, an internal inconsistency in the drop
  itself, flagged rather than copied verbatim.) Ours should at minimum note
  that `name` and `type` are expected.
- **`notification.hiTypes`.** Matches in shape here: both drop and ours use
  `hiTypes` as an array in this specific operation (unlike A1, where the
  drop used a bare string). No correction needed on this field for this
  operation.
- **Response codes.** Ours: `202`, `400`, `401`. Drop: `202`, `400`, `401`,
  `403`, `404`, `500`. Same gap pattern as A1.

### A3. `m2_sms_deep_link_notify` vs `abdm-hip-initiated-linking-hip 4`

- **Headers.** Drop: `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`. Ours: none
  attached.
- **Request body.** Matches closely. Ours `SmsNotifyRequest.notification`
  requires `phoneNo`, `hip.name`, `hip.id`; drop requires the same
  (`notification.required: [phoneNo, hip]`, `hip.required: [id, name]`). No
  material field difference found here beyond the header gap and response
  codes.
- **Response codes.** Ours: `202`, `400`, `401`. Drop: `202`, `400`, `401`,
  `403`, `404`, `500`.
- Ours also carries a top-level `requestId`/`timestamp` pair on
  `SmsNotifyRequest` (`x-abdm-correction: C3` on `requestId`) that the drop
  does not put in the body at all, because the drop moved `REQUEST-ID` and
  `TIMESTAMP` to headers. This is consistent with how every other operation
  in both files treats these two fields, so ours is the outlier by putting
  them in the body as well as (implicitly) expecting them as headers.

### A4. `m2_on_discover_care_contexts` vs `abdm-user-initiated-linking 2`

- **Headers.** Drop: `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`. Ours: none
  attached.
- **Required fields.** Ours, `OnDiscoverRequest.required`:
  `[transactionId, patient, response]`. Drop: `[transactionId, patient,
  matchedBy, response]`. `matchedBy` (an array, per the drop) is absent from
  our schema entirely.
- **`transactionId` format.** Drop asserts `format: uuid` on `transactionId`
  here (and on every `transactionId` across the whole drop) with real-shaped
  UUID examples (`f901b782-bfdf-4224-9f8d-da2cadc20c0d`). Ours does not
  assert a format on `transactionId` (only `consentId`/`consentRequestId`/`id`
  were ever asserted and then stripped under C3, per
  `2026-08-25-m1-m2-m3-ingest.md`; `transactionId` was never in that set).
  This does not resolve pending item P1 (that was about a different field
  set, and pattern-matching to a spec is not a sandbox observation), but it
  is new evidence worth recording against P1 rather than silently adding a
  format assertion. See section 5.
- **Response codes.** Ours: `202`, `400`, `401`. Drop: `202`, `400`, `401`,
  `403`, `500`.

### A5. `m2_receive_link_init` vs `abdm-user-initiated-linking 4`

- **Headers.** Drop: `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`. Ours: none
  attached.
- **`transactionId` nullability.** Drop marks `transactionId` `nullable:
  true` on this specific operation (inconsistent with A4's `on-discover`,
  where the same field is `nullable: false`); ours does not model
  nullability on this field either way. Minor, worth a footnote rather than
  a fix, since it is the drop contradicting itself.
- **`link.meta.communicationExpiry` format.** Drop uses `format:
  iso-date-time` (non-standard OpenAPI format keyword; the standard value is
  `date-time`). Ours uses `format: date-time` on the equivalent field,
  which is the more correct of the two and needs no change.
- **Response codes.** Ours: `202`, `400`, `401`. Drop: `202`, `400`, `401`,
  `403`, `500`.

### A6. `m2_receive_link_confirm` vs `abdm-user-initiated-linking 6`

- **Headers.** Drop: `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`. Ours: none
  attached.
- **Field shapes match closely**, including `hiType` as an array with the
  same 7-vs-8 enum gap noted in A1 (the `Invoice` value applies here too,
  transitively, since both reference `HIType`/the equivalent inline enum).
- **Response codes.** Ours: `202`, `400`, `401`. Drop: `202`, `400`, `401`,
  `403`, `500`.

### A7. `m2_generate_link_token` vs `abdm-link-token 1`

This is the most consequential difference in the matched set.

- **Success response code and shape.** Ours:
  ```yaml
  responses:
    '200':
      description: Link token generated
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/LinkTokenResponse'
  ```
  synchronous, `200`, token in the body. Drop:
  ```json
  "responses": {
    "202": {"description": "Accepted"},
    "400": {...}, "401": {...}, "403": {...}, "404": {...}, "500": {...}, "503": {...}
  }
  ```
  `202 Accepted`, no body at all. The drop pairs this with a second
  operation, `link-token 1` (`POST /api/v3/hip/token/on-generate-token`),
  explicitly documented as "**Hosted by the HIP/HIU, not by ABDM.** ABDM
  calls this endpoint at the callback URL registered for your bridge", whose
  success variant carries the actual token:
  ```json
  {"abhaAddress": "...", "linkToken": "eyJhbGci...", "response": {"requestId": "..."}}
  ```
  Read together, generating a link token is asynchronous in the drop: the
  HIP's call is acknowledged with `202`, and the token itself arrives later
  on a callback the HIP's bridge must expose. Our spec models it as a plain
  synchronous request/response with no callback. Since `m2_hip_link_care_context`
  (A1) requires `X-Link-Token` to already be in hand for the very next call,
  and link tokens are described elsewhere in our file as "expire quickly",
  this changes the integration shape materially: an integrator following our
  current spec would poll or block on a `200` that the drop says will not
  come.
- **Headers.** Drop: `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`, `X-HIP-ID`. Ours:
  none attached.
- **Request body.** Matches closely on the success path
  (`abhaAddress`/`name`/`gender`/`yearOfBirth`/optional `abhaNumber`), no
  material field gap.

### A8. `m1_receive_patient_share` (hiecm-m1.yaml) vs `patient-share 1`

- **Headers.** Ours: `RequestId`, `Timestamp` (both `$ref`'d). Drop:
  `REQUEST-ID`, `TIMESTAMP`, `X-HIP-ID`. Missing: `X-HIP-ID`.
- **`intent` enum.** Ours, `PatientShareRequest.intent`:
  ```yaml
  intent:
    type: string
    enum:
    - PROFILE_SHARE
    description: Always `PROFILE_SHARE` for scan-and-share flows
  ```
  Drop:
  ```json
  "intent": {"enum": ["PROFILE_SHARE", "RECORD_SHARE", "PAYMENT_SHARE"]}
  ```
  Ours asserts, in prose, that the value is always `PROFILE_SHARE`; the drop
  lists two more values NHA's own scan-and-share family supports
  (`RECORD_SHARE`, `PAYMENT_SHARE`) at this exact path. Our claim is
  narrower than NHA's own spec.
- **`metaData` required fields.** Ours requires `[hipId, context]`
  (`hprId` optional, no location fields at all). Drop requires `[hipId,
  context, latitude, longitude]` (`hprId` still optional). `latitude` and
  `longitude` are absent from our schema entirely.
- **Response codes.** Ours: `200` only ("Profile received by HIP"). Drop:
  `200`, `400`, `401`, `403`, `408`, `500`, `503`. No error responses are
  modelled on our side at all for this operation.

### A9. `m1_on_share_acknowledgement` / `p2_onpatientshare` vs `patient-share 2`

Two of ours match one drop operation at the identical path.

- **Success response code.** Ours (`hiecm-m1.yaml`): `200`, "Acknowledgement
  accepted by Gateway". Ours (`hiecm-p2.yaml`, `p2_onpatientshare`): no
  success response modelled at all, only `400` and `500`. Drop: `202`
  Accepted, plus `400`, `401`, `403`, `404`, `408`, `429`, `500`, `503`. The
  m1 copy's `200` should be `202`; the p2 copy is missing a success response
  outright.
- **Headers.** Ours (m1): `RequestId`, `Timestamp`. Ours (p2): none. Drop:
  `REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`. `X-CM-ID` is missing from both of
  ours.
- **`acknowledgement.profile.expiry`.** Drop requires
  `profile.required: [context, tokenNumber, expiry]`, `expiry` a number
  (seconds). Ours (m1) `OnShareRequest.acknowledgement.profile` has only
  `context` and `tokenNumber`, no `expiry`, and no `required` list on
  `profile` at all. Ours (p2) does require `[context, expiry, tokenNumber]`,
  so p2's copy already has this field and m1's does not; the drop confirms
  p2's shape is the more complete one here.
- **`status` enum value disagreement, inside NHA's own materials.** Ours
  (m1) declares `enum: [SUCCESS, FAILURE]`. The drop does not constrain
  `status` with an enum, but its own field description reads: `"The status
  of the transaction.Allows like (SUCCESS|FAILED)"`, i.e. `FAILED`, not
  `FAILURE`. This is NHA's fixed-tier drop disagreeing with itself (an
  enum-free field whose own prose names a different literal than the value
  our earlier NHA source gave us). Not something to silently pick a side on;
  flagged for NHA rather than corrected here.

### A10. `p2_profile_share` (hiecm-p2.yaml) vs `abdm-patient-share-hip 1`

The weakest match in the set: same intent, different path
(`/scan-share/profile/share` ours vs `/api/hiecm/patient-share/v3/share`
drop), and ours is nearly empty.

- **Path.** Ours: `/scan-share/profile/share`. Drop: `/api/hiecm/patient-share/v3/share`.
  Not the same string; matched here on function (both are "PHR/HIU initiates
  a profile/record/payment share with a facility"), not on path identity.
- **Everything else.** `p2_profile_share` today has **no `requestBody`, no
  `parameters`, and only three responses (`500`, `404`, `401`), no success
  response at all**:
  ```yaml
  /scan-share/profile/share:
    post:
      operationId: p2_profile_share
      tags: [scan_and_share]
      summary: profile share
      responses:
        '500': {...}
        '404': {...}
        '401': {...}
  ```
  The drop's `abdm-patient-share-hip 1` gives a full `intent`/`metaData`/
  `profile` request body (identical shape to A8's `PatientShareRequest`,
  including the same `latitude`/`longitude` gap noted there), 5 headers
  (`REQUEST-ID`, `TIMESTAMP`, `X-CM-ID`, `X-HIU-ID`, `X-AUTH-TOKEN`), and 9
  response codes including a `202` success. This is close to a full
  from-scratch fill-in, not a field-level correction. See section 4,
  recommendation 11, for the scope decision this needs before editing.

## 3. Matched-to-webhook, material differences and payload additions

`hiecm-m2.yaml`'s webhooks section states, in its own `info.description`:
"NHA's file carries no callbacks at all, so the inbound half is not in it.
The `webhooks` below are what the gateway posts to your registered URL. Only
the data notification carries a payload transcribed from NHA's collection;
the rest are declared with the path and no body." Three of those bodyless
webhooks now have a payload, courtesy of this drop treating the inbound leg
as an ordinary path with the HIP as the server. See section 5 for how this
sits against the correction record.

### B1. `m2_on_discovery_request` (webhook `/v0.5/care-contexts/discover`) vs `abdm-user-initiated-linking 1`

Drop path: `POST /api/v3/hip/patient/care-context/discover`. Headers:
`REQUEST-ID`, `TIMESTAMP`, `X-HIP-ID`. Request body, `required: [transactionId,
patient]`:

```json
{
  "transactionId": {"type": "string", "format": "uuid"},
  "patient": {
    "required": ["id", "verifiedIdentifiers", "name", "gender", "yearOfBirth"],
    "properties": {
      "id": {"type": "string", "example": "abc@abdm"},
      "verifiedIdentifiers": {"items": {"required": ["type", "value"],
        "properties": {"type": {"enum": ["MR","MOBILE","ABHA_NUMBER","ABHA_ADDRESS","EMAIL"]}}}},
      "unverifiedIdentifiers": {"...same shape, not required..."},
      "name": {"type": "string"},
      "gender": {"enum": ["M","F","O","D","T","U"]},
      "yearOfBirth": {"type": "integer"}
    }
  }
}
```

Response codes the drop expects the HIP to be able to return:
`202`, `400`, `401`, `403`, `500`. Our webhook currently documents only
`202`.

This is a full request shape for what we had modelled as path-only. It does
not carry retry behaviour; see below.

### B2. `m2_on_link_init` (webhook `/v0.5/links/link/init`) vs `abdm-user-initiated-linking 3`

Drop path: `POST /api/v3/hip/link/care-context/init`. Headers: `REQUEST-ID`,
`TIMESTAMP`, `X-HIP-ID`. Request body, `required: [transactionId, abhaAddress,
patient]`:

```json
{
  "transactionId": {"format": "uuid"},
  "abhaAddress": {"type": "string"},
  "patient": {"items": {"required": ["referenceNumber","display","careContexts","hiType"],
    "properties": {"hiType": {"type": "string", "enum": [...8 values incl. Invoice...]}}}}
}
```

Response codes: `200`, `400`, `401`, `403`, `500` (`200`, not `202`, unlike
every other callback-shaped operation in this drop; worth flagging to NHA
rather than assuming it is deliberate). Our webhook currently documents only
`202`, and no body.

Note `hiType` here is again a bare string against an array-shaped field name
everywhere else (same A1/C4-family issue), and again includes `Invoice`.

### B3. `m2_on_link_confirm` (webhook `/v0.5/links/link/confirm`) vs `abdm-user-initiated-linking 5`

Drop path: `POST /api/v3/hip/link/care-context/confirm`. Headers:
`REQUEST-ID`, `TIMESTAMP`, `X-HIP-ID`. Request body, `required: [confirmation]`:

```json
{
  "confirmation": {
    "required": ["token", "linkRefNumber"],
    "properties": {
      "token": {"type": "integer", "example": 123456, "description": "Must be 6 digit"},
      "linkRefNumber": {"type": "string", "format": "uuid"}
    }
  }
}
```

Response codes: `200`, `400`, `401`, `403`, `500`. Our webhook currently
documents only `202`, and no body. This is the clearest and simplest of the
three new payloads: the Gateway hands the HIP the 6-digit OTP the patient
entered and the link reference number from the earlier init step, and the
HIP is expected to validate and confirm.

**Retry behaviour.** None of the three drop operations, nor any other
operation in any of the four files, states a retry count, backoff, or
timeout for the Gateway-to-HIP leg. The one retry-adjacent fact in the whole
drop is the "20 minutes from request to data push" language already in our
own webhook description for `m2_on_health_information_request`, which is
unrelated to these three (out of scope here; see OURS-ONLY). Retry
behaviour for discovery, link-init and link-confirm stays unknown; do not
invent it.

## 4. Recommended corrections

### HIGH confidence

1. **Attach headers to all 10 M2 path operations.** None reference
   `RequestId`/`Timestamp`/`CmId` today even though `components/parameters`
   defines them; every drop operation requires the equivalent three (plus a
   role header). Add `parameters: [$ref RequestId, $ref Timestamp, $ref
   CmId or the new HIP/HIU parameter]` to each of the 10 paths. Add
   `X-HIP-ID` and `X-HIU-ID` to `components/parameters` first; neither
   exists today.
2. **Fix `ErrorResponse.code` from `integer` to `string`.** NHA's own
   pattern, `^(ABDM-\d{4}|\d{3,6})(: )?$`, cannot be represented as an
   integer. Also model the `error`-wrapped 400/404/500 shape versus the flat
   401/403 shape (with its distinct `900902`-family code and `description`
   field) as two response schemas rather than reusing one `ErrorResponse`
   for both.
3. **Add `Invoice` to the shared `HIType` enum.** Every drop operation that
   lists HI types uses an 8-value enum ending in `Invoice`; ours has 7.
   Update `catalogue/openapi/corrections/PENDING.md` item P2 to say eight
   confirmed names, not seven, since this drop is itself an NHA source
   naming the eighth.
4. **Populate the three MATCHED-TO-WEBHOOK payloads** (`m2_on_discovery_request`,
   `m2_on_link_init`, `m2_on_link_confirm`) with the request bodies given in
   section 3, transcribed from `user-initiated-linking.yaml` operations
   `abdm-user-initiated-linking 1`, `3`, `5`. Record this as a new
   `x-abdm-sources` entry with `role: upstream` on `hiecm-m2.yaml`, dated to
   this drop, since it is new information from NHA, not an invention.
5. **Correct `m2_generate_link_token`'s success response from `200` +
   `LinkTokenResponse` body to `202` Accepted**, and add the new webhook
   `m2_on_generate_token_result` (drop path `/v3/hip/token/on-generate-token`)
   carrying the token. `LinkTokenResponse`'s fields move to describe the
   callback payload. This changes the documented integration shape for link
   token generation; call it out prominently in the M2 module description
   and in any compiled skill or atom built from `m2_generate_link_token`,
   since an integrator currently reading it as synchronous needs to know it
   changed.

### MEDIUM confidence

6. **Add `403` and `500` (and, per operation, `404`) response entries**
   across the 10 path operations; the drop declares them uniformly and ours
   carries only `400`/`401`.
7. **Add three new webhook entries** for the HIP-initiated-linking result
   callbacks: `m2_on_carecontext_result` (drop path `/v3/link/on_carecontext`,
   oneOf 4 variants, success carries `abhaAddress`/`status` enum/`response.requestId`),
   `m2_on_context_notify_result` (drop path `/v3/links/context/on-notify`,
   `acknowledgement.status` enum `[SUCCESS, ERRORED]` plus optional `error`
   and required `response.requestId`), and `m2_on_sms_notify_result` (drop
   path `/v3/patients/sms/on-notify`, same acknowledgement/error/response
   shape as the previous one). All three are genuinely new inbound-to-HIP
   surface that the 2026-08-25 ingest note did not anticipate (it named only
   discovery, link init, link confirm and consent notify as missing
   callbacks); see section 5.
8. **`LinkCareContextNotifyRequest.notification.hip`**: add `name` and
   `type` as documented fields (drop requires them; ours only defines and
   requires `id`).
9. **Patient-share, `hiecm-m1.yaml`**: widen `PatientShareRequest.intent`
   enum to `[PROFILE_SHARE, RECORD_SHARE, PAYMENT_SHARE]`; add
   `metaData.latitude`/`metaData.longitude` (required, `number`/`format:
   float`); add `OnShareRequest.acknowledgement.profile.expiry` (required,
   `number`); correct `OnShareRequest`'s success response from `200` to
   `202`; add `X-HIP-ID` (on `/patient-share/v3/share`) and `X-CM-ID` (on
   `/patient-share/v3/on-share`) headers; add `400`/`401`/`403`/`408`/`500`/
   `503` response entries to `/patient-share/v3/share`, which today has only
   `200`.
10. **`hiecm-p2.yaml`, `p2_onpatientshare`**: add the missing success
    response (`202`), and `X-CM-ID` header.
11. **`hiecm-p2.yaml`, `p2_profile_share`**: needs a scope decision before
    editing, not a direct patch. Either (a) treat `abdm-patient-share-hip 1`
    as filling in this stub's missing requestBody, headers and responses
    wholesale (recording the path mismatch, `/scan-share/profile/share` vs
    `/api/hiecm/patient-share/v3/share`, as an open question for NHA), or
    (b) treat it as a separate operation and add it as new rather than
    editing `p2_profile_share` in place. Either way the current stub, no
    body, no headers, no success response, cannot stand as-is once this
    drop is folded in.
12. **New ops to stub**: `GET /api/hiecm/hip/v3/link/patient/links` (PHR app
    listing), `POST /api/v3/hiu/patient/on-share` (HIU-side on-share
    callback), `GET /api/hiecm/patient-share/v3/profile/getTokenDetails`.
    None have a natural home in `hiecm-m2.yaml`; the first and third are
    PHR/HIU-facing reads, and belong wherever the six `-phr` user-initiated-
    linking ops land (see section 1). Flagging placement, not proposing a
    file.

### LOW confidence

13. Consider recording the `400`/`401`/`403`/`500` codes the drop lists for
    `m2_on_discovery_request`/`m2_on_link_init`/`m2_on_link_confirm` as
    documentation of what a bridge implementation might legitimately return,
    while keeping `202` as the primary documented contract. Low confidence
    because these are the HIP's own possible responses, not something the
    Gateway spec can bind, and NHA's spec presentation for these particular
    codes carries boilerplate ("It is just one example, for every api the
    path will be changed") suggesting they may be copy-paste filler rather
    than deliberate per-operation guidance.
14. `X-Link-Token` (ours) vs `X-LINK-TOKEN` (drop) casing: cosmetic, HTTP
    headers are case-insensitive, no action needed beyond noting it if a
    style pass ever touches header naming.
15. `abdm-user-initiated-linking 4`'s `communicationExpiry` uses `format:
    iso-date-time` where the OpenAPI standard format is `date-time`; ours
    already uses the correct value, no change needed on our side, but worth
    a line in any future report back to NHA alongside the other spec-quality
    notes.

## 5. Contradictions with catalogue/openapi/corrections/*.md

**`2026-08-25-m1-m2-m3-ingest.md`** states: "the one structural gap is
large: none of the three files describes a single callback... For M2 and M3
that is half the integration," and, further down, "Still missing after this
ingest: M2's inbound callbacks. The gateway to HIP discovery, link init,
link confirm and consent notify payloads are in neither the specification
nor the collection. They are declared as webhooks with a path and no body."

This drop resolves three of those four named gaps. `user-initiated-linking.yaml`
gives full payloads for the discovery, link-init and link-confirm legs
(section 3, B1 to B3). The fourth named gap, consent notify, is not touched:
it lives in `consent-management-data-flow.yaml`, outside this report's four
files. So the correction record's claim should change from "M2's inbound
callbacks... are declared with a path and no body" to "three of four are now
described; consent notify is still path-and-no-body," once B1 to B3 are
folded in.

The drop also **widens the gap the ingest note described**, rather than
only closing it: `hip-initiated-linking.yaml` and `link-token.yaml` show
three more inbound-to-HIP callbacks the ingest note never named at all
(the HIP-initiated-linking result callback, the context-notify result
callback, the SMS-notify result callback) plus the link-token generation
result. None of these were "M2's inbound callbacks" as the note enumerated
them; all four are additional asynchronous legs the note's own audit missed
because NHA's first three files (the M1/M2/M3 OpenAPI specs) never modelled
the HIP-initiated-linking or link-token flows as asynchronous at all. Update
the ingest note's callback count once these are folded in.

**`2026-08-27-report-to-nha.md`**, item 1, asks NHA for "callback
definitions for the inbound half of M2 and M3, or review of our
reconstruction under `webhooks` and confirmation that it is right." This
drop is effectively part of that answer for M2 (not a review of our
reconstruction, since the drop's authors were not working from our file, but
independently-arrived payloads that we can now diff against what we
guessed, which was nothing, since we declared these three path-only).
Recommend closing item 1 as partially answered once section 4's corrections
land, and re-opening a narrower ask limited to M3 consent notify and to the
retry behaviour question, which this drop still does not answer for any
callback (section 3).

**`2026-08-27-report-to-nha.md`**, item 4, and `hiecm.error.abdm-1016`
documented the trailing `": "` after an error code from a live sandbox
response. The drop's own error schema pattern,
`^(ABDM-\d{4}|\d{3,6})(: )?$`, models exactly this. This does not
contradict our finding, it corroborates it independently, from NHA's side,
after we reported it from ours. Worth noting in that atom or the report file
as confirmed by a later NHA source, not just by our own sandbox call.

**`PENDING.md`, P2** ("HI type, the value set is not pinned anywhere...
The seven NHA names") is contradicted by this drop's own enum, which
carries eight names, `Invoice` included, consistently across five separate
operations. P2 should be updated to record eight names and to cite this drop
as a source, though it remains true that no *enum* pins the value set in our
files yet, only in the drop's per-operation `hiTypes`/`hiType` schemas.
Recommendation 3 in section 4 turns that into a fix.

**`PENDING.md`, P1** (UUID format assertions, removed under C3, "blocked
on one real response from the sandbox... do not guess from the examples")
is not resolved by this drop and this report does not treat it as resolved.
The drop asserts `format: uuid` on `transactionId` at several sites with
UUID-shaped examples (section 2, item A4), which is NHA's own file agreeing
with the format, but P1's own rule says not to infer the real wire shape
from examples, and P1 was scoped to `consentId`/`consentRequestId`/`id`, a
different field. Recorded as new evidence, explicitly not as a resolution.

**`2026-08-26-timestamp-utc.md`** claims `TIMESTAMP` is UTC with
milliseconds and a `Z` suffix, based on one sandbox observation against
`abhasbx.abdm.gov.in`. Every `TIMESTAMP` example across all four drop files
uses exactly this shape (`2022-10-06T15:10:00.587Z`, repeated verbatim on
essentially every operation). This corroborates the correction; it does not
contradict it, and it extends the evidence from "one sandbox call, M1 only"
to "every M2-linking operation NHA itself documents," though still not
production, which remains the open item in P8.
