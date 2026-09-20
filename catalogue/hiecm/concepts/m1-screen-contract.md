---
id: hiecm.concept.m1-screen-contract
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: The six counter screens, and what each is forbidden to ask
summary: >
  An ABHA journey at a desk needs six screens, and what each one must never ask
  for matters more than what it collects.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      The screen set a working front desk converged on, including the account
      chooser, which one shared handset made necessary.
related:
  concepts:
    - hiecm.concept.m1-never-ask-twice
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-honest-screen-states
---

# The six counter screens, and what each is forbidden to ask

## In plain words

Six screens cover every ABHA route a desk offers. Each one declares three
things: what it collects, what it is forbidden to ask, and when it does not
appear at all.

The forbidden column is the one usually missing, and it is the one that stops a
journey asking the same question twice.

## Before you start

- A fact store the screens read from, which
  [never ask twice](m1-never-ask-twice.md) describes.
- The route set your deployment offers, from
  [the deployment interview](m1-deployment-interview.md).

## What happens

| Screen | Collects | Must never ask | Skipped when |
|---|---|---|---|
| Identify | one identifier | anything already held | the desk holds a mobile or an ABHA number |
| Confirm it is them | yes or no to a masked number | the number itself | no free lookup ran |
| One time password | six digits | the identifier, again | the chosen route spends no one time password |
| Choose an account | which of several | anything the accounts array already carries | there is one account or none |
| Choose an address | pick or type | anything the profile carries | the route issues a default address |
| Confirm the form | corrections only | anything the profile carries | never. It is the destination |

The account chooser is not an edge case. One mobile carrying several ABHA
accounts is an ordinary shared family handset. A journey written as a straight
line from one time password to signed in has nowhere to put the second account,
and finds this out in production.

The last screen is the destination of the whole journey, which is why it is the
only one never skipped. Everything before it exists to arrive there with the
fields already filled.

## How you know it worked

Every screen in the build maps to a row above. For each one you can say what it
refuses to ask, and that refusal is enforced by the fact store rather than by a
comment.

Run a patient whose mobile carries two ABHA accounts. The account chooser
appears, offers both, and asks for nothing the accounts array already carries.

## When it goes wrong

- A second account signs the wrong person in, or the journey stalls. The account
  chooser was not built. It is not optional.
- A screen asks for the identifier again alongside the one time password. The
  screen is naming its own fields instead of requesting the next missing fact.
- The address screen appears on a route that issues a default address. The skip
  condition is not being checked.
