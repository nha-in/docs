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

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/hip/v3/link/carecontext' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The request and response schemas for this operation are in `catalogue/openapi/hiecm/v3/hiecm-m2.yaml`, ingested from NHA's file.

NHA calls this operation `hipLinkCareContext`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

