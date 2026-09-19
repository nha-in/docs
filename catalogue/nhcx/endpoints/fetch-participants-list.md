---
id: nhcx.endpoint.fetch-participants-list
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /fetch/participants/list
summary: >-
  List the payers, providers or third party administrators registered in a date
  window, to pick who to address.
sources:
- url: https://hcxsbx.abdm.gov.in/images/b885e59891fedc7e725c.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection.zip
  hash: sha256:2d082f244ee41d137a62af82380dcd2d5db9ebbab66824fd54a23c506d4d9a7f
  fetched: '2026-09-14'
  note: AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection, row 16 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman SANDBOX-Participant_APIs item Participant List.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./fetch/participants/list.post; schemas FetchParticipantRequest, ParticipantDetails.'
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 5.5 Payer Discovery API.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 1 Get Participant List.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 4 Get Participant List.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, For Sandbox / For Production envBaseUrl.
related:
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.participant-code
  flows:
  - nhcx.flow.pmjay-patient-to-cashless
  endpoints:
  - nhcx.endpoint.participant-search
  - nhcx.endpoint.participant-get-policies
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  sandbox:
  - nhcx.sandbox.dummy-payer
  - nhcx.sandbox.environments-and-base-urls
  tests:
  - nhcx.test.provider-uc-01
  - nhcx.test.payer-uc-04
---

# POST /fetch/participants/list

## In plain words

This call lists the participants of one role registered on [NHCX](../../shared/glossary/nhcx.md) within a date window. A hospital uses it to find the [payer](../glossary/payer.md) to deal with. That payer's [participant code](../glossary/participant-code.md) becomes the address of every claim message.

Get Participant List is use case 1 of the provider [sandbox exit](../glossary/sandbox-exit.md) and use case 4 of the payer sandbox exit.

## Before you start

- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.
- A date window wide enough to cover the registration dates of the participants you expect.

## What happens

Your system posts a role and a date window to the participant service. The registry answers on the same connection. Nothing changes and no callback follows.

| Environment | Participant service base URL |
|---|---|
| Sandbox | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/participants/list' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "role": "<PAYER_OR_PROVIDER_OR_TPA>",
    "fromdate": "<START_DATE_DD/MM/YYYY>",
    "todate": "<END_DATE_DD/MM/YYYY>"
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

| Field | What to send |
|---|---|
| `role` | `PAYER`, `PROVIDER` or `TPA`. These are names, not the numeric role codes used at registration. |
| `fromdate`, `todate` | Dates in `dd/MM/yyyy` format only, for example `01/04/2021`. |
| `entitytype` | Optional. `Gov` narrows the list to government schemes. |

The response body has this shape:

```json
{
  "participantdetails": [{
      "participantcode": "<PARTICIPANT_CODE>", "participantname": "<PARTICIPANT_NAME>", "address": "<ADDRESS>", "state": "<STATE>"
    }]
}
```

The list can also arrive under `participants`, or as a bare array. Accept all three forms. There is no name filter, so filter by name in your own code.

**Idempotency.** The call only reads. Repeating it is safe. Fetch once with a wide window, cache the list and refresh it on a schedule.

## How you know it worked

You receive HTTP 200 with a list of participants of the role you asked for. The code you intend to address appears in it.

In the sandbox, a `PAYER` list includes the [dummy payer](../sandbox/dummy-payer.md), `1000003538@hcx`. Confirm a chosen code with [`/participant/search`](participant-search.md) before you address it.

## When it goes wrong

- **400 or no results.** A date is not in `dd/MM/yyyy` format. Send `01/04/2021`, not `2021-04-01`.
- **A payer you expect is missing.** The date window is too narrow. Widen it to cover the payer's registration date.
- **Your parser finds nothing.** The list arrived under `participants` or as a bare array. Accept all three forms.
- **`role` is refused.** A numeric code such as `10002` went in. Send `PAYER`, `PROVIDER` or `TPA`.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
