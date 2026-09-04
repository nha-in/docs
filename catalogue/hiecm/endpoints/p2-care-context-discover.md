---
id: hiecm.endpoint.p2-care-context-discover
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Ask a facility what records it holds
summary: >
  Sends a discovery request to a facility, carrying the person as the facility would know them.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 10.3.1. The path, the method, the
      request body and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  flows: [hiecm.flow.p2-discover-and-link]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p2-build
---

# Ask a facility what records it holds

## In plain words

Discovery asks one facility whether it holds records for this person. The facility answers on a callback, not on this response.

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- The verified mobile number, the health address, and the name, year or date of birth and gender as the facility would hold them.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/patient/care-context/discover' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "hipId": "ABDM\_HIP", "unverifiedIdentifiers": [ { "type": "ABHA\_ADDRESS", "value": "shaik.XXXX@sbx" } ] }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 10.3.1. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The acknowledgement says the request was accepted. The care contexts arrive on the discovery callback, and NHA expects a facility to answer within 10 seconds.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1016, ABDM-1030, ABDM-1031, ABDM-1066, ABDM-1103, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
