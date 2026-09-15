---
id: hiecm.callback.p2-callback-on-health-record-discover
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: HIE-CM callback on Health record discover
summary: >
  This is a callback API invoked by the **HIE-CM** for sharing the response of health record discover.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 10.3.4. The path, the method, the request body
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session, hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-p2-build
---

# HIE-CM callback on Health record discover

## In plain words

This is a callback API invoked by the **HIE-CM** for sharing the response of health record discover.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A callback URL registered with ABDM and reachable from the public
  internet. See [the callback URL](shared.sandbox.callback-url).

## What happens

```bash
curl -X POST '<YOUR_BRIDGE_URL>{callback\_url}/api/v3/hiu/patient/care-context/on-discover' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "transactionId": "0d36501c-551a-4bb5-b247-eec4bb42984b", "patient": [ { "referenceNumber": "example01", "display": "abcd-display", "careContexts": [ { "referenceNumber": "abcd", "display": "123-display" } ], "hiType": "PRESCRIPTION", "count": 1 } ], "createdAt": "2023-06-13T08:05:43.030Z", "response": { "requestId": "d89525a2-3a3f-4d39-98b5-477afb1865f6" } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 10.3.4.

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
