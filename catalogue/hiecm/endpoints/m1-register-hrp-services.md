---
id: hiecm.endpoint.m1-register-hrp-services
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Register / Update HIP-HIU Services (Facility Registry)
summary: >
  Register or update HIP/HIU services in the Facility Registry. Must
  be called after updating the bridge URL. **Server:**
  `https://facilitysbx.abdm.gov.in`.
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:14bbfcbe0fc38e13a485d2a8fcfd6dc6d84e89d4f2e6b743cb85a238a3c18873
    fetched: 2026-08-25
    note: >
      NHA's M1 OpenAPI file.
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Register / Update HIP-HIU Services (Facility Registry)

## In plain words

Register or update HIP/HIU services in the Facility Registry.
Must be called after updating the bridge URL.
**Server:** `https://facilitysbx.abdm.gov.in`

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/v1/bridges/MutipleHRPAddUpdateServices' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
  "facilityId": "IN0710000001",
  "facilityName": "City General Hospital",
  "HRP": [
    {
      "bridgeId": "your-client-id",
      "hipName": "City General Hospital",
      "hipId": "CityGeneralHospital_HIP",
      "hipType": "HOSPITAL",
      "facilityName": "City General Hospital"
    }
  ]
}'
```

The request and response schemas for this operation are in the M1 specification, published at /specs/hiecm-m1.yaml and rendered field by field at /docs/hiecm/v3/api/m1. It is NHA's file as ingested.

NHA calls this operation `registerHrpServices`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-m1.yaml` rather than assuming a shape.

It has not been run against the sandbox from this repository, so the schema is what NHA says, not what was observed. When you run it, record the real response here and set `verified.status`.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

