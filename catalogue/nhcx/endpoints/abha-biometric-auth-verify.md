---
id: nhcx.endpoint.abha-biometric-auth-verify
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /hcx/abha/biometric/auth/verify
summary: >-
  Complete a fingerprint or iris check of a scheme patient and receive the short-lived
  token that proves they were present.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Auth Verify; Token Validity and Refresh Mechanism table.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 3-4, Q10 K-547; page 15, Q26.9 process type.
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

# POST /hcx/abha/biometric/auth/verify

## In plain words

[PMJAY](../glossary/pmjay.md) requires proof that the beneficiary is physically present at the hospital. The hospital proves it by authenticating the beneficiary against their [ABHA](../../shared/glossary/abha.md), by fingerprint, iris or face. Verify completes a fingerprint or iris authentication started by [auth init](abha-biometric-auth-init.md). It sends the captured biometric and returns the beneficiary's user token, valid 30 minutes, and a refresh token, valid 15 days.

These are plain JSON calls: no JWE envelope and no callback.

## Before you start

- The beneficiary's ABHA is linked to their PMJAY card. Where it is not, follow the scheme's approved [KYC](../../shared/glossary/kyc.md) protocols instead.
- A session token for the `Authorization` header, not `bearer_auth`. See [the session token](../concepts/session-token.md).
- The participant code of the scheme payer the authentication is for. It goes in the `payerid` header.
- A `txnId` from [auth init](abha-biometric-auth-init.md) for the same modality.
- The [PID block](../glossary/pid-block.md) from the capture device. Build the device's wrapped Aadhaar data hash with `lr` set to `Y`.

## What happens

Your system calls the ABHA biometric service directly with the capture.

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/verify' \
  --header 'accept: */*' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'process: Preauth' \
  --header 'payerid: <PAYER_PARTICIPANT_CODE>' \
  --data-raw '{
    "scope": ["abha-login", "aadhaar-bio-verify"],
    "authData": {
      "authMethods": ["bio"],
      "bio": {
        "txnId": "<TXN_ID_FROM_AUTH_INIT>",
        "fingerPrintAuthPid": "<PID_BLOCK_FROM_DEVICE>"
      }
    },
    "authMode": "FINGERPRINT"
  }'
```

For iris, send `scope` `["abha-login", "aadhaar-iris-verify"]`, `authMethods` `["iris"]`, an `iris` object with `txnId` and `irisAuthPid`, and `authMode` `IRIS`.

`process` is `Preauth` at registration or pre-authorisation, and `Discharge` at discharge.

**Retrying.** A capture belongs to its `txnId`. After a failure, start again with a new init and a new capture.

## How you know it worked

You receive a JSON body with `authResult` `success`:

```json
{
  "txnId": "<TXN_ID>",
  "authResult": "success",
  "message": "<MESSAGE>",
  "token": "<USER_TOKEN>",
  "refreshToken": "<REFRESH_TOKEN>",
  "expiresIn": 1800,
  "refreshExpiresIn": 1296000,
  "accounts": [
    {
      "ABHANumber": "<ABHA_NUMBER>",
      "preferredAbhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "status": "ACTIVE"
    }
  ]
}
```

- `token` is the user token. It expires after `expiresIn` seconds, 1800.
- `refreshToken` lasts `refreshExpiresIn` seconds, 1296000, which is 15 days.
- `accounts[0].ABHANumber` is the beneficiary you authenticated.

The step is done when both tokens are stored against the case. Keep the user token live with [the refresh call](abha-biometric-auth-refresh-token.md) until the transaction cycle ends.

## When it goes wrong

- The biometric APIs answer `K-547`: the wrapped Aadhaar data hash was built with `lr` `N`. Build it with `lr` `Y`, keeping `rc` `Y`, `de` `N` and `pfr` `N`.
- The PID block sits under the wrong key. Fingerprint uses `bio.fingerPrintAuthPid`, iris uses `iris.irisAuthPid`.
- The token lapsed and cannot be refreshed. Start a fresh authentication. Without one, a pre-authorisation is refused with [`PAYR-1256`](../errors/payr-1256.md) and a claim with [`PAYR-1363`](../errors/payr-1363.md), unless it carries the consent questionnaire response.
- `401`: the token went on `bearer_auth` instead of `Authorization`.
