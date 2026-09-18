---
id: nhcx.concept.biometric-authentication
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Biometric authentication of the beneficiary
summary: >-
  Under the government health assurance scheme a hospital proves the patient is
  present by fingerprint, iris or face scan, and carries the resulting token or
  a signed exemption into preauthorisation and claim.
sources:
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: 'Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Whole document: policy table, Fingerprint/IRIS APIs, Face-Auth API curl.'
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Section 26 Cyclic Procedure Q2-Q13; Section 27 Q4; Q10 K-547.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 8.2 Biometric Authentication, pages 18-19.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, PAYR-1256 and PAYR-1366 messages.
related:
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
  decisions:
  - nhcx.decision.biometric-modality
  errors:
  - nhcx.error.payr-1256
  - nhcx.error.payr-1271
  - nhcx.error.payr-1272
  - nhcx.error.payr-1363
  - nhcx.error.payr-1364
  - nhcx.error.payr-1366
  - nhcx.error.payr-1367
  - nhcx.error.payr-1369
  glossary:
  - nhcx.glossary.rd-service
  - nhcx.glossary.pid-block
  - shared.glossary.abha-number
  - shared.glossary.auth-modes
  - shared.glossary.kyc
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.beneficiary-consent
---

# Biometric authentication of the beneficiary

## In plain words

PMJAY pays only for patients who were really at the hospital. So the hospital proves it: the patient places a finger on a scanner, looks into an iris camera, or has their face scanned on a phone. The scan is checked against Aadhaar through the ABHA biometric service.

A successful check gives the hospital a user token. The hospital carries that token, or a signed exemption, into the preauthorisation and the claim.

## Before you start

The patient's [ABHA number](../../shared/glossary/abha-number.md) must be linked to their PMJAY card. For patients without that link, the scheme's other [KYC](../../shared/glossary/kyc.md) procedures apply. Fingerprint and iris need a registered device with its [RD service](../glossary/rd-service.md) on the hospital computer.

## What happens

### When to authenticate

| Moment | `process` header |
|---|---|
| Patient registration and preauthorisation | `Preauth` |
| Every cycle of a cyclic treatment, such as dialysis | `Discharge` |
| Discharge, before the claim | `Discharge` |

Biometric authentication is not an NHCX use case call. The hospital system calls the ABHA biometric service directly, sending the payer's participant code in `payerid`.

### The three modalities

| Modality | `authMode` | `scope` | Evidence sent |
|---|---|---|---|
| Fingerprint | `FINGERPRINT` | `abha-login`, `aadhaar-bio-verify` | The device's [PID block](../glossary/pid-block.md) in `fingerPrintAuthPid` |
| Iris | `IRIS` | `abha-login`, `aadhaar-iris-verify` | The PID block in `irisAuthPid` |
| Face | `FACE_AUTH` | from the face auth init call | A phone scan through the ABHA app, then the Aadhaar number, RSA encrypted |

Fingerprint and iris take two calls: init returns a `txnId`, and verify sends the PID block with it. Face takes four steps: init, show a QR code for the patient's phone, poll `capture/pid` until it returns `COMPLETE`, then verify. Which to use is covered in [choosing a modality](../decisions/biometric-modality.md). A PMJAY integration must support all three.

### The tokens

```mermaid
graph LR
  S["Successful scan"] --> UT["User token<br/>30 minutes"]
  S --> RT["Refresh token<br/>15 days"]
  RT -->|refresh call| UT2["New user token<br/>+ new refresh token"]
```

Refresh at least once every 10 days to keep a long stay covered without scanning again. A cyclic treatment cycle is the exception: every cycle needs a live scan, never a refresh, and two cycles of the same procedure need 24 hours between them.

The request header that carries the user token on preauthorisation and claim is not yet published.

### When a scan is impossible

For trauma, amputations or unreadable biometrics, the hospital obtains an Aadhaar exemption consent document signed by the patient and a hospital representative. It stores the document, and answers the Authentication Consent Questionnaire from the insurance plan in the preauthorisation or claim instead of sending a token. Cyclic treatments cannot use this route.

## How you know it worked

You have understood this when you can answer both of these.

1. A dialysis patient came in yesterday at 18:00. Can you scan them for the next cycle at 09:00 today? Can you use the refresh token instead?
2. A patient's fingerprints cannot be read at discharge. What does your claim carry in place of the discharge token?

## When it goes wrong

**Neither token nor questionnaire.** The PMJAY payer refuses a preauthorisation with [PAYR-1256](../errors/payr-1256.md) and a claim with [PAYR-1363](../errors/payr-1363.md). A questionnaire with a blank link id fails with [PAYR-1271](../errors/payr-1271.md) or [PAYR-1364](../errors/payr-1364.md).

**Invalid or expired user token.** [PAYR-1272](../errors/payr-1272.md) at preauthorisation, [PAYR-1366](../errors/payr-1366.md) at claim. Scan again.

**Missing cycle scans.** A cycle with no scan on its date fails with [PAYR-1367](../errors/payr-1367.md). Two scans for one date fail with [PAYR-1369](../errors/payr-1369.md).

**Device error K-547 on fingerprint.** Set the `lr` attribute to `Y` when computing the WADH value.
