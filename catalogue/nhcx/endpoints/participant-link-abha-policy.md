---
id: nhcx.endpoint.participant-link-abha-policy
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /participant/link/abha/policy
summary: >-
  As a payer, link a beneficiary's health account number and member id to the products
  they hold, so hospitals can find the policy.
sources:
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1 Policy Linking Process; Page 2 request.
- url: https://hcxsbx.abdm.gov.in/images/b885e59891fedc7e725c.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection.zip
  hash: sha256:2d082f244ee41d137a62af82380dcd2d5db9ebbab66824fd54a23c506d4d9a7f
  fetched: '2026-09-14'
  note: AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection, row 16 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman SANDBOX-Participant_APIs item Link Abha.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./participant/link/abha/policy.post; schemas ParticipantLinkAbhaRequest, ParticipantLinkAbhaResponse.'
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
related:
  concepts:
  - nhcx.concept.policy-linking
  flows:
  - nhcx.flow.policy-link-and-delink
  endpoints:
  - nhcx.endpoint.v2-participant-link-abha-policy
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.participant-delink-abha-policy
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  tests:
  - nhcx.test.payer-uc-01
---

# POST /participant/link/abha/policy

## In plain words

A [payer](../glossary/payer.md) calls this to link a beneficiary's [ABHA number](../../shared/glossary/abha-number.md) and member id to the products the beneficiary holds. Hospitals then find the policy with [`/participant/get/policies`](participant-get-policies.md). Without a link, a hospital's lookup returns nothing and the patient cannot be processed as cashless on [NHCX](../../shared/glossary/nhcx.md).

Link ABHA with Policy is use case 1 of the payer [sandbox exit](../glossary/sandbox-exit.md). Call this path. [`/v2/participant/link/abha/policy`](v2-participant-link-abha-policy.md) takes the same body. See [policy linking](../concepts/policy-linking.md).

## Before you start

- Your insurance company is registered and holds its own [participant code](../glossary/participant-code.md). If a [TPA](../glossary/tpa.md) processes your claims, the TPA holds its own code too.
- A current access token minted with the client id that was used when the insurer or the TPA participant was created. It goes in `bearer_auth` as `Bearer <token>`.
- The beneficiary's ABHA number, mobile number, member id and products.

## What happens

Your system posts the link to the participant service. The registry records it and answers on the same connection. No callback follows.

| Environment | Participant service base URL |
|---|---|
| Sandbox | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/link/abha/policy' \
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

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

| Field | What to send |
|---|---|
| `requestid` | A new UUID for every call. |
| `abhanumber` | The policy holder's 14-digit ABHA number, without hyphens. |
| `mobilenumber` | The policy holder's mobile number. |
| `memberid` | The policy holder id in your system. |
| `payerid` | The insurance company's own participant code. Every payer has one, even under a TPA. |
| `processingid` | The participant code of the TPA that processes this insurer's claims. |
| `policies` | One entry per product, each with `productid` and `productname`. |

For an insurer without a TPA, `payerid` is the insurer's own participant code. When an insurer moves to a new TPA, de-link its policies with [`/participant/delink/abha/policy`](participant-delink-abha-policy.md), then link them again with the new TPA's code in `processingid`.

The response is JSON with a `result` string.

**Idempotency.** Send a new `requestid` on every call and log it with the response. Before you retry a link that timed out, look the beneficiary up with [`/participant/get/policies`](participant-get-policies.md). Link again only if the products are missing.

## How you know it worked

You receive HTTP 200 with a `result` string.

[`/participant/get/policies`](participant-get-policies.md) with `identifiertype` `AbhaNumber` and the same ABHA number returns the products you linked.

## When it goes wrong

- **The link is refused although the token is valid.** Only the participants named as `payerid` or `processingid` may link. The token must come from the client id used when that participant was created.
- **`payerid` and `processingid` are swapped.** `payerid` is always the insurer. `processingid` is the TPA.
- **Moving to a new TPA by linking again.** De-link the existing policies first, then link with the new `processingid`.
- **400 Client error.** A required field is missing, or `requestid` is not a UUID.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
