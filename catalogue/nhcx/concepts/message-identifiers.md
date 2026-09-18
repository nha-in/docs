---
id: nhcx.concept.message-identifiers
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Correlation id, API call id and workflow id
summary: >-
  Four identifiers track every message: one per network call, one per request, one
  per conversation and one for the stage of the case.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. Protected Header table.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3, Q4.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use case 7 Validations.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, item 8.
related:
  glossary:
  - nhcx.glossary.correlation-id
  - nhcx.glossary.api-call-id
  - nhcx.glossary.workflow-id
  concepts:
  - nhcx.concept.protocol-headers
  - nhcx.concept.workflow-codes
  - nhcx.concept.retries-and-expiry
  - nhcx.concept.four-message-legs
  errors:
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1012
  - nhcx.error.nhcx-1016
  - nhcx.error.payr-1516
  troubleshooting:
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  endpoints:
  - nhcx.endpoint.status
---

# Correlation id, API call id and workflow id

## In plain words

Many messages fly back and forth for one patient's claim. Four identifiers in the protocol headers keep them apart and tie them together.

The [API call id](../glossary/api-call-id.md) names one network call. The request id names one request. The [correlation id](../glossary/correlation-id.md) names one conversation, a request and everything that answers it. The [workflow id](../glossary/workflow-id.md) names the stage the case has reached.

## Before you start

Read [the protocol headers](./protocol-headers.md) first.

## What happens

| Identifier | Header | Scope | Who sets it |
|---|---|---|---|
| API call id | `x-hcx-api_call_id` | One HTTP call | The caller, new on every call |
| Request id | `x-hcx-request_id` | One originating request | The sender |
| Correlation id | `x-hcx-correlation_id` | One conversation | The initiator; responders copy it |
| Workflow id | `x-hcx-workflow_id` | The stage of the case | Whoever sends the message |

API call id, request id and correlation id are random 36 character UUIDs. The API call id and the correlation id on a message are always different values.

### How they relate in one exchange

```mermaid
graph TD
  R["Provider request<br/>correlation C, call id A1"] --> ACK1["NHCX 202"]
  R --> F["Delivered to payer<br/>correlation C"]
  F --> RS["Payer response<br/>correlation C, call id A2"]
  RS --> D["Delivered to provider<br/>correlation C"]
```

The payer's response carries the same correlation id as the request, and a new API call id of its own. Your system matches the response to its request by the correlation id.

### Rules

- **New call, new API call id.** Never reuse one, even on a retry you send yourself.
- **New request, new correlation id.** NHCX refuses an initiating request whose correlation id it already holds.
- **A response copies the correlation id.** Every message that answers a request carries that request's correlation id.
- **After a failure, start again.** When a request fails, NHCX makes its correlation id inactive. Send a fresh request with a new correlation id.
- **The workflow id changes with the stage.** It says what this message is: a new preauthorisation, a query response, a payment acknowledgement.

## How you know it worked

You have understood this when you can answer both of these.

1. Your preauthorisation failed on the payer's side and you fixed the bundle. Which identifiers must be new on the resubmission, and why?
2. Two responses arrive for two different claims from the same payer. Which header tells you which claim each one belongs to?

## When it goes wrong

**Duplicate correlation id.** NHCX refuses the request with [NHCX-1006](../errors/nhcx-1006.md). Generate a fresh correlation id.

**Response with an unknown correlation id.** NHCX refuses a callback whose correlation id it does not hold with [NHCX-1010](../errors/nhcx-1010.md).

**Unknown API call id.** A lookup by an API call id NHCX has no record of returns [NHCX-1012](../errors/nhcx-1012.md).

**Wrong action for the conversation.** [NHCX-1016](../errors/nhcx-1016.md) means the action does not fit the correlation id you sent.

**The payer has no matching event.** The PMJAY payer reports [PAYR-1516](../errors/payr-1516.md) when it cannot find the API call id and correlation id pair. See [mismatched correlation](../troubleshooting/duplicate-or-mismatched-correlation.md).
