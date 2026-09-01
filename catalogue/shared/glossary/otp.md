---
id: shared.glossary.otp
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: OTP, one time password
summary: >
  A short code sent to a mobile number or an email, used once to
  prove the person is present.
sources:
  - file: site/docs/_glossary/_shared.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# OTP, one time password

## In plain words

One Time Password: a short code sent to a mobile number or an email
address to prove the person holds it. ABDM uses OTPs at many points:
Aadhaar [KYC](kyc.md), mobile number verification during ABHA creation,
and login. An OTP is always paired with a transaction id from the call
that requested it.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which OTP values must be encrypted before they go in a request body.

## When it goes wrong

Sending an OTP value in the clear. Several calls require it encrypted
against NHA's public key, like the identifiers it accompanies.
