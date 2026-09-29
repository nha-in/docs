---
id: shared.glossary.gateway
type: glossary
gateway: shared
milestone: n/a
version: abdm-v3
title: Gateway, the routing layer between participants
summary: >
  The component that routes calls between participants so they never
  call each other directly. It is not the consent manager, and no
  health record passes through it.
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/_glossary/_shared.mdx
    status: reference
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      NHA's PHR Framework page, which calls the gateway the hub that
      mediates and connects HIE-CMs, health repositories and HIUs.
  - url: https://github.com/nha-in/docs/blob/main/catalogue/uhi/openapi/.raw/nha-2026-09-28-uhi/UHI%20Documentation%20Requirements.md
    status: docs-only
    note: >
      UHI developer guide as of 22 September 2026, sections 1.1 and 1.2.
related:
  glossary: [hiecm.glossary.bridge, shared.glossary.uhi]
---

# Gateway, the routing layer between participants

## In plain words

NHA's routing layer: you do not call another participant directly, you
call the gateway, it forwards your request, and the reply arrives at
your [bridge](bridge.md) as a separate inbound call. You get a session
token first, by posting your client id and client secret to
`/api/hiecm/gateway/v3/sessions`. The sandbox host for that path is
`https://dev.abdm.gov.in`. Take the
host from your onboarding documentation and keep it in configuration.

NHA's own description is the hub that mediates and connects consent
managers, health repositories and requesters, and whose job is discovery
and routing.

## Before you start

Nothing. A glossary entry assumes no prior reading.

## What happens

The gateway is not the [consent manager](hie-cm.md). The two are
separate components and the distinction decides where a call goes:

| | Gateway | HIE-CM |
|---|---|---|
| What it is | The hub of the network | One participant on it |
| How many | One | One today, several by design |
| Identified by | The host you call | A domain, the part after the `@` |
| Holds consents | No | Yes |
| Holds records | No | No |

Health records do not pass through the gateway. When a provider hands
data to a requester it pushes it straight to the requester's own URL,
and the gateway is told only that the transfer happened.

On [UHI](uhi.md) the gateway is the UHI Gateway, and it routes discovery
only. It authenticates each `search`, broadcasts it to every
[HSPA](hspa.md) registered for the `context.domain`, and relays each
`on_search` to the [EUA](eua.md)'s `consumer_uri`. From `init` onwards
the EUA and the HSPA call each other directly, and the UHI Gateway never
sees those calls. A Physical Consultation HSPA sends it an exact audit
copy of `on_confirm`, `on_status`, `on_update` and `on_cancel` instead.
Its sandbox host is `https://uhigatewaysandbox.abdm.gov.in`. See
[Routes](/docs/uhi/v1/concepts/routes).

## How you know it worked

You have understood this when you can say why two participants never hold each other's addresses, and which of the gateway or the consent manager a given header addresses.

## When it goes wrong

Expecting a synchronous answer. The gateway acknowledges your call and
the real answer arrives later at your bridge.

Sending a UHI booking call to the UHI Gateway. Only `search` and
`on_search` go through it. Send `init` and every later call to the other
party's `provider_uri` or `consumer_uri`.

Reading "the gateway" in NHA material as a synonym for the consent
manager. Some of NHA's own pages blur them. When a document says gateway
and means routing, it is the hub. When it says gateway and means
consent, it means the HIE-CM.
