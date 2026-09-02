---
id: hiecm.endpoint.m3-hiu-data-flow-notify
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: Notify the gateway that data was received
summary: >
  After receiving all FHIR health data at the `dataPushUrl`, the HIU
  calls this endpoint to notify the ABDM Gateway that the data
  transfer session is complete.  The
  `statusNotification.sessionStatus` should be: - `TRANSFERRED`, All
  data received successfully - `FAILED`, Data receipt failed (with
  details in `statusResponses`)  The `notifier.type` must be `HIU`
  (contrast with M2 where the HIP sends the same endpoint with
  `notifier.type: HIP`)..
sources:
  - file: catalogue/openapi/.raw/ABDM_M3_API_Swagger.yaml
    hash: sha256:6d56fd91a3f75575c4382de1489ad4a6a0091d0eece9dfa5278c4d248f6fcf6b
    fetched: 2026-08-25
    note: >
      NHA's M3 OpenAPI file.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m3-build
---

# HIU Data Flow Notification, Notify Gateway data received

## In plain words

After receiving all FHIR health data at the `dataPushUrl`, the HIU calls this endpoint
to notify the ABDM Gateway that the data transfer session is complete.

The `statusNotification.sessionStatus` should be:
- `TRANSFERRED`, All data received successfully
- `FAILED`, Data receipt failed (with details in `statusResponses`)

The `notifier.type` must be `HIU` (contrast with M2 where the HIP sends the same
endpoint with `notifier.type: HIP`).

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The request and response schemas for this operation are in `catalogue/openapi/hiecm/v3/hiecm-m3.yaml`, ingested from NHA's file.

NHA calls this operation `hiuDataFlowNotify`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

