---
id: uhi.concept.gateway-role
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: What the UHI Gateway does
summary: The UHI Gateway passes a patient's search to every provider offering
  the service and relays each answer back; booking goes direct.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/index.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/index.mdx#what-the-uhi-gateway-does. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.gateway-routes
    - uhi.concept.direct-calls
  glossary:
    - shared.glossary.gateway
---

# What the UHI Gateway does

## In plain words

The Gateway works like a switchboard for searches. When a patient searches, the
app sends one request to the Gateway. The Gateway checks who sent it, passes it
to every provider that offers that service, and passes each answer back. The
patient sees results from many providers at once.

The Gateway only helps the patient find. Once the patient picks a provider, the
app and that provider talk to each other directly to book, track and cancel.
