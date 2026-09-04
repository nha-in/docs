---
id: hiecm.callback.p3-consent-request-on-status-callback
type: callback
gateway: hiecm
milestone: P3
version: abdm-v3
title: Consent request on-status (Callback)
summary: >
  This API is used to send the status of consent request back to HIU through HIE-CM
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 6.10. The path, the method
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session, hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-p3-build
---

# Consent request on-status (Callback)

## In plain words

This API is used to send the status of consent request back to HIU through HIE-CM

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- A callback URL registered with ABDM and reachable from the public
  internet. See [the callback URL](../../shared/sandbox/callback-url.md).

## What happens

```bash
curl -X POST '<YOUR_BRIDGE_URL>{callback\_url}/api/v3/hiu/consent/request/on-status' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path, the method and the body come from NHA's PHR V3 document,
section 6.10. That section gives no request body, so the body above is a placeholder rather than a transcription.

This one is inbound. ABDM posts it to the base URL you registered for
your bridge, so the path is relative to that URL and not to an ABDM host.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: none recorded in this section. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
