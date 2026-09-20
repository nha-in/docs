---
id: hiecm.concept.m2-exchange-not-call
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
order: 1
title: The unit of work is an exchange, not a call
summary: >
  Every linking call answers twice, so group the outbound call, the wait and
  the callback into one row keyed by request id.
sources:
  - url: https://sandbox.abdm.gov.in/
    status: observed-2026-09-16
    note: >
      Three outcomes timed on the sandbox against one facility id: a real
      patient accepted with 202 in 340 ms, a fictional patient refused with a
      synchronous 400 in 91 ms, and a real patient accepted and then silent for
      the full 60 second window.
related:
  concepts:
    - hiecm.concept.m2-never-block-the-desk
    - hiecm.concept.m2-integrator-call-panel
    - hiecm.concept.m2-retry-is-a-duplicate
---

# The unit of work is an exchange, not a call

## In plain words

Every M2 and M3 call answers twice. Once straight away, saying the request was
accepted, and later on a callback to your own bridge, saying what actually
happened. Do not treat the first as success. It says the request was accepted,
not that anything was linked.

So the request id stops being a log handle and becomes the join key. An
outbound call, the wait, and the callback that answers it are one exchange, and
they should read as one row with a timeline. Shown as three separate lines they
read as noise, and the difference between accepted and done stays invisible,
which is the one thing the interface exists to show.

## Before you start

- A facility id the gateway accepts, and a callback URL registered against it.
  Without the second, calls are accepted and the answers have nowhere to go,
  which [blocked versus unanswerable](m2-integrator-call-panel.md) covers.
- A place to keep exchange state that outlives the page, from
  [never block the desk](m2-never-block-the-desk.md).

## What happens

Register the waiter before sending. A callback that arrives before the HTTP
response returns is a race the sandbox eventually wins.

Then hold five outcomes apart. These must not look alike:

| State | Means | Observed |
|---|---|---|
| sent | in the air | |
| accepted, waiting | `202`, nothing back yet | real patient, 340 ms |
| answered | the callback arrived | |
| refused before waiting | a synchronous `400`, nothing was ever pending | fictional patient, 91 ms |
| no answer in the window | accepted, then silence | real patient, 60,000 ms |

The fourth and fifth are the ones implementations collapse into each other. A
refused call closing its waiter through the same function as an answered one
renders a synchronous `400` as a green callback arrived. Fix that in the shared
function rather than at the call sites that reach it.

The fourth outcome is also useful. Generate link token validates the patient
before accepting the request, so an identity nobody holds is refused at once
with `400` and `ABDM-9999`, while a recognised one is accepted with `202` and
answers later. The two are distinguishable at the first response, so only a
recognised patient is worth waiting for. Note the code: `ABDM-9999` is the catch
all, and the message is the only part naming the cause.

No timeout is published for any of these, so the honest words for the fifth
outcome are that nothing arrived in the window you chose.

## How you know it worked

Send one linking call and read one row. It carries the request id, the outbound
call, the elapsed wait, and the callback when it lands, in one timeline.

Send a call for an identity nobody holds. The row shows refused within a few
hundred milliseconds, never shows waiting, and no waiter is left open.

## When it goes wrong

- A synchronous refusal shows as a completed exchange. The refusal path and the
  callback path share the function that closes the waiter.
- A callback cannot be matched to its call. The waiter was registered after
  sending, and the callback won the race.
- Every call is accepted and nothing ever answers. No callback URL is registered
  against the facility id, which is a configuration cause for a runtime symptom.
