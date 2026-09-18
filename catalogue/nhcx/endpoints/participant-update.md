---
id: nhcx.endpoint.participant-update
type: endpoint
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: POST /participant/update
summary: >-
  Change your sandbox registry record, such as your bridge address or encryption
  certificate.
sources:
- url: https://hcxsbx.abdm.gov.in/images/e683dda0a8cf953abbc7.zip
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/AWS(Sandbox)NHCX-OnBoarding APIs Postman Collection.zip
  hash: sha256:ca4348e8a373c54bdcabd07eff8e49a55d93cdfae65fa5008ae0d56526a769f2
  fetched: '2026-09-14'
  note: AWS(Sandbox)NHCX-OnBoarding APIs Postman Collection, row 6 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Postman SANDBOX_NHCX-OnBoarding APIs item Participant Update.
- url: https://hcxsbx.abdm.gov.in/images/bc2efb078b98548f8e6b.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Sandbox.pdf
  hash: sha256:cbd03baf428655f0305e2f60ca331f8b76700496b070c522cafcc95001710b3a
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Sandbox, row 4 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 2-3, API Definition - Update Participant.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths./participant/update.post; schema ParticipantUpdateBody.'
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 5, Q21 Not getting call back on my server.
related:
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.encryption-certificate
  flows:
  - nhcx.flow.sandbox-onboarding
  - nhcx.flow.rotate-certificate
  endpoints:
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.v2-update-cert
  - nhcx.endpoint.participant-create
  - nhcx.endpoint.participant-search
  - nhcx.endpoint.fetch-certs
  errors:
  - nhcx.error.nhcx-401
  troubleshooting:
  - nhcx.troubleshooting.callback-url-rejected
  - nhcx.troubleshooting.recipient-cannot-decrypt
  sandbox:
  - nhcx.sandbox.callback-url-requirements
---

# POST /participant/update

## In plain words

This call changes your record in the [NHCX](../../shared/glossary/nhcx.md) participant registry. Use it to move your bridge URL, replace your encryption certificate or change any other attribute. `participant_code` is mandatory in every request.

This is the sandbox update call. In production, call [`/v2/participant/update`](v2-participant-update.md) and confirm it with [`/update/validate`](update-validate.md). For a production certificate change without a passcode, call [`/v2/update/cert`](v2-update-cert.md).

## Before you start

- Your [participant code](../glossary/participant-code.md) from [`/participant/create`](participant-create.md).
- A current access token from the [session call](session-token.md). It goes in the `bearer_auth` header as `Bearer <token>`, with `Bearer` and a space in front.
- For a new certificate: the Base64 certificate, with its private key already deployed where you decrypt inbound messages. See [rotate a certificate](../flows/rotate-certificate.md).
- For a new bridge URL: the new host is live on a domain name in India. Your firewall lets the NHCX NAT addresses through. See [callback URL requirements](../sandbox/callback-url-requirements.md).

## What happens

Your system posts the record to the sandbox participant service. The registry validates the linked registry codes, applies the change and answers on the same connection. No callback follows.

```bash
curl -X POST 'https://apisbx.abdm.gov.in/pmjay/sbxhcx/participanthcxservice/participant/update' \
  -H 'Accept: application/json' \
  -H 'Content-Type: application/json' \
  -H 'bearer_auth: Bearer <ACCESS_TOKEN_FROM_SESSION_TOKEN>' \
  -d '{
    "participant_code": "<YOUR_PARTICIPANT_CODE>",
    "participant_name": "<YOUR_ORGANISATION_NAME>",
    "scheme_code": "<SCHEME_CODE_SUCH_AS_PMJAY>",
    "roles": ["<ROLE_CODE>"],
    "primaryEmail": "<YOUR_EMAIL>",
    "phone": ["<YOUR_LANDLINE>"],
    "primaryMobile": "<YOUR_MOBILE>",
    "signing_cert_path": "<URL_OF_YOUR_SIGNING_CERTIFICATE>",
    "encryption_cert": "<BASE64_OF_YOUR_PEM_CERTIFICATE>",
    "endpoint_url": "<YOUR_BRIDGE_URL>"
  }'
```

Send all three headers on every participant service call: `Accept`, `Content-Type` and `bearer_auth`. The token header is `bearer_auth`, not `Authorization`.

The field names are snake_case, as in [`/participant/create`](participant-create.md). Role codes are listed there.

The response body has this shape:

```json
{
  "participant_code": "<YOUR_PARTICIPANT_CODE>"
}
```

**Idempotency.** Send the values you want the record to hold. Before you retry an update that timed out, read your record with [`/participant/search`](participant-search.md) and compare.

## How you know it worked

You receive HTTP 200 with your own `participant_code` in the body.

[`/participant/search`](participant-search.md) with your code returns the new `endpoint_url` or `encryption_cert`. After a certificate change, [`/fetch/certs`](fetch-certs.md) with your code returns the new certificate.

## When it goes wrong

- **400 Client error.** A field name came from the v2 body, such as `participantcode`, `encryptioncert` or `endpointurl`. Use the snake_case names above. A missing `Accept` header also fails the call.
- **Inbound messages stop decrypting after a certificate change.** The new certificate went live before its private key did. Deploy the key first. See [recipient cannot decrypt](../troubleshooting/recipient-cannot-decrypt.md).
- **Messages stop arriving after a bridge change.** The new `endpoint_url` uses an IP address or a port, or the host is outside India. See [callback URL rejected](../troubleshooting/callback-url-rejected.md).
- **404 Resource not found.** The `participant_code` is wrong. Copy it from the create response.
- **401 Unauthorized.** The token is missing, has expired, or went out without the `Bearer ` prefix. Mint a new token, then retry the call once. See [NHCX-401](../errors/nhcx-401.md) and [every call returns 401](../troubleshooting/everything-returns-401.md).
