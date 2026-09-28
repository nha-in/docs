---
title: Introduction to UHI
sidebar_label: Introduction
description: What UHI is, the three parties in every exchange, the six services live on the network, and how to choose whether you build an EUA or an HSPA.
source: UHI developer guide as of 22 September 2026, section 1.1
sidebar_position: 0
sidebar_class_name: sidebar-icon sidebar-icon--compass
---

# Introduction to UHI

The Unified Health Interface ([UHI](/docs/uhi/v1/getting-started/glossary#uhi)) is an open network under the Ayushman Bharat Digital Mission ([ABDM](/docs/uhi/v1/getting-started/glossary#abdm)). Any compliant patient app can discover health services from any compliant provider platform through one integration. For some services it can book them too. After this page you will know who takes part, which services are live, and which side you build.

## In short

- Every exchange has three parties: your app, the UHI Gateway and a provider application.
- A patient-facing app is an [EUA](/docs/uhi/v1/getting-started/glossary#eua). A provider system that answers searches is an [HSPA](/docs/uhi/v1/getting-started/glossary#hspa).
- Six services are live on the network.
- For PM-JAY HEM, Jan Aushadhi and NOTTO, the HSPA already exists. You build only the EUA.
- An EUA must complete [Milestone 2](/docs/hiecm/v3/milestones/m2) on [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) before onboarding.

## The three parties

Every UHI service is an asynchronous exchange. Your app sends a request, gets an immediate `ACK`, and receives the real answer later as a callback.

| Party | Who runs it | What it does |
| --- | --- | --- |
| EUA, End User Application | [PHR](/docs/uhi/v1/getting-started/glossary#phr) and consumer apps, such as Aarogya Setu or the [ABHA](/docs/uhi/v1/getting-started/glossary#abha) app | Takes the patient's query and sends `search`, and later booking calls. Receives callbacks on its `consumer_uri` and renders results |
| [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) | [NHA](/docs/uhi/v1/getting-started/glossary#nha) | Validates and signs requests, routes `search` to the right HSPAs, and relays `on_search` back to the EUA |
| HSPA, Health Service Provider Application | The service owner, such as a hospital network, NOTTO, PMBI or an ambulance aggregator | Queries its own registry and returns a signed catalog in `on_search`. Sends booking callbacks where the service supports them |

## The six services

A service is named by the `context.domain` value inside each call, not by a different endpoint.

| Service | `context.domain` | Your role | Who runs the HSPA | Scope today |
| --- | --- | --- | --- | --- |
| [Physical Consultation](/docs/uhi/v1/services/consultation) | `nic2004:85111` | EUA or HSPA | Any registered provider platform | Discovery, booking, check-in, cancellation |
| [PM-JAY HEM Hospital Discovery](/docs/uhi/v1/services/pmjay-hem) | `nic2004:85112` | EUA | NHA | Discovery |
| [Blood Bank Discovery](/docs/uhi/v1/services/blood-bank) | `nic2008:86906` | EUA or HSPA | e-RaktKosh, and any approved blood bank system | Discovery |
| [Ambulance Booking](/docs/uhi/v1/services/ambulance) | `nic2008:86909` | EUA or HSPA | Any registered ambulance platform | Discovery and quote, in Phase 1 |
| [Jan Aushadhi](/docs/uhi/v1/services/jan-aushadhi) | `nic2008:47721` | EUA | PMBI | Kendra and medicine discovery |
| [NOTTO Hospital Discovery](/docs/uhi/v1/services/notto) | `nic2004:86100` | EUA | NOTTO | Discovery |

Every service is listed on [Services](/docs/uhi/v1/services).

## Choose your role

| If you | You are | You build |
| --- | --- | --- |
| Build a patient-facing app | An EUA | The search, your callback endpoints, and the screens that render results |
| Run a provider system that answers searches | An HSPA | A `search` endpoint that answers from your own registry, and the booking calls your service supports |

You can be an HSPA only for Physical Consultation, Blood Bank Discovery and Ambulance Booking.

## Next steps

- [Get started](/docs/uhi/v1/getting-started): the six steps from sandbox to production, and your first search.
- [Quickstart](/docs/uhi/v1/getting-started/first-fifteen-minutes): send one signed search and read the callback.
- [Routes](/docs/uhi/v1/concepts/routes): which calls go through the Gateway and which go direct.
