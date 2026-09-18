---
id: hiecm.endpoint.m1-get-phr-profile
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get PHR Profile
summary: >
  Retrieve the authenticated user's PHR profile after ABHA Address
  login..
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:6e2f0691a60ef948cae58f69df4e1730742c38f47f10da7b8c63596288120e4c
    fetched: 2026-08-25
    note: >
      NHA's M1 OpenAPI file.
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session]
skills:
  - hiecm-m1-build
---

# Get PHR Profile

## In plain words

Retrieve the authenticated user's PHR profile after ABHA Address login.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X GET 'https://abhasbx.abdm.gov.in/abha/api/v3/phr/web/login/profile/abha-profile' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx'
```

The request and response schemas for this operation are in the M1 specification, published at /specs/hiecm-m1.yaml and rendered field by field at /docs/hiecm/v3/api/m1. It is NHA's file as ingested.

NHA calls this operation `getPhrProfile`.

## How you know it worked

NHA's file documents a response schema for this operation. Read it in `hiecm-m1.yaml` rather than assuming a shape.

It has not been run against the sandbox from this repository, so the schema is what NHA says, not what was observed. When you run it, record the real response here and set `verified.status`.

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

