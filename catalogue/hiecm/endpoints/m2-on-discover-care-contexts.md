---
id: hiecm.endpoint.m2-on-discover-care-contexts
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: On Discovery, HIP responds with found care contexts
summary: >
  **Async Callback:** After receiving a discovery request at the HIP
  bridge URL (`{bridgeUrl}/v0.5/care-contexts/discover`), the HIP
  calls this Gateway endpoint to return the list of care contexts
  found for the patient.  The HIP matches the patient using the
  demographics provided (name, gender, DOB, verified identifiers) and
  returns matching records..
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

# On Discovery, HIP responds with found care contexts

## In plain words

**Async Callback:** After receiving a discovery request at the HIP bridge URL
(`{bridgeUrl}/v0.5/care-contexts/discover`), the HIP calls this Gateway endpoint
to return the list of care contexts found for the patient.

The HIP matches the patient using the demographics provided
(name, gender, DOB, verified identifiers) and returns matching records.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
  "transactionId": "txn-uuid-001",
  "patient": [
    {
      "referenceNumber": "PAT-REF-001",
      "display": "Ramesh Kumar",
      "careContexts": [
        {
          "referenceNumber": "VISIT-2024-001",
          "display": "OPD Visit 10-Jan-2024"
        },
        {
          "referenceNumber": "LAB-2024-001",
          "display": "Lab Report 10-Jan-2024"
        }
      ],
      "hiType": [
        "DiagnosticReport"
      ],
      "count": 2
    }
  ],
  "response": {
    "requestId": "req-uuid-from-discover"
  }
}'
```

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2. It is NHA's file as ingested.

NHA calls this operation `onDiscoverCareContexts`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

