---
id: nhcx.endpoint.validate
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: GET /validate
summary: >-
  Confirm a production participant creation with the transaction id and the passcode
  sent to your registered mobile.
sources:
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2, Step 2 Participant Creation confirmation; Page 3 notes.
- url: https://hcxsbx.abdm.gov.in/images/293a43103f575b4e7f7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(PROD)_NHCX-OnBoarding APIs Postman Collection.zip
  hash: sha256:b96963e2eead0fe3e718eb7dd2374f1a15f0dbb1aed7197a1ceae59cefbc7214
  fetched: '2026-09-14'
  note: AWS(PROD)_NHCX-OnBoarding APIs Postman Collection, row 7 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman PROD_NHCX-OnBoarding APIs item /validate.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./validate.get.'
- url: https://hcxsbx.abdm.gov.in/images/be2e25fede3bf711f783.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/PMJAY Hospital Migration to HMIS via NHCX.docx
  hash: sha256:cf5c9bf1c402b214f65bbb7bd0822f3a76d8ccda9b69c7bf77ba131befef3bc6
  fetched: '2026-09-14'
  note: PMJAY Hospital Migration to HMIS via NHCX, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Section 3.2 Participant Confirmation (Step 2).
- url: https://hcxsbx.abdm.gov.in/images/bc2efb078b98548f8e6b.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Sandbox.pdf
  hash: sha256:cbd03baf428655f0305e2f60ca331f8b76700496b070c522cafcc95001710b3a
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Sandbox, row 4 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, API Definition - Create Participant.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.production-onboarding
  endpoints:
  - nhcx.endpoint.v2-participant-create
  - nhcx.endpoint.update-validate
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  concepts:
  - nhcx.concept.participant-registry
---

# GET /validate

## In plain words

This call confirms a production participant creation in the [NHCX](../../shared/glossary/nhcx.md) registry. You send the `transactionid` from [`/v2/participant/create`](v2-participant-create.md) and the passcode sent to your registered mobile number. Until it succeeds, your [participant code](../glossary/participant-code.md) is not confirmed.

It confirms creation only. To confirm an update, call [`/update/validate`](update-validate.md).

## Before you start

- A `transactionid` from [`/v2/participant/create`](v2-participant-create.md), less than 24 hours old.
- The passcode for that transaction, from the registered mobile number. A passcode works only with its own transaction id.
- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.

## What happens

Your system sends a GET with two query parameters. The registry checks the passcode against the transaction and answers on the same connection. There is no request body and no callback.

```bash
curl -G 'https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/validate' \
  -H 'Accept: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --data-urlencode 'transactionId=<TRANSACTIONID_FROM_V2_PARTICIPANT_CREATE>' \
  --data-urlencode 'passcode=<PASSCODE_SENT_TO_REGISTERED_MOBILE>'
```

The query parameter is `transactionId`, with a capital I. The create response spells the field `transactionid`.

This is the production address. In the sandbox, [`/participant/create`](participant-create.md) returns your participant code directly, with no confirmation step.

**Idempotency.** Call it once per transaction. If it fails, or the pair is older than 24 hours, call [`/v2/participant/create`](v2-participant-create.md) again and validate the new pair.

## How you know it worked

You receive HTTP 200. Your participant code is now confirmed.

[`/v2/participant/update`](v2-participant-update.md) now accepts that code for your certificate and bridge URL. Before confirmation it refuses the code.

## When it goes wrong

- **More than 24 hours have passed.** The transaction id and passcode have expired. Start again from [`/v2/participant/create`](v2-participant-create.md).
- **The passcode belongs to another transaction.** Create was called again, so a new pair was issued. Use the passcode that arrived after the latest create, with that call's transaction id.
- **You lost the transaction id.** Call create again and validate the new pair.
- **You called `/update/validate` by mistake.** That call confirms updates. Creation is confirmed here.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
