---
id: hiecm.concept.roles
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Roles, which entity your software acts for and which way the record moves
summary: Your role, IMS or PHR, is fixed by the entity your software acts for,
  while HIP and HIU change with the direction each record moves.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/how-it-fits.mdx
    status: page
    note: Generated from site/docs/hiecm/v3/concepts/how-it-fits.mdx#roles. Edit the
      page, never this file.
related:
  glossary:
    - shared.glossary.hip
    - shared.glossary.hiu
    - shared.glossary.phr
    - shared.glossary.hrp
    - shared.glossary.dsc
    - shared.glossary.hfr
    - shared.glossary.abha
    - shared.glossary.hmis
    - shared.glossary.lims
    - shared.glossary.emr
    - shared.glossary.pms
  decisions:
    - shared.decision.role-model-two-axes
  concepts:
    - hiecm.concept.abha-number-and-address
---

# Roles, which entity your software acts for and which way the record moves

## In plain words

There are two integrator roles on HIE-CM, and your product is one of them for its
whole life. What decides it is which entity your software acts for.

| Role | It acts for | What you build |
| --- | --- | --- |
| [IMS](/docs/hiecm/v3/getting-started/glossary#ims) | A care provider. An HMIS in a hospital, an EMR in a clinic, a LIMS in a laboratory, a PMS in a pharmacy | [M1](/docs/hiecm/v3/milestones/m1) to [M4](/docs/hiecm/v3/milestones/m4) |
| [PHR](/docs/hiecm/v3/getting-started/glossary#phr) | A care seeker, who holds their own records and gives consent | [P1](/docs/hiecm/v3/milestones/p1) to [P3](/docs/hiecm/v3/milestones/p3) |

[HIP](/docs/hiecm/v3/getting-started/glossary#hip) and
[HIU](/docs/hiecm/v3/getting-started/glossary#hiu) are not a third and a fourth
role, and they are not something you register as. They are the two ends of one
record moving: whoever publishes it is the HIP for that exchange, and whoever
asks to read one they did not create is the HIU.

Both roles are both, and it changes call by call:

- A hospital is the HIP when it shares a discharge summary, and the HIU when it pulls an earlier prescription, through the same IMS.
- A citizen is the HIP when they push a record from their PHR application, and the HIU when they fetch one.

Neither is a thing you can build once and be. See
[HIP and HIU](/docs/hiecm/v3/concepts/hip-hiu).

So the milestones you build follow the direction your records move, not the kind
of product you sell. A PHR app that lets a citizen push a record publishes as
the HIP, and builds the M2 linking and transfer calls as well. See
[where the citizen is the HIP](/docs/hiecm/v3/milestones/p2#where-the-citizen-is-the-hip).
Records never pass through the consent manager: it routes the request and holds
the consent, and the record goes from the system that holds it to the system
that asked.

## Before you start

Know which entity the software acts for, a care provider or a care seeker. That fixes the role for the life of the product.

## What happens

Decide the role once, IMS or PHR, from the entity. Then list every direction a record moves through the product: publishing a record is HIP behaviour, fetching one it did not create is HIU behaviour. Build the milestones for each direction the product uses.

## How you know it worked

For a hospital system that also pulls a patient's history, you can name the role, IMS, both directions, and the milestones: M1, M2 and M3. For a PHR app that uploads a scanned prescription, you can say the citizen is the HIP for that record.

## When it goes wrong

HIP, HIU, health repository and health locker are chosen as though they were one list of company types: two are directions, one is custody, one is a product. A PHR app is built for P1 alone and then cannot publish the first record a citizen pushes. A fetch is designed against the consent manager, which holds no records.
