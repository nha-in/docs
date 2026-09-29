---
id: uhi.sandbox.base-urls
type: sandbox
gateway: uhi
milestone: n/a
version: uhi-v1
title: UHI Gateway base URLs for sandbox and production
summary: The UHI Gateway base URL for the sandbox and for production, and the
  reference EUA and HSPA apps in the sandbox.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/sandbox.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/sandbox.mdx#4-note-the-base-urls. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.gateway-routes
    - uhi.concept.gateway-role
  sandbox:
    - uhi.sandbox.production-switch
  glossary:
    - shared.glossary.gateway
---

# UHI Gateway base URLs for sandbox and production

## In plain words

| Environment | [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) base URL | Reference apps |
| --- | --- | --- |
| Sandbox | `https://uhigatewaysandbox.abdm.gov.in` | Reference EUA `http://uhieuasandbox.abdm.gov.in/api/v1/euaService`; reference HSPA `https://hspasbx.abdm.gov.in/api/v1/hspa` |
| Production | `https://uhigateway.abdm.gov.in` | Your own production endpoints |

A third host, `https://uhigatewaybeta.abdm.gov.in`, is for use only when asked
at onboarding. [Routes](/docs/uhi/v1/concepts/routes#gateway-endpoints) lists
every Gateway endpoint under these hosts.
