---
id: hiecm.endpoint.p3-edit-subscription
type: endpoint
gateway: hiecm
milestone: P3
version: abdm-v3
title: Edit Subscription
summary: >
  This is the API that will be invoked by the patient/user from PHR application to edit date of the subscription. Edit the subscription is required as user can change date range. HIP/HI type can’t be ed
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 8.3.9. The path, the method
      and the error scenarios below are transcribed from it.
related:
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-p3-build
---

# Edit Subscription

## In plain words

This is the API that will be invoked by the patient/user from PHR application to edit date of the subscription. Edit the subscription is required as user can change date range. HIP/HI type can’t be edited.

## Before you start

- A gateway session token. See [the gateway session](hiecm.concept.gateway-session).
- The identifiers this call names in its body, held from the step before it.

## What happens

```bash
curl -X PUT 'https://dev.abdm.gov.in/api/hiecm/subscription-' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'Content-Type: application/json' \
  -d '{
  "hiuId": "<HIU_ID>",
  "subscriptionEditAndApprovalRequest": {
    "isApplicableForAllHIPs": true,
    "includedSources": [
      {
        "hiTypes": [
          "DiagnosticReport",
          "Prescription",
          "ImmunizationRecord",
          "DischargeSummary",
          "OPConsultation",
          "HealthDocumentRecord",
          "WellnessRecord"
        ],
        "purpose": {
          "text": "Care Management",
          "code": "CAREMGT",
          "refUri": "www.abdm.gov.in"
        },
        "categories": [
          "DATA",
          "LINK"
        ],
        "period": {
          "from": "2024-01-09T09:00:00.000Z",
          "to": "2123-12-31T09:00:00.000Z"
        }
      }
    ],
    "excludedSources": []
  }
}'
```

The path, the method and the body come from NHA's PHR V3 document,
section 8.3.9. That section gives no request body, so the body above is a placeholder rather than a transcription.

## How you know it worked

NHA's document records no response body for this call. Read the
acknowledgement, and where the exchange is asynchronous treat the
callback that answers it as the thing to observe rather than this
response. Nothing here has been called from this repository.

## When it goes wrong

The error scenarios NHA records against this call: none recorded in this section. The PHR codes
are the AS series, recorded once against P1 for the whole patient side.
The gateway codes are the ABDM series, listed in the error reference.
