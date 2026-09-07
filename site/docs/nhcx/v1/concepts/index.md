---
title: Core concepts
sidebar_label: Core concepts
description: What a claim is made of on NHCX, and the concepts every integration depends on whichever side of the exchange you are building.
verification: unverified
source: NHCX sandbox portal, Technical Specifications and Open Protocol pages; NHCX Integration Handbook v1.0; NHCX FAQs v1.2
sidebar_position: 1
---

# Core concepts

The ideas an integration depends on, whichever side of the exchange you are building. Read these
before writing code, and come back to them when a payload or a status word does not behave.

## In short

- A claim on NHCX is a FHIR bundle, sealed for one recipient, inside an envelope the exchange routes but cannot read.
- Every substantive exchange is a request and a callback, never a synchronous answer.
- A workflow code in the header says which step a message is; a status word says how far along it is.
- PMJAY runs the same endpoints as any payer, with its own rules layered over them.

## The pages here

| Page | What it covers |
| --- | --- |
| [What NHCX is](/docs/nhcx/v1/concepts/what-nhcx-is) | The exchange, its five objectives, its three rulebooks, who is on it, and what changes for a hospital that joins |
| [Claim settlement](/docs/nhcx/v1/concepts/claim-settlement) | The ten steps of a health insurance claim, and the email-and-portal mechanism NHCX replaces |
| [The NHCX way](/docs/nhcx/v1/concepts/nhcx-way-of-claim-settlement) | How those ten steps become six exchanges, and the request-and-callback pattern underneath them |
| [JWE, status and errors](/docs/nhcx/v1/concepts/jwe-status-and-errors) | The envelope and the sealed letter, every header field, the status words, and what to send where sources disagree |
| [PMJAY on NHCX](/docs/nhcx/v1/concepts/pmjay-on-nhcx) | What changes when the payer is PMJAY, and the five stages of an integrator's journey |
| [PMJAY scheme rules](/docs/nhcx/v1/concepts/pmjay-scheme-rules) | Unspecified, cyclic, medical, newborn, implant and stratification cases, and what each does to a bundle |

## Next

- [Get started](/docs/nhcx/v1/getting-started), the base framework every participant builds
- [Workflow codes](/docs/nhcx/v1/exchanges/workflow-codes), every code with the status word it expects
- [Registries](/docs/nhcx/v1/registries), who is registered on NHCX
