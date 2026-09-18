---
id: nhcx.concept.participant-registry
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: The participant registry and what a participant record holds
summary: >-
  The participant registry is the exchange's address book: each record holds a participant's
  code, role, callback address and public certificate, and nothing routes until
  the record is confirmed.
sources:
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications/open-protocol/registries
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications__open-protocol__registries.md
  hash: sha256:04bf78739fa0c3807a8a5a49d8c3e004f8aba664f524d0344d7fc44c3b2baf42
  fetched: '2026-09-14'
  note: Site page /technical-specifications/open-protocol/registries, text as shown on the site. Participating Organisations/Systems Registry table.
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Steps 1-4 and Participant Certificate Updation.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths /fetch/participants/list and /fetch/certs.'
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, HFR mismatch row.
related:
  concepts:
  - nhcx.concept.participant-code
  - nhcx.concept.participant-roles
  - nhcx.concept.encryption-certificate
  - nhcx.concept.session-token
  endpoints:
  - nhcx.endpoint.participant-create
  - nhcx.endpoint.v2-participant-create
  - nhcx.endpoint.validate
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.update-validate
  - nhcx.endpoint.participant-search
  - nhcx.endpoint.participant-details
  - nhcx.endpoint.fetch-participants-list
  - nhcx.endpoint.fetch-certs
  - nhcx.endpoint.v2-update-cert
  flows:
  - nhcx.flow.sandbox-onboarding
  - nhcx.flow.production-onboarding
  - nhcx.flow.generate-and-register-certificate
  errors:
  - nhcx.error.nhcx-1002
  - nhcx.error.nhcx-1003
  - nhcx.error.nhcx-1004
  glossary:
  - nhcx.glossary.participant-code
  - shared.glossary.hfr
---

# The participant registry and what a participant record holds

## In plain words

The participant registry is the exchange's address book. It holds one record for every organisation that can send or receive through NHCX.

When a message arrives, NHCX looks up the sender and the recipient here. It finds where to deliver the message. Other participants find your public certificate here, so they can seal messages for you.

## Before you start

You need a session token from your ABDM credentials. See [the session token](./session-token.md). A provider also needs an [HFR](../../shared/glossary/hfr.md) facility ID whose registered mobile number you can receive a passcode on.

## What happens

### What a record holds

| Attribute | Required | What it is for |
|---|---|---|
| `participant_code` | Yes | Your address on the exchange, issued by NHCX. See [participant codes](./participant-code.md) |
| `participant_name` | Yes | Your organisation's name |
| `roles` | Yes | What you may send and receive. See [participant roles](./participant-roles.md) |
| `registry_code` | No | Your ID in the external registry, such as your HFR ID |
| `mobile` | Yes | One to three numbers; passcodes go here |
| `email`, `phone` | No | Up to three each |
| `status` | Yes | Where the record is in its life |
| `endpoint_url` | Yes | Where NHCX delivers your incoming messages |
| `encryption_cert` | Yes | Your public certificate, so others can seal messages for you |
| `signing_cert_path`, `address`, `payment_details` | No | Signing certificate, address, bank or UPI details |

### How a record comes to life

```mermaid
graph LR
  C["Create<br/>role, registry ID, mobile"] -->|passcode to registered mobile| V["Confirm<br/>transaction ID + passcode"]
  V --> A["Active"]
  A --> U["Update<br/>endpoint URL + certificate"]
  U -->|passcode| UV["Confirm update"]
  UV --> R["Ready to exchange"]
```

1. **Create.** You send the registry type, registry ID, role, mobile and email. NHCX checks the mobile number against the HFR record for a provider, or the payer record for a payer. It returns your participant code.
2. **Confirm.** When the create response carries a `transactionid`, NHCX sends a passcode to the registered mobile. You confirm with both. Until then the record cannot be used.
3. **Update.** You add your endpoint URL and your Base64 encoded certificate.
4. **Confirm the update.** A second passcode confirms it. The endpoint and certificate then become live.

In production the transaction ID and passcode are valid for 24 hours. A certificate alone can later be replaced without a passcode.

### The four states

The registry model defines four states: created and not yet verified, active, inactive, and blocked. Only an active participant can exchange messages.

### How others read the registry

A sender lists participants by role with `/fetch/participants/list`. It fetches a recipient's certificate with `/fetch/certs`, passing the recipient's participant code.

## How you know it worked

You have understood this when you can answer both of these.

1. Your participant is created and confirmed, but no endpoint URL is recorded. What happens to a claim response a payer sends you?
2. You changed your key pair. Which attribute must change in your record, and why do other participants care?

## When it goes wrong

**The mobile number does not match.** For a provider, the mobile you send must match the HFR record exactly. Correct it in HFR or send the registered number.

**Lost transaction ID or expired passcode.** Start the create or update call again. Each call issues a new transaction ID and passcode.

**Sender or receiver not registered.** NHCX refuses the message with [NHCX-1002](../errors/nhcx-1002.md) or [NHCX-1003](../errors/nhcx-1003.md). [NHCX-1004](../errors/nhcx-1004.md) means no receiver is registered for the scheme you addressed.

**HFR ID in the bundle differs from the registry.** The PMJAY payer checks the hospital HFR ID in the bundle. It refuses the bundle when that ID differs from the sender's registry ID.
