---
id: uhi.concept.direct-calls
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Direct calls between the EUA and the HSPA
summary: From init onwards the EUA calls the HSPA's provider_uri and the HSPA
  calls back on the consumer_uri, each signing with its own key.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/routes.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/routes.mdx#direct-between-eua-and-hspa. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-search
    - uhi.endpoint.consultation-init
  concepts:
    - uhi.concept.registry-lookup
    - uhi.concept.audit-copies
  glossary:
    - uhi.glossary.direct-call-p2p
---

# Direct calls between the EUA and the HSPA

## In plain words

From `init` onwards, the EUA and the HSPA talk directly.

- **The EUA** sends to the HSPA's `provider_uri`, which arrives in the `context` of the HSPA's `on_search`.
- **The HSPA** sends its callbacks to the EUA's `consumer_uri`.
- **Each side** signs with its own `Authorization` header. The receiver fetches the sender's key with the [network registry lookup](/docs/uhi/v1/concepts/registry-lookup).

Physical Consultation's second search, for a chosen doctor's slots, also goes direct to the HSPA. Its `on_search` comes back with the HSPA's `Authorization` header, not the Gateway's.

## Before you start

The HSPA's `provider_uri` from the `context` of the `on_search` the patient chose, and the HSPA's key from the network registry lookup.

## What happens

Send `init` and every later call to `provider_uri`, signed with your own `Authorization`. The Gateway has no endpoint for these calls.

## When it goes wrong

A booking call sent to the Gateway base URL has no endpoint to reach. A direct callback checked against the Gateway's key fails: check it against the sender's key.
