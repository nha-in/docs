---
name: hiecm-p2-build
description: "Use when scaffolding the patient side of ABDM Milestone 2 in a PHR application (discovery, user initiated linking, scan and share at a facility): builds each P2 flow as an observe-orient-decide-act loop, citing the Catalogue atom behind every step."
---
# HIE-CM P2 build

Scaffolds an ABDM P2 integration one flow at a time. P2 covers discovering records held elsewhere, linking care contexts to a health address, and sharing a profile at a facility.

## How this skill runs

Every flow below is an OODA loop, not a recipe: observe the actual state (last response, last error), orient against the flow step matched below, decide the cheapest next action, act, and return to observe. A flow step is done only when its exit condition is observed against the sandbox, never because it "should have worked."

Loop limit: 8 passes per flow step. Hitting the limit is an escalation: state what was observed, what was tried, and which atom to read, then ask one question.

## Flows

### Find records held elsewhere and link them (`hiecm.flow.p2-discover-and-link`)

**Before you start**

Four things must already be true, each checkable:

- The person is signed in and holds an
  ABHA address (shared.glossary.abha-address). See
  sign a user in.
- You hold a verified mobile number for them. Discovery carries it.
- You can show only participating facilities in the search. A facility
  qualifies when it is a HIP (shared.glossary.hip) linked to an
  HRP (shared.glossary.hrp).
- You can hold a request open across a callback. Discovery is answered
  asynchronously. See
  asynchronous callbacks (hiecm.concept.asynchronous-callbacks).

**Act: the calls in this flow, in order**

#### Ask a facility what records it holds (`hiecm.endpoint.p2-care-context-discover`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/patient/care-context/discover' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "hipId": "ABDM\_HIP", "unverifiedIdentifiers": [ { "type": "ABHA\_ADDRESS", "value": "shaik.XXXX@sbx" } ] }'
```

#### Start linking the care contexts the person chose (`hiecm.endpoint.p2-link-care-context-init`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/init' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "transactionId": "66446ece-396b-4f22-a1a6-756196fdffc9", "abhaAddress": "user\_123@sbx", "patient": [ { "referenceNumber": "example01", "careContexts": [ { "referenceNumber": "123" } ], "hiType": "PRESCRIPTION", "count": 1 } ] }'
```

#### Confirm the link with the code the person received (`hiecm.endpoint.p2-link-care-context-confirm`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/confirm' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

#### HIE-CM all-providers (`hiecm.endpoint.p2-all-providers`)

```bash
curl -X GET 'https://dev.abdm.gov.inapi/hiecm/gateway/v3/providers?stateCode=-1&districtCode=-1&name=test' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

#### HIE-CM provider-by-provider-id (`hiecm.endpoint.p2-provider-by-provider-id`)

```bash
curl -X GET 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/providers/{{hip-id}}' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

#### HIE-CM Govt Programs (`hiecm.endpoint.p2-govt-programs`)

```bash
curl -X GET 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/govt-programs' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

**Exit condition (Observe until this is true)**

The care contexts the person selected are linked to their ABHA address,
and running discovery against that facility again returns them as already
linked rather than as new. The records themselves should arrive within
two hours.

A linked care context is not a record in hand. Fetching what a link
points at is a consent flow. See
fetch the records.

**If it goes wrong**

The failures these sources document, in rough order of frequency:

- The facility does not answer inside the expected 10 seconds, which is
  the unreachable case and has its own specified wording.
- Nothing comes back, because the person gave a different name or date of
  birth at the facility than they hold in their profile.
- Everything comes back already linked, which is the third specified
  message and not an error.
- The OTP goes to the mobile number the facility registered, which the
  person may no longer use.

### Share a profile at a facility by scanning its code (`hiecm.flow.p2-scan-and-share`)

**Before you start**

Three things must already be true, each checkable:

- The person is signed in and holds an
  ABHA address (shared.glossary.abha-address). See
  sign a user in.
- Your application can read a code and take the two parameters out of the
  URL it holds: the HIP id and a facility defined context such as a
  counter code.
- You can hold a screen open for up to 30 seconds while the facility
  answers, and say what is happening while it does.

**Act: the calls in this flow, in order**

#### Share the profile with the facility whose code was scanned (`hiecm.endpoint.p2-patient-share`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/patient-share/v3/share' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

#### Profile on share (`hiecm.endpoint.p2-profile-on-share`)

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/patient-share/v3/on-share' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

**Exit condition (Observe until this is true)**

The facility answers inside the 30 second window, and where it returns a
token number your application shows it. The person is registered at that
facility without giving their details at the desk, and records from that
visit arrive already linked rather than needing discovery.

**If it goes wrong**

The failures these sources document, in rough order of frequency:

- No answer inside 30 seconds, which needs a screen that says so rather
  than a spinner that never ends.
- A counter name that is really the facility id or the HIP name, which
  the rules exclude and which makes the counter unidentifiable to the
  person.
- Consent taken in your own wording rather than the specified wording,
  which is a certification problem rather than a technical one.

## Where the detail is

- Every operation in this milestone, with its body fields and responses: /docs/hiecm/v3/api/p2
- The flows as diagrams: /docs/hiecm/v3/milestones/p2
- Every error code across milestones: /docs/hiecm/v3/reference/error-codes
- Terms: /docs/hiecm/v3/getting-started/glossary

