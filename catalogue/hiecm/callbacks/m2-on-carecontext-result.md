---
id: hiecm.callback.m2-on-carecontext-result
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The outcome of the care context linking call you made
summary: >
  ABDM answers your link request on your bridge, and this answer is what
  says the care context is linked.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m2.yaml
    fetched: 2026-09-04
    hash: sha256:0fac31a008fe78b247ee46977a1b3931299915b47d458bc3236f494469d3513f
    note: >
      NHA's M2 file as ingested on this branch. The path, the headers and
      the payload shape below are the ones it declares for this result
      leg. Nothing here has been observed arriving from the sandbox.
verified:
  status: unverified
  against: docs-only
related:
  endpoints: [hiecm.endpoint.m2-hip-link-care-context]
  flows: [hiecm.flow.m2-link-care-context]
  concepts: [hiecm.concept.asynchronous-callbacks]
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
  internet. See [the callback URL](../../shared/sandbox/callback-url.md).
- The `REQUEST-ID` of the call this answers, stored before you sent it
  rather than after.
- A handler that answers quickly and does the work afterwards, because
  ABDM is waiting on the response.

## What happens

ABDM posts to `/v3/link/on_carecontext` on the base URL you registered for
your bridge. The path is relative to that URL, not to an ABDM host.

Headers: `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID`.

```json
{
  "abhaAddress": "<ABHA_ADDRESS>",
  "status": "<STATUS>",
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
answers. Match on it. Read `status` for the outcome and `abhaAddress` for the patient it
belongs to.

## How you know it worked

Your handler receives a POST carrying a `response.requestId` equal to the
`REQUEST-ID` you sent, and you return 200.

The gateway validates the body you send back, so a 200 carrying the wrong
body is still a failure. This callback is the linking flow's exit condition. Do not treat the
synchronous acknowledgement on the link call as success.

Not yet observed from this repository. Record the first real delivery
here.

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
  [ABDM-9999](../errors/abdm-9999.md).
