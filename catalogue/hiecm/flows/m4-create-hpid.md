---
id: hiecm.flow.m4-create-hpid
type: flow
gateway: hiecm
milestone: M4
version: abdm-v3
title: Get a healthcare professional an HPID
summary: Take a healthcare professional through Aadhaar authentication and
  mobile verification until the registry issues an HP-ID.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/m4.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/milestones/m4.mdx#m4-create-hpid. Edit
      the page, never this file.
related:
  endpoints:
    - hiecm.endpoint.m4-hpr-demographic-auth-mobile
    - hiecm.endpoint.m4-hpr-create-hprid
  flows:
    - hiecm.flow.m4-register-professional
    - hiecm.flow.m4-onboard-facility
  concepts:
    - hiecm.concept.gateway-session
    - hiecm.concept.input-encryption
  glossary:
    - shared.glossary.hpr
    - shared.glossary.hpid
    - shared.glossary.otp
    - shared.glossary.txn-id
---

# Get a healthcare professional an HPID

## In plain words

### Aadhaar authentication

The professional authenticates using Aadhaar. The integrating system does not handle the Aadhaar number or [OTP](/docs/hiecm/v3/getting-started/glossary#otp). Instead, it handles the transaction ID and redirects the user to the URL returned by the HPR service.

The URL is valid for five minutes. If it expires before authentication is completed, call Generate Aadhaar Link again to obtain a new authentication URL. After authentication the professional selects the role to register for: HPR, HFR, or both.

```mermaid
sequenceDiagram
    autonumber
    actor P as Professional
    participant S as Your system
    participant H as HPR service
    Note over S: Base URL https://apihspsbx.abdm.gov.in/v4/int,<br/>with Authorization Bearer from POST /api/hiecm/gateway/v3/sessions
    S->>H: POST /aadhaar/generateLink<br/>scopes, source
    H-->>S: txnId, redirect URL (valid five minutes)
    S->>P: Redirect to the hosted Aadhaar page
    P->>H: Enters the Aadhaar number, verifies the Aadhaar OTP
    loop Until authenticated or the URL expires
        S->>H: POST /aadhaar/isAuthenticated<br/>txnId
        H-->>S: true or false
    end
    S->>H: POST /v2/registration/aadhaar/verifyOTP<br/>txnId
    H-->>S: name, gender, birthdate, photo,<br/>mobileNumber (masked), pincode
    S->>H: POST /v1/registration/aadhaar/checkHpIdAccountExist<br/>txnId
    H-->>S: hprIdNumber and token if an HP-ID exists, else none
```

### Login using Mobile number and OTP or credentials

If an HP-ID already exists, the professional is already registered. The system should authenticate the professional and proceed directly to login, skipping the HP-ID creation journey.

A returning professional can also log in without Aadhaar authentication using either a Mobile OTP, or a Password. Both login mechanisms are covered under the M4 Operations and Fields: see [HPR authentication](/docs/hiecm/v3/api/m4/endpoints/m4-authentication/01-m4-post-v1-auth-authpassword) in the M4 API reference.

If no HP-ID exists, the mobile number must be verified before creating the HP-ID.

1. Fetch the public certificate from `/v4/int/api/v1/auth/cert`.
2. Encrypt the mobile number using `RSA/ECB/PKCS1Padding`.
3. Send the encrypted value in the API request.

```mermaid
sequenceDiagram
    autonumber
    participant S as Your system
    participant H as HPR service
    alt An HP-ID exists for this Aadhaar
        S->>H: POST /api/v1/auth/authPassword, or<br/>POST /api/v2/auth/loginViaMobileSendOTP
        H-->>S: Token, the professional is logged in
    else No HP-ID yet
        S->>H: POST /v2/registration/aadhaar/demographicAuthViaMobile<br/>txnId, mobileNumber (encrypted with the key<br/>from GET /api/v1/auth/cert)
        H-->>S: verified true or false
        opt verified is false
            S->>H: POST /v1/registration/aadhaar/generateMobileOTP<br/>mobile, txnId
            H-->>S: txnId, OTP sent
            S->>H: POST /v1/registration/aadhaar/verifyMobileOTP<br/>otp, txnId
            H-->>S: Mobile number verified
        end
        S->>H: POST /v1/registration/aadhaar/hpid/suggestion<br/>txnId
        H-->>S: Suggested HP-IDs
        S->>H: POST /v2/registration/aadhaar/createHprIdWithPreVerified<br/>txnId, idType hpr_id, domainName, email,<br/>name, password
        H-->>S: HP-ID created, hprToken
        S->>H: POST /profile/updateRole<br/>hprId, category and sub-category:<br/>the role, HPR, HFR or Both
        H-->>S: Role recorded. HPR continues in Journey 2,<br/>HFR in Journey 3, Both does HFR then HPR
    end
```

Create HPID returns a `token`. The register professional call carries an `hprToken` in its payload.

## Before you start

A gateway session token for `Authorization`, a way to redirect the professional to a URL and bring them back, and the HPR certificate from `/v4/int/api/v1/auth/cert`. Mobile numbers and passwords here are encrypted with `RSA/ECB/PKCS1Padding` under that certificate, not with the M1 key and padding.

## What happens

Generate the Aadhaar link and redirect to its URL. `/aadhaar/isAuthenticated` answers a bare `true` or `false`, not an object. Verify, then check whether an HP-ID already exists for the Aadhaar and stop there if it does. Match the mobile with `/v2/registration/aadhaar/demographicAuthViaMobile`; when `verified` is false, verify it by OTP. Take a suggestion and create the HP-ID. Keep the token it returns for the next journeys.

## How you know it worked

The create call returns the HP-ID and a token, and checking the same Aadhaar again returns that HP-ID rather than none. An HP-ID is an identity, not a professional profile: Journey 2 creates the profile.

## When it goes wrong

The redirect URL is valid for five minutes, so a slow professional needs a fresh link rather than a retry. An existing HP-ID for the Aadhaar means login, not creation. A client that parses the status poll as an object fails on the bare boolean.
