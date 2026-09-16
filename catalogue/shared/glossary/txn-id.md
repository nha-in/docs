---
id: shared.glossary.txn-id
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: txnId, the transaction id
summary: >
  The identifier ABDM returns when a multi step exchange begins, sent
  back on every later call in that exchange.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/abha/M1 ABHA Swagger 1.yaml
    fetched: 2026-09-16
    hash: sha256:867de34795761ba4d6bc29ad5ee2cd089200786daa3d089afc94968a0bd01308
verified:
  status: unverified
related: {}
---

# txnId, the transaction id

## In plain words

`txnId` is a body field, not a header. The specification describes it as:

> The transaction ID associated with the OTP request.

An OTP on its own proves nothing, so the transaction id is what says which
request the code answers.

## Before you start

You need the response of the call that opened the exchange, because the
transaction id comes back from ABDM rather than being chosen by you.

## What happens

`m1_post_v3_enrollment_request_otp` returns a transaction id, and the verify
call that follows sends the same value back alongside the encrypted OTP.

## How you know it worked

You have understood this when you can say which call issues a transaction id
and which calls must echo it.

## When it goes wrong

Starting a second exchange and sending the older transaction id, which pairs
a code with a request it does not belong to.
