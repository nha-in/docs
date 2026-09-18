---
id: nhcx.endpoint.v2-participant-create
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v2/participant/create
summary: >-
  Start production registration by linking your organisation to its external registry
  record, which sends a passcode to your registered mobile.
sources:
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Pages 1-2 Step 1 Participant Creation; Page 4 enums.
- url: https://hcxsbx.abdm.gov.in/images/293a43103f575b4e7f7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(PROD)_NHCX-OnBoarding APIs Postman Collection.zip
  hash: sha256:b96963e2eead0fe3e718eb7dd2374f1a15f0dbb1aed7197a1ceae59cefbc7214
  fetched: '2026-09-14'
  note: AWS(PROD)_NHCX-OnBoarding APIs Postman Collection, row 7 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman PROD_NHCX-OnBoarding APIs item /v2/participant/create.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, item 5 In PROD when passing the registry ID.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3 Q6 and Q9.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v2/participant/create.post; schema ParticipantCreateV2Resp.'
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. Page 9 Integrator Journey.
related:
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.participant-code
  - nhcx.concept.participant-roles
  flows:
  - nhcx.flow.production-onboarding
  endpoints:
  - nhcx.endpoint.validate
  - nhcx.endpoint.participant-create
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  sandbox:
  - nhcx.sandbox.going-live
---

# POST /v2/participant/create

## In plain words

This call starts production registration in the [NHCX](../../shared/glossary/nhcx.md) participant registry. It links your organisation to its record in an external registry. It then sends a passcode to the mobile number on that record.

You confirm the registration with [`/validate`](validate.md). Your [participant code](../glossary/participant-code.md) is confirmed only after that call succeeds.

In production, use this call. In the sandbox, use [`/participant/create`](participant-create.md).

## Before you start

- Sandbox exit is complete and your production client id carries your role. See [going live](../sandbox/going-live.md).
- A current production access token from the [session call](session-token.md).
- Your registry id. A [provider](../glossary/provider.md) sends its [HFR](../../shared/glossary/hfr.md) ID. A [payer](../glossary/payer.md) or [TPA](../glossary/tpa.md) sends its [IRDAI](../glossary/irdai.md) registry ID without leading zeros: `0123` goes as `123`.
- The mobile number already on record. For a provider it must match the HFR record. For a payer it must match the NHCX payer details.
- The person who holds that phone, ready to read you the passcode within 24 hours.

## What happens

1. Your system posts the registry link to the production participant service.
2. The registry validates the registry type, the role and the mobile number.
3. It answers on the same connection with your participant id and a `transactionid`. A passcode goes to the registered mobile number.
4. You call [`/validate`](validate.md) with the `transactionid` and the passcode within 24 hours.

```bash
curl -X POST 'https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/create' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "registrytype": "<REGISTRY_CODE>",
    "registryid": "<HFR_ID_OR_IRDAI_ID>",
    "role": ["<ROLE_CODE>"],
    "endpoint_url": "<YOUR_BRIDGE_URL>",
    "mobilenumber": "<MOBILE_NUMBER_ON_RECORD>",
    "email": "<YOUR_REGISTERED_EMAIL>"
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

| Field | What to send |
|---|---|
| `registrytype` | HFR `10001`, NIN `10002`, ROHINI `10003` or PAYER `10004`. Providers and EUAs use `10001`. Payers and TPAs use `10004`. |
| `registryid` | HFR ID for a provider. IRDAI ID, without leading zeros, for a payer or TPA. Client id for an [EUA](../../shared/glossary/eua.md). |
| `role` | An array of role codes: PROVIDER `10001`, PAYER `10002`, AGENCY_TPA `10003`, AGENCY_REGULATOR `10004`, RESEARCH `10005`, MEMBER_ISNP `10006`, AGENCY_SPONSOR `10007`, HIE_HIO_HCX `10008`, EUA `10009`. |
| `endpoint_url` | Your bridge URL. |
| `mobilenumber` | The mobile number on record. |
| `email` | Your registered email. |

The response body has this shape:

```json
{
  "participantid": "<YOUR_PARTICIPANT_CODE>",
  "facilityname": "<FACILITY_NAME>",
  "facilitycontact": "<FACILITY_CONTACT>",
  "facilityemail": "<FACILITY_EMAIL>",
  "transactionid": "<TRANSACTION_ID_FOR_VALIDATE>",
  "error": {
    "code": null,
    "message": null,
    "trace": null
  }
}
```

**Idempotency.** Each call generates a new `transactionid` and sends a new passcode. A passcode works only with its own transaction id. Confirm the pair from the call you intend to keep. If you lose the transaction id, call create again and use the new pair.

## How you know it worked

You receive HTTP 200 with `participantid` and `transactionid` filled in and `error.code` null.

A passcode arrives on the registered mobile number. You now hold the transaction id and the passcode, and less than 24 hours have passed since the call.

The step is complete when [`/validate`](validate.md) returns 200 for that pair.

## When it goes wrong

- **The mobile number does not match.** The number must match the HFR record for a provider, or the NHCX payer details for a payer. Send the number on record, or correct the record first.
- **The IRDAI ID has leading zeros.** Strip them: `0123` goes as `123`.
- **Wrong role or registry code.** A wrong mapping leads to rejected requests or misrouted transactions later. `10001` is PROVIDER as a role and HFR as a registry type.
- **The transaction id is lost, or 24 hours have passed.** Call create again. Validate the new pair.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
