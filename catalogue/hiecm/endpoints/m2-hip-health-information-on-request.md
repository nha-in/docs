---
id: hiecm.endpoint.m2-hip-health-information-on-request
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Acknowledge a health information data request
summary: >
  **Async Callback:** After ABDM Gateway sends a health information
  request to the HIP bridge URL (`{bridgeUrl}/v0.5/health-
  information/hip/request`), the HIP calls this Gateway endpoint to
  acknowledge receipt and indicate it will begin processing
  (ACKNOWLEDGED).  After this, the HIP prepares and encrypts FHIR
  records, then pushes them to the HIU's `dataPushUrl`..
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

# HIP Health Information Response, Acknowledge data request

## In plain words

**Async Callback:** After ABDM Gateway sends a health information request to the HIP bridge URL
(`{bridgeUrl}/v0.5/health-information/hip/request`), the HIP calls this Gateway endpoint to
acknowledge receipt and indicate it will begin processing (ACKNOWLEDGED).

After this, the HIP prepares and encrypts FHIR records, then pushes them to the HIU's `dataPushUrl`.

The encryption parameters come from the requester, in the `keyMaterial`
of the health information request: `cryptoAlg: ECDH`, `curve:
Curve25519`, the requester's `dhPublicKey`, and a 32 byte `nonce`.
Generate your own Curve25519 pair and your own 32 byte nonce, and send
your public key and nonce back with the data so the requester can
derive the same secret. The same block is documented from the
requesting side in
[request health information](m3-hiu-health-information-request.md).

The key derivation and the symmetric cipher applied over that shared
secret are not yet published. Confirm both at onboarding before you
ship.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/hip/on-request' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
  "hiRequest": {
    "transactionId": "txn-uuid-data-001",
    "sessionStatus": "ACKNOWLEDGED"
  },
  "response": {
    "requestId": "req-uuid-from-hi-request"
  }
}'
```

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2. It is NHA's file as ingested.

NHA calls this operation `hipHealthInformationOnRequest`.

## How you know it worked

Not yet observed, and NHA's file documents no response body for this operation. Run it against the sandbox and record what comes back before relying on it.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

