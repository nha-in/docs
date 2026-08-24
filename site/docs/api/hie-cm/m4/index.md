---
title: M4 HPR and HFR
sidebar_label: Overview
sidebar_position: 0
description: What Milestone 4 covers, who needs it, and why it is Phase 2 on this site.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
---

# M4 HPR and HFR

Milestone 4 (M4) is the registries milestone of [ABDM](/docs/overview/glossary#abdm). It covers two things. A healthcare professional registers on the [HPR](/docs/overview/glossary#hpr) and is issued an [HPID](/docs/overview/glossary#hpid). A health facility onboards to the [HFR](/docs/overview/glossary#hfr) and is issued a facility ID. NHA's document also calls M4 the NHPR. Neither of these moves a health record. They establish who the professional is and what the facility is, so that record flows have a verified provider behind them.

:::caution[Phase 2 on this site]
M4 is Phase 2 for this portal. [M1](/docs/api/hie-cm/m1), [M2](/docs/api/hie-cm/m2) and [M3](/docs/api/hie-cm/m3) are Phase 1 and are documented in more depth. This page and its two siblings cover the shape of M4 and the endpoints NHA's document names. They are not yet a step by step build guide.
:::

:::note[Documented, not verified]
This page follows NHA's published document for Proposed Simplified Milestone 4 (NHPR). Nothing here has been
run against the ABDM sandbox from this repository, so treat request and
response shapes as unconfirmed.
:::

## What M4 covers

| Area | What it produces | Who it is for |
|---|---|---|
| HPID creation | A 14 digit HPID, issued after Aadhaar authentication | A doctor, nurse, pharmacist or facility manager |
| Register professional | A full HPR profile: qualifications, council registration, current work | The same professional, after the HPID exists |
| Facility onboarding | A facility ID on the HFR, in the form `IN` plus 10 characters | A hospital, clinic, lab, imaging centre, pharmacy or blood bank |
| Bridge linkage | A link between a facility ID and one or more bridges, each marked [HIP](/docs/overview/glossary#hip) or [HIU](/docs/overview/glossary#hiu) | A facility whose software is going live on ABDM |
| Search and master data | Facility search, nearby search, and the code lists every other call needs | Anyone building either of the above |

## Who needs it

**Facilities going live.** You cannot share records as a HIP or fetch them as an HIU without a facility that exists in the HFR and a bridge linked to it. If you have built M2 or M3 and you are moving from sandbox towards production, M4 is the onboarding step in front of you.

**Professionals registering.** A doctor, nurse or pharmacist needs an HPID to have a verified identity in ABDM. Currently NHA's document names three categories: doctor, nurse and pharmacist. It says other categories will be added later.

**Software that registers people or facilities on someone's behalf.** A [HMIS](/docs/overview/glossary#hmis) or a practice management product can drive these calls for its own customers, rather than sending each one to NHA's web portal.

## How the two halves connect

The HPR comes first, in two ways.

1. Creating an HPID gives you an `hprToken`. The register professional call carries that token in its payload.
2. Onboarding a facility to the HFR uses an HPR token in the header of the create calls. NHA's document says to generate that token from an HPR ID and password, so a registered person's login is what authorises the facility record.

So a facility onboarding usually starts with a person getting an HPID, not with the facility itself.

## Environments

NHA's M4 document names two base URLs for the HPR and HFR calls, and a separate host for the session token.

| Purpose | Environment | Base URL |
|---|---|---|
| HPR and HFR calls | Sandbox | `https://apihspsbx.abdm.gov.in/v4/int/` |
| HPR and HFR calls | Production | `https://apinhpr.abdm.gov.in/v4/int/` |
| Session token | Not labelled | `https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions` |
| Session token | Not labelled | `https://live.abdm.gov.in/api/hiecm/gateway/v3/sessions` |

The HPR and HFR base URLs are labelled sandbox and production in NHA's document. The two session hosts are not. The document gives `dev.abdm.gov.in` in three places and `live.abdm.gov.in` in two, with the same request body each time and no note saying which environment is which. Elsewhere on this site, sandbox session calls go to `dev.abdm.gov.in`.

The document is loose about hosts in other places too. Several samples in the HPR login section show the `apinhpr` production host while describing sandbox behaviour. Expect to correct a host or two when you first run these calls.

## Read M4 in this order

1. [User journey](/docs/api/hie-cm/m4/user-journey). The registration journeys as diagrams, so you can see the order of calls before the field lists.
2. [APIs](/docs/api/hie-cm/m4/apis). Every endpoint NHA's document names, the request detail that survived conversion, and an honest list of what did not.

The interactive reference is at [M4 API reference](/reference/hiecm-m4).

## What this page does not cover

M4 registers people and facilities. It does not link care contexts, request consent or move records. Those are [M2](/docs/api/hie-cm/m2) and [M3](/docs/api/hie-cm/m3).
