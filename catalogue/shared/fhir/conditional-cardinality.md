---
id: shared.fhir.conditional-cardinality
type: fhir
gateway: shared
milestone: n/a
version: abdm-v3
order: 2
title: A required child of an optional parent is a conditional requirement
summary: >
  NRCeS marks some elements as required inside parents that are themselves
  optional, so emitting them unconditionally produces a resource that is
  structurally present and semantically empty.
sources:
  - url: https://nrces.in/ndhm/fhir/r4/StructureDefinition-HealthDocumentRecord.html
    status: read-from-package-2026-09-20
    note: >
      Read from the pinned NRCeS package, ABDM Implementation Guide 6.5.0.
      Composition.attester is 0..* and Composition.attester.mode is 1..1
      inside it. Composition.relatesTo is 0..* and both relatesTo.code and
      relatesTo.target[x] are 1..1 inside it.
  - url: https://nrces.in/ndhm/fhir/r4/Bundle-HealthDocumentRecord-example-01.html
    status: read-from-package-2026-09-20
    note: >
      The NRCeS example for the same profile carries neither an attester nor
      a relatesTo, which is what makes the two readings distinguishable.
related:
  fhir:
    - shared.fhir.profile-and-example-together
    - shared.fhir.document-bundle
    - shared.fhir.hl7-validator-recipe
---

# A required child of an optional parent is a conditional requirement

## In plain words

A cardinality of `1..1` does not mean always send this. It means send exactly
one of these inside the thing that contains it, whenever that containing thing
is present.

So when the container is optional, the requirement is conditional. NRCeS has
three of these on every document Composition, and they catch people every time,
because a list of required elements reads like a list of things to emit.

## Before you start

- You can read a profile digest, from
  [reading the profile and the example together](profile-and-example-together.md).
- You have the bundle envelope in place, from
  [DocumentBundle](document-bundle.md).

## What happens

These three elements are `min: 1` on every ABDM record type:

| Element | Its own cardinality | Its parent | The parent's cardinality |
|---|---|---|---|
| `Composition.attester.mode` | 1..1 | `Composition.attester` | 0..* |
| `Composition.relatesTo.code` | 1..1 | `Composition.relatesTo` | 0..* |
| `Composition.relatesTo.target[x]` | 1..1 | `Composition.relatesTo` | 0..* |

NRCeS's own HealthDocumentRecord example carries neither an attester nor a
relatesTo. Both readings are correct: those cardinalities bind within the
parent, and the parent is optional. If you include an attester, it must carry a
mode.

A generator that reads `min: 1` as always emit produces an attester with no
party and a relatesTo pointing at nothing. That is worse than omitting both,
because the elements are now structurally present and semantically empty, and a
receiver cannot tell an unattested document from one attested by nobody.

The rule generalises past these three. Before emitting anything to satisfy a
required child, check whether its parent is required. This catalogue's profile
digests carry that answer: a required element whose nearest optional ancestor
exists names it in `optional_parent`, and an element with no `optional_parent`
is unconditional.

## How you know it worked

Ask for a profile digest and read the required list. Every entry that carries
an `optional_parent` is one you emit only when you are emitting that parent for
a reason of your own.

Generate a bundle for a document nobody attested. It contains no `attester` key
at all, rather than an attester carrying a mode and no party. Run it through the
validator and no message mentions `attester`.

## When it goes wrong

- **The validator complains about `Composition.attester.party`.** An attester
  was emitted to satisfy `attester.mode`. Remove the whole attester.
- **A `relatesTo` points at nothing.** Same cause. A relatesTo says this
  document replaces or appends to another one, so it needs a target that
  exists, and a document that relates to nothing omits the element.
- **A required element is missing and its parent is present.** The opposite
  mistake, and the one the validator does catch: once you include the parent,
  every `min: 1` inside it applies.
