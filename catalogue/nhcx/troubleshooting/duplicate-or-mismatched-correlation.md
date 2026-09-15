---
id: nhcx.troubleshooting.duplicate-or-mismatched-correlation
type: troubleshooting
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Responses arrive against the wrong request
summary: >-
  Answers land on the wrong case, or the exchange refuses a request as a duplicate.
  The checks on your message identifiers, in order.
sources:
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, item 8.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. NHCX Protocol Headers table.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Table 2.2 Validations.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheets CoverageEligibility and Preauth, correlation rows.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 3, Q4.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet NHCX Error Codes, NHCX-1006.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.message-identifiers
  - nhcx.concept.protocol-headers
  decisions:
  - nhcx.decision.status-poll-or-wait
  errors:
  - nhcx.error.nhcx-1006
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1012
  - nhcx.error.payr-1516
  glossary:
  - nhcx.glossary.correlation-id
  - nhcx.glossary.api-call-id
---

# Responses arrive against the wrong request

## In plain words

An answer from [NHCX](../../shared/glossary/nhcx.md) is attached to the wrong case in your system. Or the exchange refuses a request as a duplicate, or refuses a callback it cannot match. All three come from how your system sets and reads the correlation id and the api call id.

## Before you start

- You log the `x-hcx-correlation_id` and `x-hcx-api_call_id` of every message you send and receive.
- You have read [correlation id, API call id and workflow id](../concepts/message-identifiers.md).

## What happens

Work through these in order.

1. **Does each request cycle get its own correlation id?** Generate a new random 36-character identifier for every request that opens a cycle. Set it equal to that request's api call id. Never copy one from an example. See [correlation id](../glossary/correlation-id.md).
2. **Does every message in the cycle carry it unchanged?** The answer, any query and every callback in the cycle echo the correlation id of the request. The answer's own api call id is different.
3. **Is the api call id new on every call?** Generate a fresh one for every call, including retries. See [API call id](../glossary/api-call-id.md).
4. **Did you reuse a failed cycle's correlation id?** After an error, the correlation id becomes inactive. A new request with it is refused with `NHCX-1006`. Start a fresh cycle with a new id.
5. **Do you match answers by correlation id?** Store the correlation id against the case before you send. Match every incoming message on it, never on arrival order or time.
6. **If you are the payer, is the receiver right?** The receiver code of your answer is the sender code of the request you answer.

## How you know it worked

Every callback lands on the case whose request carried its correlation id. New requests are accepted with `202`, and your logs show no `NHCX-1006` or `NHCX-1010`.

## When it goes wrong

If one case's answers keep landing elsewhere after these checks, compare the correlation id in the misplaced callback with the one stored on each case. Two cases holding the same value point at a generator that repeats. A status check can confirm which request NHCX holds for an id. See [poll with /v1/status or wait for the callback](../decisions/status-poll-or-wait.md).

The errors this symptom can surface:

- [NHCX-1006](../errors/nhcx-1006.md): a request with the same correlation id already exists.
- [NHCX-1010](../errors/nhcx-1010.md): no data for the correlation id of a callback.
- [NHCX-1012](../errors/nhcx-1012.md): no records for an api call id.
- [PAYR-1516](../errors/payr-1516.md): no event found for the api call id and correlation id of an error response.
