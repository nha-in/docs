---
id: nhcx.concept.protocol-headers
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The x-hcx protocol headers
summary: >-
  The x-hcx headers inside the sealed envelope tell the exchange who is sending,
  who must receive, which conversation the message belongs to and what state it
  is in.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Protected Header table and Status Description.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2 ProtocolResponse.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3, Q4.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, PAYR-1005 description.
related:
  concepts:
  - nhcx.concept.message-identifiers
  - nhcx.concept.status-lifecycle
  - nhcx.concept.workflow-codes
  - nhcx.concept.jwe-envelope
  - nhcx.concept.participant-code
  - nhcx.concept.retries-and-expiry
  glossary:
  - nhcx.glossary.protected-header
  - nhcx.glossary.correlation-id
  - nhcx.glossary.api-call-id
  - nhcx.glossary.workflow-id
  - shared.glossary.abha-number
  errors:
  - nhcx.error.nhcx-1005
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-1018
  - nhcx.error.nhcx-1006
  flows:
  - nhcx.flow.send-a-sealed-request
---

# The x-hcx protocol headers

## In plain words

The protocol headers are the address and tracking label on every sealed message. They live inside the [protected header](../glossary/protected-header.md), and every name starts with `x-hcx-`.

NHCX reads them to route and audit the message. It never reads the bundle underneath.

## Before you start

Read [the JWE envelope](./jwe-envelope.md) first. You need your own and the recipient's [participant codes](./participant-code.md).

## What happens

### The headers to send on every request

Send all of these. Together they satisfy every published header list.

| Header | Holds |
|---|---|
| `x-hcx-sender_code` | Your participant code |
| `x-hcx-recipient_code` | The participant that must act on the message |
| `x-hcx-api_call_id` | A new UUID for this one call. See [message identifiers](./message-identifiers.md) |
| `x-hcx-request_id` | A UUID for the originating request |
| `x-hcx-correlation_id` | The UUID of the conversation |
| `x-hcx-workflow_id` | The stage of the case. See [workflow codes](./workflow-codes.md) |
| `x-hcx-timestamp` | When you sent it, from a synchronised clock |
| `x-hcx-status` | The message state. See below |
| `x-hcx-ben-abha-id` | The beneficiary's [ABHA number](../../shared/glossary/abha-number.md) |

Each UUID is a random 36 character universally unique identifier.

### Status values

| Who sends | `x-hcx-status` |
|---|---|
| The party starting a request | `request.initiated` |
| The party answering, final answer | `response.complete` |
| The party answering, partial answer or acknowledgement | `response.partial` |
| The party answering, rejection or error | `response.error` |

[The status lifecycle](./status-lifecycle.md) covers the states NHCX adds itself.

### Optional headers

| Header | Holds |
|---|---|
| `x-hcx-debug_flag` | `Error`, `Info` or `Debug`: asks for debug detail. Servers may ignore it |
| `x-hcx-error_details` | An object with `code`, `message` and `trace` |
| `x-hcx-debug_details` | The same shape, for debugging |

### Extra fields on an error response

A `ProtocolResponse` repeats the protocol headers in the clear and adds `x-hcx-redirect_to`, `x-hcx-domain-header` (with `use_case_name` and `amt_processed`) and `x-hcx-entity-type`. The entity type is one of `coverageeligibility`, `preauth`, `claim`, `task`, `payment` and `insuranceplan`.

## How you know it worked

You have understood this when you can answer both of these.

1. You answer a payer's communication request. What goes in `x-hcx-status`, and which header tells NHCX which conversation your answer belongs to?
2. Which three headers must hold fresh random UUIDs when you start a new preauthorisation?

## When it goes wrong

**Missing or malformed header.** NHCX refuses the envelope with [NHCX-1005](../errors/nhcx-1005.md).

**Wrong status value.** NHCX refuses a status it does not recognise with [NHCX-1011](../errors/nhcx-1011.md). Use the four values above exactly, in lower case.

**ABHA number in the wrong format.** NHCX refuses it with [NHCX-1018](../errors/nhcx-1018.md). The error message names the expected format, `XX-XXXX-XXXX-XXXX`.

**Reused correlation ID.** A new request with a correlation ID NHCX has already seen is refused with [NHCX-1006](../errors/nhcx-1006.md).

**Stale timestamp.** A payer refuses a request whose timestamp is 24 hours or more away from its own clock. See [retries and expiry](./retries-and-expiry.md).
