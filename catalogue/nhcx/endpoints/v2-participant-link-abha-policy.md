---
id: nhcx.endpoint.v2-participant-link-abha-policy
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v2/participant/link/abha/policy
summary: >-
  The second path for linking a beneficiary to the products they hold; it takes
  the same body as the main link call.
sources:
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v2/participant/link/abha/policy.post.'
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, item 10 Policy Linking/Delinking auth restriction.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 1 Link ABHA with Policy.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Policy Linking Process.
related:
  concepts:
  - nhcx.concept.policy-linking
  flows:
  - nhcx.flow.policy-link-and-delink
  endpoints:
  - nhcx.endpoint.participant-link-abha-policy
  - nhcx.endpoint.v2-participant-get-policies
  - nhcx.endpoint.v2-participant-delink-abha-policy
  errors:
  - nhcx.error.nhcx-401
---

# POST /v2/participant/link/abha/policy

## In plain words

This path links a beneficiary's [ABHA number](../../shared/glossary/abha-number.md) and member id to the products they hold, like [`/participant/link/abha/policy`](participant-link-abha-policy.md). It takes the same body and returns the same response.

Call [`/participant/link/abha/policy`](participant-link-abha-policy.md), the path in the payer [sandbox exit](../glossary/sandbox-exit.md). If you use this v2 path, pair it with [`/v2/participant/get/policies`](v2-participant-get-policies.md) and [`/v2/participant/delink/abha/policy`](v2-participant-delink-abha-policy.md).

## Before you start

- The same as for [`/participant/link/abha/policy`](participant-link-abha-policy.md): registered participant codes for the insurer and any TPA, and a token minted with the client id used when that participant was created.

## What happens

Your system posts the link to the participant service. The registry records it and answers on the same connection. No callback follows.

| Environment | Participant service base URL |
|---|---|
| Sandbox | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/link/abha/policy' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "requestid": "<FRESH_UUID_FOR_THIS_REQUEST>",
    "abhanumber": "<POLICY_HOLDER_ABHA_NUMBER_14_DIGITS>",
    "mobilenumber": "<POLICY_HOLDER_MOBILE_NUMBER>",
    "memberid": "<POLICY_HOLDER_MEMBER_ID>",
    "payerid": "<INSURANCE_COMPANY_PARTICIPANT_CODE>",
    "processingid": "<TPA_PARTICIPANT_CODE>",
    "policies": [
      {
        "productid": "<PRODUCT_ID>",
        "productname": "<PRODUCT_NAME>"
      }
    ]
  }'
```

The fields are described on [`/participant/link/abha/policy`](participant-link-abha-policy.md). The response is JSON with a `result` string.

**Idempotency.** Send a new `requestid` on every call. Before you retry a link that timed out, check [`/v2/participant/get/policies`](v2-participant-get-policies.md) for the products.

## How you know it worked

You receive HTTP 200 with a `result` string. [`/v2/participant/get/policies`](v2-participant-get-policies.md) with the same ABHA number returns the products you linked.

## When it goes wrong

- **The link is refused although the token is valid.** The token does not belong to the `payerid` or `processingid` participant.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
