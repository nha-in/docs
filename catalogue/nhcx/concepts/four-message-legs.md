---
id: nhcx.concept.four-message-legs
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'The four legs of every exchange: request, acknowledgement, callback, acknowledgement'
summary: >-
  Every use case completes in four legs, sender to exchange, exchange to receiver,
  receiver to exchange and exchange to sender, and each leg is acknowledged at once.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/healthclaims-exchange-protocol
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__healthclaims-exchange-protocol.md
  hash: sha256:ff4b3aa02f2aa61e2b29e50699fe16bee82c3684908bc2be0815c07b97a83371
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/healthclaims-exchange-protocol, text as shown on the site. Exchange Protocol, Legs 1-4 and Relays.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Message Flow and API Structure table.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.5 claim table, APIs to be called and implemented.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1 Acceptance scenario.
related:
  concepts:
  - nhcx.concept.synchronous-acknowledgement
  - nhcx.concept.what-nhcx-is
  - nhcx.concept.status-lifecycle
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.message-identifiers
  flows:
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  - nhcx.flow.payer-process-a-request
  endpoints:
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.claim-on-submit
  callbacks:
  - nhcx.callback.claim-submit
  - nhcx.callback.claim-on-submit
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
---

# The four legs of every exchange: request, acknowledgement, callback, acknowledgement

## In plain words

NHCX works like email. You hand a message to the exchange and walk away. The answer comes back later as a new message, on a separate call.

So every use case takes four legs. Your request goes to NHCX, NHCX delivers it, the recipient's answer goes to NHCX, and NHCX delivers the answer to you. Each leg is acknowledged at once, before any real work happens.

## Before you start

You need a registered endpoint URL that NHCX can reach. See [the participant registry](./participant-registry.md).

## What happens

```mermaid
graph LR
  S["Sender"] -->|"Leg 1: POST /v1/claim/submit"| X["NHCX"]
  X -->|"Leg 2: POST /v1/claim/submit"| R["Receiver"]
  R -->|"Leg 3: POST /v1/claim/on_submit"| X
  X -->|"Leg 4: POST /v1/claim/on_submit"| S
```

| Leg | Who calls | NHCX checks | Acknowledged by |
|---|---|---|---|
| 1. Sender to NHCX | The sender | Sender and recipient status, headers | NHCX, HTTP 202 |
| 2. NHCX to receiver | NHCX, to the receiver's registered endpoint | Recipient status | The receiver, HTTP 202 |
| 3. Receiver to NHCX | The receiver, on the `on_` path | Both statuses, headers | NHCX, HTTP 202 |
| 4. NHCX to sender | NHCX, to the sender's registered endpoint | Sender status | The sender, HTTP 202 |

### The same path in both roles

NHCX forwards a message on the same path it received it on. So `/v1/claim/submit` is a call a provider makes to NHCX, and also a call NHCX makes to the payer. `/v1/claim/on_submit` is a call the payer makes to NHCX, and also a call NHCX makes to the provider.

Your system therefore implements the paths you receive. A provider implements the `on_` paths for its requests. A payer implements the request paths.

### Who is the sender

For eligibility, insurance plan, preauthorisation, claim and task requests, the provider is the sender. For payment notices and communication requests, the payer is the sender and the provider answers.

### Between exchange instances

The protocol allows relays between NHCX instances at the routing steps. Your system always talks to the one instance it is registered with.

## How you know it worked

You have understood this when you can answer both of these.

1. You are a payer. Which path do you implement to receive a claim, and which path do you call to answer it?
2. Leg 1 returned HTTP 202 an hour ago and leg 4 has not arrived. Which legs could have failed, and which acknowledgement would have told NHCX to retry?

## When it goes wrong

**Waiting on the leg 1 response for the answer.** The 202 only closes leg 1. The answer is leg 4. See [the 202 acknowledgement](./synchronous-acknowledgement.md).

**Leg 4 never arrives.** Your endpoint may be unreachable or slow to acknowledge. See [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md).

**Leg 2 fails at the receiver.** NHCX retries, then gives up and reports to your `/v1/error` endpoint. See [retries and expiry](./retries-and-expiry.md).
