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
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 4.2.4, which publishes the request
      body this atom had as a placeholder.
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

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X PATCH 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/bridge/url' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "url": "[https://webhook.site/b799c0b8-4e75-4545-8eb2-d8c2d5f0c9f6"](https://webhook.site/b799c0b8-4e75-4545-8eb2-d8c2d5f0c9f6) }'
```

The body above is transcribed from NHA's PHR V3 document, section 4.2.4, which publishes it for this call. It has not been sent to the
sandbox from this repository.

The request and response schemas for this operation are in the gateway specification, published at /specs/hiecm-gateway.yaml and rendered field by field at /docs/hiecm/v3/api/gateway. It is NHA's file as ingested.

NHA calls this operation `updateBridgeUrl`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-gateway.yaml` rather than assuming a shape.

It has not been run against the sandbox from this repository, so the schema is what NHA says, not what was observed. When you run it, record the real response here and set `verified.status`.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

