---
id: shared.glossary.txn-id
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: txnId, transaction id
summary: >
  The identifier that ties the steps of one multi-step flow together,
  such as an OTP request and its verification.
sources:
  - file: ABDM Sandbox/ABDM/M1 ABHA Collection.postman_collection.json
    status: not-yet-hashed
    note: NHA's own M1 Postman collection, 123 requests.
verified:
  status: unverified
related:
  concepts: []
---

# txnId, transaction id

## In plain words

Most M1 flows are two or three calls. The first call returns a `txnId`,
and the following calls send it back so ABDM knows which attempt they
belong to.

It is short lived and single purpose. It is not a session and not a
token.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say what txnId is without using the acronym itself.

## When it goes wrong

Reusing a txnId after the flow completed, or across flows. Start a fresh one per attempt.

