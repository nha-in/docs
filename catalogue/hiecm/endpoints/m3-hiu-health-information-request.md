---
id: hiecm.endpoint.m3-hiu-health-information-request
type: endpoint
gateway: hiecm
milestone: M3
version: abdm-v3
title: HIU Health Information Request
summary: >
  Requests health data from the HIP for a specific consent artefact.
  The HIU must: 1.
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

# HIU Health Information Request

## In plain words

Requests health data from the HIP for a specific consent artefact.

The HIU must:
1. Generate an ECDH key pair before this call
2. Pass the ECDH public key in `keyMaterial.dhPublicKey`
3. Expose a `dataPushUrl` endpoint that can receive encrypted FHIR data from the HIP

The HIP encrypts data using the HIU's public key (ECDH shared secret) and pushes
it to `dataPushUrl`. The HIU decrypts using its private key + HIP's public key
from the push request's `keyMaterial`.

**Supported ECDH curves:** `Curve25519`
**Supported crypto algorithms:** `ECDH`

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](../concepts/gateway-session.md).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/request' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '<REQUEST_BODY>'
```

The request and response schemas for this operation are in `catalogue/openapi/hiecm/v3/hiecm-m3.yaml`, ingested from NHA's file.

NHA calls this operation `hiuHealthInformationRequest`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-m3.yaml` rather than assuming a shape.

It has not been run against the sandbox from this repository, so the schema is what NHA says, not what was observed. When you run it, record the real response here and set `verified.status`.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](../errors/abdm-2402.md).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](../errors/abdm-2404.md).
- No session token was sent. See [ABDM-2500](../errors/abdm-2500.md).
- ABDM fails and does not say why. See [ABDM-9999](../errors/abdm-9999.md).

