---
id: nhcx.decision.biometric-modality
type: decision
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Fingerprint, iris or face authentication
summary: >-
  Build all three ways of proving the patient is present, and let the desk use whichever
  one the patient can complete.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Fingerprint/IRIS APIs and Face-Auth API curl.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Section 26 Q9-Q13; Section 27 Q1-Q4; Q10 K-547.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, PAYR-1256.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.biometric-authentication
  flows:
  - nhcx.flow.biometric-fingerprint-iris
  - nhcx.flow.biometric-face
  endpoints:
  - nhcx.endpoint.abha-biometric-auth-init
  - nhcx.endpoint.abha-biometric-auth-verify
  - nhcx.endpoint.abha-biometric-auth-refresh-token
  - nhcx.endpoint.abha-biometric-faceauth-init
  - nhcx.endpoint.abha-biometric-capture-pid
  - nhcx.endpoint.abha-biometric-v2-auth-verify
  errors:
  - nhcx.error.payr-1256
  - nhcx.error.payr-1272
  - nhcx.error.payr-1363
  - nhcx.error.payr-1366
  - nhcx.error.payr-1367
  - nhcx.error.payr-1369
  glossary:
  - nhcx.glossary.rd-service
  - nhcx.glossary.pid-block
  - nhcx.glossary.pmjay
  - shared.glossary.abha
  - shared.glossary.kyc
---

# Fingerprint, iris or face authentication

## In plain words

[PMJAY](../glossary/pmjay.md) requires proof that the beneficiary is at the hospital. You capture it by fingerprint, iris or face at registration, preauthorisation and discharge.

Build all three modalities: PMJAY integration requires it. At the desk, use fingerprint or iris where you have a scanner, and face on a phone where you do not.

## Before you start

- The beneficiary's [ABHA](../../shared/glossary/abha.md) is linked to their PMJAY card. Others follow the scheme's alternate [KYC](../../shared/glossary/kyc.md) process.
- You hold a session token. See [the session token every NHCX call carries](../concepts/session-token.md).
- You have read [biometric authentication of the beneficiary](../concepts/biometric-authentication.md).

## What happens

| | Fingerprint | Iris | Face |
|---|---|---|---|
| Hardware | Fingerprint scanner at the desk | Iris scanner at the desk | A phone with the ABHA app and the Aadhaar [RD Service](../glossary/rd-service.md) app |
| Calls | [`auth/init`](../endpoints/abha-biometric-auth-init.md), then [`auth/verify`](../endpoints/abha-biometric-auth-verify.md) | The same two calls | [`faceauth/init`](../endpoints/abha-biometric-faceauth-init.md), [`capture/pid`](../endpoints/abha-biometric-capture-pid.md) until `COMPLETE`, then [`v2/auth/verify`](../endpoints/abha-biometric-v2-auth-verify.md) |
| `authMode` | `FINGERPRINT` | `IRIS` | `FACE_AUTH` |
| Captured value you send | [`fingerPrintAuthPid`](../glossary/pid-block.md) | `irisAuthPid` | None. You send the Aadhaar number, RSA encrypted, and the mobile number |
| Result | A user token valid 1800 seconds and a refresh token valid 1296000 seconds | The same | The same |

Rules that hold for every modality:

- Preauthorisation and claim may use different modalities.
- Set the `process` header to `Preauth` or `Discharge`. Every cycle of a cyclic procedure uses `Discharge`.
- A refresh token keeps a session alive without a new capture, except for cyclic procedures. Every cycle needs a live capture, in any modality.
- Where no capture is possible, send the Authentication Consent Questionnaire response instead. This fallback is not allowed for cyclic procedures.

The default is all three built, with the operator choosing per patient. A scanner capture needs no phone. Face needs no scanner. When one modality fails on a patient, the next is a new init call away.

## How you know it worked

- Fingerprint or iris: `auth/verify` returns `authResult` `success` with `token` and `refreshToken`.
- Face: `capture/pid` moves from `PENDING` to `COMPLETE`, and `v2/auth/verify` returns tokens.
- The preauthorisation or claim that carries the token is not refused with `PAYR-1272` or `PAYR-1366`.
- Your desk completes all three modalities in the sandbox.

## When it goes wrong

Switching modality is per capture: start a new init with the other `authMode`. Nothing is registered, so you can add a modality after go-live. PMJAY integration still needs all three.

- `PAYR-1272` or `PAYR-1366`: the user token is invalid or has expired. Capture again. See [PAYR-1272](../errors/payr-1272.md) and [PAYR-1366](../errors/payr-1366.md).
- `PAYR-1256` or `PAYR-1363`: no biometric and no consent questionnaire at preauthorisation or discharge. See [PAYR-1256](../errors/payr-1256.md) and [PAYR-1363](../errors/payr-1363.md).
- `PAYR-1367` or `PAYR-1369`: a cycle has no capture for its date, or two captures share one date. See [PAYR-1367](../errors/payr-1367.md) and [PAYR-1369](../errors/payr-1369.md).
- Fingerprint capture fails with `K-547`: build the `wadh` value with `lr` set to `Y`. See [authenticate a beneficiary by fingerprint or iris](../flows/biometric-fingerprint-iris.md).
