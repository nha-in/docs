---
id: hiecm.decision.callbacks-as-webhooks
type: decision
gateway: hiecm
milestone: n/a
version: abdm-v3
title: Describing callbacks as OpenAPI webhooks rather than as AsyncAPI
summary: >
  ABDM's asynchronous callbacks, where the real response arrives later
  as a POST to your registered URL rather than in the reply to your own
  request, are described in each module's OpenAPI file as 3.1 webhooks
  instead of a separate AsyncAPI document.
sources:
  - file: catalogue/openapi/CONVENTIONS.md
    status: not-yet-hashed
    note: This repository's own specification conventions.
verified:
  status: unverified
related:
  concepts: [hiecm.concept.asynchronous-callbacks]
---

# Describing callbacks as OpenAPI webhooks rather than as AsyncAPI

## In plain words

ABDM callbacks have to be described somewhere. There are two reasonable
places: a separate AsyncAPI document, or inside the module's own
OpenAPI file using the `webhooks` section that OpenAPI 3.1 added.

This catalogue uses `webhooks`.

## Before you start

Read [asynchronous calls and callbacks](../concepts/asynchronous-callbacks.md)
so the thing being described is clear before the format choice is.

## What happens

| | OpenAPI 3.1 `webhooks` | Separate AsyncAPI document |
|---|---|---|
| What it describes well | HTTP POSTs to a registered URL | Kafka, MQTT, WebSocket, streaming |
| Where the contract lives | One file per module, whole contract | Two files, joined by convention |
| Retrieval | One chunk per callback, with an operation id | Separate document, separate pipeline |
| Tooling | Read by any OpenAPI tool | Needs AsyncAPI aware tooling |
| Renders in Scalar | Yes | Partial |

The default is `webhooks`, and the reason is that ABDM callbacks are
plain HTTPS POSTs. That is exactly what `webhooks` describes. AsyncAPI
earns its keep for message brokers and streaming, which ABDM does not
use here.

One caveat that decided a detail: Scalar has an open defect where
webhooks disappear from the sidebar when `x-tagGroups` is present, so
this catalogue does not use `x-tagGroups`.

## How you know it worked

You chose correctly if one file answers every question about a module:
what you call, what comes back, and what arrives later. If a developer
has to open a second document to find out what the callback carries,
the split was wrong for this project.

## When it goes wrong

If ABDM ever introduces a genuine message broker or streaming
interface, `webhooks` will not describe it and AsyncAPI becomes the
right tool for that part. Switching is possible at any time, because
the callback definitions are self contained.

The cost of switching is the tooling around it, not the content: the
docs site, the retrieval index and any generated skills all read the
module file today.

