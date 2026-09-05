---
id: hiecm.callback.m2-call-back-api-for-notify-care-context-update
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: Call back API for notify care context update
summary: >
  This is a callback API triggered by HIE-CM to notify HIP/HRP about care context update response.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 9.3.7. The path, the method
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session, hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-m2-build
---

# Call back API for notify care context update

## In plain words

This is a callback API triggered by HIE-CM to notify HIP/HRP about care context update response.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A callback URL registered with ABDM and reachable from the public
  internet. See [the callback URL](shared.sandbox.callback-url).

## What happens

```bash
curl -X POST '<YOUR_BRIDGE_URL>/api/v3/links/context/on-notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path, the method and the body come from NHA's PHR V3 document,
section 9.3.7. That section gives no request body, so the body above is a placeholder rather than a transcription.

This one is inbound. ABDM posts it to the base URL you registered for
your bridge, so the path is relative to that URL and not to an ABDM host.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1024. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
