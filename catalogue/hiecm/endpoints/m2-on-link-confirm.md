---
id: hiecm.endpoint.m2-on-link-confirm
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link On-Confirm, HIP confirms linked care contexts
summary: >
  **Async Callback:** After receiving a link confirm request at the
  HIP bridge URL (`{bridgeUrl}/v0.5/links/link/confirm`) with the
  patient's OTP, the HIP validates the OTP and calls this Gateway
  endpoint to confirm the linked care contexts..
sources:
  - file: catalogue/openapi/.raw/ABDM_M2_API_Swagger.yaml
    hash: sha256:cd96452677132da92c23858da7df6d72a7c886b510e6d006261f6d81ec483839
    fetched: 2026-08-25
    note: >
      NHA's M2 OpenAPI file.
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 10.3.11, which publishes the request
      body this atom had as a placeholder.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m2-build
---

# Link On-Confirm, HIP confirms linked care contexts

## In plain words

**Async Callback:** After receiving a link confirm request at the HIP bridge URL
(`{bridgeUrl}/v0.5/links/link/confirm`) with the patient's OTP, the HIP validates
the OTP and calls this Gateway endpoint to confirm the linked care contexts.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/link/care-context/on-confirm' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "patient": [ { "referenceNumber": "4336268d-89a3-4c84-8674-aef42092d9fc", "display": "abcdefgdisplay", "careContexts": [ { "referenceNumber": "1234", "display": "1234-display" } ], "hiType": "PRESCRIPTION", "count": 1 } ], "response": { "requestId": "f207e461-1994-4274-9b86-554384f170ab" } }'
```

The body above is transcribed from NHA's PHR V3 document, section 10.3.11, which publishes it for this call. It has not been sent to the
sandbox from this repository.

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2. It is NHA's file as ingested.

NHA calls this operation `onLinkConfirm`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

