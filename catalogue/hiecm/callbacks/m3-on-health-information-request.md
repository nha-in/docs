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
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-9999]
  concepts: [hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-m3-build
---

# Acknowledgement of a health information request

## In plain words

Carries the transaction id, the request id and the current status. This is an acknowledgement, not the records. The records arrive at the data push URL you supplied.

Transcribed from NHA's milestone document. Not run against the ABDM sandbox, so the payload is unconfirmed.

This is something ABDM sends to you. It arrives at the URL you registered, not at a URL you choose per request.

## Before you start

- A callback URL registered with ABDM and reachable from the public internet. See [the callback URL](../../shared/sandbox/callback-url.md).
- A handler that acknowledges quickly and processes afterwards, because ABDM is waiting.
- The `REQUEST-ID` of the call this answers, stored when you sent it.

## What happens

ABDM posts to `/api/v3/hiu/health-information/on-request` on your registered base URL.

The payload shape and an example are in the `webhooks` section of `catalogue/openapi/hiecm/v3/hiecm-m3.yaml`, transcribed from NHA's collection with values scrubbed.

Acknowledge with a 202 quickly. Do the work afterwards.

## How you know it worked

Your handler receives a POST carrying the same `REQUEST-ID` you sent on the call this answers, and you return 202 within the timeout.

Not yet observed from this repository. Record the first real delivery here.

## When it goes wrong

- It never arrives. The most common report by far, and nearly always the callback URL: not public, not registered, or too slow.
- It arrives twice. Deliveries can repeat, so key on the `REQUEST-ID` and make the handler idempotent.
- It arrives before you stored the request id. Store it before you send, not after.
- Your handler returns an error and ABDM stops retrying. See [ABDM-9999](../errors/abdm-9999.md).

