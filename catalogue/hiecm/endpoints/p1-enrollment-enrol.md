---
id: hiecm.endpoint.p1-enrollment-enrol
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Create the health address
summary: >
  Creates the address the person chose and completes their registration.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.10. The path, the method, the
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

# Create the health address

## In plain words

The call that creates the address. Everything before it was checking.

## Before you start

- A gateway session token. See [the gateway session](../concepts/gateway-session.md).
- A verified transaction, and an address the existence check said is free.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/enrol' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "txnId": "22387064-45ea-42d4-b6c5-8b86dbec6fe5", "phrDetails": { "mobile": " *{{encrypted mobile-number }}*", "firstName": "John", "middleName": "", "lastName": "Doe", "yearOfBirth": "1998", "dayOfBirth": "14", "monthOfBirth": "11", "gender": "M", "email": "", "profilePhoto": "{{base-64-encoded-profile-photo}}", "stateCode": "9", "districtCode": "135", "pinCode": 232101, "address": "Street number 4, sector 12", "stateName": "Maharashtra", "districtName": "Nashik", "ABHANumber": "XX-XXXX-XXXX-1234", "abhaAddress": "johndoe@sbx", "password": "*{{encrypted password}}*" } }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.10. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response carries the created address and the profile behind it, marked Self-Declared or KYC Verified according to the path taken.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
