---
id: hiecm.concept.m1-two-routes-to-the-profile
type: concept
gateway: hiecm
milestone: M1
version: abdm-v3
order: 3
router: >
  Two ways the profile reaches the desk. The patient scans a QR and consents
  in their own app, and ABDM posts the profile to your callback, so nobody
  types or asks anything. Or the desk runs the identifier journey. The filled
  form is the destination either way.
title: Two routes to the profile, and the form is the destination of both
summary: >
  A profile arrives either because the patient scanned a QR and consented in
  their own application, or because the desk ran an identifier journey, and
  which one a deployment can offer is a fact about the deployment.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m1.yaml
    status: read-from-spec-2026-09-20
    note: >
      Both routes are in the M1 specification. The share route delivers the
      profile to a registered callback; the identifier route ends in a token
      that reads it.
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-15
    note: >
      From building a working front desk, where the share route was the
      cheapest journey available and needed no desk call at all.
related:
  concepts:
    - hiecm.concept.m1-counter-journey-order
    - hiecm.concept.m1-deployment-interview
    - hiecm.concept.m1-screen-contract
---

# Two routes to the profile, and the form is the destination of both

## In plain words

A registration form fills from an ABHA profile. There are two ways that profile
reaches the desk, and they look nothing like each other.

The patient scans a QR code at the counter carrying your facility id and a
counter id, consents in their own application, and ABDM posts the profile to
your callback. Nobody at the desk types anything or asks anything.

Or the desk runs an identifier journey: take an identifier, verify it, and end
holding a token that reads the profile.

Build whichever the deployment can reach. The form is the destination either
way, which is why both belong to the same design rather than being two
features.

## Before you start

- [The deployment interview](m1-deployment-interview.md), because the share
  route needs a registered facility and a callback ABDM can reach, and only
  the integrator knows whether that exists.
- Somewhere for an inbound profile to land, if the share route is in scope.

## What happens

The share route costs nothing at the counter: no question, no one time
password, no outbound call. It is the cheapest journey in M1 and most
integrations never build it, because it needs a public callback and the
specification leads with the identifier route.

The identifier route is the one to build when the deployment has no callback
ABDM can reach, or when patients arrive without the application. It spends at
least one question and usually one one time password, which is why
[the journey order](m1-counter-journey-order.md) ranks the routes.

Both end in the same place. The form opens filled, the desk corrects rather
than types, and every rule about the form applies whichever route filled it.
A design that treats the share route as a separate feature with its own screens
ends up with two registration paths that drift.

Where both are available, the share route is the default and the identifier
route is the fallback for a patient who cannot or will not scan.

## How you know it worked

Register a patient by each route and compare what the receptionist did. The
share route required nothing beyond showing the code. The identifier route
required one identifier and its verification. Both ended on the same form,
filled from the same profile.

Where the deployment has no callback, the share route is absent from the
journey rather than present and silently failing.

## When it goes wrong

- **The share route is built and nothing ever arrives.** No callback URL is
  registered against the facility, so ABDM has nowhere to post the profile.
  That is a configuration cause for a runtime symptom, and the interface has to
  say so.
- **Two registration forms exist, one per route.** They will drift. The routes
  differ in how the profile arrives, not in what happens after.
- **The share route was skipped because the specification leads with the
  other.** That is the most expensive omission in M1: it is the only journey
  that asks the patient nothing.
