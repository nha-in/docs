---
id: nhcx.concept.hmis-integration-architecture
type: concept
gateway: nhcx
milestone: n/a
version: nhcx-v1
title: Hospital HMIS integration for PMJAY through NHCX
summary: >-
  A hospital on the government health assurance scheme can move claims out of the
  scheme's provider portal and into its own hospital system, after a six step migration
  that ends in a manual mapping.
sources:
- url: https://hcxsbx.abdm.gov.in/images/be2e25fede3bf711f783.docx
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/PMJAY Hospital Migration to HMIS via NHCX.docx
  hash: sha256:cf5c9bf1c402b214f65bbb7bd0822f3a76d8ccda9b69c7bf77ba131befef3bc6
  fetched: '2026-09-14'
  note: PMJAY Hospital Migration to HMIS via NHCX, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments, not named in the NHCX document sheet. Sections 2 to 3.6.
- url: https://hcxsbx.abdm.gov.in/images/b6bd99dab49a5e928ea3.pdf
  file: catalogue/openapi/.raw/nhcx-site-2026-09-14/hmisdocuments/NHCX-PMJAY-HMIS Integration Overview.pdf
  hash: sha256:c95469758a25cb8aca8c47757d8b18b4dedb8b4d42669663cff7343205f77fda
  fetched: '2026-09-14'
  note: NHCX-PMJAY-HMIS Integration Overview, row 27 of the NHCX document sheet, listed on https://hcxsbx.abdm.gov.in/#/hmisdocuments. Pages 2-8.
related:
  flows:
  - nhcx.flow.pmjay-hospital-migration
  - nhcx.flow.production-onboarding
  - nhcx.flow.pmjay-patient-to-cashless
  concepts:
  - nhcx.concept.pmjay-on-nhcx
  - nhcx.concept.participant-registry
  - nhcx.concept.insurance-plan
  - nhcx.concept.biometric-authentication
  - nhcx.concept.encryption-certificate
  endpoints:
  - nhcx.endpoint.v2-participant-create
  - nhcx.endpoint.validate
  - nhcx.endpoint.participant-update
  - nhcx.endpoint.update-validate
  glossary:
  - shared.glossary.hmis
  - nhcx.glossary.tms
  - nhcx.glossary.pmjay
  - shared.glossary.dsc
  - shared.glossary.hfr
---

# Hospital HMIS integration for PMJAY through NHCX

## In plain words

Today a PMJAY hospital records a patient in its own [HMIS](../../shared/glossary/hmis.md), then types the same details again into the scheme's [TMS](../glossary/tms.md) provider portal. Two systems, two rounds of data entry.

With NHCX, the HMIS sends preauthorisations and claims itself, system to system, to the payer's TMS. The portal drops out of the hospital's workflow.

## Before you start

The hospital needs an [HFR](../../shared/glossary/hfr.md) facility ID with a registered mobile number, its PMJAY hospital ID, and an ABDM Milestone 1 compliant HMIS.

## What happens

### Before and after

```mermaid
graph LR
  subgraph "Today"
    H1["HMIS"] -->|re-keyed by staff| TP["TMS 2.0 provider portal"]
    TP --> TY1["TMS 2.0 payer system"]
  end
  subgraph "Through NHCX"
    H2["NHCX-integrated HMIS"] -->|sealed FHIR messages| X["NHCX"]
    X --> TY2["TMS 2.0 payer system"]
  end
```

### What the HMIS must hold

| Capability | Why |
|---|---|
| Session tokens and a certificate pair | To call NHCX and to seal and open messages |
| A public HTTPS endpoint | NHCX delivers payer responses there |
| An insurance plan store | Packages, rates, forms and required documents per policy |
| Biometric capture | Patient presence at registration, preauthorisation and discharge |
| A FHIR bundle builder and validator | Structured claims and clinical records |

### The migration, in six steps

1. **Create the participant** with registry type `10001` (HFR), role `10001` (provider), the HFR ID and the HFR-registered mobile number.
2. **Confirm it** with the transaction ID and the passcode sent to that mobile.
3. **Update it** with the HMIS endpoint URL and the Base64 encoded certificate.
4. **Confirm the update** with a second passcode, valid for 24 hours.
5. **Map it.** The hospital raises a ticket with the NHA NHCX operations team, giving the PMJAY hospital ID and the new participant ID. This step is manual.
6. **Go live.** The mapping is the switch.

### Dual processing

Cases submitted before the mapping finish in the TMS provider portal. Cases started after it go only through the HMIS. TMS stops accepting new preauthorisations from that hospital.

## How you know it worked

You have understood this when you can answer both of these.

1. A patient's preauthorisation was raised in the TMS portal the day before your mapping. Where does its claim go?
2. Steps 1 to 4 are complete but claims still show only in TMS. Which step is missing, and who performs it?

## When it goes wrong

**Mobile number mismatch.** Participant creation fails unless the mobile matches the HFR record exactly. Update HFR first.

**Wrong registry type or role.** A PMJAY hospital must use HFR (`10001`) and provider (`10001`). Anything else is rejected.

**Mapping not raised or not complete.** Until the NHA operations team maps the hospital ID to the participant ID, new cases do not route through the HMIS.

**Endpoint not reachable.** The mapping needs a live HTTPS endpoint that NHCX can reach.
