---
id: nhcx.flow.rotate-certificate
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Rotate your encryption certificate
summary: >-
  Replace the certificate other participants use to seal messages to you, without
  losing messages already sealed with the old one.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__data-security-and-privacy__message-security-and-integrity.md
  hash: sha256:3768fd89932e4081c9e03a8695619bcaf70c641e28bb55a77eec090bb926eeb3
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/data-security-and-privacy/message-security-and-integrity, text as shown on the site. Message security and integrity, key rotation note.
- url: https://hcxsbx.abdm.gov.in/images/ec361a6c3e90e766d227.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Steps to generate encryption Certificate.pdf
  hash: sha256:94605e935f05ebb49e24dee50787cb4f3f1c401983a9616a5aaabdbc302f664b
  fetched: '2026-09-14'
  note: Steps to generate encryption Certificate, row 20 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Step 3.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths /v2/update/cert and /participant/update.'
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. 3.3 Certificate Fetch.
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Steps 3 and 4.
related:
  endpoints:
  - nhcx.endpoint.session-token
  - nhcx.endpoint.v2-update-cert
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.update-validate
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.fetch-certs
  flows:
  - nhcx.flow.generate-and-register-certificate
  - nhcx.flow.production-onboarding
  - nhcx.flow.sandbox-onboarding
  - nhcx.flow.receive-a-sealed-callback
  concepts:
  - nhcx.concept.encryption-certificate
  sandbox:
  - nhcx.sandbox.support-contacts
  errors:
  - nhcx.error.payr-1001
  - nhcx.error.payr-1002
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
  glossary:
  - nhcx.glossary.x509-certificate
---

# Rotate your encryption certificate

## In plain words

Your encryption certificate lasts as long as you set when you made it: 365 days with the standard command. Rotate your encryption keys once a year, and at once if a private key may have leaked.

Rotation has one catch. Senders cache your certificate for 24 hours. For a day after the switch, some messages still arrive sealed with your old key. Keep the old key working until that window closes.

## Before you start

- A new key pair and base64 certificate, made as in [Generate an encryption certificate and register it](generate-and-register-certificate.md). Give the files new names, such as `private-2027.key`, so the old ones survive.
- The old private key, still available to your decryption code.
- A session token and your [participant code](../glossary/participant-code.md).
- For the production passcode route only: the person holding your registered mobile.

## What happens

```mermaid
sequenceDiagram
    participant You as Your system
    participant PS as NHCX participant service
    participant Peer as Sender with a cached copy
    Note over You: make a new key pair and certificate
    alt Production, no passcode
        You->>PS: POST /v2/update/cert with participantId and certificate
        PS-->>You: accepted
    else Production, with passcode
        You->>PS: POST /v2/participant/update with encryptioncert
        PS-->>You: transactionid, and an SMS passcode is sent
        You->>PS: GET /update/validate with transactionId and passcode
        PS-->>You: certificate registered
    else Sandbox
        You->>PS: POST /participant/update with participant_code and encryption_cert
        PS-->>You: participant_code
    end
    You->>PS: POST /fetch/certs with your participant code
    PS-->>You: the new certificate
    Peer->>You: messages sealed with the old key, for up to 24 hours
    Note over You: try the new key first, then the old one
```

### 1. Make the new pair

Follow steps 1 to 4 of [the certificate flow](generate-and-register-certificate.md) with new file names.

### 2. Register the new certificate

In production, the direct route needs no passcode:

```json
{
  "participantId": "<YOUR_PARTICIPANT_CODE>",
  "certificate": "<BASE64_OF_NEW_CERTIFICATE_CRT>"
}
```

Post it to `POST /v2/update/cert` on `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice`. Both fields are mandatory, and the certificate is base64-encoded. See [POST /v2/update/cert](../endpoints/v2-update-cert.md).

The passcode route, `POST /v2/participant/update` followed by `GET /update/validate`, also works. It is described in [Onboard as a participant in production](production-onboarding.md).

In the sandbox, send `POST /participant/update` with your `participant_code` and the new `encryption_cert`. See [POST /participant/update](../endpoints/participant-update.md).

### 3. Run both keys for 24 hours

From the moment of registration, decrypt with the new key first. If that fails, try the old key. Senders that fetched your certificate before the switch keep using it until their 24-hour cache expires.

### 4. Retire the old key

After 24 hours, remove the old key from your decryption path and destroy it.

If you rotated because a key may have leaked, report the compromise to the NHCX operators at once. See [Where to get help with NHCX](../sandbox/support-contacts.md).

## How you know it worked

`POST /fetch/certs` for your participant code returns the new public key. Compare it with the commands in [the certificate flow](generate-and-register-certificate.md). Messages sealed after the 24-hour window open with the new key, and none needs the old one.

```observation schema=exit-condition
channel: synchronous
call: POST /fetch/certs
request:
  participantid: <YOUR_PARTICIPANT_CODE>
match:
  encryption_cert: public key equals the one in the new certificate
```

## When it goes wrong

- **A message will not open with the new key.** The sender used a cached copy of the old certificate. Open it with the old key. If both keys fail, answer as in [Report a processing failure on /v1/error](report-a-processing-error.md). A payer uses [PAYR-1001](../errors/payr-1001.md) for this.
- **A payer reports it cannot encrypt to you.** The certificate you registered is wrong or expired. Register a valid one. See [PAYR-1002](../errors/payr-1002.md).
- **The production passcode expired.** It lasts 24 hours. Start the update again, or use `POST /v2/update/cert`.
- **You destroyed the old key too early.** Messages sealed with it inside the 24-hour window cannot be opened. Ask each sender to resend under a fresh request. See [The recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
