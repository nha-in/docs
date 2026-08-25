---
title: Onboarding to UHI
sidebar_label: Onboarding
description: How an application joins the UHI network, from the M2 gate to sandbox sign-off and production go-live.
verification: unverified
source: UHI__UHI_Physical_Consultation_v2.0_-_Onboarding_Document.md, UHI__UHI_AmbulanceBooking_Onboarding_v1.1-July2026.md, UHI__UHI_BloodBank_Onboarding_v1.0.md, UHI__UHI_PMJAY_HEM_Onboarding_v1.4.md, UHI__UHI_JanAushadhiKendra_OnboardingDoc_v1.0.md, UHI__UHI_AMRIT_Pharmacy_OnboardingDoc_v1.0.md
sidebar_position: 1
---

# Onboarding to UHI

Every [UHI](/docs/uhi/v1/getting-started/glossary#uhi) service document repeats the same joining route. After this page you will know the seven steps from the [M2](/docs/hiecm/v3/getting-started/glossary#m2) gate to production go-live, and where one service differs from the rest.

Read [Introduction](/docs/uhi/v1) and [UHI gateway](/docs/uhi/v1/concepts/network-and-protocol) first, for the network, the two roles and the message pattern.

## Pick your role first

| Role | Full name | What you build |
| --- | --- | --- |
| [EUA](/docs/uhi/v1/getting-started/glossary#eua) | End User Application | The citizen facing app. Sends the search, receives results at your callback URL, drives booking where the service supports it. |
| [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) | Health Service Provider Application | The provider platform. Answers searches from its own catalogue and, where the service supports it, runs the booking lifecycle. |

The HSP is the hospital, clinic, doctor, ambulance operator or blood bank, and the HSPA is its digital interface. The [gateway](/docs/uhi/v1/getting-started/glossary#gateway) is [NHA](/docs/uhi/v1/getting-started/glossary#nha)'s routing layer.

## Which role each service accepts

Four of the seven have a single HSPA that someone else already operates, so your work is the EUA side.

| Service | EUA | HSPA | Who runs the HSPA |
| --- | --- | --- | --- |
| [Physical consultation](/docs/uhi/v1/concepts/services/physical-consultation) | Yes | Yes | Any onboarded provider platform |
| [Ambulance booking](/docs/uhi/v1/concepts/services/ambulance-booking) | Yes | Yes | Any onboarded ambulance operator platform |
| [Blood bank](/docs/uhi/v1/concepts/services/blood-bank) | Yes | Yes | Open to both roles. e-RaktKosh is the registered HSPA today |
| [PM-JAY HEM](/docs/uhi/v1/concepts/services/pmjay-hem) | Yes | No | NHA. The document states there are no third party HSPA integrations |
| [Jan Aushadhi Kendra](/docs/uhi/v1/concepts/services/jan-aushadhi-kendra) and [medicine search](/docs/uhi/v1/concepts/services/jan-aushadhi-medicine-search) | Yes | Named | PMBI |
| [AMRIT pharmacy](/docs/uhi/v1/concepts/services/amrit-pharmacy) | Yes | Named | HLL Lifecare Limited |

Two bars on the HSPA role. For blood bank, your inventory data has to be maintained independently at a standard comparable to e-RaktKosh. For ambulance, availability has to be real time or near real time, and an integration built on manually maintained records will not be approved for production.

## The gate before any of this

Your application must have completed ABDM M2 with [HIE-CM](/docs/uhi/v1/getting-started/glossary#hie-cm). The physical consultation, blood bank and PM-JAY HEM documents each carry the same sentence: an application that has not completed M2 cannot be onboarded onto UHI services. The ambulance booking document sets M2 as the primary prerequisite in its own words. The Jan Aushadhi Kendra and AMRIT pharmacy documents do not mention M2 at all, so treat the gate as applying to them until your NHA contact tells you otherwise.

If M2 is not done, start at [M2 linking and sharing](/docs/hiecm/v3/api/m2).

## The steps

Steps 1 to 5 are sandbox. Steps 6 and 7 are production.

1. **Express intent.** Reply to NHA's onboarding communication, or contact your NHA point of contact, and name the service you want to integrate.
2. **Generate your key pair.** Clone [github.com/NHA-ABDM/UHI](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility) and run `Generator.java` with option 1. Send NHA the public key only.
3. **Fill the onboarding form.** [sandbox.abdm.gov.in](https://sandbox.abdm.gov.in/sandbox/v3/sandbox-registration) asks for your organisation details, your role, your HTTPS sandbox callback URL and your public key.
4. **Get sandbox access.** NHA emails sandbox credentials. Review the Swagger specification, and ask NHA for the UHI Postman collection for your service.
5. **Build and test.** Implement the stages your service covers, then run NHA's test cases for your role.
6. **Get sign-off.** NHA reviews your test evidence and confirms in writing. Physical consultation also asks for a demo video.
7. **Go to production.** NHA promotes your integration. Update `consumer_id`, `consumer_uri`, `provider_id` and `provider_uri` to production values.

Two documents order steps 2 and 3 the other way round. The form asks for your public key, so generate the key pair first whichever order your document lists.

## The signing keys

Every UHI call is signed with an Ed25519 signature over a BLAKE-512 hash of the request body. The header format is on [UHI gateway](/docs/uhi/v1/concepts/network-and-protocol#signing). Onboarding needs the key pair.

| Item | What the documents say |
| --- | --- |
| How you generate it | NHA's header generator utility, `Generator.java` option 1. It also produces signed headers: feed it your subscriber ID, your public key ID and the exact request payload as a string. |
| What you send NHA | The public key only, registered against your subscriber ID during onboarding. |
| What you keep | The private key. Keep it out of your repository and out of your client applications. |
| Your key ID | Appears inside the `Authorization` header as `<SUBSCRIBER_ID_FROM_NHA_ONBOARDING>\|<YOUR_PUBLIC_KEY_ID>\|ed25519`. |
| The gateway's key | Gateway calls to you carry `X-Gateway-Authorization`, key ID prefixed `gateway-nha`. Verify it rather than trusting the source address. |
| Finding another party's key | `POST /api/v1/networkregistry/lookup` on the gateway returns a subscriber's registered public key. Both sides use it before a signed point to point call. |

## The callback URL you register

It is your `consumer_uri` if you are an EUA, and your `provider_uri` if you are an HSPA. Four rules come out of the documents.

- Publicly accessible over HTTPS. The gateway and the other party call it from outside your network.
- For an EUA, it must share a domain with your `consumer_id`. NHA's physical consultation document states this in the context field table.
- It is where the real answer arrives. The synchronous reply to any UHI call is an ACK receipt, not the business response. Do not block your request thread.
- You match the answer to your request on `transaction_id`. Several HSPAs can answer one search, and that field is the only thing tying their calls back to yours.

What sits behind that URL depends on your role and how far your service goes.

| Service and role | Endpoints you expose |
| --- | --- |
| EUA, discovery only services | `/on_search` |
| EUA, ambulance booking (NHA's first phase) | `/on_search`, `/on_init` |
| EUA, physical consultation | `/on_search`, `/on_init`, `/on_confirm`, `/on_status`, `/on_update`, `/on_cancel`, `/on_message` |
| HSPA, ambulance booking (NHA's first phase) | `/search`, `/init` |
| HSPA, physical consultation | `/search`, `/init`, `/confirm`, `/status`, `/cancel`, `/on_update`, `/on_message` |

The discovery only services are blood bank, PM-JAY HEM, Jan Aushadhi Kendra, Jan Aushadhi medicine search and AMRIT pharmacy.

On physical consultation, `/on_message` is mandatory for an EUA and optional for an HSPA. `/on_update` is consumed by both sides.

## The sandbox path

```text
Gateway base URI        https://uhigatewaysandbox.abdm.gov.in
Reference EUA           http://uhieuasandbox.abdm.gov.in/api/v1/euaService
Reference HSPA          https://hspasbx.abdm.gov.in/api/v1/hspa
Production gateway      https://uhigateway.abdm.gov.in
```

Those are NHA's own sandbox applications. If you are building an EUA, the reference HSPA answers your searches until a real one is registered against your test.

The Swagger specification sits at [uhigatewaysandbox.abdm.gov.in/swagger-ui](https://uhigatewaysandbox.abdm.gov.in/swagger-ui/index.html?urls.primaryName=v2.0.2#/). The documents do not agree on a version: physical consultation points at `v2.0.2`, PM-JAY HEM at `v2.0.1`. Check which one your onboarding contact expects.

NHA also publishes the reference EUA and HSPA as APKs, and recordings of its integration support calls, in the reference tables of the physical consultation document.

## Before you ask for sign-off

NHA's physical consultation document carries a twenty row readiness checklist. These items apply whatever your service.

- ABDM M2 with HIE-CM is complete.
- Your Ed25519 key pair is generated and the public key is submitted.
- The onboarding form is submitted and sandbox access is configured.
- Your HTTPS callback URL is live and reachable from outside your network.
- Request signing is implemented, and you verify inbound signatures.
- Every endpoint your role and service requires is exposed and tested.
- Discovery is tested across each filter your service supports.
- Asynchronous handling is tested, including an empty result set and a response that never arrives.
- NHA's test cases for your role pass, and you have the evidence to show.

Services that go beyond discovery add their own items. Physical consultation asks for the booking flow, the PIN, status transitions, terms display and a caching policy with a ceiling of 48 hours.

## Where to ask

NHA's documents list two support levels. L1 covers technical integration: API errors, signing problems, sandbox access and endpoint configuration. L2 covers the onboarding form, milestone verification and compliance. The named contacts are in the onboarding communication NHA sends you. Use that rather than a name copied from a document that may have moved on.

For anything about these pages rather than about UHI itself, see [support](/docs/support).

## Next

- [UHI gateway](/docs/uhi/v1/concepts/network-and-protocol), for the message pattern, the context block and signing
- [Introduction](/docs/uhi/v1), for the two roles and how far each service goes
- [Physical consultation](/docs/uhi/v1/concepts/services/physical-consultation), the service with the full booking lifecycle
- [M2 linking and sharing](/docs/hiecm/v3/api/m2), the prerequisite
