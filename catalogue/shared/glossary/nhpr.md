---
id: shared.glossary.nhpr
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: NHPR, National Healthcare Providers Registry
summary: >
  The umbrella over the professionals registry and the facility
  registry, and the name of milestone M4. Both older portals now
  redirect to it.
sources:
  - url: https://nhpr.abdm.gov.in/
    status: docs-only
    note: >
      The NHPR portal, which presents itself as the umbrella over the
      Healthcare Professionals Registry and the Health Facility Registry.
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 4 (NHPR).docx
    status: not-yet-hashed
    note: NHA milestone pack for M4.
verified:
  status: unverified
  against: docs-only
related:
  glossary: [shared.glossary.hpr, shared.glossary.hfr]
---

# NHPR, National Healthcare Providers Registry

## In plain words

NHPR is the two provider registries under one name: the Healthcare
Professionals Registry for people, and the Health Facility Registry for
places. Integrating with them from inside your own software is milestone
M4.

## Before you start

Read the two registry entries first. NHPR is the umbrella, and almost
every concrete question is about one registry or the other.

## What happens

Registration is three steps in NHA's description: generate a Healthcare
Professional ID using Aadhaar or another KYC, fill the registration form
with personal, council, academic and work details for a professional or
with demographic, service and infrastructure details for a facility, then
submit for verification and answer any queries raised.

M4 exists so that a professional or a facility can be registered from
inside the software they already use, instead of being sent to a portal.
It assumes M1 to M3 are already done.

The portals have consolidated. Both `hpr.abdm.gov.in` and
`facility.abdm.gov.in` now redirect to `nhpr.abdm.gov.in`. Material that
describes them as two separate sites is describing a structure that no
longer exists.

## How you know it worked

A professional or facility you registered through your own software
appears in the registry and can be found there, without anyone visiting
a portal.

## When it goes wrong

Assuming registration is instant. A facility is self declared first and
verified afterwards, and verification is a human process that can raise
queries and take time. A professional's details are verified against
their council, which remains the authority and which NHPR does not
replace.
