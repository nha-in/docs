---
id: hiecm.concept.m1-deployment-interview
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 6
title: Ask the integrator about the deployment, not the patient about the journey
summary: >
  The entity type decides which functionalities must be built. Five questions
  about the deployment then add optional routes, and never remove a mandatory
  one.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      The question set a working front desk needed before any screen could be
      designed, taken from which routes its answers made reachable.
related:
  concepts:
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-screen-contract
---

# Ask the integrator about the deployment, not the patient about the journey

## In plain words

M1 has around forty operations and no deployment needs all of them. The routes
do not change from one integrator to the next. The context does: who they are,
what hardware sits on the desk, what their record already holds.

The first fact is the entity type, government or private. Every functionality
that holds a mandatory test case for that entity type is built, whatever else
the deployment looks like. The other questions only add optional routes. None
of them removes a route a mandatory case needs, which is what keeps an
integration from branching into a government variant and a private variant
that then drift apart.

## Before you start

Nothing technical. This is the conversation that happens before code, and its
answers decide what
[the counter journey order](m1-counter-journey-order.md) can rank.

## What happens

Settle the entity type first. Then ask these five. Each is a yes or a no, and a
yes adds an optional route.

| Ask | A yes adds |
|---|---|
| Does your record hold the patient's mobile at check in? | No route. It removes a screen, because the lookup is submitted from the number you already hold |
| Is there a fingerprint or iris reader at the desk? | The biometric method |
| Do patients arrive with the ABHA app? | The face route, as a second method rather than a first |
| Do you create ABHAs from a driving licence? | The driving licence route |
| Which record types does your system actually produce? | The bundles worth generating, rather than all seven |

Scan and register is not a question. Its cases are mandatory for every entity
type, so it is always built. A callback ABDM cannot reach yet is a readiness
item to solve before its test, never a reason to leave it out. The same holds
for the demographic route for a government entity.

The mandatory functionalities and the answers together give the route set. The
route set gives the screen set. The integrator then implements renderers for
those screens, rather than implementing a flow.

The last question belongs here rather than with the record work, because
scaffolding all eight record types before knowing which two a system produces is
the most expensive guess available in this integration.

## How you know it worked

You can name, before any screen is drawn, the routes the entity type makes
mandatory and the optional routes the answers added. Every functionality with a
mandatory case for the entity type is in the build, whatever the answers were.

## When it goes wrong

- The build contains a government branch and a private branch. The answers were
  used to pick a variant rather than to add routes. Each yes should add,
  never replace.
- A functionality with a mandatory case is missing because an answer was no.
  The answers add optional routes only.
- Seven record generators exist and the system produces two. The last question
  was not asked.
