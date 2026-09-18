---
id: nhcx.sandbox.test-participants
type: sandbox
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Test participants available in the sandbox
summary: >-
  Who your system can exchange messages with in the sandbox, starting with the built-in
  test payer, and how to look up any other participant.
sources:
- url: https://hcxsbx.abdm.gov.in/images/819467ec15aff13cc2a8.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Dummy Payer Implementation.pdf
  hash: sha256:97335ebc4cd32c86e0c34328b2f4c526420b32a7a009208364043d6334e9e757
  fetched: '2026-09-14'
  note: NHCX Dummy Payer Implementation, row 19 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q16.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Use cases 1 and 3.
- url: https://hcxsbx.abdm.gov.in/images/bc2efb078b98548f8e6b.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Sandbox.pdf
  hash: sha256:cbd03baf428655f0305e2f60ca331f8b76700496b070c522cafcc95001710b3a
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Sandbox, row 4 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. participant create and delete examples.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Quick Reference Card.
related:
  sandbox:
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.environments-and-base-urls
  - nhcx.sandbox.sandbox-exit
  endpoints:
  - nhcx.endpoint.fetch-participants-list
  - nhcx.endpoint.fetch-certs
  concepts:
  - nhcx.concept.participant-code
  - nhcx.concept.encryption-certificate
  tests:
  - nhcx.test.provider-uc-01
  - nhcx.test.provider-uc-03
  glossary:
  - nhcx.glossary.participant-code
  - nhcx.glossary.payer
---

# Test participants available in the sandbox

## In plain words

In the sandbox, a provider needs a [payer](../glossary/payer.md) to send requests to. NHCX provides one: the dummy payer, participant code `1000003538@hcx`. It answers the main use cases so you can test end to end.

Every other sandbox participant can be looked up by role with the participant list API.

## Before you start

- You have your own [participant code](../glossary/participant-code.md). See [onboard as a participant in the sandbox](../flows/sandbox-onboarding.md).
- You can get a session token and call the participant APIs. See [environments and base URLs](environments-and-base-urls.md).

## What happens

### The dummy payer

| Item | Value |
|---|---|
| Participant code | `1000003538@hcx` |
| Use cases it answers | Insurance plan, coverage eligibility, preauthorisation, claim, payment notice, communication |
| Provider id to put in an insurance plan request | `32722` |
| Policy number to put in an insurance plan request | `100217` |

The provider id and policy number apply only to the dummy payer. See [the dummy payer](dummy-payer.md) for how to drive its answers.

### Looking up other participants

1. Call `/fetch/participants/list` on the participant base to list participants by role. See [fetch participants list](../endpoints/fetch-participants-list.md).
2. Call `/fetch/certs` with the participant's code to get the certificate you encrypt for. See [fetch certificates](../endpoints/fetch-certs.md).
3. Store the certificate locally instead of fetching it for every message.

### Codes in the documentation

Participant codes such as `100001@sbx`, `10001@sbx` and `1000002090@hcx` appear in examples. They show the format. Use the participant list to find a live counterpart.

## How you know it worked

- `/fetch/certs` for `1000003538@hcx` returns an `encryption_cert` value holding a PEM certificate.
- A coverage eligibility check sent to `1000003538@hcx` produces a `/v1/coverageeligibility/on_check` callback at your endpoint.

## When it goes wrong

- **You sent a request to a code copied from an example.** It may not be a live participant. Look the code up with the participant list first.
- **The dummy payer does not answer a preauthorisation or claim.** It waits for a trigger from you. See [the dummy payer](dummy-payer.md).
- **The dummy payer cannot decrypt your message.** You encrypted with the wrong certificate. Fetch its certificate again with `/fetch/certs` and resend with a new correlation id.
- **A payer you expect is missing from the list.** It has not registered in the sandbox yet. Test against the dummy payer meanwhile.
