---
id: hiecm.flow.p1-create-abha-address
type: flow
gateway: hiecm
milestone: P1
version: abdm-v3
title: Create an ABHA address in a PHR application
summary: >
  Register a person in your own health application by mobile number or by
  an existing 14 digit health account number, and give them the address
  the rest of the network will know them by.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-p1.yaml
    fetched: 2026-09-04
    hash: sha256:ab9c68dd1c867b1701629f73abb6357888c450c26e539cd40abe16a9dacd2bbf
    note: >
      NHA's P1 file as ingested on this branch, which carries the
      operations and the 422 AS error codes.
  - file: site/docs/hiecm/v3/milestones/p1.mdx
    fetched: 2026-09-04
    status: not-yet-hashed
    note: >
      The P1 milestone page, compiled from NHA's PHR application
      document. The two creation paths, the mandatory fields and the KYC
      status rule come from here.
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document: 120 operations with their paths, request
      bodies and error scenarios. It is where the endpoint atoms this
      flow cites come from.
verified:
  status: unverified
  against: docs-only
related:
  endpoints:
    - hiecm.endpoint.p1-enrollment-request-otp
    - hiecm.endpoint.p1-enrollment-verify-otp
    - hiecm.endpoint.p1-enrollment-address-suggestion
    - hiecm.endpoint.p1-enrollment-address-exists
    - hiecm.endpoint.p1-enrollment-enrol
    - hiecm.endpoint.p1-encrypt-data-aadhaar-mobile-otp-password
    - hiecm.endpoint.p1-get-user-profile
  flows:
    - hiecm.flow.p1-login
    - hiecm.flow.p2-discover-and-link
  concepts:
    - hiecm.concept.abha-number-and-address
    - hiecm.concept.gateway-session
  glossary:
    - shared.glossary.abha
    - shared.glossary.abha-address
    - shared.glossary.abha-number
    - shared.glossary.phr
    - shared.glossary.kyc
    - shared.glossary.otp
skills:
  - hiecm-p1-build
---

## In plain words

Every person on ABDM is known by an
[ABHA address](shared.glossary.abha-address), which looks like
`username@abdm`. Consent, notifications and record sharing all hang off
it, so a person with no address cannot take part.

This is the same job [M1](shared.glossary.m1) does at a hospital
desk, done instead by the person's own
[PHR](shared.glossary.phr) application. Two paths lead to an
address, and a PHR application builds both.

## Before you start

Four things must already be true, each checkable:

- You hold a gateway session token. See
  [the gateway session](hiecm.concept.gateway-session).
- You can send and verify an [OTP](shared.glossary.otp), and
  your screens keep resend locked for 60 seconds in every flow.
- You can store a refresh token securely, because login follows
  immediately and the application holds the session from here on.
- You know which path the user is on. A mobile number produces a
  Self-Declared profile with no [KYC](shared.glossary.kyc); an
  existing 14 digit [ABHA number](shared.glossary.abha-number)
  produces a KYC Verified one.

## What happens

```mermaid
flowchart TD
    A["User picks a path"] --> B{"Mobile number, or 14 digit ABHA number?"}
    B -- "Mobile number" --> C["Verify by mobile OTP"]
    C --> D["User types first name, year of birth, gender, address, state, district, pin code"]
    B -- "ABHA number" --> E["Verify by Aadhaar OTP or mobile OTP"]
    E --> F["Profile details come back from the ABHA system"]
    D --> G["Show the ABHA addresses already linked to this mobile or number"]
    F --> G
    G --> H{"An address already exists?"}
    H -- "Yes" --> I["User picks one"]
    H -- "No" --> J["User creates a new address"]
```

1. **Take the path the user chose.** On the mobile number path, first
   name, year of birth, gender, address, state, district and pin code are
   mandatory, and the user types them. Middle name, last name, day and
   month of birth are optional. On the ABHA number path the profile comes
   back from the ABHA system rather than from the user.
2. **Validate.** Mobile OTP on the first path. Aadhaar OTP or mobile OTP
   on the second.
3. **Show what already exists before creating anything.** After
   validation, list the ABHA addresses already linked to that mobile
   number or ABHA number. A person who already has an address should pick
   it, not create a second one.
4. **Create the address only when there is none to pick.**

A Self-Declared profile needs a "Link ABHA number" action of its own. The
user enters their 14 digit number and validates by Aadhaar OTP or mobile
OTP. Profile details then follow the ABHA number and the status becomes
KYC Verified.

NHA's PHR V3 document publishes the paths for this flow on the sandbox host
`https://abhasbx.abdm.gov.in`, and the endpoint atoms above carry them with
the request bodies that document gives.

## How you know it worked

The user holds an ABHA address in the form `username@abdm`, and the
profile screen shows it marked Self-Declared or KYC Verified according to
the path they took. The ABHA number is visible only on a KYC Verified
profile.

Listing the addresses linked to that mobile number or ABHA number now
returns the address the user ended with, which is what proves the
creation landed rather than the screen merely closing.

## When it goes wrong

The failures these sources document, in rough order of frequency:

- A duplicate address, because step 3 was skipped and the user created a
  second one rather than picking the one they had.
- A mandatory demographic field missing on the mobile number path, which
  is rejected as validation. The mandatory set is narrower than it looks:
  day and month of birth are not in it.
- An expired OTP, where the user waited out the window. Resend is locked
  for 60 seconds by design, so the screen must say so rather than appear
  broken.
