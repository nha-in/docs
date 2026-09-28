---
id: hiecm.decision.callbacks-as-webhooks
type: decision
gateway: hiecm
milestone: n/a
version: abdm-v3
title: Callbacks are described as OpenAPI webhooks in each module file
summary: Each module's OpenAPI file describes the callbacks your system receives
  under webhooks, beside the calls that cause them.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/api-specifications.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/concepts/api-specifications.mdx#callbacks-as-webhooks.
      Edit the page, never this file.
related:
  concepts:
    - hiecm.concept.asynchronous-callbacks
---

# Callbacks are described as OpenAPI webhooks in each module file

## In plain words

Many HIE-CM calls answer later, as a POST from the gateway to your registered
URL. Each module's specification describes those callbacks under `webhooks`,
the OpenAPI 3.1 section for requests your system receives, beside the calls
that cause them. One file tells you what you call, what comes back at once, and
what arrives later.

Your system serves each webhook at its path on your bridge URL. For example,
the outcome of linking a care context arrives at `/api/v3/link/on_carecontext`.
Why the answer arrives this way is on
[a 200 means accepted, not done](/docs/hiecm/v3/concepts/gateway#asynchronous-callbacks).

## What happens

Read `webhooks` alongside `paths` for every module you build. An entry under `paths` is a call your system makes. An entry under `webhooks` is an endpoint your system serves, and its request body is what the gateway posts to you.

## How you know it worked

For every call your system makes that answers 202, you can name the webhook that carries its result and the handler that serves it.

## When it goes wrong

A client generated from `paths` alone has no callback handlers, and the integration waits on answers it has no endpoint for. Read `webhooks` as well.
