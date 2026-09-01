---
id: shared.glossary.hrp
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HRP, health repository provider
summary: >
  Any entity or solution that manages, stores and transacts health
  records. It describes custody, which is why it is neither a position
  nor a direction.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      NHA's PHR Framework page, which describes HRPs as digital solution
      companies offering ABDM compliant software, and an instance of
      certified software as an HRP.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.hip, shared.glossary.hiu, shared.glossary.dsc]
  decisions: [shared.decision.role-model-two-axes]
---

# HRP, health repository provider

## In plain words

Health Repository Provider. NHA's M2 document uses HRP for the system
that actually holds the records, and writes it as "HRP/HIP" because the
same system usually plays both parts. If you run an [HMIS](hmis.md) or
an [LMIS](lmis.md) and you are integrating M2, HRP means you.

The general form is any entity or solution that manages, stores and
transacts health records. That is a statement about custody: it says who
holds the data, not which side of a gateway they sit on and not what
they are doing in a given call.

## Before you start

It helps to know that ABDM keeps no central store of health records. If
it did, this term would not need to exist.

## What happens

NHA sometimes lists HRP alongside HIP, HIU and health locker as though
the four were one set of roles to choose from. They are not comparable:

| Term | What kind of thing it is |
|---|---|
| PHR app, HMIS, LIMS | Position, which side of a gateway you sit on |
| HIP, HIU | Direction, what you are doing in one interaction |
| HRP | Custody, whether you hold records |
| DSC | The company |

A single product is usually several of these at once. A hospital system
is provider facing by position, a HIP or an HIU depending on the call, an
HRP because it holds the records, and it is sold by a DSC. See
[roles](../../hiecm/concepts/roles.md).

In practice the term shows up when software is registered: the bridge you
register with the gateway is the technical form of being an HRP, and it
is where you declare which facilities you act for.

## How you know it worked

You have understood this when you can say why a facility might hold no records itself and still answer discovery.

## When it goes wrong

Assuming the facility named on a record is the system that holds it. A
repository provider can hold records for many facilities.

Treating HRP as an alternative to HIP or HIU and trying to pick one.
They answer different questions, and a system is normally all three.

NHA's own material is inconsistent here. Some API pages call it Health
Records Provider, and the sandbox glossary once misprinted it as Health
Professional Registry, which is a different thing entirely. All of them
mean the repository, not the registry.
