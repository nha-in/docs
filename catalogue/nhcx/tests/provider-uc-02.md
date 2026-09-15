---
id: nhcx.test.provider-uc-02
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 2: Get policy'
summary: >-
  Prove that your hospital system can look up the insurance policies a payer has
  linked to a patient, before any claim work starts.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.2, Use case 2.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, item 7.
- url: https://hcxsbx.abdm.gov.in/images/53347f5988b0ce5396f1.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX_APIs to be called based on scenario.xlsx
  hash: sha256:f92a30673d65dd2cc3cf09e2087c624f23f781dc4ca6b5cd8ec1825e224ac108
  fetched: '2026-09-14'
  note: NHCX_APIs to be called based on scenario, row 26 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. sheet Scenarios, row 1.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./participant/get/policies; schema identifiertype.'
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
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.participant-link-abha-policy
  flows:
  - nhcx.flow.policy-link-and-delink
  concepts:
  - nhcx.concept.policy-linking
  - nhcx.concept.participant-code
  sandbox:
  - nhcx.sandbox.sandbox-exit
  tests:
  - nhcx.test.provider-uc-04
  - nhcx.test.provider-uc-05
  - nhcx.test.payer-uc-01
  - nhcx.test.payer-uc-02
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1003
---

# Provider sandbox exit use case 2: Get policy

## In plain words

This case proves your system can find a patient's insurance policies. You look them up by the patient's [ABHA](../../shared/glossary/abha.md) number or mobile number, and [NHCX](../../shared/glossary/nhcx.md) answers from its registry. Payers write those links with [payer use case 1](payer-uc-01.md).

It is one of the thirteen provider use cases for [sandbox exit](../glossary/sandbox-exit.md). Call it right after you register the patient.

## Before you start

- Your provider participant exists in the sandbox registry, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 4](provider-uc-04.md).
- You have the ABHA number of a beneficiary whose payer linked it to a policy through [`/participant/link/abha/policy`](../endpoints/participant-link-abha-policy.md).

## What happens

### Run the call

1. Call [`POST /participant/get/policies`](../endpoints/participant-get-policies.md) with the beneficiary's identifier.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/get/policies' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"identifiertype": "AbhaNumber", "identifiervalue": "<BENEFICIARY_ABHA_NUMBER>"}'
```

2. Read the policies in the response.
3. Store the processing ID the response gives for the policy. It is the `x-hcx-recipient_code` for eligibility, preauthorisation and claim requests. Do not use the payer ID for this.

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

> Get the list of policies for the beneficiary based on the mobile number or ABHA

What you observe:

- You receive HTTP 200 listing the policies linked to that beneficiary.
- The payer that made the link appears in the result.
- Your system stores the processing ID, ready for [use case 5](provider-uc-05.md).

## When it goes wrong

- **No policies come back.** No payer has linked a policy to that ABHA number. Confirm the number matches the one the payer linked.
- **Later requests fail with [NHCX-1003](../errors/nhcx-1003.md).** Your system addressed the payer ID. Address the processing ID from this response instead.
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
