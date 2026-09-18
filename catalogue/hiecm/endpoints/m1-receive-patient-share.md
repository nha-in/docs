---
id: hiecm.endpoint.m1-receive-patient-share
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Receive a patient's shared profile
summary: >
  The route your bridge serves when a patient scans your counter code.
  The gateway posts the profile here, and you answer with a token number
  on the on-share call.
sources:
  - file: catalogue/openapi/.raw/ABDM_M1_API_Swagger.yaml
    hash: sha256:6e2f0691a60ef948cae58f69df4e1730742c38f47f10da7b8c63596288120e4c
    fetched: 2026-08-25
    note: >
      NHA's M1 OpenAPI file, for the field names it declares.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The inbound path on the bridge and the body as delivered, with null
      abhaNumber, string birth parts and lowercase pincode. Observed by an
      integrator on 2026-09-16, not yet run from this repository. The 404
      when this body is posted to the ABHA host is in
      catalogue/verification/hiecm.endpoint.m1-receive-patient-share.json,
      run 2026-09-17.
related:
  endpoints: [hiecm.endpoint.m1-on-share-acknowledgement]
  concepts: [hiecm.concept.scan-and-share, hiecm.concept.bridge-url-ownership, hiecm.concept.callback-authenticity]
  errors: [hiecm.error.abdm-9999]
skills:
  - hiecm-m1-build
---

# Receive a patient's shared profile

## In plain words

This is a route you implement, not a call you make. When a patient scans
the code on your counter and agrees to share, the gateway posts their
profile to `/api/v3/hip/patient/share` under your registered bridge URL.
You answer 2xx at once, register the patient, and then send
[the acknowledgement](hiecm.endpoint.m1-on-share-acknowledgement) with a
token number.

## Before you start

- A bridge URL registered for your client id and proven to deliver. See [who owns the bridge URL](hiecm.concept.bridge-url-ownership).
- A counter code printed from the format in [scan and share](hiecm.concept.scan-and-share).

## What happens

The gateway posts this to your bridge. Shown as the request your server
receives:

```bash
curl -X POST '<YOUR_BRIDGE_URL>/api/v3/hip/patient/share' \
  -H 'Authorization: Bearer <GATEWAY_JWT>' \
  -H 'REQUEST-ID: <GATEWAY_REQUEST_ID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-HIP-ID: <YOUR_HIP_ID>' \
  -H 'Content-Type: application/json' \
  -d '{
  "intent": "PROFILE_SHARE",
  "metaData": {
    "hipId": "<YOUR_HIP_ID>",
    "context": "<COUNTER_ID_FROM_THE_CODE>",
    "hprId": null,
    "latitude": "<LATITUDE>",
    "longitude": "<LONGITUDE>"
  },
  "profile": {
    "patient": {
      "abhaNumber": null,
      "abhaAddress": "<ABHA_ADDRESS>",
      "name": "<NAME>",
      "gender": "M",
      "dayOfBirth": "6",
      "monthOfBirth": "6",
      "yearOfBirth": "2000",
      "address": {
        "line": "<LINE>",
        "district": "<DISTRICT>",
        "state": "<STATE>",
        "pincode": "<PINCODE>"
      },
      "phoneNumber": "<MOBILE>"
    }
  }
}'
```

Field rules to code against:

- `abhaNumber` is `null` for a patient who holds only an ABHA address.
- `dayOfBirth`, `monthOfBirth` and `yearOfBirth` are strings.
- The postcode key is `pincode`, lowercase `c`.
- The `REQUEST-ID` header is what you echo back in `response.requestId` on the acknowledgement.

Verify the `Authorization` JWT before you act on the body. See
[proving a callback really came from ABDM](hiecm.concept.callback-authenticity).

Idempotency: the gateway retries. Key on the `REQUEST-ID` header and answer a repeat with the same token.

## How you know it worked

Your handler receives the POST within a second of the scan, returns 2xx,
and your acknowledgement on the on-share call returns 202. The patient's
PHR app shows the token number you issued.

## When it goes wrong

- Nothing arrives after a scan. The bridge URL for your client id points elsewhere, most often because another system sharing the id patched it last. See [who owns the bridge URL](hiecm.concept.bridge-url-ownership).
- Your parser fails on `abhaNumber: null` or on string birth parts. Code to the shapes above.
- Your handler returns an error and ABDM stops retrying. See [ABDM-9999](hiecm.error.abdm-9999).
