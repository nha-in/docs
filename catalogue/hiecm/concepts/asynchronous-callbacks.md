---
id: hiecm.concept.asynchronous-callbacks
type: concept
gateway: hiecm
milestone: M2
version: abdm-v3
title: Asynchronous calls and callbacks, why a 200 means very little
summary: Most HIE-CM calls answer 202 at once and deliver the real answer later
  as a callback to your registered URL, matched by request id.
generated: true
sources:
  - url: https://github.com/nha-in/docs/blob/main/site/docs/hiecm/v3/concepts/gateway.mdx
    status: page
    note: Generated from
      site/docs/hiecm/v3/concepts/gateway.mdx#asynchronous-callbacks. Edit the
      page, never this file.
related:
  glossary:
    - shared.glossary.request-id
  decisions:
    - hiecm.decision.callbacks-as-webhooks
---

# Asynchronous calls and callbacks, why a 200 means very little

## In plain words

Nothing goes participant to participant. Every request is addressed to the gateway, which forwards it. Two things follow.

- **You get an acknowledgement, not an answer.** In the [M3](/docs/hiecm/v3/getting-started/glossary#m3) consent flow the [HIU](/docs/hiecm/v3/getting-started/glossary#hiu) asks, the HIE-CM returns the consent request id on a callback, and the patient's decision comes back later. Each call's page in the [API reference](/docs/hiecm/v3/api) names the callback it produces.
- **You have to be reachable.** Half of [M2](/docs/hiecm/v3/getting-started/glossary#m2) is endpoints the gateway calls on your system.

One exception. In the health information flow the HIU supplies a data push URL, and the HIP encrypts the records and pushes them there. That URL may differ from the HIU's registered gateway URL, to improve privacy. The permission came through the gateway. The bytes do not.

Match each callback to the call that caused it by `response.requestId`, which carries the `REQUEST-ID` you sent. Callbacks do not arrive in the order you sent the requests, and the same one can arrive twice, so a repeat must change nothing. Each callback is described in [the API reference](/docs/hiecm/v3/api).

## Before you start

A callback URL registered for your bridge and reachable over public HTTPS. Without it, no answer can arrive.

## What happens

Send the call with a fresh `REQUEST-ID`, treat the 202 as receipt only, and wait for the callback. Key the handler on `response.requestId`, answer it quickly, and make a second delivery of the same request id a no-op.

## How you know it worked

A callback reaches your URL whose `response.requestId` equals the `REQUEST-ID` you sent. Given three calls and two callbacks, the call whose request id has no callback is the one outstanding.

## When it goes wrong

Nothing arrives: work through [the callback never arrives](/docs/hiecm/v3/troubleshooting/callback-never-arrives). A retry is appended as a new event: key on the request id. The code waits on the response body for the result: it never comes there, so the integration hangs.
