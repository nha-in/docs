---
id: nhcx.test.provider-uc-01
type: test
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Provider sandbox exit use case 1: Get participant list'
summary: >-
  Prove that your hospital system can fetch the registered participants of one role,
  such as every payer, from the claims exchange.
sources:
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, Table 1.1, Use case 1.
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
  - nhcx.endpoint.get-session
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.participant-code
  flows:
  - nhcx.flow.sandbox-onboarding
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.environments-and-base-urls
  tests:
  - nhcx.test.provider-uc-04
  - nhcx.test.payer-uc-04
  errors:
  - nhcx.error.nhcx-401
  glossary:
  - nhcx.glossary.sandbox-exit
  - nhcx.glossary.participant-code
---

# Provider sandbox exit use case 1: Get participant list

## In plain words

This case proves your system can ask [NHCX](../../shared/glossary/nhcx.md) for every participant registered under one role. A provider usually asks for payers, then offers them in its payer picker.

It is one of the thirteen provider use cases for [sandbox exit](../glossary/sandbox-exit.md). The exchange answers this call itself, so no payer takes part.

## Before you start

- Your provider participant exists in the sandbox registry, and you know its [participant code](../glossary/participant-code.md). [Onboard in the sandbox](../flows/sandbox-onboarding.md) gets you there.
- You hold a current session token from [use case 4](provider-uc-04.md).
- Your system can reach `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` over HTTPS.

## What happens

### Run the call

1. Call [`POST /fetch/participants/list`](../endpoints/fetch-participants-list.md) with a role and a registration date window.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_GET_SESSION>' \
  -d '{"role": "PAYER", "fromdate": "<FROM_DATE_DD/MM/YYYY>", "todate": "<TO_DATE_DD/MM/YYYY>"}'
```

2. Read the `participantdetails` array in the response.
3. Show the returned participants in your system, for example as a payer picker.

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
- For `role` `PAYER` with a wide date window, the array is not empty.

## When it goes wrong

- **An empty array.** Widen the date window so it covers the registrations you expect. Send values exactly as documented: trim spaces and match case.
- **Every call fails, even with a new token.** You are on the wrong base URL. The participant APIs live under `participanthcxservice`. See [environments and base URLs](../sandbox/environments-and-base-urls.md).
- **HTTP 401 on the call.** The token has expired, or went in without the `Bearer ` prefix. See [NHCX-401](../errors/nhcx-401.md) and fetch a new token.
