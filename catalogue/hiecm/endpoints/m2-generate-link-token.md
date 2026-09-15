---
id: hiecm.endpoint.m2-generate-link-token
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Generate Link Token
summary: >
  Generates a short-lived link token for a specific patient identified
  by their ABHA number/address. The link token is passed as `X-Link-
  Token` header when calling the care context linking API. Must be
  called immediately before the linking call, tokens expire quickly..
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

# Generate Link Token

## In plain words

Generates a short-lived link token for a specific patient identified by their ABHA number/address.
The link token is passed as `X-Link-Token` header when calling the care context linking API.
Must be called immediately before the linking call, tokens expire quickly.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/v3/token/generate-token' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
    "abhaNumber": <PATIENT_ABHA_NUMBER_14_DIGITS>,
    "abhaAddress": "<PATIENT_ABHA_ADDRESS>",
    "name": "<PATIENT_NAME_AS_HELD>",
    "gender": "<M_F_OR_O>",
    "yearOfBirth": <PATIENT_YEAR_OF_BIRTH>
  }'
```

The body above is the shape NHA's ingested M2 file declares for this
operation, with its sample values replaced by named placeholders. It has
not been sent to the sandbox from this repository.

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2. It is NHA's file as ingested.

NHA calls this operation `generateLinkToken`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-m2.yaml` rather than assuming a shape.

It has not been run against the sandbox from this repository, so the schema is what NHA says, not what was observed. When you run it, record the real response here and set `verified.status`.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

