---
id: hiecm.endpoint.p1-get-certificate-public-key
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: GET Certificate (Public key)
summary: >
  Returns the public certificate and the algorithm to encrypt with, which
  sensitive fields need before they are sent.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.44. The path, the method
      and the error scenarios below are transcribed from it.
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# GET Certificate (Public key)

## In plain words

This API will return the certificate (public-key) along with the encryption algorithm.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/login/public/certificate' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.44. That section gives no request body, so the body above is a placeholder rather than a transcription.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: none recorded in this section. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
