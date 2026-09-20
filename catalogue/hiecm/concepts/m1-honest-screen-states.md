---
id: hiecm.concept.m1-honest-screen-states
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 11
title: Telling the truth on screen at the counter
summary: >
  A screen must not say verified, linked or complete when it means accepted,
  and an error must land where the person is actually looking.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      Each rule here was a defect in a working front desk before it was a rule,
      found by running the journeys against the sandbox.
related:
  concepts:
    - hiecm.concept.m1-screen-contract
    - hiecm.concept.m1-avoiding-duplicate-abha
    - hiecm.concept.m1-never-ask-twice
---

# Telling the truth on screen at the counter

## In plain words

An integration that overstates its own state is worse than one that reports a
gap, because the gap is then discovered by a patient at a counter rather than by
the person who could have fixed it.

Most of what follows was a defect before it was a rule.

## Before you start

- The six screens, from [the screen contract](m1-screen-contract.md), because
  several of these rules are about where a message lands.

## What happens

**An error must land on the screen the person is looking at.** A multi step
journey that writes a failure into a step the view has scrolled past shows the
desk nothing at all. Resolve the target to the active step rather than to a
fixed position on the page.

**Accepted is not done.** Anything asynchronous has at least five outcomes and
they must not look alike: sent, accepted and waiting, answered, refused before
it ever waited, and no answer inside the window. A refusal shown as a completion
is the worst of the five.

**A silence is not a failure.** Where no timeout is published, say that nothing
arrived in the window you chose, rather than saying it failed.

**Show the masked number the code went to.** A person with two handsets needs to
know which one to pick up.

**A resend button has two jobs either side of one boundary.** While the
transaction still has attempts left, reuse it, because starting a new one throws
away a live transaction. Once it is locked, only a fresh transaction recovers
and retrying cannot. Show a visible wait, because the fastest route to a locked
transaction is somebody pressing resend four times.

**Name the field, not the person.** When an encrypted value is refused, the
cause is usually the encryption, the headers or the clock. Telling a patient
their number is wrong is usually a lie.

Some of this is interface mechanics rather than ABDM, and it still costs real
failures. Off screen is not hidden: a translated step track leaves every step in
the tab order, so the first keypress walks into fields nobody can see, and
inactive steps need marking inert. State from one patient must not survive into
the next, and the field that leaks is always the one the desk typed rather than
the one the profile filled, because every other field is overwritten on the way
in.

## How you know it worked

Trigger a refusal on the last step of a long journey. The message appears on the
step in view, and the desk can read it without scrolling.

Trigger a synchronous refusal on an asynchronous call. The screen says refused,
not waiting, and not done.

Complete a journey for one patient and start another. No field carries a value
from the first, including the fields the desk typed by hand.

## When it goes wrong

- A green state is showing for a refusal. The success and failure paths are
  sharing a function that closes the waiter. Fix it in the shared function, not
  at each call site.
- A one time password transaction locks repeatedly. Resend is starting a new
  transaction while the old one still had attempts left.
- A patient is told their Aadhaar number is wrong when the clock or the
  certificate is at fault. Name the field that was refused and say what else
  can cause it.
