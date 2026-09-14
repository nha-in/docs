---
id: nhcx.sandbox.prerequisites
type: sandbox
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: What you need before you register on the NHCX sandbox
summary: >-
  The checklist to complete before your system can register on the claims exchange
  sandbox: a facility registration, sandbox credentials, basic health ID features,
  a role, a certificate and a callback address.
sources:
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications.md
  hash: sha256:56234dd8a55fe4eb9dd852779b22b522b04760c9bec5c263d5e9bc3ac2c6f167
  fetched: '2026-09-14'
  note: Site page /domain-specifications, text as shown on the site. Guidelines for Participant Onboarding; NHCX Sandbox Process.
- url: https://hcxsbx.abdm.gov.in/images/db83dc5cbbc464d8fa15.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/media/Guide For Providers.pdf
  hash: sha256:d5c8e55232cc854aa273e0bf4813db17999d7cd5f212eb84d92544b6b9f97e2b
  fetched: '2026-09-14'
  note: Guide For Providers, listed on https://hcxsbx.abdm.gov.in/#/media-center, not named in the NHCX document sheet. pages 3 and 5.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Q6 to Q9.
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Step 1 validations.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. sheet Bridge Error.
verified:
  status: unverified
related:
  flows:
  - nhcx.flow.sandbox-onboarding
  - nhcx.flow.generate-and-register-certificate
  sandbox:
  - nhcx.sandbox.environments-and-base-urls
  - nhcx.sandbox.callback-url-requirements
  - nhcx.sandbox.support-contacts
  - shared.sandbox.registration-and-credentials
  concepts:
  - nhcx.concept.participant-roles
  - nhcx.concept.participant-registry
  - nhcx.concept.encryption-certificate
  glossary:
  - shared.glossary.hfr
  - shared.glossary.m1
  - shared.glossary.abha
  - nhcx.glossary.irdai
  - nhcx.glossary.tpa
  - nhcx.glossary.payer
  - nhcx.glossary.provider
---

# What you need before you register on the NHCX sandbox

## In plain words

Before your system can join the NHCX sandbox, your organisation and your software must exist in the right registries. Your software must also support basic [ABHA](../../shared/glossary/abha.md) features.

Some steps need approval, and the reviews have no fixed turnaround time. Start them first.

## Before you start

Nothing. This page is the starting point.

## What happens

### 1. Register the organisation

- A [provider](../glossary/provider.md) registers each facility in the Health Facility Registry ([HFR](../../shared/glossary/hfr.md)) at https://facility.abdm.gov.in/. The HFR ID becomes your registry id. Questions go to `facility@nha.gov.in`.
- A [payer](../glossary/payer.md) or [TPA](../glossary/tpa.md) uses the id issued by [IRDAI](../glossary/irdai.md) or the relevant authority.
- The mobile number on the HFR record must be current. Participant creation checks it and sends a passcode to it.

### 2. Apply for ABDM sandbox credentials

1. Apply at https://sandbox.abdm.gov.in/sandbox/v3/.
2. Select "Providers and Payer" and Milestone 1 as your intent.
3. Wait for review. On approval you receive a client ID and a client secret.

The review is semi-manual. It filters out repeat requests from the same organisation, organisations missing from any registry, technology providers without a valid website, and spam.

### 3. Build Milestone 1

Your software must support [Milestone 1](../../shared/glossary/m1.md). It creates an ABHA number through Aadhaar or a driving licence. It verifies an ABHA number or ABHA address at patient registration.

### 4. Register on the NHCX sandbox

Register at https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration with your ABDM sandbox client ID and secret. After you submit the form, NHCX sandbox roles are assigned to your client.

### 5. Decide your role

| Role | Code | Registry | Registry code |
|---|---|---|---|
| Provider | `10001` | HFR | `10001` |
| Payer | `10002` | Payer | `10004` |
| TPA | `10003` | Payer | `10004` |

A wrong role and registry pair leads to access errors, rejected requests or misrouted messages.

### 6. Prepare the technical pieces

- An RSA key pair and an X.509 certificate. See [generate an encryption certificate](../flows/generate-and-register-certificate.md).
- A public HTTPS callback address. See [callback URL rules](callback-url-requirements.md).

Then create your participant code. See [onboard as a participant in the sandbox](../flows/sandbox-onboarding.md).

## How you know it worked

You are ready to register when all of these hold:

- Your facility has an HFR ID, or your payer holds its registry id.
- You hold an ABDM sandbox client ID and secret, and a session token call with them returns an access token.
- The NHCX sandbox registration form is submitted and roles are assigned to your client.
- You have a certificate and a reachable callback URL.

## When it goes wrong

- **You are waiting for sandbox approval.** The review has no fixed turnaround time, and nothing on your side speeds it up. Do not submit a second application: repeat requests are filtered out. Ask about a stalled request through the channels in [where to get help](support-contacts.md).
- **Participant creation fails the mobile number check.** The number must match the one on the HFR record for providers, or the payer record for payers. Update the registry record first.
- **"No user role found/associated for sender code."** Your client has no NHCX role yet. Confirm the sandbox registration form went through, then contact support.
- **Requests are rejected or misrouted after registration.** Check the role and registry codes you registered with.
