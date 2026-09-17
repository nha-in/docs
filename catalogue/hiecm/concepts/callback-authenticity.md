---
id: hiecm.concept.callback-authenticity
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Proving a callback really came from ABDM
summary: >
  Your callback URL is a public address on the internet, so anything can
  post to it. ABDM signs the callbacks it sends and publishes the public
  keys that verify those signatures, which is how you tell a real request
  for a patient's records from a forged one.
sources:
  - file: catalogue/openapi/hiecm/v3/hiecm-gateway.yaml
    status: in-repo
    note: >
      Declares GET /api/hiecm/gateway/v3/certs as the JSON Web Key Set used
      to verify JWT signatures in gateway callbacks, and the OIDC discovery
      document that names the jwks_uri.
related:
  concepts:
    - hiecm.concept.asynchronous-callbacks
    - hiecm.concept.gateway-session
    - hiecm.concept.consent-artefact
  endpoints:
    - hiecm.endpoint.gateway-get-gateway-certs
    - hiecm.endpoint.gateway-get-oidc-config
  troubleshooting:
    - hiecm.troubleshooting.callback-never-arrives
skills:
  - hiecm-m2-build
  - hiecm-m3-build
  - hiecm-m2-debug
  - hiecm-m3-debug
---

# Proving a callback really came from ABDM

## In plain words

To receive callbacks you register a URL that ABDM can reach. Reachable by
ABDM means reachable by everyone, because it is an ordinary address on the
public internet. Nothing about receiving a POST at that URL tells you the
POST came from ABDM.

This matters more here than in most integrations. The callbacks you host
carry instructions about a named person's health records: a request to
discover what you hold, a consent artefact saying somebody agreed, an
instruction to transfer records to a given address. A system that acts on
whatever arrives will act on whatever an attacker sends.

ABDM signs the callbacks it sends. The gateway publishes its public keys as
a JSON Web Key Set, usually shortened to JWKS. You fetch those keys, and you
use them to check the signature on every callback before your handler does
any work.

This is separate from the signature you may already have met inside a
[consent artefact](hiecm.concept.consent-artefact). That one signs the artefact's
contents, so it travels with the artefact and proves the artefact was not
altered. The one on this page signs the delivery, and proves who sent it.
Verifying one does not verify the other.

## Before you start

- A callback URL registered with ABDM. See
  [the callback URL](shared.sandbox.callback-url).
- An understanding of why a 200 is not an answer, on
  [asynchronous calls and callbacks](hiecm.concept.asynchronous-callbacks).

You do not need an access token for this one. The certificates endpoint
declares no security in the specification, which is what you would expect of
an endpoint whose whole job is publishing public keys.

## What happens

Fetch the key set from the gateway. The response is a standard JWKS, so any
JWT library in your language can consume it directly.

```bash
curl --request GET \
  --url https://dev.abdm.gov.in/api/hiecm/gateway/v3/certs \
  --header 'REQUEST-ID: <REQUEST_ID>' \
  --header 'TIMESTAMP: <TIMESTAMP>'
```

Each key in the set carries a `kid` that identifies it, `kty: RSA`, `use:
sig`, and an `alg` the specification gives as `RS256`. The `n` and `e`
fields are the RSA modulus and exponent, Base64URL encoded. Some keys also
carry `x5c`, a certificate chain.

The same key set is discoverable through the OIDC document at
`/api/hiecm/gateway/v3/.well-known/openid-configuration`, which names it in
`jwks_uri`. Reading the discovery document first is the more durable choice,
because it survives the key set moving.

Cache the keys rather than fetching them per callback, and key your cache by
`kid`. When a callback presents a `kid` you have not seen, refetch once
before rejecting it, because that is what key rotation looks like from your
side.

Verification is then the ordinary JWT check your library already does:
signature against the key named by `kid`, algorithm pinned to `RS256`, and
the expiry and issuer claims if the token carries them.

```observation schema=exit-condition
channel: response
path: /api/hiecm/gateway/v3/certs
match:
  status: 200
  body_contains: keys
timeout_seconds: 30
```

### What this catalogue cannot yet tell you

The gateway specification says the key set exists and says what it is for.
It does not say which header carries the signed token on an inbound
callback, and none of the webhook definitions in the M2 or M3 specifications
declare a header or a security scheme at all. So the transport is documented
and the field that carries it is not.

Two things follow. Confirm the header name against the sandbox before you
write the lookup, by logging the full header set of the first real callback
you receive. And treat this page as unverified until somebody has done that,
which is what its status says.

Pin the algorithm to `RS256` when you verify, and reject `none`. A verifier
that accepts whatever algorithm the token names accepts a token an attacker
signed, and that is a defect in the verifier rather than in ABDM.

## How you know it worked

You can fetch the certificates endpoint and get back a `keys` array whose
entries carry `kid`, `kty: RSA` and `use: sig`.

Then, on your own handler, both of these hold:

1. A callback carrying a valid signature is processed, and the `REQUEST-ID`
   matches a request you sent.
2. The same callback body, replayed with the signature altered by one
   character, is rejected before your handler reads the payload, and the
   rejection is logged.

The second is the one worth writing a test for. It is the only one that
fails loudly when verification is silently skipped.

## When it goes wrong

The `kid` is not in your cache. That is key rotation. Refetch the key set
once, then reject if it is still absent, rather than refetching on every
callback and handing an attacker a way to make you call the gateway.

You cannot find a token on the request. The header is not declared in any
specification here, so log every header of a real callback and read what
actually arrives. Do not fall back to processing unverified requests while
you work it out.

Verification is skipped under load. A handler that verifies inside a
try block and continues on failure is worse than one that never verified,
because it reads as safe. Fail closed.

Nothing arrives at all, which is a different problem. See
[the callback never arrives](hiecm.troubleshooting.callback-never-arrives).
