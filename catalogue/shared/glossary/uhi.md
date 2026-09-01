---
id: shared.glossary.uhi
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: UHI, the Unified Health Interface
summary: >
  The gateway for finding and booking health services, separate from
  HIE-CM and NHCX.
sources:
  - file: site/docs/_glossary/_shared.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# UHI, the Unified Health Interface

## In plain words

Unified Health Interface, an open protocol network for health services
that are not record exchange: physical consultation booking, ambulance
booking, blood bank discovery, Jan Aushadhi and pharmacy search. It has
two roles, [EUA](/docs/uhi/v1/getting-started/glossary#eua) on the
consumer side and [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) on
the provider side, and every call is signed with Ed25519. See
[UHI](/docs/uhi/v1).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say which of the three gateways your use case belongs to.

## When it goes wrong

Expecting HIE-CM endpoints to work against UHI. They are separate
gateways with separate specifications.
