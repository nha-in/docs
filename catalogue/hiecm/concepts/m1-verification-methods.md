---
id: hiecm.concept.m1-verification-methods
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: The ways to verify an ABHA in M1, and which are mandatory
summary: >
  M1 tests six ways for a facility to confirm a person's ABHA and fetch their
  profile. Four must be built by everyone, and two are optional.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/resources/test-cases/m1.mdx
    fetched: 2026-10-03
    hash: sha256:fdd3108172af89bdc4861734e2c59d84882ed3d6cf52a4059c2c2d7c7c7729f3
    note: >
      site/docs/hiecm/v3/resources/test-cases/m1.mdx. The ABHA Verification
      sections, test cases VRFY_ABHA_101 to VRFY_ABHA_502 and the QR code case.
related:
  concepts:
    - hiecm.concept.m1-identifier-and-auth-method
  flows:
    - hiecm.flow.m1-login-by-mobile
    - hiecm.flow.m1-find-abha
  endpoints:
    - hiecm.endpoint.m1-login-request-otp
---

## In plain words

Verifying an ABHA means confirming that the person at your desk owns the
ABHA they gave you, and then fetching their profile into your system. M1's
functional test cases cover six ways to do it. The first four are mandatory
for every integrator. The last two are optional.

| Way | What the person gives | How they prove it | Test cases | Required |
|---|---|---|---|---|
| Aadhaar OTP | ABHA number or ABHA address | OTP sent to the mobile number linked to their Aadhaar | VRFY_ABHA_101, VRFY_ABHA_102 | Mandatory |
| Mobile OTP | ABHA number or ABHA address | OTP sent to the mobile number linked to their ABHA | VRFY_ABHA_201, VRFY_ABHA_202 | Mandatory |
| Mobile number | Their mobile number | OTP sent to that number, then they pick one ABHA from the list linked to it | VRFY_ABHA_301 to VRFY_ABHA_305 | Mandatory |
| Aadhaar number | Their Aadhaar number | OTP sent to the mobile number linked to their Aadhaar | VRFY_ABHA_401 to VRFY_ABHA_405 | Mandatory |
| Aadhaar biometric | ABHA number or ABHA address | A fingerprint scan | VRFY_ABHA_501, VRFY_ABHA_502 | Optional, for government entities |
| ABHA QR code | The QR code on their ABHA card or app | Your system scans the code and reads the profile from it | Reading ABHA Profile Info using ABHA QR Code | Optional |

The first two rows are each tested twice: once starting from an ABHA number
and once starting from an ABHA address. The two starting points use different
calls.

- Starting from an ABHA number, a mobile number or an Aadhaar number, request
  the OTP with `POST /abha/api/v3/profile/login/request/otp` and verify it
  with `POST /abha/api/v3/profile/login/verify`. A mobile number can have
  several ABHAs, so the person then picks one with
  `POST /abha/api/v3/profile/login/verify/user`. Read the profile from
  `GET /abha/api/v3/profile/account`.
- Starting from an ABHA address, search with
  `POST /abha/api/v3/phr/web/login/abha/search`, request the OTP with
  `POST /abha/api/v3/phr/web/login/abha/request/otp`, verify it with
  `POST /abha/api/v3/phr/web/login/abha/verify`, and read the profile from
  `GET /abha/api/v3/phr/web/login/profile/abha-profile`.

What every OTP route must do, whichever one it is:

- A correct OTP completes the verification and your system fetches the
  profile: name, date of birth, gender, mobile number, photo, address, ABHA
  number and ABHA address.
- A wrong OTP fails the verification and your screen says so.
- Resend OTP may be offered at most twice, 60 seconds after the OTP was not
  received.
- Name, date of birth and gender are shown and cannot be edited. Address,
  email, mobile number, state and district can be.
- The verified details are saved in your system against your own patient ID.

When no ABHA is found for the mobile number or the Aadhaar number, your
screen says so and offers to create one.

You have understood this when you can say which four routes your system must
pass, and whether it starts from an ABHA number or an ABHA address.

## Questions this answers

- How many login methods are there in M1 Verification flow?
- What are the ways to verify an ABHA in M1?
- Which ABHA verification methods are mandatory?
- Is biometric verification mandatory in M1?
- How do I verify an ABHA address with OTP?
- What happens when no ABHA is linked to the mobile number?
