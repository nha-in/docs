---
id: hiecm.endpoint.p1-enrollment-address-suggestion
type: endpoint
gateway: hiecm
milestone: P1
version: abdm-v3
title: Ask for address suggestions
summary: >
  Returns usable health addresses for the person to choose from, built from what registration already knows.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 3.8. The path, the method, the
      request body and the error scenarios below are transcribed from it.
related:
  flows: [hiecm.flow.p1-create-abha-address]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p1-build
---

# Ask for address suggestions

## In plain words

A person should not have to invent an address. This returns candidates for the transaction in hand.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The `txnId` from a verified registration.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/app/enrollment/suggestion' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "txnId": "*{{transactionId}}*", "firstName": "John", "lastName": "Doe", "dayOfBirth": "14", "monthOfBirth": "11", "yearOfBirth": "1998" }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 3.8. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The response lists candidate addresses. They are suggestions, not reservations: the person can still type their own.

NHA's document gives this response:

```json
{ "txnId": "4765527e-\*\*\*\*-\*\*\*\*-91ec-be039fbf60f8", "abhaAddressList": [ "doe.1411", "johndoe", "john\_doe", "johndoe14", "johndoe.14", "john\_14111998", "john\_1411", "john14111998", "john1411" ] }
```

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1030, ABDM-9999. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
