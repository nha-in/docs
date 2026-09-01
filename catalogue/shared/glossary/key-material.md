---
id: shared.glossary.key-material
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Key material, who generates it and who keeps it
summary: >
  The ECDH key pairs that encrypt health records in transit. A fresh
  pair per transfer, the HIU keeps its own, and the HIP returns its
  public half alongside the data.
sources:
  - url: https://sandbox.abdm.gov.in/sandbox/v3/faq
    status: docs-only
    note: >
      NHA's sandbox FAQ, four questions on generating key pairs, storing
      them, and what the HIP sends back.
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      NHA's M2 encryption and decryption pages, which name ECDH and
      recommend the Fidelius CLI.
verified:
  status: unverified
  against: docs-only
related:
  glossary: [shared.glossary.consent-artefact, shared.glossary.hip, shared.glossary.hiu]
  concepts: [hiecm.concept.consent-artefact]
---

# Key material, who generates it and who keeps it

## In plain words

Health records are encrypted between the provider and the requester, and
neither the gateway nor the consent manager can read them. The scheme is
Elliptic curve Diffie Hellman, so both sides contribute key material and
each derives the same shared secret without ever sending it.

## Before you start

You need a consent artefact, because key material travels inside the data
request that cites one.

## What happens

The HIU generates a key pair and sends its public half, with a nonce, in
the request. The HIP derives the shared key from its own private half and
the HIU's public half, encrypts, and returns the data together with its
own public key material and its nonce. The HIU then derives the same
shared key and decrypts.

Three answers NHA gives that decide how you build this:

**A new pair every time.** Asked whether key generation is required on
every transfer, NHA answers yes. These are ephemeral keys, not an
identity, so a pair cached and reused is a defect rather than an
optimisation.

**The HIU stores its own pair.** It needs both halves to decrypt what
comes back. The window is short, between issuing the request and
decrypting the response, but the private half has to survive that window,
which matters if the two events land on different instances.

**The HIP returns its public half with the data.** NHA's phrasing is that
the HIP sends the sender public key and the receiver nonce along with the
health document. A HIU that discards the response envelope and keeps only
the payload cannot decrypt it.

NHA recommends the Fidelius CLI for the cryptography itself, with
examples for Node, Python, Ruby and PHP, rather than implementing the
curve arithmetic yourself.

## How you know it worked

A transfer succeeds with a pair generated for that transfer alone, and
your HIU can decrypt after a restart between request and response only
because it deliberately persisted the private half.

## When it goes wrong

Reusing a key pair across transfers. It appears to work, because the
maths does not object, and it is not what NHA specifies.

Losing the private half between request and response. The data arrives
and is undecryptable, which looks like an encryption bug and is a state
management one.

Confusing this with M1 encryption. The RSA encryption of Aadhaar numbers,
OTPs and passwords against NHA's public certificate is a different
mechanism for a different purpose, and shares nothing with this one but
the word encryption.
