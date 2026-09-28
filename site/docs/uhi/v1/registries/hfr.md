---
title: HFR on UHI
sidebar_label: HFR
description: The one place a UHI message carries an HFR ID, as an optional tag beside the doctor in a Physical Consultation catalog.
source: UHI Physical Consultation v2.0 onboarding document; UHI Gateway spec v2.0.2 examples
sidebar_position: 3
sidebar_class_name: sidebar-icon sidebar-icon--building
---

# HFR on UHI

The [HFR](/docs/uhi/v1/getting-started/glossary#hfr) is the national register of health facilities. On [UHI](/docs/uhi/v1/getting-started/glossary#uhi) it names the facility where a doctor practises.

## Where it appears

| Field | Service | Required |
| --- | --- | --- |
| `message.catalog.providers[].fulfillments[].agent.tags["@abdm/gov.in/hfr_id"]` | [Physical Consultation](/docs/uhi/v1/services/consultation), beside the doctor's [HPR](/docs/uhi/v1/registries/hpr) tags | No |

## Next steps

- [HPR on UHI](/docs/uhi/v1/registries/hpr), the doctor this tag sits beside
- [Registries](/docs/uhi/v1/registries), every identifier UHI carries
