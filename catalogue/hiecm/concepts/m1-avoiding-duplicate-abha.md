---
id: hiecm.concept.m1-avoiding-duplicate-abha
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 10
router: >
  Offer Create ABHA and the verification routes the cases require. Creation by
  Aadhaar cannot make a second ABHA: an Aadhaar that already holds one comes
  back with isNew false and that account, and the journey carries on from it.
  On a login, only ABDM-1114 means nobody holds an ABHA; create on any other
  refusal and the patient can end up with two numbers, which nothing merges.
title: The branch that creates a duplicate ABHA, and how to close it
summary: >
  A second ABHA number for one person is the expensive failure in M1, nothing
  merges two, and four decisions in the journey are what cause it.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      The two login paths were run back to back on the sandbox. The Aadhaar
      path returned a refreshToken and expiresIn 1800; the mobile path returned
      no refreshToken and expiresIn 300 and required the exchange call.
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      A login on an identifier nobody holds returned 404 ABDM-1114 before any
      one time password was sent.
related:
  concepts:
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-never-ask-twice
    - hiecm.concept.m1-honest-screen-states
---

# The branch that creates a duplicate ABHA, and how to close it

## In plain words

The expensive failure in M1 is a person ending up with two ABHA numbers. Nothing
merges them, so the mistake is permanent and the patient carries it.

It is caused by journey decisions rather than by any single call. Four of them
matter.

## Before you start

- A journey that looks before it creates, which
  [the counter journey order](m1-counter-journey-order.md) sets up.
- A fact store that carries an identifier across a failed route, from
  [never ask twice](m1-never-ask-twice.md).

## What happens

**Offer create and verify, and let creation carry on for an existing account.**
The product offers a Create ABHA option and the login routes the verification
cases need. Creation by Aadhaar does not make a second ABHA: `enrol/byAadhaar`
answers an Aadhaar that already holds one with a 200, `isNew` `false` and that
account's tokens and profile. Carry on from that response to the profile, the
card and the address step, as for a new account.

**On a login, `ABDM-1114` is the only answer that means nobody holds an ABHA.** A refusal
that names a field is not the same thing. A stale certificate reads back
identically, and creating an account on that is how the duplicate happens.

**A patient who cannot say whether they hold an ABHA need not decide.** A
screen titled for both outcomes can take an identifier and let the response
decide. It sits beside the Create ABHA option, never in place of it.

**Read the token, not the account count.** A verification that returns a
`refreshToken` has already returned the final user token, so use it. One without
a `refreshToken` is a short lived transfer token and must be exchanged at the
account selection call, whatever the length of the accounts array. Branching on
`accounts.length` sends the Aadhaar path into an exchange it must not make, and
the refusal then blames the token's shape rather than saying the call was
unnecessary.

Creation is from Aadhaar. ABDM publishes a mobile enrolment route, and an
account created that way is address only and never verified against a
government identity document. No later desk can look it up before spending a one
time password, and the person carries the lesser account permanently. Write that
rule into code as a guard that refuses an unknown method by name, because a rule
the code merely happens to satisfy is one that regresses silently.

When the desk already knows there is no ABHA, ask only for Aadhaar. Offering a
mobile there offers a path that cannot finish. A patient saying they have never
had one is not evidence, and the creation response settles it: `isNew` `false`
means they had one, and the journey carries on with it.

## How you know it worked

Run a login for an identifier nobody holds. You receive `404` with `ABDM-1114`,
no one time password is sent, and only then does the journey offer creation.
Run creation for an Aadhaar that already holds an ABHA. You receive `200` with
`isNew` `false`, and the journey shows that account rather than an error.

Run the Aadhaar login path. The verify response carries a `refreshToken`, the
journey uses it directly, and no exchange call is made. Run the mobile path and
the exchange call is made, because no `refreshToken` came back.

## When it goes wrong

- A login is refused with a message naming a field, and the journey offers
  creation anyway. Only `ABDM-1114` means nobody holds an account. Treat
  anything else as a failure to answer the question.
- The Aadhaar path is refused `Invalid T-token` at the account selection call.
  The journey branched on the account count instead of on `refreshToken`, and
  made a call it did not need to make.
- Two patients a week arrive holding two numbers. Something in the journey is
  creating by a route other than Aadhaar before it has looked, and the lookup is
  the cheapest call available.
- Creation stops at `This account already exist`. The journey treated
  `isNew` `false` as a failure instead of carrying on with the account.
