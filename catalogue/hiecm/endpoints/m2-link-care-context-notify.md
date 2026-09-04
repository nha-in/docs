---
id: hiecm.endpoint.m2-link-care-context-notify
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link Care Context Notify
summary: >
  Sends an explicit notification to the ABDM Gateway about a newly
  linked care context. This is called after successful care context
  linking to ensure the patient's ABHA App receives a timely
  notification with the care context details..
sources:
  - file: catalogue/openapi/.raw/ABDM_M2_API_Swagger.yaml
    hash: sha256:cd96452677132da92c23858da7df6d72a7c886b510e6d006261f6d81ec483839
    fetched: 2026-08-25
    note: >
      NHA's M2 OpenAPI file.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m2-build
---

# Link Care Context Notify

## In plain words

Sends an explicit notification to the ABDM Gateway about a newly linked care context.
This is called after successful care context linking to ensure the patient's ABHA App
receives a timely notification with the care context details.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/hip/v3/link/context/notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
    "notification": {
      "patient": {"id": "<PATIENT_ABHA_ADDRESS>"},
      "careContext": {
        "patientReference": "<PATIENT_ABHA_ADDRESS>",
        "careContextReference": "<YOUR_VISIT_REFERENCE>"
      },
      "hiTypes": ["<HI_TYPE>"],
      "date": "<ISO_8601_TIMESTAMP>",
      "hip": {
        "id": "<YOUR_HIP_ID>",
        "name": "<YOUR_FACILITY_NAME>",
        "type": "HIP"
      }
    }
  }'
```

The body above is the shape NHA's ingested M2 file declares for this
operation, with its sample values replaced by named placeholders. It has
not been sent to the sandbox from this repository.

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2. It is NHA's file as ingested.

NHA calls this operation `linkCareContextNotify`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

