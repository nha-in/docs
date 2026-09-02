# M3 Consent and Data Flow, diff against the 2026-09-01 NHA drop

Compares `catalogue/openapi/.raw/nha-2026-09-01/fixed/hiecm/consent-management-data-flow.yaml`
(28 ops) against `catalogue/openapi/hiecm/v3/hiecm-m3.yaml` (6 paths, 6
webhooks, 12 total). Nothing was edited. This file is the only output.

Note on paths: the task described the source as
`.raw/nha-2026-09-01/swagger/fixed/hiecm/consent-management-data-flow.yaml`.
The actual path in this checkout is `.raw/nha-2026-09-01/fixed/hiecm/...`
(no `swagger/` segment). File name and operation count match exactly (28),
so this is a path typo in the task, not a different drop. The sibling report
`catalogue/openapi/nha-drops/2026-09-01-diffs/m2-linking.md` hit the same
typo and reached the same conclusion.

## Counts

| Class | Count |
|---|---|
| MATCHED-TO-PATH | 6 |
| MATCHED-TO-WEBHOOK | 6 |
| NEW-IN-DROP | 13 |
| BELONGS-TO-M2 | 3 |
| OURS-ONLY | 0 |
| Drop total | 28 |
| Ours total (hiecm-m3.yaml) | 12 |

Every one of our 12 M3 operations has a counterpart in the drop. Nothing in
`hiecm-m3.yaml` is orphaned.

## 1. Operation inventory

The drop tags every operation `consent-management-data-flow-hiu`,
`consent-management-data-flow-hip`, or `consent-management-data-flow-phr`.
That tag is a reliable guide to which of our modules an operation belongs
in: `hiecm-m3.yaml` is explicitly the HIU side ("M3 is the requester side",
per its `info.description`), `hiecm-m2.yaml` is explicitly the HIP side.
The `-phr` operations belong to neither.

| Drop operationId | Method + path | Tag | Class | Ours |
|---|---|---|---|---|
| `abdm-consent-management 1` | POST /api/hiecm/consent/v3/request/init | hiu | MATCHED-TO-PATH | `m3_consent_request_init` |
| `consent-management 2` | POST /api/v3/hiu/consent/request/on-init | hiu | MATCHED-TO-WEBHOOK | `m3_on_consent_request_init` |
| `abdm-consent-management 3 (2)` | POST /api/hiecm/consent/v3/request/status | hiu | MATCHED-TO-PATH | `m3_consent_request_status` |
| `consent-management 4` | POST /api/v3/hiu/consent/request/on-status | hiu | MATCHED-TO-WEBHOOK | `m3_on_consent_request_status` |
| `consent-management 6` | POST /api/v3/hiu/consent/request/notify | hiu | MATCHED-TO-WEBHOOK | `m3_on_consent_request_notify_hiu` |
| `abdm-consent-management 3 (3)` | POST /api/hiecm/consent/v3/request/hiu/on-notify | hiu | MATCHED-TO-PATH | `m3_consent_hiu_on_notify` |
| `abdm-consent-management 5 (2)` | POST /api/hiecm/consent/v3/fetch | hiu | MATCHED-TO-PATH | `m3_consent_fetch` |
| `consent-management 6 (2)` | POST /api/v3/hiu/consent/on-fetch | hiu | MATCHED-TO-WEBHOOK | `m3_on_consent_fetch` |
| `abdm-data-flow 7` | POST /api/hiecm/data-flow/v3/health-information/request | hiu | MATCHED-TO-PATH | `m3_hiu_health_information_request` |
| `data-flow 8` | POST /api/v3/hiu/health-information/on-request | hiu | MATCHED-TO-WEBHOOK | `m3_on_health_information_request` |
| `abdm-data-flow 8` | POST /api/hiecm/data-flow/v3/health-information/notify | hiu + hip | MATCHED-TO-PATH | `m3_hiu_data_flow_notify` (also matches `m2_hip_data_flow_notify`, same literal path, see note) |
| `consent-management 1` | POST /api/v3/consent/request/hip/notify | hip | MATCHED-TO-WEBHOOK | `m3_on_consent_request_notify_hip` |
| `abdm-data-flow 9` | GET /api/hiecm/data-flow/v3/health-information/request/status/{transaction-id} | hiu | NEW-IN-DROP | none |
| `abdm-consent-management 2` | POST /api/hiecm/consent/v3/request/hip/on-notify | hip | BELONGS-TO-M2 | `m2_consent_hip_on_notify` |
| `abdm-consent-management 3` | POST /api/v3/hip/health-information/request | hip | BELONGS-TO-M2 | `m2_on_health_information_request` (webhook, different literal path, see note) |
| `abdm-consent-management 5` | POST /api/hiecm/data-flow/v3/health-information/hip/on-request | hip | BELONGS-TO-M2 | `m2_hip_health_information_on_request` |
| `abdm-consent-management 6` | POST /health-information/transfer | hip | NEW-IN-DROP, see M2/M3 boundary note | none by this path; conceptually the empty-body `m2_on_data_notification` webhook at a different path |
| `abdm-consent-management 1 (2)` | POST /api/hiecm/consent/v3/request/{request-id}/approve | phr | NEW-IN-DROP | none |
| `abdm-consent-management 2 (2)` | POST /api/hiecm/consent/v3/request/{request-id}/deny | phr | NEW-IN-DROP | none |
| `abdm-consent-management 3 (4)` | POST /api/hiecm/consent/v3/revoke | phr | NEW-IN-DROP | none |
| `abdm-consent-management 4` | GET /api/hiecm/consent/v3/request/{request-id} | phr | NEW-IN-DROP | none |
| `abdm-consent-management 5 (3)` | GET /api/hiecm/consent/v3/request | phr | NEW-IN-DROP | none |
| `abdm-consent-management 7` | GET /api/hiecm/consent/v3/artefact/request/{request-id} | phr | NEW-IN-DROP | none |
| `abdm-consent-management 6 (2)` | GET /api/hiecm/consent/v3/artefact/{artefact-id} | phr | NEW-IN-DROP | none |
| `abdm-consent-management 8` | GET /api/hiecm/consent/v3/artefact | phr | NEW-IN-DROP | none |
| `abdm-consent-management 12` | POST /api/hiecm/consent/v3/auto/approve | phr | NEW-IN-DROP | none |
| `abdm-consent-management 13` | POST /api/hiecm/consent/v3/auto/approve/{auto-approval-id}/disable | phr | NEW-IN-DROP | none |
| `abdm-consent-management 14` | POST /api/hiecm/consent/v3/auto/approve/{auto-approval-id}/enable | phr | NEW-IN-DROP | none |

