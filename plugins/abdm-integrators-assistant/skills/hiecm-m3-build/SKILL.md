---
name: hiecm-m3-build
description: "Use when scaffolding an integration against ABDM Milestone 3 (consent requests, artefacts, fetching records as an HIU): builds each M3 flow as an observe-orient-decide-act loop against the sandbox, citing the Catalogue atom behind every call."
---
# HIE-CM M3 build

Scaffolds an ABDM M3 integration one flow at a time. M3 covers raising a consent request, tracking it, and fetching the records it covers as an HIU.

## How this skill runs

Every flow below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the flow step matched below, decide the cheapest next action, act, and return to observe. A flow step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per flow step. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Flows

### Fetch the records a granted consent artefact covers (`hiecm.flow.m3-fetch-records`)

**Before you start**

Four things must already be true, each checkable:

- A granted consent request, with at least one consent artefact id. See
  request consent.
- You hold a gateway session token. See
  the gateway session.
- You have generated an ECDH key pair
  and a 32 byte nonce for this exchange, on Curve25519. NHA's M2 document
  specifies the scheme; the data flow page at
  /docs/hiecm/v3/concepts/data-flow sets out who generates what and
  points at NHA's reference implementation, Fidelius, rather than hand
  rolling it.
- You expose a `dataPushUrl` endpoint that can receive encrypted
  FHIR bundles: the URL you name in the
  health information request. NHA's M3 file only says to expose one; it
  does not say whether that URL must differ from your other registered
  callback URLs. The data flow concept page notes it may differ from
  your registered gateway URL, not that it must.

**Act: the calls in this flow, in order**

#### Fetch the full consent artefact (`hiecm.endpoint.m3-consent-fetch`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/fetch' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "consentId": "d6a83f24-6c96-421e-b8b8-844e5344ef69" }'
```

#### Request a patient's health information (`hiecm.endpoint.m3-hiu-health-information-request`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/request' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

#### Notify the gateway that data was received (`hiecm.endpoint.m3-hiu-data-flow-notify`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

**Exit condition (Observe until this is true)**

```observation schema=exit-condition
channel: self
path: your own call to /hiecm/data-flow/v3/health-information/notify
match:
  notification.statusNotification.sessionStatus: TRANSFERRED
timeout_seconds: unknown
note: >
  NHA's M3 file documents no payload shape for what arrives at your
  dataPushUrl, so no field name from that push is confirmed here. What
  is confirmed, from hiecm-m3.yaml, is the field you send once every
  care context in the artefact has decrypted: notification.statusNotification.sessionStatus
  set to TRANSFERRED on the data flow notify call. Treat that outbound
  call, not an inbound field name, as the exit signal until the push
  payload itself has been observed.
