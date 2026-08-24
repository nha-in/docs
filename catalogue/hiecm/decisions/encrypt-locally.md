---
id: hiecm.decision.encrypt-locally
type: decision
gateway: hiecm
milestone: M1
version: abdm-v3
title: Encrypting identifiers locally rather than through a hosted helper
summary: >
  NHA ships an encryption endpoint and its collection points at third
  party encryption websites, and neither belongs in a production path.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: >
      NHA's own M1 collection, which supplies the call order for this
      flow.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.encrypted-identifiers]
  endpoints: [hiecm.endpoint.m1-encrypt-value]
---

# Encrypting identifiers locally rather than through a hosted helper

## In plain words

M1 needs Aadhaar numbers, mobile numbers and OTP values encrypted
against NHA's public key. You can do that locally, or you can call a
remote endpoint that does it for you.

Do it locally.

## Before you start

Read [why identifiers are encrypted](../concepts/encrypted-identifiers.md).

## What happens

| | Encrypt locally | Call a remote helper |
|---|---|---|
| Where the raw value goes | Your process only | Over the network, in the clear to that host |
| Dependency | NHA's public key | A live third party service |
| Suitable for production | Yes | No |
| Useful for | Everything | Trying a flow by hand once |

The default is local, and it is not a close call. Sending an Aadhaar
number to a remote service so that it can be encrypted defeats the
purpose of encrypting it.

This matters because NHA's own M1 collection contains requests pointed
at two third party encryption websites as well as at NHA's own helper.
Copying the collection into an integration copies that.

## How you know it worked

You chose correctly if the raw Aadhaar or mobile number never leaves
your process, and never reaches your logs. Grep your own logging for
the field names before you call this done.

## When it goes wrong

If you have already shipped with a remote helper, treat every value
that passed through it as disclosed, and change the flow before the
next release.

Switching is straightforward: fetch NHA's public key from the
certificate endpoint and encrypt in process. There is no migration,
only a change of where one function runs.

