---
id: hiecm.endpoint.p1-enrollment-address-exists
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Check whether an address is taken
summary: >
  Says whether the health address the person chose already exists.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.9. The path, the method, the
      request body and the error scenarios below are transcribed from it.
verified:
  status: unverified
  against: docs-only
related:
  flows: [hiecm.flow.p1-create-abha-address]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# Check whether an address is taken

## In plain words

Checks one address before you try to create it, so a person types a name once rather than being refused after the fact.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- A candidate address, and the transaction it belongs to.

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/isExists' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.9. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response says whether the address exists. A free address is what the create call needs.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1006. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
