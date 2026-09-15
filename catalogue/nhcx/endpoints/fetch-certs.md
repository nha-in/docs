---
id: nhcx.endpoint.fetch-certs
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /fetch/certs
summary: >-
  Fetch a recipient's public encryption certificate so you can seal a message only
  they can open.
sources:
- url: https://hcxsbx.abdm.gov.in/images/b885e59891fedc7e725c.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection.zip
  hash: sha256:2d082f244ee41d137a62af82380dcd2d5db9ebbab66824fd54a23c506d4d9a7f
  fetched: '2026-09-14'
  note: AWS(Sandbox)-PARTICIPANT SERVICE_APIs Postman Collection, row 16 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman SANDBOX-Participant_APIs item Fetch Certs.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./fetch/certs.post.'
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Section 3.3 Certificate Fetch; Section 2.4.
- url: https://hcxsbx.abdm.gov.in/images/30714ca3bc1fa2ca3ec4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Provider Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:1098cd595c986dca11bd09f2baad78f32b85ed68cec83524b5ec189643bade6a
  fetched: '2026-09-14'
  note: NHCX Provider Side Use Cases- Sandbox Exit Process, row 9 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 3 Get public Key.
- url: https://hcxsbx.abdm.gov.in/images/bd0c2ad1d5f672c40562.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Payer Side Use Cases- Sandbox Exit Process.pdf
  hash: sha256:50be7b035a2bed658b7cbbe2e8b02444aea2cda3e3af5ed04832565c825a603d
  fetched: '2026-09-14'
  note: NHCX Payer Side Use Cases- Sandbox Exit Process, row 10 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Use case 5 Get public Key.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, For Sandbox / For Production envBaseUrl.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.encryption-certificate
  - nhcx.concept.jwe-envelope
  flows:
  - nhcx.flow.send-a-sealed-request
  decisions:
  - nhcx.decision.key-encryption-algorithm
  endpoints:
  - nhcx.endpoint.fetch-participants-list
  - nhcx.endpoint.participant-search
  - nhcx.endpoint.session-token
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
  tests:
  - nhcx.test.provider-uc-03
  - nhcx.test.payer-uc-05
---

# POST /fetch/certs

## In plain words

This call returns a participant's public encryption certificate. You seal every [NHCX](../../shared/glossary/nhcx.md) message with the recipient's certificate, so only the recipient can open it. See [encryption certificates](../concepts/encryption-certificate.md) and [the JWE envelope](../concepts/jwe-envelope.md).

Get public Key is use case 3 of the provider [sandbox exit](../glossary/sandbox-exit.md) and use case 5 of the payer sandbox exit.

## Before you start

- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.
- The recipient's [participant code](../glossary/participant-code.md). It is the same value you will put in `x-hcx-recipient_code`.

## What happens

Your system posts the recipient's participant code to the participant service. The registry answers on the same connection with the certificate. Nothing changes and no callback follows.

| Environment | Participant service base URL |
|---|---|
| Sandbox | `https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice` |
| Production | `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice` |

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/fetch/certs' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "participantid": "<RECIPIENT_PARTICIPANT_CODE>"
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

`participantid` is mandatory.

The response body has this shape:

```json
{
  "encryption_cert": "-----BEGIN CERTIFICATE-----\n<BASE64_CERTIFICATE_BODY>\n-----END CERTIFICATE-----"
}
```

The value is PEM text. Some participants register a bare public key (SPKI) rather than a full [X.509 certificate](../glossary/x509-certificate.md). Import it as X.509 first, and fall back to SPKI if that fails. Short keys, under about 400 bytes, are usually SPKI.

Cache each certificate for 24 hours, keyed by participant code. Do not fetch it before every message.

**Idempotency.** The call only reads. Repeating it is safe.

## How you know it worked

You receive HTTP 200 with a PEM value in `encryption_cert`. Your code imports it as an X.509 certificate or an SPKI public key without error.

A message you seal with that key reaches the recipient, and the recipient opens it. A decryption error from the recipient means the key is wrong or stale.

## When it goes wrong

- **400 or no certificate.** The body used `participant_code` or `participantcode`. This call takes `participantid`.
- **The recipient cannot decrypt your message.** You sealed it with your own certificate, or with a cached one the recipient has since replaced. Evict the cache entry, fetch again and resend. See [recipient cannot decrypt](../troubleshooting/recipient-cannot-decrypt.md).
- **Key import fails.** The participant registered a bare SPKI key. Fall back to SPKI import.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
