---
id: shared.glossary.abdm
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: ABDM, Ayushman Bharat Digital Mission
summary: >
  India's national programme for connecting health records, identities
  and facilities across providers, the umbrella over its gateways and
  milestones.
sources:
  - file: catalogue/hiecm/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Swagger 1.yaml
    fetched: 2026-09-16
    hash: sha256:6ab5cfe77c29032fac5fbf25c8e28529f22951e459374fa618f570f15e25551b
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/milestones/index.mdx
    status: reference
    note: >
      The milestones page, from NHA's content review of 15 September 2026:
      "ABDM integration is divided into milestones".
related:
  concepts: []
  glossary:
    - hiecm.glossary.m1
    - hiecm.glossary.m2
    - hiecm.glossary.m3
    - hiecm.glossary.m4
---

# ABDM, Ayushman Bharat Digital Mission

## In plain words

ABDM stands for Ayushman Bharat Digital Mission. It is the national
programme that gives every person a health identity, gives every provider
and facility a registered identity, and defines how health records move
between them with the patient's consent.

You will meet the name everywhere. In practice you never call something
called "ABDM". You call one of its gateways, which is where the other
entries in this glossary come in.

ABDM is the umbrella, and HIE-CM, UHI and NHCX are its gateways. ABDM
integration is divided into milestones, and the milestones are ABDM's.
In order they are [M1](/docs/hiecm/v3/milestones/m1), creating and
verifying ABHA; [M2](/docs/hiecm/v3/milestones/m2), linking and sharing
health records as a HIP; [M3](/docs/hiecm/v3/milestones/m3), requesting
and fetching records with consent as an HIU; and
[M4](/docs/hiecm/v3/milestones/m4), registering health facilities and
healthcare professionals. All four are implemented through the HIE-CM
gateway, which is why their documentation sits in this portal's HIE-CM
section, but they are ABDM milestones, not HIE-CM milestones. An
integrator implements the milestones that apply to its software.

ABDM was called the National Digital Health Mission, NDHM, until it was
renamed at national rollout in September 2021. The old name is still
everywhere in material you will read: in hostnames such as
`dev.ndhm.gov.in`, in specification filenames, and in NHA's own
documents. NDHM and ABDM are the same programme.

ABDM is not PM-JAY. Both are run by the National Health Authority, and
they are different schemes. PM-JAY pays for treatment. ABDM moves health
records. An Ayushman card is a PM-JAY entitlement, and an ABHA is an
ABDM identity.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what ABDM is without using the acronym itself.

## When it goes wrong

The common confusion is treating ABDM as a single API. It is a programme with several gateways and registries, each with its own host, version and credentials.

The other is calling M1 to M4 HIE-CM milestones because they are implemented through the HIE-CM gateway. They are ABDM milestones; HIE-CM is the gateway they run on.

