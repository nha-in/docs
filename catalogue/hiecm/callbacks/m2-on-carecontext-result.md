---
id: hiecm.callback.m2-on-carecontext-result
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The outcome of the care context linking call you made
summary: >
  ABDM answers your link request on your bridge. A body with no `error`
  object is a successful link, and its `status` reads
  "Successfully Linked care context".
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m2.yaml
    fetched: 2026-09-04
    hash: sha256:0fac31a008fe78b247ee46977a1b3931299915b47d458bc3236f494469d3513f
    note: >
      NHA's M2 file as ingested on this branch, for the path, the headers
      and the field names.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The prose status value, the absence of error as the success test,
      and delivery within a second of the link call. Observed by an
      integrator on 2026-09-16, not yet run from this repository.
related:
  endpoints: [hiecm.endpoint.m2-hip-link-care-context]
  flows: [hiecm.flow.m2-link-care-context]
  concepts: [hiecm.concept.asynchronous-callbacks, hiecm.concept.context-notify-timing]
  errors: [hiecm.error.abdm-9999]
skills:
  - hiecm-m2-build
---

## In plain words

You told ABDM that a patient's records exist at your facility. The call
was accepted at once. Whether the care context actually linked is decided
here.

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

ABDM posts to `/api/v3/link/on_carecontext` on the base URL you
registered for your bridge. The path is relative to that URL, not to an
ABDM host.

Headers: `REQUEST-ID`, `TIMESTAMP`, `X-HIP-ID`, and `Authorization`
carrying the gateway's JWT. See
[proving a callback really came from ABDM](hiecm.concept.callback-authenticity).

A successful link:

```json
{
  "abhaAddress": "<ABHA_ADDRESS>",
  "status": "Successfully Linked care context",
  "response": {
    "requestId": "<THE_REQUEST_ID_YOU_SENT>"
  }
}
```

A failed link carries an `error` object with `code` and `message` in
place of the success status.

`response.requestId` echoes the `REQUEST-ID` you sent on the call this
answers. Match on it. Then test for the presence of `error`: absent means
linked. Do not compare `status` against `SUCCESS`; it is a sentence, not
an enum, and an integration that expects `SUCCESS` marks every good link
as failed.

## How you know it worked

Your handler receives a POST with `response.requestId` equal to the
`REQUEST-ID` you sent, no `error` object, and `status` of
`Successfully Linked care context`, usually within one second of the
link call. You return 200.

The gateway validates the body you send back, so a 200 carrying the wrong
body is still a failure. This callback is the linking flow's exit
condition. Do not treat the synchronous acknowledgement on the link call
as success.

Do not send the context notify the moment this arrives. The link takes a
few seconds to become visible to the notify path. See
[context notify timing](hiecm.concept.context-notify-timing).

## When it goes wrong

- It never arrives. The most common report by far, and nearly always the
  callback URL: not public, not registered, registered by another system
  sharing your client id, or too slow to answer. See
  [who owns the bridge URL](hiecm.concept.bridge-url-ownership).
- It arrives twice. Deliveries can repeat, so key on `response.requestId`
  and make the handler idempotent.
- It arrives before you stored the request id, so nothing matches. Store
  the id before you send, not after.
- It carries `error` rather than the success status, which is the answer
  and not a delivery fault. Read the code and stop retrying the original
  call.
- Your handler returns an error and ABDM stops retrying. See
  [ABDM-9999](hiecm.error.abdm-9999).
