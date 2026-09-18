---
id: nhcx.endpoint.participant-create
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /participant/create
summary: >-
  Register your organisation in the sandbox participant registry and receive the
  participant code that addresses all your messages.
sources:
- url: https://hcxsbx.abdm.gov.in/images/e683dda0a8cf953abbc7.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)NHCX-OnBoarding APIs Postman Collection.zip
  hash: sha256:ca4348e8a373c54bdcabd07eff8e49a55d93cdfae65fa5008ae0d56526a769f2
  fetched: '2026-09-14'
  note: AWS(Sandbox)NHCX-OnBoarding APIs Postman Collection, row 6 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman SANDBOX_NHCX-OnBoarding APIs item Participant Create.
- url: https://hcxsbx.abdm.gov.in/images/bc2efb078b98548f8e6b.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Sandbox.pdf
  hash: sha256:cbd03baf428655f0305e2f60ca331f8b76700496b070c522cafcc95001710b3a
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Sandbox, row 4 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, API Definition - Create Participant.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./participant/create.post; schemas ParticipantCreateBody, ParticipantCreateResponse.'
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Valid Role Enums and Valid Registry Enums.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3 Q6-Q9; Page 4 Q11; Page 5 Q21.
- url: https://hcxsbx.abdm.gov.in/images/ec361a6c3e90e766d227.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Steps to generate encryption Certificate.pdf
  hash: sha256:94605e935f05ebb49e24dee50787cb4f3f1c401983a9616a5aaabdbc302f664b
  fetched: '2026-09-14'
  note: Steps to generate encryption Certificate, row 20 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3, Step 4 Base64 Encoding.
related:
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.participant-code
  - nhcx.concept.participant-roles
  - nhcx.concept.encryption-certificate
  flows:
  - nhcx.flow.sandbox-onboarding
  - nhcx.flow.generate-and-register-certificate
  endpoints:
  - nhcx.endpoint.v2-participant-create
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.participant-search
  - nhcx.endpoint.fetch-participants-list
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.callback-url-rejected
  sandbox:
  - nhcx.sandbox.prerequisites
  - nhcx.sandbox.callback-url-requirements
---

# POST /participant/create

## In plain words

This call registers your organisation in the [NHCX](../../shared/glossary/nhcx.md) [participant registry](../concepts/participant-registry.md). The registry answers with your [participant code](../glossary/participant-code.md). Every message you send or receive on NHCX is addressed with that code.

This is the sandbox create call. In production, call [`/v2/participant/create`](v2-participant-create.md) and confirm it with [`/validate`](validate.md).

## Before you start

- A current access token from the [session call](session-token.md).
- Your registry id. A [provider](../glossary/provider.md) uses its [HFR](../../shared/glossary/hfr.md) ID. A [payer](../glossary/payer.md) or [TPA](../glossary/tpa.md) uses its [IRDAI](../glossary/irdai.md) or other authority-issued ID. An [EUA](../../shared/glossary/eua.md) uses its client id.
- Your public encryption certificate, Base64 encoded. See [generate and register a certificate](../flows/generate-and-register-certificate.md).
- Your callback bridge URL, on a domain name, served from India. See [callback URL requirements](../sandbox/callback-url-requirements.md).

## What happens

Your system posts a JSON profile to the sandbox participant service. The registry validates the linked registry codes, creates the record and answers on the same connection. No callback follows.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/create' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "linked_registry_codes": ["<REGISTRY_CODE>"],
    "registryid": "<YOUR_REGISTRY_ID>",
    "participant_name": "<YOUR_ORGANISATION_NAME>",
    "scheme_code": "<SCHEME_CODE_SUCH_AS_PMJAY>",
    "state": "<YOUR_STATE>",
    "district": "<YOUR_DISTRICT>",
    "roles": ["<ROLE_CODE>"],
    "primaryEmail": "<YOUR_EMAIL>",
    "phone": ["<YOUR_LANDLINE>"],
    "primaryMobile": "<YOUR_MOBILE>",
    "signing_cert_path": "<URL_OF_YOUR_SIGNING_CERTIFICATE>",
    "encryption_cert": "<BASE64_OF_YOUR_PEM_CERTIFICATE>",
    "endpoint_url": "<YOUR_BRIDGE_URL>"
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

Put a role code in `roles`:

| Role | Code |
|---|---|
| PROVIDER | `10001` |
| PAYER | `10002` |
| AGENCY_TPA | `10003` |
| AGENCY_REGULATOR | `10004` |
| RESEARCH | `10005` |
| MEMBER_ISNP | `10006` |
| AGENCY_SPONSOR | `10007` |
| HIE_HIO_HCX | `10008` |
| EUA | `10009` |

Put a registry code in `linked_registry_codes`:

| Registry | Code | Who uses it |
|---|---|---|
| HFR | `10001` | Providers and EUAs |
| NIN | `10002` | |
| ROHINI | `10003` | |
| PAYER | `10004` | Payers and TPAs |

Send every code as a five-digit string with no spaces, for example `"10003"`. `10001` means PROVIDER in `roles` and HFR in `linked_registry_codes`. They are different fields.

`encryption_cert` is the Base64 encoding of the whole PEM certificate, including the `BEGIN` and `END` lines. `endpoint_url` is the bridge URL where NHCX delivers messages to you.

The response body has this shape:

```json
{
  "participant_code": "<YOUR_NEW_PARTICIPANT_CODE>"
}
```

**Idempotency.** Do not repeat create to retry a timeout or to fix a field. If a create times out, look for your organisation in [`/fetch/participants/list`](fetch-participants-list.md) first. Change a field with [`/participant/update`](participant-update.md). An organisation holds more than one participant code only when each code is linked to a separate HFR ID.

## How you know it worked

You receive HTTP 200 with `participant_code` in the body. Store it as configuration. It becomes `x-hcx-sender_code` on every message you send.

A [`/participant/search`](participant-search.md) with that code returns your record, with the `endpoint_url` and `encryption_cert` you sent. Your organisation exchanges claims only after the record reaches status `Active`.

## When it goes wrong

- **400 Client error.** A field is malformed or the `Accept` header is missing. Check the snake_case field names, the codes in `roles` and `linked_registry_codes`, and that `encryption_cert` is Base64 of the PEM, not the raw PEM.
- **Wrong role or registry code.** A wrong mapping leads to rejected requests or misrouted transactions later. Use the tables above.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
- **Messages never reach you after onboarding.** The `endpoint_url` uses an IP address or a port, or the host is outside India. See [callback URL rejected](../troubleshooting/callback-url-rejected.md).
- **404 or 500.** 404 means a resource was not found, so check the registry codes you sent. 500 means a downstream system is down. Retry a 500 later.
