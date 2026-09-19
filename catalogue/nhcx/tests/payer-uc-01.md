---
id: nhcx.test.payer-uc-01
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 1: Link ABHA with policy'
summary: >-
  Prove that your insurance system can link a member's health account number to
  the policies they bought, so hospitals can find them.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.1, Use case 1.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-2, Policy Linking Process.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, item 10.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./participant/link/abha/policy.'
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q3.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  endpoints:
  - nhcx.endpoint.participant-link-abha-policy
  - nhcx.endpoint.participant-get-policies
  flows:
  - nhcx.flow.policy-link-and-delink
  concepts:
  - nhcx.concept.policy-linking
  - nhcx.concept.participant-code
  sandbox:
  - nhcx.sandbox.sandbox-exit
  tests:
  - nhcx.test.payer-uc-02
  - nhcx.test.payer-uc-03
  - nhcx.test.payer-uc-06
  - nhcx.test.provider-uc-02
  errors:
  - nhcx.error.nhcx-401
  glossary:
  - nhcx.glossary.tpa
  - nhcx.glossary.sandbox-exit
---

# Payer sandbox exit use case 1: Link ABHA with policy

## In plain words

Hospitals find a patient's policies by looking up the patient's [ABHA](../../shared/glossary/abha.md) number in the [NHCX](../../shared/glossary/nhcx.md) registry. The registry holds only the links payers write. This case proves your system writes the link when a member buys a policy.

It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md). The exchange answers this call itself.

## Before you start

- Your payer participant exists in the sandbox registry with the payer role, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 6](payer-uc-06.md).
- The token comes from the client id used when your participant was created. Linking is refused under any other.
- You know your `payerid`. If a [TPA](../glossary/tpa.md) processes your claims, you also know the TPA's participant code, the `processingid`.
- You have a member's ABHA number, mobile number, member id and the products they hold.

## What happens

### Run the call

1. Call [`POST /participant/link/abha/policy`](../endpoints/participant-link-abha-policy.md).

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/link/abha/policy' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"requestid": "<NEW_REQUEST_ID>", "abhanumber": "<MEMBER_ABHA_NUMBER>", "mobilenumber": "<MEMBER_MOBILE_NUMBER>", "memberid": "<MEMBER_ID>", "payerid": "<YOUR_PARTICIPANT_CODE>", "processingid": "<TPA_PARTICIPANT_CODE_OR_YOURS>", "policies": [{"productid": "<PRODUCT_ID>", "productname": "<PRODUCT_NAME>"}]}'
```

2. For an individual payer, `payerid` is your participant code. Under a TPA, `payerid` is the insurance company's code and `processingid` is the TPA's.
3. Confirm the link: run [use case 2](payer-uc-02.md) for the same ABHA number.

### Demonstrate it

Sign-off needs people. Book the demos once the steps above pass in your own runs. See [the sandbox exit process](../sandbox/sandbox-exit.md).

```precondition
human: true
who: your team, with the NHA team
action: Demonstrate this use case in the internal demo, then in the Health Tech Committee (HTC) demo.
how: Email hcx.integration@nha.gov.in to request both demos.
```

## How you know it worked

The pass criterion for this case:

> Link ABHA Number to the Policy purchased by the individual at the time of policy creation at payer systems.

What you observe:

- You receive HTTP 200 for the link call.
- A `/participant/get/policies` lookup for the same ABHA number returns your payer.

## When it goes wrong

- **The link is refused although the token is valid.** The token came from another client id. Generate it with the client id used at participant creation, and confirm any mismatch by email.
- **Your insurance company moves to another TPA.** De-link the policies with [use case 3](payer-uc-03.md). Link them again with the new TPA's code as `processingid`.
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
