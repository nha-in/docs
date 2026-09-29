---
id: uhi.glossary.hspa
type: glossary
gateway: uhi
milestone: n/a
version: abdm-v3
title: HSPA, health service provider application
summary: >
  In UHI, the provider facing side: the system that publishes
  services and accepts bookings.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_uhi.mdx
    status: reference
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
  - url: https://github.com/nha-in/docs/blob/main/catalogue/uhi/openapi/.raw/nha-2026-09-28-uhi/UHI%20Documentation%20Requirements.md
    status: docs-only
    note: >
      UHI developer guide as of 22 September 2026, sections 1.1 and 1.2.
related:
  concepts: []
---

# HSPA, health service provider application

## In plain words

Health Service Provider Application: in [UHI](uhi.md), the provider side
system that receives requests and responds to them, such as an ambulance
operator's dispatch platform, a blood bank management system or a
pharmacy's stock system. It is the counterpart of the [EUA](eua.md).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

The service owner runs the HSPA: a hospital network, NOTTO, PMBI or an
ambulance aggregator, for example. It receives a `search` from the UHI
Gateway, queries its own registry, and returns a signed catalog in
`on_search`. Where the service supports booking, it also answers the
booking calls directly from the EUA, and sends its callbacks to the EUA's
`consumer_uri`.

You can build an HSPA for Physical Consultation, Blood Bank Discovery and
Ambulance Booking. For PM-JAY HEM, Jan Aushadhi and NOTTO the HSPA already
exists, and you build only the EUA side. See [UHI](/docs/uhi/v1).

## How you know it worked

You have understood this when you can say which side of a UHI transaction the HSPA sits on.

## When it goes wrong

Looking for HSPA in HIE-CM. It belongs to UHI, which is a different
gateway with different roles.
