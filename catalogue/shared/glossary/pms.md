---
id: shared.glossary.pms
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: PMS, pharmacy management system
summary: >
  The system a pharmacy runs to dispense and to hold stock. It reads a
  prescription as an HIU and links what it dispensed as a HIP.
sources:
  - file: site/src/components/docs/RoleSelector.tsx
    status: not-yet-hashed
    note: >
      The portal's own role selector names this acronym. Written here so
      a pharmacy vendor searching for it finds the ABDM position.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary:
    [
      shared.glossary.hip,
      shared.glossary.hiu,
      shared.glossary.lmis,
      shared.glossary.ims,
    ]
---

# PMS, pharmacy management system

## In plain words

Pharmacy Management System, the software a pharmacy runs to dispense and
to keep its stock. In ABDM it acts as a [HIP](hip.md) when it links what
it dispensed, and as an [HIU](hiu.md) when it reads the prescription it
is dispensing against.

Not to be confused with an [LMIS](lmis.md), which is about stock moving
through a supply chain rather than about one patient's records.

See [Hospital, lab and pharmacy systems](/docs/hiecm/v3/concepts/hip-hiu).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which ABDM role a pharmacy
plays when it reads a prescription, and which when it records a dispense.

## When it goes wrong

Building only the side you started with. A pharmacy that reads
prescriptions and never publishes what it dispensed leaves the record
incomplete for whoever fetches the patient's history next.
