---
id: hiecm.endpoint.p3-consent-fetch
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Fetch a consent artefact in full
summary: >
  Reads the whole artefact behind a consent id, including what it permits and for how long.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 6.11. The path, the method, the
      request body and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  flows: [hiecm.flow.p3-fetch-records]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p3-build
---

# Fetch a consent artefact in full

## In plain words

A consent id says permission exists. This returns what that permission actually covers.

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- A consent artefact id from a granted request.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/fetch' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "consentId": "d6a83f24-6c96-421e-b8b8-844e5344ef69" }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 6.11. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response carries the artefact with its date range, its health information types and its validity period. Check the validity before fetching anything under it.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1016, ABDM-1030, ABDM-1064, ABDM-1080, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
