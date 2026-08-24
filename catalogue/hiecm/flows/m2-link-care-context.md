---
id: hiecm.flow.m2-link-care-context
type: flow
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link a care context to a patient's ABHA
summary: >
  Tell ABDM that this patient had a visit at your facility so their
  records can be found and fetched later.
sources:
  - file: site/docs/api/hie-cm/index.md
    fetched: 2026-08-24
    hash: sha256:a070aca723ef1184dd2e88514af0778baec3c1f24f0abab161c89cd447efe85d
  - file: site/docs/api/hie-cm/m2/errors.md
    fetched: 2026-08-24
    hash: sha256:a22429e14d9f00a77445b833c16e34bf4249ca82e2316ea79709f609d2ddda93
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.care-context]
  errors:
    - hiecm.error.abdm-1056
    - hiecm.error.abdm-1062
    - hiecm.error.abdm-1063
    - hiecm.error.abdm-2406
skills:
  - hiecm-m2-build
  - hiecm-m2-test
---

## In plain words

Linking is the M2 step where your system, acting as a HIP, attaches a
care context to the patient's ABHA address. Once linked, the patient can
see the record in their PHR app and an HIU can request it under consent.
Nothing you hold is discoverable until it is linked.

## Before you start

Three things must already be true, each checkable:

- Your facility has a valid Facility ID registered in the HIP role.
- You hold a gateway session token from the sessions endpoint
  (gateway_sessions_create in the gateway reference).
- The patient has an ABHA address, which is the M1 module's job.

## What happens

NHA's M2 document presents most request and response tables as
screenshots, so the payload shapes below are unconfirmed until the M2
swagger is ingested and run against sandbox. The sequence itself is
documented:

```mermaid
sequenceDiagram
    participant HIP as Your system (HIP)
    participant GW as NHA gateway (HIE-CM)
    participant PHR as Patient's PHR app
    HIP->>HIP: group the visit's records into a care context
    HIP->>GW: link request (ABHA address, reference number, display name)
    GW-->>HIP: synchronous acknowledgement (accepted, not confirmed)
    GW->>HIP: callback to your bridge URL confirming the link
    Note over HIP,GW: asynchronous wait, the confirmation is here
    PHR->>GW: discovery against your facility
    GW-->>PHR: the linked care context appears
```

The endpoint atoms for each step arrive with M2 spec ingestion; until
then the M2 reference carries no operations.

## How you know it worked

The gateway's callback to your registered bridge URL reports success for
your link request, and the care context then appears when the patient's
PHR app runs discovery against your facility. Do not treat the
synchronous acknowledgement alone as success.

```observation schema=exit-condition
channel: callback
path: <YOUR_BRIDGE_URL>/on-link-confirmation
match:
  status: SUCCESS
timeout_seconds: unknown
note: exact callback path and timeout unconfirmed until M2 swagger is ingested
```

## When it goes wrong

The frequent failures NHA's sources document, in rough order of
frequency, each with its fix in the linked error atom:

- hiecm.error.abdm-1056 when the care context is already linked or the
  link reference number is invalid.
- hiecm.error.abdm-1062 when the ABHA number does not match the link
  token.
- hiecm.error.abdm-1063 when the HIP id does not match the link token.
- hiecm.error.abdm-2406 when calls are made out of the logical sequence.
