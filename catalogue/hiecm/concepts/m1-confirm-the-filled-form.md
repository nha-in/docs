---
id: hiecm.concept.m1-confirm-the-filled-form
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 9
title: Present the filled form for confirmation rather than saving it unseen
summary: >
  The profile is what ABDM holds, which is not always what the clinician needs
  to see, so the filled form is confirmed by a person before it becomes the
  facility's record.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      From building a working front desk. Profile names came back
      transliterated, and a shared mobile number belonged to a relative rather
      than to the patient.
related:
  concepts:
    - hiecm.concept.m1-screen-contract
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-honest-screen-states
---

# Present the filled form for confirmation rather than saving it unseen

## In plain words

The point of reading an ABHA profile is that the receptionist stops typing. The
temptation that follows is to stop showing the form at all: the data is
authoritative, so save it and move on.

Do not. The profile is what ABDM holds, which is not the same as what the
clinician needs to see. Names may be transliterated into a script the desk does
not use. An address may be years old. A mobile number on a shared handset may
belong to a relative. None of that makes the profile wrong, and all of it
matters at a counter.

## Before you start

- A form that opens filled, from
  [the counter journey order](m1-counter-journey-order.md).
- [The screen contract](m1-screen-contract.md), whose last screen is this one.

## What happens

The confirmation screen collects corrections only. It asks for nothing the
profile already carries, because everything it carries is already on the
screen.

It is the one screen never skipped. Every other screen in the journey exists to
reach this one with more fields filled.

Show which fields came from the profile, so a correction is a deliberate act
rather than a guess. A receptionist who cannot tell a prefilled value from a
typed one will either trust all of it or retype all of it, and both defeat the
purpose.

A correction changes the facility's record. It does not change what ABDM holds:
the profile is the patient's, updated through their own application or through
the profile update calls, not by a desk editing a form. If the desk's copy and
ABDM's copy need to agree, that is a separate update call and a separate
decision.

## How you know it worked

Register a patient whose profile carries a transliterated name. The
confirmation screen shows the profile's value, the receptionist corrects it,
and the facility record carries the correction.

Read what ABDM holds for that patient afterwards. It is unchanged, because a
correction to the form is not an update to the profile.

## When it goes wrong

- **The record is saved without anybody seeing it.** The form was skipped
  because the data was authoritative. Authoritative is not the same as
  appropriate for this counter.
- **A correction silently changed the ABHA profile.** The form was wired to the
  profile update call. Those are different decisions and usually different
  permissions.
- **The receptionist retypes every field.** Nothing distinguished a prefilled
  value from an empty one, so none of them were trusted.
