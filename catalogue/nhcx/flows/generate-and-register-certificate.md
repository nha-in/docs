---
id: nhcx.flow.generate-and-register-certificate
type: flow
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Generate an encryption certificate and register it
summary: >-
  Make the key pair and self-signed certificate that other participants use to seal
  messages to you, and publish the certificate in your participant record.
sources:
- url: https://hcxsbx.abdm.gov.in/images/ec361a6c3e90e766d227.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Steps to generate encryption Certificate.pdf
  hash: sha256:94605e935f05ebb49e24dee50787cb4f3f1c401983a9616a5aaabdbc302f664b
  fetched: '2026-09-14'
  note: Steps to generate encryption Certificate, row 20 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. pages 1-3, Steps 1 to 4.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths /participant/create, /participant/update, /v2/participant/update, /v2/update/cert, /fetch/certs.'
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Steps 3 and 4, Participant Updation.
- url: https://hcxsbx.abdm.gov.in/images/28df441a1ebeb1b0db15.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX PMJAY Integration Handbook.docx
  hash: sha256:beef72eb0c33bf23952d9260c30bfe6cc28796c731f5fbd2c4168e336f2859c1
  fetched: '2026-09-14'
  note: NHCX PMJAY Integration Handbook, row 24 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. 2.4 Encryption Steps; 3.3 Certificate Fetch.
verified:
  status: unverified
related:
  endpoints:
  - nhcx.endpoint.participant-create
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.update-validate
  - nhcx.endpoint.v2-update-cert
  - nhcx.endpoint.fetch-certs
  flows:
  - nhcx.flow.sandbox-onboarding
  - nhcx.flow.production-onboarding
  - nhcx.flow.rotate-certificate
  - nhcx.flow.receive-a-sealed-callback
  concepts:
  - nhcx.concept.encryption-certificate
  - nhcx.concept.jwe-envelope
  glossary:
  - nhcx.glossary.x509-certificate
  - nhcx.glossary.jwe
  errors:
  - nhcx.error.payr-1001
  - nhcx.error.payr-1002
  troubleshooting:
  - nhcx.troubleshooting.recipient-cannot-decrypt
---

# Generate an encryption certificate and register it

## In plain words

Every message on the [National Health Claims Exchange](../../shared/glossary/nhcx.md) (NHCX) is sealed so that only its recipient can open it. A sender seals with the recipient's public key. The recipient opens the message with the matching private key, which never leaves the recipient's systems.

This flow makes that key pair and wraps the public key in a self-signed [X.509 certificate](../glossary/x509-certificate.md). It then publishes the certificate in your participant record. From then on, any participant can fetch it and seal a [JWE](../glossary/jwe.md) to you.

## Before you start

- OpenSSL on the machine where your private key will live.
- A session token, for the registration call. See [the session token concept](../concepts/session-token.md).
- One of: the sandbox create call you are about to make, or an existing participant code. See [Onboard as a participant in the NHCX sandbox](sandbox-onboarding.md).
- `jq`, for the check in section 4.

## What happens

```mermaid
sequenceDiagram
    participant You as Your system
    participant PS as NHCX participant service
    participant Peer as Another participant
    Note over You: openssl makes private.key and certificate.crt, then base64
    You->>PS: POST /participant/create or /participant/update with encryption_cert
    PS-->>You: participant_code
    You->>PS: POST /fetch/certs with your own participant code
    PS-->>You: the certificate you registered
    Peer->>PS: POST /fetch/certs with your participant code
    PS-->>Peer: your encryption_cert
    Note over Peer: caches it for 24 hours and seals messages to you with it
```

### 1. Make the private key

```sh
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
```

This writes a 2048-bit RSA private key in PKCS#8 form, beginning `-----BEGIN PRIVATE KEY-----`. You decrypt every message sent to you with it. Keep it out of logs, repositories and messages.

### 2. Make a certificate signing request

```sh
openssl req -new -key private.key -out request.csr
```

OpenSSL prompts for country, state, organisation and similar fields, then writes `request.csr`.

### 3. Make the self-signed certificate

```sh
openssl x509 -req -in request.csr -signkey private.key -out certificate.crt -days 365
```

`certificate.crt` is valid for 365 days. Put the expiry date in your calendar now, and rotate before it.

### 4. Base64-encode the whole certificate

```sh
base64 < certificate.crt | tr -d '\n' > certificate_base64.txt
```

Encode the entire file, including the `-----BEGIN CERTIFICATE-----` and `-----END CERTIFICATE-----` lines. The result is one line, and it decodes back to your PEM file byte for byte.

### 5. Register it

| Where you are | Call | Field that takes the base64 |
|---|---|---|
| Sandbox, new participant | `POST /participant/create` | `encryption_cert` |
| Sandbox, existing participant | `POST /participant/update` with `participant_code` | `encryption_cert` |
| Production, first registration | `POST /v2/participant/update`, then `GET /update/validate` with the SMS passcode | `encryptioncert` |
| Production, replacing a certificate | `POST /v2/update/cert` with `participantId` | `certificate` |

Each call is described in its own endpoint atom: [create](../endpoints/participant-create.md), [update](../endpoints/participant-update.md), [v2 update](../endpoints/v2-participant-update.md) and [v2 update cert](../endpoints/v2-update-cert.md).

### 6. What senders do with it

Before sealing a message to you, a sender calls `POST /fetch/certs` with your participant code. It caches the answer for 24 hours rather than fetching on every message. The answer is an X.509 PEM certificate, or a bare public key.

## How you know it worked

The public key that `/fetch/certs` returns for your code is the one in your `certificate.crt`. Save the answer body as `response.json`, then run:

```sh
jq -r .encryption_cert response.json > fetched.pem
openssl x509 -in certificate.crt -pubkey -noout > mine.pub
openssl x509 -in fetched.pem -pubkey -noout > theirs.pub
diff mine.pub theirs.pub && echo "registered key matches"
```

If `fetched.pem` holds a bare public key rather than a certificate, compare it with `mine.pub` directly.

```observation schema=exit-condition
channel: synchronous
call: POST /fetch/certs
request:
  participantid: <YOUR_PARTICIPANT_CODE>
match:
  encryption_cert: diff of mine.pub and theirs.pub is empty
```

The first sealed message you receive then opens with `private.key`.

## When it goes wrong

- **Registration is refused.** The value is not base64, or you encoded only the lines between `BEGIN` and `END`. Encode the whole file as in step 4.
- **A payer reports it cannot encrypt to you.** Your registered certificate is missing, wrong or expired. Register a valid one. See [PAYR-1002](../errors/payr-1002.md).
- **A recipient cannot open what you send.** You sealed with an old or wrong copy of its certificate. Fetch it again. See [PAYR-1001](../errors/payr-1001.md) and [The recipient cannot decrypt your message](../troubleshooting/recipient-cannot-decrypt.md).
- **You sent `private.key` instead of `certificate.crt`.** Treat the key as exposed. Make a new pair and register the new certificate at once.
- **The certificate expired after 365 days.** Messages to you start failing. Follow [Rotate your encryption certificate](rotate-certificate.md).
