---
title: Registries
sidebar_label: Registries
description: The network registry UHI runs itself, and the three ABDM identifiers that travel inside UHI messages, with the field each one fills.
source: UHI developer guide as of 22 September 2026, sections 1.1 and 1.2; UHI Gateway spec v2.0.2; Physical Consultation and Ambulance Booking onboarding documents
---

# Registries

[UHI](/docs/uhi/v1/getting-started/glossary#uhi) reads one registry of its own and carries identifiers from three ABDM registries. This page shows which identifier goes in which field.

| Registry | Identifies | Where it appears in UHI |
| --- | --- | --- |
| [Network registry](/docs/uhi/v1/concepts/registry-lookup) | A participant on the UHI network: an [EUA](/docs/uhi/v1/getting-started/glossary#eua), an [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) or the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) | `POST /api/v1/networkregistry/lookup`, which returns a participant's public key and details |
| [ABHA](/docs/uhi/v1/registries/abha) | The patient | `order.customer.id`, and the sender in a chat message |
| [HPR](/docs/uhi/v1/registries/hpr) | The doctor | `fulfillment.agent.id`, an `hpr_id` tag, and the receiver in a chat message |
| [HFR](/docs/uhi/v1/registries/hfr) | The facility | An optional `hfr_id` tag beside the doctor |

## The network registry is UHI's own

The network registry holds the public key each participant registered at onboarding. Look a participant up before you check the signature on a direct call it sent you. See [Network registry lookup](/docs/uhi/v1/concepts/registry-lookup).

The sandbox registration form asks for your role, your callback URL and your public key. See [Onboarding](/docs/uhi/v1/getting-started/onboarding).

## Next steps

- [ABHA on UHI](/docs/uhi/v1/registries/abha), the patient in a booking
- [HPR on UHI](/docs/uhi/v1/registries/hpr), the doctor in a booking
- [Network registry lookup](/docs/uhi/v1/concepts/registry-lookup), the call every direct exchange needs
