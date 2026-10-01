# Services

Six services are live on the [UHI](/docs/pr-98/docs/uhi/v1/getting-started/glossary#uhi) network. Each one is an asynchronous exchange: your app sends a request, gets an immediate ACK, and receives the real answer later as a callback. One integration reaches every compliant provider platform for that service.

## What UHI offers

| Service                                                                     | Your role                                                                                                                    | Who runs the HSPA                                           | Scope today                                | `context.domain` |
| --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------ | ---------------- |
| [Physical Consultation](/docs/pr-98/docs/uhi/v1/services/consultation)      | [EUA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#eua) or [HSPA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#hspa) | Any registered provider platform                            | Discovery, booking, check-in, cancellation | `nic2004:85111`  |
| [PM-JAY HEM Hospital Discovery](/docs/pr-98/docs/uhi/v1/services/pmjay-hem) | EUA                                                                                                                          | [NHA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#nha) | Discovery                                  | `nic2004:85112`  |
| [Blood Bank Discovery](/docs/pr-98/docs/uhi/v1/services/blood-bank)         | EUA or HSPA                                                                                                                  | e-RaktKosh, plus any approved blood bank system             | Discovery                                  | `nic2008:86906`  |
| [Ambulance Booking](/docs/pr-98/docs/uhi/v1/services/ambulance)             | EUA or HSPA                                                                                                                  | Any registered ambulance platform                           | Discovery and quote                        | `nic2008:86909`  |
| [Jan Aushadhi](/docs/pr-98/docs/uhi/v1/services/jan-aushadhi)               | EUA                                                                                                                          | Pharmaceuticals and Medical Devices Bureau of India (PMBI)  | Kendra and medicine discovery              | `nic2008:47721`  |
| [NOTTO Hospital Discovery](/docs/pr-98/docs/uhi/v1/services/notto)          | EUA                                                                                                                          | National Organ and Tissue Transplant Organisation (NOTTO)   | Discovery                                  | `nic2004:86100`  |

## Which role to build

| You are building                        | Your role                                                     | What you build                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| A patient facing app                    | [EUA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#eua)   | The search screen, the calls, and a callback on your `consumer_uri`                                            |
| A provider system that answers searches | [HSPA](/docs/pr-98/docs/uhi/v1/getting-started/glossary#hspa) | A `provider_uri` that receives searches, queries your own registry and returns a signed catalog in `on_search` |

For PM-JAY HEM, Jan Aushadhi and NOTTO, the HSPA is already running. You build only the EUA side.

An EUA must have completed [HIE-CM](/docs/pr-98/docs/uhi/v1/getting-started/glossary#hie-cm) [Milestone 2](/docs/pr-98/docs/hiecm/v3/milestones/m2) first. An app without M2 cannot be onboarded onto any UHI service.

## Which service to build first

Start with the [Quickstart](/docs/pr-98/docs/uhi/v1/getting-started/first-fifteen-minutes): one signed PM-JAY HEM search to the sandbox Gateway, and one callback with hospitals. It is the smallest exchange on the network, and it shows the network working end to end.

Then build the service for your role from the table above. [Messages](/docs/pr-98/docs/uhi/v1/concepts/messages) and [Signing](/docs/pr-98/docs/uhi/v1/concepts/signing) cover what every call shares.
