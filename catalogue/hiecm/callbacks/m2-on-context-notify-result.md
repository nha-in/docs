---
id: hiecm.callback.m2-on-context-notify-result
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The outcome of the care context notify call you made
summary: >
  ABDM answers your notify call on your bridge, saying whether the
  notification was accepted.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m2.yaml
    fetched: 2026-09-04
    hash: sha256:0fac31a008fe78b247ee46977a1b3931299915b47d458bc3236f494469d3513f
    note: >
      NHA's M2 file as ingested on this branch. The path, the headers and
      the payload shape below are the ones it declares for this result
      leg. Nothing here has been observed arriving from the sandbox.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The ERRORED acknowledgement with ABDM-1006 when the notify races the link. Observed by an integrator on 2026-09-16, not yet run from this repository.
related:
  endpoints: [hiecm.endpoint.m2-link-care-context-notify]
  flows: [hiecm.flow.m2-link-care-context]
  concepts: [hiecm.concept.asynchronous-callbacks, hiecm.concept.context-notify-timing]
  errors: [hiecm.error.abdm-1006, hiecm.error.abdm-9999]
skills:
  - hiecm-m2-build
---

## In plain words

Notifying ABDM that a care context changed is asynchronous like the rest
of M2. The acknowledgement arrives here.

This is the answer, not the acknowledgement. The acknowledgement came
back on the call itself.

## Before you start

- A callback URL registered with ABDM and reachable from the public
  internet. See [the callback URL](shared.sandbox.callback-url).
- The `REQUEST-ID` of the call this answers, stored before you sent it
  rather than after.
- A handler that answers quickly and does the work afterwards, because
  ABDM is waiting on the response.

## What happens

ABDM posts to `/api/v3/links/context/on-notify` on the base URL you registered for
your bridge. The path is relative to that URL, not to an ABDM host.

Headers: `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID`.

```json
{
  "acknowledgement": {
    "status": "SUCCESS"
  },
  "error": {
    "code": "<CODE>",
    "message": "<MESSAGE>"
  },
  "response": {
    "requestId": "<REQUEST_ID>"
  }
}
```

`response.requestId` echoes the `REQUEST-ID` you sent on the call this
answers. Match on it. A body carrying `acknowledgement.status` of `SUCCESS` is the success
case. `ERRORED` with `error.code` of `ABDM-1006: ` and message
`No care context linked with given reference number` means the notify ran
ahead of the link. Note the trailing colon and space on the code. Retry
the notify at 5, 15 and 60 seconds. See
[context notify timing](hiecm.concept.context-notify-timing).

## How you know it worked

Your handler receives a POST carrying a `response.requestId` equal to the
`REQUEST-ID` you sent, and you return 200.

The gateway validates the body you send back, so a 200 carrying the wrong
body is still a failure.

## When it goes wrong

- It never arrives. The most common report by far, and nearly always the
  callback URL: not public, not registered, or too slow to answer.
- It arrives twice. Deliveries can repeat, so key on `response.requestId`
  and make the handler idempotent.
- It arrives before you stored the request id, so nothing matches. Store
  the id before you send, not after.
- It carries `error` rather than the success field, which is the answer
  and not a delivery fault. Read the code and stop retrying the original
  call.
- Your handler returns an error and ABDM stops retrying. See
  [ABDM-9999](hiecm.error.abdm-9999).
