---
id: uhi.glossary.fulfillment-type
type: glossary
gateway: uhi
milestone: n/a
version: uhi-v1
title: fulfillment.type, the kind of service a UHI search asks for
summary: The field in a search's intent that names the kind of service asked
  for, such as PMJAYHEM, Physical or EMERGENCY.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_uhi.mdx
    status: page
    note: Generated from site/docs/_glossary/_uhi.mdx#fulfillment-type. Edit the
      page, never this file.
related:
  glossary:
    - uhi.glossary.context-domain
  concepts:
    - uhi.concept.pmjay-hem-service-identity
    - uhi.concept.consultation-service-identity
    - uhi.concept.ambulance-service-identity
---

# fulfillment.type, the kind of service a UHI search asks for

## In plain words

The field in `message.intent.fulfillment` that names the kind of service a search asks for, such as `PMJAYHEM` for PM-JAY HEM, `Physical` for Physical Consultation or `EMERGENCY` for Ambulance Booking. See the page for your [service](/docs/uhi/v1/services).