Checked `hiecm-m2.yaml` before calling any data-flow op new, per instruction.
The three BELONGS-TO-M2 rows above exist there already (or, for the health
information request, at a different literal path, see the M2/M3 boundary
note under section 3). None of the 11 `-phr` operations exist anywhere in
the catalogue; `hiecm-phr-services.yaml`'s 61 paths were also checked and
none mention consent, approve, or artefact.

## 2. Material differences, matched items

A structural fact that applies to all 6 of our path operations and is not
repeated per item below: **none of `hiecm-m3.yaml`'s 6 path operations
declare a `parameters` list.** `components/parameters` defines `RequestId`,
`Timestamp` and `CmId`, but nothing in `paths` references them with `$ref`,
so none of REQUEST-ID, TIMESTAMP or X-CM-ID is documented as attached to any
operation. Every matching drop operation, without exception, requires
REQUEST-ID and TIMESTAMP, and every drop operation also requires a role
header the drop calls X-CM-ID, X-HIU-ID, or both, depending on direction.
`hiecm-m3.yaml`'s `components/parameters` has no `X-HIU-ID` entry at all.
This is the same gap the sibling M2 report found in `hiecm-m2.yaml`
independently; it is repo-wide, not M3-specific, but it is fully in scope
to fix here.

A second structural fact, also not repeated per item: **all 6 of our
outbound path operations return `'202'` with no schema in the drop.** Ours
currently documents inline synchronous response bodies on three of the six
(`m3_consent_request_init`, `m3_consent_request_status`, `m3_consent_fetch`).
See item A1, A2, A5 below for the specifics; the pattern is the same across
all three so it is described once here and referenced, not repeated three
times in full.

### A1. `m3_consent_request_init` vs `abdm-consent-management 1`

Path: ours `/hiecm/consent/v3/request/init` relative to server
`https://dev.abdm.gov.in/api`; drop `/api/hiecm/consent/v3/request/init`
absolute. Same endpoint, base URL folded differently, no material
difference there.

