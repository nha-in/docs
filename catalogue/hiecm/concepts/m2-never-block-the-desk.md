---
id: hiecm.concept.m2-never-block-the-desk
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Nobody is standing there, so never block and never lose the state
summary: >
  Linking answers on a callback that may be a minute away or may never come, so
  start the work, return at once, and keep where it got to on the record.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-16
    note: >
      A link token request for a real patient was accepted in 340 ms and
      received no callback inside a 60 second window, because the client had no
      endpoint registered.
related:
  concepts:
    - hiecm.concept.m2-exchange-not-call
    - hiecm.concept.m2-integrator-call-panel
    - hiecm.concept.m1-counter-journey-order
---

# Nobody is standing there, so never block and never lose the state

## In plain words

M1's rules do not carry over to M2. There is no patient to spare a question, no
one time password to save, and no screen anybody is looking at. The patient has
left. What there is instead is a call that was accepted and then went quiet, and
a callback that may arrive tomorrow or never.

Two consequences follow, and they are the opposite of how an M1 journey is
built.

## Before you start

- Exchanges keyed by request id, from
  [the unit of work is an exchange](m2-exchange-not-call.md).
- A record to attach link state to, which outlives any page.

## What happens

**Never block.** Linking is several calls, each answered on a callback that may
be a minute away. A button that waits for the outcome is a button that hangs for
sixty seconds and then says nothing useful. Start the work, return at once, and
point at where it can be watched. The desk gets on with the next patient.

**State outlives the session.** Where a link has got to belongs on the record,
not in a page's memory. Reopening the application must show where everything
stands without re-running anything. This is the reverse of M1, where the whole
journey lives and dies inside one person's visit.

**Name the step, not the spinner.** Linking tells a receptionist nothing. These
do:

- Asking ABDM for a link token.
- Asking ABDM for a link token: ABDM accepted it and no answer came back. This
  client has no callback URL registered, so the answer has nowhere to go.
- Asking ABDM for a link token: refused. `ABDM-9999`, user not found.

The second is the interesting one. It names a configuration cause for a runtime
symptom, which is the difference between a receptionist raising a ticket and an
integrator fixing one line of configuration.

## How you know it worked

Start a link and close the page. Reopen the application and the record shows
which step the link reached, and when, without any call being made again.

Press the button that starts linking. It returns immediately and points at where
progress can be watched. It does not sit waiting for a callback.

## When it goes wrong

- The interface hangs for sixty seconds and then reports nothing. Something is
  waiting on the callback inside the request that started the work.
- Reopening the application shows a link as not started when it was started
  yesterday. The state was held in the page rather than on the record.
- A receptionist raises a ticket for what turns out to be a missing callback
  URL. The message named the symptom without naming the configuration cause.
