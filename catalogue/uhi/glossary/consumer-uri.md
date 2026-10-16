---
id: uhi.glossary.consumer-uri
type: glossary
gateway: uhi
milestone: n/a
version: uhi-v1
title: consumer_uri and provider_uri, the UHI callback base URLs
summary: The public HTTPS callback base URLs in a UHI call's context block,
  consumer_uri for the EUA and provider_uri for the HSPA.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_uhi.mdx
    status: page
    note: Generated from site/docs/_glossary/_uhi.mdx#consumer-uri. Edit the page,
      never this file.
related:
  concepts:
    - uhi.concept.context-block
    - uhi.concept.ack-then-answer
  glossary:
    - uhi.glossary.eua
    - uhi.glossary.hspa
---

# consumer_uri and provider_uri, the UHI callback base URLs

## In plain words

The callback base URLs in a call's `context` block. `consumer_uri` is the [EUA](/docs/uhi/v1/getting-started/glossary#eua)'s, and must share a domain name with `consumer_id`. `provider_uri` is the [HSPA](/docs/uhi/v1/getting-started/glossary#hspa)'s. Results never come back on the request; they arrive later on one of these public HTTPS URLs. See [Messages and callbacks](/docs/uhi/v1/concepts/messages).
