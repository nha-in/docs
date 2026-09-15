---
id: hiecm.endpoint.m2-consent-hip-on-notify
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Acknowledge a consent notification
summary: >
  **Async Callback:** After ABDM Gateway sends a consent grant
  notification to the HIP bridge URL
  (`{bridgeUrl}/v0.5/consents/hip/notify`), the HIP calls this Gateway
  endpoint to acknowledge receipt of the consent artefact.  The
  consent notification contains the full consent details including
  care contexts, HI types, date range, and digital signature for
  validation..
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
      NHA's PHR V3 document, section 6.8, which publishes the request
      body this atom had as a placeholder.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m2-build
---

# Consent HIP On-Notify, Acknowledge consent notification

## In plain words

**Async Callback:** After ABDM Gateway sends a consent grant notification to the HIP bridge URL
(`{bridgeUrl}/v0.5/consents/hip/notify`), the HIP calls this Gateway endpoint to
acknowledge receipt of the consent artefact.

The consent notification contains the full consent details including care contexts,
HI types, date range, and digital signature for validation.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hip/on-notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "acknowledgement": [ { "status": "OK", "consentId": "e3c74829-3f82-4f94-959e-e10f57bcd57b" } ], "error": { "code": "ABDM-1001", "message": "unable to connect database" }, "response": { "requestId": "6f0b4665-a915-4c92-aa36-65afb4a2cd71" } }'
```

The body above is transcribed from NHA's PHR V3 document, section 6.8, which publishes it for this call. It has not been sent to the
sandbox from this repository.

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2. It is NHA's file as ingested.

NHA calls this operation `consentHipOnNotify`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

