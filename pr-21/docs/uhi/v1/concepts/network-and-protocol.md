# UHI gateway

[UHI](/docs/pr-21/docs/uhi/v1/getting-started/glossary#uhi) is the Unified Health Interface, one of [ABDM](/docs/pr-21/docs/uhi/v1/getting-started/glossary#abdm)'s three gateways. After this page you will know the two roles, the two transports and the signing scheme that every UHI service shares.

[HIE-CM](/docs/pr-21/docs/uhi/v1/getting-started/glossary#hie-cm) moves records that already exist. UHI helps a patient find and book a service before any record exists: a consultation, an ambulance, a unit of blood, a medicine at a pharmacy. Any consumer app on the network can discover any provider on it.

## Prerequisite

Your application must have completed ABDM [M2](/docs/pr-21/docs/hiecm/v3/api/m2) with HIE-CM before it can be onboarded to any UHI service. This is a hard requirement. UHI sits on top of HIE-CM, it is not an alternative to it.

## Two roles

| Role                                                          | Full name                           | What it is                                                                                                               |
| ------------------------------------------------------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| [EUA](/docs/pr-21/docs/uhi/v1/getting-started/glossary#eua)   | End User Application                | The patient facing app or website. Searches, shows results, books, displays status.                                      |
| [HSPA](/docs/pr-21/docs/uhi/v1/getting-started/glossary#hspa) | Health Service Provider Application | The provider platform. Holds doctor profiles and slot availability, confirms bookings, drives the appointment lifecycle. |

The HSP is the hospital, clinic or doctor, and the HSPA is its digital interface. The Gateway is the routing layer, and [NHA](/docs/pr-21/docs/uhi/v1/getting-started/glossary#nha) is the network operator that governs onboarding and the protocol.

## Two transports in one flow

This is the critical architectural point.

- **Discovery goes through the gateway.** Your EUA sends one `/search`, and the gateway broadcasts it to every registered HSPA. Responses come back to your callback URL as `/on_search`.
- **Everything after discovery is direct.** Booking, fulfilment and post fulfilment are point to point between the EUA and the one HSPA the patient chose. There is no central UHI API for those stages, so both sides expose their own endpoints.

The provider URI for those direct calls comes from the context of the `on_search` response. You do not know it before discovery.

## Signing

Every UHI call is signed with Ed25519 over a BLAKE-512 hash of the request body, carried in an `Authorization` header. Inbound gateway calls carry the same structure in an `X-Gateway-Authorization` header, with the key ID prefixed `gateway-nha`.

A header generator utility is published at [github.com/NHA-ABDM/UHI](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility). Generate your Ed25519 key pair with it and send NHA the public key only.

## Sandbox environment

```text
Gateway base URI   https://uhigatewaysandbox.abdm.gov.inReference EUA      http://uhieuasandbox.abdm.gov.in/api/v1/euaServiceReference HSPA     https://hspasbx.abdm.gov.in/api/v1/hspa
```

## Service identity

A service is identified by fixed values in the call itself, not by a different endpoint. For physical consultation:

| Field                                 | Value           |
| ------------------------------------- | --------------- |
| `context.domain`                      | `nic2004:85111` |
| `context.core_version`                | `0.7.1`         |
| `message.intent.fulfillment.type`     | `Physical`      |
| `message.intent.item.descriptor.code` | `Consultation`  |
| `message.intent.item.descriptor.name` | `Consultation`  |

Other services use different values. Check the page for the service you are building.

## Services

- [Physical consultation](/docs/pr-21/docs/uhi/v1/concepts/services/physical-consultation)
- [Ambulance booking](/docs/pr-21/docs/uhi/v1/concepts/services/ambulance-booking)
- [Blood bank](/docs/pr-21/docs/uhi/v1/concepts/services/blood-bank)
- [Jan Aushadhi Kendra](/docs/pr-21/docs/uhi/v1/concepts/services/jan-aushadhi-kendra)
- [Jan Aushadhi medicine search](/docs/pr-21/docs/uhi/v1/concepts/services/jan-aushadhi-medicine-search)
- [AMRIT pharmacy](/docs/pr-21/docs/uhi/v1/concepts/services/amrit-pharmacy)
- [PMJAY HEM](/docs/pr-21/docs/uhi/v1/concepts/services/pmjay-hem)

The index for all of them is [UHI in API references](/docs/pr-21/docs/uhi/v1).

## What is missing here

Per stage request and response bodies sit on the [physical consultation](/docs/pr-21/docs/uhi/v1/concepts/services/physical-consultation) page. The other six services have their own documents and are not covered here.

## Next

- [HIE-CM](/docs/pr-21/docs/hiecm/v3/)
- [Milestones, by role](/docs/pr-21/docs/hiecm/v3/milestones)
- [UHI API references](/docs/pr-21/docs/uhi/v1)
