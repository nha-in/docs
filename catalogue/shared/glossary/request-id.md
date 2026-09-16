---
id: shared.glossary.request-id
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: REQUEST-ID, the request correlation header
summary: >
  A UUID you generate for one request, carried in the REQUEST-ID header
  so the call and everything that follows from it can be traced.
sources:
  - file: catalogue/openapi/.raw/nha-2026-09-16/hiecm/gateway.yaml
    fetched: 2026-09-16
    hash: sha256:e7ca9d3e54d6e6c864f3f1ef7b2422a322c38f6ef0bf64e421c57960b8851dc7
verified:
  status: unverified
related: {}
---

# REQUEST-ID, the request correlation header

## In plain words

`REQUEST-ID` is a required header on ABDM HIE-CM calls. The specification
describes it as:

> Unique UUID for track the end to end request transaction

So you generate a fresh UUID for each request, send it in this header, and
keep it: it is the value that ties one call to the responses and callbacks
that follow from it.

## Before you start

You need nothing beyond a UUID generator, because the value is yours to
create rather than one ABDM hands you.

## What happens

Every HIE-CM operation takes this header, starting with
`gateway_post_gateway_v3_sessions`, the call that issues your access token.

## How you know it worked

You have understood this when you can say why a REQUEST-ID must be fresh on
every call rather than reused across a flow.

## When it goes wrong

Reusing one UUID across several requests, which leaves you unable to tell
which call a later response or callback belongs to.
