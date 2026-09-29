---
id: uhi.sandbox.key-pair
type: sandbox
gateway: uhi
milestone: n/a
version: uhi-v1
title: Generate your UHI key pair
summary: The Header Generation Utility generates your Ed25519 key pair and later
  signs each payload. Only the public key leaves your server.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/getting-started/sandbox.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/getting-started/sandbox.mdx#2-generate-your-key-pair.
      Edit the page, never this file.
related:
  concepts:
    - uhi.concept.key-generation
    - uhi.concept.signing-headers
  sandbox:
    - uhi.sandbox.registration-form
---

# Generate your UHI key pair

## In plain words

Clone the
[Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility)
and run it. It generates your Ed25519 key pair, and later signs each payload
for you, so you do not implement Ed25519 and BLAKE-512 from scratch.

Keep the private key on your server. You share only the public key.

**You get:** a public key and a private key. See [Signing](/docs/uhi/v1/concepts/signing).
