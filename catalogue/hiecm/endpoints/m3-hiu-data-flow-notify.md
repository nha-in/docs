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
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The 202 with TRANSFERRED and notifier.type HIU was observed by an integrator on 2026-09-16, not yet run to success from this repository. The ABDM-1101 on a repeated transaction id is in catalogue/verification/hiecm.endpoint.m3-hiu-data-flow-notify.json, run 2026-09-17.
related:
  errors: [hiecm.error.abdm-1101, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  flows: [hiecm.flow.m3-fetch-records]
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

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
  "notification": {
    "consentId": "consent-art-uuid-001",
    "transactionId": "txn-uuid-data-001",
    "doneAt": "2024-01-15T10:30:00.000Z",
    "notifier": {
      "type": "HIU",
      "id": "HIU_SERVICE_ID"
    },
    "statusNotification": {
      "sessionStatus": "TRANSFERRED",
      "hipId": "HIP_SERVICE_ID",
      "statusResponses": [
        {
          "careContextReference": "VISIT-2024-001",
          "hiStatus": "OK",
          "description": "Data received and decrypted successfully"
        },
        {
          "careContextReference": "LAB-2024-001",
          "hiStatus": "OK",
          "description": "Data received and decrypted successfully"
        }
      ]
    }
  }
}'
```

The request and response schemas for this operation are in the M3 specification, published at /specs/hiecm-m3.yaml and rendered field by field at /docs/hiecm/v3/api/m3. It is NHA's file as ingested.

NHA calls this operation `hiuDataFlowNotify`.

## How you know it worked

The gateway answers 202 with the body `{"status":"Notification is Accepted"}`. Send `sessionStatus: TRANSFERRED` with `notifier.type: HIU` once every entry has decrypted; the enum in the specification lists `RECEIVED`, and `TRANSFERRED` is the value the gateway accepts.

Idempotency: a second notify for the same `transactionId` is refused with [ABDM-1101](hiecm.error.abdm-1101), and the sandbox remembers a transaction id across runs. Send it once.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- The same transaction id was already notified. See [ABDM-1101](hiecm.error.abdm-1101).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

