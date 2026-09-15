---
id: nhcx.endpoint.abha-biometric-auth-refresh-token
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: GET /hcx/abha/biometric/auth/refresh/token
summary: >-
  Swap a scheme patient's refresh token for a new short-lived presence token without
  capturing their biometric again.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. 3. Auth Refresh Token.
- url: https://hcxsbx.abdm.gov.in/images/8a3940fb518ea05d34e9.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication APIs Postman Collection.zip
  hash: sha256:725dc838b39beb3e3ddd2c008314323e6d5cd1c237d98875280da5218da458a4
  fetched: '2026-09-14'
  note: Biometric Authentication APIs Postman Collection, row 30 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. item auth/refresh/token Copy.
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
  - nhcx.flow.biometric-face
  decisions:
  - nhcx.decision.biometric-modality
  glossary:
  - nhcx.glossary.rd-service
  - nhcx.glossary.pid-block
---

# GET /hcx/abha/biometric/auth/refresh/token

## In plain words

[PMJAY](../glossary/pmjay.md) requires proof that the beneficiary is physically present at the hospital. The hospital proves it by authenticating the beneficiary against their [ABHA](../../shared/glossary/abha.md), by fingerprint, iris or face. The user token from a biometric verify lasts 30 minutes, but a case lasts longer. This call exchanges the refresh token for a new user token and a new refresh token, so the case stays authenticated.

These are plain JSON calls: no JWE envelope and no callback.

## Before you start

- A session token for the `Authorization` header, not `bearer_auth`. See [the session token](../concepts/session-token.md).
- The participant code of the scheme payer the authentication is for. It goes in the `payerid` header.
- A refresh token less than 15 days old, from [auth verify](abha-biometric-auth-verify.md), [face verify](abha-biometric-v2-auth-verify.md) or an earlier refresh.

## What happens

Your system calls the ABHA biometric service with the refresh token on the `R-token` header. The request has no body.

```bash
curl --location --request GET 'https://apisbx.abdm.gov.in/hcx/abha/biometric/auth/refresh/token' \
  --header 'R-token: Bearer <REFRESH_TOKEN_FROM_VERIFY>' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'payerid: <PAYER_PARTICIPANT_CODE>' \
  --header 'process: Preauth'
```

`process` is `Preauth` at registration or pre-authorisation, and `Discharge` at discharge.

Each refresh returns a new refresh token whose 15 days run from that moment. Refresh at least once every 10 days and store the new token to keep the chain alive.

## How you know it worked

You receive a new token pair in the same shape as auth verify: `token` with `expiresIn` 1800 and `refreshToken` with `refreshExpiresIn` 1296000.

The step is done when the new user token and the new refresh token are stored against the case, replacing the old ones.

## When it goes wrong

- The refresh token went on `Authorization`. It belongs on `R-token`, and the session token on `Authorization`.
- The old refresh token was kept after a refresh. Store the new one every time.
- The refresh token is more than 15 days old. Start a fresh biometric authentication.
