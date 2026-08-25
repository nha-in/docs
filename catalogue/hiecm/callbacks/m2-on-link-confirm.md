---
id: hiecm.callback.m2-on-link-confirm
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: Confirmation of a link, carrying the token the patient approved
summary: >
  Confirmation of a link, carrying the token the patient approved.
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

# Confirmation of a link, carrying the token the patient approved

## In plain words

Inbound to the HIP. A duplicate arrives as ABDM-1105, and a rejected answer as ABDM-1111.

Transcribed from NHA's milestone document. Not run against the ABDM sandbox, so the payload is unconfirmed.

This is something ABDM sends to you. It arrives at the URL you registered, not at a URL you choose per request.

## Before you start

- A callback URL registered with ABDM and reachable from the public internet. See [the callback URL](../../shared/sandbox/callback-url.md).
- A handler that acknowledges quickly and processes afterwards, because ABDM is waiting.
- The `REQUEST-ID` of the call this answers, stored when you sent it.

## What happens

ABDM posts to `/v0.5/links/link/confirm` on your registered base URL.

**No payload is documented.** NHA's specification carries no callbacks at all, and NHA's collection for this milestone does not include this one. The path is declared so the exchange is visible, but the body shape is unknown and is not guessed here.

Acknowledge with a 202 quickly. Do the work afterwards.

## How you know it worked

Your handler receives a POST carrying the same `REQUEST-ID` you sent on the call this answers, and you return 202 within the timeout.

Not yet observed from this repository. Record the first real delivery here.

## When it goes wrong

- It never arrives. The most common report by far, and nearly always the callback URL: not public, not registered, or too slow.
- It arrives twice. Deliveries can repeat, so key on the `REQUEST-ID` and make the handler idempotent.
- It arrives before you stored the request id. Store it before you send, not after.
- Your handler returns an error and ABDM stops retrying. See [ABDM-9999](../errors/abdm-9999.md).

