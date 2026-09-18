---
id: nhcx.endpoint.abha-biometric-capture-pid
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid
summary: >-
  Check whether a scheme patient has finished the face scan on their phone, so the
  hospital can complete the face check.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. NHCX Face-Auth API Curl, FACE AUTH Capture PID.
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

# POST /pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid

## In plain words

[PMJAY](../glossary/pmjay.md) requires proof that the beneficiary is physically present at the hospital. The hospital proves it by authenticating the beneficiary against their [ABHA](../../shared/glossary/abha.md), by fingerprint, iris or face. In face authentication the capture happens on the patient's phone, out of your system's sight. This call tells you whether it has finished. You poll it between showing the QR code and calling face verify.

These are plain JSON calls: no JWE envelope and no callback.

## Before you start

- A session token for the `Authorization` header, not `bearer_auth`. See [the session token](../concepts/session-token.md).
- A `txnId` from [face auth init](abha-biometric-faceauth-init.md), shown to the patient as a QR code.

## What happens

Your system calls the ABDM proxy host with the `txnId`, repeatedly, until the capture is complete.

```bash
curl --location --request POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/abdmproxy/abha/biometric/capture/pid' \
  --header 'Accept: application/json' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --header 'REQUEST-ID: <NEW_UUID_FOR_THIS_CALL>' \
  --header 'TIMESTAMP: <CURRENT_UTC_ISO_TIMESTAMP>' \
  --data-raw '{
    "txnId": "<TXN_ID_FROM_FACEAUTH_INIT>"
  }'
```

`REQUEST-ID` is a new UUID for every call ([REQUEST-ID](../../shared/glossary/request-id.md)). `TIMESTAMP` is the current time in UTC, ISO 8601 with milliseconds and a trailing `Z` ([TIMESTAMP](../../shared/glossary/timestamp-header.md)).

**Retrying.** The call only reads the capture state, so repeat it freely. Give each attempt a new `REQUEST-ID`.

## How you know it worked

Before the patient finishes, you receive:

```json
{
  "status": "PENDING",
  "message": "Awaiting PID capture"
}
```

After the face scan, you receive:

```json
{
  "status": "COMPLETE",
  "message": "PID capture successful"
}
```

The step is done when `status` is `COMPLETE`. Call [face verify](abha-biometric-v2-auth-verify.md) next.

## When it goes wrong

- The status stays `PENDING`: the patient has not scanned the code or not finished the scan. Ask them to complete it in the ABHA app.
- Face verify is called before `COMPLETE`. Wait for `COMPLETE` first.
- The call goes to the fingerprint host. Use the ABDM proxy host.
