---
id: nhcx.endpoint.v2-participant-delink-abha-policy
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /V2/participant/delink/abha/policy
summary: >-
  The second path for removing products from a beneficiary's policy link; it takes
  the same body as the main de-link call.
sources:
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./V2/participant/delink/abha/policy.post.'
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, Validation for De-Linking.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 3 De-Link ABHA from Policy.
- url: https://hcxsbx.abdm.gov.in/images/b885e59891fedc7e725c.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection.zip
  hash: sha256:2d082f244ee41d137a62af82380dcd2d5db9ebbab66824fd54a23c506d4d9a7f
  fetched: '2026-09-14'
  note: AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection, row 16 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman SANDBOX-Participant_APIs item Delink Abha.
related:
  concepts:
  - nhcx.concept.policy-linking
  flows:
  - nhcx.flow.policy-link-and-delink
  endpoints:
  - nhcx.endpoint.participant-delink-abha-policy
  - nhcx.endpoint.v2-participant-link-abha-policy
  - nhcx.endpoint.v2-participant-get-policies
  errors:
  - nhcx.error.nhcx-401
---

# POST /V2/participant/delink/abha/policy

## In plain words

This path removes products from a beneficiary's policy link, like [`/participant/delink/abha/policy`](participant-delink-abha-policy.md). It takes the same body and returns the same response.

Call [`/participant/delink/abha/policy`](participant-delink-abha-policy.md), the path in the payer [sandbox exit](../glossary/sandbox-exit.md). If you use the V2 paths, pair this with [`/V2/participant/link/abha/policy`](v2-participant-link-abha-policy.md) and [`/V2/participant/get/policies`](v2-participant-get-policies.md).

## Before you start

- The same as for [`/participant/delink/abha/policy`](participant-delink-abha-policy.md): the products are linked, you are the `payerid` or `processingid` participant, and your token comes from that participant's client id.

## What happens

Your system posts the products to remove. NHCX checks the client id in your token against the linking participants, removes the products and answers on the same connection. No callback follows.

| Environment | Participant service base URL |
|---|---|
| Sandbox | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/V2/participant/delink/abha/policy' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "requestid": "<FRESH_UUID_FOR_THIS_REQUEST>",
    "payerid": "<INSURANCE_COMPANY_PARTICIPANT_CODE>",
    "memberid": "<POLICY_HOLDER_MEMBER_ID>",
    "processingid": "<TPA_PARTICIPANT_CODE>",
    "policies": [{
        "productid": "<PRODUCT_ID>", "productname": "<PRODUCT_NAME>"
      }]
  }'
```

The path starts with a capital `V2`. The fields are described on [`/participant/delink/abha/policy`](participant-delink-abha-policy.md).

**Idempotency.** Send a new `requestid` on every call. A repeat after success returns `There is no policies with requested details`.

## How you know it worked

You receive HTTP 200. [`/V2/participant/get/policies`](v2-participant-get-policies.md) no longer returns the removed products for that payer.

## When it goes wrong

- **404 on the path.** The path was written with a lower-case `v2`. Write `/V2/participant/delink/abha/policy`.
- **The de-link is refused with an error message.** The token does not belong to the `payerid` or `processingid` participant.
- **`There is no policies with requested details`.** A listed product is not linked for this `payerid` and `memberid`.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
