---
title: PHR applications
sidebar_label: PHR application
sidebar_position: 2
description: The path through HIE-CM for a patient facing personal health record application.
verification: unverified
source: aarogya-setu.postman_collection.json, ABDM__NewDocumant_PHR_app.md
sidebar_custom_props: {roles: ['phr']}
---

# PHR applications

Your application belongs to the patient. They create an
[ABHA](/docs/hiecm/v3/getting-started/glossary#abha), find records held about them across the
network, decide who may see what, and read what arrives. NHA's own reference
application is the model for the P modules below.

Pick this role in the switcher at the top of the sidebar and the API tree shows
only the modules below.

## Your path

| Order | Module | Why it is yours |
| --- | --- | --- |
| 1 | [Gateway session](/docs/hiecm/v3/api/gateway) | The access token every other call carries. |
| 2 | [M1 ABHA identity](/docs/hiecm/v3/api/m1) | Creating and logging into an ABHA. Identity is the whole product. |
| 3 | [P1 PHR identity and profile](/docs/hiecm/v3/api/p1) | Registration, login, the profile they see, family members, DigiLocker documents. |
| 4 | [P2 PHR linking and records](/docs/hiecm/v3/api/p2) | Finding records and attaching them: care context linking, user initiated linking, scan and share, health lockers. |
| 5 | [M3 Consent and fetching](/docs/hiecm/v3/api/m3) | The consent request and data fetch machinery underneath. |
| 6 | [P3 PHR consent and notifications](/docs/hiecm/v3/api/p3) | What the patient sees and controls: requests received, artefacts granted, revocation, notifications. |
| 7 | [PHR application services](/docs/hiecm/v3/api/phr-services) | Optional. Teleconsultation, facility and ambulance search, blood banks, scan and pay. |

## What you do not build

[M2](/docs/hiecm/v3/api/m2) is the provider side, answering requests for records a facility
holds. [M4](/docs/hiecm/v3/api/m4) registers facilities and professionals. Neither is yours,
though M2 is what responds when your user links a care context.

## Where these came from

The four P specifications are transcribed from NHA's reference PHR application
collection, not from a published specification document. Nothing in them has
been run against the sandbox. Treat request and response shapes as unconfirmed
until a page says otherwise.

## Next

- [PHR applications](/docs/hiecm/v3/concepts/phr), what the role means in ABDM.
- [Consent](/docs/hiecm/v3/concepts/consent), the artefact your user grants and revokes.
- [Sandbox access](/docs/hiecm/v3/getting-started/sandbox), credentials before any call.
