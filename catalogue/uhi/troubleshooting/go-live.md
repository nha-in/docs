---
id: uhi.troubleshooting.go-live
type: troubleshooting
gateway: uhi
milestone: n/a
version: uhi-v1
title: When a UHI search fails after the switch to production
summary: A search that worked in the sandbox fails in production. Check the
  Gateway host, then your production IDs and callback URL.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/going-live.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/going-live.mdx#when-it-goes-wrong. Edit
      the page, never this file.
related:
  sandbox:
    - uhi.sandbox.production-switch
    - uhi.sandbox.base-urls
  troubleshooting:
    - uhi.troubleshooting.http-statuses
  concepts:
    - uhi.concept.signing-headers
---

# When a UHI search fails after the switch to production

## In plain words

If a search that worked in the sandbox fails in production, check the Gateway
host first, then `consumer_id` and `consumer_uri` or their HSPA equivalents. A
`401` or `403` comes before any body: see
[Errors on UHI](/docs/uhi/v1/concepts/errors#http-statuses-before-the-body).

## What happens

A search that worked in the sandbox fails after the switch to production. Either a value still points at the sandbox, or the Gateway rejects the signature or the registration before it reads the body.

## When it goes wrong

Check in this order and stop at the first that fails. The host is `https://uhigateway.abdm.gov.in`, not `https://uhigatewaysandbox.abdm.gov.in`. An EUA sends production values in `consumer_id` and `consumer_uri`; an HSPA in `provider_id` and `provider_uri`. A `401` means the signature does not match the body sent, is reused or expired, or names the wrong key. A `403` means the public key is not registered or the registration is not yet active.
