---
id: hiecm.endpoint.gateway-update-bridge-url
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Update HIP/HIU Bridge Callback URL
summary: >
  Register the HIP/HIU callback URL with the ABDM Gateway. All gateway
  push notifications (e.g.
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:14bbfcbe0fc38e13a485d2a8fcfd6dc6d84e89d4f2e6b743cb85a238a3c18873
    fetched: 2026-08-25
    note: >
      NHA repeats this group in all three milestone files.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Update HIP/HIU Bridge Callback URL

## In plain words

Register the HIP/HIU callback URL with the ABDM Gateway.
All gateway push notifications (e.g. patient-share) are delivered to this URL.
**Server:** `https://dev.abdm.gov.in/api/hiecm`

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X PATCH 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge/url' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The request and response schemas for this operation are in `catalogue/openapi/hiecm/v3/hiecm-gateway.yaml`, ingested from NHA's file.

NHA calls this operation `updateBridgeUrl`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-gateway.yaml` rather than assuming a shape.

It has not been run against the sandbox from this repository, so the schema is what NHA says, not what was observed. When you run it, record the real response here and set `verified.status`.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

