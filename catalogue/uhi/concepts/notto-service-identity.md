---
id: uhi.concept.notto-service-identity
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: NOTTO service identity
summary: The fixed values every NOTTO search carries, including context.domain
  nic2004:86100, fulfillment type NOTTO_HOSPITAL and the notto.hspa provider id.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/notto.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/notto.mdx#service-identity. Edit
      the page, never this file.
related:
  flows:
    - uhi.flow.notto-discovery
  glossary:
    - uhi.glossary.context-domain
    - uhi.glossary.fulfillment-type
    - uhi.glossary.notto
---

# NOTTO service identity

## In plain words

| Field | Value |
| --- | --- |
| `context.domain` | `nic2004:86100` |
| `context.core_version` | `0.7.1` |
| `message.intent.fulfillment.type` | `NOTTO_HOSPITAL` |
| `message.intent.item.descriptor.code` | `NOTTO` |
| `message.intent.item.descriptor.name` | `NOTTO` |
| HSPA provider ID | `notto.hspa` |
| Gateway endpoints | `POST /api/v1/uhi/search`, `POST /api/v1/uhi/on_search` |
