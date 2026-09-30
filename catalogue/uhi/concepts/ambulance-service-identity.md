---
id: uhi.concept.ambulance-service-identity
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Ambulance Booking service identity
summary: The fixed values every Ambulance Booking call carries, including
  context.domain nic2008:86909, item code AMBULANCE and fulfillment type
  EMERGENCY.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/ambulance.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/ambulance.mdx#service-identity.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.ambulance-discovery
  glossary:
    - uhi.glossary.context-domain
    - uhi.glossary.fulfillment-type
---

# Ambulance Booking service identity

## In plain words

| Field | Value |
| --- | --- |
| `context.domain` | `nic2008:86909` |
| `context.core_version` | `0.7.1` |
| `message.intent.item.descriptor.code` | `AMBULANCE` |
| `message.intent.fulfillment.type` | `EMERGENCY` |
| `message.intent.category.descriptor.code` | `ALS`, `BLS` or `ALL` |
