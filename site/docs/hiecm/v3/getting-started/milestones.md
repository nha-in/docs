---
title: Integration milestones
sidebar_label: Milestones
description: The four HIE-CM milestones, what each one certifies, and which ones your role has to build.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
sidebar_position: 6
---

# Integration milestones

[NHA](/docs/hiecm/v3/getting-started/glossary#nha) groups integration work on the
[HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) gateway into four milestones, M1 to M4, each with its
own NHA document. You certify against them one at a time, and which ones you build depends on
your role. NHA gives you the certification checklist when you apply.

## The four milestones

| Milestone | What it certifies |
| --- | --- |
| [M1](/docs/hiecm/v3/api/m1) | Identity. You can create an [ABHA](/docs/hiecm/v3/getting-started/glossary#abha), log a user in, read and manage the profile, and hold the session token every other call needs. |
| [M2](/docs/hiecm/v3/api/m2) | Linking and sharing. You can group records into care contexts, link them to an ABHA address, answer discovery, package data as [FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) and send it encrypted. |
| [M3](/docs/hiecm/v3/api/m3) | Consent and fetching. You can raise a consent request, follow it to granted or denied, then fetch and decrypt the health information. |
| [M4](/docs/hiecm/v3/api/m4) | Provider registries. You can register a professional in the [HPR](/docs/hiecm/v3/getting-started/glossary#hpr) and a facility in the [HFR](/docs/hiecm/v3/getting-started/glossary#hfr), and link your software to that facility. |

M1 is not optional for anyone. NHA marks the session and authentication APIs mandatory for
both private and government integrators.

## Role to milestone

A [PHR](/docs/hiecm/v3/getting-started/glossary#phr) application serves the patient, an
[HIP](/docs/hiecm/v3/getting-started/glossary#hip) holds records it created, an
[HIU](/docs/hiecm/v3/getting-started/glossary#hiu) reads records held elsewhere, and most hospital systems are
both HIP and HIU. See [HIP and HIU](/docs/hiecm/v3/concepts/hip-hiu).

| Your role | M1 | M2 | M3 | M4 |
| --- | --- | --- | --- | --- |
| PHR application | Required. Identity is the whole product. | Patient side only. Your user starts discovery and links care contexts to their ABHA. | Required. Your user grants, denies and revokes consent, and reads the records that arrive. | Not needed. |
| HIP | Required. You need the session token and the patient's ABHA. | Required. This is the bulk of your build. | Only if you also read records held elsewhere. Serving a data request under a consent artefact is M2 work, not M3. | Facility and professional registration. |
| HIU | Required. Same reason. | Not needed unless you also act as a HIP. | Required. This is the bulk of your build. | Facility and professional registration. |

NHA's M2 document adds a prerequisite that catches teams late: you need a valid Facility ID,
and registration in the HIP role, before you can share any record. That Facility ID comes from
M4, so plan the registry work early even though it certifies last.

## What is documented here

The M1 pages carry request URLs, headers and bodies transcribed from NHA's Postman collection,
and the [M1 reference](/reference/hiecm-m1) has the operation list to match.

NHA presents most request and response tables in the M2, M3 and M4 documents as screenshots,
which did not survive conversion to text. Those pages give steps, obligations and failure
modes, not payload shapes. The [M2](/reference/hiecm-m2),
[M3](/reference/hiecm-m3) and [M4](/reference/hiecm-m4) references are published with empty
operation lists until those shapes are transcribed.

## Where to go next

Each milestone above links to its own section, and
[Sandbox access](/docs/hiecm/v3/getting-started/sandbox) has the credentials they all need. The
exit process itself is on [Going live](./going-live).
