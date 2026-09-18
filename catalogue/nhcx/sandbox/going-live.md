---
id: nhcx.sandbox.going-live
type: sandbox
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Going live on NHCX production
summary: >-
  What happens after sandbox sign-off: the production role, registering and confirming
  your participant with a passcode, adding your certificate and callback address,
  and the first live claims.
sources:
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Steps 1-4 and certificate update.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. Go Live Process.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. item 5.
- url: https://hcxsbx.abdm.gov.in/images/b6bd99dab49a5e928ea3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Overview.pdf
  hash: sha256:c95469758a25cb8aca8c47757d8b18b4dedb8b4d42669663cff7343205f77fda
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Overview, row 27 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. integration roadmap.
- url: https://hcxsbx.abdm.gov.in/participanthcxservice/api-docs
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/swagger/participanthcxservice.json
  hash: sha256:6d0a2192da8160fe4b292bbdd81e937ba254bf6d27915d23907e70b82faebf63
  fetched: '2026-09-14'
  note: 'API specification: participanthcxservice, row 23 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/technical-specifications/api-specifications. paths /v2/participant/create, /validate, /v2/participant/update, /update/validate, /v2/update/cert.'
related:
  flows:
  - nhcx.flow.production-onboarding
  - nhcx.flow.rotate-certificate
  endpoints:
  - nhcx.endpoint.v2-participant-create
  - nhcx.endpoint.validate
  - nhcx.endpoint.v2-participant-update
  - nhcx.endpoint.update-validate
  - nhcx.endpoint.v2-update-cert
  sandbox:
  - nhcx.sandbox.sandbox-exit
  - nhcx.sandbox.environments-and-base-urls
  - nhcx.sandbox.support-contacts
  - shared.sandbox.wasa
  concepts:
  - nhcx.concept.participant-roles
  - nhcx.concept.encryption-certificate
  glossary:
  - shared.glossary.m1
  - shared.glossary.hfr
  - shared.glossary.otp
  - shared.glossary.nha
---

# Going live on NHCX production

## In plain words

Going live moves your system from the sandbox to production, where claims are real. After sign-off, [NHA](../../shared/glossary/nha.md) enables your production client for NHCX. You then register your participant in production and confirm each step with a passcode sent to your registered mobile number.

## Before you start

- You hold the sandbox sign-off email. See [the sandbox exit process](sandbox-exit.md).
- You hold production credentials for [Milestone 1](../../shared/glossary/m1.md). These follow Milestone 1 functional testing, the security audit ([WASA](../../shared/sandbox/wasa.md)) and the Health Tech Committee demo.
- The mobile number on your [HFR](../../shared/glossary/hfr.md) record, or your payer record, is one you can receive messages on.
- You have a production certificate and a production callback URL.

## What happens

### 1. Role assignment

NHA assigns the provider role to your Milestone 1 production client ID. The same client ID gives you NHCX production access. Production participant APIs are under `https://apisprod.nha.gov.in/pmjay/hcx/participanthcxservice`.

### 2. Create and confirm your participant

| Step | Call | What you send | What happens |
|---|---|---|---|
| 1 | `POST /v2/participant/create` | `registrytype`, `registryid`, `role`, `endpoint_url`, `mobilenumber`, `email` | Returns `participantid` and `transactionid`; a passcode goes to the registered mobile |
| 2 | `GET /validate?transactionId=<TRANSACTION_ID_FROM_STEP_1>&passcode=<PASSCODE_FROM_SMS>` | | Confirms the participant |
| 3 | `POST /v2/participant/update` | `participantcode`, `encryptioncert` (base64 certificate), `endpointurl` | Returns a new `transactionid`; a new passcode goes to the mobile |
| 4 | `GET /update/validate?transactionId=<TRANSACTION_ID_FROM_STEP_3>&passcode=<PASSCODE_FROM_SMS>` | | Activates your certificate and callback URL |

Each transaction id and passcode is valid for 24 hours. Each passcode belongs to one transaction id.

A provider's registry id is its HFR ID. A payer passes its IRDAI registry id without leading zeros: pass `123`, not `0123`.

See [onboard as a participant in production](../flows/production-onboarding.md) for each call.

### 3. Rotate certificates later

`POST /v2/update/cert` with `participantId` and a base64 `certificate` replaces your certificate without a passcode. See [rotate your encryption certificate](../flows/rotate-certificate.md).

### 4. Go live

- Keep production secrets safe. Report any compromise to the NHCX operators at once.
- Train your staff and plan the change before go-live.
- Start with a pilot on a small set of cases.

## How you know it worked

- Step 2 and step 4 both return success for their transaction ids.
- `/fetch/certs` on the production participant base returns your new certificate for your participant code.
- A first production request is accepted with `202`, and its callback arrives at your production `endpoint_url`.

## When it goes wrong

- **You are waiting for the production role.** Role assignment follows the sign-off email and has no fixed turnaround time. Until it is done, production calls fail. Ask about it through [where to get help](support-contacts.md), quoting your sign-off email.
- **The passcode expired, or you lost the transaction id.** Start that step again. Creating or updating again issues a new transaction id and passcode.
- **Creation fails the mobile number check.** The number must match the HFR record for providers, or the payer record for payers.
- **Production rejects your registry id.** Providers send the HFR ID. Payers drop leading zeros from the IRDAI id.
