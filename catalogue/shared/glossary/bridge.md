---
id: shared.glossary.bridge
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Bridge, your callback endpoints
summary: >
  The set of callback URLs NHA posts to when it answers one of your
  calls.
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

# Bridge, your callback endpoints

## In plain words

The set of callback endpoints your system exposes to NHA's
[gateway](gateway.md); NHA stores one bridge URL for each registered
participant and posts callbacks underneath it. NHA's M3 document gives
`POST {hiuBridgeUrl}/v0.5/consents/hiu/notify` for an [HIU](hiu.md) and
`POST {hipBridgeUrl}/v0.5/health-information/hip/request` for a
[HIP](hip.md). Registering your bridge URL is part of sandbox
onboarding.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can name the one base URL NHA holds for you, and say which paths sit under it.

## When it goes wrong

Registering a bridge URL that is not reachable from the public internet.
The flow then appears to hang, because from NHA's side the callback was
sent.
