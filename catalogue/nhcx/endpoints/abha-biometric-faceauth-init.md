---
id: nhcx.endpoint.abha-biometric-faceauth-init
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init
summary: >-
  Start a face check that proves a scheme patient is at the hospital, and get the
  transaction id for the code the patient scans.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. NHCX Face-Auth API Curl, Face Auth Init API and step 1.1.
- url: https://hcxsbx.abdm.gov.in/images/a2f07ff8158e86e9e92a.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/FaceAuth Postman Collection.zip
  hash: sha256:f2db63f7fe272178ee57acfcfd32dbc40680d69527dc35c6724f0da2a32fcaab
  fetched: '2026-09-14'
  note: FaceAuth Postman Collection, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. item FaceAuth init.
related:
  endpoints:
  - nhcx.endpoint.abha-biometric-faceauth-init
  - nhcx.endpoint.abha-biometric-capture-pid
  - nhcx.endpoint.abha-biometric-v2-auth-verify
  - nhcx.endpoint.abha-biometric-auth-refresh-token
  - nhcx.endpoint.abha-biometric-auth-init
  - nhcx.endpoint.preauth-submit
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.payr-1256
  - nhcx.error.payr-1363
  concepts:
  - nhcx.concept.biometric-authentication
  - nhcx.concept.pmjay-on-nhcx
  flows:
  - nhcx.flow.biometric-face
  decisions:
  - nhcx.decision.biometric-modality
---

# POST /pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init

## In plain words

[PMJAY](../glossary/pmjay.md) requires proof that the beneficiary is physically present at the hospital. The hospital proves it by authenticating the beneficiary against their [ABHA](../../shared/glossary/abha.md), by fingerprint, iris or face. Face authentication works when fingerprint and iris do not. The patient completes the capture on their own phone in the ABHA app. Init returns a `txnId` that you show to the patient as a QR code.

These are plain JSON calls: no JWE envelope and no callback.

## Before you start

- The beneficiary's ABHA is linked to their PMJAY card. Where it is not, follow the scheme's approved [KYC](../../shared/glossary/kyc.md) protocols instead.
- A session token for the `Authorization` header, not `bearer_auth`. See [the session token](../concepts/session-token.md).
- The patient has the ABHA app on a phone. In the sandbox, use the sandbox ABHA app.
- The patient can complete a face scan with the Aadhaar [RD service](../glossary/rd-service.md) app.

## What happens

Your system calls the ABDM proxy host, not the fingerprint host.

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/faceauth/init' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'REQUEST-ID: <NEW_UUID_FOR_THIS_CALL>' \
  --header 'TIMESTAMP: <CURRENT_UTC_ISO_TIMESTAMP>' \
  --data-raw '{
    "scope": ["abha-enrol", "face-auth"]
  }'
```

`REQUEST-ID` is a new UUID for every call ([REQUEST-ID](../../shared/glossary/request-id.md)). `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z` ([TIMESTAMP](../../shared/glossary/timestamp-header.md)).

Then:

1. Render `https://phrsbx.abdm.gov.in/face-auth?txnId=<TXN_ID_FROM_FACEAUTH_INIT>` as a QR code.
2. The patient taps the QR icon in the ABHA app, scans the code, presses **Continue** and completes the face scan.
3. Poll [capture PID](abha-biometric-capture-pid.md) until it answers `COMPLETE`.

**Retrying.** Each init returns its own `txnId`. If the patient cannot finish, call init again and show the new code.

## How you know it worked

You receive a JSON body with a `txnId`:

```json
{
  "txnId": "<TXN_ID>",
  "message": "Transaction Id generated Successfully"
}
```

The step is done when the QR code built from that `txnId` is on screen for the patient.

## When it goes wrong

- The call goes to the fingerprint host. Face sits under `/pmjay/sbxhcx/abdmproxy/abha/biometric/`.
- You wait for a callback. None comes. Poll capture PID.
- The same `REQUEST-ID` is sent twice. Generate a new one for every call.
