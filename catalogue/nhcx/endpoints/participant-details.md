---
id: nhcx.endpoint.participant-details
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /participant/details
summary: >-
  Read one participant's full registry record by its participant code, through the
  second lookup path.
sources:
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./participant/details.post; schemas ParticipantSearchReq, ParticipantSearchResponse.'
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/registries
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__registries.md
  hash: sha256:04bf78739fa0c3807a8a5a49d8c3e004f8aba664f524d0344d7fc44c3b2baf42
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/registries, text as shown on the site. Participating Organisations/Systems Registry table, status.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, For Sandbox / For Production envBaseUrl.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, item 6 Missing the Accept parameter.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.participant-registry
  endpoints:
  - nhcx.endpoint.participant-search
  - nhcx.endpoint.fetch-participants-list
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  - nhcx.error.nhcx-1003
---

# POST /participant/details

## In plain words

This call reads one participant's record from the [NHCX](../../shared/glossary/nhcx.md) participant registry by [participant code](../glossary/participant-code.md). It takes the same body as [`/participant/search`](participant-search.md) and returns the same record.

Either path works. Use one of the two consistently across your integration.

## Before you start

- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.
- The participant code you want to read.

## What happens

Your system posts the code to the participant service. The registry answers on the same connection. Nothing changes and no callback follows.

| Environment | Participant service base URL |
|---|---|
| Sandbox | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/details' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "participant_code": "<PARTICIPANT_CODE_TO_READ>"
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

The response has the same shape as [`/participant/search`](participant-search.md): a `timestamp` and a `participants` array of records carrying `participant_code`, `roles`, `status`, `encryption_cert` and `endpoint_url`.

**Idempotency.** The call only reads. Repeating it is safe.

## How you know it worked

You receive HTTP 200 with a `participants` array. One entry carries the `participant_code` you sent, with status `Active` when the participant can transact.

## When it goes wrong

- **400 or an empty result.** The body used `participantid` or `participantcode`. This call takes `participant_code`.
- **No entry for the code.** The code is wrong or not registered. Messages addressed to it fail with [NHCX-1003](../errors/nhcx-1003.md).
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
