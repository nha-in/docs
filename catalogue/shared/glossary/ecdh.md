---
id: shared.glossary.ecdh
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: ECDH, the key exchange that protects records in transit
summary: >
  Elliptic Curve Diffie-Hellman, used so only the requester holding
  a valid consent can read what is sent.
sources:
  - file: site/docs/_glossary/_hiecm.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# ECDH, the key exchange that protects records in transit

## In plain words

Elliptic Curve Diffie-Hellman key exchange, used so that only the
[HIU](hiu.md) that holds a valid consent can read the records a
[HIP](hip.md) sends. Both sides generate a short lived key pair and a
random 32 byte nonce, exchange the public halves, and derive the same
session key. NHA's M2 document specifies Curve25519 for the exchange and
AES-GCM for the encryption itself.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say why both sides generate a key pair rather than sharing one key.

## When it goes wrong

Reusing a key pair or a nonce across transfers. Each transfer generates
its own, and reuse defeats the point of the exchange.
