---
id: nhcx.endpoint.v2-participant-get-policies
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v2/participant/get/policies
summary: >-
  The second path for looking up a beneficiary's linked policies; it takes the same
  body as the main lookup.
sources:
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v2/participant/get/policies.post.'
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, item 7 Providers pointing to the PayerID.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 5.6.2 Supported Identifier Types.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 2 Get Policy.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 2 Get Policy.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, For Sandbox / For Production envBaseUrl.
related:
  concepts:
  - nhcx.concept.policy-linking
  endpoints:
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.v2-participant-link-abha-policy
  - nhcx.endpoint.v2-participant-delink-abha-policy
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1003
---

# POST /v2/participant/get/policies

## In plain words

This path returns the policies linked to a beneficiary, like [`/participant/get/policies`](participant-get-policies.md). It takes the same body and returns the same response.

Call [`/participant/get/policies`](participant-get-policies.md), the path in the provider and payer [sandbox exit](../glossary/sandbox-exit.md). If you use the v2 paths, pair this with [`/v2/participant/link/abha/policy`](v2-participant-link-abha-policy.md) and [`/v2/participant/delink/abha/policy`](v2-participant-delink-abha-policy.md).

## Before you start

- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.
- A payer or TPA has linked the beneficiary.
- An identifier for the beneficiary: an [ABHA number](../../shared/glossary/abha-number.md), a member id or a mobile number.

## What happens

Your system posts one identifier. The registry answers on the same connection with the linked policies. Nothing changes and no callback follows.

| Environment | Participant service base URL |
|---|---|
| Sandbox | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/v2/participant/get/policies' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "identifiertype": "<AbhaNumber_OR_MemberId_OR_MobileNo>",
    "identifiervalue": "<IDENTIFIER_VALUE>"
  }'
```

| Field | What to send |
|---|---|
| `identifiertype` | `AbhaNumber`, `MemberId` or `MobileNo`. |
| `identifiervalue` | The value of that identifier. Send an ABHA number as 14 digits without hyphens. |

Read the processing id from each returned policy. It goes in `x-hcx-recipient_code`, not the payer id.

**Idempotency.** The call only reads. Repeating it is safe.

## How you know it worked

You receive HTTP 200 with at least one linked policy. You hold a processing participant code, a member id and a product for the patient.

## When it goes wrong

- **Messages to the payer fail with a receiver error.** The payer id went into `x-hcx-recipient_code`. Use the processing id. See [NHCX-1003](../errors/nhcx-1003.md).
- **Nothing is returned for an ABHA number.** Send 14 digits without hyphens, then try `MemberId` and `MobileNo`.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
