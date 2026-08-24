---
id: hiecm.flow.m1-login-by-mobile
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Log somebody in to their existing ABHA
summary: >
  Send an OTP to a mobile number, verify it, and get the user scoped
  token that profile calls need.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      NHA's own M1 collection. The step order in this flow is the order of
      the requests in NHA's folder for it.
verified:
  status: unverified
related:
  endpoints: [hiecm.endpoint.m1-login-request-otp, hiecm.endpoint.m1-login-verify, hiecm.endpoint.m1-login-select-account]
  errors: [hiecm.error.abdm-2401, hiecm.error.900900]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Log somebody in to their existing ABHA

## In plain words

Logging in is how you get the `X-token` that identifies one person. Every
profile call needs it, and it is not the same as your application's
session token.

One mobile number can carry several ABHA accounts, which is common in a
family, so the flow has a branch.

## Before you start

- A working session token.
- The person's mobile number, encrypted. See
  [why identifiers are encrypted](../concepts/encrypted-identifiers.md).
- The person present to read an OTP.

## What happens

```mermaid
sequenceDiagram
  participant P as Person
  participant You as Your application
  participant ABHA as ABHA service
  You->>ABHA: POST /v3/profile/login/request/otp
  ABHA-->>You: txnId
  ABHA->>P: OTP by SMS
  P->>You: reads out the OTP
  You->>ABHA: POST /v3/profile/login/verify
  alt one account on this mobile
    ABHA-->>You: X-token
  else several accounts
    ABHA-->>You: list of accounts
    P->>You: picks one
    You->>ABHA: POST /v3/profile/login/verify/user
    ABHA-->>You: X-token
  end
```

Handle the branch from the start. An integration that assumes one account
works in testing, where the tester has one, and fails for real families.

## How you know it worked

You hold an `X-token`, and a profile read with it returns the account the
person expected.

The token read back is the check, not the presence of a token. A token
for the wrong account in a multi account household is the failure this
flow exists to prevent.

## When it goes wrong

The verify call returns a list rather than a token. That is the multi
account branch, not an error.

The token is rejected on the next call. See
[ABDM-2401](../errors/abdm-2401.md), and check you are not sending the
application session token in `X-token`.

Login fails with an authentication error and nothing more specific. See
[900900](../errors/900900.md).

