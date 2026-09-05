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
  - file: catalogue/openapi/hiecm/v3/hiecm-m2.yaml
    fetched: 2026-09-04
    hash: sha256:0fac31a008fe78b247ee46977a1b3931299915b47d458bc3236f494469d3513f
    note: >
      NHA's M2 file as ingested on this branch. The three calls this flow
      makes and the three callbacks it waits on come from here, which is
      what replaced the note that said the endpoint atoms were still to
      come.
verified:
  status: unverified
  against: docs-only
related:
  endpoints:
    - hiecm.endpoint.m2-generate-link-token
    - hiecm.endpoint.m2-hip-link-care-context
    - hiecm.endpoint.m2-link-care-context-notify
  callbacks:
    - hiecm.callback.m2-on-generate-token-result
    - hiecm.callback.m2-on-carecontext-result
    - hiecm.callback.m2-on-context-notify-result
  concepts:
    - hiecm.concept.care-context
    - hiecm.concept.asynchronous-callbacks
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
    HIP->>GW: generate a link token for this patient
    GW->>HIP: callback with the link token
    HIP->>GW: link request (ABHA address, reference number, display name)
    GW-->>HIP: synchronous acknowledgement (accepted, not confirmed)
    GW->>HIP: callback to your bridge URL with the outcome of the link
    Note over HIP,GW: asynchronous wait, the confirmation is here
    PHR->>GW: discovery against your facility
    GW-->>PHR: the linked care context appears
```

1. **Get a link token for the patient.** Call
   [Generate Link Token](../endpoints/m2-generate-link-token.md), which
   posts to `/hiecm/v3/token/generate-token`. The token does not come
   back on that response. It arrives at your bridge, on
   [the token callback](../callbacks/m2-on-generate-token-result.md).
   Store it against the patient: NHA gives its validity as six months.
2. **Link the care context.** Call
   [Link care contexts to an ABHA address](../endpoints/m2-hip-link-care-context.md),
   which posts to `/hiecm/hip/v3/link/carecontext` and carries the link
   token. The response is an acknowledgement that the request was
   accepted, and nothing more.
3. **Wait for the outcome on your bridge.** It arrives at
   [the link callback](../callbacks/m2-on-carecontext-result.md), with
   `response.requestId` matching the `REQUEST-ID` you sent.
4. **Notify ABDM when a linked care context changes.** Call
   [Link Care Context Notify](../endpoints/m2-link-care-context-notify.md),
   which posts to `/hiecm/hip/v3/link/context/notify`, and read the
   outcome on
   [the notify callback](../callbacks/m2-on-context-notify-result.md).

NHA's M2 document presents most request and response tables as
screenshots. The three calls and three callbacks above are from the
ingested M2 file rather than from those screenshots, so their paths and
payload shapes are declared rather than guessed. None of it has been run
against the sandbox.

## How you know it worked

Your bridge receives a POST at `/v3/link/on_carecontext` whose
`response.requestId` matches the `REQUEST-ID` you sent on the link call,
carrying a success `status` rather than an `error`. The care context then
appears when the patient's PHR app runs discovery against your facility.

Do not treat the synchronous acknowledgement on the link call as success.
It says the request was accepted, not that anything was linked.

```observation schema=exit-condition
channel: callback
path: <YOUR_BRIDGE_URL>/v3/link/on_carecontext
match:
  response.requestId: <THE_REQUEST_ID_YOU_SENT>
  status: SUCCESS
timeout_seconds: unknown
note: >
  The path and the payload shape are the ones NHA's ingested M2 file
  declares. The timeout is not published, and no delivery has been
  observed from this repository.
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
