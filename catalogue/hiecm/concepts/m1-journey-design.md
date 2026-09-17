---
id: hiecm.concept.m1-journey-design
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Designing the M1 desk journey with the fewest OTPs
summary: >
  M1 carries around forty operations and no desk needs them all. Five
  yes or no questions about the deployment select the routes and the
  screens, four rules hold under every answer, and the default journey
  reaches a filled registration form with at most one OTP.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      The operations each route calls, in the order the collection records
      them.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Section 2.2, the token rule. Observed by an integrator on 2026-09-16,
      not yet run from this repository.
related:
  flows:
    - hiecm.flow.m1-login-by-mobile
    - hiecm.flow.m1-create-abha-aadhaar-otp
    - hiecm.flow.m1-create-abha-demographic-auth
    - hiecm.flow.m1-create-abha-face-auth
    - hiecm.flow.m1-login-phr-by-mobile
  endpoints:
    - hiecm.endpoint.m1-login-search
    - hiecm.endpoint.m1-login-verify
    - hiecm.endpoint.m1-login-select-account
    - hiecm.endpoint.m1-receive-patient-share
    - hiecm.endpoint.m1-enrolment-capture-pid
  concepts:
    - hiecm.concept.scan-and-share
    - hiecm.concept.two-public-keys
skills:
  - hiecm-m1-build
---

# Designing the M1 desk journey with the fewest OTPs

## In plain words

The routes ABDM offers do not change from one integrator to the next. The
deployment does. A government integrator has a route a private one does not,
a desk that already holds the mobile number needs one screen fewer, and a
registered facility with a reachable callback can take the whole journey
down to a scan. So the design starts with five questions, and builds only
what the answers select.

## Before you start

- Which of the five answers below hold for this deployment. Ask, do not
  assume: a wrong assumption here is a route built or missing for the life
  of the integration.
- The gateway session and the encryption rules from the M1 build skill.

## What happens

Ask these five, each a yes or a no. Each yes adds a route.

| Ask | A yes adds |
|---|---|
| Is this a government integrator? | The demographic route: one call, no OTP. Mandatory for a government integrator and not offered to a private one |
| Does your record already hold the patient's mobile at check-in? | No route, one screen fewer. The lookup is submitted from the number you hold |
| Is the facility registered, with a callback ABDM can reach? | Scan and Share, which becomes the default desk experience: no OTP and no question at the counter |
| Is a fingerprint or iris reader at the desk? | The `bio` authentication method |
| Do patients arrive with the ABHA app on their phone? | The face route, offered second rather than first |

The same answers give the screens: identifier entry only when the mobile is
not held, an authentication chooser only when two or more of the demographic,
biometric and face routes are on, an OTP screen for any surviving route,
and always an account chooser and a filled registration form, because one
mobile carries several ABHA accounts and the form is where every route ends.

The default journey, when every answer is no: search by ABHA number if one
is offered, since that costs no OTP; otherwise request one mobile OTP, verify
it, let the person pick the account, exchange the transfer token, fetch the
profile, and open the registration form filled. One OTP, five calls.

Four rules hold under every combination of answers:

- Every identifier starts on the login path, Aadhaar included. "No account
  on this number" does not mean "no ABHA", and no M1 operation merges two
  ABHA numbers afterwards.
- A login verification that returns `refreshToken` has returned the final
  user token. One without it is a 300 second transfer token, exchanged at
  account selection whatever the length of the accounts array.
- The profile is fetched before the receptionist types, so the form opens
  filled and is read back rather than entered.
- An ABHA is optional to your record. A person may decline, and registration
  completes without one.

## How you know it worked

You hold a yes or a no for all five questions and have restated the routes
and screens they selected to the integrator. On the default journey, the
profile call returns 200 with `ABHANumber` in the body before the
registration form is shown, and the person entered one OTP or none.

## When it goes wrong

- The desk asks for the Aadhaar number a second time after a failed Aadhaar
  login. The transaction already holds it; reuse it.
- A person ends up with two ABHA numbers because creation ran before a login
  lookup. Start on the login path.
- The profile call answers "Invalid X-token" after a login that returned
  `refreshToken`. The token was sent to the account selection call, which
  refuses a final token; use it directly as `X-token: Bearer`.
