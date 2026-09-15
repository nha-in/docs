---
id: nhcx.endpoint.v2-update-cert
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v2/update/cert
summary: >-
  Replace your production encryption certificate in the registry without a passcode
  step.
sources:
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Participant Certificate Updation.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v2/update/cert.post; schema UpdateCertV2.'
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.3 Certificate Fetch.
- url: https://hcxsbx.abdm.gov.in/images/ec361a6c3e90e766d227.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Steps to generate encryption Certificate.pdf
  hash: sha256:94605e935f05ebb49e24dee50787cb4f3f1c401983a9616a5aaabdbc302f664b
  fetched: '2026-09-14'
  note: Steps to generate encryption Certificate, row 20 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3, Step 4 Base64 Encoding.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.encryption-certificate
  flows:
  - nhcx.flow.rotate-certificate
  - nhcx.flow.generate-and-register-certificate
  endpoints:
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
---

# POST /v2/update/cert

## In plain words

This call replaces the public encryption certificate on your production record in the [NHCX](../../shared/glossary/nhcx.md) registry. It needs no passcode. Only the certificate changes; your bridge URL stays as it is.

To change the bridge URL too, call [`/v2/participant/update`](v2-participant-update.md) and confirm with [`/update/validate`](update-validate.md). In the sandbox, change your certificate with [`/participant/update`](participant-update.md).

## Before you start

- Your production [participant code](../glossary/participant-code.md).
- The new certificate, Base64 encoded. See [generate and register a certificate](../flows/generate-and-register-certificate.md).
- The matching private key is already deployed where you decrypt inbound messages.
- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.

## What happens

Your system posts the participant id and the new certificate. The registry replaces the certificate and answers on the same connection. No callback follows.

```bash
curl -X POST 'https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/update/cert' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "participantId": "<YOUR_PARTICIPANT_CODE>",
    "certificate": "<BASE64_OF_YOUR_PEM_CERTIFICATE>"
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

Both fields are mandatory. Note the casing: `participantId` with a capital I, and `certificate`.

**Idempotency.** Each call writes the certificate you send. Before you retry a call that timed out, fetch your own certificate with [`/fetch/certs`](fetch-certs.md) and compare.

## How you know it worked

You receive HTTP 200. [`/fetch/certs`](fetch-certs.md) with your own participant code returns the new certificate.

Counterparties cache certificates for up to 24 hours. Keep the old private key available for that long, so messages sealed with the old certificate still open.

## When it goes wrong

- **The certificate is refused.** It went as raw PEM. Base64 encode the whole PEM text.
- **A field is refused.** The body used `participant_code`, `participantcode` or `encryptioncert`. This call takes `participantId` and `certificate`.
- **Inbound messages stop decrypting.** The new certificate went live before its private key. Deploy the key first. See [recipient cannot decrypt](../troubleshooting/recipient-cannot-decrypt.md).
- **The bridge URL did not change.** This call changes only the certificate. Use [`/v2/participant/update`](v2-participant-update.md).
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
