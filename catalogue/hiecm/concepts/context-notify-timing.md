---
id: hiecm.concept.context-notify-timing
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Context notify sent too soon after the link is refused
summary: >
  A context notify sent within seconds of the link callback comes back
  ERRORED with ABDM-1006 "No care context linked". The link takes a few
  seconds to become visible. Retry at 5, 15 and 60 seconds, driven by
  the on-notify callback.
sources:
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Section 3.4. Observed by an integrator on 2026-09-16, not yet run
      from this repository.
related:
  endpoints:
    - hiecm.endpoint.m2-link-care-context-notify
  callbacks:
    - hiecm.callback.m2-on-carecontext-result
    - hiecm.callback.m2-on-context-notify-result
  flows:
    - hiecm.flow.m2-link-care-context
  errors:
    - hiecm.error.abdm-1006
  concepts:
    - hiecm.concept.asynchronous-callbacks
    - hiecm.concept.linking-triggers-self-fetch
skills:
  - hiecm-m2-build
  - hiecm-m2-debug
---

# Context notify sent too soon after the link is refused

## In plain words

After [the link result](hiecm.callback.m2-on-carecontext-result) says a
care context is linked, you tell the patient's app about it with
[context notify](hiecm.endpoint.m2-link-care-context-notify). The link
is confirmed, but for a few seconds the notify path cannot see it yet.
A notify sent in that window is accepted with 202 and then refused on
[the notify callback](hiecm.callback.m2-on-context-notify-result):

```json
{
  "acknowledgement": {"status": "ERRORED"},
  "error": {"code": "ABDM-1006: ", "message": "No care context linked with given reference number"},
  "response": {"requestId": "<THE_REQUEST_ID_YOU_SENT>"}
}
```

The same notify, resent later, is acknowledged `SUCCESS`.

## Before you start

- A linked care context, confirmed on the link result callback. See [link a care context](hiecm.flow.m2-link-care-context).

## What happens

The window is not fixed. A five second delay succeeds sometimes and not
always; a resend minutes later succeeds every time. So do not pick one
delay. Drive a retry from the acknowledgement:

1. Wait five seconds after the link result, then send the notify.
2. Read the on-notify callback. `SUCCESS` ends the loop.
3. `ERRORED` with `ABDM-1006` and the message above: wait, then resend
   the same notification with a fresh `REQUEST-ID`. Back off 5, then
   15, then 60 seconds.
4. `ERRORED` with any other code is a real fault. Stop and read the code.

Match each acknowledgement to its attempt on `response.requestId`, and
strip the trailing colon and space from the code before comparing. See
[error body shapes](hiecm.concept.error-body-shapes).

## How you know it worked

You have understood this when you can answer both of these.

1. The notify returned 202 and the callback says `ERRORED`. Is the care
   context linked?
2. Your first attempt failed and the second succeeded fifteen seconds
   later. What, if anything, do you change in the link step?

## When it goes wrong

Treating the first `ERRORED` as final. The record is linked but the
patient's app is never told, and nothing else fails.

Retrying on every `ERRORED`. Only the ABDM-1006 message above is the
timing case; the rest need a fix, not a retry.

Marking the link failed because the notify failed. They are separate
steps with separate callbacks.
