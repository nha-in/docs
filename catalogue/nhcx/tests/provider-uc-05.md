---
id: nhcx.test.provider-uc-05
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 5: Check the coverage eligibility'
summary: >-
  Prove that your hospital system can ask a payer through the claims exchange whether
  a patient's cover is in force, and handle both kinds of answer.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Tables 1.5 and 2.1, Use case 5.
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, items 7 and 8.
- url: https://hcxsbx.abdm.gov.in/coverageeligibilityhcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/coverageeligibilityhcxservice.json
  hash: sha256:1723a4020b1b33d0bc1d7175609f0d05e6a6a78e8b4c52041222396639ceb52c
  fetched: '2026-09-14'
  note: 'API specification: coverageeligibilityhcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v1/coverageeligibility/check.'
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 4-6, Q14 and Q21.
- url: https://hcxsbx.abdm.gov.in/images/7e71b563b562509cca5a.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/API Response Handling to avoid Failures.pdf
  hash: sha256:b65cf1ec6dc1e33c7a9e77106ff7f1892e66d943598b64809f3a677752f6efbe
  fetched: '2026-09-14'
  note: API Response Handling to avoid Failures, row 15 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Error scenario.
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
  - nhcx.concept.coverage-eligibility-purposes
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.callback-url-requirements
  troubleshooting:
  - nhcx.troubleshooting.accepted-then-no-callback
  - nhcx.troubleshooting.recipient-cannot-decrypt
  - nhcx.troubleshooting.bundle-rejected
  flows:
  - nhcx.flow.coverage-eligibility-check
  - nhcx.flow.send-a-sealed-request
  - nhcx.flow.receive-a-sealed-callback
  endpoints:
  - nhcx.endpoint.coverageeligibility-check
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.get-session
  callbacks:
  - nhcx.callback.coverageeligibility-on-check
  fhir:
  - nhcx.fhir.coverage-eligibility-request
  - nhcx.fhir.coverage-eligibility-response
  - nhcx.fhir.validation
  tests:
  - nhcx.test.provider-uc-02
  - nhcx.test.provider-uc-03
  - nhcx.test.provider-uc-13
  - nhcx.test.payer-uc-07
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1005
  - nhcx.error.nhcx-1006
  - nhcx.error.payr-1001
  - nhcx.error.payr-1049
---

# Provider sandbox exit use case 5: Check the coverage eligibility

## In plain words

This case proves your system can ask a [payer](../glossary/payer.md) whether a patient's cover is in force, through [NHCX](../../shared/glossary/nhcx.md). The answer comes back later, on a callback your system hosts.

Your callback must handle two forms of answer. A sealed result arrives when the payer processed the request. A `ProtocolResponse` arrives when it could not.

## Before you start

- Your provider participant exists in the sandbox registry, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 4](provider-uc-04.md).
- You hold the recipient's public certificate from [use case 3](provider-uc-03.md), and your own private key.
- Your registered endpoint URL takes HTTPS calls from the exchange. See [callback URL requirements](../sandbox/callback-url-requirements.md).
- The recipient is the sandbox dummy payer, participant code `1000003538@hcx`, unless a payer partner answers for you. See [the dummy payer](../sandbox/dummy-payer.md).
- You have the patient's policy and the payer's processing ID from [use case 2](provider-uc-02.md).

## What happens

### Send the request

1. Build a coverage eligibility request bundle for the patient, as a [FHIR](../../shared/glossary/fhir.md) collection. See [the coverage eligibility request bundle](../fhir/coverage-eligibility-request.md). Validate it against the [NRCeS](../../shared/glossary/nrces.md) profiles, as [validating a bundle](../fhir/validation.md) describes.
2. Seal it as a [JWE](../glossary/jwe.md) with the recipient's public key. [Send a sealed request](../flows/send-a-sealed-request.md) walks through the envelope.
3. Set the protected headers. `x-hcx-sender_code` is your participant code. `x-hcx-recipient_code` is the payer's processing ID, or `1000003538@hcx` for the dummy payer. `x-hcx-status` is `request.initiated`. Use a new `x-hcx-api_call_id` and a `x-hcx-correlation_id` unique to this request cycle. `x-hcx-ben-abha-id` carries the beneficiary's [ABHA](../../shared/glossary/abha.md) number.
4. Send the sealed payload.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/hcx/v1/coverageeligibility/check' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"payload": "<JWE_COMPACT_STRING>"}'
```

5. NHCX answers with HTTP 202. Store your `x-hcx-api_call_id` against the case.

### Receive the answer

1. Wait for `POST /v1/coverageeligibility/on_check` on your registered endpoint.
2. Answer it with HTTP 202 within 30 seconds, with the acceptance body from [receive a sealed callback](../flows/receive-a-sealed-callback.md).
3. Read `type` in the body. `ProtocolResponse` means the payer could not process your request. Read `x-hcx-error_details` and do not decrypt.
4. Any other `type` carries a sealed `payload`. Decrypt it with your private key and parse the CoverageEligibilityResponse bundle.
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

> To check the eligibility of a beneficiary with the payers via NHCX.
>
> Callback API should be implemented by provider systems. It should accept the payload in two forms and it will be derived based on “type” param of the response.
>
> Payload should be validated against the profiles published by NRCES.

What you observe:

- NHCX answers your `POST /v1/coverageeligibility/check` with HTTP 202.
- You receive `POST /v1/coverageeligibility/on_check` on your registered endpoint.
- Its `x-hcx-correlation_id` equals the `x-hcx-api_call_id` of your request. Its `x-hcx-recipient_code` is your participant code.
- Your endpoint answers it with HTTP 202 within 30 seconds.
- For a sealed answer, the decrypted payload is a CoverageEligibilityResponse bundle that validates against the NRCeS profiles.
- For a `ProtocolResponse`, your system shows the code and message from `x-hcx-error_details` and does not try to decrypt.

## When it goes wrong

- **The callback never arrives.** Your callback URL must use a domain name, not an IP address or port. It must run on an India-hosted server that allows the exchange's outbound addresses. See [callback URL requirements](../sandbox/callback-url-requirements.md) and [accepted, then no callback](../troubleshooting/accepted-then-no-callback.md). Then ask where the request stands with [use case 13](provider-uc-13.md).
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
- **[NHCX-1003](../errors/nhcx-1003.md), receiver not registered.** `x-hcx-recipient_code` is wrong. Address the processing ID from [use case 2](provider-uc-02.md), not the payer ID.
- **[NHCX-1006](../errors/nhcx-1006.md), duplicate request.** You reused a correlation id. A failed request makes its correlation id inactive, so start the next cycle with a new one.
- **A `ProtocolResponse` says the payer cannot decrypt.** You sealed with a stale or wrong certificate. See [PAYR-1001](../errors/payr-1001.md) and [the recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
- **A `ProtocolResponse` rejects the bundle.** See [PAYR-1049](../errors/payr-1049.md) and [the payer rejects your bundle](../troubleshooting/bundle-rejected.md). Validate against the NRCeS profiles before you send.
- **The exchange keeps redelivering the same message.** Your endpoint did not return HTTP 202 with the acceptance body within 30 seconds. The exchange retries five times, then deletes the request. See [retries and expiry](../concepts/retries-and-expiry.md).
