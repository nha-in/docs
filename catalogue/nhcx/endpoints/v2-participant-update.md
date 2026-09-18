---
id: nhcx.endpoint.v2-participant-update
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /v2/participant/update
summary: >-
  Stage a production change to your encryption certificate or bridge address, to
  be confirmed with a passcode.
sources:
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Pages 2-3, Step 3 Participant Updation and Step 4.
- url: https://hcxsbx.abdm.gov.in/images/293a43103f575b4e7f7f.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(PROD)_NHCX-OnBoarding APIs Postman Collection.zip
  hash: sha256:b96963e2eead0fe3e718eb7dd2374f1a15f0dbb1aed7197a1ceae59cefbc7214
  fetched: '2026-09-14'
  note: AWS(PROD)_NHCX-OnBoarding APIs Postman Collection, row 7 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman PROD_NHCX-OnBoarding APIs item /v2/participant/update.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./v2/participant/update.post; schemas ParticipantCertUpdateRequest, ParticipantCertUpdateResp.'
- url: https://hcxsbx.abdm.gov.in/images/be2e25fede3bf711f783.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/PMJAY Hospital Migration to HMIS via NHCX.docx
  hash: sha256:cf5c9bf1c402b214f65bbb7bd0822f3a76d8ccda9b69c7bf77ba131befef3bc6
  fetched: '2026-09-14'
  note: PMJAY Hospital Migration to HMIS via NHCX, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Section 3.3 Participant Update (Step 3).
- url: https://hcxsbx.abdm.gov.in/images/ec361a6c3e90e766d227.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Steps to generate encryption Certificate.pdf
  hash: sha256:94605e935f05ebb49e24dee50787cb4f3f1c401983a9616a5aaabdbc302f664b
  fetched: '2026-09-14'
  note: Steps to generate encryption Certificate, row 20 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3, Step 4 Base64 Encoding.
related:
  concepts:
  - nhcx.concept.encryption-certificate
  - nhcx.concept.participant-registry
  flows:
  - nhcx.flow.production-onboarding
  - nhcx.flow.rotate-certificate
  endpoints:
  - nhcx.endpoint.update-validate
  - nhcx.endpoint.validate
  - nhcx.endpoint.v2-update-cert
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
---

# POST /v2/participant/update

## In plain words

This call stages a change to your production record in the [NHCX](../../shared/glossary/nhcx.md) registry. It carries your public encryption certificate, your bridge URL, or both. The registry sends a passcode to your registered mobile number, and the change takes effect when you confirm it with [`/update/validate`](update-validate.md).

In production, use this call for your first certificate and bridge URL after creation, and for later changes. For a certificate-only change without a passcode, call [`/v2/update/cert`](v2-update-cert.md). In the sandbox, use [`/participant/update`](participant-update.md).

## Before you start

- Your participant code is registered and its creation is confirmed with [`/validate`](validate.md).
- Your certificate, Base64 encoded. See [generate and register a certificate](../flows/generate-and-register-certificate.md).
- The matching private key is already deployed where you decrypt inbound messages.
- The person who holds the registered phone, ready to read you the passcode within 24 hours.
- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.

## What happens

1. Your system posts the change to the production participant service.
2. The registry answers on the same connection with a `transactionid` and sends a passcode to the registered mobile number.
3. You call [`/update/validate`](update-validate.md) with both within 24 hours. The change goes live then.

```bash
curl -X POST 'https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice/v2/participant/update' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "participantcode": "<YOUR_PARTICIPANT_CODE>",
    "encryptioncert": "<BASE64_OF_YOUR_PEM_CERTIFICATE>",
    "endpointurl": "<YOUR_BRIDGE_BASE_URL>"
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

The field names here have no underscores: `participantcode`, `encryptioncert`, `endpointurl`.

The response body has this shape:

```json
{
  "participant_code": "<YOUR_PARTICIPANT_CODE>",
  "status": "<STATUS>",
  "transactionid": "<TRANSACTION_ID_FOR_UPDATE_VALIDATE>"
}
```

**Idempotency.** Each call issues a new `transactionid` and a new passcode. A passcode works only with its own transaction id. If you lose the transaction id, issue the update again.

## How you know it worked

You receive HTTP 200 with your `participant_code` and a `transactionid`. A passcode arrives on the registered mobile number.

The change is live only when [`/update/validate`](update-validate.md) returns 200 for that pair. Then [`/fetch/certs`](fetch-certs.md) with your own code returns the new certificate.

## When it goes wrong

- **The participant code is refused.** Creation is not yet confirmed. Call [`/validate`](validate.md) first.
- **The certificate is refused.** It went as raw PEM. Base64 encode the whole PEM text.
- **You skipped `/update/validate`.** The old certificate and bridge URL stay live. Validate the pair.
- **Inbound messages stop decrypting after the change.** The new private key was not deployed first. See [recipient cannot decrypt](../troubleshooting/recipient-cannot-decrypt.md).
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
