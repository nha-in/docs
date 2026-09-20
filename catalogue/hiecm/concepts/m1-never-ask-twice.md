---
id: hiecm.concept.m1-never-ask-twice
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
title: Never ask a patient the same thing twice, enforced by structure
summary: >
  Hold every fact you learn about a patient in one place, so a screen asking
  for something you already have cannot be built.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      Taken from a working front desk, where re-asking survived review because
      each screen read correctly on its own.
related:
  concepts:
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-screen-contract
    - hiecm.concept.m1-avoiding-duplicate-abha
---

# Never ask a patient the same thing twice, enforced by structure

## In plain words

A patient at a counter will be asked for an identifier, and then, two screens
later, for something they already gave. Nobody notices in review, because each
screen reads correctly on its own. It is only the journey that repeats itself.

Discipline does not fix this, because the mistake is invisible at the point it
is made. Structure does. Keep one store of what you know about the patient in
front of you, and generate every question from what is missing in it. A request
to collect a fact you already hold then cannot be constructed.

## Before you start

- A journey where the ABHA step runs first, which
  [the counter journey order](m1-counter-journey-order.md) explains.
- The six screens your journey can show, from
  [the screen contract](m1-screen-contract.md).

## What happens

Hold one store per patient, for the length of their visit:

```
facts:      { aadhaar, mobile, abhaNumber, name, dob, gender, ... }
provenance: { mobile: 'from the appointment', name: 'from the ABHA profile' }
tried:      [ { route, why it failed } ]
```

Three rules make it work.

1. **Facts are write once.** Nothing overwrites a fact silently.
2. **A failed route gives back everything it collected.** An Aadhaar typed for a
   login that then failed is already in the store when creation begins.
3. **Screens ask for one missing fact at a time**, and the question is generated
   from the store rather than hard coded into the screen.

Where this bites in practice: a patient identifies by mobile, turns out to have
no ABHA, and creation begins. Creation needs a mobile to attach to the new
account. An implementation that renders a fresh empty mobile field there has
asked the same question twice.

Show provenance. When a field is filled from something you already hold, say so
beside it: taken from what they already gave you, change it only if the new ABHA
should carry something different. A prefilled field with no explanation reads as
a guess.

## How you know it worked

Walk a patient through a route that fails and then through a second route. The
second route asks only for facts the first never collected, and the fields the
first collected arrive filled, each showing where it came from.

Search the interface for a question that is asked in two places. In a journey
built this way there is no such question to find, because the screen cannot name
a field, only request the next missing one.

## When it goes wrong

- A field arrives filled and wrong, and the desk cannot tell why. Provenance is
  missing. Show where each value came from.
- A fact changes under the desk between two screens. Something is overwriting
  rather than writing once. The store should refuse the second write.
- A route fails and the patient is asked everything again. The failed route
  discarded what it collected instead of returning it.
