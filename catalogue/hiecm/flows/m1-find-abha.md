---
id: hiecm.flow.m1-find-abha
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Find somebody's ABHA when they do not know it
summary: Search for a forgotten ABHA by mobile number, then confirm with an OTP
  so the person proves the account is theirs.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m1.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/m1.mdx#m1-find-abha. Edit the
      page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m1-find-abha-search
    - hiecm.endpoint.m1-login-request-otp
    - hiecm.endpoint.m1-login-verify
  decisions:
    - hiecm.decision.encrypt-locally
  concepts:
    - hiecm.concept.encrypted-identifiers
---

# Find somebody's ABHA when they do not know it

## In plain words

This workflow enables discovery of an existing ABHA using a registered mobile
number when an individual does not readily know their ABHA details. Upon
successful verification of the mobile number, the system may return limited,
non-sensitive information such as the individual's name, gender, and masked
ABHA number, allowing confirmation of whether an ABHA has already been created.

```mermaid
sequenceDiagram
    autonumber
    actor P as Person
    participant S as Your system
    participant A as ABHA service
    P->>S: Mobile number
    S->>S: Encrypts the mobile number with the public key
    S->>A: POST /abha/api/v3/profile/account/abha/search<br/>scope [search-abha], mobile (encrypted)
    A-->>S: txnId, ABHA list (masked ABHA number, name, gender)
    P->>S: Confirms the account to prove
    S->>A: POST /abha/api/v3/profile/login/request/otp<br/>scope [abha-login, search-abha, mobile-verify],<br/>loginHint index, loginId (encrypted index),<br/>otpSystem abdm, txnId
    A-->>S: txnId
    A-)P: OTP by SMS to the registered mobile
    P->>S: OTP
    S->>A: POST /abha/api/v3/profile/login/verify<br/>scope [abha-login, mobile-verify],<br/>authData.authMethods [otp], otp {txnId,<br/>otpValue (encrypted)}
    A-->>S: authResult success, token (X-token), accounts
```

Access to complete profile information and sensitive account details requires
successful authentication through approved mechanisms such as OTP, biometric
authentication, or face authentication. All identifiers and personal
information must be encrypted and processed within the integrating system in
accordance with ABDM security, privacy, and data protection requirements. See
[encryption](/docs/hiecm/v3/concepts/encryption) for how to do it locally.

## Before you start

A gateway access token, the mobile number the person remembers, encrypted with the M1 certificate, and the person present to read the OTP.

## What happens

Search with scope `search-abha`. The response carries a `txnId` and the accounts on that mobile, each with an `index`, a masked ABHA number, name and gender. Show those and let the person pick. Request the OTP with `loginHint` set to `index`, the encrypted index as `loginId` and the same `txnId`, then verify it.

## How you know it worked

Verification succeeds and returns the account the person recognised from the masked details.

## When it goes wrong

The search finds nothing: the number may hold no ABHA, or the ABHA may sit in the other environment. The person does not recognise any account: stop, because continuing would disclose somebody else's. Never skip the OTP because the search already returned an account: search alone is a lookup of somebody's identity.
