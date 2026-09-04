---
id: hiecm.callback.p2-profile-share-callback
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: Profile share – Callback
summary: >
  This is a callback API for patient share API.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 5.3.2. The path, the method, the request body
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session, hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-p2-build
---

# Profile share – Callback

## In plain words

This is a callback API for patient share API.

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- A callback URL registered with ABDM and reachable from the public
  internet. See [the callback URL](../../shared/sandbox/callback-url.md).

## What happens

```bash
curl -X POST '<YOUR_BRIDGE_URL>{callback\_url}/api/v3/hip/patient/share' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "intent": "PROFILE\_SHARE", "metaData": { "hipId": "MAYUR\_HIP", "context": "ABC123", "hprId": "abdulkalam@abdm", "latitude": "-38.679", "longitude": "58.498" }, "profile": { "patient": { "abhaNumber": 9117838615XXXX, "abhaAddress": "91178XXXX@sbx", "name": "User 1", "gender": "M", "dayOfBirth": "XX", "monthOfBirth": "XX", "yearOfBirth": "XXXX", "address": { "line": "C/O Sandipan Kshirsagar Ambejogai Road Renuka Nagar", "district": **null**, "state": **null**, "pincode": **null** }, "phoneNumber": "987654XXXX" } } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 5.3.2.

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
