---
id: hiecm.concept.m3-refuse-to-guess
type: concept
gateway: hiecm
milestone: M3
version: abdm-v3
order: 2
title: Refuse to guess an undocumented step, and say so before the work starts
summary: >
  Where a capability cannot work because ABDM has not published what it needs,
  report it in the readiness check rather than at the moment records arrive.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: documented-2026-09-16
    note: >
      The data transfer needs a key derivation and a symmetric cipher over the
      shared secret, and neither is published, so the step cannot be completed
      from the specification alone.
related:
  concepts:
    - hiecm.concept.m3-plural-artefacts-and-codes
    - hiecm.concept.m2-integrator-call-panel
---

# Refuse to guess an undocumented step, and say so before the work starts

## In plain words

M3's data transfer needs a key derivation and a symmetric cipher over the shared
secret. Neither is published. So the step cannot be completed from the
specification, and no amount of care in the code around it changes that.

What matters is where the integrator finds out. A desk that discovers it cannot
decrypt at the moment records arrive has discovered it in the worst place
available: asynchronously, after a consent has been served, with a patient's
records in hand and nothing to do with them.

## Before you start

- A readiness check the integrator sees before any flow runs, from
  [the integrator call panel](m2-integrator-call-panel.md).

## What happens

Derive what is documented, then throw on the undocumented step with a message
naming exactly what is missing. Not a generic failure. The name of the step, and
what would have to be published for it to work.

Then report it in the readiness check up front, rather than at the moment the
first encrypted bundle arrives.

The rule generalises past encryption. Where a capability cannot work, say so
before somebody depends on it, in the place they would act on it. A capability
that is going to fail should fail in the readiness check, where an integrator is
already looking for problems, not in a flow where they are looking for records.

Do not add a dependency to paper over a scheme nobody has written down. A guess
with a package name on it is still a guess, and it is harder to find later
because it looks like a decision somebody made deliberately.

## How you know it worked

Open the readiness check before running anything. It names the data transfer
step as unavailable, and says which part is unpublished.

Run the flow anyway. It fails at the derivation step with a message naming that
step, rather than at a later point with a decoding error.

## When it goes wrong

- Records arrive and cannot be read, and the failure reads as a corrupt payload.
  The undocumented step failed quietly somewhere earlier.
- A library appeared in the dependency list to solve the cipher. Whatever it
  implements, it is not what ABDM specified, because ABDM has not specified one.
- The readiness check is green and the capability does not work. The check is
  testing configuration rather than capability.
