---
id: hiecm.flow.m1-login-phr-by-mobile
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: List every ABHA address on a mobile and sign one in
summary: >
  The PHR login by mobile lists every ABHA address on a number,
  including pending ones with no ABHA number, which the profile login
  does not. Request an OTP, verify it, then exchange the transfer token
  for the address the person picks.
sources:
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Section 2.3. Observed by an integrator on 2026-09-16, not yet run
      to success from this repository. The request and verify calls have
      evidence files under catalogue/verification/ from 2026-09-17
      showing the error shapes for a wrong key and a stale txnId.
related:
  endpoints:
    - hiecm.endpoint.p1-login-request-otp
    - hiecm.endpoint.p1-login-verify-otp
    - hiecm.endpoint.p1-login-verify-user
    - hiecm.endpoint.p1-get-certificate-public-key
  flows:
    - hiecm.flow.m1-login-by-mobile
    - hiecm.flow.p1-login
  concepts:
    - hiecm.concept.two-public-keys
    - hiecm.concept.encrypted-identifiers
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-1006
    - hiecm.error.abdm-9999
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.abha-number
    - shared.glossary.kyc
skills:
  - hiecm-m1-build
---

# List every ABHA address on a mobile and sign one in

## In plain words

[Log somebody in](hiecm.flow.m1-login-by-mobile) through
`/v3/profile/login` lists [ABHA numbers](shared.glossary.abha-number),
which are always [KYC](shared.glossary.kyc) verified. A person who
holds only a self declared [ABHA address](shared.glossary.abha-address)
has no number and does not appear. This flow uses the PHR login on
`/v3/phr/app/login` instead, which lists every address on the mobile,
pending ones included, and signs the person in to the one they pick.

Use it at a desk when the profile login says a number has no account
and the person insists they have one.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The mobile number encrypted with the **PHR** key from [the PHR certificate](hiecm.endpoint.p1-get-certificate-public-key), not the profile key. See [the two public keys](hiecm.concept.two-public-keys).
- The person present to read an OTP.

## What happens

```mermaid
sequenceDiagram
  participant P as Person
  participant You as Your application
  participant PHR as PHR service
  You->>PHR: POST /v3/phr/app/login/request/otp, loginHint mobile-number
  PHR-->>You: txnId
  PHR->>P: OTP by SMS
  P->>You: reads out the OTP
  You->>PHR: POST /v3/phr/app/login/verify
  PHR-->>You: users[], every address on the number, tokens.token (300 s)
  P->>You: picks an address
  You->>PHR: POST /v3/phr/app/login/verify/user, T-token Bearer tokens.token
  PHR-->>You: user token for that address
```

1. [Send the OTP](hiecm.endpoint.p1-login-request-otp) with
   `scope: ["abha-address-login", "mobile-verify"]`,
   `loginHint: "mobile-number"` and `otpSystem: "abdm"`. The hint is
   exactly `mobile-number`; `mobile` is refused with
   `ABDM-9999 Invalid Login Hint`.
2. [Verify it](hiecm.endpoint.p1-login-verify-otp). The response carries
   `users[]`, one entry per address with `abhaAddress`, `abhaNumber`
   (`null` for a self declared address), `fullName`, `kycStatus` of
   `VERIFIED` or `PENDING`, and `status`; and `tokens.token`, a 300
   second transfer token.
3. [Say which address](hiecm.endpoint.p1-login-verify-user), sending
   `T-token: Bearer <tokens.token>` with the chosen `abhaAddress` and
   the `txnId`. Without the header the call answers 401 with an empty
   body.

Only the `/phr/app/` path lists by mobile. The `/phr/web/login/abha`
variant with the same hint answers `ABDM-9999 User not found`.

## How you know it worked

The verify response lists every address on the number, pending ones
with `abhaNumber: null` included, and the final call returns a user
token for the address the person chose. A profile read with that token
returns that address.

## When it goes wrong

- `ABDM-1006 Invalid mobile number` on a number you know is right. The
  number was encrypted with the profile key. Use the PHR key. See
  [ABDM-1006](hiecm.error.abdm-1006).
- `ABDM-9999 Invalid Login Hint`. The hint was `mobile`. Send
  `mobile-number`.
- `ABDM-9999 Invalid Transaction Id` on verify. The `txnId` is not from
  a live request. Start again.
- 401 with an empty body on the final call. The `T-token` header is
  missing.
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).
