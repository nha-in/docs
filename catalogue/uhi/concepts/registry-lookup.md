---
id: uhi.concept.registry-lookup
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: When to call the UHI network registry lookup
summary: Look up a participant in the network registry before a direct call and
  before acting on one, to get the public key that checks its signature.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/registry-lookup.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/registry-lookup.mdx#when-to-call-it. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-registry-lookup
  concepts:
    - uhi.concept.verifying-signatures
  troubleshooting:
    - uhi.troubleshooting.registry-lookup
  glossary:
    - uhi.glossary.network-registry
---

# When to call the UHI network registry lookup

## In plain words

| You are | Call it before | To get |
| --- | --- | --- |
| An [EUA](/docs/uhi/v1/getting-started/glossary#eua) | Your first direct call to an [HSPA](/docs/uhi/v1/getting-started/glossary#hspa), such as `init` | The HSPA's public key, to check the signature on its direct callbacks |
| An EUA or an HSPA | Acting on any direct call you receive | The sender's public key, to check its `Authorization` header |

A call the [UHI Gateway](/docs/uhi/v1/getting-started/glossary#uhi-gateway) forwards carries the Gateway's own `X-Gateway-Authorization` header instead. Check that one against the Gateway's key. See [Signing](/docs/uhi/v1/concepts/signing#checking-a-signature-you-receive).

## What happens

Take `subscriber_id` and `pub_key_id` from the sender's `keyId`, and send the lookup. Trust the key only while `status` is `SUBSCRIBED` and the current time falls between `valid_from` and `valid_until`.

## How you know it worked

A `200` returns a record whose `subscriber_id` and `pub_key_id` match the sender's `keyId`.
