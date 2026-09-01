---
id: hiecm.troubleshooting.consent-stuck-requested
type: troubleshooting
gateway: hiecm
milestone: M3
version: abdm-v3
title: The consent request is stuck in Requested
summary: >
  You created a consent request and it has stayed in Requested, never
  moving to Granted or Denied. The checks that rule out the common
  causes, in order.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 3.docx
    status: not-yet-hashed
    note: NHA's M3 document, the same source the consent concept page draws on.
  - file: ABDM Sandbox/ABDM/NewDocumant PHR app.docx
    status: not-yet-hashed
    note: NHA's PHR app document, for what a patient sees and the subscription model.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.consent-artefact]
  endpoints: [hiecm.endpoint.m3-consent-request-init, hiecm.endpoint.m3-consent-request-status]
  errors: [hiecm.error.abdm-1170]
  glossary: [shared.glossary.abha-address, shared.glossary.hiu]
skills:
  - hiecm-m3-debug
---

# The consent request is stuck in Requested

## In plain words

You raised a consent request and it has not moved to Granted or Denied.
A consent request has states, and Requested is the starting state:
nothing has failed yet, the patient simply has not acted, or something
kept them from ever seeing it.

## Before you start

- The request itself was accepted. See
  [consent init request](../endpoints/m3-consent-request-init.md): NHA's
  gateway notifies the patient through the ABHA App on acceptance, so an
  accepted request should have produced a notification somewhere.
- You can check the request's current state with
  [consent request status](../endpoints/m3-consent-request-status.md)
  rather than only waiting.

## What happens

Work through these in order.

1. **Does the patient's app show the request at all?** NHA's M3 document
   says the gateway notifies the patient through the ABHA App when a
   consent request is raised. If the patient uses a third party
   [PHR app](../../shared/glossary/phr.md) instead of the ABHA App, that
   app needs an approved subscription with
   the gateway to be notified of a new consent request; without one, the
   request can sit unseen even though it was accepted. This catalogue
   has not confirmed whether the ABHA App itself needs anything set up
   beyond the patient having an address.
2. **Has the request expired?** A consent request carries a window the
   requester sets for the patient to respond, separate from how long
   access lasts once granted; this catalogue calls these the two
   clocks. Running out of the request window moves the state to
   Expired, not Requested, so checking the current state with
   [consent request status](../endpoints/m3-consent-request-status.md)
   tells you if this has already happened.
3. **Was it raised against the right [ABHA address](../../shared/glossary/abha-address.md)?**
   An address that is malformed or does not exist produces
   [ABDM-1170](../errors/abdm-1170.md) and the request goes nowhere. A
   syntactically valid address that belongs to a different real patient
   will not error at all: the request is delivered and seen, just by
   the wrong person, not the one you meant. Getting the address right
   matters more than passing validation.

## How you know it worked

[Consent request status](../endpoints/m3-consent-request-status.md)
reports Granted or Denied rather than Requested. A Granted result also
carries the id of at least one consent artefact; NHA's M3 document
states a granted request can produce more than one.

## When it goes wrong

If the patient's app shows the request, it has not expired, and the
address is correct, and the state is still Requested after a reasonable
wait, this is expected: Requested means the patient has not decided yet,
and there is no call that makes them decide faster. If you believe the
patient acted and the state did not change, escalate on the NHA dev
forum. Report the consent request id, the `REQUEST-ID` from the init
call, the `TIMESTAMP`, and the response from
[consent request status](../endpoints/m3-consent-request-status.md).

The error this symptom can surface:
[ABDM-1170](../errors/abdm-1170.md), the ABHA address is malformed or
does not exist.
