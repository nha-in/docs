---
id: hiecm.endpoint.gateway-update-bridge-url
type: endpoint
gateway: hiecm
milestone: M1
version: abdm-v3
title: Update the bridge callback URL
summary: Sets the callback URL that ABDM sends your callbacks to.
generated: true
operation: gateway_patch_gateway_v3_bridge_url
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/hiecm/gateway_patch_gateway_v3_bridge_url.mdx
    status: page
    note: Generated from
      site/docs/_notes/hiecm/gateway_patch_gateway_v3_bridge_url.mdx#gateway-update-bridge-url.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.gateway-session
  errors:
    - hiecm.error.abdm-2402
    - hiecm.error.abdm-2404
    - hiecm.error.abdm-2500
    - hiecm.error.abdm-9999
---

# Update the bridge callback URL

## In plain words

Sets the callback URL for your [bridge](/docs/hiecm/v3/getting-started/glossary#bridge). [ABDM](/docs/hiecm/v3/getting-started/glossary#abdm) sends every callback for your services to this URL, and each callback path is relative to it. Send the URL in `url`. A successful call returns 202 with no body.

## Before you start

A URL that ABDM can reach over the public internet. Send the access token as `Authorization: Bearer <gateway token>`, with `REQUEST-ID`, `TIMESTAMP` and `X-CM-ID`.

## How you know it worked

A 202, and then the list call returns the new `url` in its `bridge` object.

## When it goes wrong

A 400 with `ABDM-1015` means the body was refused: check that it carries `url`. A 401 with `900901` means the access token is missing or expired.
