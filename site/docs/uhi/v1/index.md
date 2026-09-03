---
title: Introduction
sidebar_label: Introduction
description: What UHI is, the two roles you can build, and how far each service goes today.
verification: unverified
source: UHI__UHI_Physical_Consultation_v2.0_-_Onboarding_Document.md, UHI__UHI_AmbulanceBooking_Onboarding_v1.1-July2026.md, UHI__UHI_BloodBank_Onboarding_v1.0.md
sidebar_position: 1
---

# Introduction

The Ayushman Bharat Digital Mission ([ABDM](/docs/uhi/v1/getting-started/glossary#abdm)) is India's national
health data network, run by the National Health Authority ([NHA](/docs/uhi/v1/getting-started/glossary#nha)).
It is three gateways, not one, and this section documents the second of them.

[UHI](/docs/uhi/v1/getting-started/glossary#uhi) is the Unified Health Interface, [ABDM](/docs/uhi/v1/getting-started/glossary#abdm)'s open network for finding and booking a health service. After this page you will know which role to build, how far each service goes, and where the protocol is written down.

[HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) moves records that already exist. UHI finds a doctor, an ambulance or a unit of blood before any record exists.

## The gate before anything else

Your application must have completed ABDM [M2](/docs/hiecm/v3/api/m2) with HIE-CM before it can be onboarded to any UHI service. This applies to every service on the network. UHI sits on top of HIE-CM, it is not an alternative to it.

## Two roles

| Role | Full name | What it does |
| --- | --- | --- |
| [EUA](/docs/uhi/v1/getting-started/glossary#eua) | End User Application | The patient facing app. Searches, shows results, books, displays status. |
| [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) | Health Service Provider Application | The provider platform. Holds availability, answers searches, drives the booking lifecycle. |

The HSP is the hospital, clinic, doctor, ambulance operator or blood bank, and the HSPA is its digital interface. The [gateway](/docs/uhi/v1/getting-started/glossary#gateway) is the network's routing layer. Each service page says which roles it accepts.

## Services

A service is identified by fixed values inside the call, not by a different endpoint. All three documents behind this page use `core_version` `0.7.1`.

| Service | Domain code | Discovery | Order and quote | Booking and lifecycle |
| --- | --- | --- | --- | --- |
| [Physical consultation](/docs/uhi/v1/concepts/services/physical-consultation) | `nic2004:85111` | `search`, `on_search` | `init`, `on_init` | `confirm`, `on_confirm`, `status`, `on_status`, `on_update`, `cancel`, `on_cancel`, `on_message` |
| [Ambulance booking](/docs/uhi/v1/concepts/services/ambulance-booking) | `nic2008:86909` | `search`, `on_search` | `init`, `on_init` | Not open for onboarding yet |
| [Blood bank](/docs/uhi/v1/concepts/services/blood-bank) | `nic2008:86906` | `search`, `on_search` | Not in this service | Not in this service |

Four more services have their own onboarding documents and their own pages:
[Jan Aushadhi Kendra](/docs/uhi/v1/concepts/services/jan-aushadhi-kendra),
[Jan Aushadhi medicine search](/docs/uhi/v1/concepts/services/jan-aushadhi-medicine-search),
[AMRIT pharmacy](/docs/uhi/v1/concepts/services/amrit-pharmacy) and
[PMJAY HEM](/docs/uhi/v1/concepts/services/pmjay-hem).

## Two transports in one flow

Discovery goes through the gateway, which broadcasts your one `search` to every registered HSPA in that domain, so several `on_search` calls come back. Everything after discovery is point to point between your EUA and the HSPA the patient chose. There is no central UHI API for those stages.

Every call is asynchronous and signed.

## Next

- [Network and protocol](/docs/uhi/v1/concepts/network-and-protocol), for the message pairs, the `context` block, Ed25519 signing and the network registry lookup
- [Onboarding](/docs/uhi/v1/getting-started/onboarding), for the route from M2 to sandbox credentials to production
- [Physical consultation](/docs/uhi/v1/concepts/services/physical-consultation), the service with the full booking lifecycle
- [Support](/docs/support)
