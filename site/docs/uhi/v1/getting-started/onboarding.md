---
title: Onboarding to UHI
sidebar_label: Onboarding
description: What you need before you start, and the six steps that take a UHI integration from sandbox registration to the production network.
source: UHI developer guide as of 22 September 2026, sections 1.1 and 1.4
sidebar_position: 1
sidebar_class_name: sidebar-icon sidebar-icon--door-open
---

# Onboarding to UHI

Join the [UHI](/docs/uhi/v1/getting-started/glossary#uhi) network in six steps, from your first contact to live traffic. This page lists what to have ready, then each step with what you get from it.

## In short

- An [EUA](/docs/uhi/v1/getting-started/glossary#eua) must complete [Milestone 2](/docs/hiecm/v3/milestones/m2) on [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm) first.
- Generate an Ed25519 key pair before you register. The registration form asks for the public key.
- Registration gives you a subscriber ID and sandbox access.
- Build, run your service's test cases, record a demo, and get written sign-off.
- Go live by switching your IDs and callback URLs to production values.

## Before you start

- **Milestone 2 on HIE-CM, for an EUA.** This is a hard prerequisite. An app that has not completed [M2](/docs/hiecm/v3/milestones/m2) cannot be onboarded onto any UHI service.
- **A public HTTPS callback URL.** Results never come back on the request. They arrive later on this URL: [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri) for an EUA, [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri) for an [HSPA](/docs/uhi/v1/getting-started/glossary#hspa).
- **An Ed25519 key pair.** You generate it in step 2 and share only the public key.
- **Async handling.** Your code must accept an `ACK` now and the real answer later, matched by `transaction_id`. See [Messages and callbacks](/docs/uhi/v1/concepts/messages).

## 1. Express intent

Tell your [NHA](/docs/uhi/v1/getting-started/glossary#nha) point of contact which service you want to integrate, and in which role.

**You get:** the onboarding kick-off.

## 2. Generate your key pair

Run the [Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility). It generates your Ed25519 key pair, and later signs each payload for you. Keep the private key on your server.

**You get:** a public key and a private key. See [Signing](/docs/uhi/v1/concepts/signing).

## 3. Register in the sandbox

Submit the [sandbox registration form](https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration) with your role, your callback URL and your public key.

**You get:** a subscriber ID and sandbox access.

## 4. Build and test

Build against the sample payloads and the [UHI API reference](/docs/uhi/v1/api), then run your service's test cases. Start with the [Quick start](/docs/uhi/v1/getting-started/quick-start), which sends one search end to end.

- Sandbox Gateway: `https://uhigatewaysandbox.abdm.gov.in`
- Test cases for each service: [Developer resources](/docs/uhi/v1/resources)

**You get:** a passing sandbox integration.

## 5. Record a demo and request sign-off

Record your app running the service's flow, and send it to your NHA point of contact with a request for sign-off.

Watch the [recorded walkthroughs of UHI services in Aarogya Setu](https://drive.google.com/drive/folders/1JvlWPouPNlyfLT3RmsjuUzeAVkdhlKrD?usp=drive_link) before you build your EUA screens. Your sign-off demo follows the same flow.

**You get:** written sign-off.

## 6. Switch to production

Change `consumer_id` and `consumer_uri`, or `provider_id` and `provider_uri` for an HSPA, to your production values. The production Gateway is `https://uhigateway.abdm.gov.in`.

**You get:** a live integration on the production network.

## Next steps

- [Quick start](/docs/uhi/v1/getting-started/quick-start): your first signed search.
- [Routes](/docs/uhi/v1/concepts/routes): every Gateway endpoint and base URL.
- [Services](/docs/uhi/v1/services): the service you are onboarding for.
