---
id: uhi.decision.first-service
type: decision
gateway: uhi
milestone: n/a
version: uhi-v1
title: Which UHI service to build first
summary: Start with one signed PM-JAY HEM search and its callback, the smallest
  exchange on the network, then build the service for your role.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/services/index.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/services/index.mdx#which-service-to-build-first. Edit the
      page, never this file.
related:
  decisions:
    - uhi.decision.choose-role
  flows:
    - uhi.flow.pmjay-hem-discovery
  concepts:
    - uhi.concept.pmjay-hem-service-identity
    - uhi.concept.service-reach
  glossary:
    - shared.glossary.uhi
---

# Which UHI service to build first

## In plain words

Start with the [Quickstart](/docs/uhi/v1/getting-started/first-fifteen-minutes): one signed PM-JAY HEM search to the sandbox Gateway, and one callback with hospitals. It is the smallest exchange on the network, and it shows the network working end to end.

Then build the service for your role from the table above. [Messages](/docs/uhi/v1/concepts/messages) and [Signing](/docs/uhi/v1/concepts/signing) cover what every call shares.
