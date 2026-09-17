---
id: hiecm.callback.p2-response-on-health-record-on-confirm
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: HIE-CM response on health record on-confirm
summary: >
  This is callback API will be invoked by the **HIE-CM** to share the response of on-confirm API from HIP.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 10.3.12. The path, the method, the request body
      and the error scenarios below are transcribed from it.
related:
  concepts: [hiecm.concept.gateway-session, hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-p2-build
---

# HIE-CM response on health record on-confirm

## In plain words

This is callback API will be invoked by the **HIE-CM** to share the response of on-confirm API from HIP.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A callback URL registered with ABDM and reachable from the public
  internet. See [the callback URL](shared.sandbox.callback-url).

## What happens

```bash
curl -X POST '<YOUR_BRIDGE_URL>{callback\_url}/api/v3/hiu/patient/care-context/on-confirm' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "patient": [ { "referenceNumber": "4336268d-89a3-4c84-8674-aef42092d9fc", "display": "abcdefgdisplay", "careContexts": [ { "referenceNumber": "1234", "display": "1234-display" } ], "hiType": "PRESCRIPTION", "count": 1 } ], "response": { "requestId": "f207e461-1994-4274-9b86-554384f170ab" } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 10.3.12.

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
