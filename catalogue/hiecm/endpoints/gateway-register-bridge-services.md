---
id: hiecm.endpoint.gateway-register-bridge-services
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Register / Update Bridge Services (HIU)
summary: >
  Registers or updates one or more HIU service entries under a
  facility in the HSP Registry.
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:6e2f0691a60ef948cae58f69df4e1730742c38f47f10da7b8c63596288120e4c
    fetched: 2026-08-25
    note: >
      NHA repeats this group in all three milestone files.
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Register / Update Bridge Services (HIU)

## In plain words

Registers or updates one or more HIU service entries under a facility
in the HSP Registry. Set `type` to `"HIU"` for Health Information User registration.
**Base URL:** `https://apihspsbx.abdm.gov.in`

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/v4/int/v1/bridges/MutipleHRPAddUpdateServices' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
  "facilityId": "IN07100XXXXX",
  "facilityName": "City Health HIU",
  "HRP": [
    {
      "bridgeId": "BRIDGE_HIU_001",
      "hipName": "City Health HIU",
      "type": "HIU",
      "active": true
    }
  ]
}'
```

The request and response schemas for this operation are in the gateway specification, published at /specs/hiecm-gateway.yaml and rendered field by field at /docs/hiecm/v3/api/gateway. It is NHA's file as ingested.

NHA calls this operation `registerBridgeServices`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

