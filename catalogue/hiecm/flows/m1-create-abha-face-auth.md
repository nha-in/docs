---
id: hiecm.flow.m1-create-abha-face-auth
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create an ABHA using Aadhaar face authentication
summary: Create an ABHA for someone who cannot receive an Aadhaar OTP, using
  face authentication in the ABHA app.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m1.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/milestones/m1.mdx#m1-create-abha-face-auth. Edit the
      page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m1-enrolment-face-auth-init
    - hiecm.endpoint.m1-enrolment-capture-pid
    - hiecm.endpoint.m1-enrolment-by-aadhaar
    - hiecm.endpoint.m1-enrolment-address-suggestions
    - hiecm.endpoint.m1-enrolment-claim-abha-address
  flows:
    - hiecm.flow.m1-create-abha-aadhaar-otp
---

# Create an ABHA using Aadhaar face authentication

## In plain words

Individuals who are unable to use OTP-based authentication may create an ABHA
using Face Authentication. This includes situations where the mobile number
linked with Aadhaar is unavailable, inaccessible, or not in active use. It is
subject to the applicable guidelines and specifications issued by the ABDM and
the Unique Identification Authority of India (UIDAI).

Under this workflow, the beneficiary is authenticated through an authorized
Aadhaar Registered Device (RD) Service application using UIDAI-approved face
authentication mechanisms. The process is initiated by collecting the
beneficiary's Aadhaar number at the participating healthcare facility. Based on
the Aadhaar number provided, the facility generates a unique authentication QR
code.

The beneficiary is required to scan the generated QR code using the **ABHA PHR
Application**. To access the QR scanning functionality, the beneficiary should
ensure that the ABHA PHR Application is in the logged-out state, as the QR scan
option is available on the application's landing page. Upon scanning the QR
code, the beneficiary is redirected to the Aadhaar RD Service application
installed on the mobile device. In cases where the Aadhaar RD Service
application is not available on the device, the beneficiary is redirected to
the respective application marketplace (Google Play Store or Apple App Store)
for installation.

The beneficiary is then required to complete the face capture process through
the Aadhaar RD Service application. Upon successful face authentication and
verification by UIDAI, the beneficiary's identity is validated, and the ABHA
creation process is completed in accordance with ABDM guidelines.

Organizations implementing Face Authentication based ABHA creation workflows
shall ensure compliance with the latest ABDM and UIDAI specifications, approved
authentication workflows, and security requirements prior to production
deployment. The use of only authorized and compliant RD Service applications is
mandatory to maintain the integrity, privacy, and security of the
authentication process.

```mermaid
sequenceDiagram
    autonumber
    actor P as Person (ABHA app)
    participant S as Your system
    participant A as ABHA service
    S->>A: POST /abha/api/v3/enrollment/enrol/auth/init<br/>scope [abha-enrol]
    A-->>S: txnId
    S->>P: QR code carrying the txnId
    P->>P: Scans the QR code in the ABHA app<br/>Face authentication through the Aadhaar RD service
    S->>A: POST /abha/api/v3/enrollment/enrol/capturePID<br/>txnId, scope [abha-enrol]
    A-->>S: status of the face authentication
    S->>A: POST /abha/api/v3/enrollment/enrol/byAadhaar<br/>authData.authMethods [face], face {txnId,<br/>aadhaar (encrypted), mobile}, consent
    A-->>S: ABHAProfile (ABHANumber, name, dob, gender, photo),<br/>tokens.token, isNew
    Note over S,A: Optional: verify the communication mobile
    S->>A: POST /abha/api/v3/enrollment/request/otp<br/>scope [abha-enrol, mobile-verify], loginHint mobile,<br/>loginId (encrypted mobile), txnId
    A-)P: OTP by SMS to the communication mobile
    P->>S: Mobile OTP
    S->>A: POST /abha/api/v3/enrollment/auth/byAbdm<br/>scope [abha-enrol, mobile-verify],<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted)}
    A-->>S: authResult success
    S->>A: GET /abha/api/v3/enrollment/enrol/suggestion<br/>header TRANSACTION_ID txnId
    A-->>S: abhaAddressList
    S->>A: POST /abha/api/v3/enrollment/enrol/abha-address<br/>txnId, abhaAddress, preferred 1
    A-->>S: healthIdNumber, preferredAbhaAddress
```

The face authentication happens on the patient's phone, through the Aadhaar RD
Service application.

## Before you start

Everything the Aadhaar OTP journey needs, the ABHA app on the person's phone, and a screen that can show a QR code.

## What happens

Call `enrol/auth/init` for a `txnId` and show it as a QR code. Poll `capturePID` every 5 to 10 seconds: its status moves through PENDING, VERIFIED, FAILED and COMPLETE. On COMPLETE, call `enrol/byAadhaar` with the face auth method and the same `txnId`, then claim an address as in the OTP journey.

## How you know it worked

`capturePID` reports COMPLETE and `enrol/byAadhaar` returns an `ABHAProfile` with an `ABHANumber`. The capture being accepted is the event, not the app saying the scan succeeded.

## When it goes wrong

The person has no ABHA app: installing it is part of the journey, not an error. The person cannot find the scan option: it is on the app's landing page, so they must be logged out of the ABHA PHR app. The capture reports FAILED: capture again rather than resubmitting. Nothing pushes the result to you, so keep polling or continue once the person confirms.
