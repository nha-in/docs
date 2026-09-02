---
title: NHA
sidebar_label: NHA
sidebar_position: 8
description: The National Health Authority runs ABDM. What we operate, what we issue, and what that gives the systems on the network.
verification: unverified
source: site/docs/_glossary/_shared.mdx, site/docs/hiecm/v3/concepts/gateway.md, site/docs/hiecm/v3/registries/index.md, site/docs/hiecm/v3/concepts/how-it-fits.md, site/docs/hiecm/v3/milestones/m4.mdx
---

# NHA

We are the National Health Authority. We run
[ABDM](/docs/hiecm/v3/getting-started/glossary#abdm), and this portal is us
speaking to you.

## Who we are in ABDM

We are the government body that runs the network. We publish the
specifications these pages are written from, and we operate both the
[sandbox](/docs/hiecm/v3/getting-started/glossary#sandbox) and the production
gateways.

We are not an integrator. There is no NHA system you exchange records with, and
no role you take opposite us. We issue the identifiers you carry, route your
calls, and hold the permission that lets a record move.

## What we do

| What we run | What it gives you |
| --- | --- |
| [ABHA](/docs/hiecm/v3/registries/abha) | A patient's 14 digit ABHA number and their ABHA address |
| [HPR](/docs/hiecm/v3/registries/nhpr/hpr) | An [HPID](/docs/hiecm/v3/getting-started/glossary#hpid) for a doctor, nurse, pharmacist or facility manager |
| [HFR](/docs/hiecm/v3/registries/nhpr/hfr) | A facility ID for a hospital, clinic, laboratory, imaging centre or pharmacy |
| [The gateway](/docs/hiecm/v3/concepts/gateway) | Your session token, header validation, and routing to every other participant |
| [HIE-CM](/docs/hiecm/v3/getting-started/glossary#hie-cm) | Care context links, consent requests and consent artefacts |
| The sandbox | Client credentials, test identities, and the milestone certification you submit |

One limit is deliberate. The HIE-CM is data blind. We hold identifiers, metadata
about where records live, and consent artefacts. We never hold the record. Once
consent exists, the record goes straight from the system that holds it to the
system that asked, encrypted.

We also run two further gateways with their own specifications:
[UHI](/docs/hiecm/v3/getting-started/glossary#uhi) for services such as
appointments, and [NHCX](/docs/nhcx/v1) for insurance claims.

## Why it is worth it

Because we run the middle, you do not have to negotiate with every other
participant. One identity works at every facility in the country. One consent
model governs every transfer, so you implement it once. One certification path
covers going live.

And because we are data blind, joining the network does not mean handing us your
patients' records. They stay where they were created, in your system.

## Next

[How the pieces fit](/docs/hiecm/v3/concepts/how-it-fits) puts the registries,
the gateway and your role in one page.
