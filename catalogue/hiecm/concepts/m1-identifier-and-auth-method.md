---
id: hiecm.concept.m1-identifier-and-auth-method
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 7
router: >
  An identifier and an auth method are two different questions, and listing
  them together is what makes M1 look like five choices. Ask which identifier
  first, then offer auth methods underneath it, and only where there is more
  than one.
title: An identifier and an auth method are two different questions
summary: >
  Who the person is and how they prove it are separate axes, and collapsing
  them into one list is what makes a simple journey look like a menu of five
  unrelated options.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
    status: read-from-spec-2026-09-20
    note: >
      The identifier travels as loginHint and the proof as authMethods, whose
      example values are otp, demo_auth, bio, face, iris and child. The two
      are separate fields in the same body.
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      The profile login path refused loginHint abha-address with "Invalid
      Login Hint", accepting mobile, aadhaar and abha-number. An ABHA address
      signs in through the PHR login family instead.
related:
  concepts:
    - hiecm.concept.m1-screen-contract
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-operations-not-a-journey
---

# An identifier and an auth method are two different questions

## In plain words

M1 looks like five unrelated choices when a screen lists Aadhaar one time
password, mobile one time password, fingerprint, face and demographic
authentication side by side. It is not five choices. It is two questions.

Who is this person, which is an identifier. And how do they prove it is them,
which is an auth method. Every combination the platform supports is one answer
to each.

Ask them in that order and the screen stops being a menu.

## Before you start

- [The screen contract](m1-screen-contract.md), because this decides what the
  identify screen collects and what the screen after it offers.

## What happens

ABDM works with four identifiers: an Aadhaar number, a mobile number, an ABHA
number and an ABHA address. Not all four reach every path. The profile login
path takes a mobile, an Aadhaar or an ABHA number, and refuses an ABHA address
with `Invalid Login Hint`. An address signs in through the PHR login family
instead, which is the patient's own application acting for them rather than a
facility acting as a provider, so a facility takes such a patient through the
share route.

How the person proves the identifier is theirs travels separately, as
`authMethods`. Its values include `otp`, `demo_auth`, `bio`, `face`, `iris` and
`child`.

So the screen asks for the identifier first. The auth methods go underneath it,
and only where there is more than one, because offering a single method as a
choice is a click that decides nothing. Which methods are available depends on
the identifier and on the deployment: a demographic route is for a government
integrator, a fingerprint route needs a reader on the desk.

The account lookup returns the methods an account actually supports, so a desk
can offer one that will work rather than one that will fail.

## How you know it worked

Count the options on the first screen. It offers identifiers, and the number of
them is at most four and usually fewer, rather than a flat list of every
identifier and method combination.

Pick an identifier that supports one auth method. No method chooser appears.
Pick one that supports several and the chooser appears underneath, listing only
the ones this deployment can actually perform.

## When it goes wrong

- **The first screen lists five or more options.** The two axes were
  collapsed. Split them.
- **A method is offered that the desk cannot perform.** A fingerprint option on
  a desk with no reader, or a demographic option for a private integrator. The
  route set comes from
  [the deployment interview](m1-deployment-interview.md).
- **An ABHA address is offered on the profile login path.** It is refused with
  `Invalid Login Hint`. That identifier reaches a different family of calls.
- **A chooser appears with one option in it.** Offer it only where there is
  more than one.
