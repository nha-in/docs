---
id: nhcx.test.provider-uc-06
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 6: Request insurance plan details'
summary: >-
  Prove that your hospital system can request a payer's plan for a policy through
  the claims exchange, and handle both kinds of answer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 2-3, Tables 2.2 and 3.1, Use case 6.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Insurance Plan.
- url: https://hcxsbx.abdm.gov.in/images/c8a5a74cc38bcd46586d.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Requests and Responses for UseCases.xlsx
  hash: sha256:25d9426cab5661180103996888855e3cef20b701862d6800ec7659855303a913
  fetched: '2026-09-14'
  note: NHCX Requests and Responses for UseCases, row 11 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Insurance Plan.
- url: https://hcxsbx.abdm.gov.in/insuranceplanhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/insuranceplanhcxservice.json
  hash: sha256:03665c6e6a5c8d86e3d621ab577dd683cf13c155d5b9529f5be6ca70fef13dee
  fetched: '2026-09-14'
  note: 'API specification: insuranceplanhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/insuranceplan/request.'
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, item 7.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 4-6, Q14 and Q21.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  concepts:
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  - nhcx.concept.four-message-legs
  - nhcx.concept.insurance-plan
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.callback-url-requirements
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  - nhcx.troubleshooting.recipient-cannot-decrypt
  - nhcx.troubleshooting.bundle-rejected
  flows:
  - nhcx.flow.insurance-plan-request
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  endpoints:
  - nhcx.endpoint.insuranceplan-request
  - nhcx.endpoint.fetch-certs
  callbacks:
  - nhcx.callback.insuranceplan-on-request
  fhir:
  - nhcx.fhir.insurance-plan-bundle
  - nhcx.fhir.task
  - nhcx.fhir.validation
  tests:
  - nhcx.test.provider-uc-03
  - nhcx.test.provider-uc-13
  - nhcx.test.payer-uc-08
  - nhcx.test.tc-hbp-01
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1006
  - nhcx.error.payr-1001
  - nhcx.error.payr-1049
  - nhcx.error.payr-1402
  - nhcx.error.payr-1405
  - nhcx.error.payr-1406
---

# Provider sandbox exit use case 6: Request insurance plan details

## In plain words

The insurance plan tells your hospital what a policy covers, under which conditions, and with which documents. This case proves your system can request it from a payer through [NHCX](../../shared/glossary/nhcx.md).

The plan arrives later on your callback, sealed. A `ProtocolResponse` arrives instead when the payer could not process the request.

## Before you start

- Your provider participant exists in the sandbox registry, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 4](provider-uc-04.md).
- You hold the recipient's public certificate from [use case 3](provider-uc-03.md), and your own private key.
- Your registered endpoint URL takes HTTPS calls from the exchange. See [callback URL requirements](../sandbox/callback-url-requirements.md).
- The recipient is the sandbox dummy payer, participant code `1000003538@hcx`, unless a payer partner answers for you. See [the dummy payer](../sandbox/dummy-payer.md).
- With the dummy payer, put provider id `32722` inside the bundle and use policy number `100217`. These values work only with the dummy payer.

## What happens

### Send the request

1. Build a Task bundle whose Task has `code` `poll` and a policy number input, with your provider id as an optional input. See [insurance plan bundles](../fhir/insurance-plan-bundle.md). Validate it against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
2. Seal it as a [JWE](../glossary/jwe.md) with the recipient's public key. [Send a sealed request](../flows/send-a-sealed-request.md) walks through the envelope.
3. Set the protected headers. `x-hcx-sender_code` is your participant code. `x-hcx-recipient_code` is the payer's processing ID, or `1000003538@hcx` for the dummy payer. `x-hcx-status` is `request.initiated`. Use a new `x-hcx-api_call_id` and a `x-hcx-correlation_id` unique to this request cycle. `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
4. Send the sealed payload.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/insuranceplan/request' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -H 'Authorization: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

5. NHCX answers with HTTP 202. Store your `x-hcx-api_call_id` against the case.

### Receive the answer

1. Wait for `POST /v1/insuranceplan/on_request` on your registered endpoint.
2. Answer it with HTTP 202 within 30 seconds, with the acceptance body from [receive a sealed callback](../flows/receive-a-sealed-callback.md).
3. Read `type` in the body. `ProtocolResponse` means the payer could not process your request. Read `x-hcx-error_details` and do not decrypt.
4. Any other `type` carries a sealed `payload`. Decrypt it with your private key and parse the InsurancePlan bundle.
5. Validate the decrypted bundle against the NRCeS profiles.

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

> Request insurance plan details from the Payer via HCX
>
> Callback API should be implemented by provider systems. It should accept the payload in two forms, and it will be derived based on “type” param of the response.
>
> Payload should be validated against the profiles published by NRCES.

What you observe:

- NHCX answers your `POST /v1/insuranceplan/request` with HTTP 202.
- You receive `POST /v1/insuranceplan/on_request` on your registered endpoint.
- Its `x-hcx-correlation_id` equals the `x-hcx-api_call_id` of your request. Its `x-hcx-recipient_code` is your participant code.
- Your endpoint answers it with HTTP 202 within 30 seconds.
- For a sealed answer, the decrypted payload is a bundle holding InsurancePlan resources that validates against the NRCeS profiles.
- For a `ProtocolResponse`, your system shows the code and message from `x-hcx-error_details` and does not try to decrypt.

## When it goes wrong

- **The payer says the policy or hospital is unknown.** See [PAYR-1402](../errors/payr-1402.md) and [PAYR-1405](../errors/payr-1405.md). With the dummy payer, use provider id `32722` and policy number `100217`.
- **[PAYR-1406](../errors/payr-1406.md), a request is already in progress.** Wait for the first answer before you ask again.
- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
- **[NHCX-1003](../errors/nhcx-1003.md), receiver not registered.** `x-hcx-recipient_code` is wrong. Address the processing ID from [use case 2](provider-uc-02.md), not the payer ID.
- **A `ProtocolResponse` says the payer cannot decrypt.** You sealed with a stale or wrong certificate. See [PAYR-1001](../errors/payr-1001.md) and [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
- **A `ProtocolResponse` rejects the bundle.** See [PAYR-1049](../errors/payr-1049.md) and [the payer rejects your bundle](../troubleshooting/bundle-rejected.md). Validate against the NRCeS profiles before you send.
