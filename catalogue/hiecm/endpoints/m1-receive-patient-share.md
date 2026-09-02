---
id: hiecm.endpoint.m1-receive-patient-share
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Receive a patient's shared profile
summary: >
  **This endpoint is implemented by the HIP**, the ABDM Gateway
  forwards the patient's profile to the HIP's registered callback URL
  when the patient scans the HIP's QR code and consents to share their
  profile.  The HIP must respond with a 2xx status and subsequently
  call `POST /patient-share/v3/on-share`..
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:14bbfcbe0fc38e13a485d2a8fcfd6dc6d84e89d4f2e6b743cb85a238a3c18873
    fetched: 2026-08-25
    note: >
      NHA's M1 OpenAPI file.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# [HIP Callback] Receive Patient Profile Share

## In plain words

**This endpoint is implemented by the HIP**, the ABDM Gateway forwards the
patient's profile to the HIP's registered callback URL when the patient
scans the HIP's QR code and consents to share their profile.

The HIP must respond with a 2xx status and subsequently call `POST /patient-share/v3/on-share`.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://abhasbx.abdm.gov.in/abha/api/v3/patient-share/v3/share' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The request and response schemas for this operation are in `catalogue/openapi/hiecm/v3/hiecm-m1.yaml`, ingested from NHA's file.

NHA calls this operation `receivePatientShare`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

