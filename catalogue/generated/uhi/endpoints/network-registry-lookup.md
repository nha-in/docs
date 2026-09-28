---
id: uhi.endpoint.network-registry-lookup
type: endpoint
gateway: uhi
milestone: n/a
version: uhi-v1
title: Look up a network participant
summary: An EUA or HSPA fetches another participant's public key and details
  from the network registry, to check its signature on a direct call.
generated: true
operation: uhi_network_registry_lookup
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_notes/uhi/uhi_network_registry_lookup.mdx
    status: page
    note: Generated from
      site/docs/_notes/uhi/uhi_network_registry_lookup.mdx#network-registry-lookup.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.registry-lookup
    - uhi.concept.verifying-signatures
    - uhi.concept.signing-headers
    - uhi.concept.direct-calls
---

# Look up a network participant

## In plain words

An [EUA](/docs/uhi/v1/getting-started/glossary#eua) or an [HSPA](/docs/uhi/v1/getting-started/glossary#hspa) calls the [network registry](/docs/uhi/v1/getting-started/glossary#network-registry) to fetch another participant's public key and details. Call it before your first direct call to a participant, and before you act on a direct call you receive. Name the participant in the body, taking `subscriber_id` and `pub_key_id` from the sender's `keyId`. A `keyId` has the form `<subscriber-id>|<pub-key-id>|ed25519`. See [Registry lookup](/docs/uhi/v1/concepts/registry-lookup).

Sign the request with your own fresh `Authorization` header. See [Signing](/docs/uhi/v1/concepts/signing).

## Before you start

Your own key pair registered and active, so the registry accepts your signature.

## What happens

The registry checks your signature and returns the participant's subscriber record. Use its key to check the sender's `Authorization` header. A call the Gateway forwards carries `X-Gateway-Authorization` instead: check that one against the Gateway's key.

## How you know it worked

A 200 carrying the participant's `subscriber_id`, `pub_key_id`, `status` and `valid_from` to `valid_until`.

## When it goes wrong

A 401 means your own header is wrong: signed over a different body, reused, expired, or with the wrong `keyId`. A 403 means your public key is not registered or your registration is not yet active. A 404 means no participant matches the body.
