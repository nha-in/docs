---
id: shared.glossary.ims
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: IMS, information management system
summary: >
  The umbrella term for the software a health facility runs, whichever
  of HMIS, EMR, LIMS or PMS it happens to be.
sources:
  - file: site/src/config/roles.ts
    status: not-yet-hashed
    note: >
      The portal's own role selector calls one of its four readers an
      IMS vendor. Written here so that role has a definition behind it.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary:
    [
      shared.glossary.hmis,
      shared.glossary.emr,
      shared.glossary.lims,
      shared.glossary.pms,
    ]
---

# IMS, information management system

## In plain words

Information Management System, the umbrella term for the software a
health facility runs to do its work. Which one it is depends on the
facility: an [HMIS](hmis.md) in a hospital, also written HIS or HIMS, an
[EMR](emr.md) in a clinic, a [LIMS](lims.md) in a laboratory, a
[PMS](pms.md) in a pharmacy.

IMS is one of the two integrator roles on the [HIE-CM](hie-cm.md), the
other being a [PHR](phr.md) application, and it is fixed for the life of
the product: `ims` for software that acts for a facility, `phr` for
software that acts for a citizen. The vendor who writes any of those
systems has the same integration in front of them: the facility is the
[HIP](hip.md) when it publishes a record and the [HIU](hiu.md) when it
fetches one, so the code is M2 and M3 either way. See [roles](../../hiecm/concepts/roles.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which of the named systems
yours is, and that the ABDM work is the same whichever it turns out to be.

## When it goes wrong

Looking for an ABDM onboarding route for your product category. There is
not one. NHA registers the facility and the bridge, not the kind of
software behind it.
