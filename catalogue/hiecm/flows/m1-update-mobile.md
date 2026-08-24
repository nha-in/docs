---
id: hiecm.flow.m1-update-mobile
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Change the mobile number or email on an ABHA profile
summary: >
  Raise an OTP scoped to the change, verify it, and the profile is
  updated only then.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      NHA's own M1 collection. The step order in this flow is the order of
      the requests in NHA's folder for it.
verified:
  status: unverified
related:
  endpoints: [hiecm.endpoint.m1-profile-request-otp, hiecm.endpoint.m1-profile-verify-otp, hiecm.endpoint.m1-profile-get-account]
  flows: [hiecm.flow.m1-login-by-mobile]
  errors: [hiecm.error.abdm-2401]
skills:
  - hiecm-m1-build
---

# Change the mobile number or email on an ABHA profile

## In plain words

Changing a mobile number or an email address is not a profile edit. ABDM
verifies the new value before accepting it, so it is a two call flow with
an OTP in the middle.

The same pair handles email, and setting a password, by changing the
scope.

## Before you start

- The person logged in, so you hold their `X-token`. See
  [log somebody in](m1-login-by-mobile.md).
- The new value, encrypted.
- The person present, holding the new number, because the OTP goes there.

## What happens

```mermaid
sequenceDiagram
  participant P as Person
  participant You as Your application
  participant ABHA as ABHA service
  You->>ABHA: POST /v3/profile/account/request/otp
  Note right of You: scope abha-profile plus mobile-verify
  ABHA-->>You: txnId
  ABHA->>P: OTP to the new number
  P->>You: reads out the OTP
  You->>ABHA: POST /v3/profile/account/verify
  ABHA-->>You: updated profile
```

The `scope` array names both the area and the action, for example
`["abha-profile", "mobile-verify"]`. Send the same scope on both calls.
For email, the second element becomes `email-verify`.

## How you know it worked

Read the profile back and confirm the new value is present and marked
verified.

A successful verify response is not sufficient on its own. The profile
read is what proves the change persisted against the account you meant.

## When it goes wrong

The OTP goes to the old number. It does not: it goes to the new one,
which is the point. If the person cannot receive it, the change cannot
proceed.

The scopes do not match between the two calls, and the verify is
refused. Send the array you sent on the request.

The person is not logged in and the call is refused. See
[ABDM-2401](../errors/abdm-2401.md).

