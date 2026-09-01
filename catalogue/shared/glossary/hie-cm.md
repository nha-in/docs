---
id: shared.glossary.hie-cm
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: HIE-CM, Health Information Exchange and Consent Manager
summary: >
  The ABDM building block that holds ABHA addresses, the links to each
  address's records, and the consent that authorises sharing them. It is
  not the gateway.
sources:
  - file: ABDM Sandbox/ABDM/Proposed Simplified Milestone 2.docx
    status: not-yet-hashed
    note: >
      NHA milestone pack for M2, which carries the care context model and
      the error code table.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.roles]
  glossary: [shared.glossary.gateway, shared.glossary.abha-address]
---

# HIE-CM, Health Information Exchange and Consent Manager

## In plain words

HIE-CM is the exchange in the middle. It holds ABHA addresses, keeps the
links to each address's health records, and manages the consents that
authorise sharing them. Providers register care contexts with it, and
requesters ask it for consent.

It is deliberately data blind. It handles identifiers and metadata about
records, never the clinical content itself.

An HIE-CM is not the gateway. The gateway is the hub that connects
HIE-CMs, health repositories and HIUs and routes between them. The
HIE-CM is one participant on that network, identified by a domain, which
is the part of an ABHA address after the `@`. NHA runs one HIE-CM today,
`abdm` in production and `sbx` on the sandbox, and the architecture
allows for more.

The clinical data itself does not travel through the HIE-CM at all. A
provider pushes it straight to the requester.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what HIE-CM is without using the acronym itself.

## When it goes wrong

Assuming HIE-CM stores records. It does not. If you need the record you fetch it from the provider that holds it, under a consent artefact.

