---
id: hiecm.callback.m2-on-data-notification
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: The provider pushes encrypted health information to the URL named in the request.
summary: >
  The provider pushes encrypted health information to the URL named in
  the request..
sources:
  - file: catalogue/openapi/.raw/ABDM_M2_API_Swagger.yaml
    hash: sha256:cd96452677132da92c23858da7df6d72a7c886b510e6d006261f6d81ec483839
    fetched: 2026-08-25
    note: >
      NHA's M2 OpenAPI file.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-9999]
  concepts: [hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-m2-build
---

# The provider pushes encrypted health information to the URL named in the request.

## In plain words

The provider pushes encrypted health information to the URL named in the request.

Payload transcribed from NHA's own collection for this milestone.

This is something ABDM sends to you. It arrives at the URL you registered, not at a URL you choose per request.

## Before you start

- A callback URL registered with ABDM and reachable from the public internet. See [the callback URL](../../shared/sandbox/callback-url.md).
- A handler that acknowledges quickly and processes afterwards, because ABDM is waiting.
- The `REQUEST-ID` of the call this answers, stored when you sent it.

## What happens

ABDM posts to `/api-hiu/data/notification` on your registered base URL.

**The payload is not yet published.** The path is declared so the exchange is visible.

Acknowledge with a 202 quickly. Do the work afterwards.

## How you know it worked

Your handler receives a POST carrying the same `REQUEST-ID` you sent on the call this answers, and you return 202 within the timeout.

Not yet observed from this repository. Record the first real delivery here.

## When it goes wrong

- It never arrives. The most common report by far, and nearly always the callback URL: not public, not registered, or too slow.
- It arrives twice. Deliveries can repeat, so key on the `REQUEST-ID` and make the handler idempotent.
- It arrives before you stored the request id. Store it before you send, not after.
- Your handler returns an error and ABDM stops retrying. See [ABDM-9999](../errors/abdm-9999.md).

