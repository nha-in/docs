---
id: nhcx.endpoint.update-validate
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: GET /update/validate
summary: >-
  Confirm a production change to your certificate or bridge address with the transaction
  id and the passcode sent to your registered mobile.
sources:
- url: https://hcxsbx.abdm.gov.in/images/293a43103f575b4e7f7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(PROD)_NHCX-OnBoarding APIs Postman Collection.zip
  hash: sha256:b96963e2eead0fe3e718eb7dd2374f1a15f0dbb1aed7197a1ceae59cefbc7214
  fetched: '2026-09-14'
  note: AWS(PROD)_NHCX-OnBoarding APIs Postman Collection, row 7 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman PROD_NHCX-OnBoarding APIs item /update/validate.
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3, Step 4 Participant Updation confirmation.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./update/validate.get.'
- url: https://hcxsbx.abdm.gov.in/images/be2e25fede3bf711f783.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/PMJAY Hospital Migration to HMIS via NHCX.docx
  hash: sha256:cf5c9bf1c402b214f65bbb7bd0822f3a76d8ccda9b69c7bf77ba131befef3bc6
  fetched: '2026-09-14'
  note: PMJAY Hospital Migration to HMIS via NHCX, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Section 3.4 Update Confirmation (Step 4).
- url: https://hcxsbx.abdm.gov.in/images/bc2efb078b98548f8e6b.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Sandbox.pdf
  hash: sha256:cbd03baf428655f0305e2f60ca331f8b76700496b070c522cafcc95001710b3a
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Sandbox, row 4 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2-3, API Definition - Update Participant.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.3 Certificate Fetch.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.production-onboarding
  - nhcx.flow.rotate-certificate
  endpoints:
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.validate
  - nhcx.endpoint.v2-update-cert
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  concepts:
  - nhcx.concept.encryption-certificate
---

# GET /update/validate

## In plain words

This call confirms a production change to your [NHCX](../../shared/glossary/nhcx.md) registry record. [`/v2/participant/update`](v2-participant-update.md) stages a new certificate or bridge URL and sends a passcode to your registered mobile number. This call presents that passcode, and the change takes effect.

It confirms updates only. To confirm a creation, call [`/validate`](validate.md). To replace only the certificate without a passcode, call [`/v2/update/cert`](v2-update-cert.md).

## Before you start

- Your participant creation is already confirmed with [`/validate`](validate.md).
- A `transactionid` from [`/v2/participant/update`](v2-participant-update.md), less than 24 hours old.
- The passcode for that transaction, from the registered mobile number.
- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.

## What happens

Your system sends a GET with two query parameters. The registry checks the passcode against the update transaction and answers on the same connection. There is no request body and no callback.

```bash
curl -G 'https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/update/validate' \
  -H 'Accept: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  --data-urlencode 'transactionId=<TRANSACTIONID_FROM_V2_PARTICIPANT_UPDATE>' \
  --data-urlencode 'passcode=<PASSCODE_SENT_TO_REGISTERED_MOBILE>'
```

The query parameter is `transactionId`, with a capital I.

This is the production address. In the sandbox, [`/participant/update`](participant-update.md) applies changes directly, with no confirmation step.

**Idempotency.** Call it once per transaction. Each new update issues a new transaction id and passcode. If the pair has expired, call [`/v2/participant/update`](v2-participant-update.md) again and validate the new pair.

## How you know it worked

You receive HTTP 200. The staged certificate and bridge URL are now your live registry values.

[`/fetch/certs`](fetch-certs.md) with your own participant code returns the new certificate. NHCX delivers your next inbound message to the new bridge URL.

## When it goes wrong

- **More than 24 hours have passed.** The pair has expired. Issue the update again with [`/v2/participant/update`](v2-participant-update.md).
- **The passcode belongs to an earlier update.** A later update replaced the pair. Use the passcode that arrived after the latest update call.
- **You lost the transaction id.** Issue the update again.
- **You called `/validate` by mistake.** That call confirms creation. Updates are confirmed here.
- **The old certificate is still served.** Counterparties cache certificates for up to 24 hours. Keep your old private key available until that window has passed.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
