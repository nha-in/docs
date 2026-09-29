---
id: uhi.concept.pmjay-hem-service-identity
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: PM-JAY HEM service identity
summary: The case-sensitive values every PM-JAY HEM search carries, including
  context.domain nic2004:85112, fulfillment type PMJAYHEM and item code PMJAY.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/pmjay-hem.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/pmjay-hem.mdx#service-identity.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.pmjay-hem-discovery
  glossary:
    - uhi.glossary.context-domain
    - uhi.glossary.fulfillment-type
    - uhi.glossary.pm-jay-hem
---

# PM-JAY HEM service identity

## In plain words

Set these values exactly. They are case sensitive.

| Field | Value |
| --- | --- |
| `context.domain` | `nic2004:85112` |
| `context.core_version` | `0.7.1` |
| `message.intent.fulfillment.type` | `PMJAYHEM` |
| `message.intent.item.descriptor.code` | `PMJAY` |
| `message.intent.item.descriptor.name` | `PMJAY` |
| `message.intent.item.descriptor.flag` | `false` |
| Gateway endpoint | `POST /api/v1/uhi/search` |
