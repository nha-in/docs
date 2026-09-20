# Registries

A registry is a national directory: it issues an identifier, holds the record behind it and answers lookups. Every other [ABDM](/docs/pr-18/docs/hiecm/v3/getting-started/glossary#abdm) API assumes those identifiers already exist, so a registry entry is the first thing your integration creates.

There are two, because ABDM separates the person receiving care from the people and places giving it. [ABHA](/docs/pr-18/docs/hiecm/v3/getting-started/glossary#abha) is the patient side. NHPR is the provider side, and covers two registries of its own: the [HPR](/docs/pr-18/docs/hiecm/v3/getting-started/glossary#hpr) for professionals and the [HFR](/docs/pr-18/docs/hiecm/v3/getting-started/glossary#hfr) for facilities.

| Registry                                             | Identifies                                          | Identifier                                                                                                            | Written by                             |
| ---------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| [ABHA](/docs/pr-18/docs/hiecm/v3/registries/abha)    | A patient                                           | 14 digit ABHA number issued after [KYC](/docs/pr-18/docs/hiecm/v3/getting-started/glossary#kyc), plus an ABHA address | [M1](/docs/pr-18/docs/hiecm/v3/api/m1) |
| [HPR](/docs/pr-18/docs/hiecm/v3/registries/nhpr/hpr) | A doctor, nurse, pharmacist or facility manager     | HPR ID                                                                                                                | [M4](/docs/pr-18/docs/hiecm/v3/api/m4) |
| [HFR](/docs/pr-18/docs/hiecm/v3/registries/nhpr/hfr) | A hospital, clinic, lab, imaging centre or pharmacy | Facility ID                                                                                                           | [M4](/docs/pr-18/docs/hiecm/v3/api/m4) |

## The order they arrive in

The HFR create call takes the HPR token in the `x-hprid-auth` header, generated from an HPR ID and password. Someone in your organisation needs an HPR ID with facility manager rights before you can register a facility, and a facility has to be in the HFR before it can act as a [HIP](/docs/pr-18/docs/hiecm/v3/getting-started/glossary#hip) or [HIU](/docs/pr-18/docs/hiecm/v3/getting-started/glossary#hiu) on [HIE-CM](/docs/pr-18/docs/hiecm/v3/getting-started/glossary#hie-cm).

## Next

- [ABHA](/docs/pr-18/docs/hiecm/v3/registries/abha), the patient registry
- [NHPR](/docs/pr-18/docs/hiecm/v3/registries/nhpr), the provider registries and their shared base URLs
- [HIE-CM](/docs/pr-18/docs/hiecm/v3/), the gateway that uses these identifiers
