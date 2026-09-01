---
id: shared.glossary.gateway
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Gateway, the routing layer between participants
summary: >
  The component that routes calls between participants so they never
  call each other directly.
sources:
  - file: site/docs/_glossary/_shared.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
verified:
  status: unverified
related:
  concepts: []
---

# Gateway, the routing layer between participants

## In plain words

NHA's routing layer: you do not call another participant directly, you
call the gateway, it forwards your request, and the reply arrives at
your [bridge](/docs/hiecm/v3/getting-started/glossary#bridge) as a
separate inbound call. You get a session token first, by posting your
client id and client secret to `/api/hiecm/gateway/v3/sessions`. Two
sandbox hosts serve that path, `https://apissbx.abdm.gov.in` and
`https://dev.abdm.gov.in`. Take the host from your onboarding
documentation and keep it in configuration; see [Choose your
gateway](/docs/hiecm/v3).

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

Nothing happens here. This entry defines a term, it does not describe a call.

## How you know it worked

You have understood this when you can say why two participants never hold each other's addresses.

## When it goes wrong

Expecting a synchronous answer. The gateway acknowledges your call and
the real answer arrives later at your bridge.
