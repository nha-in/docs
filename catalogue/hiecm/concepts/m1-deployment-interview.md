---
id: hiecm.concept.m1-deployment-interview
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 4
title: Ask the integrator about the deployment, not the patient about the journey
summary: >
  Six questions about a deployment decide which ABHA routes it offers, and the
  routes then decide which screens get built.
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

So the first thing to establish is not how the journey should look. It is six
facts about the deployment. Each answer adds a route rather than replacing one,
which is what keeps an integration from branching into a government variant and
a private variant that then drift apart.

## Before you start

Nothing technical. This is the conversation that happens before code, and its
answers decide what
[the counter journey order](m1-counter-journey-order.md) can rank.

## What happens

Ask these six. Each is a yes or a no.

| Ask | A yes adds |
|---|---|
| Are you a government integrator? | The demographic route: one call, no one time password |
| Does your record hold the patient's mobile at check in? | No route. It removes a screen, because the lookup is submitted from the number you already hold |
| Are you a registered facility with a callback ABDM can reach? | Scan and share, which then becomes the default counter experience |
| Is there a fingerprint or iris reader at the desk? | The biometric method |
| Do patients arrive with the ABHA app? | The face route, as a second method rather than a first |
| Which record types does your system actually produce? | The bundles worth generating, rather than all seven |

The answers give the route set. The route set gives the screen set. The
integrator then implements renderers for the screens that survive, rather than
implementing a flow.

The sixth question belongs here rather than with the record work, because
scaffolding all seven record types before knowing which two a system produces is
the most expensive guess available in this integration.

## How you know it worked

You can name, before any screen is drawn, which routes this deployment offers
and which it does not. Every screen in the build traces to a route that at least
one answer switched on, and no screen exists for a route no answer reached.

## When it goes wrong

- The build contains a government branch and a private branch. The answers were
  used to pick a variant rather than to light up routes. Each yes should add,
  never replace.
- A screen exists that no route uses. Something was built from the specification
  rather than from the answers.
- Seven record generators exist and the system produces two. The sixth question
  was not asked.
