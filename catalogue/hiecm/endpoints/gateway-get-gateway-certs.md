---
id: hiecm.endpoint.gateway-get-gateway-certs
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Get Gateway JWKS Certificates
summary: >
  Fetch the JSON Web Key Set that verifies the JWT on every gateway
  callback. The v3 key set needs a session token and the standard
  headers.
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:14bbfcbe0fc38e13a485d2a8fcfd6dc6d84e89d4f2e6b743cb85a238a3c18873
    fetched: 2026-08-25
    note: >
      NHA repeats this group in all three milestone files.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The 401 without a session token, and callbacks verifying as RS256 JWTs
      with a kid against this key set. The 200 with authentication is in
      catalogue/verification/hiecm.endpoint.gateway-get-gateway-certs.json,
      run 2026-09-17.
related:
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.callback-authenticity]
skills:
  - hiecm-m1-build
  - hiecm-m2-build
  - hiecm-m3-build
---

# Get Gateway JWKS Certificates

## In plain words

Every callback ABDM posts to your bridge carries a JWT in its
`Authorization` header. This call returns the public keys that verify
that JWT. Fetch it through the same authenticated client you use for
every other gateway call: the v3 key set answers 401 without a session
token. See [proving a callback really came from ABDM](hiecm.concept.callback-authenticity).

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X GET 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/certs' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx'
```

The request and response schemas for this operation are in the gateway specification, published at /specs/hiecm-gateway.yaml and rendered field by field at /docs/hiecm/v3/api/gateway.

Idempotency: a read. Cache the result by `kid` and refetch once when a callback presents a `kid` you do not hold.

## How you know it worked

The response is 200 with a `keys` array. Each key carries `kid`, `kty: RSA`, `use: sig`, `n`, `e`, `x5c` and `alg`. The sandbox set holds two keys, one `RS256` and one `RS512`. A callback's JWT then verifies against the key its `kid` names.

## When it goes wrong

- 401 with no session token. Send `Authorization: Bearer <ACCESS_TOKEN>` and the standard headers. See [ABDM-2500](hiecm.error.abdm-2500).
- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).
