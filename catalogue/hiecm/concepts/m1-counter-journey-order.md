---
id: hiecm.concept.m1-counter-journey-order
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 2
router: >
  The ABHA step comes before the registration form and fills it. A verified
  profile carries the whole form, so a journey that registers the patient
  first and offers ABHA afterwards has already spent the keystrokes it
  existed to save.
title: The ABHA step comes before the registration form and fills it
summary: >
  Ask for an ABHA before you ask a patient to register, because a verified
  profile already carries the answers the form is asking for.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      Route costs counted against the sandbox while building a working front
      desk, from what each route actually required.
related:
  concepts:
    - hiecm.concept.m1-never-ask-twice
    - hiecm.concept.m1-screen-contract
    - hiecm.concept.m1-avoiding-duplicate-abha
    - hiecm.concept.m1-deployment-interview
---

# The ABHA step comes before the registration form and fills it

## In plain words

An ABHA is a patient's health account, and a verified one already holds their
name, date of birth, gender, mobile number, full address with its codes, and a
photograph. A desk that reads that profile types almost nothing.

Put the ABHA step first and the registration form opens already filled. Put it
second and you have spent the keystrokes the integration existed to save, then
filed an identifier on top of them.

The test is simple. Count what the receptionist typed. If a registration with an
ABHA took as many keystrokes as one without, the order of the screens is the
first thing to look at.

## Before you start

- A client that can call the M1 operations, holding a session token.
- A decision about which routes your deployment offers, which
  [the deployment interview](m1-deployment-interview.md) settles.
- Somewhere to put the facts a route returns, which
  [the patient fact store](m1-never-ask-twice.md) describes.

## What happens

Rank what is scarce at a counter. Calls are cheap. In order of cost:

1. **Questions put to the patient.** A third question costs more than three
   extra HTTP calls.
2. **One time passwords.** They fail, they expire, they lock a transaction, and
   they reach a handset the person may not be holding.
3. **API calls.** Last, and a long way last.

Rank routes by that list in order, and never let a call count outrank a
question.

| Route | Questions | One time passwords | Calls |
|---|---|---|---|
| Scan and share | 0 | 0 | 0 out, 2 in |
| Create, demographic authentication | 1 | 0 | 1 |
| Create, fingerprint | 1 | 0 | 1 to 3 |
| Create, face | 1 | 0 | 3 plus polling |
| Log in, any identifier | 1 | 1 | 3 to 4 |
| Create, Aadhaar one time password | 1 to 2 | 1 to 2 | 4 to 5 |

Two things fall out of that table.

Demographic authentication is one call and spends no one time password. A
government integrator is required to offer it and a private integrator is not
asked for it, so most integrators build the five call route instead, because it
is the one the specification leads with.

The cheapest journey involves no desk call at all. A registered facility with a
callback ABDM can reach can put a QR code at the counter, and the profile
arrives already consented.

Some lookups cost nothing. A login attempt on an identifier nobody holds is
refused `ABDM-1114` before any one time password is sent, so looking before
creating is free for exactly the people you would otherwise send to create a
duplicate.

## How you know it worked

A receptionist registering a patient who brought an ABHA types corrections only.
Every field the profile carries arrives filled, and the only screen asking for
input is the one confirming the form.

Count the one time passwords spent on a full registration. On the demographic
route and on scan and share that count is zero.

## When it goes wrong

- The form opens empty after a successful ABHA step. The profile was read and
  its result was not carried into the form. Hold it in the fact store rather
  than in a screen's own state, which
  [the patient fact store](m1-never-ask-twice.md) covers.
- The desk asks for an identifier it already holds. Same cause, same fix.
- The journey offers login or creation as a question to the patient. They often
  cannot answer it, and
  [avoiding a duplicate ABHA](m1-avoiding-duplicate-abha.md) explains what to
  do instead.
