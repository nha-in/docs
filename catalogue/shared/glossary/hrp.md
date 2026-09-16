---
id: shared.glossary.hrp
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HRP, health repository provider
summary: >
  Whoever holds the records. It describes custody, which is why it is
  neither a position nor a direction.
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
  glossary: [shared.glossary.dsc]
  decisions: [shared.decision.role-model-two-axes]
---

# HRP, health repository provider

## In plain words

Health Repository Provider. HRP is whoever holds the records. That is
the facility in most integrations, and its repository software is how the
facility holds them. Where a facility's records sit with another
organisation, that organisation is the HRP. HRP and HIP are written
together as "HRP/HIP" because the entity holding the records is usually
the entity publishing them. If you run an [HMIS](hmis.md) or a
[LIMS](lims.md) for a facility integrating M2, that facility is the HRP.

The general form is any entity that manages, stores and transacts health
records. That is a statement about custody: it says who holds the data,
not which side of a gateway they sit on and not what they are doing in a
given call.

## Before you start

It helps to know that ABDM keeps no central store of health records. If
it did, this term would not need to exist.

## What happens

HRP, HIP, HIU and the health locker get listed together as though the
four were one set of roles to choose from. They are not comparable:

| Term | What kind of thing it is |
|---|---|
| PHR app, HMIS, LIMS | Position, which of the two entities the software acts for |
| HIP, HIU | Direction, which way a record is moving in one interaction |
| HRP | Custody, who holds the records |
| DSC | Vendor, the company that builds the software |

One integration is usually several of these at once. A hospital system
acts for a facility by position, that facility is the HIP or the HIU
depending on the call, the facility is the HRP because it holds the
records, and the software is sold by a DSC.

In practice the term shows up when software is registered: the bridge you
register with the gateway is how custody is declared, and it is where you
name which facilities you act for.

## How you know it worked

You have understood this when you can say why a facility might hold no records itself and still answer discovery.

## When it goes wrong

Assuming the facility named on a record is the system that holds it. A
repository provider can hold records for many facilities.

Treating HRP as an alternative to HIP or HIU and trying to pick one.
They answer different questions: HRP is custody and the other two are
direction, so all three apply at once.

Reading a different term into it. HRP is written Health Records Provider
in places, and has been misprinted as Health Professional Registry, which
is a different thing entirely. All of them mean the repository, not the
registry.
