---
id: nhcx.endpoint.participant-delink-abha-policy
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /participant/delink/abha/policy
summary: >-
  As a payer, remove products from a beneficiary's policy link so hospitals stop
  finding coverage that has ended.
sources:
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, Validation for De-Linking; Page 1 TPA change.
- url: https://hcxsbx.abdm.gov.in/images/b885e59891fedc7e725c.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection.zip
  hash: sha256:2d082f244ee41d137a62af82380dcd2d5db9ebbab66824fd54a23c506d4d9a7f
  fetched: '2026-09-14'
  note: AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection, row 16 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman SANDBOX-Participant_APIs item Delink Abha.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./participant/delink/abha/policy.post; schema ParticipantDeLinkAbhaRequest.'
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, item 10 Policy Linking/Delinking auth restriction.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 3 De-Link ABHA from Policy.
related:
  concepts:
  - nhcx.concept.policy-linking
  flows:
  - nhcx.flow.policy-link-and-delink
  endpoints:
  - nhcx.endpoint.v2-participant-delink-abha-policy
  - nhcx.endpoint.participant-link-abha-policy
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  tests:
  - nhcx.test.payer-uc-03
---

# POST /participant/delink/abha/policy

## In plain words

A [payer](../glossary/payer.md) calls this to remove products from a beneficiary's policy link on [NHCX](../../shared/glossary/nhcx.md). Hospitals then stop finding that coverage through [`/participant/get/policies`](participant-get-policies.md). It reverses [`/participant/link/abha/policy`](participant-link-abha-policy.md).

De-Link ABHA from Policy is use case 3 of the payer [sandbox exit](../glossary/sandbox-exit.md). Call this path. [`/v2/participant/delink/abha/policy`](v2-participant-delink-abha-policy.md) takes the same body.

## Before you start

- The products are linked for this `payerid` and `memberid`.
- You are the participant named as `payerid` or `processingid` when the products were linked.
- A current access token minted with the client id used when your participant was created. It goes in `bearer_auth` as `Bearer <token>`.

## What happens

Your system posts the products to remove. NHCX reads the client id from your token and checks that it matches the insurer (`payerid`) or the TPA (`processingid`) that linked them. It then removes the products and answers on the same connection. No callback follows.

| Environment | Participant service base URL |
|---|---|
| Sandbox | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/delink/abha/policy' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "requestid": "<FRESH_UUID_FOR_THIS_REQUEST>",
    "payerid": "<INSURANCE_COMPANY_PARTICIPANT_CODE>",
    "memberid": "<POLICY_HOLDER_MEMBER_ID>",
    "processingid": "<TPA_PARTICIPANT_CODE>",
    "policies": [
      {
        "productid": "<PRODUCT_ID>",
        "productname": "<PRODUCT_NAME>"
      }
    ]
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

The body has no `abhanumber` field. It is keyed on `payerid`, `memberid` and the products listed. Omit `processingid` if the products were linked without one. List only the products to remove.

To move an insurer to a new TPA, de-link its policies here, then link them again with the new TPA's code in `processingid`.

**Idempotency.** Send a new `requestid` on every call. Repeating a de-link that already succeeded returns `There is no policies with requested details`. Treat that message after a timeout as done, and confirm with [`/participant/get/policies`](participant-get-policies.md).

## How you know it worked

You receive HTTP 200.

[`/participant/get/policies`](participant-get-policies.md) for the beneficiary no longer returns the removed products for that payer.

## When it goes wrong

- **The de-link is refused with an error message.** The client id in your token belongs to neither the `payerid` nor the `processingid` participant from the link. Mint the token with the client id used when that participant was created.
- **`There is no policies with requested details`.** A listed product is not linked for this `payerid` and `memberid`. Check the product id and name against the link.
- **A hospital still sees the policy.** Hospitals cache policy lookups. Ask them to refresh the lookup for this beneficiary.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
