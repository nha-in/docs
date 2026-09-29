---
id: hiecm.flow.m1-create-abha-aadhaar-otp
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create an ABHA using an Aadhaar OTP
summary: Verify a person against Aadhaar with an OTP, create their ABHA number,
  then let them choose an address.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m1.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/milestones/m1.mdx#m1-create-abha-aadhaar-otp. Edit the
      page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m1-enrolment-request-otp
    - hiecm.endpoint.m1-enrolment-by-aadhaar
    - hiecm.endpoint.m1-enrolment-verify-abdm-otp
    - hiecm.endpoint.m1-enrolment-address-suggestions
    - hiecm.endpoint.m1-enrolment-claim-abha-address
  concepts:
    - hiecm.concept.abha-number-and-address
    - hiecm.concept.encrypted-identifiers
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-1170
---

# Create an ABHA using an Aadhaar OTP

## In plain words

The individual provides their Aadhaar number. The ABHA service sends a one time
password ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)) to the mobile number registered against that Aadhaar.
Upon successful verification, the individual selects an ABHA address, and the
ABHA number is issued.

```mermaid
sequenceDiagram
    autonumber
    actor P as Person
    participant S as Your system
    participant A as ABHA service
    Note over S: Holds the gateway access token and the<br/>public key from GET /abha/api/v3/profile/public/certificate
    P->>S: Aadhaar number and consent
    S->>A: POST /abha/api/v3/enrollment/request/otp<br/>scope [abha-enrol], loginHint aadhaar,<br/>loginId (encrypted Aadhaar), otpSystem aadhaar
    A-->>S: txnId
    A-)P: OTP by SMS to the Aadhaar linked mobile
    P->>S: OTP, and the mobile number for ABHA communication
    S->>A: POST /abha/api/v3/enrollment/enrol/byAadhaar<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted), mobile}, consent
    A-->>S: ABHAProfile (ABHANumber, name, dob, gender, photo),<br/>tokens.token, isNew
    Note over S,A: Optional: verify the communication mobile
    S->>A: POST /abha/api/v3/enrollment/request/otp<br/>scope [abha-enrol, mobile-verify], loginHint mobile,<br/>loginId (encrypted mobile), txnId
    A-->>S: txnId
    A-)P: OTP by SMS to the communication mobile
    P->>S: Mobile OTP
    S->>A: POST /abha/api/v3/enrollment/auth/byAbdm<br/>scope [abha-enrol, mobile-verify],<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted)}
    A-->>S: authResult success, accounts [ABHANumber]
    S->>A: GET /abha/api/v3/enrollment/enrol/suggestion<br/>header TRANSACTION_ID txnId
    A-->>S: abhaAddressList
    P->>S: Picks or types an ABHA address
    S->>A: POST /abha/api/v3/enrollment/enrol/abha-address<br/>txnId, abhaAddress, preferred 1
    A-->>S: healthIdNumber, preferredAbhaAddress
```

Every step answers in its own response, so nothing here waits on a callback.
The enrolment call is the one with a lasting effect: it creates the account.

## Before you start

A gateway access token, the Aadhaar number encrypted with the M1 certificate, the person present to read the OTP, and their consent to create an ABHA.

## What happens

Request the OTP with scope `abha-enrol` and keep the `txnId`. Enrol with `enrol/byAadhaar`, sending the encrypted OTP, the communication mobile and the consent block. Optionally verify the communication mobile. Fetch suggestions with the `TRANSACTION_ID` header, and claim the chosen address with `preferred` set to 1.

## How you know it worked

The enrolment response carries `ABHAProfile` with an `ABHANumber`, and the address step returns the chosen address as `preferredAbhaAddress`. An account left with only its default address is a half finished job the person will not recognise later.

## When it goes wrong

The OTP goes only to the mobile registered against the Aadhaar, which may not be the phone in the room: see [the OTP never arrives](/docs/hiecm/v3/troubleshooting/otp-never-arrives). Enrolment for an Aadhaar that already has an ABHA returns that account with `isNew` false, so read `isNew` before telling the person anything was created. Every call failing the same way is a session or header problem: see [everything returns 401](/docs/hiecm/v3/troubleshooting/everything-returns-401).
