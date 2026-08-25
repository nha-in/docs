---
title: HFR on UHI
sidebar_label: HFR
description: The one UHI service that carries an HFR ID, the tag it travels in, and what NHA's document leaves unfilled.
verification: unverified
source: UHI__UHI_AMRIT_Pharmacy_OnboardingDoc_v1.0.md, UHI__UHI_Physical_Consultation_v2.0_-_Onboarding_Document.md
sidebar_position: 3
---

# HFR on UHI

The [HFR](/docs/uhi/v1/getting-started/glossary#hfr) is the national register of health facilities: hospitals,
clinics, labs, imaging centres and pharmacies. On UHI it names the place behind a listing.

## Where it appears

| Field | Service | Required |
| --- | --- | --- |
| `catalog.providers[].fulfillments[].tags["@abdm/gov.in/hfr_id"]` | [AMRIT pharmacy](/docs/uhi/v1/concepts/services/amrit-pharmacy), one tag per store | Listed in the field reference |
| `catalog.providers[].fulfillments[].agent.tags` | [Physical consultation](/docs/uhi/v1/concepts/services/physical-consultation), as `/hfr_id` beside the practitioner tags | No |

AMRIT pharmacy is the only UHI service in this portal whose catalogue carries the facility
identifier as a field of its own. NHA's own document notes it as one of three things that service
adds over the others.

## What the document does not fill in

NHA prints the value as `<HFR_ID>`, a placeholder, and gives no filled example. The AMRIT page
records the same gap for the store hours and the contact block. Treat the field's format as
whatever the HFR itself issues, and confirm it against a real store entry before you rely on it.

## Where the ID comes from

Not from UHI. A facility is enrolled in the HFR through [M4](/docs/hiecm/v3/api/m4) on HIE-CM, and
the create call there needs a professional token from an [HPR](/docs/uhi/v1/registries/hpr) ID
with facility manager rights. UHI quotes the result.

## Next

- [Registries](/docs/uhi/v1/registries), for the four UHI touches and the one it owns
- [AMRIT pharmacy](/docs/uhi/v1/concepts/services/amrit-pharmacy), the catalogue this tag sits in
