---
id: hiecm.endpoint.m2-link-care-context-notify
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link Care Context Notify
summary: >
  Sends an explicit notification to the ABDM Gateway about a newly
  linked care context. This is called after successful care context
  linking to ensure the patient's ABHA App receives a timely
  notification with the care context details..
sources:
  - file: catalogue/openapi/.raw/ABDM_M2_API_Swagger.yaml
    hash: sha256:cd96452677132da92c23858da7df6d72a7c886b510e6d006261f6d81ec483839
    fetched: 2026-08-25
    note: >
      NHA's M2 OpenAPI file.
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      The race with the link, the ABDM-1006 acknowledgement, and the self requested fetch that follows. Observed by an integrator on 2026-09-16, not yet run from this repository.
related:
  errors: [hiecm.error.abdm-1006, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.context-notify-timing, hiecm.concept.linking-triggers-self-fetch]
  callbacks: [hiecm.callback.m2-on-context-notify-result]
skills:
  - hiecm-m2-build
---

# Link Care Context Notify

## In plain words

Sends an explicit notification to the ABDM Gateway about a newly linked care context.
This is called after successful care context linking to ensure the patient's ABHA App
receives a timely notification with the care context details.

This wording is NHA's own, from the file this operation was ingested from.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/hip/v3/link/context/notify' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'Content-Type: application/json' \
  -d '{
    "notification": {
      "patient": {"id": "<PATIENT_ABHA_ADDRESS>"},
      "careContext": {
        "patientReference": "<PATIENT_ABHA_ADDRESS>",
        "careContextReference": "<YOUR_VISIT_REFERENCE>"
      },
      "hiTypes": ["<HI_TYPE>"],
      "date": "<ISO_8601_TIMESTAMP>",
      "hip": {
        "id": "<YOUR_HIP_ID>",
        "name": "<YOUR_FACILITY_NAME>",
        "type": "HIP"
      }
    }
  }'
```

The body above is the shape NHA's ingested M2 file declares for this
operation, with its sample values replaced by named placeholders. It has
not been sent to the sandbox from this repository.

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2. It is NHA's file as ingested.

NHA calls this operation `linkCareContextNotify`.

## How you know it worked

The call returns 202. The outcome arrives on [the notify callback](hiecm.callback.m2-on-context-notify-result) with `acknowledgement.status: SUCCESS`. Within about ten seconds of that, the patient's PHR app requests the record itself. See [linking triggers a self requested fetch](hiecm.concept.linking-triggers-self-fetch).

Send this call at least five seconds after the link callback, and retry on an `ERRORED` acknowledgement carrying [ABDM-1006](hiecm.error.abdm-1006) at 5, 15 and 60 seconds. See [context notify timing](hiecm.concept.context-notify-timing).

## When it goes wrong

- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- The acknowledgement is `ERRORED` with `No care context linked with given reference number`. The notify was sent before the link became visible. See [ABDM-1006](hiecm.error.abdm-1006).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).

