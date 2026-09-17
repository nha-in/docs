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
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The prose success status, the notify race, and the self requested
      fetch after linking. Observed by an integrator on 2026-09-16, not
      yet run from this repository.
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
    - hiecm.concept.context-notify-timing
    - hiecm.concept.linking-triggers-self-fetch
    - hiecm.concept.bridge-url-ownership
  glossary:
    - shared.glossary.m2
    - shared.glossary.hip
    - shared.glossary.hiu
    - shared.glossary.hfr
    - shared.glossary.phr
    - shared.glossary.abha-address
  errors:
    - hiecm.error.abdm-1006
    - hiecm.error.abdm-1056
    - hiecm.error.abdm-1062
    - hiecm.error.abdm-1063
    - hiecm.error.abdm-2406
skills:
  - hiecm-m2-build
  - hiecm-m2-test
---

## In plain words

Linking is the [M2](shared.glossary.m2) step where your facility attaches
a [care context](hiecm.concept.care-context) to the patient's
[ABHA address](shared.glossary.abha-address). Your facility is the
[HIP](shared.glossary.hip) when it publishes a record, and your software
is how it takes that role. Once linked, the patient can see the record in
their [PHR](shared.glossary.phr) app, and an organisation that asks to
read it takes the [HIU](shared.glossary.hiu) role and can request it
under consent. Nothing you hold is discoverable until it is linked.

## Before you start

Three things must already be true, each checkable:

- Your facility holds a facility ID from the
  [HFR](shared.glossary.hfr) and a bridge linked with type `HIP`. See
  [link a facility to its bridge](m4-link-bridge.md).
- You hold a gateway session token from the sessions endpoint
  (gateway_sessions_create in the gateway reference).
- The patient has an ABHA address, which is the M1 module's job.

## What happens

```mermaid
sequenceDiagram
    participant HIP as Your facility (HIP)
    participant GW as HIE-CM gateway
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
   [Generate Link Token](hiecm.endpoint.m2-generate-link-token), which
   posts to `/hiecm/v3/token/generate-token`. The token does not come
   back on that response. It arrives at your bridge, on
   [the token callback](hiecm.callback.m2-on-generate-token-result).
   Store it against the patient. A link token is valid for six months.
2. **Link the care context.** Call
   [Link care contexts to an ABHA address](hiecm.endpoint.m2-hip-link-care-context),
   which posts to `/hiecm/hip/v3/link/carecontext` and carries the link
   token. Send `abhaNumber` as digits only and `hiType` as a string.
   The response is an acknowledgement that the request was accepted,
   and nothing more.
3. **Wait for the outcome on your bridge.** It arrives at
   [the link callback](hiecm.callback.m2-on-carecontext-result), with
   `response.requestId` matching the `REQUEST-ID` you sent. Success is
   the absence of an `error` object; the `status` reads
   `Successfully Linked care context`.
4. **Notify ABDM that the care context is linked.** Wait at least five
   seconds, then call
   [Link Care Context Notify](hiecm.endpoint.m2-link-care-context-notify),
   which posts to `/hiecm/hip/v3/link/context/notify`, and read the
   outcome on
   [the notify callback](hiecm.callback.m2-on-context-notify-result).
   An `ERRORED` acknowledgement with
   [ABDM-1006](hiecm.error.abdm-1006) "No care context linked" means the
   link is not yet visible: retry at 5, 15 and 60 seconds. See
   [context notify timing](hiecm.concept.context-notify-timing).
5. **Be ready to serve the record at once.** Within about ten seconds of
   a successful notify the patient's PHR app requests the data itself,
   and a consent notification followed by a health information request
   arrive on your bridge. See
   [linking triggers a self requested fetch](hiecm.concept.linking-triggers-self-fetch).

## How you know it worked

Your bridge receives a POST at `/api/v3/link/on_carecontext` whose
`response.requestId` matches the `REQUEST-ID` you sent on the link call,
carrying `status: Successfully Linked care context` and no `error`. The care context then
appears when the patient's PHR app runs discovery against your facility.

Do not treat the synchronous acknowledgement on the link call as success.
It says the request was accepted, not that anything was linked.

```observation schema=exit-condition
channel: callback
path: <YOUR_BRIDGE_URL>/api/v3/link/on_carecontext
match:
  response.requestId: <THE_REQUEST_ID_YOU_SENT>
  error: absent
timeout_seconds: 60
note: >
  The success status is the sentence "Successfully Linked care context",
  so test for the absence of error rather than comparing status against
  SUCCESS. Delivery is usually within one second.
```

## When it goes wrong

The frequent failures, in rough order of frequency, each with its fix in
the linked error atom:

- A 400 with an empty body on the link call, when `abhaNumber` carries
  dashes or `hiType` is an array.
- hiecm.error.abdm-1006 on the notify acknowledgement when the notify
  was sent before the link became visible. Retry with backoff.
- hiecm.error.abdm-1056 when the care context is already linked or the
  link reference number is invalid.
- hiecm.error.abdm-1062 when the ABHA number does not match the link
  token.
- hiecm.error.abdm-1063 when the HIP id does not match the link token.
- hiecm.error.abdm-2406 when calls are made out of the logical sequence.
