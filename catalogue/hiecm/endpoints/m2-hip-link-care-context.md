---
id: hiecm.endpoint.m2-hip-link-care-context
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link care contexts to an ABHA address
summary: >
  Links one or more care contexts (health records) to a patient's ABHA
  address. Use the same endpoint for both single and multiple care
  context linking, the `careContexts` array can contain one or many
  entries.  Requires the `X-Link-Token` header with a freshly
  generated link token..
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

# HIP Initiated Care Context Linking (Single or Multiple)

## In plain words

Links one or more care contexts (health records) to a patient's ABHA address.
Use the same endpoint for both single and multiple care context linking, the `careContexts` array can contain one or many entries.

Requires the `X-Link-Token` header with a freshly generated link token.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/hip/v3/link/carecontext' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
    "abhaNumber": "<PATIENT_ABHA_NUMBER_14_DIGITS>",
    "abhaAddress": "<PATIENT_ABHA_ADDRESS>",
    "patient": [
      {
        "referenceNumber": "<YOUR_PATIENT_REFERENCE>",
        "display": "<PATIENT_NAME_AS_HELD>",
        "careContexts": [
          {
            "referenceNumber": "<YOUR_VISIT_REFERENCE>",
            "display": "<WHAT_THE_PATIENT_WILL_SEE>"
          }
        ],
        "hiType": ["<HI_TYPE>"],
        "count": 1
      }
    ]
  }'
```

The body above is the shape NHA's ingested M2 file declares for this
operation, with its sample values replaced by named placeholders. It has
not been sent to the sandbox from this repository.

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2. It is NHA's file as ingested.

NHA calls this operation `hipLinkCareContext`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

