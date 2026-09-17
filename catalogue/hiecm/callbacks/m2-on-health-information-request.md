---
id: hiecm.callback.m2-on-health-information-request
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: A request for the records a consent covers
summary: >
  A request for the records a consent covers.
sources:
  - file: catalogue/openapi/.raw/ABDM_M2_API_Swagger.yaml
    hash: sha256:cd96452677132da92c23858da7df6d72a7c886b510e6d006261f6d81ec483839
    fetched: 2026-08-25
    note: >
      NHA's M2 OpenAPI file.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The /api/v3 path, the empty requestId and timestamp in the body, and the arrival within seconds of a link. Observed by an integrator on 2026-09-16, not yet run from this repository.
related:
  errors: [hiecm.error.abdm-9999]
  concepts: [hiecm.concept.asynchronous-callbacks, hiecm.concept.linking-triggers-self-fetch]
  endpoints: [hiecm.endpoint.m2-hip-health-information-on-request]
skills:
  - hiecm-m2-build
---

# A request for the records a consent covers

## In plain words

Inbound to the HIP, carrying the consent id, the date range, the data push URL and the encryption parameters. NHA states 20 minutes from this request to the data push.

This is something ABDM sends to you. It arrives at the URL you registered, not at a URL you choose per request.

## Before you start

- A callback URL registered with ABDM and reachable from the public internet. See [the callback URL](shared.sandbox.callback-url).
- A handler that acknowledges quickly and processes afterwards, because ABDM is waiting.
- The `REQUEST-ID` of the call this answers, stored when you sent it.

## What happens

ABDM posts to `/api/v3/hip/health-information/request` on your registered base URL.

The body carries `transactionId` and `hiRequest` with `consent`, `dateRange`, `dataPushUrl` and `keyMaterial`. The body's own `requestId` and `timestamp` arrive as empty strings, so read both from the `REQUEST-ID` and `TIMESTAMP` headers.

Acknowledge with a 202 quickly, then call [the acknowledgement endpoint](hiecm.endpoint.m2-hip-health-information-on-request) and push the records. After a fresh link this request can arrive within about ten seconds, because the patient's PHR app fetches newly linked records on its own. See [linking triggers a self requested fetch](hiecm.concept.linking-triggers-self-fetch).

## How you know it worked

Your handler receives a POST carrying the same `REQUEST-ID` you sent on the call this answers, and you return 202 within the timeout.

Not yet observed from this repository. Record the first real delivery here.

## When it goes wrong

- It never arrives. The most common report by far, and nearly always the callback URL: not public, not registered, or too slow.
- It arrives twice. Deliveries can repeat, so key on the `REQUEST-ID` and make the handler idempotent.
- It arrives before you stored the request id. Store it before you send, not after.
- Your handler returns an error and ABDM stops retrying. See [ABDM-9999](hiecm.error.abdm-9999).

