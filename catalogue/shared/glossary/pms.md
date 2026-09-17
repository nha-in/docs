---
id: shared.glossary.pms
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: PMS, pharmacy management system
summary: >
  The system a pharmacy runs to dispense and to hold stock. A pharmacy
  uses it both to read the prescription it is dispensing against and to
  record what it dispensed.
sources:
  - file: site/src/components/docs/RoleSelector.tsx
    status: not-yet-hashed
    note: >
      The portal's own role selector names this acronym. Written here so
      a pharmacy vendor searching for it finds the ABDM position.
related:
  concepts: [hiecm.concept.roles]
  glossary:
    [
      shared.glossary.hip,
      shared.glossary.hiu,
      shared.glossary.ims,
    ]
---

# PMS, pharmacy management system

## In plain words

Pharmacy Management System, the software a pharmacy runs to dispense and
to keep its stock. A pharmacy uses it to link what it dispensed as the
[HIP](hip.md), and to read the prescription it is dispensing against as
the [HIU](hiu.md).

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
