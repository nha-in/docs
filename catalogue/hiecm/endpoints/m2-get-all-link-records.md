---
id: hiecm.endpoint.m2-get-all-link-records
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: GET All Link records
summary: >
  This API provide all the linked care contexts for ABHA Address.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 9.3.5. The path, the method
      and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m2-build
---

# GET All Link records

## In plain words

This API provide all the linked care contexts for ABHA Address.

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X GET 'https://dev.abdm.gov.in/api/hiecm/hip/v3/link/patient/links' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path, the method and the body come from NHA's PHR V3 document,
section 9.3.5. That section gives no request body, so the body above is a placeholder rather than a transcription.

## How you know it worked

NHA's document gives this response:

```json
{ "patient": { "id": "user\_1992@sbx", "links": [ { "hip": { "id": "TestClinicHIP", "name": "TestClinicHIP", "type": "HIP" }, "referenceNumber": "user\_1992@sbx", "display": "User Record", "hiType": "HealthDocumentRecord", "careContexts": [ { "referenceNumber": "e707c945-3672-4b85-8525-4c7e620ef301", "display": "Visited on 08-Feb-2024 09:00:00 Visit Type as Out Patient" } ], "dateCreated": "2024-07-18T11:49:15.736Z" } ] } }
```

Nothing here has been called from this repository, so treat the shape as
unconfirmed until you have seen one.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1016, ABDM-1030, ABDM-1065. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
