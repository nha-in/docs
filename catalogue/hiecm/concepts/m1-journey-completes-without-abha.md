---
id: hiecm.concept.m1-journey-completes-without-abha
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 4
router: >
  Decide deliberately whether a journey can complete without an ABHA. A
  record keyed by the facility's own number does not need one, and a journey
  that cannot finish without one blocks care for anyone who has none.
title: A journey has to complete without an ABHA
summary: >
  An ABHA is voluntary, so a registration that cannot finish without one
  refuses care to the people who do not have one, and the decision has to be
  made on purpose rather than fall out of the screen order.
sources:
  - url: https://abdm.gov.in/
    status: policy
    note: >
      Creating an ABHA is voluntary under ABDM. No specification states the
      consequence for a facility's journey, which is why this is recorded as
      a policy rule rather than a call.
  - file: site/docs/hiecm/v3/concepts/participants/phr.md
    status: docs-only
    note: >
      ABDM registers a patient at a facility who has no ABHA address and
      reaches them by SMS afterwards, so the platform itself does not treat
      an ABHA as a precondition of a visit.
related:
  concepts:
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-screen-contract
    - hiecm.concept.m1-deployment-interview
---

# A journey has to complete without an ABHA

## In plain words

An ABHA is voluntary. A person can be treated, registered and billed without
one, and a facility's own patient number is what its record is keyed by.

So a registration journey that cannot finish until an ABHA exists has quietly
decided that people without one are not registered. Nobody chose that. It fell
out of putting the ABHA step first and making the form wait for it. The step
comes first so the form opens filled; it does not come first so the form can be
refused.

## Before you start

- The journey order, from
  [the ABHA step before the form](m1-counter-journey-order.md), because this
  rule is the other half of it.
- The screens, from [the screen contract](m1-screen-contract.md), because the
  exit from the ABHA step has to lead somewhere.

## What happens

Decide it deliberately, and write the decision down where the journey is
designed. The question is not whether to offer an ABHA, which every deployment
does. It is what the desk does when the person has none and cannot or will not
create one now.

The answer for a facility record is that the form still completes. The patient
number is the facility's own. The ABHA fields on that record stay empty, and
[the surface](m1-counter-journey-order.md) offers creation again on the next
visit rather than blocking this one.

The ABHA step therefore needs an exit that is neither success nor failure: not
now. It returns whatever facts it collected to the fact store, and the form
opens with those filled and the rest blank, exactly as it would after a
successful step with fewer fields.

Where a deployment does require an ABHA, a government scheme that pays only
against one for instance, that is a rule of the deployment, and it belongs in
[the deployment interview](m1-deployment-interview.md) as a question with a
yes, not in the screen order as an accident.

## How you know it worked

Walk a patient through the journey and decline the ABHA step at every point it
is offered. The registration completes, the record exists under the facility's
number, and its ABHA fields are empty.

Open the design and find the sentence that says what happens without an ABHA.
It exists, and it was written on purpose.

## When it goes wrong

- **The form will not submit with the ABHA fields empty.** A validation rule
  made the fields required. They are not, unless the deployment interview said
  so.
- **The ABHA step has only two exits.** Success and failure, and a person with
  no ABHA is routed to failure. Add the third exit, not now, and route it to
  the form.
- **The decision was never made.** Nobody can say what the journey does for a
  person without an ABHA. That is this rule failing, whatever the screens do.
