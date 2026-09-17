---
id: hiecm.callback.m2-on-generate-token-result
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The link token you asked for, or why it was refused
summary: >
  ABDM answers the link token request on your bridge, carrying the token
  itself when it succeeded.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-m2.yaml
    fetched: 2026-09-04
    hash: sha256:0fac31a008fe78b247ee46977a1b3931299915b47d458bc3236f494469d3513f
    note: >
      NHA's M2 file as ingested on this branch. The path, the headers and
      the payload shape below are the ones it declares for this result
      leg. Nothing here has been observed arriving from the sandbox.
related:
  endpoints: [hiecm.endpoint.m2-generate-link-token]
  flows: [hiecm.flow.m2-link-care-context]
  concepts: [hiecm.concept.asynchronous-callbacks]
  errors: [hiecm.error.abdm-9999]
skills:
  - hiecm-m2-build
---

## In plain words

Generating a link token is asynchronous. Your call is accepted, and the
token arrives here.

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

ABDM posts to `/v3/hip/token/on-generate-token` on the base URL you registered for
your bridge. The path is relative to that URL, not to an ABDM host.

Headers: `REQUEST-ID`, `TIMESTAMP` and `X-HIP-ID`.

```json
{
  "abhaAddress": "<ABHA_ADDRESS>",
  "linkToken": "<LINK_TOKEN>",
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
answers. Match on it. A body carrying `linkToken` is the success case, and that token is what
later linking calls for this patient carry.

## How you know it worked

Your handler receives a POST carrying a `response.requestId` equal to the
`REQUEST-ID` you sent, and you return 200.

The gateway validates the body you send back, so a 200 carrying the wrong
body is still a failure. Store the `linkToken` against the patient before you answer. NHA gives
its validity as six months, and a token you received but did not keep
means generating another.

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
  [ABDM-9999](hiecm.error.abdm-9999).
