---
id: hiecm.endpoint.p3-subscription-init
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Request a subscription to a person's account
summary: >
  Asks to be told when the person's care contexts and consents change.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 8.3.2. The path, the method, the
      request body and the error scenarios below are transcribed from it.
related:
  flows: [hiecm.flow.p3-subscribe-and-auto-approve]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p3-build
---

# Request a subscription to a person's account

## In plain words

A subscription is how an application hears about a new record without polling. It is requested here and approved separately.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The person's agreement, taken before the request is sent.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/subscription-requests/v3/init' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{
  "subscription": {
    "purpose": {
      "text": "Care Management",
      "code": "CAREMGT",
      "refUri": "www.abdm.gov.in"
    },
    "patient": {
      "id": "xxxxx@sbx"
    },
    "hiu": {
      "id": "{ Health locker/PHR ID}"
    },
    "hips": [
      {
        "id": "HIP_ID",
        "name": "HIP_NAME",
        "type": "HIP"
      }
    ],
    "categories": [
      "LINK",
      "DATA"
    ],
    "period": {
      "from": "2024-06-01T09:00:00.000Z",
      "to": "2124-12-31T09:00:00.000Z"
    }
  }
}'
```

The path, the method and the body come from NHA's PHR V3 document,
section 8.3.2. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The request is accepted and its outcome arrives on the subscription callback. An approved subscription then notifies you of a new or modified care context, a new consent request and a new subscription request.

## When it goes wrong

The error scenarios NHA records against this call: none recorded in this section. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
