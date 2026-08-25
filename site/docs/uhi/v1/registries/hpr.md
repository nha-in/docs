---
title: HPR on UHI
sidebar_label: HPR
description: Where a practitioner's HPR ID appears in a UHI catalogue and a UHI order, and the two forms NHA's document prints it in.
verification: unverified
source: UHI__UHI_Physical_Consultation_v2.0_-_Onboarding_Document.md
sidebar_position: 2
---

# HPR on UHI

The [HPR](/docs/uhi/v1/getting-started/glossary#hpr) is the national register of health professionals. On UHI it
names the person a patient is booking: the doctor in a consultation.

## Where it appears

| Field | Stage | Required |
| --- | --- | --- |
| `catalog.providers[].fulfillments[].agent.id` | The catalogue an [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) returns on search | Yes |
| `catalog.providers[].fulfillments[].agent.tags` | The same catalogue entry | No |
| `order.fulfillment.agent.id` | The order, from select onward | Yes |
| `chat.sender.person.id` and `chat.receiver.person.id` | Chat, when the doctor is one end of it | Yes |

## Two forms of the same identifier

NHA's physical consultation document prints the practitioner two ways in the same sample.
`agent.id` carries the readable address, `priyamehra@hpr.ndhm`. The tag block beside it carries
the numeric ID, `@abdm/gov.in/hpr_id`, as `73-5232-1888-8686`.

Send the address in `agent.id`. The tag is optional, and it sits with the other practitioner tags
NHA lists for the same block: `@abdm/gov.in/experience`, `/languages`, `/education`, `/hpr_id`,
`/hfr_id` and `/hip_id`.

## Where the ID comes from

Not from UHI. A professional is registered in the HPR through [M4](/docs/hiecm/v3/api/m4) on
HIE-CM, and UHI quotes what M4 wrote. If your HSPA lists a doctor who has no HPR ID, the
catalogue entry has no valid `agent.id` to carry, and there is no UHI call that will mint one.

## Next

- [HFR on UHI](/docs/uhi/v1/registries/hfr), the facility the practitioner works in
- [M4 HPR and HFR](/docs/hiecm/v3/api/m4), where both are written
