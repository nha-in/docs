---
id: hiecm.endpoint.p1-login-using-password-search-user
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Login using Password Search user
summary: >
  This API will internally call service to get the ABHA Address details along with auth methods for given ABHA address as a input.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.23. The path, the method, the request body
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# Login using Password Search user

## In plain words

This API will internally call service to get the ABHA Address details along with auth methods for given ABHA address as a input.

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/search' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "abhaAddress": "johndoe@sbx" }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.23.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1211, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
