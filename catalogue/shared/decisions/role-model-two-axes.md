---
id: shared.decision.role-model-two-axes
type: decision
gateway: shared
milestone: n/a
version: abdm-v3
title: Roles belong to the entity, and split into two axes, position and direction
summary: >
  HIP, HIU, HRP and the health locker read as one list of four roles.
  This catalogue separates the entity that holds the role from what that
  entity is doing, because the two answer different questions.
sources:
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      NHA's PHR Framework page, which defines HIP, HIU, HRP and the PHR
      app, and which is the page that lists them as one set.
  - url: https://github.com/eka-care/abdm-docs/blob/main/site/src/config/roles.ts
    status: reference
    note: >
      This repository's own role switcher, which already separates the
      axes by declaring that the IMS choice covers hip and hiu.
verified:
  status: unverified
  against: docs-only
related:
  glossary: [shared.glossary.abha]
---

# Roles belong to the entity, and split into two axes, position and direction

## In plain words

Health information provider, health repository provider, health
information user and health locker look like one list of four roles that
an integrator picks from. They are not one list. They mix three different
kinds of thing, and the list invites a further mistake: reading the role
onto the software instead of onto whoever is using it.

Two entities hold identity on this network. The citizen holds an
[ABHA](../glossary/abha.md) address. The facility holds a facility ID.
Health information provider and health information user are roles an
entity takes, and the software is how it takes them.

This catalogue splits roles into two axes on the entity, and one
capability.

## Before you start

You need to know what a gateway is, because the first axis uses
different words on each one.

## What happens

| Axis | Question it answers | Who holds the answer | Fixed for how long | Values |
|---|---|---|---|---|
| Position | Which of the two entities does this software act for | The citizen or the facility | Life of the application | HIE-CM: `phr` for a citizen, `ims` for a facility. UHI: `eua`, `hspa`. NHCX: `provider`, `payer` |
| Direction | Which way is a record moving in this interaction | The same entity, one interaction at a time | One interaction | `hip` when the entity publishes a record, `hiu` when it fetches one |

Position is which entity your software acts for, and therefore which side
of a gateway's exchange that entity sits on. A citizen and a facility sit
on opposite sides of the HIE-CM, and the vocabulary changes per gateway,
so `eua` is meaningful on UHI and meaningless on the HIE-CM.

Direction is what that entity is doing in a single interaction, and
either entity can take either direction. A citizen linking or pushing a
record from their PHR app is the HIP. A facility fetching a patient's
history under M3 is the HIU. This is why HIP and HIU are not categories
of company and not categories of product.

Health Repository Provider sits outside both. It describes any entity
that manages, stores and transacts health records, which is a statement
about custody rather than about position or direction. That is precisely
why it does not belong in a list with the other three.

The decisive reason for splitting is that milestones follow the
direction, not the position. M2 is HIP behaviour and M3 is HIU behaviour.
An integrator asking which milestone they need is asking what the entity
they act for does with records, and a single flat list cannot answer it.

The cost is real and accepted: an integrator who arrives holding a flat
list of four roles has to be shown the split before the vocabulary makes
sense.

## How you know it worked

Someone who says "I have an HMIS" can be told, without further
questions, that their software acts for a facility, which makes it an
`ims` on the HIE-CM, that the facility is the HIP when it publishes and
the HIU when it reads, and that this means M1 then M2 then M3.

Adding a gateway does not reopen the decision. UHI brings new position
values and reuses direction unchanged.

## When it goes wrong

The failure mode is a position value appearing in a direction field, or
the reverse, which collapses the axes back into one list. The linter
rejects both, and that rejection is the whole point of keeping the
vocabularies separate per gateway.

If a role is published that is genuinely neither position nor direction,
do not force it into an axis. Health Repository Provider is the existing
example, and it is recorded here as a capability instead.
