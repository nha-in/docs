---
id: uhi.concept.consultation-service-identity
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Physical Consultation service identity
summary: The fixed values every Physical Consultation call carries, including
  context.domain nic2004:85111 and the case-sensitive fulfillment type Physical.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/consultation.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/consultation.mdx#service-identity. Edit the
      page, never this file.
related:
  flows:
    - uhi.flow.consultation-discovery
  glossary:
    - uhi.glossary.context-domain
    - uhi.glossary.fulfillment-type
---

# Physical Consultation service identity

## In plain words

Every call in this service carries these fixed values.

| Field | Value |
| --- | --- |
| `context.domain` | `nic2004:85111` |
| `context.core_version` | `0.7.1` |
| `message.intent.fulfillment.type` | `Physical`, case sensitive |
| `message.intent.item.descriptor.code` | `Consultation` |
| `message.intent.item.descriptor.name` | `Consultation` |
