---
id: hiecm.endpoint.m1-on-share-acknowledgement
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Acknowledge a shared profile with a token number
summary: >
  After a patient scans your counter code and their profile arrives on
  your bridge, you answer the gateway with a token number for the
  patient to use at the counter.
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:6e2f0691a60ef948cae58f69df4e1730742c38f47f10da7b8c63596288120e4c
    fetched: 2026-08-25
    note: >
      NHA's M1 OpenAPI file, for the field names.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The working gateway URL, the reply body and the 202. Observed by an
      integrator on 2026-09-16, not yet run to success from this
      repository. The 404 on the previous ABHA host URL is in
      catalogue/verification/hiecm.endpoint.m1-on-share-acknowledgement.json,
      run 2026-09-17.
related:
  endpoints: [hiecm.endpoint.m1-receive-patient-share]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.scan-and-share]
  errors: [hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
skills:
  - hiecm-m1-build
---

# Acknowledge a shared profile with a token number

## In plain words

Your reply to [a shared profile](hiecm.endpoint.m1-receive-patient-share).
It tells the gateway you registered the patient and gives the token
number they show at the counter. The patient's PHR app displays what you
send here. See [scan and share](hiecm.concept.scan-and-share) for the
counter code and the token rules.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The `REQUEST-ID` header of the inbound share, because it goes back in `response.requestId`.

## What happens

This call goes to the gateway host, `dev.abdm.gov.in`, not to the ABHA
host.

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/patient-share/v3/on-share' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'X-HIP-ID: <YOUR_HIP_ID>' \
  -H 'Content-Type: application/json' \
  -d '{
  "acknowledgement": {
    "abhaAddress": "<ABHA_ADDRESS_FROM_THE_SHARE>",
    "status": "SUCCESS",
    "profile": {
      "context": "<COUNTER_ID_FROM_THE_SHARE>",
      "tokenNumber": "<TOKEN_NUMBER_YOU_ISSUED>",
      "expiry": "<TOKEN_VALIDITY>"
    }
  },
  "response": {
    "requestId": "<REQUEST_ID_HEADER_OF_THE_INBOUND_SHARE>"
  }
}'
```

The unit of `expiry` is not published. Send seconds, and confirm at
onboarding how the PHR app renders it.

Idempotency: a repeat scan inside the token's validity returns the same token number, so answering the same share twice with the same body is safe.

## How you know it worked

The gateway answers 202, within the same second as the inbound share in
the sandbox. The patient's PHR app then shows the token number.

## When it goes wrong

- 404 with `No matching resource found for given API Request`. The call went to the ABHA host. Use `https://dev.abdm.gov.in/api/hiecm/patient-share/v3/on-share`.
- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).
