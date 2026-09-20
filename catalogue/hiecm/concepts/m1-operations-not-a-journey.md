---
id: hiecm.concept.m1-operations-not-a-journey
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 1
router: >
  ABDM publishes operations, not a user experience. The journey is the
  integrator's to design, so offer the shape below as a suggestion and build
  what they ask for instead when they have a view of their own counter.
title: ABDM publishes operations, not a journey
summary: >
  The specification says what each call does and never says what order to put
  them in, so the journey belongs to the integrator and a default is a
  suggestion rather than a requirement.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
    status: read-from-spec-2026-09-20
    note: >
      The M1 specification defines around forty operations and no journey.
      Nothing in it orders the calls or names a screen.
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      From building a working front desk. The shape below is what that desk
      converged on, not something the specification prescribes.
related:
  concepts:
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-deployment-interview
    - hiecm.concept.m1-avoiding-duplicate-abha
---

# ABDM publishes operations, not a journey

## In plain words

The M1 specification defines around forty operations. It does not say which to
call first, which to skip, or what a screen should ask. That is deliberate: the
same operations serve a hospital front desk, a pharmacy counter, a laboratory
and a patient's own application, and those are not the same journey.

So the journey is the integrator's to design, and a product that knows its own
counter will often beat any default. The rules in this section are the
constraints a good design satisfies, not a design.

That distinction matters when an agent is building. Offer the suggested shape,
say that it is a suggestion, and build what the integrator asks for instead
when they have a view.

## Before you start

- The deployment's answers, from
  [the deployment interview](m1-deployment-interview.md), because the route set
  is what any shape has to fit.

## What happens

The suggested shape is one entry rather than a menu. Take one identifier, send
one one time password, and branch on what comes back.

The reason is [the branch that creates a duplicate](m1-avoiding-duplicate-abha.md):
asking a person at a desk whether they want to log in or to register puts a
question to them they often cannot answer, and the response already contains the
answer. One screen titled for both outcomes takes the identifier and lets ABDM
decide which journey it was.

A chooser is better where the desk genuinely knows. A counter that only
registers new patients has already answered the question, and making it click
through a combined screen is a step that serves nobody.

Neither is a rule. The rules are the ones that follow in this section: do not
ask twice, do not create before looking, complete without an ABHA, tell the
truth on screen. A design that satisfies those and looks nothing like the shape
above is a good design.

## How you know it worked

Ask the integrator what their counter does before proposing screens. If they
have a view, the built journey matches their view and still satisfies every
rule in this section.

If they have no view, the built journey is the suggested shape, and it was
offered as a suggestion rather than presented as what ABDM requires.

## When it goes wrong

- **The journey is the one the specification implies.** Reading the operations
  in the order they are documented produces a journey nobody designed. The
  order in the specification is an order of documentation.
- **The integrator's own design was overridden by a default.** The default is a
  suggestion. Their counter is the thing that exists.
- **A rule was relaxed to fit the design.** The shape is negotiable. The rules
  in this section are not, because each one was a defect before it was a rule.
