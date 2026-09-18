---
id: nhcx.test.payer-uc-04
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Payer sandbox exit use case 4: Get participant list'
summary: >-
  Prove that your insurance system can fetch the registered participants of one
  role from the claims exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.4, Use case 4.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. components.schemas.ParticipantListResponse.'
- url: https://hcxsbx.abdm.gov.in/images/b885e59891fedc7e725c.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection.zip
  hash: sha256:2d082f244ee41d137a62af82380dcd2d5db9ebbab66824fd54a23c506d4d9a7f
  fetched: '2026-09-14'
  note: AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection, row 16 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Participant List request.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 2, Q2 and Q3; page 6, best practices.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. page 8, Integrator's Journey.
related:
  endpoints:
  - nhcx.endpoint.fetch-participants-list
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.participant-code
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.environments-and-base-urls
  tests:
  - nhcx.test.payer-uc-06
  - nhcx.test.provider-uc-01
  errors:
  - nhcx.error.nhcx-401
---

# Payer sandbox exit use case 4: Get participant list

## In plain words

This case proves your system can ask [NHCX](../../shared/glossary/nhcx.md) for every participant registered under one role, such as the hospitals or other payers in the registry.

It is one of the fifteen payer use cases for [sandbox exit](../glossary/sandbox-exit.md). The exchange answers this call itself.

## Before you start

- Your payer participant exists in the sandbox registry with the payer role, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 6](payer-uc-06.md).
- Your system can reach `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` over HTTPS.

## What happens

### Run the call

1. Call [`POST /fetch/participants/list`](../endpoints/fetch-participants-list.md) with a role name and a registration date window.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"role": "<ROLE_NAME_SUCH_AS_PAYER>", "fromdate": "<FROM_DATE_DD/MM/YYYY>", "todate": "<TO_DATE_DD/MM/YYYY>"}'
```

2. Read the `participantdetails` array in the response.

### Demonstrate it

Sign-off needs people. Book the demos once the steps above pass in your own runs. See [the sandbox exit process](../sandbox/sandbox-exit.md).

```precondition
human: true
who: your team, with the NHA team
action: Demonstrate this use case in the internal demo, then in the Health Tech Committee (HTC) demo.
how: Email hcx.integration@nha.gov.in to request both demos.
```

## How you know it worked

The pass criterion for this case:

> Retrieve the list of participants in the registry based on the role

What you observe:

- You receive HTTP 200 with a `participantdetails` array.
- Each entry carries `participantcode`, `participantname`, `address` and `state`.
- For `role` `PAYER` with a wide date window, the list includes your own participant.

## When it goes wrong

- **An empty array.** Widen the date window, and send values exactly as documented: trim spaces and match case.
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
