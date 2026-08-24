---
title: What you can build
sidebar_label: What you can do
sidebar_position: 3
description: What a PHR app, a hospital system, a lab, a pharmacy and an insurer each build on ABDM, and which milestones each one needs.
verification: unverified
source: ABDM__NewDocumant_PHR_app.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md
---

# What you can build

What you build on [ABDM](/docs/overview/glossary#abdm) depends on whether your system creates
health records, reads them, or holds them for a patient. Find your kind of system below. Each
one lists the milestones it needs and the pages that cover them.

:::note[Documented, not verified]
This page follows NHA's published documents for PHR applications and for HIE-CM Milestones 2
and 3. Nothing here has been run against the ABDM sandbox from this repository, so treat
request and response shapes as unconfirmed.
:::

## Quick answer

| Your system | Role it takes | Milestones |
| --- | --- | --- |
| PHR app | [PHR](/docs/overview/glossary#phr) and [HIU](/docs/overview/glossary#hiu) | M1, M3 |
| Hospital or clinic system | [HIP](/docs/overview/glossary#hip), often HIU too | M1, M2, M3 |
| Lab | HIP | M1, M2 |
| Pharmacy | HIP | M1, M2 |
| Insurer | HIU | M3 |

## A PHR app

A personal health record app is where a patient holds their
[ABHA](/docs/overview/glossary#abha) address and reads their own records. The
[NHA](/docs/overview/glossary#nha) document for PHR applications lists the functions such an
app has to provide:

- Create an ABHA address, using a mobile number or an existing ABHA number, and link the two.
- Log in by ABHA address, ABHA number or mobile number.
- Show and edit the user's profile, including an ABHA QR code and a downloadable card.
- Scan and share: the user scans a facility QR code to share their profile at a registration
  counter, and the facility can return a token number.
- Subscribe to the user's ABHA address so the app is notified when a care context is linked or
  updated, and let the user approve or deny each subscription.
- Discover records at a facility the user names, then link those care contexts after an OTP
  check ([OTP](/docs/overview/glossary#otp)).
- Handle deep links: NHA sends an SMS when a facility creates a record for a mobile number with
  no ABHA address, and your app must start discovery from the facility code in that link.
- Show consent requests, let the user grant, deny or revoke them, and show active consents.
- Fetch and display records in chronological order.

NHA's document is explicit that every PHR application must also implement
[HIU](/docs/overview/glossary#hiu) functionality, which is Milestone 3.

Start at [PHR applications](/docs/overview/roles/phr).

## A hospital or clinic system

Your system creates records, so it takes the [HIP](/docs/overview/glossary#hip) role. NHA's
Milestone 2 document states the prerequisite: a valid facility id, registered with the HIP role.

You group records into care contexts, one per outpatient visit or inpatient admission, link
them to the patient's ABHA address, and hand them over as encrypted
[FHIR](/docs/overview/glossary#fhir) bundles when a valid consent arrives. Milestone 2 lists
eight health record types, and notes that implementing all of them is mandatory for an
[HMIS](/docs/overview/glossary#hmis).

Most hospital systems take the HIU role as well, because a doctor wants to read history from
elsewhere. That is Milestone 3.

Start at [Hospital, lab and pharmacy systems](/docs/overview/roles/his).

## A lab

A lab is an HIP that produces one main record type, the diagnostic report. The linking,
discovery and data transfer work is the same as a hospital's. The FHIR bundle you build is
smaller.

See [M2](/docs/api/hie-cm/m2).

## A pharmacy

A pharmacy is an HIP too. Milestone 2 lists the prescription record, which follows Pharmacy
Council of India guidance, and the invoice record for billing.

See [M2](/docs/api/hie-cm/m2).

## An insurer

An insurer reads records rather than creating them, so it is an HIU. Milestone 3 lists a
purpose code for this, `HPAYMT`, healthcare payment. You raise a consent request against the
patient's ABHA address, wait for the patient to grant it, then fetch under the consent artefact.

Claims exchange itself runs on a different gateway,
[NHCX](/docs/overview/glossary#nhcx), which is out of scope for version 1 of this portal.

See [M3](/docs/api/hie-cm/m3) and [NHCX](/docs/api/nhcx).
