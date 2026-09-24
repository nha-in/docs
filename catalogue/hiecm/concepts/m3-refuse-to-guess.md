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
      shared secret, and neither is in the specification, so the step cannot
      be completed from the specification alone.
  - file: site/docs/hiecm/v3/concepts/data-flow.md
    status: reference
    note: >
      The published data flow page gives the scheme: ECDH on Curve25519,
      HKDF for the session key, and AES-GCM for the payload.
related:
  concepts:
    - hiecm.concept.m3-plural-artefacts-and-codes
    - hiecm.concept.m2-integrator-call-panel
    - shared.concept.fidelius-ecdh-interop
---

# Refuse to guess an undocumented step, and say so before the work starts

## In plain words

M3's data transfer needs a key derivation and a symmetric cipher over the shared
secret. Neither is in the specification. The
[data flow page](/docs/hiecm/v3/concepts/data-flow) and the
[Fidelius reference](../../shared/concepts/fidelius-ecdh-interop.md) give the
scheme: HKDF over the shared secret, and AES-GCM for the payload. Build the step
from those. A desk that reads only the specification cannot complete it, and no
amount of care in the code around it changes that.

What matters is where the integrator finds out. A desk that discovers it cannot
decrypt at the moment records arrive has discovered it in the worst place
available: asynchronously, after a consent has been served, with a patient's
records in hand and nothing to do with them.

## Before you start

- A readiness check the integrator sees before any flow runs, from
  [the integrator call panel](m2-integrator-call-panel.md).

## What happens

Build every step from what is documented. Where a step is documented nowhere,
throw on it with a message naming exactly what is missing. Not a generic
failure. The name of the step, and what would have to be published for it to
work.

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

Open the readiness check before running anything. It names any step that is
documented nowhere as unavailable, and says which part is missing.

Run the flow anyway. Where a step is missing, it fails at that step with a
message naming it, rather than at a later point with a decoding error.

## When it goes wrong

- Records arrive and cannot be read, and the failure reads as a corrupt payload.
  The undocumented step failed quietly somewhere earlier.
- A library appeared in the dependency list to solve the cipher, chosen from a
  sample rather than from the data flow page. Check it implements HKDF and
  AES-GCM as that page gives them.
- The readiness check is green and the capability does not work. The check is
  testing configuration rather than capability.
