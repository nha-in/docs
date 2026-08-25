---
title: Registries
sidebar_label: Registries
description: What an ABDM registry is, why there are two, and where ABHA, HPR and HFR sit.
verification: unverified
source: ABDM__Proposed_Simplified_Milestone_1.md, ABDM__Proposed_Simplified_Milestone_4_(NHPR).md
---

# Registries

A registry is a national directory: it issues an identifier, holds the record behind it and
answers lookups. Every other [ABDM](/docs/abdm/v3/glossary#abdm) API assumes those identifiers
already exist, so a registry entry is the first thing your integration creates.

There are two, because ABDM separates the person receiving care from the people and places
giving it. [ABHA](/docs/abdm/v3/glossary#abha) is the patient side. NHPR is the provider side, and covers two registries of
its own: the [HPR](/docs/abdm/v3/glossary#hpr) for professionals and the
[HFR](/docs/abdm/v3/glossary#hfr) for facilities.

| Registry | Identifies | Identifier | Written by |
| --- | --- | --- | --- |
| [ABHA](/docs/abdm/v3/building-blocks/registries/abha) | A patient | 14 digit ABHA number issued after [KYC](/docs/abdm/v3/glossary#kyc), plus an ABHA address | [M1](/docs/abdm/v3/api/m1) |
| [HPR](/docs/abdm/v3/building-blocks/registries/nhpr/hpr) | A doctor, nurse, pharmacist or facility manager | HPR ID | [M4](/docs/abdm/v3/api/m4) |
| [HFR](/docs/abdm/v3/building-blocks/registries/nhpr/hfr) | A hospital, clinic, lab, imaging centre or pharmacy | Facility ID | [M4](/docs/abdm/v3/api/m4) |

## The order they arrive in

NHA's M4 document says the HFR create call takes a professional token in its header, generated
from an HPR ID and password. Someone in your organisation needs an HPR ID with facility manager
rights before you can register a facility, and a facility has to be in the HFR before it can
act as a [HIP](/docs/abdm/v3/glossary#hip) or [HIU](/docs/abdm/v3/glossary#hiu) on
[HIE-CM](/docs/abdm/v3/glossary#hie-cm).

## Next

- [ABHA](/docs/abdm/v3/building-blocks/registries/abha), the patient registry
- [NHPR](/docs/abdm/v3/building-blocks/registries/nhpr), the provider registries and their shared base URLs
- [HIE-CM](/docs/abdm/v3/building-blocks/hie-cm), the gateway that uses these identifiers
