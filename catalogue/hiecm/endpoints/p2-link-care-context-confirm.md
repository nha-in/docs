---
id: hiecm.endpoint.p2-link-care-context-confirm
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Confirm the link with the code the person received
summary: >
  Completes linking by sending back the code the facility issued.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 10.3.9. The path, the method, the
      request body and the error scenarios below are transcribed from it.
related:
  flows: [hiecm.flow.p2-discover-and-link]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p2-build
---

# Confirm the link with the code the person received

## In plain words

The last call in user initiated linking. The code proves the person is who the facility thinks they are.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The code the person received, and the link reference it belongs to.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/confirm' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{
  "token": 123456,
  "linkRefNumber": "4336268d-89a3-4c84-8674-aef42092d9fc"
}'
```

The path, the method and the body come from NHA's PHR V3 document,
section 10.3.9. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The confirmation is accepted and the care contexts are linked to the health address. Running discovery against that facility again returns them as linked.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1016, ABDM-1030, ABDM-1040, ABDM-1066, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
