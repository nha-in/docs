---
id: shared.glossary.consent-manager
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Consent manager, the component that holds consent
summary: >
  The component that receives consent requests, shows them to the
  patient, and records the decision.
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

# Consent manager, the component that holds consent

## In plain words

The component that holds consent on the patient's behalf. In ABDM that
component is the [HIE-CM](hie-cm.md). It receives consent requests,
shows them to the patient, records the grant or the denial, and tells
both the requester and the record holder what the patient decided.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say why a consent manager is a separate component from the requester and the record holder.

## When it goes wrong

Assuming your system stores consent. It does not. The consent manager
holds it, and your copy is a cache that can go stale the moment a
patient revokes.
