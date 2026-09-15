---
id: hiecm.callback.m2-link-token-generation-call-back
type: callback
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link token generation – Call Back API
summary: >
  This is a callback API triggered by HIE-CM to HIP/HRP to get the link token.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 9.3.2. The path, the method, the request body
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session, hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-m2-build
---

# Link token generation – Call Back API

## In plain words

This is a callback API triggered by HIE-CM to HIP/HRP to get the link token.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A callback URL registered with ABDM and reachable from the public
  internet. See [the callback URL](shared.sandbox.callback-url).

## What happens

```bash
curl -X POST '<YOUR_BRIDGE_URL>{callback\_url}/api/v3/hip/token/on-generate-token' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "abhaAddress": "10000262131640@sbx", "linkToken": "eyJhbGciOiJSUzUxMiJ9.eyJoaXBJZCI6Ik1BREhVUkFfSElQIiwic3ViIjoiMTAwMDAyNjIxMzE2 NDBAYWJkbSIsImFiaGFOdW1iZXIiOjEwMDAwMjYyMTMxNjQwLCJleHAiOjE2OTc1OTY2MDAsImlhdCI6MT Y4MTgyODYwMCwidHJhbnNhY3Rpb25JZCI6IjM1YjkzYzQwLWM1OGQtNDk2ZC04MDgxLWY1OTM0MWV kNGNkNSIsImFiaGFBZGRyZXNzIjoiMTAwMDAyNjIxMzE2NDBAYWJkbSJ9.q- p8eHxdacvSg2QPzm7vY7\_kLHYCQXwkbkAcEvSwcp5HFAdtUyNoZ50LyquQih2Lbxv0DxmDa3YxyMnQ Y37GJsBpcs- 4OQmUk5tvoad1HYGjBVMlq0tVae7gpFHnonSSyhkVPGLTO5G4tvghvcK8xcMqoQol\_lmR26VIGCue07 - nx6K4xPueUOQeeqKMXPJs115wPunafT3LT24k9KEHzbmDcWDJjUouBZ4TKAXcGrfwOuhGM0eWrSMZ99PAlTHxHCZnJybUWL 9E2MH6bpq87wDhFPrq0WLzhLJhynnfaWxrd7JkFdUtDygkpaiRh3V12xVqx8 eWaSwxdwvCLut4A", "response": { "requestId": "d6d6d056-666a-4af8-b680-4c61bcb29dd4" } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 9.3.2.

This one is inbound. ABDM posts it to the base URL you registered for
your bridge, so the path is relative to that URL and not to an ABDM host.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1016, ABDM-1030, ABDM-1037, ABDM-1038, ABDM-1062, ABDM-1063, ABDM-1064, ABDM-1066. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
