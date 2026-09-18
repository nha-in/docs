---
id: hiecm.endpoint.p1-login-request-otp
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Send the OTP that starts a login
summary: >
  Starts a sign in by sending a one time code, whichever of the four routes the person is using.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.11. The path, the method, the
      request body and the error scenarios below are transcribed from it.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The mobile-number hint, the PHR key, and the web path refusing the mobile hint. Observed by an integrator on 2026-09-16; the ABDM-1006 body shape is in catalogue/verification/hiecm.endpoint.p1-login-request-otp.json, run 2026-09-17.
related:
  flows: [hiecm.flow.p1-login, hiecm.flow.m1-login-phr-by-mobile]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.two-public-keys]
  errors: [hiecm.error.abdm-1006, hiecm.error.abdm-9999]
skills:
  - hiecm-p1-build
---

# Send the OTP that starts a login

## In plain words

One endpoint serves all four login routes. The `scope` and the login hint say which route this is.

Two rules for the mobile route. The hint is `mobile-number`; the value `mobile` is refused with `ABDM-9999 Invalid Login Hint`. The mobile number is encrypted with the 2048-bit PHR key from `/v3/phr/app/login/public/certificate`, not the profile key; the profile key produces `ABDM-1006 Invalid mobile number`, which reads as a bad number and is a wrong key. See [the two public keys](hiecm.concept.two-public-keys).

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The credential the person presented, encrypted, and the route it belongs to.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/request/otp' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "scope": [ "abha-address-login", "mobile-verify" ], "loginHint": "mobile-number", "loginId": "*{{encrypted mobile-number}}*", "otpSystem": "abdm" }'
```

The sandbox host for the PHR calls is `https://abhasbx.abdm.gov.in`;
production is `https://apis.abdm.gov.in/phr/api/phr/app/v3`. This is the
only path that lists every address on a mobile: the `/v3/phr/web/login/abha`
variant with the same hint answers `ABDM-9999 User not found`.

## How you know it worked

The response carries a `txnId` and names the masked destination the code went to.

NHA's document gives this response:

```json
{ "txnId": "b81a963d-\*\*\*-48b4-\*\*\*\*-acf9f23cfab7", "message": "OTP is sent to Mobile number ending with \*\*\*\*\*\*2425" }
```

## When it goes wrong

The error scenarios recorded against this call: [ABDM-1006](hiecm.error.abdm-1006), [ABDM-9999](hiecm.error.abdm-9999). `Invalid Login Hint` means the hint was `mobile`; `Invalid mobile number` on a number you know is right means the wrong RSA key. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
