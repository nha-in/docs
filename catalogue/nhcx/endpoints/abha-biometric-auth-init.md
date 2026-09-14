---
id: nhcx.endpoint.abha-biometric-auth-init
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /hcx/abha/biometric/auth/init
summary: >-
  Start a fingerprint or iris check that proves a scheme patient is at the hospital,
  and get the transaction id the next step needs.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Biometric Authentication - Fingerprint/IRIS, Auth INIT; applicability table.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. page 18-20, section 8.2 Biometric Authentication.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 15, Q26.9 process type.
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.abha-biometric-auth-init
  - nhcx.endpoint.abha-biometric-auth-verify
  - nhcx.endpoint.abha-biometric-auth-refresh-token
  - nhcx.endpoint.abha-biometric-faceauth-init
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.claim-submit
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.payr-1256
  - nhcx.error.payr-1363
  concepts:
  - nhcx.concept.biometric-authentication
  - nhcx.concept.pmjay-on-nhcx
  flows:
  - nhcx.flow.biometric-fingerprint-iris
  decisions:
  - nhcx.decision.biometric-modality
  glossary:
  - nhcx.glossary.rd-service
  - nhcx.glossary.pid-block
---

# POST /hcx/abha/biometric/auth/init

## In plain words

[PMJAY](../glossary/pmjay.md) requires proof that the beneficiary is physically present at the hospital. The hospital proves it by authenticating the beneficiary against their [ABHA](../../shared/glossary/abha.md), by fingerprint, iris or face. Init starts a fingerprint or iris authentication and returns a `txnId`. You then capture the biometric on a device and complete it with [auth verify](abha-biometric-auth-verify.md).

These are plain JSON calls: no JWE envelope and no callback.

## Before you start

- The beneficiary's ABHA is linked to their PMJAY card. Where it is not, follow the scheme's approved [KYC](../../shared/glossary/kyc.md) protocols instead.
- A session token for the `Authorization` header, not `bearer_auth`. See [the session token](../concepts/session-token.md).
- The participant code of the scheme payer the authentication is for. It goes in the `payerid` header.
- The beneficiary's ABHA number, with hyphens, as `91-XXXX-XXXX-XXXX`.
- A fingerprint or iris capture device with its [RD service](../glossary/rd-service.md) app. For iris or face instead, see [which modality to use](../decisions/biometric-modality.md).

## What happens

Your system calls the ABHA biometric service directly. Choose the modality:

| Modality | `scope` | `authMode` |
|---|---|---|
| Fingerprint | `["abha-login", "aadhaar-bio-verify"]` | `FINGERPRINT` |
| Iris | `["abha-login", "aadhaar-iris-verify"]` | `IRIS` |

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/init' \
  --header 'accept: */*' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'process: Preauth' \
  --header 'payerid: <PAYER_PARTICIPANT_CODE>' \
  --data-raw '{
    "scope": ["abha-login", "aadhaar-bio-verify"],
    "loginHint": "abha-number",
    "loginId": "<BENEFICIARY_ABHA_NUMBER_WITH_HYPHENS>",
    "otpSystem": "aadhaar",
    "authMode": "FINGERPRINT"
  }'
```

`process` is `Preauth` at registration or pre-authorisation, and `Discharge` at discharge.

**Retrying.** Each init starts a new transaction. If a call fails, call init again and use the `txnId` it returns.

## How you know it worked

You receive a JSON body with a `txnId`:

```json
{
  "txnId": "<TXN_ID>",
  "authMode": null,
  "message": "FingerPrint authentication request successfully sent.",
  "status": null
}
```

The step is done when you hold a `txnId`. Capture the biometric and send it with that `txnId` to auth verify.

## When it goes wrong

- `401` although the token is fresh: the token went on `bearer_auth`. These calls read `Authorization`.
- The request goes to the face host. Fingerprint and iris sit under `/hcx/abha/biometric/`, face under `/pmjay/sbxhcx/abdmproxy/abha/biometric/`.
- `loginId` has its hyphens stripped. Send the ABHA number as `91-XXXX-XXXX-XXXX`.
