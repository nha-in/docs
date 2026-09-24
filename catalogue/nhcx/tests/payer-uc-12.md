---
id: nhcx.test.payer-uc-12
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 12: Respond to search request'
summary: >-
  Prove that your insurance system can answer a hospital's claim search with the
  matching claim responses.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 5, Table 5.2, Use case 12.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Search.
- url: https://hcxsbx.abdm.gov.in/searchhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/searchhcxservice.json
  hash: sha256:21749dd2ba84a19c5523772da359d76293493d44b48651f1af2e6042d78fa296
  fetched: '2026-09-14'
  note: 'API specification: searchhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/search/on_submit.'
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Error scenario and Protocol Response.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 4, Q14; page 2, Q3.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  flows:
  - nhcx.flow.payer-process-a-request
  - nhcx.flow.receive-a-sealed-callback
  concepts:
  - nhcx.concept.message-identifiers
  - nhcx.concept.protocol-headers
  - nhcx.concept.four-message-legs
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.callback-url-requirements
  troubleshooting:
  - nhcx.troubleshooting.duplicate-or-mismatched-correlation
  - nhcx.troubleshooting.recipient-cannot-decrypt
  errors:
  - nhcx.error.nhcx-1010
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1011
  - nhcx.error.nhcx-401
  endpoints:
  - nhcx.endpoint.search-on-submit
  - nhcx.endpoint.fetch-certs
  callbacks:
  - nhcx.callback.search-submit
  - nhcx.callback.error
  fhir:
  - nhcx.fhir.task
  - nhcx.fhir.claim-response
  - nhcx.fhir.validation
  tests:
  - nhcx.test.payer-uc-05
  - nhcx.test.provider-uc-10
---

# Payer sandbox exit use case 12: Respond to search request

## In plain words

A hospital searches its claims with you through [NHCX](../../shared/glossary/nhcx.md), by claim number, date range, policy or product. This case proves your system answers with the matching claim responses, sealed and addressed back to the search.

It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md).

## Before you start

- Your payer participant exists in the sandbox registry with the payer role, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 6](payer-uc-06.md).
- Your registered endpoint URL takes HTTPS calls from the exchange. See [callback URL requirements](../sandbox/callback-url-requirements.md).
- You can decrypt with your own private key, and you hold the provider's public certificate from [use case 5](payer-uc-05.md).
- A sandbox provider participant sends your payer a `POST /v1/search/submit` request. You need a provider partner, or a provider participant of your own, to send it.

## What happens

### Receive the request

1. Wait for `POST /v1/search/submit` on your registered endpoint.
2. Answer it with HTTP 202 within 30 seconds, with the acceptance body from [receive a sealed callback](../flows/receive-a-sealed-callback.md).
3. Decrypt the payload with your private key. Validate the Task bundle against the [NRCeS](../../shared/glossary/nrces.md) profiles.

### Send your answer

1. If you processed the request, build a Task bundle whose output carries the ClaimResponse resources that match the search inputs. See [the task bundle](../fhir/task.md). Validate it against the NRCeS profiles ([validating a bundle](../fhir/validation.md)). Seal it as a [JWE](../glossary/jwe.md) with the provider's public key.
2. If you could not decrypt or validate the request, prepare a `ProtocolResponse` instead. It carries the protocol headers in clear, `x-hcx-status` `response.error`, and `x-hcx-error_details` naming the fault.
3. Set the protected headers. Use a new `x-hcx-api_call_id`, different from the correlation id. Set `x-hcx-correlation_id` to the `x-hcx-api_call_id` of the request you answer. Set `x-hcx-recipient_code` to that request's `x-hcx-sender_code`, and `x-hcx-sender_code` to your participant code. Set `x-hcx-status` to `response.complete`, or `response.partial` when you answer in part.
4. Send the answer to `/v1/search/on_submit`.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/search/on_submit' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"type": "JWEPayload", "payload": "<JWE_COMPACT_STRING>"}'
```

5. NHCX answers with HTTP 202.

### Demonstrate it

Sign-off needs people. Book the demos once the steps above pass in your own runs. See [the sandbox exit process](../sandbox/sandbox-exit.md).

```precondition
human: true
who: your team, with the NHA team
action: Demonstrate this use case in the internal demo, then in the Health Tech Committee (HTC) demo.
how: Email hcx.integration@nha.gov.in to request both demos.
also: Send the FHIR bundles you used to hcx.integration@nha.gov.in for validation by the NRCeS team.
```

## How you know it worked

The pass criterion for this case:

> To respond for search requests based on the task request. It provides the ClaimResponse(s) to the given input criteria.
>
> 1. The payload should be validated against the profiles published by NRCES.
> 2. Api caller ID and Correlation ID should be different.
> 3. Correlation ID should be the API caller ID of the request that you are responding to.
> 4. Receiver code should be the same as Sender ID of the request that Payer system is responding to.

What you observe:

- NHCX answers your `POST /v1/search/on_submit` with HTTP 202.
- Your `x-hcx-api_call_id` differs from your `x-hcx-correlation_id`.
- Your `x-hcx-correlation_id` equals the `x-hcx-api_call_id` of the provider's request.
- Your `x-hcx-recipient_code` equals the `x-hcx-sender_code` of the provider's request.
- The sealed payload is a Task bundle carrying the matching ClaimResponse resources, and it validates against the NRCeS profiles.
- No `/v1/error` report arrives at your endpoint for your answer.
- The ClaimResponse resources match the search inputs, for example the claim number asked for.

## When it goes wrong

- **No request reaches your endpoint.** Check it against the [callback URL requirements](../sandbox/callback-url-requirements.md). Confirm the provider addresses your participant code, or your [TPA](../glossary/tpa.md)'s processing ID.
- **The provider cannot open your answer.** You sealed it with a stale or wrong certificate. Fetch the provider's certificate again with [use case 5](payer-uc-05.md). See [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
- **[NHCX-1010](../errors/nhcx-1010.md), no data for the correlation id.** Your message's `x-hcx-correlation_id` is not the `x-hcx-api_call_id` of the request you answer.
- **[NHCX-1003](../errors/nhcx-1003.md), receiver not registered.** `x-hcx-recipient_code` is wrong. Copy it from the `x-hcx-sender_code` of the request you answer.
- **[NHCX-1011](../errors/nhcx-1011.md), invalid status.** `x-hcx-status` holds a value the exchange does not accept for this message. Use `response.complete` on an answer and `request.initiated` on a request.
- **A `/v1/error` report arrives at your endpoint.** The recipient refused your message after the exchange accepted it. Read the details as [receiving /v1/error](../callbacks/error.md) describes.
- **The exchange keeps redelivering the same message.** Your endpoint did not return HTTP 202 with the acceptance body within 30 seconds. The exchange retries five times, then deletes the request. See [retries and expiry](../concepts/retries-and-expiry.md).
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
