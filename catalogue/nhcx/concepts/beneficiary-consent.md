---
id: nhcx.concept.beneficiary-consent
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Beneficiary consent and data rights
summary: >-
  The patient's data stays sealed from the exchange, research sees only aggregates,
  individual data needs the patient's consent, and the patient must agree before
  an app subscribes to their claim updates.
sources:
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/healthcare-operation-policy/access-control
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__healthcare-operation-policy__access-control.md
  hash: sha256:7c3d7b2cf396a9daaca76ade1c059a8d358d0686b7b7e041e96c5f7f239dae57
  fetched: '2026-09-14'
  note: Site page /domain-specifications/healthcare-operation-policy/access-control, text as shown on the site. Access Controls, research and member.isnp rows.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/healthcare-operation-policy/guidlines-beneficiary
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__healthcare-operation-policy__guidlines-beneficiary.md
  hash: sha256:3eee6ea210a8711f953221c91f172513d9b0dd6a33c70367833d2755443fdb08
  fetched: '2026-09-14'
  note: Site page /domain-specifications/healthcare-operation-policy/guidlines-beneficiary, text as shown on the site. Guidelines for Beneficiary Authentication.
- url: https://hcxsbx.abdm.gov.in/images/9f1e6b545a693d38a704.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/Biometric Authentication Implementation Steps.docx
  hash: sha256:fac8b14bfe8d518c0e651740537b9441c501d3cf2ab0f0482a07ab9f417e43a9
  fetched: '2026-09-14'
  note: Biometric Authentication Implementation Steps, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Handle Exemption and Biometric Authentication rows.
- url: https://hcxsbx.abdm.gov.in/images/dffb62a375449b37ad73.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Guide.pdf
  hash: sha256:d9cdc0997294a788f33d2e00638c787dd790ebd2a2e52be97ad024d864c2b164
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Guide, row 28 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Page 5 section 1.2 and page 19 biometric table.
- url: https://hcxsbx.abdm.gov.in/images/01db86335b7c226eb745.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/NHCX Notification Integration.docx
  hash: sha256:05908862c103522fac0dbb482f8eb6a0f8536fc12b1ae3bdb0e98615f30812aa
  fetched: '2026-09-14'
  note: NHCX Notification Integration, listed on https://hcxsbx.abdm.gov.in/#/documents, not named in the NHCX document sheet. Section 7.3 Privacy.
- url: https://hcxsbx.abdm.gov.in/#/domain-specifications/healthcare-operation-policy/guidelines-event-audits
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/pages/domain-specifications__healthcare-operation-policy__guidelines-event-audits.md
  hash: sha256:2ad75de1a412e4f39b1a922a0d90fa8f7c76770ea55a42cb4b308d3ba534a9c7
  fetched: '2026-09-14'
  note: Site page /domain-specifications/healthcare-operation-policy/guidelines-event-audits, text as shown on the site. Guidelines for Event Audits.
- url: https://hcxsbx.abdm.gov.in/images/539853c50347b32b9a5e.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Policy Linking and De-Linking Process.pdf
  hash: sha256:420115b9a54e15fa625312a56362164d92d23dd0d6ebf9195135bb00055d1911
  fetched: '2026-09-14'
  note: Policy Linking and De-Linking Process, row 8 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Page 1, Policy Linking Process.
- url: https://hcxsbx.abdm.gov.in/images/5a6cd3fe4604321fd732.xlsx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/documents/Standard Error Codes.xlsx
  hash: sha256:3ab37546fe8a60adb66c37fab8ed707db6af8e1f1acd69350f8e267bb30acd76
  fetched: '2026-09-14'
  note: Standard Error Codes, row 18 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/documents. Sheet Bridge Error, PAYR-1256 message.
verified:
  status: unverified
related:
  concepts:
  - nhcx.concept.biometric-authentication
  - nhcx.concept.notifications
  - nhcx.concept.access-control
  - nhcx.concept.audit-and-non-repudiation
  - nhcx.concept.policy-linking
  - nhcx.concept.jwe-envelope
  glossary:
  - shared.glossary.consent-manager
  - shared.glossary.abha
  - shared.glossary.kyc
  - shared.glossary.otp
  errors:
  - nhcx.error.payr-1256
  - nhcx.error.payr-1363
---

# Beneficiary consent and data rights

## In plain words

A claim carries a patient's diagnosis, treatment and money. The exchange is built so that this data reaches only the parties that need it.

Some protections are technical: the exchange cannot read the claim at all. Others are rules about consent: some parties may see a patient's data only if the patient agrees. And the patient must prove who they are before a claim starts.

## Before you start

Read [access control](./access-control.md).

## What happens

### Where the patient's data can go

| Who | What they may see |
|---|---|
| The hospital and the payer on the claim | The full claim, sealed for each other |
| NHCX | The envelope only, never the payload |
| Research bodies | Aggregate and anonymised data only |
| Insurance self network platforms | Individual claims only with the patient's consent |
| The patient | The audit trail of events on their claims |

An insurance self network platform submits the patient's consent in the domain header of its request. The consent flow works with the existing [consent manager](../../shared/glossary/consent-manager.md) infrastructure.

### Consent before notifications

A patient app must get the patient's explicit consent before it subscribes to their claim updates. It must show the subscription status and let the patient turn it off. See [notifications](./notifications.md).

### Proving the patient is present

```mermaid
graph TD
  P["Patient at the hospital"] --> K["Aadhaar eKYC"]
  P --> A["Aadhaar OTP or biometric"]
  A --> T["Token carried into preauth and claim"]
  P --> X["Biometric not possible"]
  X --> E["Exemption consent document<br/>signed by patient and hospital"]
  E --> QR["Authentication Consent Questionnaire<br/>answered in the bundle"]
```

A provider verifies the patient with Aadhaar eKYC, or with Aadhaar [OTP](../../shared/glossary/otp.md) or biometric authentication. For PMJAY, biometric presence is required at registration, preauthorisation and discharge. See [biometric authentication](./biometric-authentication.md).

When biometric authentication is not possible, the hospital obtains an Aadhaar exemption consent document signed by the patient and a hospital representative. It stores the document, links it to the patient's record, and answers the Authentication Consent Questionnaire in the bundle.

### Linking the patient's policy

A payer links a patient's [ABHA](../../shared/glossary/abha.md) to the policies the patient holds, so hospitals can find their cover. Only the payer or its TPA can change that link. See [policy linking](./policy-linking.md).

## How you know it worked

You have understood this when you can answer both of these.

1. A patient cannot give a fingerprint after an accident. What must the hospital obtain and store, and what goes into the preauthorisation instead of the token?
2. A research body wants to study claim delays at one hospital. What data may it receive?

## When it goes wrong

**No authentication and no consent questionnaire.** The PMJAY payer refuses the preauthorisation with [PAYR-1256](../errors/payr-1256.md) and the claim with [PAYR-1363](../errors/payr-1363.md).

**Subscribing without consent.** A patient app must ask first and must let the patient see and switch off the subscription.

**Exemption without the signed document.** The questionnaire answer relies on a document signed by both the patient and the hospital. Keep it linked to the patient's record.

**Individual data sent to a research body.** Research access is aggregate and anonymised only.
