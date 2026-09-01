---
id: shared.decision.role-model-two-axes
type: decision
gateway: shared
milestone: n/a
version: abdm-v3
title: Roles are two axes, position and direction, not one list
summary: >
  ABDM's own documentation lists HIP, HIU, HRP and PHR as one set of
  roles. This catalogue separates what an application is from what it is
  doing, because the two answer different questions.
sources:
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      NHA's PHR Framework page, which defines HIP, HIU, HRP and the PHR
      app, and which is the page that lists them as one set.
  - file: site/src/config/roles.ts
    status: not-yet-hashed
    note: >
      This repository's own role switcher, which already separates the
      axes by declaring that the IMS choice covers hip and hiu.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.hip, shared.glossary.hiu, shared.glossary.phr]
---

# Roles are two axes, position and direction, not one list

## In plain words

NHA's sandbox tells integrators that "Health Information Providers,
Health Repository Providers, Health Information Users Or Health Lockers"
should integrate. That reads as one list of four roles. It is not. It
mixes three different kinds of thing, and an integrator who takes it at
face value cannot work out what they are.

This catalogue splits roles into two axes and one capability.

## Before you start

You need to know what a gateway is, because the first axis uses
different words on each one.

## What happens

| Axis | Question it answers | Fixed for how long | Values |
|---|---|---|---|
| Position | What is this application | Life of the application | HIE-CM: `phr`, `ims`. UHI: `eua`, `hspa`. NHCX: `provider`, `payer` |
| Direction | What is it doing right now | One interaction | `hip` when publishing a record, `hiu` when fetching one |

Position is which side of a gateway's exchange you sit on. A hospital
system and a patient app sit on opposite sides of the HIE-CM, and the
vocabulary changes per gateway, so `eua` is meaningful on UHI and
meaningless on the HIE-CM.

Direction is what you are doing in a single interaction, and either
position can take either direction. A PHR app that accepts a record
uploaded by a patient is acting as a HIP. A hospital fetching a patient's
history under M3 is acting as an HIU. This is why HIP and HIU are not
categories of company.

Health Repository Provider sits outside both. It describes any entity or
solution that manages, stores and transacts health records, which is a
statement about custody rather than about position or direction. That is
precisely why it does not belong in a list with the other three.

The decisive reason for splitting is that milestones follow the
direction, not the position. M2 is HIP behaviour and M3 is HIU behaviour.
An integrator asking which milestone they need is asking a question about
what their system does, and a single flat list cannot answer it.

The cost is real and accepted: this catalogue now disagrees with the
wording on NHA's own page. Where that matters, the atom says so rather
than quietly diverging.

## How you know it worked

Someone who says "I have an HMIS" can be told, without further
questions, that they are an `ims` on the HIE-CM, that they act as a HIP
when they publish and an HIU when they read, and that this means M1 then
M2 then M3.

Adding a gateway does not reopen the decision. UHI brings new position
values and reuses direction unchanged.

## When it goes wrong

The failure mode is a position value appearing in a direction field, or
the reverse, which collapses the axes back into one list. The linter
rejects both, and that rejection is the whole point of keeping the
vocabularies separate per gateway.

If NHA publishes a role that is genuinely neither position nor
direction, do not force it into an axis. Health Repository Provider is
the existing example, and it is recorded here as a capability instead.
