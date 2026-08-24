---
id: shared.glossary.request-id
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: REQUEST-ID
summary: >
  A fresh UUID you generate per request, which correlates a call with
  its callback and with a support ticket.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: NHA's own M1 Postman collection, 123 requests.
verified:
  status: unverified
related:
  errors: [hiecm.error.abdm-2404]
---

# REQUEST-ID

## In plain words

Every ABDM call carries a `REQUEST-ID` header holding a UUID you
generate. In the asynchronous parts of M2 and M3, the callback that
answers your call carries the same value, so this is how you match a
reply to the request that caused it.

Store it before you send, not after.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what REQUEST-ID is without using the acronym itself.

## When it goes wrong

Reusing one value across requests. That makes correlation impossible and makes a support ticket unanswerable.

