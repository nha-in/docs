---
id: hiecm.endpoint.p2-link-care-context-init
type: endpoint
gateway: hiecm
milestone: P2
version: abdm-v3
title: Start linking the care contexts the person chose
summary: >
  Begins linking, which the facility answers by sending the person a code.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 10.3.5. The path, the method, the
      request body and the error scenarios below are transcribed from it.
related:
  flows: [hiecm.flow.p2-discover-and-link]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p2-build
---

# Start linking the care contexts the person chose

## In plain words

The person has chosen what to link. This starts it, and the facility replies with how it will confirm, usually a code to the number it holds.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- Care contexts from a discovery response, filtered so that nothing already linked is offered.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/init' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{ "transactionId": "66446ece-396b-4f22-a1a6-756196fdffc9", "abhaAddress": "user\_123@sbx", "patient": [ { "referenceNumber": "example01", "careContexts": [ { "referenceNumber": "123" } ], "hiType": "PRESCRIPTION", "count": 1 } ] }'
```

The path, the method and the body come from NHA's PHR V3 document,
section 10.3.5. The sandbox host for the PHR calls is
`https://abhasbx.abdm.gov.in`; production is
`https://apis.abdm.gov.in/phr/api/phr/app/v3`. Nothing here has been
called from this repository.

## How you know it worked

The acknowledgement is accepted and the link init callback names how the facility will confirm. The person then receives the code.

## When it goes wrong

The error scenarios NHA records against this call: ABDM-1010, ABDM-1016, ABDM-1030, ABDM-1057, ABDM-1059, ABDM-1065. The PHR codes
are the AS series, recorded once against P1 for the whole patient side and
listed in full in the P1 reference. A code that is not in that list is one
this document names and the specification does not.
