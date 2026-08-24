---
id: hiecm.flow.m1-create-abha-by-document
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create an ABHA from an identity document
summary: >
  The route for someone who cannot complete Aadhaar authentication at
  all, using a document such as a driving licence.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      NHA's own M1 collection. The step order in this flow is the order of
      the requests in NHA's folder for it.
verified:
  status: unverified
related:
  endpoints: [hiecm.endpoint.m1-enrolment-request-otp, hiecm.endpoint.m1-enrolment-verify-abdm-otp, hiecm.endpoint.m1-enrolment-by-document, hiecm.endpoint.m1-profile-get-account, hiecm.endpoint.m1-profile-get-qr-code]
skills:
  - hiecm-m1-build
---

# Create an ABHA from an identity document

## In plain words

When neither an Aadhaar OTP nor a biometric capture is possible, NHA
allows enrolment from an identity document. NHA's collection uses a
driving licence.

The account this produces is restricted until it is upgraded through
Aadhaar KYC. Say so to the person rather than letting them find out when
something fails.

## Before you start

- A working session token.
- The person's mobile number, and the person present to read an OTP.
- The document details.

## What happens

```mermaid
sequenceDiagram
  participant P as Person
  participant You as Your application
  participant ABHA as ABHA service
  You->>ABHA: POST /v3/enrollment/request/otp
  ABHA->>P: OTP by SMS
  P->>You: reads out the OTP
  You->>ABHA: POST /v3/enrollment/auth/byAbdm
  You->>ABHA: POST /v3/enrollment/enrol/byDocument
  ABHA-->>You: ABHA number, restricted
  You->>ABHA: GET /v3/profile/account
  You->>ABHA: GET /v3/profile/account/qrCode
```

NHA's collection ends this flow by reading the profile and fetching the
QR code, which is a reasonable way to show the person what they now have.

## How you know it worked

The profile read returns an account, and the QR code call returns an
image.

Because the account is restricted, also confirm what it cannot yet do
before telling the person they are finished.

## When it goes wrong

The person expects full functionality. A document based account is
restricted, and the limits appear later as unexplained refusals unless
you say so at creation.

The document is not accepted. NHA's collection only exercises a driving
licence, so treat other document types as unproven until you have run
them.

