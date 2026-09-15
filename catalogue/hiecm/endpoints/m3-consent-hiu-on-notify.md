---
id: hiecm.endpoint.m3-consent-hiu-on-notify
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: Acknowledge a consent notification
summary: >
  **Async Callback:** After ABDM Gateway sends a consent grant/deny
  notification to the HIU bridge URL
  (`{bridgeUrl}/v0.5/consents/hiu/notify`), the HIU calls this Gateway
  endpoint to acknowledge receipt.  The Gateway sends this
  notification when: - Patient grants the consent - Patient denies the
  consent - A previously granted consent is revoked.
sources:
  - file: catalogue/openapi/.raw/ABDM_M3_API_Swagger.yaml
    hash: sha256:6d56fd91a3f75575c4382de1489ad4a6a0091d0eece9dfa5278c4d248f6fcf6b
    fetched: 2026-08-25
    note: >
      NHA's M3 OpenAPI file.
  - file: catalogue/openapi/.raw/nha-2026-09-04/ABHA-PHR-V3-Documents.docx
    fetched: 2026-09-04
    hash: sha256:99320fbc4b9703fce4afed12d5eb0863431aaea25e814bc3fb9ab974d16acd75
    note: >
      NHA's PHR V3 document, section 6.7, which publishes the request
      body this atom had as a placeholder.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m3-build
---

# Consent HIU On-Notify, Acknowledge consent notification

## In plain words

**Async Callback:** After ABDM Gateway sends a consent grant/deny notification to the HIU
bridge URL (`{bridgeUrl}/v0.5/consents/hiu/notify`), the HIU calls this Gateway endpoint
to acknowledge receipt.

The Gateway sends this notification when:
- Patient grants the consent
- Patient denies the consent
- A previously granted consent is revoked

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hiu/on-notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{ "acknowledgement": [ { "status": "OK", "consentId": "e3c74829-3f82-4f94-959e-e10f57bcd57b" } ], "error": { "code": "ABDM-1001", "message": "unable to connect database" }, "response": { "requestId": "6f0b4665-a915-4c92-aa36-65afb4a2cd71" } }'
```

The body above is transcribed from NHA's PHR V3 document, section 6.7, which publishes it for this call. It has not been sent to the
sandbox from this repository.

The request and response schemas for this operation are in the M3 specification, published at /specs/hiecm-m3.yaml and rendered field by field at /docs/hiecm/v3/api/m3. It is NHA's file as ingested.

NHA calls this operation `consentHiuOnNotify`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

