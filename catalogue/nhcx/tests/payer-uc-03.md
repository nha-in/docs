---
id: nhcx.test.payer-uc-03
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 3: De-link ABHA from policy'
summary: >-
  Prove that your insurance system can remove a policy from a member's health account
  link when the policy ends or moves.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.3, Use case 3.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Validation for De-Linking.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./participant/delink/abha/policy.'
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
  - nhcx.endpoint.participant-delink-abha-policy
  - nhcx.endpoint.participant-get-policies
  flows:
  - nhcx.flow.policy-link-and-delink
  concepts:
  - nhcx.concept.policy-linking
  sandbox:
  - nhcx.sandbox.sandbox-exit
  tests:
  - nhcx.test.payer-uc-01
  - nhcx.test.payer-uc-02
  errors:
  - nhcx.error.nhcx-401
---

# Payer sandbox exit use case 3: De-link ABHA from policy

## In plain words

Policies lapse and members change products. This case proves your system can remove a policy from a member's [ABHA](../../shared/glossary/abha.md) link in the [NHCX](../../shared/glossary/nhcx.md) registry. Once removed, hospitals no longer see it.

It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md).

## Before you start

- Your payer participant exists in the sandbox registry with the payer role, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 6](payer-uc-06.md).
- You linked the policy in [use case 1](payer-uc-01.md), and you are the participant named in its `payerid` or `processingid`.
- Your token comes from that participant's client id. The exchange compares the two before it de-links.

## What happens

### Run the call

1. Call [`POST /participant/delink/abha/policy`](../endpoints/participant-delink-abha-policy.md) with the products to remove.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/delink/abha/policy' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"requestid": "<NEW_REQUEST_ID>", "payerid": "<YOUR_PARTICIPANT_CODE>", "memberid": "<MEMBER_ID>", "policies": [{"productid": "<PRODUCT_ID>", "productname": "<PRODUCT_NAME>"}]}'
```

2. Confirm the removal: run [use case 2](payer-uc-02.md) for the member's ABHA number.

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

> De-Link Policy Number from ABHA profile

What you observe:

- You receive HTTP 200 for the de-link call.
- A `/participant/get/policies` lookup no longer returns the removed product for that member.

## When it goes wrong

- **The de-link is refused with an error message.** The token's client id is not the one behind the `payerid` or `processingid` of the link. Use that participant's credentials.
- **`There is no policies with requested details`.** The product is not in the member's linked policies. Check `productid`, `productname` and `memberid` against the link.
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
