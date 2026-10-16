---
id: uhi.concept.blood-bank-service-identity
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Blood Bank service identity
summary: The fixed values every Blood Bank search carries, context.domain
  nic2008:86906 and fulfillment type BloodStock, and the sandbox reference HSPA.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/blood-bank.mdx
    status: page
    note: Generated from site/docs/uhi/v1/services/blood-bank.mdx#service-identity.
      Edit the page, never this file.
related:
  flows:
    - uhi.flow.blood-bank-discovery
  glossary:
    - uhi.glossary.context-domain
    - uhi.glossary.fulfillment-type
---

# Blood Bank service identity

## In plain words

| Field | Value |
| --- | --- |
| `context.domain` | `nic2008:86906` |
| `context.core_version` | `0.7.1` |
| `message.intent.fulfillment.type` | `BloodStock` |
| EUA sends | `POST /api/v1/uhi/search` on the Gateway |
| HSPA sends | `POST /api/v1/uhi/on_search` on the Gateway |
| Sandbox reference HSPA | `provider_id` `nha.hspa`, `provider_uri` `https://hspasbx.abdm.gov.in/api/v1/hspa/bloodbank` |

A wrong `domain` means no HSPA responds to your search.
