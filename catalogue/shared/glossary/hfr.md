---
id: shared.glossary.hfr
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HFR, Health Facility Registry
summary: >
  The registry of health facilities, which is where a facility is
  searched for, onboarded and linked to software.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 4 (NHPR).docx
    status: not-yet-hashed
    note: NHA milestone pack for M4.
verified:
  status: unverified
related:
  concepts: []
  glossary: [shared.glossary.nhpr, shared.glossary.hpr, shared.glossary.hip]
---

# HFR, Health Facility Registry

## In plain words

HFR holds health facilities of every kind, public and private: hospitals,
clinics, diagnostic laboratories, imaging centres, pharmacies and blood
banks, across modern and traditional systems of medicine. A facility must
exist here, and be linked to the software that acts for it, before that
software can act as a HIP.

The identifier HFR issues is the same identifier you send as the HIP.
NHA states it plainly: the HFR ID is the HIP ID. There is no separate
registration that turns a facility into a HIP, which is why
`X-HIP-ID` carries a facility code.

A facility is registered by its facility manager, who needs a Healthcare
Professional ID to do it. Registration is a self declaration followed by
verification, so a facility can exist in a self declared state before it
is verified.

HFR and the Healthcare Professionals Registry together make up the
National Healthcare Providers Registry, NHPR, which is milestone M4.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HFR is without using the acronym itself.

## When it goes wrong

M2 assumes a facility id that HFR issued. If linking fails with an authorisation error, the facility registration is the first thing to check.

