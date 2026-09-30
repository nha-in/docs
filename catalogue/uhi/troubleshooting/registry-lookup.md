---
id: uhi.troubleshooting.registry-lookup
type: troubleshooting
gateway: uhi
milestone: n/a
version: uhi-v1
title: When the UHI network registry lookup fails
summary: A 401 means your own header is wrong, a 403 means your registration is
  not active, and a 404 means no participant matches the body.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/registry-lookup.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/registry-lookup.mdx#when-it-goes-wrong. Edit the
      page, never this file.
related:
  endpoints:
    - uhi.endpoint.network-registry-lookup
  concepts:
    - uhi.concept.registry-lookup
    - uhi.concept.signature-construction
    - uhi.concept.error-object
---

# When the UHI network registry lookup fails

## In plain words

| Response | Likely cause |
| --- | --- |
| `401` | Your own header is wrong: signed over a different body, reused, expired, or with the wrong `keyId` |
| `403` | Your public key is not registered, or your registration is not yet active |
| `404` | No participant matches the body. The response carries an [error object](/docs/uhi/v1/concepts/errors) |

## What happens

A failed lookup returns a status and no subscriber record. Read the status before the body.

## When it goes wrong

On `401`, build a fresh header over the exact bytes you send, and check your `keyId`. On `403`, confirm your registration is complete and uses the public key you sign with; a retry does not help. On `404`, check that `subscriber_id` and `pub_key_id` came from the right parts of the sender's `keyId`. Log the error object, and do not trust the call you were checking.
