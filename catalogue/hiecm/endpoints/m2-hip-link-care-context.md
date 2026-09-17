---
id: hiecm.endpoint.m2-hip-link-care-context
type: endpoint
gateway: hiecm
milestone: M2
version: abdm-v3
title: Link care contexts to an ABHA address
summary: >
  Links one or more care contexts to a patient's ABHA address, using
  the link token from the generate token call. The ABHA number goes in
  as digits only and hiType as a string.
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
      Digits only abhaNumber, hiType as a string, the 202, the empty 400
      on a dashed number, and the reusable link token. Observed by an
      integrator on 2026-09-16, not yet run from this repository.
related:
  endpoints: [hiecm.endpoint.m2-generate-link-token, hiecm.endpoint.m2-link-care-context-notify]
  callbacks: [hiecm.callback.m2-on-carecontext-result]
  flows: [hiecm.flow.m2-link-care-context]
  errors: [hiecm.error.abdm-1056, hiecm.error.abdm-1062, hiecm.error.abdm-1063, hiecm.error.abdm-2402, hiecm.error.abdm-2404, hiecm.error.abdm-2500, hiecm.error.abdm-9999]
  concepts: [hiecm.concept.gateway-session, hiecm.concept.care-context, hiecm.concept.linking-triggers-self-fetch]
skills:
  - hiecm-m2-build
---

# Link care contexts to an ABHA address

## In plain words

Tells ABDM that a patient's records exist at your facility. The
`careContexts` array can hold one entry or many. The call needs the
link token from [generate link token](hiecm.endpoint.m2-generate-link-token),
sent in the `X-Link-Token` header. The same link token serves later
care contexts for the same patient.

## Before you start

- A gateway access token. See [the gateway session](hiecm.concept.gateway-session).
- The right `X-CM-ID` for the environment you are calling.
- A link token for this patient, from [the token callback](hiecm.callback.m2-on-generate-token-result).

## What happens

```bash
curl -X POST 'https://dev.abdm.gov.in/api/hiecm/hip/v3/link/carecontext' \
  -H 'Authorization: Bearer <ACCESS_TOKEN>' \
  -H 'REQUEST-ID: <FRESH_UUID>' \
  -H 'TIMESTAMP: <ISO_8601_TIMESTAMP>' \
  -H 'X-CM-ID: sbx' \
  -H 'X-HIP-ID: <YOUR_HIP_ID>' \
  -H 'X-Link-Token: <LINK_TOKEN_FROM_ON_GENERATE_TOKEN>' \
  -H 'Content-Type: application/json' \
  -d '{
    "abhaNumber": "<PATIENT_ABHA_NUMBER_14_DIGITS_NO_DASHES>",
    "abhaAddress": "<PATIENT_ABHA_ADDRESS>",
    "patient": [
      {
        "referenceNumber": "<YOUR_PATIENT_REFERENCE>",
        "display": "<PATIENT_NAME_AS_HELD>",
        "careContexts": [
          {
            "referenceNumber": "<YOUR_VISIT_REFERENCE>",
            "display": "<WHAT_THE_PATIENT_WILL_SEE>"
          }
        ],
        "hiType": "<HI_TYPE>",
        "count": 1
      }
    ]
  }'
```

Two field rules that the specification does not make obvious:

- `abhaNumber` is a string of 14 digits with no dashes, for example
  `91123407042043`. The dashed form is refused with 400 and an empty
  body.
- `hiType` is a single string such as `HealthDocumentRecord`, not an
  array. An array is refused with 400.

The request and response schemas for this operation are in the M2 specification, published at /specs/hiecm-m2.yaml and rendered field by field at /docs/hiecm/v3/api/m2.

Idempotency: linking the same care context reference a second time is refused with [ABDM-1056](hiecm.error.abdm-1056).

## How you know it worked

The call returns 202. Within seconds your bridge receives
[the link result](hiecm.callback.m2-on-carecontext-result) at
`/api/v3/link/on_carecontext` with `response.requestId` equal to the
`REQUEST-ID` you sent and `status` of `Successfully Linked care context`.
The 202 alone is not success.

Expect a self requested consent notification and a health information
request within about ten seconds of the link, because the patient's
PHR app fetches newly linked records on its own. See
[linking triggers a self requested fetch](hiecm.concept.linking-triggers-self-fetch).

## When it goes wrong

- 400 with an empty body. `abhaNumber` carried dashes, or `hiType` was an array. Fix the field and resend.
- The care context is already linked. See [ABDM-1056](hiecm.error.abdm-1056).
- The ABHA number does not match the link token. See [ABDM-1062](hiecm.error.abdm-1062).
- The HIP id does not match the link token. See [ABDM-1063](hiecm.error.abdm-1063).
- The clock is wrong and every call fails. See [ABDM-2402](hiecm.error.abdm-2402).
- The `REQUEST-ID` is missing, malformed or reused. See [ABDM-2404](hiecm.error.abdm-2404).
- No session token was sent. See [ABDM-2500](hiecm.error.abdm-2500).
- ABDM fails and does not say why. See [ABDM-9999](hiecm.error.abdm-9999).
