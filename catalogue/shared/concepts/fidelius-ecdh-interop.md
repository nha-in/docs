---
id: shared.concept.fidelius-ecdh-interop
type: concept
gateway: shared
milestone: n/a
version: abdm-v3
title: Fidelius ECDH interop, the curve encoding and the key derivation
summary: >
  What an implementation must match to exchange records with a peer
  built on Fidelius: Curve25519 in short Weierstrass form inside an
  X.509 key, a nonce split into salt and IV, HKDF-SHA256, and
  AES-256-GCM with the tag appended.
sources:
  - file: catalogue/annexure/integration-learnings-2026-09-16.md
    fetched: 2026-09-16
    hash: sha256:d1415609d3d71178563367bcdcc48fa7a01fe9ebd247b4c019686304868368ce
    note: >
      Section 1.8. Observed by an integrator on 2026-09-16, not yet run
      from this repository.
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      The M2 encryption pages, which name ECDH on Curve25519, AES-GCM and
      the Fidelius CLI.
related:
  glossary:
    - shared.glossary.ecdh
    - shared.glossary.key-material
  endpoints:
    - hiecm.endpoint.m3-hiu-health-information-request
    - hiecm.endpoint.m2-hip-data-flow-notify
  flows:
    - hiecm.flow.m3-fetch-records
  concepts:
    - hiecm.concept.artefact-date-range
skills:
  - hiecm-m2-build
  - hiecm-m3-build
---

# Fidelius ECDH interop, the curve encoding and the key derivation

## In plain words

Records travel between a HIP and a HIU encrypted with a key both derive
from an [ECDH](shared.glossary.ecdh) exchange on Curve25519. The
reference implementation is Fidelius. An implementation in any language
interoperates with a Fidelius peer only if it matches four things that
the scheme's name does not tell you: how the curve point is encoded,
how the public key is wrapped, how the nonce becomes a salt and an IV,
and how the shared secret becomes the AES key.

## Before you start

- Who generates what, and who keeps what. See [key material](shared.glossary.key-material).

## What happens

**The curve.** Fidelius uses Curve25519 in its short Weierstrass form,
as BouncyCastle does, not the Montgomery form that X25519 libraries
use. The scalar multiplication is the same maths, so you can run it on
your platform's X25519 and convert only the encoding. The Weierstrass
`x` coordinate is the Montgomery `u` plus `A/3 mod p`, with
`A = 486662`. The `y` coordinate is recovered from the curve equation by
a modular square root. A unit test that checks the curve constants `a`
and `b` and the generator's `x` against values derived from the
Montgomery equation catches a wrong conversion before any peer does.

**The public key.** An X.509 SubjectPublicKeyInfo carrying the OIDs
`1.2.840.10045.2.1` (EC public key) and `1.3.6.1.4.1.3029.1.5.1`
(Curve25519), whose bit string is the uncompressed point `04 || x || y`.
Peers do not all encode the SPKI the same way: some send the named
curve, some send explicit curve parameters. Both end with the same
65 byte point. **Take the trailing 65 bytes of a peer's key as the
point** and skip parsing the parameters.

**The nonce.** Each side sends a random 32 byte nonce. XOR the two.
The first 20 bytes are the HKDF salt and the last 12 bytes are the
AES-GCM IV.

**The key.** `key = HKDF-SHA256(sharedSecretX, salt, 32 bytes)`, where
`sharedSecretX` is the x coordinate of the ECDH result.

**The cipher.** AES-256-GCM with that key and IV. The authentication
tag is appended to the ciphertext, and the whole thing is base64
encoded into the push entry's `content`.

## How you know it worked

You have understood this when you can answer both of these.

1. A peer's key begins `MIIBMTCB6gYHKoZIzj0CAT`, which is longer than
   yours. What do you do with it?
2. Your decryption fails on every record from one HIP and works from
   another. Which of the four items above would you test first, and
   with what?

## When it goes wrong

Sending a raw 32 byte X25519 public key. Fidelius peers expect the
SPKI wrapper around a Weierstrass point.

Parsing a peer's SPKI parameters and rejecting the explicit form. Take
the last 65 bytes.

Using the whole XOR as the IV, or the full 32 byte shared secret in
place of its x coordinate. Both derive a different key and the tag check
fails.

Reusing a key pair or nonce across transfers. The maths does not
object; the scheme does. Generate fresh ones per transfer.
