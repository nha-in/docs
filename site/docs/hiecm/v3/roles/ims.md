---
title: Information management systems
sidebar_label: Information management system
sidebar_position: 2
description: The path through HIE-CM for a hospital, lab or pharmacy system that holds health records.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_2.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
sidebar_custom_props: {roles: ['his', 'hip', 'hiu']}
---

# Information management systems

Your system creates and holds health records. A hospital system, an
[EMR](/docs/hiecm/v3/getting-started/glossary#emr), a lab
[LIMS](/docs/hiecm/v3/getting-started/glossary#lims) or a pharmacy system all sit here.
You act as a [HIP](/docs/hiecm/v3/getting-started/glossary#hip) when you publish records, and as
an [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) when you read records held elsewhere. Most
systems are both.

Pick this role in the switcher at the top of the sidebar and the API tree shows
only the modules below.

## Your path

| Order | Module | Why it is yours |
| --- | --- | --- |
| 1 | [Gateway session](/docs/hiecm/v3/api/gateway) | The access token every other call carries. Nothing works before this. |
| 2 | [M1 ABHA identity](/docs/hiecm/v3/api/m1) | Find and verify the patient in front of you. |
| 3 | [M4 HPR and HFR](/docs/hiecm/v3/api/m4) | Registers your facility and your professionals. Do this early, see the warning below. |
| 4 | [M2 Linking and sharing](/docs/hiecm/v3/api/m2) | The bulk of your build. Link care contexts, answer data requests. |
| 5 | [M3 Consent and fetching](/docs/hiecm/v3/api/m3) | Only if you also read records held elsewhere. |

**M4 certifies last but blocks M2.** Sharing a record needs a valid Facility ID
and registration in the HIP role, and that Facility ID comes from the
[HFR](/docs/hiecm/v3/registries/nhpr/hfr), which is M4. Teams that leave the
registry work until the end find M2 blocked. Plan it early.

## What you do not build

[P1, P2, P3 and the application services](/docs/hiecm/v3/roles/phr) are the patient's own
application. You never implement them, though it helps to know what your
patient sees when they grant you consent.

## Next

- [Your integration path](/docs/hiecm/v3/milestones), the role to module matrix and what certification asks.
- [HIP and HIU](/docs/hiecm/v3/concepts/hip-hiu), the two roles your system plays.
- [Get your sandbox credentials](/docs/hiecm/v3/getting-started/sandbox), credentials before any call.
