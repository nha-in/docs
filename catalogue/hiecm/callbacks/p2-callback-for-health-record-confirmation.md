---
id: hiecm.callback.p2-callback-for-health-record-confirmation
type: callback
gateway: hiecm
milestone: P2
version: abdm-v3
title: HIE-CM callback for health record confirmation
summary: >
  Confirms the patient's health records. The patient makes this call from
  their PHR application.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 10.3.10. The path, the method, the request body
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session, hiecm.concept.asynchronous-callbacks]
skills:
  - hiecm-p2-build
---

# HIE-CM callback for health record confirmation

## In plain words

This API endpoint is designed to be invoked by the patient or user to confirm their health records. By using this API, patients can validate and confirm the linkage of their health information to their ABHA (Ayushman Bharat Health Account) address.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A callback URL registered with ABDM and reachable from the public
  internet. See [the callback URL](shared.sandbox.callback-url).

## What happens

```bash
curl -X POST '<YOUR_BRIDGE_URL>{callback\_url}/api/v3/hip/link/care-context/confirm' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "token": "123456", "linkRefNumber": "{{linkRefNumber}}" }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 10.3.10.

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
