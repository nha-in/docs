---
id: uhi.glossary.direct-call-p2p
type: glossary
gateway: uhi
milestone: n/a
version: uhi-v1
title: Direct call (P2P), a call between EUA and HSPA without the Gateway
summary: A signed call the EUA and HSPA make to each other without the UHI
  Gateway. Every call from init onwards goes this way.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_uhi.mdx
    status: page
    note: Generated from site/docs/_glossary/_uhi.mdx#direct-call-p2p. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.direct-calls
    - uhi.concept.gateway-routes
  glossary:
    - uhi.glossary.audit-copy
    - uhi.glossary.consumer-uri
---

# Direct call (P2P), a call between EUA and HSPA without the Gateway

## In plain words

A call the [EUA](/docs/uhi/v1/getting-started/glossary#eua) and the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) make to each other, peer to peer, without the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway). Every call from `init` onwards goes this way, to `provider_uri` or `consumer_uri`, signed with the sender's own `Authorization` header. See [Routes](/docs/uhi/v1/concepts/routes#direct-between-eua-and-hspa).
