---
title: NHPR, the provider registries
sidebar_label: NHPR
description: The National Health Professional Registry, why professionals and facilities are registered separately, and which one you need first.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
---

# NHPR, the provider registries

NHPR is the provider half of [Registries](/docs/abdm/v3/building-blocks/registries), and NHA's Milestone 4 document uses the name for the pair underneath it: the [HPR](/docs/abdm/v3/glossary#hpr) for people and the [HFR](/docs/abdm/v3/glossary#hfr) for places. This page carries what they share and forks to each.

They are separate because a doctor holds one identity for a career across many facilities, while a facility sees many professionals pass through. Keeping them apart lets each change without rewriting the other, and lets [HIE-CM](/docs/abdm/v3/glossary#hie-cm) answer two questions: who wrote this, and where was it written.

## Which one you need, and when

| You need | When |
| --- | --- |
| An [HPID](/docs/abdm/v3/glossary#hpid) on the HPR | Before anything else in NHPR. NHA's M4 document says the HFR create call carries an HPR token in the header, generated from an HPR ID and password |
| A facility ID on the HFR | Before you go live as a [HIP](/docs/abdm/v3/glossary#hip) or an [HIU](/docs/abdm/v3/glossary#hiu). NHA's M2 document sets a valid facility ID as a prerequisite for sharing records at all |
| A bridge linked to the facility | Last. It is what makes your software resolvable as that facility on the network |

## Base URLs

Both registries share one set:

```text
Sandbox     https://apihspsbx.abdm.gov.in/v4/int/
Production  https://apinhpr.abdm.gov.in/v4/int/
```

The session token that authorises them comes from the HIE-CM gateway, not from NHPR. [M4](/docs/abdm/v3/api/m4) is the only milestone in [ABDM](/docs/abdm/v3/glossary#abdm) that writes to NHPR, and its endpoints, parameter tables and error codes are on [what NHA documents without a path](/docs/abdm/v3/api/m4/undocumented).

## Next

- [HPR](/docs/abdm/v3/building-blocks/registries/nhpr/hpr): the HPID and the registration journey.
- [HFR](/docs/abdm/v3/building-blocks/registries/nhpr/hfr): the facility record, the five call onboarding sequence, bridge linkage.
- [ABHA](/docs/abdm/v3/building-blocks/registries/abha), the patient side.
- [M4 API reference](/reference/hiecm-m4).
