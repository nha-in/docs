---
id: shared.glossary.discovery
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Discovery, finding whether a facility holds records
summary: >
  The step where a patient's app asks a facility whether it holds
  records for that patient.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# Discovery, finding whether a facility holds records

## In plain words

The step where a patient's [PHR](phr.md) app asks a facility whether it
holds records for that patient. The [HIE-CM](hie-cm.md) forwards the
request to the [HIP](hip.md) with verified identifiers (ABHA address,
mobile number, name, gender, year of birth) and any unverified
identifier the patient typed, such as a hospital patient ID. Your system
matches those against your own patients and replies with a list of [care
contexts](care-context.md), carrying no clinical detail.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what discovery returns when a facility holds nothing for that patient.

## When it goes wrong

Treating a discovery hit as permission to send data. Discovery only says
records exist. Sending them still needs a linked care context and a
granted consent.
