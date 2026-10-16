---
id: uhi.concept.verifying-signatures
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Checking the signature on a UHI call you receive
summary: Check X-Gateway-Authorization against the Gateway's key on a forwarded
  call, and the sender's Authorization against its registry key on a direct
  call.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/signing.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/signing.mdx#checking-a-signature-you-receive.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.signing-headers
    - uhi.concept.registry-lookup
    - uhi.concept.direct-calls
  endpoints:
    - uhi.endpoint.network-registry-lookup
---

# Checking the signature on a UHI call you receive

## In plain words

- **A call forwarded by the Gateway**, such as the first search reaching an HSPA, carries `X-Gateway-Authorization`. Check it against the Gateway's public key.
- **A direct call**, such as the second search or any call from `init` onwards, carries the sender's `Authorization`. Look up that sender with the [network registry lookup](/docs/uhi/v1/api/network/endpoints/uhi-network-registry-lookup), then check the signature against the public key it returns.

## What happens

Pick the header by route. On a forwarded call, check `X-Gateway-Authorization`, or `Proxy-Authorization` if it is absent. On a direct call, split the sender's `keyId` into subscriber ID and key ID, look the sender up, and check `Authorization`. Check against the raw bytes you received, before you parse the body.

## How you know it worked

A call with a valid signature and an unexpired `expires` passes. The same body with one byte changed fails.

## When it goes wrong

Reject a call whose signature fails or whose `expires` has passed, and do not act on it. A lookup that returns `404` means no participant matches, so the call is not trusted.
