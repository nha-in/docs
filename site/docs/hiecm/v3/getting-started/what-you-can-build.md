---
title: What are you building?
sidebar_label: What are you building?
description: Find your kind of system, the role it takes on ABDM, and what you build first.
verification: unverified
source: ABDM__NewDocumant_PHR_app.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md
sidebar_position: 1
covers: [hiecm.concept.roles]
---

# What are you building?

Find your system in this table. It names the role you take on
[ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) and what you build.

| Your system | You act as | You build |
| --- | --- | --- |
| Hospital or clinic system | a [HIP](/docs/hiecm/v3/getting-started/glossary#hip) (Health Information Provider), the system that holds the records it created | Linking and sharing records |
| Lab or pharmacy | a HIP as well, with fewer record types | Linking and sharing reports or prescriptions |
| Insurer | an [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) (Health Information User), a system that reads records held elsewhere | Consent requests and record fetching |
| Patient app | a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) (Personal Health Record) app, and an HIU too | Identity, consent and reading records |

Every system starts at identity, because every call carries a session token.

## Hospital or clinic system

You act as a HIP, the system that holds the records it created.

- Group records into care contexts, one per outpatient visit or inpatient admission.
- Link those care contexts to the patient's [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) address.
- Answer discovery when another system looks for a patient's records.
- Send records as encrypted [FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) bundles once a valid consent arrives.
- Register your facility, because sharing needs a Facility ID and the HIP role.

Start with: [Hospital, lab and pharmacy systems](/docs/hiecm/v3/concepts/hip-hiu).

## Lab or pharmacy

You act as a HIP too. The linking, discovery and transfer work matches a hospital system.

- A lab produces one main record type, the diagnostic report, so its FHIR bundle is smaller.
- A pharmacy sends the prescription record, which follows Pharmacy Council of India guidance.
- A pharmacy also sends the invoice record for billing.

Start with: [M2 Linking and sharing](/docs/hiecm/v3/api/m2).

## Insurer

You act as an HIU. You read records rather than create them.

- Raise a consent request against the patient's ABHA address.
- Wait for the patient to grant it.
- Fetch and decrypt the records covered by the consent artefact.
- Send the purpose code `HPAYMT`, healthcare payment.

Claims exchange runs on a different gateway,
[NHCX](/docs/hiecm/v3/getting-started/glossary#nhcx).

Start with: [M3 Consent and fetching](/docs/hiecm/v3/api/m3).

## Patient app

You act as a PHR app, and every PHR app carries HIU functionality too.

- Create an ABHA address from a mobile number or an existing ABHA number, and log the patient in.
- Discover records at a facility the patient names, then link them after a one-time password check ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)).
- Show consent requests, and let the patient grant, deny or revoke them.
- Fetch and show records in chronological order.
- Handle the deep link sent by SMS when a facility creates a record for a mobile number with no ABHA address.

Start with: [PHR applications](/docs/hiecm/v3/concepts/phr).

## Next

[Get your sandbox credentials](/docs/hiecm/v3/getting-started/sandbox).
