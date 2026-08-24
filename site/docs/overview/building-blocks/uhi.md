---
title: UHI gateway
sidebar_label: UHI gateway
sidebar_position: 4
description: The open network for discovering and booking health services, its two roles, and why it is Phase 2 here.
verification: unverified
source: UHI__UHI_Physical_Consultation_v2.0_-_Onboarding_Document.md
---

# UHI gateway

[UHI](/docs/overview/glossary#uhi) is the Unified Health Interface, one of [ABDM](/docs/overview/glossary#abdm)'s three gateways. It is a separate network from [HIE-CM](/docs/overview/glossary#hie-cm), and it does a different job. HIE-CM moves records that already exist. UHI helps a patient find and book a service before any record exists: a consultation, an ambulance, a unit of blood, a medicine at a pharmacy. Any consumer app on the network can discover any provider on the network, whichever platform each side is built on.

:::note[Documented, not verified]
This page follows [NHA](/docs/overview/glossary#nha)'s published document for the UHI physical consultation
service, version 2.0. Nothing here has been run against the ABDM sandbox from
this repository, so treat request and response shapes as unconfirmed.
:::

:::note[Phase 2]
UHI is Phase 2 for this portal. The service pages listed below exist, but the
depth of documentation behind them is lower than for HIE-CM M1 to M3, which
are Phase 1.
:::

## Two roles

Everything on UHI is built as one of two roles. Pick yours before you read anything else.

| Role | Full name | What it is |
| --- | --- | --- |
| [EUA](/docs/overview/glossary#eua) | End User Application | The patient facing app or website. It searches, shows results, books, and displays status. |
| [HSPA](/docs/overview/glossary#hspa) | Health Service Provider Application | The provider side platform. It holds doctor profiles and slot availability, confirms bookings, and drives the appointment through its lifecycle. |

Two more names appear in NHA's document. The HSP is the actual hospital, clinic or doctor, and the HSPA is its digital interface. The Gateway is the NHA run routing layer, and [NHA](/docs/overview/glossary#nha) itself is the network operator that governs onboarding and the protocol.

## The part that surprises people

UHI uses two communication models in one flow, and NHA's document flags this as the critical architectural point.

- **Discovery goes through the gateway.** Your EUA sends one `/search`, and the gateway broadcasts it to every registered HSPA. Responses come back to your callback URL as `/on_search`.
- **Everything after discovery is direct.** Booking, fulfilment and post fulfilment are point to point between the EUA and the one HSPA the patient chose. There is no central UHI API for those stages. Both sides have to expose their own endpoints for the other to call.

The provider URI you use for those direct calls comes from the context of the `on_search` response. You do not know it before discovery.

## Signing

Every UHI call is signed. NHA's document specifies Ed25519 signatures over a BLAKE-512 hash of the request body, carried in an `Authorization` header. Inbound gateway calls carry the same structure in an `X-Gateway-Authorization` header, with the key ID prefixed `gateway-nha`.

NHA publishes a header generator utility for this at [github.com/NHA-ABDM/UHI](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility). You generate an Ed25519 key pair with it and send only the public key to NHA during onboarding.

## Prerequisite

NHA states this as a hard requirement: an application must have completed ABDM [M2](/docs/api/hie-cm/m2) with HIE-CM before it can be onboarded to any UHI service, including physical consultation. If M2 is not done, UHI onboarding does not start.

That is worth knowing early. It means UHI is not an alternative to HIE-CM. It sits on top of it.

## Sandbox environment

From NHA's physical consultation document:

```text
Gateway base URI   https://uhigatewaysandbox.abdm.gov.in
Reference EUA      http://uhieuasandbox.abdm.gov.in/api/v1/euaService
Reference HSPA     https://hspasbx.abdm.gov.in/api/v1/hspa
```

## Service identity

UHI carries many services on one network, and the service is identified by fixed values in the call itself rather than by a different endpoint. For physical consultation, NHA's document gives these:

| Field | Value |
| --- | --- |
| `context.domain` | `nic2004:85111` |
| `context.core_version` | `0.7.1` |
| `message.intent.fulfillment.type` | `Physical` |
| `message.intent.item.descriptor.code` | `Consultation` |
| `message.intent.item.descriptor.name` | `Consultation` |

Other services use different values. Check the page for the service you are building.

## Services

Each service has its own onboarding document and its own protocol details.

- [Physical consultation](/docs/api/uhi/physical-consultation)
- [Ambulance booking](/docs/api/uhi/ambulance-booking)
- [Blood bank](/docs/api/uhi/blood-bank)
- [Jan Aushadhi Kendra](/docs/api/uhi/jan-aushadhi-kendra)
- [Jan Aushadhi medicine search](/docs/api/uhi/jan-aushadhi-medicine-search)
- [AMRIT pharmacy](/docs/api/uhi/amrit-pharmacy)
- [PMJAY HEM](/docs/api/uhi/pmjay-hem)

The index for all of them is [UHI in API references](/docs/api/uhi).

## What is missing here

Our source for this page is NHA's physical consultation onboarding document, version 2.0. It describes the network, the roles, the two communication models and the signing scheme, which is why those sections are here. It also carries the per stage request and response bodies, which belong on the [physical consultation](/docs/api/uhi/physical-consultation) page rather than here. The other six services have their own onboarding documents and are not covered by this page at all. We have not run any UHI call against the sandbox from this repository.

## Next

- [HIE-CM gateway](/docs/overview/building-blocks/hie-cm)
- [What you can build, by role](/docs/overview/what-you-can-do)
- [UHI API references](/docs/api/uhi)
