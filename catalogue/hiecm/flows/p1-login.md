---
id: hiecm.flow.p1-login
type: flow
gateway: hiecm
milestone: P1
version: abdm-v3
title: Sign a user in to a PHR application
summary: >
  Let a person into their own health application by any of the four
  routes ABDM requires, and hold the session afterwards.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-p1.yaml
    fetched: 2026-09-04
    hash: sha256:ab9c68dd1c867b1701629f73abb6357888c450c26e539cd40abe16a9dacd2bbf
    note: >
      NHA's P1 file as ingested on this branch.
  - file: site/docs/hiecm/v3/milestones/p1.mdx
    fetched: 2026-09-04
    status: not-yet-hashed
    note: >
      The P1 milestone page. The four routes, the auth mode rule and the
      60 second resend rule come from here.
verified:
  status: unverified
  against: docs-only
related:
  flows:
    - hiecm.flow.p1-create-abha-address
  concepts:
    - hiecm.concept.abha-number-and-address
    - hiecm.concept.gateway-session
  glossary:
    - shared.glossary.abha-address
    - shared.glossary.abha-number
    - shared.glossary.auth-modes
    - shared.glossary.otp
    - shared.glossary.phr
skills:
  - hiecm-p1-build
---

## In plain words

A person signs in to their [PHR](../../shared/glossary/phr.md)
application in one of four ways, and all four are mandatory. Which
credential they present decides how they are checked, and one of the four
also asks them which identity they are signing in as.

## Before you start

Four things must already be true, each checkable:

- The person holds an [ABHA address](../../shared/glossary/abha-address.md).
  See [create an ABHA address](p1-create-abha-address.md).
- You hold a gateway session token. See
  [the gateway session](../concepts/gateway-session.md).
- You can store a refresh token securely, and you have a sign out that
  clears it.
- Your application supports more than one user profile per install, with
  sign in and sign out between them.

## What happens

The four routes, and what checks each:

| Route | Checked by |
|---|---|
| Mobile number | Mobile OTP, then the user picks which linked ABHA address to sign in as |
| An address such as `name@abdm` | Password, mobile OTP or Aadhaar OTP, by [auth mode](../../shared/glossary/auth-modes.md) |
| The default `14digit@abdm` address | Mobile OTP or Aadhaar OTP |
| The 14 digit [ABHA number](../../shared/glossary/abha-number.md) | Mobile OTP or Aadhaar OTP |

1. **Take the credential and pick the check.** For an address, the auth
   mode decides between password, mobile OTP and Aadhaar OTP. Do not
   assume one mode: read the modes the address supports.
2. **Verify.** Resend unlocks after 60 seconds in every flow, so the
   screen has to say when.
3. **Resolve which identity is signing in.** One mobile number can carry
   several ABHA addresses. On the mobile number route the user chooses.
4. **Hold the session.** Store the refresh token securely.

A reset password screen belongs behind login, reachable by someone who
cannot get in.

## How you know it worked

The application holds a session for one named ABHA address, and the
profile screen shows that address rather than a chooser. Signing out and
back in returns the user to the same address without repeating the
choice, which is what proves the session was stored rather than held in
memory.

## When it goes wrong

The failures these sources document, in rough order of frequency:

- The wrong auth mode offered for an address, so the user is asked for a
  password they never set. Read the modes rather than defaulting.
- A mobile number carrying several addresses and no chooser shown, which
  signs the person in as the wrong one of their own identities.
- An expired OTP where the screen offered resend before the 60 seconds
  were up, or did not say the wait was deliberate.
