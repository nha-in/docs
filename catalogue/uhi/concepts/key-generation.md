---
id: uhi.concept.key-generation
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: Generating UHI signing keys and headers
summary: The Header Generation Utility creates your Ed25519 key pair and signs
  each payload; share only the public key and keep the private key on your
  server.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/signing.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/signing.mdx#generate-your-keys-and-headers. Edit
      the page, never this file.
related:
  concepts:
    - uhi.concept.signature-construction
---

# Generating UHI signing keys and headers

## In plain words

Use the [Header Generation Utility](https://github.com/NHA-ABDM/UHI/tree/main/header_generator_utility). It generates your Ed25519 key pair and signs each payload, so you do not implement Ed25519 and BLAKE-512 yourself.

- Share only the public key, at [sandbox registration](/docs/uhi/v1/getting-started/sandbox#3-submit-the-sandbox-registration-form). Keep the private key on your server.
- The signing code the Gateway runs is [Crypt.java](https://github.com/NHA-ABDM/UHI/blob/sandbox/src/gateway/Discovery/src/main/java/in/gov/abdm/uhi/discovery/security/Crypt.java). The [UHI header signing document](https://github.com/NHA-ABDM/UHI/blob/main/docs/Signing%20UHI%20APIs_Final%20(1).docx) describes the scheme in full.

## What happens

Generate the key pair once with the Header Generation Utility. Submit the public key at sandbox registration. Keep the private key in server-side secret storage, never in a mobile or browser build, a repository or a log.
