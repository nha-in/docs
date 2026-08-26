---
title: What you can build
sidebar_label: What you can build
description: What a PHR app, a hospital system, a lab, a pharmacy and an insurer each build on ABDM, and which milestones each one needs.
verification: unverified
source: ABDM__NewDocumant_PHR_app.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md
sidebar_position: 5
---

# What you can build

What you build on [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) depends on whether your system creates
health records, reads them, or holds them for a patient. Find your kind of system below for
its role and its milestones.

## Quick answer

| Your system | Role it takes | Milestones |
| --- | --- | --- |
| PHR app | [PHR](/docs/hiecm/v3/getting-started/glossary#phr) and [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) | M1, M3, plus the patient side of M2 |
| Hospital or clinic system | [HIP](/docs/hiecm/v3/getting-started/glossary#hip), often HIU too | M1, M2 and M4 before go live. Add M3 to read records from elsewhere |
| Lab or pharmacy | HIP | M1, M2, and M4 before go live |
| Insurer | HIU | M1, M3, and M4 before go live |

Every row starts at M1, because every call needs a session token. Every row that goes live
needs a Facility ID, because a bridge is linked to a facility with a type of `HIP` or `HIU`.
That is [M4](/docs/hiecm/v3/api/m4) work. A PHR app is the exception: it is not a facility.
[Integration milestones](/docs/hiecm/v3/getting-started/milestones) has the full table.

## A PHR app

A patient holds their [ABHA](/docs/hiecm/v3/getting-started/glossary#abha) address here and reads their own
records. [NHA](/docs/hiecm/v3/getting-started/glossary#nha)'s PHR document lists the functions such an app has
to provide:

- Create an ABHA address from a mobile number or an existing ABHA number, and link the two.
- Log in by ABHA address, ABHA number or mobile number.
- Show and edit the profile, including an ABHA QR code and a downloadable card.
- Scan and share: the user scans a facility QR code at a registration counter to share their
  profile, and the facility can return a token number.
- Subscribe to the user's ABHA address, so the app hears when a care context is linked or
  updated, and let the user approve or deny each subscription.
- Discover records at a facility the user names, then link those care contexts after an OTP
  check ([OTP](/docs/hiecm/v3/getting-started/glossary#otp)).
- Handle deep links: NHA sends an SMS when a facility creates a record for a mobile number with
  no ABHA address, and your app must start discovery from the facility code in that link.
- Show consent requests, let the user grant, deny or revoke them, and show active consents.
- Fetch and display records in chronological order.

NHA's document is explicit that every PHR application must also implement
[HIU](/docs/hiecm/v3/getting-started/glossary#hiu) functionality, which is Milestone 3. Start at
[PHR applications](/docs/hiecm/v3/concepts/phr).

## A hospital or clinic system

Your system creates records, so it takes the [HIP](/docs/hiecm/v3/getting-started/glossary#hip) role. NHA's
Milestone 2 document states the prerequisite: a valid facility id, registered with the HIP
role.

You group records into care contexts, one per outpatient visit or inpatient admission, link
them to the patient's ABHA address, and hand them over as encrypted
[FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) bundles when a valid consent arrives. Milestone 2 lists
eight health record types, and implementing all of them is mandatory for an
[HMIS](/docs/hiecm/v3/getting-started/glossary#hmis). Most hospital systems take the HIU role too, which is
Milestone 3. Start at
[Hospital, lab and pharmacy systems](/docs/hiecm/v3/concepts/hip-hiu).

## A lab or pharmacy

Both are HIPs, and the linking, discovery and transfer work is the same as a hospital's. A lab produces
one main record type, the diagnostic report, so its FHIR bundle is smaller. For a pharmacy,
Milestone 2 lists the prescription record, which follows Pharmacy Council of India guidance,
and the invoice record for billing. See [M2](/docs/hiecm/v3/api/m2).

## An insurer

An insurer reads records rather than creating them, so it is an HIU. Milestone 3 lists a
purpose code for this, `HPAYMT`, healthcare payment. You raise a consent request against the
patient's ABHA address, wait for the grant, then fetch under the consent artefact. Claims
exchange itself runs on a different gateway, [NHCX](/docs/hiecm/v3/getting-started/glossary#nhcx). See
[M3](/docs/hiecm/v3/api/m3) and [NHCX](/docs/nhcx/v1).
