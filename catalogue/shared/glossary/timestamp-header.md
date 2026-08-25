---
id: shared.glossary.timestamp-header
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: TIMESTAMP
summary: >
  The header carrying the current time in ISO 8601, which the gateway
  rejects if your clock has drifted.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: NHA's own M1 Postman collection, 123 requests.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2402]
---

# TIMESTAMP

## In plain words

Every ABDM call carries a `TIMESTAMP` header in ISO 8601, in IST, the
+05:30 offset, for example `2026-08-24T15:45:30.000+05:30`. The
gateway compares it against its own clock and rejects the request if the
difference is too large.

It is present on 121 of the 123 requests in NHA's own M1 collection, so
treat it as required everywhere.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what TIMESTAMP is without using the acronym itself.

## When it goes wrong

A drifted or local-time clock fails every call in the module, and the error does not mention the clock. Take the value from a synchronised source.

