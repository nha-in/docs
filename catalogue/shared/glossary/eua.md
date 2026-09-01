---
id: shared.glossary.eua
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: EUA, end user application
summary: >
  In UHI, the consumer facing side: the app a patient uses to search
  for a service and book it.
sources:
  - file: site/docs/_glossary/_uhi.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# EUA, end user application

## In plain words

End User Application: in [UHI](uhi.md), the consumer facing side, the
app a patient or a caregiver uses to search for a service and book it.
It sends a signed request to the UHI gateway and receives responses at
its own callback URL. See [UHI](/docs/uhi/v1).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which side of a UHI transaction the EUA sits on.

## When it goes wrong

Looking for EUA in HIE-CM. It belongs to UHI, which is a different
gateway with different roles.
