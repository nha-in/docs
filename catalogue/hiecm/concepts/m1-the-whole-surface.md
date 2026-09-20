---
id: hiecm.concept.m1-the-whole-surface
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 12
title: The surface is more than a registration form
summary: >
  M1 supports several placements beyond registering a patient, and a design
  that accounts for them from the start avoids meeting each one later as a
  change request.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
    status: read-from-spec-2026-09-20
    note: >
      The operations behind each placement below are in the M1 specification:
      recovering a forgotten ABHA, upgrading a mobile made address, the card
      and QR code, the profile share, and the mobile update.
related:
  concepts:
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-deployment-interview
    - hiecm.concept.m1-screen-contract
---

# The surface is more than a registration form

## In plain words

Registering a patient is the journey every M1 integration builds first, and it
is not the whole of what the operations support. Several other placements exist,
each answering something a desk is actually asked for, and each arriving later
as a change request when the design did not account for it.

List them for the integrator early. They may choose to build none of them, and
that is a decision rather than an omission.

## Before you start

- A working registration journey, because every placement below assumes a
  patient whose ABHA the desk can already reach.
- [The deployment interview](m1-deployment-interview.md), which decides which
  of these a given counter needs at all.

## What happens

| Placement | What a desk is asked for |
|---|---|
| Find a forgotten ABHA | A patient knows they have one and cannot produce it |
| Upgrade a mobile made address | An account that was never verified against an identity document, and cannot be looked up before an OTP is spent |
| Show the card and the QR code | A patient wants their ABHA on screen or on paper |
| Take a profile shared by QR at the counter | The share route, which is also the cheapest registration journey |
| Update a mobile number | The number on the account is not the one the patient carries |

Two of these are worth deciding early rather than late.

The upgrade matters because a mobile made address is the lesser account, and a
desk that can upgrade it in place is the only opportunity most patients will get.
[Creation is from Aadhaar](m1-avoiding-duplicate-abha.md) exists so a desk does
not create those accounts; the upgrade is what to do about the ones that exist.

The card and QR are usually the first thing a patient asks for and the last
thing an integration builds, because they are not part of registering anybody.

## How you know it worked

Show the integrator the table above before the first screen is designed. For
each row they say build it, or not now, and not now is recorded.

For each placement built, a patient can reach it from somewhere a receptionist
would look, rather than from a screen that exists only in the registration
journey.

## When it goes wrong

- **Every placement arrives as a change request.** The list was never shown, so
  each one looks like new scope rather than a decision deferred.
- **A patient cannot be shown their own card.** The operations support it and
  the journey has nowhere to put it.
- **Mobile made accounts accumulate with no upgrade path.** The desk stopped
  creating them and never offered the upgrade to the people already holding
  one.
