---
title: Your integration path
sidebar_label: Your integration path
description: The four milestones you certify, in order, what each one gets you, and which ones your role needs.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_3.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
sidebar_position: 5
---

# Your integration path

The four milestones are the four things you certify, in order.

| Milestone | What you get | Who needs it |
| --- | --- | --- |
| [M1](/docs/hiecm/v3/api/m1) | Identity and the session token | Everyone |
| [M2](/docs/hiecm/v3/api/m2) | Linking and sharing records | [HIP](/docs/hiecm/v3/getting-started/glossary#hip) systems, and the patient side for a [PHR](/docs/hiecm/v3/getting-started/glossary#phr) app |
| [M3](/docs/hiecm/v3/api/m3) | Consent and record fetching | [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) systems and PHR apps |
| [M4](/docs/hiecm/v3/api/m4) | A Facility ID and professional registration | Anyone going live as a facility |

## M1, identity

You create an [ABHA](/docs/hiecm/v3/getting-started/glossary#abha), log a user in, manage the
profile, and hold the session token every other call carries. Nobody skips it. See
[M1 ABHA identity](/docs/hiecm/v3/api/m1).

## M2, linking and sharing

You group records into care contexts, link them to an ABHA address, answer discovery, and send
data as encrypted [FHIR](/docs/hiecm/v3/getting-started/glossary#fhir) bundles. See
[M2 Linking and sharing](/docs/hiecm/v3/api/m2).

## M3, consent and fetching

You raise a consent request, follow it to granted or denied, then fetch and decrypt the health
information. See [M3 Consent and fetching](/docs/hiecm/v3/api/m3).

## M4, registries

You register a professional in the [HPR](/docs/hiecm/v3/getting-started/glossary#hpr) and a
facility in the [HFR](/docs/hiecm/v3/getting-started/glossary#hfr), then link your software to
that facility. See [M4 HPR and HFR](/docs/hiecm/v3/api/m4).

## Which ones your role needs

| Your role | M1 | M2 | M3 | M4 |
| --- | --- | --- | --- | --- |
| PHR application | Required | Patient side only | Required | Not needed |
| HIP | Required | The bulk of your build | Only if you also read records held elsewhere | Required |
| HIU | Required | Not needed unless you also act as a HIP | The bulk of your build | Required |

**M4 certifies last but blocks M2.** Sharing a record needs a valid Facility ID and registration
in the HIP role, and that Facility ID comes from M4. Plan the registry work early.

The M1 pages carry request URLs, headers and bodies. Most M2, M3 and M4 request and response
shapes are not transcribed yet, so those pages give steps and failure modes rather than payloads.

## Next

[Go live](./going-live).
