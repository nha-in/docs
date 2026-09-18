---
id: nhcx.concept.participant-roles
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: 'Participant roles: provider, payer, TPA and the exchange'
summary: >-
  Every system on the claims exchange registers with one role, and the role decides
  which messages it sends, which it receives and how it is addressed.
sources:
- url: https://hcxsbx.abdm.gov.in/images/260d0dec19a681e80262.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Onboarding providers and payers in Production.pdf
  hash: sha256:c38476fb90101f13fdfea447861292718d561e1dc088ae20950b193606500d2e
  fetched: '2026-09-14'
  note: Onboarding providers and payers in Production, row 5 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 4, Valid Role Enums and Registry Enums.
- url: https://hcxsbx.abdm.gov.in/images/ff9eae6e99c1aee8a9fd.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/FAQs.pdf
  hash: sha256:5275f391537c7a97c0d11321951eb0420bd97ed42d1b3bce241c013c4b677dd8
  fetched: '2026-09-14'
  note: FAQs, row 21 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 3, Q6 to Q9.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/healthcare-operation-policy/access-control
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__healthcare-operation-policy__access-control.md
  hash: sha256:7c3d7b2cf396a9daaca76ade1c059a8d358d0686b7b7e041e96c5f7f239dae57
  fetched: '2026-09-14'
  note: Site page /domain-specifications/healthcare-operation-policy/access-control, text as shown on the site. Access Controls role list.
- url: https://hcxsbx.abdm.gov.in/#/technical-specifications
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/technical-specifications.md
  hash: sha256:b2d4834fa71f26721319a8222ad44feb35467592d62a00e6c3127ac3636e96cc
  fetched: '2026-09-14'
  note: Site page /technical-specifications, text as shown on the site. API Structure table.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Policy Linking Process.
- url: https://hcxsbx.abdm.gov.in/images/038d85cffc7df66ed1a4.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Common Mistakes while implementing through NHCX.pdf
  hash: sha256:b4af12a432a29886e1ae4956340ff07782bba7df792380de3a408f4e5a55673f
  fetched: '2026-09-14'
  note: Common Mistakes while implementing through NHCX, row 22 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1 item 5; page 2 item 7.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, 'No user role found' row.
related:
  concepts:
  - nhcx.concept.participant-registry
  - nhcx.concept.participant-code
  - nhcx.concept.access-control
  - nhcx.concept.policy-linking
  - nhcx.concept.what-nhcx-is
  glossary:
  - nhcx.glossary.provider
  - nhcx.glossary.payer
  - nhcx.glossary.tpa
  - nhcx.glossary.irdai
  - shared.glossary.eua
  - shared.glossary.hfr
  endpoints:
  - nhcx.endpoint.participant-create
  - nhcx.endpoint.v2-participant-create
  - nhcx.endpoint.participant-get-policies
  flows:
  - nhcx.flow.sandbox-onboarding
  - nhcx.flow.production-onboarding
  - nhcx.flow.payer-process-a-request
---

# Participant roles: provider, payer, TPA and the exchange

## In plain words

Every system that talks through NHCX registers with a role. A hospital registers as a [provider](../glossary/provider.md). An insurer registers as a [payer](../glossary/payer.md). A [third party administrator (TPA)](../glossary/tpa.md) processes claims on an insurer's behalf.

The role decides which messages your system sends and which it must receive. NHCX itself has no role in a claim. It routes messages between the participants.

## Before you start

Know which kind of organisation you are building for. A hospital system registers as a provider. An insurer or TPA system registers as a payer or TPA.

## What happens

### The role codes

You pass one of these codes in `role` when you create a participant.

| Role | Code | Who |
|---|---|---|
| `PROVIDER` | `10001` | Hospitals, clinics, diagnostic centres |
| `PAYER` | `10002` | Insurers and State Health Agencies |
| `AGENCY_TPA` | `10003` | Third party administrators acting for a payer |
| `AGENCY_REGULATOR` | `10004` | Regulators such as the [IRDAI](../glossary/irdai.md) |
| `RESEARCH` | `10005` | Research bodies |
| `MEMBER_ISNP` | `10006` | Insurance self network platforms |
| `AGENCY_SPONSOR` | `10007` | Scheme owners |
| `HIE_HIO_HCX` | `10008` | Other exchange instances |
| `EUA` | `10009` | [End user applications](../../shared/glossary/eua.md), such as patient apps |

### Who starts which exchange

```mermaid
graph LR
  PR["Provider"] -->|eligibility, insurance plan,<br/>preauth, claim, reprocess| X["NHCX"]
  X --> PY["Payer or TPA"]
  PY -->|payment notice,<br/>communication request| X
  X --> PR
  RG["Regulator"] -->|claim search| X
```

A provider starts coverage eligibility, insurance plan, preauthorisation, claim and reprocess requests. A payer answers them. A payer starts payment notices and communication requests, and the provider answers those.

In version 1 of the exchange a TPA behaves like a payer. It receives the same requests and sends the same responses.

### The registry you prove yourself against

| Role | Registry ID you send | Registry type code |
|---|---|---|
| Provider | Your [HFR](../../shared/glossary/hfr.md) facility ID | `10001` (HFR) |
| Payer or TPA | Your IRDAI registration ID, without leading zeros | `10004` (PAYER) |
| End user application | Your client ID | `10001` |

The other registry type codes are `10002` (NIN) and `10003` (ROHINI).

### Payer and TPA together

Every insurer has its own participant code, even when a TPA processes its claims. When a policy is linked, `payerid` carries the insurer's code and `processingid` carries the TPA's code. A provider addresses claims on that policy to the `processingid`, because the TPA does the processing.

## How you know it worked

You have understood this when you can answer both of these.

1. An insurer uses a TPA. Which participant code does your hospital system put in `x-hcx-recipient_code` for a claim on that insurer's policy?
2. Which role sends a payment notice, and which role must answer it?

## When it goes wrong

**Addressing the insurer instead of the TPA.** A provider that uses the `PayerID` from the get policies response sends the claim to the wrong participant. Use the `processingID`. See [policy linking](./policy-linking.md).

**Wrong role or registry type at creation.** A code outside the lists above fails participant creation. A mismatch between role and registry type causes access problems and wrong routing later.

**No role on the sender.** A payer refuses a sender that has no role in NHCX with the message "No user role found/associated for sender code".
