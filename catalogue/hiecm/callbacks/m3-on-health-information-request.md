---
id: hiecm.callback.m3-on-health-information-request
type: callback
gateway: hiecm
milestone: M3
version: abdm-v3
title: Acknowledgement of a health information request
summary: >
  Acknowledgement of a health information request.
sources:
  - file: catalogue/openapi/.raw/ABDM_M3_API_Swagger.yaml
    hash: sha256:6d56fd91a3f75575c4382de1489ad4a6a0091d0eece9dfa5278c4d248f6fcf6b
    fetched: 2026-08-25
    note: >
      NHA's M3 OpenAPI file.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The REQUESTED status and the push racing this callback. Observed by an integrator on 2026-09-16, not yet run from this repository.
related:
  errors: [hiecm.error.abdm-9999]
  concepts: [hiecm.concept.asynchronous-callbacks, hiecm.concept.artefact-date-range]
  endpoints: [hiecm.endpoint.m3-hiu-health-information-request]
  flows: [hiecm.flow.m3-fetch-records]
skills:
  - hiecm-m3-build
---

# Acknowledgement of a health information request

## In plain words

Carries the transaction id, the request id and the current status. This is an acknowledgement, not the records. The records arrive at the data push URL you supplied.

This is something ABDM sends to you. It arrives at the URL you registered, not at a URL you choose per request.

## Before you start

- A callback URL registered with ABDM and reachable from the public internet. See [the callback URL](shared.sandbox.callback-url).
- A handler that acknowledges quickly and processes afterwards, because ABDM is waiting.
- The `REQUEST-ID` of the call this answers, stored when you sent it.

## What happens

ABDM posts to `/api/v3/hiu/health-information/on-request` on your registered base URL.

The body carries `hiRequest.transactionId` and `hiRequest.sessionStatus`, and `sessionStatus` arrives as `REQUESTED`, not `ACKNOWLEDGED`:

```json
{
  "hiRequest": {
    "transactionId": "<TRANSACTION_ID>",
    "sessionStatus": "REQUESTED"
  },
  "response": {
    "requestId": "<THE_REQUEST_ID_YOU_SENT>"
  }
}
```

Store the `transactionId` against the consent id. The push to your `dataPushUrl` can land in the same second as this callback, so key the push route on the consent id you put in the URL rather than on a transaction id you may not have stored yet.

Acknowledge with a 202 quickly. Do the work afterwards.

## How you know it worked

Your handler receives a POST whose `response.requestId` equals the `REQUEST-ID` you sent on the health information request, with `hiRequest.sessionStatus` of `REQUESTED`, and you return 202.

## When it goes wrong

- It never arrives. The most common report by far, and nearly always the callback URL: not public, not registered, or too slow.
- It arrives twice. Deliveries can repeat, so key on the `REQUEST-ID` and make the handler idempotent.
- It arrives before you stored the request id. Store it before you send, not after.
- Your handler returns an error and ABDM stops retrying. See [ABDM-9999](hiecm.error.abdm-9999).

