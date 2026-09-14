---
id: nhcx.troubleshooting.recipient-cannot-decrypt
type: troubleshooting
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The recipient cannot decrypt your message
summary: >-
  The payer answers that it could not open your sealed payload. The checks that
  find the wrong key, form or header, in order.
sources:
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Bridge Error, PAYR-1001 and PAYR-1002; sheet Payer Error Codes.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Sections 2.1-2.4 and 3.3.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. NHCX Protocol Headers table.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. page 1, item 4; page 2, item 7.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.encryption-certificate
  - nhcx.concept.jwe-envelope
  - nhcx.concept.protocol-headers
  decisions:
  - nhcx.decision.key-encryption-algorithm
  - nhcx.decision.jwe-serialisation
  flows:
  - nhcx.flow.rotate-certificate
  - nhcx.flow.generate-and-register-certificate
  endpoints:
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.v2-update-cert
  - nhcx.endpoint.participant-update
  errors:
  - nhcx.error.payr-1001
  - nhcx.error.payr-1002
  sandbox:
  - nhcx.sandbox.support-contacts
  glossary:
  - nhcx.glossary.jwe
  - nhcx.glossary.x509-certificate
  - nhcx.glossary.protected-header
  - nhcx.glossary.tpa
---

# The recipient cannot decrypt your message

## In plain words

The payer's answer is a clear-text `ProtocolResponse` carrying `PAYR-1001`: an error occurred while decrypting the payload for the receiver code. The recipient could not open your [JWE](../glossary/jwe.md) with its private key. The fault is almost always on the sending side: the wrong certificate, the wrong algorithm or the wrong form.

## Before you start

- You have the `ProtocolResponse`, including `x-hcx-error_details` and the correlation id.
- You have read [your encryption certificate and the recipient's](../concepts/encryption-certificate.md).

## What happens

Work through these in order.

1. **Did you seal to the recipient you addressed?** The certificate must belong to the participant in `x-hcx-recipient_code`. Fetch it with [`POST /fetch/certs`](../endpoints/fetch-certs.md), passing that code as `participantid`. When a [TPA](../glossary/tpa.md) processes the policy, that is the `processingid`.
2. **Is your cached copy stale?** Cache a fetched certificate for 24 hours at most. On `PAYR-1001`, fetch it again and resend. A recipient that rotated its key has a new certificate.
3. **Did the key import correctly?** `/fetch/certs` can return a PEM-encoded [X.509 certificate](../glossary/x509-certificate.md) or a bare SubjectPublicKeyInfo public key. Try X.509 import first, then fall back to the bare key.
4. **Are the algorithms right?** The protected header must carry `alg` `RSA-OAEP-256` and `enc` `A256GCM`. See [RSA-OAEP or RSA-OAEP-256 for the content key](../decisions/key-encryption-algorithm.md).
5. **Is the form right?** The body must be `{"payload": "<JWE_COMPACT_STRING>"}`, a compact string with four dots. See [compact or flattened JWE serialisation](../decisions/jwe-serialisation.md).
6. **Is the [protected header](../glossary/protected-header.md) complete?** It must carry `x-hcx-sender_code`, `x-hcx-recipient_code`, `x-hcx-api_call_id`, `x-hcx-correlation_id`, `x-hcx-workflow_id`, `x-hcx-timestamp` and `x-hcx-status`, as participant codes from NHCX and fresh identifiers.

The reverse fault has its own code. `PAYR-1002` means the payer could not seal its answer to you with the certificate registered for you. Update your registered certificate with [`POST /v2/update/cert`](../endpoints/v2-update-cert.md) or [`POST /participant/update`](../endpoints/participant-update.md). The payer fetches the new one and sends its answer. See [rotate your encryption certificate](../flows/rotate-certificate.md).

## How you know it worked

You resend the same content with a fresh correlation id and a fresh api call id. NHCX refuses a correlation id it already holds with [`NHCX-1006`](../errors/nhcx-1006.md), and a request that failed is retired. The answer arrives as a sealed payload on your callback, not a `ProtocolResponse`. Your own decrypter opens it with your private key.

## When it goes wrong

If every check passes and `PAYR-1001` persists, confirm with the recipient that its registered certificate matches the private key it decrypts with. Then contact NHCX support with the receiver code and correlation id. See [support contacts](../sandbox/support-contacts.md).

The errors this symptom can surface: [PAYR-1001](../errors/payr-1001.md), the recipient could not decrypt your payload; and [PAYR-1002](../errors/payr-1002.md), the payer could not encrypt its answer to you.
