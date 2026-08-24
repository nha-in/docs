---
id: hiecm.flow.m1-create-abha-aadhaar-otp
type: flow
gateway: hiecm
milestone: M1
version: abdm-v3
title: Create an ABHA using an Aadhaar OTP
summary: >
  The mandatory enrolment route: verify the person against Aadhaar
  with an OTP, create their ABHA number, then let them choose an
  address.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      NHA's own M1 collection. The step order in this flow is the order of
      the requests in NHA's folder for it.
verified:
  status: unverified
related:
  endpoints: [hiecm.endpoint.m1-enrolment-request-otp, hiecm.endpoint.m1-enrolment-by-aadhaar, hiecm.endpoint.m1-enrolment-verify-abdm-otp, hiecm.endpoint.m1-enrolment-address-suggestions, hiecm.endpoint.m1-enrolment-claim-abha-address]
  concepts: [hiecm.concept.abha-number-and-address, hiecm.concept.encrypted-identifiers]
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-1170]
skills:
  - hiecm-m1-build
---

# Create an ABHA using an Aadhaar OTP

## In plain words

This is the route every integrator must implement. The person proves who
they are with an OTP sent to the mobile registered against their Aadhaar,
ABDM issues them a fourteen digit
[ABHA number](../../shared/glossary/abha-number.md), and then they claim
a memorable [ABHA address](../../shared/glossary/abha-address.md).

NHA marks the other enrolment routes optional. This one is not.

## Before you start

- A client id and secret, and a working session token. See
  [registration and credentials](../../shared/sandbox/registration-and-credentials.md).
- The person's Aadhaar number, encrypted against NHA's public key. See
  [why identifiers are encrypted](../concepts/encrypted-identifiers.md).
- The person present, because they must read an OTP from their phone.
- Their explicit consent to create an ABHA, which you send in the
  enrolment call.

## What happens

Eight calls in NHA's collection, of which the mobile and email
verification pairs are optional.

```mermaid
sequenceDiagram
  participant P as Person
  participant You as Your application
  participant ABHA as ABHA service
  You->>ABHA: POST /v3/enrollment/request/otp
  Note right of You: scope abha-enrol, loginHint aadhaar
  ABHA-->>You: txnId
  ABHA->>P: OTP by SMS, to the Aadhaar mobile
  P->>You: reads out the OTP
  You->>ABHA: POST /v3/enrollment/enrol/byAadhaar
  Note right of You: txnId, encrypted OTP, consent block
  ABHA-->>You: ABHA number and profile
  opt Verify a communication mobile number
    You->>ABHA: POST /v3/enrollment/request/otp
    You->>ABHA: POST /v3/enrollment/auth/byAbdm
  end
  opt Verify an email address
    You->>ABHA: POST /v3/enrollment/request/otp
    You->>ABHA: POST /v3/enrollment/auth/byAbdm
  end
  You->>ABHA: GET /v3/enrollment/enrol/suggestion
  ABHA-->>You: available addresses
  P->>You: picks one
  You->>ABHA: POST /v3/enrollment/enrol/abha-address
  ABHA-->>You: address claimed
```

Nothing here waits on a callback. Every step answers in its response,
which is what makes M1 easier than M2 and M3.

The enrolment call is the one with a permanent effect. Everything before
it can be repeated safely; that call creates an account.

## How you know it worked

The person has an ABHA number, and an address they chose rather than the
digits-based default.

Confirm it by reading the profile back and checking that the address you
claimed is present and marked preferred. Do not treat the enrolment
response alone as the end of the flow: an account with only the default
address is a half finished job the person will not recognise later.

## When it goes wrong

The OTP never arrives. The mobile registered against Aadhaar is not
necessarily the one the person is holding, and only the Aadhaar mobile
receives this OTP.

The enrolment call fails after the OTP was accepted. Do not retry it
blindly, because a retry that succeeds may enrol the person twice. Start
a fresh transaction instead.

The chosen address is refused. NHA's policy requires at least four
characters, no leading digit, and no leading or trailing dot. Validate
before submitting so the person is not guessing.

Every call fails with a header error. Check
[ABDM-2402](../errors/abdm-2402.md) and
[ABDM-2404](../errors/abdm-2404.md) before assuming the flow is wrong.

