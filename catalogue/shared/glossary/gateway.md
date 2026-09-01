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
  - file: site/docs/_glossary/_shared.mdx
    status: not-yet-hashed
    note: >
      This portal's own published glossary, where the definition was
      written first. Moved here so it can be retrieved, not rewritten.
  - url: https://sandbox.abdm.gov.in/sandbox/v3/new-documentation
    status: docs-only
    note: >
      NHA's PHR Framework page, which calls the gateway the hub that
      mediates and connects HIE-CMs, health repositories and HIUs.
verified:
  status: unverified
  against: docs-only
related:
  concepts: [hiecm.concept.gateway-session, hiecm.concept.asynchronous-callbacks]
  glossary: [shared.glossary.hie-cm, shared.glossary.bridge]
---

# Gateway, the routing layer between participants

## In plain words

NHA's routing layer: you do not call another participant directly, you
call the gateway, it forwards your request, and the reply arrives at
your [bridge](bridge.md) as a separate inbound call. You get a session
token first, by posting your client id and client secret to
`/api/hiecm/gateway/v3/sessions`. Two sandbox hosts serve that path,
`https://apissbx.abdm.gov.in` and `https://dev.abdm.gov.in`. Take the
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

## How you know it worked

You have understood this when you can say why two participants never hold each other's addresses, and which of the gateway or the consent manager a given header addresses.

## When it goes wrong

Expecting a synchronous answer. The gateway acknowledges your call and
the real answer arrives later at your bridge.

Reading "the gateway" in NHA material as a synonym for the consent
manager. Some of NHA's own pages blur them. When a document says gateway
and means routing, it is the hub. When it says gateway and means
consent, it means the HIE-CM.
