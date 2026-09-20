---
id: hiecm.concept.m2-integrator-call-panel
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
order: 4
title: What the integrator needs on screen, separately from the patient
summary: >
  An asynchronous integration is undebuggable without a live view of calls and
  callbacks, and a readiness check that names the missing value.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-16
    note: >
      X-HIU-ID gates the M3 endpoints on presence rather than validity. Absent
      returned 401 with a zero length body, an invented id returned 202, and an
      empty string returned 401.
related:
  concepts:
    - hiecm.concept.m2-exchange-not-call
    - hiecm.concept.m2-inbound-is-a-surface
    - hiecm.concept.m2-never-block-the-desk
---

# What the integrator needs on screen, separately from the patient

## In plain words

A desk that talks to ABDM asynchronously cannot be debugged without a view built
for the integrator rather than the receptionist. It is cheap to build and it is
the difference between a fix that takes a minute and one that takes a day.

## Before you start

- Exchanges keyed by request id, from
  [the unit of work is an exchange](m2-exchange-not-call.md).

## What happens

**A live view of every call and callback, grouped by request id**, so an
outbound call, its wait, and the callback answering it read as one exchange with
a timeline.

**Redact by name and length, never by value.** Show that an `Authorization`
header was sent and how long it was. Never its contents. The panel is a browser.

**Show what would be sent, before sending it.** A request preview or a bundle
inspector turns it failed at the far end into something checkable at the desk.

**A readiness check that names what is missing**, and this is where two
configuration failures have to be told apart:

| Missing | Effect | Treat as |
|---|---|---|
| Facility id | the call cannot be sent | blocker, refuse locally |
| Callback URL | the call sends and is accepted, and the answer has nowhere to go | warning, send anyway |

Treating both as blockers is the tempting mistake. Refusing to send when no
callback URL is registered hides exactly the behaviour the panel exists to make
visible. Send, accept, wait, time out, and say why.

Refuse the first locally and name the value. An invented facility id comes back
from ABDM as an entitlement error that reads like a credentials problem, and
sends the integrator to the console instead of to one line of configuration.

Presence is not validity. `X-HIU-ID` is checked for presence rather than
against any registry: absent is refused `401`, and an invented id is accepted
`202`. Anyone testing with a made up id sees acknowledgements that look like
progress, which is why the local check has to be the strict one.

## How you know it worked

Clear the facility id and press the button. The call is refused before anything
is sent, and the message names the configuration value that is absent.

Clear the callback URL and press the same button. The call is sent, accepted,
waits the window, and reports that nothing arrived and why.

Open the panel during a linking run. Each exchange is one row, headers are shown
by name and length, and no header value appears anywhere.

## When it goes wrong

- A token appears in the panel. Redaction is by value rather than by name and
  length. This is a credential leak, not a display bug.
- An integrator is sent to the developer console by an entitlement error. The
  facility id was not checked locally before the call went out.
- Calls are accepted and nothing ever answers, and the panel says only waiting.
  Name the missing callback URL as the cause, rather than leaving the reader
  with a timeout.