```

Not yet observed against the sandbox. This repository has not run a
fetch through to a decrypted bundle. When it has, record the real
payload shape here and set `verified.status`.

**If it goes wrong**

- The chain stops partway between fetch, request and push. See
  accepted, then nothing,
  which covers finding which callback in a multi step chain is missing.
- The consent was valid when you sent the request but is not granted by
  the time the HIP checks it. NHA's own error table names this state,
  not a specific cause; a mid flow revocation is one way it happens. See
  ABDM-1062. Treat every fetch as a fresh
  permission check, not a cached yes.
- The artefact id is unknown, expired or already used past its window.
  See ABDM-1112.
- The push never arrives at your `dataPushUrl`. See
  the callback never arrives.
  Check the `dataPushUrl` you sent on the health information request
  specifically, since it may not be the same endpoint your other
  registered callbacks land on.
- The clock is wrong and every call fails. See
  ABDM-2402.
- The `REQUEST-ID` is missing, malformed or reused. See
  ABDM-2404.
- No session token was sent. See ABDM-2500.
- ABDM fails and does not say why. See ABDM-9999.

Next: a decrypted bundle today is not a standing right to fetch again
tomorrow. Read
consent, what it authorises and how it ends
for when the artefact you just used stops being usable, so you know
when a repeat fetch needs a fresh consent request instead.

### Request consent for a patient's health records (`hiecm.flow.m3-request-consent`)

**Before you start**

Five things must already be true, each checkable:

- You hold a gateway session token. See
  the gateway session.
- Your application is registered in the HIU role, with a
  bridge URL the
  HIE-CM can route the patient's
  decision to.
- Your callback URL is registered with ABDM and reachable from the
  public internet. See
  the callback URL.
- You know the patient's ABHA address.
  That is M1's job. Without it there is no
  one to ask.
- You have a purpose of use
  code for the request. NHA's M3 file lists six; an insurer checking a
  claim uses `HPAYMT`.

**Act: the calls in this flow, in order**

#### Initiate a consent request (`hiecm.endpoint.m3-consent-request-init`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/init' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "consent": { "hip": { "id": "HIP\_ID" }, "hiu": { "id": "HIU\_ID" }, "hiTypes": [ "Prescription", "DiagnosticReport", "DischargeSummary", "ImmunizationRecord", "HealthDocumentRecord", "WellnessRecord", "OPConsultation" , "Invoice" , ], "patient": { "id": "abhaaddress@sbx" }, "purpose": { "code": "CAREMGT", "text": "Care Management", "refUri": "www.abdm.gov.in" }, "requester": { "name": "Dr. Manju", "identifier": { "type": "REGNO", "value": "MH1001", "system": "https://www.mciindia.org" } }, "permission": { "dateRange": { "to": "2024-07-17T12:05:57.151Z", "from": "1924-07-09T12:05:57.151Z" }, "frequency": { "unit": "DAY", "value": 0, "repeats": 0 }, "accessMode": "VIEW", "dataEraseAt": "2124-11-09T00:00:00.000Z" }, "careContexts": [ { "patientReference": "xxxx@sbx", "careContextReference": "COCa496bc2f-ca6c-4af5-b973-02e915fd9815" } ] } }'
```

#### Acknowledge a consent notification (`hiecm.endpoint.m3-consent-hiu-on-notify`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hiu/on-notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "acknowledgement": [ { "status": "OK", "consentId": "e3c74829-3f82-4f94-959e-e10f57bcd57b" } ], "error": { "code": "ABDM-1001", "message": "unable to connect database" }, "response": { "requestId": "6f0b4665-a915-4c92-aa36-65afb4a2cd71" } }'
```

#### Check the status of a consent request (`hiecm.endpoint.m3-consent-request-status`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/status' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "consentRequestId": "05f14b1d-4465-453a-8249-1382d79d271d" }'
```

**Exit condition (Observe until this is true)**

```observation schema=exit-condition
channel: callback
path: /api/v3/hiu/consent/request/notify
match:
  notification.status: GRANTED
timeout_seconds: unknown
note: >
  the payload also carries at least one id in notification.consentArtefacts.
  Both fields are named in hiecm-m3.yaml's request body schema for this
  callback. NHA's M3 file does not state how long the patient has to
  act; that window is the one you set on the init call, not a gateway
  timeout.
```

Not yet observed against the sandbox. This repository has not run a
consent request through to a grant. When it has, record the real
callback body here and set `verified.status`.

**If it goes wrong**

- The request sits in `REQUESTED` with no decision. See
  consent stuck in Requested,
  which covers the request window against the validity period, the two
  separate clocks: running out of the request window moves the state to
  `EXPIRED`, not a change in what a grant would later allow.
- The on-init or on-notify callback never lands. See
  the callback never arrives.
- The clock is wrong and every call fails. See
  ABDM-2402.
- The `REQUEST-ID` is missing, malformed or reused. See
  ABDM-2404.
- No session token was sent. See ABDM-2500.
- ABDM fails and does not say why. See ABDM-9999.

Next: once a grant arrives with artefact ids, go to
fetch the records.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/m3
- The flows as diagrams: /docs/hiecm/v3/milestones/m3
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

