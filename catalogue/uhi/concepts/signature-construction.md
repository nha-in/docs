---
id: uhi.concept.signature-construction
type: concept
gateway: uhi
milestone: n/a
version: uhi-v1
title: How a UHI request signature is built
summary: A BLAKE-512 digest of the exact body bytes, signed with Ed25519 over
  (created) (expires) digest, fresh for every request.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/uhi/v1/concepts/signing.mdx
    status: page
    note: Generated from
      site/docs/uhi/v1/concepts/signing.mdx#how-the-signature-is-built. Edit the
      page, never this file.
related:
  concepts:
    - uhi.concept.signing-headers
    - uhi.concept.key-generation
  troubleshooting:
    - uhi.troubleshooting.http-statuses
---

# How a UHI request signature is built

## In plain words

| Part | Algorithm | Covers |
| --- | --- | --- |
| Digest | BLAKE-512 | The exact bytes of the request body |
| Signature | Ed25519 | The signing string `(created) (expires) digest` |

1. Serialise the request body once, and keep those bytes.
2. Compute the BLAKE-512 digest of the bytes.
3. Set `created` to now and `expires` a few seconds later.
4. Sign `(created) (expires) digest` with your private key.
5. Send the body byte for byte as you signed it.

Changing one byte of the body after signing breaks the digest, and the call is refused with a `401`. So is a header whose `expires` has passed, which is why every request needs a new one.

## What happens

Sign the exact byte string your HTTP client sends. Do not let a client library serialise the body again after you sign it. Build a new header on every send, retries included.

## How you know it worked

The receiver answers `200` with `ACK`, not `401`.

## When it goes wrong

A `401` has three usual causes. Compare the bytes sent with the bytes hashed. Check that `expires` had not passed when the call arrived. Check that `keyId` names your subscriber ID and the key ID you registered.
