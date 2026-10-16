---
id: uhi.sandbox.production-switch
type: sandbox
gateway: uhi
milestone: n/a
version: uhi-v1
title: Switch your UHI integration to production
summary: Change your IDs and callback URL to production values and point your
  calls at the production UHI Gateway.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/going-live.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/going-live.mdx#3-switch-to-production.
      Edit the page, never this file.
related:
  sandbox:
    - uhi.sandbox.base-urls
    - uhi.sandbox.demo-sign-off
  glossary:
    - uhi.glossary.consumer-uri
  troubleshooting:
    - uhi.troubleshooting.go-live
---

# Switch your UHI integration to production

## In plain words

Change the IDs and callback URL your calls carry.

| Your role | Switch to production values |
| --- | --- |
| EUA | `consumer_id` and [`consumer_uri`](/docs/uhi/v1/getting-started/glossary#consumer-uri) |
| [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) | `provider_id` and [`provider_uri`](/docs/uhi/v1/getting-started/glossary#provider-uri) |

Then point your calls at the production
[UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway).

| Environment | UHI Gateway base URL |
| --- | --- |
| Sandbox | `https://uhigatewaysandbox.abdm.gov.in` |
| Production | `https://uhigateway.abdm.gov.in` |

In production you use your own endpoints, not the sandbox reference apps.

**You get:** a live integration on the production network.

## Before you start

You hold written sign-off from step 2.

## How you know it worked

A search sent to `https://uhigateway.abdm.gov.in` returns `200` with an `ACK`, and the answer arrives on your production callback URL, matched by `transaction_id`.
