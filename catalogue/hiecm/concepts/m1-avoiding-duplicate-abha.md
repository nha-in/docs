---
id: hiecm.concept.m1-avoiding-duplicate-abha
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 5
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

**Every identifier starts on the login path, Aadhaar included.** Wiring Aadhaar
straight to enrolment, because enrolment is where Aadhaar is most discussed,
sends everybody who already holds an ABHA to make a second one.

**`ABDM-1114` is the only answer that means nobody holds an ABHA.** A refusal
that names a field is not the same thing. A stale certificate reads back
identically, and creating an account on that is how the duplicate happens.

**Never ask the patient whether they want to log in or to create.** They often
cannot answer. One screen, titled for both outcomes, takes an identifier and
lets the response decide.

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
mobile there offers a path that cannot finish. The lookup still runs first: a
patient saying they have never had one is not evidence, and creating on somebody's
word is how the second number appears.

## How you know it worked

Run a login for an identifier nobody holds. You receive `404` with `ABDM-1114`,
no one time password is sent, and only then does the journey offer creation.

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
  creating before it has looked, and the lookup is the cheapest call available.