- **Response body.** Ours, `202`:
  ```yaml
  consentRequestId:
    type: string
    description: ID to track the consent request status
    x-abdm-correction: C3
  ```
  Drop, `202`: `description: Accepted`, no `content`, no schema at all. The
  drop's own schema does not show `consentRequestId` coming back
  synchronously; per the webhook side (A-webhook 1 below), the request id
  arrives asynchronously on `consentRequest.id` in the on-init callback.
  This does not mean our body is invented (NHA's collection is described as
  the source, per the file's own sources note), but the drop gives no
  independent confirmation of it either. Flagged for sandbox verification,
  not for removal.
- **`purpose.code` enum.** Ours:
  `CAREMGT, BTG, PUBHLTH, HPAYMT, DSRCH, PATRQST`. Drop, in this operation
  and repeated identically in `consent-management 1` (hip/notify) and
  `consent-management 6` (hiu/notify): `CAREMGT, BTG, PUBHLTH, HPAYMT,
  DSRCH, PATRQT`. Ours has `PATRQST` (7 letters); the drop has `PATRQT` (6
  letters), consistently, in every one of the three places the enum
  appears. This is not a one-off typo on either side; whichever value is
  wrong is wrong everywhere it is used. High-value discrepancy: a wrong
  purpose code rejects the whole consent request. See section 4, flagged
  MEDIUM rather than HIGH because either source could be the typo.
- **`purpose.text`.** Ours: free string, example `Care Management`, not
  constrained. Drop: `enum: [Care Management, Break the Glass, Public
  Health, Healthcare Payment, Disease Specific Healthcare Research, Self
  Requested]`, required. Ours also does not mark `purpose.refUri` required;
  drop does.
- **`hip` / `hiu` objects.** Ours requires only `id` on both. Drop requires
  `id` and `name` on both, and additionally defines (not required) a `type`
  field on both that ours does not have at all.
- **`requester.identifier`.** Ours: `type`, `value`, `system` properties,
  none required (only `requester.name` and `requester.identifier` are
  required at the parent level). Drop: all three of `value`, `type`,
  `system` required. Separately, the drop's own field descriptions are
  swapped: the `value` field's description reads "The type of the
  identification" and the `type` field's description reads "The
  identification value." Noted as an NHA authoring defect, not something to
  copy.
- **`hiTypes` enum.** Ours (shared `HIType` schema): `Prescription,
  DiagnosticReport, OPConsultation, DischargeSummary, ImmunizationRecord,
  HealthDocumentRecord, WellnessRecord`, 7 values. Drop: the same 7 plus
  `Invoice`, 8 values, and this 8-value set repeats identically in every
  drop operation that carries `hiTypes` (`abdm-consent-management 1`,
  `consent-management 1`, the on-fetch webhook). This matches what is
  already in our own `x-abdm-errors` table, `ABDM-1006`'s message text,
  which has always listed the same 8 names including `Invoice`. The
  `HIType` schema is out of step with our own error table, not just with
  the drop. See section 5, PENDING.md P2.
- **`permission.frequency.value` / `.repeats`.** Ours: `type: integer`.
  Drop: `type: number, format: int32`. Cosmetic; both round-trip the same
  values. Not worth a correction on its own.

### A-webhook 1. `m3_on_consent_request_init` vs `consent-management 2`

- **Response code we must send back.** Ours: `'202'`, "Your bridge accepted
  the callback." Drop: `'200'`, "OK." This is not one operation's quirk;
  see the sweeping note in section 4, all 6 of our webhooks say 202 and
  all 6 matching drop operations say 200.
- **Headers on the callback.** Ours: none declared for this webhook. Drop:
  REQUEST-ID, TIMESTAMP, X-HIU-ID (not X-CM-ID) required on the call NHA
  makes to us.
- **`consentRequest.id`.** Ours: `type: string`, required. Drop: `type:
  string, format: uuid`, example `f29f0e59-8388-4698-9fe6-05db67aeac46`, a
  well-formed UUID. See section 5 for the C3 discussion; this is one of
  several sites carrying a genuinely UUID-shaped example in this drop.

### A2. `m3_consent_request_status` vs `abdm-consent-management 3 (2)`

- **Response body.** Ours, `'200'`: full `ConsentStatusResponse`
  (`consentRequestId`, `status` enum, `consentArtefacts` array) inline.
  Drop, `'202'`: `description: Accepted`, no schema. Same pattern as A1;
  our HTTP status code (200) also does not match the drop's (202) for this
  operation. Flagged for sandbox verification; a status-check endpoint
  returning nothing synchronously is a real possibility given ABDM's async
  design, but it would mean the caller has to wait for a webhook just to
  learn the answer to "what is the status," which is worth confirming
  rather than assuming either way.
- **Headers.** Drop adds X-HIU-ID here (plus REQUEST-ID, TIMESTAMP,
  X-CM-ID); ours has none attached, per the section 2 structural note.
- **`consentRequestId` format.** Drop: `format: uuid`, example
  `5f7a535d-a3fd-416b-b069-c97d021fbacd`, well-formed.

### A-webhook 2. `m3_on_consent_request_status` vs `consent-management 4`

- **`status` enum.** Ours, `consentRequest.status`: `type: string`, no
  enum, unconstrained. Drop: `enum: [REQUESTED, DENIED, EXPIRED, REVOKED]`.
  Note `GRANTED` is absent from this particular enum; per the drop's own
  description and the separate `consent-management 6` operation below, a
  grant is communicated through the notify callback with
  `consentArtefacts`, not through this status callback. Recommend adding
  the 4-value enum to ours, MEDIUM confidence since it is not sandbox
  verified but the drop's own text is internally consistent about why
  GRANTED is missing here.
- **Response code.** Ours `202`, drop `200`, same sweeping note as
  A-webhook 1.
- **`consentRequest.id` format.** `format: uuid`, example
  `e5ec415f-c098-40f6-a0db-faa162fc5295`.

### A-webhook 3. `m3_on_consent_request_notify_hiu` vs `consent-management 6`

- **`reason` field.** Drop's `notification` object requires a `reason`
  field (`type: string, nullable: true, example: null`) that ours does not
  have at all.
- **Response code.** Ours `202`, drop `200`.
- **`consentRequestId` / `consentArtefacts[].id`.** `format: uuid` in the
  drop on both, with well-formed examples (`e3c74829-3f82-4f94-959e-
  e10f57bcd57b`, `6f0b4665-a915-4c92-aa36-65afb4a2cd71`).

### A-webhook 0 (HIP-tagged, but ours). `m3_on_consent_request_notify_hip` vs `consent-management 1`

The drop tags this operation `consent-management-data-flow-hip`, but it is
the HIP-notify webhook that already exists in `hiecm-m3.yaml` (the file's
own description explains why: "M3 is the only milestone where both halves
of the asynchronous exchange are documented", including the HIP-facing
notify leg). Checked against `hiecm-m2.yaml`: no operation there matches
this path or this operationId, so it stays MATCHED-TO-WEBHOOK against M3,
not BELONGS-TO-M2.

- **Ours has no requestBody schema at all** for this webhook, only a path
  and a `'202'` response description. This is the one webhook of the six
  that the M3 Postman collection apparently did not carry an example for
  (the file's own note says the collection is the source for every
  callback payload it has; this is the exception).
- **Drop supplies the full schema.** `notification` object: `status` enum
  `[GRANTED, EXPIRED, DENIED, REQUESTED, REVOKED]` (the accompanying prose
  narrows this to "Only GRANTED, REVOKED and EXPIRED... will be sent to
  HIP," so the enum is wider than the documented behavior, an NHA
  internal inconsistency, not something to copy verbatim), `consentId`
  (`format: uuid`, example `3fa85f64-5717-4562-b3fc-2c963f66afa6`, the
  well-known Swagger-tooling default placeholder UUID rather than a
  captured value, worth noting as weaker evidence than the other UUID
  examples in this drop), a full `consentDetail` object matching the shape
  already used in `ConsentFetchResponse`, `signature`, and a new boolean
  field `grantAcknowledgement` (required, example `false`) that does not
  exist anywhere in our M3 schemas today.
- **Response code.** Drop expects `'200'`, same as the other five.

### A3. `m3_consent_fetch` vs `abdm-consent-management 5 (2)`

- **Response body.** Same pattern as A1/A2: ours `'200'` with
  `ConsentFetchResponse` (already noted as empty of examples per
  correction C5); drop `'202'`, no schema. Flagged for sandbox
  verification, not for removal, same reasoning as A1.
- **`consentId` format.** Drop: `format: uuid`, example
  `18235d89-cb13-479d-ad71-7a57d5f669a8`.

### A-webhook 4. `m3_on_consent_fetch` vs `consent-management 6 (2)`

- **`consent.status` enum.** Ours: `type: string`, unconstrained (the
  schema comment notes correction C5 dropped NHA's original example
  because it contradicted NHA's own required-fields list). Drop:
  `enum: [GRANTED, DENIED, EXPIRED, REVOKED]`, matches what ours already
  lists as its own enum values inside `ConsentFetchResponse.consent.status`
  (`GRANTED, DENIED, REVOKED, EXPIRED`), same 4 values, different order.
  No material conflict.
- **Required fields on `consentDetail`.** Drop marks `consentId, purpose,
  createdAt, patient, hiu, requester, hiTypes, permission, dataEraseAt,
  frequency, lastUpdated, careContexts, schemaVersion, consentManager` all
  required (`hip` is the one field left optional, since a request can be
  HIP-agnostic). `ConsentFetchResponse` in ours marks nothing required at
  all. Same gap as the `ConsentInitRequest` looseness noted in A1, just on
  the response side.
- **`hiTypes` enum.** 8 values including `Invoice`, same as A1.
- **Response code.** Drop `'200'`, ours `'202'`.

### A4. `m3_hiu_health_information_request` vs `abdm-data-flow 7`

- **Headers.** Drop requires REQUEST-ID, TIMESTAMP, X-CM-ID, X-HIU-ID.
  Ours has none attached.
- **`hiRequest` required list.** Drop lists `consent, dateRange,
  dataPushUrl, keyMaterial, nonce` as required at the `hiRequest` level,
  but `nonce` is not a property of `hiRequest` anywhere in the schema, it
  only exists nested inside `keyMaterial.nonce`. This looks like an NHA
  spec defect (a required field that is never defined at the level it is
  required), not something to reproduce; ours correctly nests `nonce`
  under `keyMaterial` only and does not have this problem.
- **Response body.** `'202'`, no schema, same async pattern as A1/A2/A3;
  ours already matches this one, its `202` response documents
  `transactionId` inline the same way the other three document a body the
  drop does not show. Flagged with the same caveat as A1.

### A-webhook 5. `m3_on_health_information_request` vs `data-flow 8`

- **Response code.** Ours `202`, drop `200`.
- **Headers.** Drop: REQUEST-ID, TIMESTAMP, X-HIU-ID. Ours: none attached.
- Field shapes otherwise match (`hiRequest.transactionId`,
  `hiRequest.sessionStatus`, `response.requestId`).

### A5. `m3_hiu_data_flow_notify` vs `abdm-data-flow 8`

This drop operation is tagged both `consent-management-data-flow-hiu` and
`consent-management-data-flow-hip`, and its literal path,
`/api/hiecm/data-flow/v3/health-information/notify`, is the exact same
path (module prefix aside) that appears in `hiecm-m2.yaml` as
`m2_hip_data_flow_notify`. One NHA endpoint, two of our files, split by
`notifier.type`. That split is a legitimate structural decision (each file
documents the role it owns), not an error, but it means this single drop
operation should inform corrections in both files, not just this one.

- **`sessionStatus` value, this is the most consequential finding in this
  report.** The drop's description states explicitly: "HIP on the transfer
  of data would send sessionStatus - one of [TRANSFERRED, FAILED]... HIU on
  receipt of data would send sessionStatus - one of [RECEIVED, FAILED]."
  The schema's own example for `statusNotification.sessionStatus` is
  `RECEIVED`. Ours, `DataFlowNotifyRequest.notification.statusNotification.
  sessionStatus`, used by `m3_hiu_data_flow_notify` (the HIU side, M3):
  ```yaml
  sessionStatus:
    type: string
    enum:
    - TRANSFERRED
    - FAILED
  ```
  `TRANSFERRED` is the HIP's value per the drop, not the HIU's. Our M3
  file has the HIP-side (M2) value on the HIU-side (M3) schema. Both of our
  worked examples in `hiecm-m3.yaml` (`success`, `partial_failure`) use
  `sessionStatus: TRANSFERRED` for a `notifier.type: HIU` payload, so the
  error is consistent throughout the file, not a one-off typo. HIGH
  confidence, see section 4.
- **Headers.** Drop: REQUEST-ID, TIMESTAMP, X-CM-ID. Ours: none attached.
- **`notifier.type` enum.** Matches: `[HIU, HIP]` in the drop (shared
  endpoint), ours restricts to `[HIP, HIU]` with a comment explaining the
  M2/M3 split by value.
- **Response code.** `'202'`, matches ours; this is one of the outbound
  paths, not a webhook, so the 202-vs-200 note does not apply here.

## 3. NEW-IN-DROP ops, summaries

**`abdm-data-flow 9`, GET /api/hiecm/data-flow/v3/health-information/request/status/{transaction-id}.**
HIU-side (and per its description, HIP-side too) status lookup for a health
information request by `transaction-id` path parameter, returning
`{transactionId, status}` (example status `TRANSFERRED`). No equivalent
exists anywhere in `hiecm-m3.yaml`; the only way to learn a data-flow
session's outcome today is the `notify` push (A5). A genuinely new,
useful, pollable alternative to that push. Candidate for a new M3 path.

**M2/M3 boundary decision: `abdm-consent-management 6`, POST
/health-information/transfer.** The task instructions call this out by
name. This is the actual encrypted-data delivery call: the HIP Data Bridge
posts the FHIR bundle (paginated `entries`, each with `content`, `media`,
`checksum`, `careContextReference`, plus the `keyMaterial` used to encrypt
it) directly to the `dataPushUrl` the HIU supplied in its health
information request (A4). The drop's own description is explicit that this
"is directly called by HIP Data Bridge and is not mediated via CM, and
hence not routed through the Gateway," and "should be implemented at HIU
side."

Decision: **this belongs in M3, not M2**, despite the drop tagging it
`consent-management-data-flow-hip` (the tag reflects who calls it, not who
hosts it). Three reasons: it is hosted by the HIU, the actor M3 documents;
it bypasses the Gateway entirely, unlike every M2 webhook, which
`hiecm-m2.yaml`'s own description defines as "what the gateway posts to
your registered URL," and this is not that; and `hiecm-m3.yaml` already
narrates this exact exchange in `m3_hiu_health_information_request`'s
description ("The HIP encrypts data using the HIU's public key... and
pushes it to dataPushUrl. The HIU decrypts...") without ever giving it a
schema.

There is a same-concept placeholder already in `hiecm-m2.yaml`:
`m2_on_data_notification`, webhook path `/api-hiu/data/notification`,
description "The provider pushes encrypted health information to the URL
named in the request," but declared with no requestBody at all ("the rest
are declared with the path and no body, because NHA has not published one
and inventing a shape would be worse than the gap," per that file's own
`info.description`). That gap is now closed by this drop, in M3's
direction, not M2's. Recommend: add this as a new webhook in
`hiecm-m3.yaml` with the drop's full schema (section 4), and flag to
whoever owns `hiecm-m2.yaml` that `m2_on_data_notification` is very likely
the same endpoint at a different, possibly stale, literal path
(`/api-hiu/data/notification` vs the drop's `/health-information/transfer`)
and may need to move or be removed once M3's copy exists, rather than both
files carrying different partial descriptions of one endpoint.

**11 `-phr` operations, patient/PHR-application side, none exist anywhere
in the catalogue today:**

- `POST .../request/{request-id}/approve`, `POST .../request/{request-id}/deny`,
  `POST .../revoke`: the patient's own approve, deny and revoke actions,
  called from a PHR or mobile app, not from an HIU or HIP integration.
- `GET .../request/{request-id}`, `GET .../request`: read a single consent
  request, or list all of a patient's consent requests.
- `GET .../artefact/request/{request-id}`, `GET .../artefact/{artefact-id}`,
  `GET .../artefact`: read consent artefacts by request id, by artefact id,
  or list all of a patient's artefacts.
- `POST .../auto/approve`, `POST .../auto/approve/{id}/disable`,
  `POST .../auto/approve/{id}/enable`: set up, disable and enable an
  auto-approval policy for a named HIU, so future consent requests from
  that HIU are granted without a manual patient action.

None of these fit `hiecm-m3.yaml`'s own scope (`x-abdm-roles: [hiu]`, "M3
is the requester side"). They are patient-facing, the same audience as
`hiecm-phr-services.yaml`, which was checked and does not contain them
under any path. They need a home before they can be stubbed; not proposing
one here, since PHR services is out of this report's scope, only flagging
that it is the natural candidate.

## 4. Recommended corrections

### HIGH confidence

1. **Attach headers to all 6 M3 path operations.** None reference
   `RequestId`/`Timestamp`/`CmId` today even though `components/parameters`
   defines them. Every drop operation requires REQUEST-ID and TIMESTAMP,
   plus X-CM-ID, X-HIU-ID, or both depending on the operation (see each A#
   item above for which). Add a new `HiuId` parameter (`X-HIU-ID`) to
   `components/parameters`, matching the existing `CmId` shape, then add
   `parameters: [$ref RequestId, $ref Timestamp, $ref CmId, $ref HiuId]`
   (subset as appropriate) to each of the 6 paths.
2. **Fix `DataFlowNotifyRequest.notification.statusNotification.
   sessionStatus`'s enum from `[TRANSFERRED, FAILED]` to
   `[RECEIVED, FAILED]`**, and update the `example` field and the
   `success`/`partial_failure` examples in `m3_hiu_data_flow_notify`
   accordingly. This is the HIU-side (M3) value; `TRANSFERRED` belongs to
   the HIP side (M2), per the drop's own description, quoted in full at A5.
   Also update the operation's description bullet list, which currently
   says "TRANSFERRED, All data received successfully" for the HIU case.
3. **Correct all 6 webhook response codes from `'202'` to `'200'`.** Every
   matching drop operation (on-init, on-status, notify-hiu, on-fetch,
   on-request-ack, hip-notify) expects `200 OK` back from the bridge that
   hosts the callback, not `202 Accepted`. This is consistent across all
   six without exception; the drop's own outbound paths, by contrast, do
   consistently return `202`, so ours has the two directions' status codes
   reversed.
4. **Populate `m3_on_consent_request_notify_hip`'s requestBody**, currently
   empty (no schema at all), using the drop's schema for `consent-
   management 1` at A-webhook 0: `status` (recommend the narrower enum from
   the prose, `[GRANTED, REVOKED, EXPIRED]`, not the drop's wider literal
   enum, and say why in the description), `consentId` (`format: uuid`),
   `consentDetail` (same shape as `ConsentFetchResponse.consent.
   consentDetail`), `signature`, and the new `grantAcknowledgement` boolean.
   Record this as a new `x-abdm-sources` entry, `role: upstream`, dated to
   this drop, since it is new information from NHA closing a gap the
   2026-08-25 ingest note named explicitly (section 5).
5. **Add a new webhook for `/health-information/transfer`** in
   `hiecm-m3.yaml`, using the drop's full schema (`pageNumber`, `pageCount`,
   `transactionId`, `entries[]` with `content`/`media`/`checksum`/
   `careContextReference`, `keyMaterial`), per the M2/M3 boundary decision
   in section 3. Flag `m2_on_data_notification` in `hiecm-m2.yaml` to its
   owner as likely superseded by this, since both describe the same push
   with different literal paths and only one now has a real schema.
6. **Fix `ErrorResponse.code` from `integer` to `string`.** The drop's
   error code pattern, `^(ABDM-\d{4}|\d{3,6})(: )?$`, and every example
   value in it (`'ABDM-1006'`, `'900901'`, `'404'`) are strings; so is
   every code in our own `x-abdm-errors` table (`ABDM-1000` and so on).
   `ErrorResponse.code: type: integer` cannot represent any of them. Same
   finding as the sibling M2 report, independently confirmed here.
7. **Add `Invoice` to the shared `HIType` enum**, bringing it from 7 values
   to 8. Confirmed identically across every `hiTypes` occurrence in this
   drop (A1, A-webhook 4) and already present, unnoticed, in our own
   `x-abdm-errors` table's `ABDM-1006` message text. See section 5,
   PENDING.md P2.

### MEDIUM confidence

8. **Restore `format: uuid`** on the fields correction C3 stripped it from
   (`consentId`, `consentRequestId`, `id`, and by extension `transactionId`,
   `requestId`), or at minimum narrow C3's scope. Every occurrence checked
   in this drop (A1, A2, A-webhook 1/2/3/4, A5) carries `format: uuid` with
   a well-formed UUID example. This reverses the basis C3 gave for removing
   the assertion, NHA's own examples not being UUID-shaped, since NHA's own
   fresh examples now are. Caveat: at least one example
   (`3fa85f64-5717-4562-b3fc-2c963f66afa6`, A-webhook 0) is the generic
   Swagger-tooling default placeholder rather than a captured real value,
   so this is evidence, not proof. PENDING.md P1 already prescribes the
   final settling step, one real sandbox response; recommend running that
   now that the balance of evidence has shifted.
9. **Add the `[REQUESTED, DENIED, EXPIRED, REVOKED]` enum** to
   `m3_on_consent_request_status`'s `consentRequest.status` field
   (A-webhook 2), and the `[GRANTED, DENIED, EXPIRED, REVOKED]` enum to
   `m3_on_consent_fetch`'s `consent.status` field, matching what ours
   already independently lists for `ConsentFetchResponse.consent.status`
   (A-webhook 4).
10. **Add `name` (required) and `type` (optional) to the `hip` and `hiu`
    objects** in `ConsentInitRequest` (A1); ours currently only defines and
    requires `id` on both.
11. **Add the new `reason` field** (`type: string, nullable: true`) to
    `ConsentHiuOnNotifyRequest`'s notification shape, wherever ours models
    `consent-management 6`'s payload (A-webhook 3).
12. **Stub `GET .../health-information/request/status/{transaction-id}`**
    as a new M3 path (section 3), a pollable alternative to the notify
    push that nothing in ours covers today.
13. **Add the production server URL**, `https://apis.abdm.gov.in`, to
    `hiecm-m3.yaml`'s `servers` list. The drop cleanly separates Sandbox
    (`https://dev.abdm.gov.in`) and Production; ours has the sandbox
    gateway plus `https://apihspsbx.abdm.gov.in`, labeled "HSP Registry
    (Sandbox)", which does not correspond to anything in this drop and is
    worth a separate sanity check on whether it belongs in the M3 file at
    all (it reads like an M4 server).
14. **Add `403`, `404`, `500`, `503` response entries** across the 6 path
    operations and the 6 webhooks; the drop declares them with near
    identical shapes throughout, and ours only carries `400`/`401` (plus
    `404` on `m3_consent_fetch` alone).

### LOW confidence

15. **`purpose.code`'s `PATRQST` vs the drop's `PATRQT`** (A1). Flagged,
    not recommended as a direct edit, because the discrepancy could be a
    typo on either side and this report has no independent way to tell
    which. Verify against a live sandbox consent request using each value
    before touching `ConsentInitRequest`'s enum.
16. **Mark `purpose.text` an enum** (6 values, listed at A1) and require
    `purpose.refUri`. Cosmetic tightening; low priority since it narrows
    what a caller may send without an observed failure mode motivating it.
17. **`permission.frequency.value`/`.repeats`**, `type: number, format:
    int32` in the drop vs `type: integer` in ours (A1). No behavioral
    difference; not worth a change on its own.
18. Drop's own `hiRequest` required-field list naming `nonce` at a level
    where it is never defined (A4) is worth a line in any future report
    back to NHA, alongside the `PATRQT`/`PATRQST` mismatch and the swapped
    `identifier.value`/`identifier.type` descriptions (A1), but none of the
    three should change anything in `hiecm-m3.yaml`.

## 5. Contradictions with catalogue/openapi/corrections/*.md

**`2026-08-25-m1-m2-m3-ingest.md`** states the M3 file already has both
halves of the exchange documented ("M3 is the only milestone where both
halves of the asynchronous exchange are documented"), and separately notes
correction C3 removed `format: uuid` "because the examples were not UUID
shaped." Two updates follow from this drop. First, "both halves documented"
is not quite true today: `m3_on_consent_request_notify_hip` is a webhook
with a path and no body (A-webhook 0), the one gap in an otherwise complete
picture; this drop closes it (correction 4). Second, the C3 basis is
weakened, not confirmed, by fresh examples that are now UUID-shaped almost
everywhere checked (correction 8, MEDIUM not HIGH, because of the one
placeholder-looking example noted there).

**`2026-08-26-timestamp-utc.md`** records that the sandbox and NHA's own
M1 spec agree TIMESTAMP is UTC with a `Z` suffix, and that
`hiecm-gateway.yaml`'s shared `Timestamp` parameter was corrected to say
so. It does not mention `hiecm-m3.yaml`. **`hiecm-m3.yaml` carries its own
local copy of the `Timestamp` parameter under `components/parameters`, and
that copy still says IST**, the +05:30 offset, word for word the claim the
correction record says was wrong:

```yaml
description: |
  The current time in ISO 8601, in IST, the +05:30 offset, from a
  synchronised clock. Working integrations send IST rather than the UTC
  that NHA's collection templates emit.
example: '2026-08-24T15:45:30.000+05:30'
```

Every TIMESTAMP example in this drop, across all 28 operations checked, is
UTC with a `Z` suffix (for example `2022-10-06T15:10:00.587Z`), agreeing
with the correction record and disagreeing with `hiecm-m3.yaml`'s own local
copy. Per CONVENTIONS.md, cross-file `$ref` is disallowed by design ("the
shared header parameters are repeated in each file"), so this local copy
cannot simply reference the gateway file's corrected version; it needs its
own edit, mirroring `hiecm-gateway.yaml`'s text. `hiecm-m2.yaml` carries the
identical stale IST text in its own local copy too, which is the sibling
M2 report's problem to record, not this one's, but it confirms the
correction was applied in one place (`hiecm-gateway.yaml`) and never
propagated to the two module files that duplicated it.

**`2026-08-27-report-to-nha.md`, item 3**, and **`PENDING.md`, P1**, ask
whether `consentId`/`consentRequestId`/`id`'s real values are UUIDs. This
drop does not settle it outright (see correction 8's caveat about the
placeholder-looking example), but it is materially different evidence than
what P1 was written against: NHA's own fresh spec now uses `format: uuid`
plus well-formed examples almost everywhere these fields appear, a
reversal from the non-UUID examples that justified C3 in the first place.
Recommend running the one real sandbox call PENDING.md already prescribes,
now that the prior's shifted.

**`2026-08-27-report-to-nha.md`, item 4**, and `hiecm.error.abdm-1016`
documented the trailing `": "` after an error code observed in one live
sandbox response. This drop's own error schema pattern for M3,
`^(ABDM-\d{4}|\d{3,6})(: )?$`, models exactly that trailing separator as
optional and expected, agreeing with, not contradicting, what was
independently observed from the sandbox side. Same corroboration the
sibling M2 report recorded for its own file; recording it again here since
it applies to M3's error responses too.

**`PENDING.md`, P2** ("the value set is not pinned anywhere... The seven
NHA names") is contradicted by this drop's `hiTypes` enum, which carries
eight names, `Invoice` included, identically in every M3 operation that
uses it. This drop is a second independent NHA source (after our own
`ABDM-1006` error message text, which nobody had cross-checked against P2
before now) agreeing on eight. P2 should record eight names, not seven,
and cite this drop alongside the M2 drop files as sources. It remains true
that no *enum* pinned the value set in our files before this: `HIType` in
`hiecm-m3.yaml` had 7, unenforced against the 8 already sitting in the
error table.
