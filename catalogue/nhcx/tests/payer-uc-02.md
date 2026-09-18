---
id: nhcx.test.payer-uc-02
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 2: Get policy'
summary: >-
  Prove that your insurance system can read back the policies linked to a member,
  exactly as hospitals will see them.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.2, Use case 2.
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
related:
  endpoints:
  - nhcx.endpoint.participant-get-policies
  flows:
  - nhcx.flow.policy-link-and-delink
  concepts:
  - nhcx.concept.policy-linking
  sandbox:
  - nhcx.sandbox.sandbox-exit
  tests:
  - nhcx.test.payer-uc-01
  - nhcx.test.payer-uc-03
  - nhcx.test.provider-uc-02
  errors:
  - nhcx.error.nhcx-401
---

# Payer sandbox exit use case 2: Get policy

## In plain words

This case proves your system can look up the policies linked to a member's [ABHA](../../shared/glossary/abha.md) number or mobile number. It is the lookup hospitals run before they send you anything, so it shows your links as [NHCX](../../shared/glossary/nhcx.md) holds them.

It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md).

## Before you start

- Your payer participant exists in the sandbox registry with the payer role, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 6](payer-uc-06.md).
- You linked a member's ABHA number to a policy in [use case 1](payer-uc-01.md).

## What happens

### Run the call

1. Call [`POST /participant/get/policies`](../endpoints/participant-get-policies.md).

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/get/policies' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"identifiertype": "AbhaNumber", "identifiervalue": "<MEMBER_ABHA_NUMBER>"}'
```

2. Compare the result with what you linked in [use case 1](payer-uc-01.md).

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

- You receive HTTP 200.
- The result lists your payer for that ABHA number, matching the link you wrote.

## When it goes wrong

- **Nothing comes back.** The link in [use case 1](payer-uc-01.md) did not succeed, or used a different ABHA number.
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
